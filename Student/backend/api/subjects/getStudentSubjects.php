<?php
session_start();

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/SubjectController.php';

header("Content-Type: application/json; charset=UTF-8");

// Debug logging
error_log("=== Subject API Called ===");
error_log("Session user_id: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'NOT SET'));
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

// Initialize controller and call method
$controller = new SubjectController();
$controller->getStudentSubjects();
