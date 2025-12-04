<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

require_once __DIR__ . '/../../config/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Not authenticated.'
    ]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $userId = $_SESSION['user_id'];

    // Get student profile ID
    $query = "
        SELECT sp.StudentProfileID 
        FROM studentprofile sp 
        JOIN profile p ON sp.ProfileID = p.ProfileID 
        WHERE p.UserID = :user_id
    ";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Student profile not found.'
        ]);
        exit();
    }

    $studentProfileId = $student['StudentProfileID'];

    // Check if student is currently enrolled (has active school year)
    $enrollmentQuery = "
        SELECT 
            t.TransactionID,
            sy.YearName,
            sy.IsActive
        FROM transaction t
        JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
        WHERE t.StudentProfileID = :student_profile_id
        AND sy.IsActive = 1
        LIMIT 1
    ";

    $stmt = $db->prepare($enrollmentQuery);
    $stmt->bindParam(':student_profile_id', $studentProfileId, PDO::PARAM_INT);
    $stmt->execute();
    $currentEnrollment = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if enrollment is open for next school year
    $nextYearQuery = "
        SELECT 
            EnrollmentOpenDate,
            EnrollmentCloseDate,
            YearName
        FROM schoolyear
        WHERE IsActive = 0
        AND EnrollmentOpenDate IS NOT NULL
        AND CURDATE() BETWEEN EnrollmentOpenDate AND EnrollmentCloseDate
        ORDER BY YearName DESC
        LIMIT 1
    ";

    $stmt = $db->prepare($nextYearQuery);
    $stmt->execute();
    $nextYearEnrollment = $stmt->fetch(PDO::FETCH_ASSOC);

    $isEnrolled = !empty($currentEnrollment);
    $isEnrollmentOpen = !empty($nextYearEnrollment);

    echo json_encode([
        'success' => true,
        'data' => [
            'isEnrolled' => $isEnrolled,
            'isEnrollmentOpen' => $isEnrollmentOpen,
            'currentSchoolYear' => $currentEnrollment ? $currentEnrollment['YearName'] : null,
            'nextSchoolYear' => $nextYearEnrollment ? $nextYearEnrollment['YearName'] : null,
            'enrollmentOpenDate' => $nextYearEnrollment ? $nextYearEnrollment['EnrollmentOpenDate'] : null,
            'enrollmentCloseDate' => $nextYearEnrollment ? $nextYearEnrollment['EnrollmentCloseDate'] : null
        ]
    ]);
} catch (PDOException $e) {
    error_log("Database error in getEnrollmentStatus: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred.'
    ]);
}
