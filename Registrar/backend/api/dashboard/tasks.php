<?php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/Dashboard.php';

$database = new Database();
$db = $database->getConnection();
$dashboard = new Dashboard($db);

while (true) {
    $count = $dashboard->getPendingTasksCount();

    echo "data: " . json_encode([
        'pending_tasks' => $count,
        'timestamp' => date('Y-m-d H:i:s')
    ]) . "\n\n";

    ob_flush();
    flush();

    sleep(5);

    if (connection_aborted()) {
        break;
    }
}
