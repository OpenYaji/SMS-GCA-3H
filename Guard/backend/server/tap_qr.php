<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

// Check DB Connection
if (!isset($pdo) || $pdo === null) {
    echo json_encode([
        "success" => false, 
        "message" => "Database connection failed"
    ]);
    exit;
}

// Semaphore SMS Settings
$api_key = "ee4ec741b11ba5243f1f67bc1e173a0d";
$sender_name = "FuxDevs";

function sendSMS($recipient, $message, $api_key, $sender_name) {
    $url = 'https://api.semaphore.co/api/v4/messages';
    $data = [
        'apikey' => $api_key,
        'number' => $recipient,
        'message' => $message,
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
    curl_close($ch);
    return $response;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $qrCodeId = $_POST['qr_data'] ?? '';

    if (empty($qrCodeId)) {
        echo json_encode(["success" => false, "message" => "No QR code provided"]);
        exit;
    }

    try {
        // Fetch student info only — NO ATTENDANCE
        $stmt = $pdo->prepare("
            SELECT 
                sp.StudentProfileID,
                sp.StudentNumber,
                sp.QRCodeID,
                sp.DateOfBirth,
                sp.Gender,
                sp.Nationality,
                CONCAT(p.FirstName, ' ', p.LastName) AS studentName,
                CAST(p.EncryptedPhoneNumber AS CHAR CHARACTER SET utf8mb4) AS PhoneNumber
            FROM studentprofile sp
            JOIN profile p ON sp.ProfileID = p.ProfileID
            WHERE sp.QRCodeID = ?;
        ");
        
        $stmt->execute([$qrCodeId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Format phone
            $phone = $row['PhoneNumber'] ?? '';
            $recipient = ($phone && strlen($phone) > 1) ? "63" . substr($phone, 1) : '';

            // Create message — just text only
            $message = "{$row['studentName']} tapped at " . date("Y-m-d H:i:s");

            // Optional SMS sending
            if ($recipient) {
                $smsResponse = sendSMS($recipient, $message, $api_key, $sender_name);
                file_put_contents("sms_log.txt", $smsResponse . PHP_EOL, FILE_APPEND);                
            }

            echo json_encode([
                "success" => true,
                "message" => $message,
                "student" => $row,
                "action" => "tap_only_display"
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Student not found"]);
        }
        
    } catch (Exception $e) {
        echo json_encode([
            "success" => false, 
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid request method"]);
?>
