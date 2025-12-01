<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

// Check DB Connection
if (!isset($pdo) || $pdo === null) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

try {
    $stmt = $pdo->query("
        SELECT 
            a.AttendanceID,
            a.AttendanceDate,
            a.CheckInTime,
            a.CheckOutTime,
            a.AttendanceStatus,
            sp.StudentNumber,
            sp.QRCodeID,
            CONCAT(p.FirstName, ' ', p.LastName) AS StudentName
        FROM attendance a
        JOIN studentprofile sp ON a.StudentProfileID = sp.StudentProfileID
        JOIN profile p ON sp.ProfileID = p.ProfileID
        ORDER BY a.AttendanceDate DESC, a.CheckInTime DESC
        LIMIT 20
    ");

    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "count" => count($records),
        "records" => $records,
        "message" => count($records) > 0
            ? "Found " . count($records) . " attendance record(s)"
            : "No attendance records found"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
