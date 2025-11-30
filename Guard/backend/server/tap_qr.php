<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
error_reporting(0);

$host = "localhost";
$user = "root";
$pass = "aggabaorenz";
$db   = "guard_db";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// Semaphore credentials
/* $api_key = "ee4ec741b11ba5243f1f67bc1e173a0d"; // replace with your real key
$sender_name = "FuxDevs";
 */
// SMS helper
/* function sendSMS($recipient, $message, $api_key, $sender_name) {
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
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $qrCodeId = $_POST['qr_data'] ?? '';

    if (!$qrCodeId) {
        echo json_encode(["success" => false, "message" => "No QR code provided"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT studentName, StudentNumber, QRCodeID, DateOfBirth, Gender, Nationality, PhoneNumber, TapTimeIn, TapTimeOut 
                            FROM student_profiles WHERE QRCodeID = ?");
    $stmt->bind_param("s", $qrCodeId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $phone = $row['PhoneNumber'];
        $recipient = "+63" . substr($phone, 1); // format PH number

        if (empty($row['TapTimeIn'])) {
            // First tap → record TapTimeIn
            $update = $conn->prepare("UPDATE student_profiles SET TapTimeIn = NOW() WHERE QRCodeID = ?");
            $update->bind_param("s", $qrCodeId);
            $update->execute();
            $row['TapTimeIn'] = date("Y-m-d H:i:s");
            $message = "Tap Time In recorded for {$row['studentName']} at {$row['TapTimeIn']}";

            $smsResponse = sendSMS($recipient, $message, $api_key, $sender_name);

            echo json_encode(["success" => true, "message" => $message, "student" => $row, "sms" => $smsResponse]);
        } elseif (empty($row['TapTimeOut'])) {
            // Second tap → record TapTimeOut
            $update = $conn->prepare("UPDATE student_profiles SET TapTimeOut = NOW() WHERE QRCodeID = ?");
            $update->bind_param("s", $qrCodeId);
            $update->execute();
            $row['TapTimeOut'] = date("Y-m-d H:i:s");
            $message = "Tap Time Out recorded for {$row['studentName']} at {$row['TapTimeOut']}";

            $smsResponse = sendSMS($recipient, $message, $api_key, $sender_name);

            echo json_encode(["success" => true, "message" => $message, "student" => $row, "sms" => $smsResponse]);
        } else {
            echo json_encode(["success" => false, "message" => "Already tapped in and out", "student" => $row]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Student not found"]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid request"]);
?>
