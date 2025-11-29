<?php
// 1. Load CORS
require_once __DIR__ . '/../../config/cors.php';

// 2. Load DB & Controller
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../controllers/TransactionController.php';

// 3. Handle Preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // 4. Connect & Execute
    $database = new Database();
    $db = $database->getConnection();

    $controller = new TransactionController($db);
    $controller->updateVerificationStatus();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>