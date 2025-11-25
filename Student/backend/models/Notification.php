<?php
class Notification
{
    private $conn;
    private $table = 'notificationlog';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getByUserId($userId, $limit = 10)
    {
        $query = "SELECT 
                    n.LogID as id,
                    n.Title as title,
                    n.Message as message,
                    n.IsRead as isRead,
                    n.NotificationStatus as status,
                    DATE_FORMAT(n.SentAt, '%Y-%m-%d %H:%i:%s') as sentAt,
                    CASE
                        WHEN TIMESTAMPDIFF(MINUTE, n.SentAt, NOW()) < 1 THEN 'Just now'
                        WHEN TIMESTAMPDIFF(MINUTE, n.SentAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, n.SentAt, NOW()), 'm ago')
                        WHEN TIMESTAMPDIFF(HOUR, n.SentAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, n.SentAt, NOW()), 'h ago')
                        ELSE CONCAT(TIMESTAMPDIFF(DAY, n.SentAt, NOW()), 'd ago')
                    END as timeAgo
                  FROM " . $this->table . " n
                  WHERE n.RecipientUserID = :userId
                  ORDER BY n.SentAt DESC
                  LIMIT :limit";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUnreadCount($userId)
    {
        $query = "SELECT COUNT(*) as count 
                  FROM " . $this->table . " 
                  WHERE RecipientUserID = :userId AND IsRead = 0";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }

    public function markAsRead($notificationId, $userId)
    {
        $query = "UPDATE " . $this->table . " 
                  SET IsRead = 1 
                  WHERE LogID = :notificationId AND RecipientUserID = :userId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':notificationId', $notificationId, PDO::PARAM_INT);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function markAllAsRead($userId)
    {
        $query = "UPDATE " . $this->table . " 
                  SET IsRead = 1 
                  WHERE RecipientUserID = :userId AND IsRead = 0";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
