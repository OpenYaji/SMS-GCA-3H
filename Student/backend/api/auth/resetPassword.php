<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/User.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

$input_data = json_decode(file_get_contents("php://input"));

if (!isset($input_data->token) || !isset($input_data->password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit();
}

$token = trim($input_data->token);
$password = $input_data->password;

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long.']);
    exit();
}

$userModel = new User($db);
$tokenData = $userModel->getPasswordResetToken($token);

if (!$tokenData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired reset link.']);
    exit();
}

$newPasswordHash = password_hash($password, PASSWORD_BCRYPT);

if ($userModel->updatePassword($tokenData['UserID'], $newPasswordHash)) {
    $userModel->markTokenAsUsed($token);

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Password has been reset successfully. You can now login with your new password.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to reset password. Please try again.']);
}
