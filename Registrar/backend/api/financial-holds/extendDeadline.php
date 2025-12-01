<?php
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../controllers/FinancialHoldController.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $controller = new FinancialHoldController($db);

    $controller->extendDeadline();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
