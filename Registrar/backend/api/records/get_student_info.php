<?php
// C:\xampp\htdocs\SMS-GCA-3H\Registrar\backend\api\records\get_student_info.php

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/debug.log');

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header('Content-Type: application/json; charset=UTF-8');

try {
    $database = new Database();
    $conn = $database->getConnection();

    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    $studentNumber = isset($_GET['student_id']) ? trim($_GET['student_id']) : null;

    if (empty($studentNumber)) {
        throw new Exception("Student ID is required");
    }

    // Main query to get comprehensive student information
    $query = "
        SELECT 
            -- User & Profile Info
            u.UserID,
            u.EmailAddress,
            u.AccountStatus,
            p.ProfileID,
            p.FirstName,
            p.MiddleName,
            p.LastName,
            p.Gender AS ProfileGender,
            p.BirthDate AS ProfileBirthDate,
            p.Age AS ProfileAge,
            p.Religion,
            p.MotherTongue,
            p.EncryptedPhoneNumber,
            p.EncryptedAddress,
            p.ProfilePictureURL,
            
            -- Student Profile Info
            sp.StudentProfileID,
            sp.StudentNumber,
            sp.QRCodeID,
            sp.DateOfBirth,
            sp.Gender AS StudentGender,
            sp.Nationality,
            sp.StudentStatus,
            
            -- Current Enrollment Info
            e.EnrollmentID,
            e.EnrollmentDate,
            e.OutstandingBalance,
            
            -- Section & Grade Level
            sec.SectionID,
            sec.SectionName,
            gl.GradeLevelID,
            gl.LevelName AS GradeLevel,
            
            -- School Year
            sy.SchoolYearID,
            sy.YearName AS SchoolYear,
            sy.IsActive AS IsActiveSchoolYear,
            
            -- Adviser Info
            tp.TeacherProfileID AS AdviserID,
            adv_prof.FirstName AS AdviserFirstName,
            adv_prof.LastName AS AdviserLastName,
            
            -- Medical Info
            mi.Weight,
            mi.Height,
            mi.EncryptedAllergies,
            mi.EncryptedMedicalConditions,
            mi.EncryptedMedications,
            
            -- Emergency Contact
            ec.ContactPerson AS EmergencyContactPerson,
            ec.EncryptedContactNumber AS EmergencyContactNumber,
            
            -- Attendance Summary
            ats.TotalDaysPresent,
            ats.TotalSchoolDays,
            ats.AttendancePercentage
            
        FROM studentprofile sp
        LEFT JOIN profile p ON sp.ProfileID = p.ProfileID
        LEFT JOIN user u ON p.UserID = u.UserID
        LEFT JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID 
            AND e.EnrollmentID = (
                SELECT MAX(EnrollmentID) 
                FROM enrollment 
                WHERE StudentProfileID = sp.StudentProfileID
            )
        LEFT JOIN section sec ON e.SectionID = sec.SectionID
        LEFT JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
        LEFT JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
        LEFT JOIN teacherprofile tp ON sec.AdviserTeacherID = tp.TeacherProfileID
        LEFT JOIN profile adv_prof ON tp.ProfileID = adv_prof.ProfileID
        LEFT JOIN medicalinfo mi ON sp.StudentProfileID = mi.StudentProfileID
        LEFT JOIN emergencycontact ec ON sp.StudentProfileID = ec.StudentProfileID
        LEFT JOIN attendancesummary ats ON sp.StudentProfileID = ats.StudentProfileID 
            AND ats.SchoolYearID = e.SchoolYearID
        WHERE sp.StudentNumber = :studentNumber
        LIMIT 1
    ";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':studentNumber', $studentNumber, PDO::PARAM_STR);
    $stmt->execute();
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        throw new Exception("Student not found with ID: " . $studentNumber);
    }

    // Calculate age
    $age = null;
    $dob = $student['DateOfBirth'] ?? $student['ProfileBirthDate'];
    if ($dob && $dob !== 'NULL' && $dob !== '') {
        try {
            $birthDate = new DateTime($dob);
            $now = new DateTime();
            $age = $now->diff($birthDate)->y;
        } catch (Exception $e) {
            error_log("Date parsing error: " . $e->getMessage());
        }
    }

    // Get guardian information
    $guardianQuery = "
        SELECT 
            g.GuardianID,
            g.FullName,
            g.EncryptedPhoneNumber,
            g.EncryptedEmailAddress,
            g.Occupation,
            g.WorkAddress,
            sg.RelationshipType,
            sg.IsPrimaryContact,
            sg.IsEmergencyContact,
            sg.IsAuthorizedPickup
        FROM studentguardian sg
        JOIN guardian g ON sg.GuardianID = g.GuardianID
        WHERE sg.StudentProfileID = :studentProfileID
        ORDER BY sg.IsPrimaryContact DESC, sg.SortOrder ASC
    ";

    $guardianStmt = $conn->prepare($guardianQuery);
    $guardianStmt->bindParam(':studentProfileID', $student['StudentProfileID'], PDO::PARAM_INT);
    $guardianStmt->execute();
    $guardians = $guardianStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get application info for previous school and other details
    $appQuery = "
        SELECT 
            GuardianFirstName,
            GuardianLastName,
            GuardianRelationship,
            GuardianContact,
            GuardianEmail,
            PreviousSchool,
            ApplicationStatus,
            EnrolleeType
        FROM application
        WHERE (StudentFirstName = :firstName AND StudentLastName = :lastName)
           OR TrackingNumber LIKE CONCAT('%', :studentNumberShort, '%')
        ORDER BY ApplicationID DESC
        LIMIT 1
    ";

    $studentNumberShort = substr($studentNumber, strrpos($studentNumber, '-') + 1);
    $appStmt = $conn->prepare($appQuery);
    $appStmt->bindParam(':firstName', $student['FirstName'], PDO::PARAM_STR);
    $appStmt->bindParam(':lastName', $student['LastName'], PDO::PARAM_STR);
    $appStmt->bindParam(':studentNumberShort', $studentNumberShort, PDO::PARAM_STR);
    $appStmt->execute();
    $appData = $appStmt->fetch(PDO::FETCH_ASSOC);

    // Find primary guardian
    $primaryGuardian = null;
    $fatherName = 'N/A';
    $motherName = 'N/A';

    foreach ($guardians as $guardian) {
        if ($guardian['RelationshipType'] === 'Father') {
            $fatherName = $guardian['FullName'];
        }
        if ($guardian['RelationshipType'] === 'Mother') {
            $motherName = $guardian['FullName'];
        }
        if ($guardian['IsPrimaryContact'] == 1) {
            $primaryGuardian = $guardian;
        }
    }

    // If no primary guardian found, use first guardian or application data
    if (!$primaryGuardian && count($guardians) > 0) {
        $primaryGuardian = $guardians[0];
    } elseif (!$primaryGuardian && $appData) {
        $primaryGuardian = [
            'FullName' => trim(($appData['GuardianFirstName'] ?? '') . ' ' . ($appData['GuardianLastName'] ?? '')),
            'RelationshipType' => $appData['GuardianRelationship'] ?? 'N/A',
            'EncryptedPhoneNumber' => $appData['GuardianContact'] ?? 'N/A',
            'EncryptedEmailAddress' => $appData['GuardianEmail'] ?? 'N/A'
        ];
    }

    // Build response
    $response = [
        // Personal Information
        'firstName' => $student['FirstName'] ?? '',
        'middleName' => $student['MiddleName'] ?? '',
        'lastName' => $student['LastName'] ?? '',
        'fullName' => trim(($student['FirstName'] ?? '') . ' ' . ($student['MiddleName'] ?? '') . ' ' . ($student['LastName'] ?? '')),
        'gender' => $student['StudentGender'] ?? $student['ProfileGender'] ?? 'N/A',
        'birthDate' => $dob ?? '',
        'age' => $age,
        'religion' => $student['Religion'] ?? 'N/A',
        'motherTongue' => $student['MotherTongue'] ?? 'N/A',
        'nationality' => $student['Nationality'] ?? 'N/A',

        // Contact Information
        'contactNumber' => $student['EncryptedPhoneNumber'] ?? 'N/A',
        'address' => $student['EncryptedAddress'] ?? 'N/A',
        'emailAddress' => $student['EmailAddress'] ?? 'N/A',

        // Student Information
        'studentId' => $student['StudentNumber'] ?? '',
        'studentNumber' => $student['StudentNumber'] ?? '',
        'qrCodeId' => $student['QRCodeID'] ?? '',
        'studentStatus' => $student['StudentStatus'] ?? 'N/A',
        'accountStatus' => $student['AccountStatus'] ?? 'N/A',
        'photoUrl' => $student['ProfilePictureURL'] ?? null,

        // Academic Information
        'currentGradeLevel' => $student['GradeLevel'] ?? 'N/A',
        'gradeLevel' => $student['GradeLevel'] ?? 'N/A',
        'section' => $student['SectionName'] ?? 'N/A',
        'sectionName' => $student['SectionName'] ?? 'N/A',
        'schoolYear' => $student['SchoolYear'] ?? 'N/A',
        'enrollmentDate' => $student['EnrollmentDate'] ?? 'N/A',
        'status' => $student['StudentStatus'] ?? 'N/A',
        'previousSchool' => $appData['PreviousSchool'] ?? 'N/A',
        'enrolleeType' => $appData['EnrolleeType'] ?? 'N/A',

        // Adviser Information
        'adviserName' => trim(($student['AdviserFirstName'] ?? '') . ' ' . ($student['AdviserLastName'] ?? '')) ?: 'N/A',
        'adviserFirstName' => $student['AdviserFirstName'] ?? 'N/A',
        'adviserLastName' => $student['AdviserLastName'] ?? 'N/A',

        // Guardian Information
        'fatherName' => $fatherName,
        'motherName' => $motherName,
        'guardianName' => $primaryGuardian['FullName'] ?? 'N/A',
        'guardianRelationship' => $primaryGuardian['RelationshipType'] ?? 'N/A',
        'guardianContact' => $primaryGuardian['EncryptedPhoneNumber'] ?? 'N/A',
        'guardianEmail' => $primaryGuardian['EncryptedEmailAddress'] ?? 'N/A',
        'guardianOccupation' => $primaryGuardian['Occupation'] ?? 'N/A',
        'guardianWorkAddress' => $primaryGuardian['WorkAddress'] ?? 'N/A',
        'allGuardians' => $guardians,

        // Emergency Contact
        'emergencyContactPerson' => $student['EmergencyContactPerson'] ?? 'N/A',
        'emergencyContactNumber' => $student['EmergencyContactNumber'] ?? 'N/A',

        // Medical Information
        'weight' => $student['Weight'] ?? 'N/A',
        'height' => $student['Height'] ?? 'N/A',
        'allergies' => $student['EncryptedAllergies'] ?? 'N/A',
        'medicalConditions' => $student['EncryptedMedicalConditions'] ?? 'N/A',
        'medications' => $student['EncryptedMedications'] ?? 'N/A',

        // Attendance Information
        'totalDaysPresent' => $student['TotalDaysPresent'] ?? 0,
        'totalSchoolDays' => $student['TotalSchoolDays'] ?? 0,
        'attendancePercentage' => $student['AttendancePercentage'] ?? 0,

        // Financial Information
        'outstandingBalance' => $student['OutstandingBalance'] ?? 0.00
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
