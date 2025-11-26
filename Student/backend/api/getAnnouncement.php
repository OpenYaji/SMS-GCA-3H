<?php
require_once __DIR__ . '/../controllers/AnnouncementController.php';

$controller = new AnnouncementController();

// Handle GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if requesting a specific announcement
    if (isset($_GET['id'])) {
        $controller->getAnnouncementById($_GET['id']);
    } else {
        $controller->getAnnouncements();
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
