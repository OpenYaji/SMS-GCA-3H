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

$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->prepare("
        SELECT 
            st.TicketID,
            st.Subject,
            st.TicketStatus,
            st.TicketPriority,
            st.CreatedAt,
            DATE_FORMAT(st.CreatedAt, '%b %d, %Y') as FormattedDate,
            (SELECT COUNT(*) FROM ticketmessage WHERE TicketID = st.TicketID) as MessageCount
        FROM supportticket st
        WHERE st.UserID = :user_id
        ORDER BY st.CreatedAt DESC
    ");
    $stmt->bindParam(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->execute();

    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'tickets' => $tickets
    ]);
} catch (Exception $e) {
    error_log("Get tickets error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error occurred.']);
}
