<?php
// C:\xampp\htdocs\SMS-GCA-3H\Registrar\backend\api\records\archive_request.php
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

    // Start transaction
    $conn->beginTransaction();

    try {
        // FIXED: Get the request data with REAL grade level from application table
        $getQuery = "
            SELECT 
                sp.StudentNumber as student_id,
                CONCAT(p.FirstName, ' ', IFNULL(p.MiddleName, ''), ' ', p.LastName) as full_name,
                CONCAT('Grade ', IFNULL(app.ApplyingForGradeLevelID, '7')) as grade_level,
                dr.DocumentType,
                dr.Purpose,
                dr.DateRequested,
                u.EmailAddress as contact_email
            FROM document_request dr
            LEFT JOIN studentprofile sp ON dr.StudentProfileID = sp.StudentProfileID
            LEFT JOIN profile p ON sp.ProfileID = p.ProfileID
            LEFT JOIN user u ON p.UserID = u.UserID
            LEFT JOIN application app ON (
                app.StudentFirstName = p.FirstName 
                AND app.StudentLastName = p.LastName
                AND app.ApplicationStatus = 'Enrolled'
            )
            WHERE dr.RequestID = :requestId AND dr.RequestStatus = 'Completed'
        ";

        $stmt = $conn->prepare($getQuery);
        $stmt->bindParam(':requestId', $data->requestId);
        $stmt->execute();
        $requestData = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$requestData) {
            throw new Exception("Completed request not found with ID: " . $data->requestId);
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

        if (!$insertStmt->execute()) {
            throw new Exception("Failed to archive request");
        }

        // DELETE the request from document_request table
        $deleteQuery = "DELETE FROM document_request WHERE RequestID = :requestId";
        $deleteStmt = $conn->prepare($deleteQuery);
        $deleteStmt->bindParam(':requestId', $data->requestId);

        if (!$deleteStmt->execute()) {
            throw new Exception("Failed to delete request from document_request");
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            "success" => true,
            "message" => "Request archived and removed from completed requests successfully"
        ]);
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollBack();
        throw $e;
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log("archive_request.php error: " . $e->getMessage());
    echo json_encode(["error" => $e->getMessage()]);
}
