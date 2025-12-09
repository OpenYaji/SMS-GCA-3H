<?php
// C:\xampp\htdocs\SMS-GCA-3H\Registrar\backend\api\records\archive_multiple_requests.php
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

    if (!isset($data->requestIds) || !is_array($data->requestIds) || empty($data->requestIds)) {
        throw new Exception("Request IDs array is required");
    }

    $requestIds = $data->requestIds;
    $successCount = 0;
    $failCount = 0;
    $errors = [];

    // Start transaction
    $conn->beginTransaction();

    try {
        foreach ($requestIds as $requestId) {
            try {
                // Get the request data with REAL grade level
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
                $stmt->bindParam(':requestId', $requestId);
                $stmt->execute();
                $requestData = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$requestData) {
                    $failCount++;
                    $errors[] = "Request ID $requestId not found or not completed";
                    continue;
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
                    $failCount++;
                    $errors[] = "Failed to archive request ID $requestId";
                    continue;
                }

                // DELETE the request from document_request table
                $deleteQuery = "DELETE FROM document_request WHERE RequestID = :requestId";
                $deleteStmt = $conn->prepare($deleteQuery);
                $deleteStmt->bindParam(':requestId', $requestId);

                if (!$deleteStmt->execute()) {
                    $failCount++;
                    $errors[] = "Failed to delete request ID $requestId";
                    continue;
                }

                $successCount++;
            } catch (Exception $e) {
                $failCount++;
                $errors[] = "Error archiving request ID $requestId: " . $e->getMessage();
            }
        }

        // Commit transaction if at least one succeeded
        if ($successCount > 0) {
            $conn->commit();

            $response = [
                "success" => true,
                "message" => "Archived $successCount request(s) successfully",
                "successCount" => $successCount,
                "failCount" => $failCount
            ];

            if (!empty($errors)) {
                $response['errors'] = $errors;
            }

            echo json_encode($response);
        } else {
            throw new Exception("Failed to archive any requests: " . implode(", ", $errors));
        }
    } catch (Exception $e) {
        $conn->rollBack();
        throw $e;
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log("archive_multiple_requests.php error: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
