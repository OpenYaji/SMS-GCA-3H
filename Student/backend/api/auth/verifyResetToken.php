<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/User.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

$token = isset($_GET['token']) ? trim($_GET['token']) : '';

if (empty($token)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Token is required.']);
    exit();
}

$userModel = new User($db);
$tokenData = $userModel->getPasswordResetToken($token);

if ($tokenData) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Token is valid.']);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired reset link.']);
}
