<?php
// 1. ENABLE DEBUGGING (Remove this line when deploying)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// 2. INCLUDE CORS (Critical for React)
// We assume this file is in: backend/api/academics/
require_once __DIR__ . '/../../config/cors.php';

// 3. INCLUDE CONTROLLER
require_once __DIR__ . '/../../controllers/GradeController.php';

header("Content-Type: application/json; charset=UTF-8");

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

// Initialize controller and call method
$controller = new GradeController();
$controller->getAcademicSummary();
?>