<?php
// Configuration includes based on your provided guide
require_once __DIR__ . '/../../config/cors.php'; // For CORS headers
require_once __DIR__ . '/../../config/db.php';   // For Database connection
require_once __DIR__ . '/../../models/Dashboard.php'; // For the Dashboard model class

// SSE Headers
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
// This header is often necessary to prevent buffering by reverse proxies (like Nginx)
header("X-Accel-Buffering: no");

// 1. Database Connection
// Ensure the Database class connects and returns a PDO object
$database = new Database();
$pdo = $database->getConnection();
$dashboard = new Dashboard($pdo);

// 2. Continuous Loop for SSE
while (true) {
    // Call the method to get the total collected tuition from the Dashboard model
    $totalCollected = $dashboard->getTotalTuitionCollected();

    // Prepare data to send
    $data = [
        'total_collected' => $totalCollected,
        'timestamp' => time(),
    ];
    
    // Send the data as an SSE message
    echo "data: " . json_encode($data) . "\n\n";
    
    // 3. Flush buffers
    // Ensure the data is sent immediately to the client
    if (ob_get_level() > 0) {
        ob_flush();
    }
    flush();

    // Wait for 5 seconds before checking again (adjust as needed, 1 second is also common)
    sleep(5);
}