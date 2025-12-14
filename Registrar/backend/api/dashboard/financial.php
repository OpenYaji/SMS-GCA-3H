<?php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Credentials: true");

require_once '../../config/db.php';

// TODO: Re-enable when login is fixed
// session_start();
// if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Registrar') {
//     echo "event: error\n";
//     echo "data: " . json_encode(['error' => 'Unauthorized']) . "\n\n";
//     exit;
// }

$database = new Database();
$db = $database->getConnection();

while (true) {
    try {
        $query = "
            SELECT 
                COUNT(CASE WHEN (t.TotalAmount - COALESCE((
                    SELECT SUM(pay.AmountPaid) 
                    FROM payment pay 
                    WHERE pay.TransactionID = t.TransactionID 
                    AND pay.VerificationStatus = 'Verified'
                ), 0)) > 0 THEN 1 END) as activeHolds
            FROM transaction t
            JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
            WHERE sy.IsActive = 1
        ";

        $stmt = $db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        echo "data: " . json_encode([
            'financial_holds' => (int)($result['activeHolds'] ?? 0),
            'timestamp' => date('Y-m-d H:i:s')
        ]) . "\n\n";

        ob_flush();
        flush();

        sleep(5);

        if (connection_aborted()) {
            break;
        }
    } catch (Exception $e) {
        error_log("Financial SSE Error: " . $e->getMessage());
        sleep(5);
    }
}
