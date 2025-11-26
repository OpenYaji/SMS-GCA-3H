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
                    a.IsPinned as isPinned,
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
                    a.IsPinned as isPinned,
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

    public function create($data)
    {
        $query = "INSERT INTO " . $this->table . "
                  (AuthorUserID, Title, Content, Summary, Category, BannerURL, PublishDate, TargetAudience, IsPinned, IsActive)
                  VALUES 
                  (:authorUserId, :title, :content, :summary, :category, :bannerUrl, :publishDate, :targetAudience, :isPinned, 1)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':authorUserId', $data['authorUserId']);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':content', $data['content']);
        $stmt->bindParam(':summary', $data['summary']);
        $stmt->bindParam(':category', $data['category']);
        $stmt->bindParam(':bannerUrl', $data['bannerUrl']);
        $stmt->bindParam(':publishDate', $data['publishDate']);
        $stmt->bindParam(':targetAudience', $data['targetAudience']);
        $stmt->bindParam(':isPinned', $data['isPinned']);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }
}
