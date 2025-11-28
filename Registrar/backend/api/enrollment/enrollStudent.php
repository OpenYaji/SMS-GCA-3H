<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $applicantId = $data['applicantId'] ?? null;
    $sectionId = $data['sectionId'] ?? null;

    if (!$applicantId || !$sectionId) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    try {
        $database = new Database();
        $conn = $database->getConnection();

        $conn->beginTransaction();

        // Get application details including TransactionID
        $stmt = $conn->prepare("
            SELECT ApplicationID, SchoolYearID, TransactionID, ApplyingForGradeLevelID,
                   StudentFirstName, StudentLastName, StudentMiddleName,
                   DateOfBirth, Gender, Address, ContactNumber, EmailAddress,
                   GuardianFirstName, GuardianLastName, GuardianContact, GuardianEmail, GuardianRelationship
            FROM application
            WHERE ApplicationID = :appId AND ApplicationStatus = 'Approved'
        ");
        $stmt->bindParam(':appId', $applicantId);
        $stmt->execute();
        $application = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$application) {
            throw new Exception('Application not found or not approved');
        }

        $transactionId = $application['TransactionID'];

        // Get outstanding balance from transaction BEFORE linking
        $outstandingBalance = 0;
        if ($transactionId) {
            $stmt = $conn->prepare("
                SELECT (TotalAmount - PaidAmount) as BalanceAmount 
                FROM transaction 
                WHERE TransactionID = :txnId
            ");
            $stmt->bindParam(':txnId', $transactionId);
            $stmt->execute();
            $txn = $stmt->fetch(PDO::FETCH_ASSOC);
            $outstandingBalance = $txn['BalanceAmount'] ?? 0;
        }

        // Generate student number
        $stmt = $conn->prepare("SELECT MAX(StudentProfileID) as MaxID FROM studentprofile");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $nextId = ($result['MaxID'] ?? 0) + 1;
        $studentNumber = 'GCA-' . date('Y') . '-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

        // Create User account
        $email = strtolower($application['StudentFirstName'] . '.' . $application['StudentLastName']) . '@student.gca.edu.ph';
        $defaultPassword = password_hash('Student@123', PASSWORD_BCRYPT);

        $stmt = $conn->prepare("
            INSERT INTO user (EmailAddress, UserType, AccountStatus, CreatedAt)
            VALUES (:email, 'Student', 'Active', NOW())
        ");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $userId = $conn->lastInsertId();

        // Create Profile
        $stmt = $conn->prepare("
            INSERT INTO profile (UserID, FirstName, LastName, MiddleName, Gender, BirthDate, EncryptedPhoneNumber, EncryptedAddress)
            VALUES (:userId, :firstName, :lastName, :middleName, :gender, :birthDate, :phone, :address)
        ");
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':firstName', $application['StudentFirstName']);
        $stmt->bindParam(':lastName', $application['StudentLastName']);
        $stmt->bindParam(':middleName', $application['StudentMiddleName']);
        $stmt->bindParam(':gender', $application['Gender']);
        $stmt->bindParam(':birthDate', $application['DateOfBirth']);
        $stmt->bindParam(':phone', $application['ContactNumber']);
        $stmt->bindParam(':address', $application['Address']);
        $stmt->execute();
        $profileId = $conn->lastInsertId();

        // Create StudentProfile (trigger will auto-link transaction)
        $qrCodeId = 'QR-' . $studentNumber;
        $stmt = $conn->prepare("
            INSERT INTO studentprofile (ProfileID, StudentNumber, QRCodeID, DateOfBirth, Gender, Nationality, StudentStatus)
            VALUES (:profileId, :studentNumber, :qrCodeId, :birthDate, :gender, 'Filipino', 'Enrolled')
        ");
        $stmt->bindParam(':profileId', $profileId);
        $stmt->bindParam(':studentNumber', $studentNumber);
        $stmt->bindParam(':qrCodeId', $qrCodeId);
        $stmt->bindParam(':birthDate', $application['DateOfBirth']);
        $stmt->bindParam(':gender', $application['Gender']);
        $stmt->execute();
        $studentProfileId = $conn->lastInsertId();

        // DOUBLE CHECK: Manually link transaction if trigger didn't work
        if ($transactionId) {
            $stmt = $conn->prepare("
                UPDATE transaction 
                SET StudentProfileID = :studentProfileId
                WHERE TransactionID = :txnId 
                AND (StudentProfileID IS NULL OR StudentProfileID = 0)
            ");
            $stmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
            $stmt->bindParam(':txnId', $transactionId, PDO::PARAM_INT);
            $stmt->execute();
            $transactionLinked = $stmt->rowCount() > 0;
        }

        // Create Guardian
        $stmt = $conn->prepare("
            INSERT INTO guardian (FullName, EncryptedPhoneNumber, EncryptedEmailAddress)
            VALUES (:fullName, :phone, :email)
        ");
        $guardianFullName = trim($application['GuardianFirstName'] . ' ' . $application['GuardianLastName']);
        $stmt->bindParam(':fullName', $guardianFullName);
        $stmt->bindParam(':phone', $application['GuardianContact']);
        $stmt->bindParam(':email', $application['GuardianEmail']);
        $stmt->execute();
        $guardianId = $conn->lastInsertId();

        // Link Guardian to Student
        $relationship = ucfirst(strtolower($application['GuardianRelationship'] ?? 'Guardian'));
        if (!in_array($relationship, ['Father', 'Mother', 'Guardian', 'Sibling', 'Other'])) {
            $relationship = 'Guardian';
        }

        $stmt = $conn->prepare("
            INSERT INTO studentguardian (StudentProfileID, GuardianID, RelationshipType, IsPrimaryContact, IsEmergencyContact, IsAuthorizedPickup)
            VALUES (:studentProfileId, :guardianId, :relationship, 1, 1, 1)
        ");
        $stmt->bindParam(':studentProfileId', $studentProfileId);
        $stmt->bindParam(':guardianId', $guardianId);
        $stmt->bindParam(':relationship', $relationship);
        $stmt->execute();

        // Create Emergency Contact
        $stmt = $conn->prepare("
            INSERT INTO emergencycontact (StudentProfileID, ContactPerson, EncryptedContactNumber)
            VALUES (:studentProfileId, :contactPerson, :contactNumber)
        ");
        $stmt->bindParam(':studentProfileId', $studentProfileId);
        $stmt->bindParam(':contactPerson', $guardianFullName);
        $stmt->bindParam(':contactNumber', $application['GuardianContact']);
        $stmt->execute();

        // Create MedicalInfo
        $stmt = $conn->prepare("INSERT INTO medicalinfo (StudentProfileID) VALUES (:studentProfileId)");
        $stmt->bindParam(':studentProfileId', $studentProfileId);
        $stmt->execute();

        // Create Password Policy
        $stmt = $conn->prepare("
            INSERT INTO passwordpolicy (UserID, PasswordHash, MustChange)
            VALUES (:userId, :passwordHash, 1)
        ");
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':passwordHash', $defaultPassword);
        $stmt->execute();

        // Create Enrollment with Outstanding Balance
        $stmt = $conn->prepare("
            INSERT INTO enrollment (StudentProfileID, SectionID, SchoolYearID, EnrollmentDate, OutstandingBalance)
            VALUES (:studentProfileId, :sectionId, :schoolYearId, CURDATE(), :balance)
        ");
        $stmt->bindParam(':studentProfileId', $studentProfileId);
        $stmt->bindParam(':sectionId', $sectionId);
        $stmt->bindParam(':schoolYearId', $application['SchoolYearID']);
        $stmt->bindParam(':balance', $outstandingBalance);
        $stmt->execute();
        $enrollmentId = $conn->lastInsertId();

        // Get subjects and create grade records
        $stmt = $conn->prepare("
            SELECT SubjectID FROM subject 
            WHERE GradeLevelID = :gradeLevelId AND IsActive = 1
        ");
        $stmt->bindParam(':gradeLevelId', $application['ApplyingForGradeLevelID']);
        $stmt->execute();
        $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $quarters = ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'];
        $stmt = $conn->prepare("
            INSERT INTO grade (EnrollmentID, SubjectID, Quarter)
            VALUES (:enrollmentId, :subjectId, :quarter)
        ");

        foreach ($subjects as $subject) {
            foreach ($quarters as $quarter) {
                $stmt->bindParam(':enrollmentId', $enrollmentId);
                $stmt->bindParam(':subjectId', $subject['SubjectID']);
                $stmt->bindParam(':quarter', $quarter);
                $stmt->execute();
            }
        }

        // Create Attendance Summary
        $stmt = $conn->prepare("
            INSERT INTO attendancesummary (StudentProfileID, SchoolYearID)
            VALUES (:studentProfileId, :schoolYearId)
        ");
        $stmt->bindParam(':studentProfileId', $studentProfileId);
        $stmt->bindParam(':schoolYearId', $application['SchoolYearID']);
        $stmt->execute();

        // Update application status to Enrolled
        $stmt = $conn->prepare("
            UPDATE application 
            SET ApplicationStatus = 'Enrolled'
            WHERE ApplicationID = :appId
        ");
        $stmt->bindParam(':appId', $applicantId);
        $stmt->execute();

        // Update section enrollment count
        $stmt = $conn->prepare("
            UPDATE section 
            SET CurrentEnrollment = CurrentEnrollment + 1
            WHERE SectionID = :sectionId
        ");
        $stmt->bindParam(':sectionId', $sectionId);
        $stmt->execute();

        // Verify transaction was linked
        $stmt = $conn->prepare("
            SELECT StudentProfileID FROM transaction WHERE TransactionID = :txnId
        ");
        $stmt->bindParam(':txnId', $transactionId);
        $stmt->execute();
        $verifyTxn = $stmt->fetch(PDO::FETCH_ASSOC);
        $finallyLinked = ($verifyTxn['StudentProfileID'] == $studentProfileId);

        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Student enrolled successfully',
            'data' => [
                'studentProfileId' => $studentProfileId,
                'studentNumber' => $studentNumber,
                'userId' => $userId,
                'email' => $email,
                'transactionId' => $transactionId,
                'outstandingBalance' => $outstandingBalance,
                'transactionLinked' => $finallyLinked
            ]
        ]);
    } catch (Exception $e) {
        if (isset($conn) && $conn->inTransaction()) {
            $conn->rollBack();
        }
        echo json_encode([
            'success' => false,
            'message' => 'Enrollment failed: ' . $e->getMessage()
        ]);
    }
}
