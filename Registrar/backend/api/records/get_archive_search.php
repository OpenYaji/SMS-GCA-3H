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
            id,
            full_name as studentName,
            student_id as studentId,
            grade_level as lastGradeLevel,
            exit_type as exitType,
            DATE_FORMAT(request_date, '%b %d, %Y') as exitDate,
            DATE_FORMAT(archived_at, '%b %d, %Y') as archiveDate
        FROM archive_search
        ORDER BY archived_at DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($records);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
    error_log("get_archive_search.php error: " . $e->getMessage());
}
