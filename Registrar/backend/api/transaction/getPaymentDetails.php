<?php
// 1. Load CORS
require_once __DIR__ . '/../../config/cors.php';

// 2. Load DB & Controller
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../controllers/TransactionController.php';

try {
    // 3. Connect to Database
    $database = new Database();
    $db = $database->getConnection();

    // 4. Pass DB to Controller
    $controller = new TransactionController($db);

    // 5. Run Method
    $controller->getPaymentDetails();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>