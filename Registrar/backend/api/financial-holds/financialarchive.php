<?php
/**
 * API Endpoint: /api/financial-holds/archive
 * Handles CORS and routes requests to get archived financial hold statistics.
 */

// 1. CORS Headers
header('Access-Control-Allow-Origin: http://localhost:5174'); // Specify your exact frontend origin
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Dependencies (Ensure these paths are correct relative to this file)
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../controllers/FinancialHoldController.php';

try {
    // 3. Initialization
    $database = new Database();
    $db = $database->getConnection();
    $controller = new FinancialHoldController($db);

    // 4. Router Logic: CRITICAL - Call the ARCHIVE holds method
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $controller->getArchiveFinancialHolds();
    } else {
        // Method Not Allowed
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed. This endpoint only supports GET requests.'
        ]);
    }
} catch (Throwable $e) {
    // 5. Global Error Handling
    error_log("Archive Endpoint Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error. Please check logs.'
    ]);
}

exit();