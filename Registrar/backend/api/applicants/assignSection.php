<?php
// Disable all error output to prevent HTML in JSON response
error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

try {
    require_once __DIR__ . '/../../config/db.php';
    require_once __DIR__ . '/../../config/mailer.php';

    $db = new Database();
    $conn = $db->getConnection();

    // Get raw input
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    // Validate input
    if (!isset($data['applicantId']) || !isset($data['sectionId'])) {
        throw new Exception("Missing required fields: applicantId or sectionId");
    }

    $ApplicationID = intval($data['applicantId']);
    $SectionID = intval($data['sectionId']); 

    // Start transaction
    $conn->beginTransaction();

    // 1. Get application details
    $appQuery = $conn->prepare("
        SELECT 
            a.*,
            sy.SchoolYearID,
            s.GradeLevelID,
            COALESCE(a.StudentFirstName, p.FirstName) as FirstName,
            COALESCE(a.StudentLastName, p.LastName) as LastName,
            COALESCE(a.StudentMiddleName, p.MiddleName) as MiddleName,
            COALESCE(a.DateOfBirth, '') as BirthDate,
            COALESCE(a.Gender, '') as StudentGender,
            COALESCE(a.ContactNumber, '') as Phone,
            COALESCE(a.Address, '') as StudentAddress,
            COALESCE(a.GuardianFirstName, '') as GuardianFirst,
            COALESCE(a.GuardianLastName, '') as GuardianLast,
            COALESCE(a.GuardianRelationship, 'Guardian') as Relationship,
            COALESCE(a.GuardianContact, '') as GuardianPhone,
            COALESCE(a.GuardianEmail, '') as GuardianMail,
            COALESCE(a.EmailAddress, '') as StudentMail,
            g.LevelName as GradeLevel
        FROM application a
        LEFT JOIN section s ON s.SectionID = ?
        LEFT JOIN schoolyear sy ON sy.IsActive = 1
        LEFT JOIN profile p ON a.ApplicantProfileID = p.ProfileID
        LEFT JOIN gradelevel g ON s.GradeLevelID = g.GradeLevelID
        WHERE a.ApplicationID = ?
    ");
    $appQuery->execute([$SectionID, $ApplicationID]);
    $application = $appQuery->fetch(PDO::FETCH_ASSOC);

    if (!$application) {
        throw new Exception("Application not found");
    }

    if ($application['ApplicationStatus'] === 'Enrolled') {
        throw new Exception("Student is already enrolled");
    }

    if (empty($application['FirstName']) || empty($application['LastName'])) {
        throw new Exception("Student name is required");
    }

    // Check section capacity
    $sectionQuery = $conn->prepare("
        SELECT CurrentEnrollment, MaxCapacity, SectionName
        FROM section 
        WHERE SectionID = ?
    ");
    $sectionQuery->execute([$SectionID]);
    $section = $sectionQuery->fetch(PDO::FETCH_ASSOC);

    if (!$section) {
        throw new Exception("Section does not exist");
    }

    if ($section['CurrentEnrollment'] >= $section['MaxCapacity']) {
        throw new Exception("Section is full");
    }

    // Generate Student Number
    $currentYear = date('Y');
    $lastStudentQuery = $conn->prepare("
        SELECT StudentNumber 
        FROM studentprofile 
        WHERE StudentNumber LIKE CONCAT('GCA-', ?, '-%')
        ORDER BY StudentNumber DESC 
        LIMIT 1
    ");
    $lastStudentQuery->execute([$currentYear]);
    $lastStudent = $lastStudentQuery->fetch(PDO::FETCH_ASSOC);

    if ($lastStudent) {
        preg_match('/GCA-\d{4}-(\d+)/', $lastStudent['StudentNumber'], $matches);
        $lastNumber = intval($matches[1]);
        $newNumber = str_pad($lastNumber + 1, 5, '0', STR_PAD_LEFT);
    } else {
        $newNumber = '00001';
    }
    
    $studentNumber = "GCA-{$currentYear}-{$newNumber}";

    // Generate email
    $firstName = strtolower(preg_replace('/[^a-zA-Z]/', '', $application['FirstName']));
    $lastName = strtolower(preg_replace('/[^a-zA-Z]/', '', $application['LastName']));
    $emailAddress = "{$firstName}.{$lastName}@student.gca.edu.ph";
    
    $emailCheckQuery = $conn->prepare("SELECT UserID FROM user WHERE EmailAddress = ?");
    $emailCheckQuery->execute([$emailAddress]);
    if ($emailCheckQuery->fetch()) {
        $emailAddress = "{$firstName}.{$lastName}{$newNumber}@student.gca.edu.ph";
    }

    // Create User account
    $insertUser = $conn->prepare("
        INSERT INTO user (EmailAddress, UserType, AccountStatus, CreatedAt)
        VALUES (?, 'Student', 'Active', NOW())
    ");
    $insertUser->execute([$emailAddress]);
    $UserID = $conn->lastInsertId();

    // Create Profile
    $insertProfile = $conn->prepare("
        INSERT INTO profile (UserID, FirstName, LastName, MiddleName, EncryptedPhoneNumber, EncryptedAddress)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $insertProfile->execute([
        $UserID,
        $application['FirstName'],
        $application['LastName'],
        $application['MiddleName'] ?? null,
        $application['Phone'] ?? null,
        $application['StudentAddress'] ?? null
    ]);
    $ProfileID = $conn->lastInsertId();

    // Create Student Profile
    $qrCodeID = "QR-{$studentNumber}";
    $insertStudentProfile = $conn->prepare("
        INSERT INTO studentprofile (
            ProfileID, StudentNumber, DateOfBirth, Gender, 
            Nationality, StudentStatus, QRCodeID
        ) VALUES (?, ?, ?, ?, 'Filipino', 'Enrolled', ?)
    ");
    $insertStudentProfile->execute([
        $ProfileID,
        $studentNumber,
        $application['BirthDate'] ?: null,
        $application['StudentGender'] ?: null,
        $qrCodeID
    ]);
    $StudentProfileID = $conn->lastInsertId();

    // Create default password
    $defaultPassword = str_replace(['-', 'GCA'], '', $studentNumber);
    $passwordHash = password_hash($defaultPassword, PASSWORD_BCRYPT);
    
    $insertPassword = $conn->prepare("
        INSERT INTO passwordpolicy (UserID, PasswordHash, MustChange)
        VALUES (?, ?, 1)
    ");
    $insertPassword->execute([$UserID, $passwordHash]);

    // Create Guardian records
    if (!empty($application['GuardianFirst']) || !empty($application['GuardianLast'])) {
        $guardianFullName = trim($application['GuardianFirst'] . ' ' . $application['GuardianLast']) ?: 'Guardian';
        
        $insertGuardian = $conn->prepare("
            INSERT INTO guardian (FullName, EncryptedPhoneNumber, EncryptedEmailAddress)
            VALUES (?, ?, ?)
        ");
        $insertGuardian->execute([
            $guardianFullName,
            $application['GuardianPhone'] ?: null,
            $application['GuardianMail'] ?: null
        ]);
        $GuardianID = $conn->lastInsertId();

        $relationshipType = ucfirst(strtolower($application['Relationship']));
        if (!in_array($relationshipType, ['Father', 'Mother', 'Guardian', 'Sibling', 'Other'])) {
            $relationshipType = 'Guardian';
        }

        $insertStudentGuardian = $conn->prepare("
            INSERT INTO studentguardian (
                StudentProfileID, GuardianID, RelationshipType, 
                IsPrimaryContact, IsEmergencyContact, IsAuthorizedPickup
            ) VALUES (?, ?, ?, 1, 1, 1)
        ");
        $insertStudentGuardian->execute([$StudentProfileID, $GuardianID, $relationshipType]);
    }

    // Create Enrollment record
    $insertEnrollment = $conn->prepare("
        INSERT INTO enrollment (StudentProfileID, SectionID, SchoolYearID, EnrollmentDate)
        VALUES (?, ?, ?, CURDATE())
    ");
    $insertEnrollment->execute([$StudentProfileID, $SectionID, $application['SchoolYearID']]);
    $EnrollmentID = $conn->lastInsertId();

    // Create Medical Info placeholder
    $insertMedicalInfo = $conn->prepare("INSERT INTO medicalinfo (StudentProfileID) VALUES (?)");
    $insertMedicalInfo->execute([$StudentProfileID]);

    // Create Emergency Contact
    if (!empty($application['GuardianPhone'])) {
        $emergencyPerson = $guardianFullName ?? 'Emergency Contact';
        $insertEmergencyContact = $conn->prepare("
            INSERT INTO emergencycontact (StudentProfileID, ContactPerson, EncryptedContactNumber)
            VALUES (?, ?, ?)
        ");
        $insertEmergencyContact->execute([$StudentProfileID, $emergencyPerson, $application['GuardianPhone']]);
    }

    // Update Application status
    $updateApplication = $conn->prepare("
        UPDATE application 
        SET ApplicationStatus = 'Enrolled'
        WHERE ApplicationID = ?
    ");
    $updateApplication->execute([$ApplicationID]);

    // Increment Section enrollment
    $updateSection = $conn->prepare("
        UPDATE section SET CurrentEnrollment = CurrentEnrollment + 1 
        WHERE SectionID = ?
    ");
    $updateSection->execute([$SectionID]);

    // Create Attendance Summary
    $insertAttendanceSummary = $conn->prepare("
        INSERT INTO attendancesummary (StudentProfileID, SchoolYearID, TotalDaysPresent, TotalSchoolDays)
        VALUES (?, ?, 0, 0)
    ");
    $insertAttendanceSummary->execute([$StudentProfileID, $application['SchoolYearID']]);

    // Auto-assign subjects
    $getSubjectsQuery = $conn->prepare("
        SELECT SubjectID, SubjectName, SubjectCode
        FROM subject
        WHERE GradeLevelID = ? AND IsActive = 1
        ORDER BY SubjectID
    ");
    $getSubjectsQuery->execute([$application['GradeLevelID']]);
    $subjects = $getSubjectsQuery->fetchAll(PDO::FETCH_ASSOC);

    $assignedSubjects = [];
    if (count($subjects) > 0) {
        $insertGrade = $conn->prepare("
            INSERT INTO grade (EnrollmentID, SubjectID, Quarter, GradeValue, Remarks, GradeStatusID, LastModified, ModifiedByUserID)
            VALUES (?, ?, ?, NULL, NULL, NULL, NOW(), NULL)
        ");

        $quarters = ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'];
        
        foreach ($subjects as $subject) {
            foreach ($quarters as $quarter) {
                $insertGrade->execute([$EnrollmentID, $subject['SubjectID'], $quarter]);
            }
            $assignedSubjects[] = $subject['SubjectName'];
        }
    }

    $conn->commit();

    // ===== SEND ENROLLMENT CONFIRMATION EMAIL =====
    try {
        $mailer = new Mailer();
        $enrollmentData = [
            'studentName' => trim($application['FirstName'] . ' ' . $application['LastName']),
            'guardianName' => trim($application['GuardianFirst'] . ' ' . $application['GuardianLast']),
            'studentNumber' => $studentNumber,
            'emailAddress' => $emailAddress,
            'defaultPassword' => $defaultPassword,
            'gradeLevel' => $application['GradeLevel'],
            'sectionName' => $section['SectionName'],
            'assignedSubjects' => $assignedSubjects,
            'studentEmail' => !empty($application['StudentMail']) ? $application['StudentMail'] : null
        ];

        $emailSent = $mailer->sendEnrollmentConfirmation($application['GuardianMail'], $enrollmentData);
    } catch (Exception $emailError) {
        // Log email error but don't fail the enrollment
        error_log("Enrollment email error: " . $emailError->getMessage());
        $emailSent = false;
    }

    // Return success response
    echo json_encode([
        "success" => true,
        "message" => "Student enrolled successfully",
        "emailSent" => $emailSent,
        "data" => [
            "studentNumber" => $studentNumber,
            "emailAddress" => $emailAddress,
            "defaultPassword" => $defaultPassword,
            "studentProfileID" => $StudentProfileID,
            "enrollmentID" => $EnrollmentID,
            "sectionName" => $section['SectionName'],
            "assignedSubjects" => $assignedSubjects,
            "totalSubjects" => count($assignedSubjects)
        ]
    ]);

} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>