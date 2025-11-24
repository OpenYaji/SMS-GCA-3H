<?php
session_start();

require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['currentPassword']) || !isset($input['newPassword'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Current password and new password are required.']);
    exit();
}

$userId = $_SESSION['user_id'];
$currentPassword = $input['currentPassword'];
$newPassword = $input['newPassword'];

// Validate new password strength
if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'New password must be at least 8 characters long.']);
    exit();
}

if (!preg_match('/[A-Z]/', $newPassword)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'New password must contain at least one uppercase letter.']);
    exit();
}

if (!preg_match('/[a-z]/', $newPassword)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'New password must contain at least one lowercase letter.']);
    exit();
}

if (!preg_match('/[0-9]/', $newPassword)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'New password must contain at least one number.']);
    exit();
}

try {
    $db->beginTransaction();

    // Get current password hash
    $stmt = $db->prepare("
        SELECT PasswordHash 
        FROM passwordpolicy 
        WHERE UserID = :user_id
    ");
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        throw new Exception('User password policy not found.');
    }

    // Verify current password
    if (!password_verify($currentPassword, $result['PasswordHash'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Current password is incorrect.']);
        $db->rollBack();
        exit();
    }

    // Check password history (prevent reusing last 5 passwords)
    $stmt = $db->prepare("
        SELECT PasswordHash 
        FROM passwordhistory 
        WHERE UserID = :user_id 
        ORDER BY CreatedAt DESC 
        LIMIT 5
    ");
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $passwordHistory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($passwordHistory as $oldPassword) {
        if (password_verify($newPassword, $oldPassword['PasswordHash'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cannot reuse recent passwords.']);
            $db->rollBack();
            exit();
        }
    }

    // Hash new password
    $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);

    // Save old password to history
    $stmt = $db->prepare("
        INSERT INTO passwordhistory (UserID, PasswordHash, CreatedAt) 
        VALUES (:user_id, :password_hash, NOW())
    ");
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->bindParam(':password_hash', $result['PasswordHash']);
    $stmt->execute();

    // Update password policy
    $stmt = $db->prepare("
        UPDATE passwordpolicy 
        SET PasswordHash = :password_hash, 
            PasswordSetDate = NOW(),
            FailedLoginAttempts = 0,
            LockedUntil = NULL
        WHERE UserID = :user_id
    ");
    $stmt->bindParam(':password_hash', $newPasswordHash);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $db->commit();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Password changed successfully.'
    ]);
} catch (Exception $e) {
    $db->rollBack();
    error_log("Change password error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error occurred.']);
}
