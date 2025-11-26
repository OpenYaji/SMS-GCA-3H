<?php
session_start();

require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->prepare("
        SELECT PasswordSetDate 
        FROM passwordpolicy 
        WHERE UserID = :user_id
    ");
    $stmt->bindParam(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode([
            'success' => true,
            'lastChanged' => $result['PasswordSetDate']
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Password info not found.']);
    }
} catch (Exception $e) {
    error_log("Get password info error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error occurred.']);
}
