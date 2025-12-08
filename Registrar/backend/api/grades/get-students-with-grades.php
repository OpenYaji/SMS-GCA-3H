<?php
// get-students-with-grades.php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get students with verified grades
    $query = "
        SELECT DISTINCT sp.StudentProfileID as id,
               CONCAT(p.FirstName, ' ', p.LastName) as name,
               sp.StudentNumber as studentNumber
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        JOIN grade g ON e.EnrollmentID = g.EnrollmentID
        WHERE g.GradeStatusID = (SELECT StatusID FROM gradestatus WHERE StatusName = 'Approved')
        AND sp.StudentStatus = 'Enrolled'
        ORDER BY p.LastName, p.FirstName";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $students
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>