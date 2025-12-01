<?php
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

try {
    // First, let's check if we have any students with enrollment
    $checkStudent = $pdo->query("
        SELECT 
            sp.StudentProfileID, 
            sp.StudentNumber, 
            sp.QRCodeID, 
            CONCAT(p.FirstName, ' ', p.LastName) AS studentName,
            e.SectionID
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        LEFT JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        ORDER BY e.EnrollmentID DESC
        LIMIT 1
    ");

    $student = $checkStudent->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        echo json_encode([
            "success" => false,
            "message" => "No students found in database. Please add a student first."
        ]);
        exit;
    }

    // Get or create class schedule
    $scheduleID = null;
    $sectionID = $student['SectionID'];

    if ($sectionID) {
        // Check for existing schedule
        $scheduleStmt = $pdo->prepare("
            SELECT ScheduleID 
            FROM classschedule 
            WHERE SectionID = ? 
            LIMIT 1
        ");
        $scheduleStmt->execute([$sectionID]);
        $schedule = $scheduleStmt->fetch(PDO::FETCH_ASSOC);

        if ($schedule) {
            $scheduleID = $schedule['ScheduleID'];
        } else {
            // Create a default schedule
            $createSchedule = $pdo->prepare("
                INSERT INTO classschedule 
                (SectionID, SubjectID, DayOfWeek, StartTime, EndTime, ScheduleStatusID) 
                VALUES (?, 1, 'Monday', '07:00:00', '17:00:00', 1)
            ");
            $createSchedule->execute([$sectionID]);
            $scheduleID = $pdo->lastInsertId();
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Student is not enrolled in any section. Please enroll the student first.",
            "student" => $student
        ]);
        exit;
    }

    // Check if attendance record already exists for today
    $today = date('Y-m-d');
    $checkAttendance = $pdo->prepare("
        SELECT * FROM attendance 
        WHERE StudentProfileID = ? 
        AND AttendanceDate = ?
    ");
    $checkAttendance->execute([$student['StudentProfileID'], $today]);

    if ($checkAttendance->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Attendance already exists for {$student['studentName']} today",
            "student" => $student
        ]);
        exit;
    }

    // Insert first attendance record
    $currentTime = date('Y-m-d H:i:s');
    $insertStmt = $pdo->prepare("
        INSERT INTO attendance 
        (StudentProfileID, ClassScheduleID, AttendanceDate, CheckInTime, AttendanceStatus, AttendanceMethodID) 
        VALUES (?, ?, ?, ?, 'Present', 2)
    ");

    $insertStmt->execute([
        $student['StudentProfileID'],
        $scheduleID,
        $today,
        $currentTime
    ]);

    echo json_encode([
        "success" => true,
        "message" => "First attendance record created successfully!",
        "student" => $student,
        "attendance" => [
            "AttendanceID" => $pdo->lastInsertId(),
            "AttendanceDate" => $today,
            "CheckInTime" => $currentTime,
            "AttendanceStatus" => "Present",
            "ClassScheduleID" => $scheduleID
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
