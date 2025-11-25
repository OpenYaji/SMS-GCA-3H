<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Notification.php';

class NotificationController
{
    private $db;
    private $notification;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->notification = new Notification($this->db);
    }

    public function getNotifications()
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');

        $userId = isset($_GET['userId']) ? (int)$_GET['userId'] : null;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

        if (!$userId) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'User ID is required'
            ]);
            return;
        }

        try {
            $notifications = $this->notification->getByUserId($userId, $limit);
            $unreadCount = $this->notification->getUnreadCount($userId);

            // Convert isRead to boolean and ensure proper structure
            foreach ($notifications as &$notif) {
                $notif['isRead'] = (bool)$notif['isRead'];
                // Ensure message exists, fallback to title if not
                if (empty($notif['message']) && !empty($notif['title'])) {
                    $notif['message'] = $notif['title'];
                }
            }

            echo json_encode([
                'success' => true,
                'data' => [
                    'notifications' => $notifications,
                    'unreadCount' => (int)$unreadCount
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch notifications',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function markAsRead()
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST');

        $data = json_decode(file_get_contents('php://input'), true);
        $notificationId = isset($data['notificationId']) ? (int)$data['notificationId'] : null;
        $userId = isset($data['userId']) ? (int)$data['userId'] : null;

        if (!$notificationId || !$userId) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Notification ID and User ID are required'
            ]);
            return;
        }

        try {
            $result = $this->notification->markAsRead($notificationId, $userId);

            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Notification marked as read'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to mark notification as read'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to mark notification as read',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function markAllAsRead()
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST');

        $data = json_decode(file_get_contents('php://input'), true);
        $userId = isset($data['userId']) ? (int)$data['userId'] : null;

        if (!$userId) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'User ID is required'
            ]);
            return;
        }

        try {
            $result = $this->notification->markAllAsRead($userId);

            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'All notifications marked as read'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to mark all notifications as read'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to mark all notifications as read',
                'error' => $e->getMessage()
            ]);
        }
    }
}
