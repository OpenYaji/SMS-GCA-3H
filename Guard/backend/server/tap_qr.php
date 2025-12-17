<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

// Check DB Connection
if (!isset($pdo) || $pdo === null) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

//Semaphore SMS API credentials

/*
$api_key = "";
$sender_name = "";
 */

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
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json', 'Content-Type: application/x-www-form-urlencoded']);
    
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}
*/

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $qrCodeId = $_POST['qr_data'] ?? '';

    if (empty($qrCodeId)) {
        echo json_encode(["success" => false, "message" => "No QR code provided"]);
        exit;
    }

    try {
        // 1. Fetch student info
        $stmt = $pdo->prepare("
            SELECT 
                sp.StudentProfileID, sp.StudentNumber, sp.QRCodeID, 
                CONCAT(p.FirstName, ' ', p.LastName) AS studentName,
                CAST(p.EncryptedPhoneNumber AS CHAR CHARACTER SET utf8mb4) AS PhoneNumber,
                e.SectionID
            FROM studentprofile sp
            JOIN profile p ON sp.ProfileID = p.ProfileID
            LEFT JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
            WHERE sp.QRCodeID = ?
            ORDER BY e.EnrollmentID DESC
            LIMIT 1
        ");

        $stmt->execute([$qrCodeId]);
        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$student) {
            echo json_encode(["success" => false, "message" => "Student not found"]);
            exit;
        }

        $studentProfileID = $student['StudentProfileID'];
        $sectionID = $student['SectionID'];
        $today = date('Y-m-d');
        $currentTime = date('Y-m-d H:i:s');

        // 2. Find ANY Active Schedule for this Section
        if (!$sectionID) {
            echo json_encode(["success" => false, "message" => "Student is not enrolled in a section."]);
            exit;
        }

        // MODIFIED QUERY: Removed "AND ScheduleStatusID = 1"
        // Now it just grabs the latest schedule created for this section.
        $scheduleStmt = $pdo->prepare("
            SELECT ScheduleID 
            FROM classschedule 
            WHERE SectionID = ? 
            ORDER BY ScheduleID DESC 
            LIMIT 1
        ");
        $scheduleStmt->execute([$sectionID]);
        $schedule = $scheduleStmt->fetch(PDO::FETCH_ASSOC);

        if (!$schedule) {
            // This only happens if the 'classschedule' table is completely empty for this section
            echo json_encode([
                "success" => false, 
                "message" => "No class schedule found for this section (Section ID: $sectionID). Please create at least one schedule."
            ]);
            exit;
        }

        $scheduleID = $schedule['ScheduleID'];

        // 3. Check Attendance (Check In / Check Out Logic)
        $checkStmt = $pdo->prepare("
            SELECT AttendanceID, CheckInTime, CheckOutTime 
            FROM attendance 
            WHERE StudentProfileID = ? 
            AND AttendanceDate = ? 
            ORDER BY AttendanceID DESC 
            LIMIT 1
        ");
        $checkStmt->execute([$studentProfileID, $today]);
        $existingAttendance = $checkStmt->fetch(PDO::FETCH_ASSOC);

        $action = '';
        $message = '';
        
        $phone = $student['PhoneNumber'] ?? '';
        $recipient = ($phone && strlen($phone) > 1) ? "63" . substr($phone, 1) : '';

        if (!$existingAttendance) {
            // --- SCENARIO A: CHECK IN ---
            $insertStmt = $pdo->prepare("
                INSERT INTO attendance 
                (StudentProfileID, ClassScheduleID, AttendanceDate, CheckInTime, AttendanceStatus, AttendanceMethodID) 
                VALUES (?, ?, ?, ?, 'Present', 2)
            ");
            $insertStmt->execute([$studentProfileID, $scheduleID, $today, $currentTime]);

            $action = 'checked_in';
            $message = "{$student['studentName']} checked in at " . date("h:i A", strtotime($currentTime));
            $smsMessage = "Good day! {$student['studentName']} has checked in at " . date("h:i A");

        } elseif ($existingAttendance['CheckInTime'] && !$existingAttendance['CheckOutTime']) {
            // --- SCENARIO B: CHECK OUT ---
            $updateStmt = $pdo->prepare("
                UPDATE attendance 
                SET CheckOutTime = ? 
                WHERE AttendanceID = ?
            ");
            $updateStmt->execute([$currentTime, $existingAttendance['AttendanceID']]);

            $action = 'checked_out';
            $message = "{$student['studentName']} checked out at " . date("h:i A", strtotime($currentTime));
            $smsMessage = "Good day! {$student['studentName']} has checked out at " . date("h:i A");

        } else {
            // --- SCENARIO C: ALREADY COMPLETED ---
            echo json_encode([
                "success" => true,
                "message" => "{$student['studentName']} has already completed attendance for today.",
                "action" => "already_completed",
                "student" => $student
            ]);
            exit;
        }

        // 4. Send SMS
        if ($recipient && isset($smsMessage)) {
            //$smsResponse = sendSMS($recipient, $smsMessage, $api_key, $sender_name);
        }

        echo json_encode([
            "success" => true,
            "message" => $message,
            "student" => $student,
            "action" => $action,
            "attendance_date" => $today,
            "timestamp" => $currentTime
        ]);

    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid request method"]);
?>