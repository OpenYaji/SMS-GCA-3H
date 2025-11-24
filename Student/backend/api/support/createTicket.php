<?php
session_start();

require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

// Get form data
$category = $_POST['category'] ?? null;
$message = $_POST['message'] ?? null;
$userId = $_SESSION['user_id'];

if (!$category || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Category and message are required.']);
    exit();
}

try {
    $db->beginTransaction();

    // Insert support ticket
    $stmt = $db->prepare("
        INSERT INTO supportticket (UserID, Subject, TicketStatus, TicketPriority, CreatedAt) 
        VALUES (:user_id, :subject, 'Open', 'Medium', NOW())
    ");
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->bindParam(':subject', $category);
    $stmt->execute();

    $ticketId = $db->lastInsertId();

    // Insert first message
    $stmt = $db->prepare("
        INSERT INTO ticketmessage (TicketID, SenderUserID, Message, SentAt, IsInternal) 
        VALUES (:ticket_id, :user_id, :message, NOW(), 0)
    ");
    $stmt->bindParam(':ticket_id', $ticketId, PDO::PARAM_INT);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->bindParam(':message', $message);
    $stmt->execute();

    // Handle file attachment if present
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['attachment'];
        $uploadDir = __DIR__ . '/../../uploads/tickets/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $storedFileName = uniqid() . '_' . time() . '.' . $fileExtension;
        $filePath = $uploadDir . $storedFileName;

        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            // Store file info in securefile table
            $stmt = $db->prepare("
                INSERT INTO securefile 
                (OriginalFileName, StoredFileName, FilePath, FileSize, MimeType, UploadedByUserID, UploadedAt) 
                VALUES (:original, :stored, :path, :size, :mime, :user_id, NOW())
            ");
            $stmt->bindParam(':original', $file['name']);
            $stmt->bindParam(':stored', $storedFileName);
            $stmt->bindParam(':path', $filePath);
            $stmt->bindParam(':size', $file['size'], PDO::PARAM_INT);
            $stmt->bindParam(':mime', $file['type']);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();

            $fileId = $db->lastInsertId();

            // Update ticket message with attachment
            $stmt = $db->prepare("
                UPDATE ticketmessage 
                SET AttachmentFileID = :file_id 
                WHERE TicketID = :ticket_id AND SenderUserID = :user_id
                ORDER BY SentAt DESC LIMIT 1
            ");
            $stmt->bindParam(':file_id', $fileId, PDO::PARAM_INT);
            $stmt->bindParam(':ticket_id', $ticketId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
        }
    }

    $db->commit();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Ticket created successfully.',
        'ticketId' => $ticketId
    ]);
} catch (Exception $e) {
    $db->rollBack();
    error_log("Create ticket error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error occurred.']);
}
