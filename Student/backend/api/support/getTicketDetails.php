<?php
session_start();

require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit();
}

$ticketId = $_GET['ticketId'] ?? null;

if (!$ticketId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ticket ID is required.']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    // Get ticket details
    $stmt = $db->prepare("
        SELECT 
            st.*,
            CONCAT(p.FirstName, ' ', p.LastName) as UserName
        FROM supportticket st
        JOIN user u ON st.UserID = u.UserID
        JOIN profile p ON u.UserID = p.UserID
        WHERE st.TicketID = :ticket_id AND st.UserID = :user_id
    ");
    $stmt->bindParam(':ticket_id', $ticketId, PDO::PARAM_INT);
    $stmt->bindParam(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->execute();

    $ticket = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$ticket) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Ticket not found.']);
        exit();
    }

    // Get ticket messages
    $stmt = $db->prepare("
        SELECT 
            tm.*,
            CONCAT(p.FirstName, ' ', p.LastName) as SenderName,
            sf.OriginalFileName,
            sf.StoredFileName
        FROM ticketmessage tm
        JOIN user u ON tm.SenderUserID = u.UserID
        JOIN profile p ON u.UserID = p.UserID
        LEFT JOIN securefile sf ON tm.AttachmentFileID = sf.FileID
        WHERE tm.TicketID = :ticket_id
        ORDER BY tm.SentAt ASC
    ");
    $stmt->bindParam(':ticket_id', $ticketId, PDO::PARAM_INT);
    $stmt->execute();

    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'ticket' => $ticket,
        'messages' => $messages
    ]);
} catch (Exception $e) {
    error_log("Get ticket details error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error occurred.']);
}
