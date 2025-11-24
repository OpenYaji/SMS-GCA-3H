<?php
class Notification
{
    private $conn;
    private $table = 'notification';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getByUserId($userId, $limit = 10)
    {
        $query = "SELECT 
                    n.NotificationID as id,
                    n.Message as message,
                    n.Type as type,
                    n.IsRead as isRead,
                    n.RelatedEntityType as relatedEntityType,
                    n.RelatedEntityID as relatedEntityId,
                    DATE_FORMAT(n.CreatedAt, '%Y-%m-%d %H:%i:%s') as createdAt,
                    CASE
                        WHEN TIMESTAMPDIFF(MINUTE, n.CreatedAt, NOW()) < 1 THEN 'Just now'
                        WHEN TIMESTAMPDIFF(MINUTE, n.CreatedAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, n.CreatedAt, NOW()), 'm ago')
                        WHEN TIMESTAMPDIFF(HOUR, n.CreatedAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, n.CreatedAt, NOW()), 'h ago')
                        ELSE CONCAT(TIMESTAMPDIFF(DAY, n.CreatedAt, NOW()), 'd ago')
                    END as timeAgo
                  FROM " . $this->table . " n
                  WHERE n.UserID = :userId
                  ORDER BY n.CreatedAt DESC
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
                  WHERE UserID = :userId AND IsRead = 0";

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
                  WHERE NotificationID = :notificationId AND UserID = :userId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':notificationId', $notificationId, PDO::PARAM_INT);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function markAllAsRead($userId)
    {
        $query = "UPDATE " . $this->table . " 
                  SET IsRead = 1 
                  WHERE UserID = :userId AND IsRead = 0";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
