<?php
// backend/api/announcement/getAnnouncements.php
require_once __DIR__ . '/../../controllers/AnnouncementController.php';

$controller = new AnnouncementController();

// Determine the request method and route accordingly
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $controller->getAnnouncementById($_GET['id']);
        } else {
            $controller->getAnnouncements();
        }
        break;
    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
        break;
}
?>