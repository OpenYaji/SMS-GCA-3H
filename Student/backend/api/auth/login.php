<?php
-
session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../controllers/AuthController.php';

header("Content-Type: application/json; charset=UTF-8");


$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed.']);
    exit();
}

$authController = new AuthController($db);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed.']);
    exit();
}
// ... imports ...

$input_data = json_decode(file_get_contents("php://input"));

// Change 'username' validation if needed, but 'username' covers all IDs
if (!isset($input_data->username) || !isset($input_data->password)) {
    http_response_code(400); 
    echo json_encode(['message' => 'Missing credentials.']);
    exit();
}

// Rename variable for clarity
$identifier = trim(htmlspecialchars(strip_tags($input_data->username)));
$password = $input_data->password;

$result = $authController->login($identifier, $password);

// ... rest of the file
if ($result['success']) {
    http_response_code(200);
    echo json_encode($result);
    error_log("Login successful for user: ");
} else {
    http_response_code(401); 
    echo json_encode(['message' => $result['message']]);
}
?>