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

    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->requestId)) {
        throw new Exception("Request ID is required");
    }

    $query = "
        UPDATE document_request 
        SET RequestStatus = 'Completed',
            DateCompleted = NOW()
        WHERE RequestID = :requestId
    ";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':requestId', $data->requestId);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Request marked as completed"
        ]);
    } else {
        throw new Exception("Failed to update request");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
    error_log("complete_request.php error: " . $e->getMessage());
}
