<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Semaphore credentials
$api_key = "ee4ec741b11ba5243f1f67bc1e173a0d"; // <<< REPLACE THIS!
$sender_name = "FuxDevs";

// Set timezone
date_default_timezone_set('Asia/Manila');

// Default message with current time
$default_message = "Thank you for your service. Scan time: " . date("F j, Y, g:i A");

// Error function
function send_error($message, $status_code = 400) {
    http_response_code($status_code);
    echo json_encode(['status' => 'error', 'message' => $message]);
    exit();
}

// Validate POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') send_error("Only POST allowed", 405);
if (empty($_POST['qr_data'])) send_error("Missing 'qr_data'", 400);

$scanned_recipient = trim($_POST['qr_data']);

// Validate PH mobile number
if (!preg_match('/^09\d{9}$/', $scanned_recipient)) {
    send_error("Invalid QR content: must be 09XXXXXXXXX", 400);
}

// Format for Semaphore
$recipient = "+63" . substr($scanned_recipient, 1);

// Send SMS via Semaphore API
$url = 'https://api.semaphore.co/api/v4/messages';
$data = [
    'apikey' => $api_key,
    'number' => $recipient,
    'message' => $default_message,
    'sendername' => $sender_name
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/x-www-form-urlencoded'
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    $error_msg = curl_error($ch);
    curl_close($ch);
    send_error("cURL Error: " . $error_msg, 500);
}
curl_close($ch);

// Process response
$result = json_decode($response, true);
if ($http_code >= 200 && $http_code < 300) {
    http_response_code(200);
    echo $response;
} else {
    $error_message = "Semaphore API Error (HTTP {$http_code}): " . (isset($result['message']) ? $result['message'] : 'Unknown error.');
    send_error($error_message, $http_code >= 400 ? $http_code : 500);
}
?>
