<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/User.php';

// Check if user is authenticated
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Check if file was uploaded
if (!isset($_FILES['profilePicture']) || $_FILES['profilePicture']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
    exit();
}

$file = $_FILES['profilePicture'];
$userId = $_SESSION['user_id'];

// Validate file type
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$fileType = mime_content_type($file['tmp_name']);

if (!in_array($fileType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images are allowed']);
    exit();
}

// Validate file size (max 5MB)
$maxSize = 5 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File size too large. Maximum 5MB allowed']);
    exit();
}

// Create upload directory if it doesn't exist
$uploadDir = __DIR__ . '/../../uploads/profile_pictures/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'profile_' . $userId . '_' . time() . '.' . $extension;
$uploadPath = $uploadDir . $filename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save file']);
    exit();
}

// Update database
try {
    $database = new Database();
    $db = $database->getConnection();
    $userModel = new User($db);
    
    // Get old picture before updating
    $oldPicture = $userModel->getProfilePictureURL($userId);
    
    $profilePictureURL = 'uploads/profile_pictures/' . $filename;
    
    if ($userModel->updateProfilePicture($userId, $profilePictureURL)) {
        // Delete old profile picture if exists
        if ($oldPicture && file_exists(__DIR__ . '/../../' . $oldPicture)) {
            // Don't delete default pictures
            if (strpos($oldPicture, 'profile_') !== false) {
                @unlink(__DIR__ . '/../../' . $oldPicture);
            }
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Profile picture updated successfully',
            'profilePictureURL' => $profilePictureURL
        ]);
    } else {
        // Delete uploaded file if database update fails
        @unlink($uploadPath);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update database']);
    }
} catch (Exception $e) {
    // Delete uploaded file if error occurs
    if (file_exists($uploadPath)) {
        @unlink($uploadPath);
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
