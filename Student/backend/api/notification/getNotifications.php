<?php
session_start();

require_once __DIR__ . '/../../controllers/NotificationController.php';

header("Content-Type: application/json; charset=UTF-8");

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

$controller = new NotificationController();
$controller->getNotifications();

?>