<?php
// C:\xampp\htdocs\SMS-GCA-3H\Registrar\backend\api\records\archive_request_simple.php
// TEMPORARY TEST VERSION - Use this to debug
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
    $data = json_decode($input);

    if (!isset($data->requestId)) {
        throw new Exception("Request ID is required");
    }

    // Simple test insert with hardcoded data
    $insertQuery = "
        INSERT INTO archive_search 
        (student_id, full_name, grade_level, exit_type, exit_status, transfer_reason, request_date, contact_email, archived_at, created_at, updated_at)
        VALUES 
        ('TEST-ID-001', 'Test Student', 'Grade 7', 'Transfer Out', 'Completed', 'Testing archive', NOW(), 'test@email.com', NOW(), NOW(), NOW())
    ";

    $insertStmt = $conn->prepare($insertQuery);

    if ($insertStmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Test archive successful - Request ID was: " . $data->requestId
        ]);
    } else {
        throw new Exception("Failed to insert test record");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
