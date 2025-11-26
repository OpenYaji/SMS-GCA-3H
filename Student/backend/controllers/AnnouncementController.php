<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Announcement.php';

class AnnouncementController
{
    private $db;
    private $announcement;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->announcement = new Announcement($this->db);
    }

    public function getAnnouncements()
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');

        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;

        try {
            $announcements = $this->announcement->getAll($category, $limit);

            // Convert isPinned to boolean
            foreach ($announcements as &$announcement) {
                $announcement['isPinned'] = (bool)$announcement['isPinned'];
            }

            echo json_encode([
                'success' => true,
                'data' => $announcements
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch announcements',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function getAnnouncementById($id)
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');

        try {
            $announcement = $this->announcement->getById($id);

            if ($announcement) {
                $announcement['isPinned'] = (bool)$announcement['isPinned'];
                echo json_encode([
                    'success' => true,
                    'data' => $announcement
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Announcement not found'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch announcement',
                'error' => $e->getMessage()
            ]);
        }
    }
}
