<?php
// --- THE FIX ---
// Set the default timezone to match your database (Asia/Manila)
date_default_timezone_set('Asia/Manila');
// ---------------

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/User.php';

$mailerPath = __DIR__ . '/../../config/mailer.php';
$mailerExists = file_exists($mailerPath) && file_exists(__DIR__ . '/../../vendor/autoload.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception('Database connection failed.');
    }

    $input_data = json_decode(file_get_contents("php://input"));

    if (!isset($input_data->identifier) || empty(trim($input_data->identifier))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please provide student number or email address.']);
        exit();
    }

    $identifier = trim(htmlspecialchars(strip_tags($input_data->identifier)));

    $userModel = new User($db);
    $userData = $userModel->findByStudentNumberOrEmail($identifier);

    if (!$userData) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'If the student number or email exists, a password reset link has been sent.']);
        exit();
    }

    $token = bin2hex(random_bytes(32));
    
    // This line will now use the 'Asia/Manila' timezone
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

    if (!$userModel->createPasswordResetToken($userData['UserID'], $token, $expiresAt)) {
        throw new Exception('Failed to create reset token.');
    }

    if (!$mailerExists) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Password reset link has been generated. Please check your email.',
            'debug_token' => $token
        ]);
        exit();
    }

    require_once $mailerPath;
    $mailer = new Mailer();
    $emailSent = $mailer->sendPasswordResetEmail($userData['EmailAddress'], $userData['FullName'], $token);

    http_response_code(200);
    if ($emailSent) {
        echo json_encode(['success' => true, 'message' => 'Password reset link has been sent to your email.']);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Password reset link has been generated. Please check your email.',
            'debug_token' => $token
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again later.'
    ]);
}