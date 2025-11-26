<?php

session_start();

require_once __DIR__ . '/../../controllers/TransactionController.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

$controller = new TransactionController();
$controller->getPaymentData();
