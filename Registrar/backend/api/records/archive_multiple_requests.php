<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);
$requestIds = $data['requestIds'] ?? [];

if (empty($requestIds)) {
    echo json_encode(['success' => false, 'error' => 'No request IDs provided']);
    exit;
}

try {
    $placeholders = str_repeat('?,', count($requestIds) - 1) . '?';
    $sql = "UPDATE document_requests SET status = 'Archived', archived_date = NOW() 
            WHERE id IN ($placeholders)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($requestIds);

    echo json_encode([
        'success' => true,
        'message' => count($requestIds) . ' request(s) archived successfully'
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
