<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

try {
    $database = new Database();
    $conn = $database->getConnection();

    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    $query = "
        SELECT 
            dr.RequestID as id,
            CONCAT(p.FirstName, ' ', IFNULL(p.MiddleName, ''), ' ', p.LastName) as studentName,
            sp.StudentNumber as studentId,
            'Grade 7' as gradeLevel,
            dr.DocumentType as documentType,
            dr.Purpose as requestPurpose,
            DATE_FORMAT(dr.DateRequested, '%b %d, %Y') as requestDate,
            DATE_FORMAT(dr.DateCompleted, '%b %d, %Y') as completedDate,
            DATE_FORMAT(DATE_ADD(dr.DateCompleted, INTERVAL 2 DAY), '%b %d, %Y') as pickupDate,
            '2:00 PM' as pickupTime,
            u.EmailAddress as email,
            'Released' as status
        FROM document_request dr
        JOIN studentprofile sp ON dr.StudentProfileID = sp.StudentProfileID
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN user u ON p.UserID = u.UserID
        WHERE dr.RequestStatus = 'Completed'
        ORDER BY dr.DateCompleted DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($requests);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
    error_log("get_completed_requests.php error: " . $e->getMessage());
}
