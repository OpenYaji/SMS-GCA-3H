<?php

session_start();

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
$controller->getPreviousGrades();

?>