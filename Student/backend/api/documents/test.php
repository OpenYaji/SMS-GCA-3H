<?php
session_start();
header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'Test endpoint working',
    'session' => isset($_SESSION['user_id']) ? 'Logged in' : 'Not logged in',
    'user_id' => $_SESSION['user_id'] ?? null,
    'php_version' => phpversion()
]);
