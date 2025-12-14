<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

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
$requestID = isset($_GET['requestID']) ? (int)$_GET['requestID'] : 0;

if ($requestID === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Request ID is required']);
    exit;
}

try {
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
        echo json_encode(['success' => false, 'message' => 'Student profile not found']);
        exit;
    }

    $controller = new DocumentRequestController($pdo, $student['StudentProfileID']);
    $result = $controller->getRequestDetails($requestID);

    http_response_code($result['success'] ? 200 : 404);
    echo json_encode($result);
} catch (Exception $e) {
    error_log('Request Details API Error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error occurred',
        'error' => $e->getMessage()
    ]);
}
