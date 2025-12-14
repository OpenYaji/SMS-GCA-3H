<?php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/Dashboard.php';

// TODO: Re-enable when login is fixed
// session_start();
// if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Registrar') {
//     echo "event: error\n";
//     echo "data: " . json_encode(['error' => 'Unauthorized']) . "\n\n";
//     exit;
// }

$database = new Database();
$pdo = $database->getConnection();
$dashboard = new Dashboard($pdo);

while (true) {
    $count = $dashboard->getPendingApplicationsCount();

    echo "data: " . json_encode([
        'pending_applications' => $count,
        'timestamp' => date('Y-m-d H:i:s')
    ]) . "\n\n";

    ob_flush();
    flush();

    sleep(5);

    if (connection_aborted()) {
        break;
    }
}
