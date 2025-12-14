<?php
// C:\xampp\htdocs\SMS-GCA-3H\Registrar\backend\api\records\get_student_info.php

// Enable error reporting
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

    // Get student profile data (using ACTUAL column names)
    $query = "
        SELECT 
            sp.StudentProfileID,
            p.FirstName,
            p.MiddleName,
            p.LastName,
            p.Gender,
            p.BirthDate,
            p.Religion,
            p.EncryptedPhoneNumber,
            p.EncryptedAddress,
            p.ProfilePictureURL,
            sp.StudentNumber,
            sp.DateOfBirth,
            sp.Nationality,
            sp.StudentStatus,
            u.EmailAddress
        FROM studentprofile sp
        LEFT JOIN profile p ON sp.ProfileID = p.ProfileID
        LEFT JOIN user u ON p.UserID = u.UserID
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
    $dob = $student['BirthDate'] ?? $student['DateOfBirth'];
    if ($dob && $dob !== 'NULL' && $dob !== '') {
        try {
            $birthDate = new DateTime($dob);
            $now = new DateTime();
            $age = $now->diff($birthDate)->y;
        } catch (Exception $e) {
            error_log("Date parsing error: " . $e->getMessage());
        }
    }

    // Get guardian info from application table (best match)
    $guardianInfo = [
        'guardianName' => 'N/A',
        'guardianRelationship' => 'N/A',
        'guardianContact' => 'N/A',
        'guardianEmail' => 'N/A',
        'previousSchool' => 'N/A'
    ];

    // Try to match application by student name
    $appQuery = "
        SELECT 
            GuardianFirstName,
            GuardianLastName,
            GuardianRelationship,
            GuardianContact,
            GuardianEmail,
            PreviousSchool
        FROM application
        WHERE (StudentFirstName = :firstName AND StudentLastName = :lastName)
           OR TrackingNumber LIKE CONCAT('%', :studentNumberShort, '%')
        ORDER BY ApplicationID DESC
        LIMIT 1
    ";

    // Extract short code (e.g., "15774" from "GCA-2025-00002" vs "GCA-2025-15774")
    $studentNumberShort = substr($studentNumber, strrpos($studentNumber, '-') + 1);

    $appStmt = $conn->prepare($appQuery);
    $appStmt->bindParam(':firstName', $student['FirstName'], PDO::PARAM_STR);
    $appStmt->bindParam(':lastName', $student['LastName'], PDO::PARAM_STR);
    $appStmt->bindParam(':studentNumberShort', $studentNumberShort, PDO::PARAM_STR);

    if ($appStmt->execute()) {
        $appData = $appStmt->fetch(PDO::FETCH_ASSOC);

        if ($appData) {
            $guardianInfo['guardianName'] = trim(
                ($appData['GuardianFirstName'] ?? '') . ' ' .
                    ($appData['GuardianLastName'] ?? '')
            );
            $guardianInfo['guardianRelationship'] = $appData['GuardianRelationship'] ?? 'N/A';
            $guardianInfo['guardianContact'] = $appData['GuardianContact'] ?? 'N/A';
            $guardianInfo['guardianEmail'] = $appData['GuardianEmail'] ?? 'N/A';
            $guardianInfo['previousSchool'] = $appData['PreviousSchool'] ?? 'N/A';
        }
    }

    // Transform to camelCase for React
    $response = [
        'firstName' => $student['FirstName'] ?? '',
        'middleName' => $student['MiddleName'] ?? '',
        'lastName' => $student['LastName'] ?? '',
        'gender' => $student['Gender'] ?? 'N/A',
        'birthDate' => $student['BirthDate'] ?? $student['DateOfBirth'] ?? '',
        'age' => $age,
        'religion' => $student['Religion'] ?? 'N/A',
        'motherTongue' => $student['MotherTongue'] ?? 'N/A',
        'nationality' => $student['Nationality'] ?? 'N/A',
        // Use actual column names from profile table
        'contactNumber' => $student['EncryptedPhoneNumber'] ?? 'N/A',
        'address' => $student['EncryptedAddress'] ?? 'N/A',
        'emailAddress' => $student['EmailAddress'] ?? 'N/A',
        'photoUrl' => $student['ProfilePictureURL'] ?? null,
        'studentId' => $student['StudentNumber'] ?? '',
        'studentStatus' => $student['StudentStatus'] ?? 'N/A',
        'previousSchool' => $guardianInfo['previousSchool'],
        'guardianName' => $guardianInfo['guardianName'],
        'guardianRelationship' => $guardianInfo['guardianRelationship'],
        'guardianContact' => $guardianInfo['guardianContact'],
        'guardianEmail' => $guardianInfo['guardianEmail'],
        // Placeholders for fields not in your tables
        'fatherFirstName' => 'N/A',
        'fatherMiddleName' => 'N/A',
        'fatherLastName' => 'N/A',
        'fatherOccupation' => 'N/A',
        'motherFirstName' => 'N/A',
        'motherMiddleName' => 'N/A',
        'motherLastName' => 'N/A',
        'motherOccupation' => 'N/A',
        'currentGradeLevel' => 'N/A',
        'section' => 'N/A',
        'status' => $student['StudentStatus'] ?? 'N/A',
        'schoolYear' => 'N/A',
        'documents' => []
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
