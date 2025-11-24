<?php
session_start();

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../controllers/DocumentRequestController.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated. Please log in.']);
    exit;
}

$userID = $_SESSION['user_id'];

try {
    // Check if database connection exists
    if (!$pdo) {
        throw new Exception('Database connection failed');
    }

    // Get StudentProfileID from UserID
    $query = "SELECT sp.StudentProfileID 
              FROM studentprofile sp
              JOIN profile p ON sp.ProfileID = p.ProfileID
              WHERE p.UserID = :userID";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    $stmt->execute();

    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Student profile not found for user ID: ' . $userID]);
        exit;
    }

    $controller = new DocumentRequestController($pdo, $student['StudentProfileID']);
    $result = $controller->getRequests();

    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result);
} catch (Exception $e) {
    error_log('Document Request API Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
