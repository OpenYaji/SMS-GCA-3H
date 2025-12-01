<?php
class Announcement
{
    private $conn;
    private $table = 'announcement';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll($category = null, $limit = null)
    {
        $query = "SELECT 
                    a.AnnouncementID as id,
                    a.Title as title,
                    a.Content as fullContent,
                    a.Summary as summary,
                    a.Category as category,
                    a.BannerURL as imageUrl,
                    DATE_FORMAT(a.PublishDate, '%Y-%m-%d') as publishDate,
                    DATE_FORMAT(a.ExpiryDate, '%Y-%m-%d') as expiryDate,
                    a.IsPinned as isPinned,
                    a.TargetAudience as targetAudience,
                    CONCAT(p.FirstName, ' ', p.LastName) as authorName
                  FROM " . $this->table . " a
                  LEFT JOIN user u ON a.AuthorUserID = u.UserID
                  LEFT JOIN profile p ON u.UserID = p.UserID
                  WHERE a.IsActive = 1 
                  AND (a.ExpiryDate IS NULL OR a.ExpiryDate > NOW())
                  AND (a.TargetAudience = 'All Users' OR a.TargetAudience = 'Students')";

        if ($category && $category !== 'All') {
            $query .= " AND a.Category = :category";
        }

        $query .= " ORDER BY a.IsPinned DESC, a.PublishDate DESC";

        if ($limit) {
            $query .= " LIMIT :limit";
        }

        $stmt = $this->conn->prepare($query);

        if ($category && $category !== 'All') {
            $stmt->bindParam(':category', $category);
        }

        if ($limit) {
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id)
    {
        $query = "SELECT 
                    a.AnnouncementID as id,
                    a.Title as title,
                    a.Content as fullContent,
                    a.Summary as summary,
                    a.Category as category,
                    a.BannerURL as imageUrl,
                    DATE_FORMAT(a.PublishDate, '%Y-%m-%d') as publishDate,
                    DATE_FORMAT(a.ExpiryDate, '%Y-%m-%d') as expiryDate,
                    a.IsPinned as isPinned,
                    a.TargetAudience as targetAudience,
                    CONCAT(p.FirstName, ' ', p.LastName) as authorName
                  FROM " . $this->table . " a
                  LEFT JOIN user u ON a.AuthorUserID = u.UserID
                  LEFT JOIN profile p ON u.UserID = p.UserID
                  WHERE a.AnnouncementID = :id 
                  AND a.IsActive = 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}