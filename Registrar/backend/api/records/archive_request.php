<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $database = new Database();
    $conn = $database->getConnection();

    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    $input = file_get_contents("php://input");
    error_log("archive_request.php - Raw input: " . $input);

    $data = json_decode($input);

    if (!isset($data->requestId)) {
        throw new Exception("Request ID is required");
    }

    error_log("archive_request.php - Request ID: " . $data->requestId);

    // Get the request data with all necessary joins
    $getQuery = "
        SELECT 
            sp.StudentNumber as student_id,
            CONCAT(p.FirstName, ' ', IFNULL(p.MiddleName, ''), ' ', p.LastName) as full_name,
            'Grade 7' as grade_level,
            dr.DocumentType,
            dr.Purpose,
            dr.DateRequested,
            u.EmailAddress as contact_email
        FROM document_request dr
        LEFT JOIN studentprofile sp ON dr.StudentProfileID = sp.StudentProfileID
        LEFT JOIN profile p ON sp.ProfileID = p.ProfileID
        LEFT JOIN user u ON p.UserID = u.UserID
        WHERE dr.RequestID = :requestId
    ";

    $stmt = $conn->prepare($getQuery);
    $stmt->bindParam(':requestId', $data->requestId);
    $stmt->execute();
    $requestData = $stmt->fetch(PDO::FETCH_ASSOC);

    error_log("archive_request.php - Request data: " . json_encode($requestData));

    if (!$requestData) {
        throw new Exception("Request not found with ID: " . $data->requestId);
    }

    if (empty($requestData['student_id'])) {
        throw new Exception("Student number not found");
    }

    // Insert into archive_search
    $insertQuery = "
        INSERT INTO archive_search 
        (student_id, full_name, grade_level, exit_type, exit_status, transfer_reason, request_date, contact_email, archived_at, created_at, updated_at)
        VALUES 
        (:student_id, :full_name, :grade_level, 'Transfer Out', 'Completed', :transfer_reason, :request_date, :contact_email, NOW(), NOW(), NOW())
    ";

    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bindParam(':student_id', $requestData['student_id']);
    $insertStmt->bindParam(':full_name', $requestData['full_name']);
    $insertStmt->bindParam(':grade_level', $requestData['grade_level']);
    $insertStmt->bindParam(':transfer_reason', $requestData['Purpose']);
    $insertStmt->bindParam(':request_date', $requestData['DateRequested']);
    $insertStmt->bindParam(':contact_email', $requestData['contact_email']);

    if ($insertStmt->execute()) {
        error_log("archive_request.php - Successfully archived");
        echo json_encode([
            "success" => true,
            "message" => "Request archived successfully"
        ]);
    } else {
        $errorInfo = $insertStmt->errorInfo();
        error_log("archive_request.php - Insert failed: " . json_encode($errorInfo));
        throw new Exception("Failed to archive: " . $errorInfo[2]);
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log("archive_request.php error: " . $e->getMessage());
    echo json_encode(["error" => $e->getMessage()]);
}
