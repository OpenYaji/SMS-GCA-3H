<?php
// 1. Load CORS first (Must be at the very top)
require_once __DIR__ . '/../../config/cors.php';

try {
    // 2. Include dependencies
    if (!file_exists(__DIR__ . '/../../config/db.php')) {
        throw new Exception("Missing db.php file");
    }
    if (!file_exists(__DIR__ . '/../../controllers/TransactionController.php')) {
        throw new Exception("Missing TransactionController.php file");
    }

    require_once __DIR__ . '/../../config/db.php';
    require_once __DIR__ . '/../../controllers/TransactionController.php';

    // 3. Connect to Database
    $database = new Database();
    $db = $database->getConnection();

    // 4. Run Controller
    $controller = new TransactionController($db);
    $controller->getPendingPayments();

} catch (Exception $e) {
    // Catch any PHP errors and return them as JSON
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server Error: ' . $e->getMessage()
    ]);
}
?>