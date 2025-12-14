<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/../../config/cors.php';
    require_once __DIR__ . '/../../config/db.php';
    require_once __DIR__ . '/../../controllers/DocumentRequestController.php';

    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }

    $userID = $_SESSION['user_id'];

    // Check if database connection exists
    if (!isset($pdo) || !$pdo) {
        throw new Exception('Database connection failed');
    }

    // Get student profile and current grade level from enrollment
    $query = "SELECT 
                sp.StudentProfileID,
                sp.StudentStatus,
                gl.LevelName as GradeLevel
              FROM studentprofile sp
              INNER JOIN profile p ON sp.ProfileID = p.ProfileID
              LEFT JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID 
                  AND e.SchoolYearID = (SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1)
              LEFT JOIN section s ON e.SectionID = s.SectionID
              LEFT JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
              WHERE p.UserID = :userID";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':userID', $userID, PDO::PARAM_INT);
    $stmt->execute();

    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        http_response_code(404);
        echo json_encode([
            'success' => false, 
            'message' => 'Student profile not found'
        ]);
        exit;
    }

    $controller = new DocumentRequestController($pdo, $student['StudentProfileID']);
    $result = $controller->getRequests();

    if ($result['success']) {
        $result['studentInfo'] = [
            'gradeLevel' => $student['GradeLevel'] ?? 'Not Enrolled',
            'status' => $student['StudentStatus'] ?? 'Active'
        ];
    }

    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result);
    
} catch (PDOException $e) {
    error_log('Database Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage(),
        'code' => $e->getCode()
    ]);
} catch (Exception $e) {
    error_log('Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}
