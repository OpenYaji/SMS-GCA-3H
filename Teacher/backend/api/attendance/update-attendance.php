<?php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header("Content-Type: application/json; charset=UTF-8");

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in.'
    ]);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit();
}

try {
    // Get database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($input['studentId']) || !isset($input['status']) || !isset($input['date'])) {
        throw new Exception('Student ID, status, and date are required');
    }
    
    $studentId = (int)$input['studentId'];
    $status = $input['status'];
    $attendanceDate = $input['date'];
    $notes = isset($input['notes']) ? $input['notes'] : null;
    
    // Validate status
    $validStatuses = ['Present', 'Absent', 'Late', 'Excused'];
    if (!in_array($status, $validStatuses)) {
        throw new Exception('Invalid attendance status');
    }
    
    // Get teacher profile ID
    $teacherQuery = "
        SELECT tp.TeacherProfileID 
        FROM teacherprofile tp
        JOIN profile p ON tp.ProfileID = p.ProfileID
        WHERE p.UserID = :userId
    ";
    $stmt = $db->prepare($teacherQuery);
    $stmt->bindParam(':userId', $_SESSION['user_id']);
    $stmt->execute();
    $teacher = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $teacherProfileId = $teacher ? (int)$teacher['TeacherProfileID'] : 0;
    
    // Get the ClassScheduleID for this student and teacher
    // First, verify/get the student's section
    if (isset($input['sectionId'])) {
        $sectionId = (int)$input['sectionId'];
        
        // Verify student is enrolled in this section
        $checkEnrollment = "
            SELECT EnrollmentID 
            FROM enrollment 
            WHERE StudentProfileID = :studentId 
            AND SectionID = :sectionId
            LIMIT 1
        ";
        $stmt = $db->prepare($checkEnrollment);
        $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $stmt->execute();
        
        if (!$stmt->fetch()) {
             throw new Exception('Student is not enrolled in the specified section');
        }
    } else {
        // Fallback: Find any section the student is enrolled in (Risky if multiple enrollments)
        $sectionQuery = "
            SELECT e.SectionID
            FROM enrollment e
            WHERE e.StudentProfileID = :studentId
            LIMIT 1
        ";
        $stmt = $db->prepare($sectionQuery);
        $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
        $stmt->execute();
        $enrollment = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$enrollment) {
            throw new Exception('Student enrollment not found');
        }
        
        $sectionId = (int)$enrollment['SectionID'];
    }
    
    // Now get the schedule for this section and teacher
    $schedule = false;
    if ($teacherProfileId) {
        $scheduleQuery = "
            SELECT cs.ScheduleID 
            FROM classschedule cs
            WHERE cs.SectionID = :sectionId
            AND cs.TeacherProfileID = :teacherId
            LIMIT 1
        ";
        $stmt = $db->prepare($scheduleQuery);
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $stmt->bindParam(':teacherId', $teacherProfileId, PDO::PARAM_INT);
        $stmt->execute();
        $schedule = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // If no schedule found for this teacher, try to find any schedule for this section
    if (!$schedule) {
        $anyScheduleQuery = "SELECT ScheduleID FROM classschedule WHERE SectionID = :sectionId LIMIT 1";
        $stmt = $db->prepare($anyScheduleQuery);
        $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
        $stmt->execute();
        $anySchedule = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($anySchedule) {
            $classScheduleId = (int)$anySchedule['ScheduleID'];
        } else {
            // If still no schedule, we cannot link attendance to a schedule
            // Check if we can insert null (assuming nullable) or throw error
            // For now, let's throw a descriptive error
            throw new Exception('No class schedule found for this section. Please create a schedule first.');
        }
    } else {
        $classScheduleId = (int)$schedule['ScheduleID'];
    }
    
    // Check if attendance record already exists
    $checkQuery = "
        SELECT AttendanceID 
        FROM attendance 
        WHERE StudentProfileID = :studentId 
        AND DATE(AttendanceDate) = :attendanceDate
    ";
    $stmt = $db->prepare($checkQuery);
    $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
    $stmt->bindParam(':attendanceDate', $attendanceDate, PDO::PARAM_STR);
    $stmt->execute();
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing) {
        // Update existing record
        $updateQuery = "
            UPDATE attendance 
            SET AttendanceStatus = :status,
                Notes = :notes,
                AttendanceMethodID = 1
            WHERE AttendanceID = :attendanceId
        ";  
        $stmt = $db->prepare($updateQuery);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':notes', $notes, PDO::PARAM_STR);
        $stmt->bindParam(':attendanceId', $existing['AttendanceID'], PDO::PARAM_INT);
        $stmt->execute();
        
        $message = 'Attendance updated successfully';
    } else {
        // Insert new record
        $insertQuery = "
            INSERT INTO attendance 
            (StudentProfileID, ClassScheduleID, AttendanceDate, AttendanceStatus, Notes, CheckInTime, AttendanceMethodID)
            VALUES 
            (:studentId, :classScheduleId, :attendanceDate, :status, :notes, NOW(), 1)
        ";
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':studentId', $studentId, PDO::PARAM_INT);
        $stmt->bindParam(':classScheduleId', $classScheduleId, PDO::PARAM_INT);
        $stmt->bindParam(':attendanceDate', $attendanceDate, PDO::PARAM_STR);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':notes', $notes, PDO::PARAM_STR);
        $stmt->execute();
        
        $message = 'Attendance recorded successfully';
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => $message
    ]);
    
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    error_log("SQL State: " . $e->getCode());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("Update Attendance Error: " . $e->getMessage());
    error_log("Input: " . print_r($input, true));
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
