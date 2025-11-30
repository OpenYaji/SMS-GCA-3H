<?php
header("Access-Control-Allow-Origin: *"); // allow all origins (or specify http://localhost:5176)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
error_reporting(0);
// Database connection
$host = "localhost";
$user = "root";          // adjust if needed
$pass = "aggabaorenz";   // your MySQL password
$db   = "guard_db";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $qrCodeId = $_POST['qr_data'] ?? '';

    if (!$qrCodeId) {
        echo json_encode(["success" => false, "message" => "No QR code provided"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT studentName, StudentNumber, QRCodeID, DateOfBirth, Gender, Nationality 
                            FROM student_profiles WHERE QRCodeID = ?");
    $stmt->bind_param("s", $qrCodeId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode(["success" => true, "student" => $row]);
    } else {
        echo json_encode(["success" => false, "message" => "Student not found"]);
    }
    exit;
}

// fallback
echo json_encode(["success" => false, "message" => "Invalid request"]);
?>
