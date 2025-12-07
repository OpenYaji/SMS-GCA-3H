<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../config/db.php';

try {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception("Invalid JSON data");
    }

    // Validate required fields
    $required = ['studentProfileId', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'address', 'guardianName', 'guardianPhone'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            throw new Exception("Field '{$field}' is required");
        }
    }

    $db = new Database();
    $conn = $db->getConnection();
    $conn->beginTransaction();

    // Get student's profile ID and user ID
    $checkQuery = $conn->prepare("
        SELECT sp.ProfileID, p.UserID 
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        WHERE sp.StudentProfileID = ?
    ");
    $checkQuery->execute([$data['studentProfileId']]);
    $student = $checkQuery->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        throw new Exception("Student not found");
    }

    $profileId = $student['ProfileID'];
    $userId = $student['UserID'];

    // 1. Update profile table
    $updateProfile = $conn->prepare("
        UPDATE profile 
        SET FirstName = ?,
            LastName = ?,
            MiddleName = ?,
            EncryptedPhoneNumber = ?,
            EncryptedAddress = ?
        WHERE ProfileID = ?
    ");
    
    $updateProfile->execute([
        trim($data['firstName']),
        trim($data['lastName']),
        trim($data['middleName'] ?? ''),
        trim($data['guardianPhone']), // Student's phone if available, or guardian's
        trim($data['address']),
        $profileId
    ]);

    // 2. Update studentprofile table
    $updateStudent = $conn->prepare("
        UPDATE studentprofile 
        SET DateOfBirth = ?,
            Gender = ?
        WHERE StudentProfileID = ?
    ");
    
    $updateStudent->execute([
        $data['dateOfBirth'],
        $data['gender'],
        $data['studentProfileId']
    ]);

    // 3. Update guardian information
    // Get the primary guardian
    $getGuardian = $conn->prepare("
        SELECT g.GuardianID 
        FROM studentguardian sg
        JOIN guardian g ON sg.GuardianID = g.GuardianID
        WHERE sg.StudentProfileID = ? AND sg.IsPrimaryContact = 1
        LIMIT 1
    ");
    $getGuardian->execute([$data['studentProfileId']]);
    $guardianResult = $getGuardian->fetch(PDO::FETCH_ASSOC);

    if ($guardianResult) {
        // Update existing guardian
        $updateGuardian = $conn->prepare("
            UPDATE guardian 
            SET FullName = ?,
                EncryptedPhoneNumber = ?,
                EncryptedEmailAddress = ?
            WHERE GuardianID = ?
        ");
        
        $updateGuardian->execute([
            trim($data['guardianName']),
            trim($data['guardianPhone']),
            trim($data['guardianEmail'] ?? ''),
            $guardianResult['GuardianID']
        ]);

        // Update relationship
        if (!empty($data['guardianRelationship'])) {
            $updateRelationship = $conn->prepare("
                UPDATE studentguardian 
                SET RelationshipType = ?
                WHERE StudentProfileID = ? AND GuardianID = ?
            ");
            $updateRelationship->execute([
                $data['guardianRelationship'],
                $data['studentProfileId'],
                $guardianResult['GuardianID']
            ]);
        }
    } else {
        // Create new guardian if not exists
        $insertGuardian = $conn->prepare("
            INSERT INTO guardian (FullName, EncryptedPhoneNumber, EncryptedEmailAddress)
            VALUES (?, ?, ?)
        ");
        $insertGuardian->execute([
            trim($data['guardianName']),
            trim($data['guardianPhone']),
            trim($data['guardianEmail'] ?? '')
        ]);
        $newGuardianId = $conn->lastInsertId();

        // Link to student
        $linkGuardian = $conn->prepare("
            INSERT INTO studentguardian 
            (StudentProfileID, GuardianID, RelationshipType, IsPrimaryContact, IsEmergencyContact, IsAuthorizedPickup)
            VALUES (?, ?, ?, 1, 1, 1)
        ");
        $linkGuardian->execute([
            $data['studentProfileId'],
            $newGuardianId,
            $data['guardianRelationship'] ?? 'Guardian'
        ]);
    }

    // 4. Update emergency contact
    if (!empty($data['emergencyContactName']) || !empty($data['emergencyContactNumber'])) {
        $checkEmergency = $conn->prepare("
            SELECT EmergencyContactID FROM emergencycontact WHERE StudentProfileID = ?
        ");
        $checkEmergency->execute([$data['studentProfileId']]);
        $emergencyExists = $checkEmergency->fetch(PDO::FETCH_ASSOC);

        if ($emergencyExists) {
            $updateEmergency = $conn->prepare("
                UPDATE emergencycontact 
                SET ContactPerson = ?,
                    EncryptedContactNumber = ?
                WHERE StudentProfileID = ?
            ");
            $updateEmergency->execute([
                trim($data['emergencyContactName'] ?? ''),
                trim($data['emergencyContactNumber'] ?? ''),
                $data['studentProfileId']
            ]);
        } else {
            $insertEmergency = $conn->prepare("
                INSERT INTO emergencycontact (StudentProfileID, ContactPerson, EncryptedContactNumber)
                VALUES (?, ?, ?)
            ");
            $insertEmergency->execute([
                $data['studentProfileId'],
                trim($data['emergencyContactName'] ?? ''),
                trim($data['emergencyContactNumber'] ?? '')
            ]);
        }
    }

    $conn->commit();

    // Fetch updated student data
    $fetchUpdated = $conn->prepare("
        SELECT 
            sp.StudentProfileID,
            sp.StudentNumber,
            sp.StudentStatus,
            sp.DateOfBirth,
            sp.Gender,
            p.FirstName,
            p.LastName,
            p.MiddleName,
            CONCAT(p.LastName, ', ', p.FirstName, 
                CASE WHEN p.MiddleName IS NOT NULL 
                THEN CONCAT(' ', SUBSTRING(p.MiddleName, 1, 1), '.') 
                ELSE '' END
            ) as FullName,
            CAST(p.EncryptedAddress AS CHAR) as Address,
            g.FullName as GuardianName,
            CAST(g.EncryptedPhoneNumber AS CHAR) as GuardianPhone,
            CAST(g.EncryptedEmailAddress AS CHAR) as GuardianEmail,
            sg.RelationshipType as GuardianRelationship,
            ec.ContactPerson as EmergencyContactName,
            CAST(ec.EncryptedContactNumber AS CHAR) as EmergencyContactNumber
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        LEFT JOIN studentguardian sg ON sp.StudentProfileID = sg.StudentProfileID AND sg.IsPrimaryContact = 1
        LEFT JOIN guardian g ON sg.GuardianID = g.GuardianID
        LEFT JOIN emergencycontact ec ON sp.StudentProfileID = ec.StudentProfileID
        WHERE sp.StudentProfileID = ?
    ");
    $fetchUpdated->execute([$data['studentProfileId']]);
    $updated = $fetchUpdated->fetch(PDO::FETCH_ASSOC);

    // Calculate age
    $age = null;
    if ($updated['DateOfBirth']) {
        $dob = new DateTime($updated['DateOfBirth']);
        $now = new DateTime();
        $age = $now->diff($dob)->y;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Student information updated successfully',
        'data' => [
            'id' => (int)$updated['StudentProfileID'],
            'studentNumber' => $updated['StudentNumber'],
            'firstName' => $updated['FirstName'],
            'lastName' => $updated['LastName'],
            'middleName' => $updated['MiddleName'],
            'fullName' => $updated['FullName'],
            'dateOfBirth' => $updated['DateOfBirth'],
            'age' => $age,
            'gender' => $updated['Gender'],
            'address' => $updated['Address'],
            'status' => $updated['StudentStatus'],
            'guardianName' => $updated['GuardianName'],
            'guardianPhone' => $updated['GuardianPhone'],
            'guardianEmail' => $updated['GuardianEmail'],
            'guardianRelationship' => $updated['GuardianRelationship'],
            'emergencyContactName' => $updated['EmergencyContactName'],
            'emergencyContactNumber' => $updated['EmergencyContactNumber']
        ]
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>