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

function sendSMS($recipient, $message, $api_key, $sender_name)
{
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
        // Fetch student info with their enrollment and section
        $stmt = $pdo->prepare("
            SELECT 
                sp.StudentProfileID,
                sp.StudentNumber,
                sp.QRCodeID,
                sp.DateOfBirth,
                sp.Gender,
                sp.Nationality,
                CONCAT(p.FirstName, ' ', p.LastName) AS studentName,
                p.FirstName,
                p.LastName,
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

        // Get or create a default class schedule for this section
        $scheduleID = null;

        if ($sectionID) {
            // Try to find an existing active schedule for today
            $scheduleStmt = $pdo->prepare("
                SELECT ScheduleID 
                FROM classschedule 
                WHERE SectionID = ? 
                AND ScheduleStatusID = 1
                LIMIT 1
            ");
            $scheduleStmt->execute([$sectionID]);
            $schedule = $scheduleStmt->fetch(PDO::FETCH_ASSOC);

            if ($schedule) {
                $scheduleID = $schedule['ScheduleID'];
            } else {
                // Create a default schedule if none exists
                $createSchedule = $pdo->prepare("
                    INSERT INTO classschedule 
                    (SectionID, SubjectID, DayOfWeek, StartTime, EndTime, ScheduleStatusID) 
                    VALUES (?, 1, 'Monday', '07:00:00', '17:00:00', 1)
                ");
                $createSchedule->execute([$sectionID]);
                $scheduleID = $pdo->lastInsertId();
            }
        }

        // If still no schedule, use NULL (will need to modify attendance table constraint)
        if (!$scheduleID) {
            echo json_encode([
                "success" => false,
                "message" => "No class schedule found for student. Please contact admin."
            ]);
            exit;
        }

        // Check if there's an existing attendance record for today
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
            // First tap of the day - CHECK IN
            $insertStmt = $pdo->prepare("
                INSERT INTO attendance 
                (StudentProfileID, ClassScheduleID, AttendanceDate, CheckInTime, AttendanceStatus, AttendanceMethodID) 
                VALUES (?, ?, ?, ?, 'Present', 2)
            ");
            $insertStmt->execute([$studentProfileID, $scheduleID, $today, $currentTime]);

            $action = 'checked_in';
            $message = "{$student['studentName']} checked in at " . date("h:i A", strtotime($currentTime));

            // Send SMS notification for check-in
            if ($recipient) {
                $smsMessage = "Good day! {$student['studentName']} has checked in at " . date("h:i A");
                $smsResponse = sendSMS($recipient, $smsMessage, $api_key, $sender_name);
                file_put_contents("sms_log.txt", date('Y-m-d H:i:s') . " - Check In: " . $smsResponse . PHP_EOL, FILE_APPEND);
            }
        } elseif ($existingAttendance['CheckInTime'] && !$existingAttendance['CheckOutTime']) {
            // Already checked in, now CHECK OUT
            $updateStmt = $pdo->prepare("
                UPDATE attendance 
                SET CheckOutTime = ? 
                WHERE AttendanceID = ?
            ");
            $updateStmt->execute([$currentTime, $existingAttendance['AttendanceID']]);

            $action = 'checked_out';
            $message = "{$student['studentName']} checked out at " . date("h:i A", strtotime($currentTime));

            // Send SMS notification for check-out
            if ($recipient) {
                $smsMessage = "Good day! {$student['studentName']} has checked out at " . date("h:i A");
                $smsResponse = sendSMS($recipient, $smsMessage, $api_key, $sender_name);
                file_put_contents("sms_log.txt", date('Y-m-d H:i:s') . " - Check Out: " . $smsResponse . PHP_EOL, FILE_APPEND);
            }
        } else {
            // Already checked in AND checked out today
            $action = 'already_completed';
            $message = "{$student['studentName']} has already completed check-in and check-out for today";
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
        echo json_encode([
            "success" => false,
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid request method"]);
