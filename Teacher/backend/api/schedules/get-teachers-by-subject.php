<?php
/**
 * API Endpoint: Get Teachers by Subject
 * Method: GET
 * Returns all teachers who teach a specific subject
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit();
}

$subjectId = $_GET['subjectId'] ?? null;

if (!$subjectId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Subject ID is required.']);
    exit();
}

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

try {
    // Get all teachers who teach this subject
    // This is based on existing schedules in the system
    $query = "
        SELECT DISTINCT
            tp.TeacherProfileID as id,
            CONCAT(p.FirstName, ' ', p.LastName) as name,
            CONCAT(p.LastName, ', ', p.FirstName) as fullName
        FROM classschedule cs
        JOIN teacherprofile tp ON cs.TeacherProfileID = tp.TeacherProfileID
        JOIN profile p ON tp.ProfileID = p.ProfileID
        JOIN user u ON p.UserID = u.UserID
        WHERE cs.SubjectID = :subjectId
            AND u.IsDeleted = 0
            AND (u.UserType = 'Teacher' OR u.UserType = 'Head Teacher')
        ORDER BY p.LastName, p.FirstName
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':subjectId', $subjectId, PDO::PARAM_INT);
    $stmt->execute();
    $teachers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $teachers
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching teachers: ' . $e->getMessage()
    ]);
}
?>
