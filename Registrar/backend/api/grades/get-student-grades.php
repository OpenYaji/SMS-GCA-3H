<?php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $studentId = (int)$_GET['studentId'];
    
    $query = "
        SELECT s.SubjectName as subject,
               g.Quarter as quarter,
               g.GradeValue as grade
        FROM grade g
        JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
        JOIN subject s ON g.SubjectID = s.SubjectID
        WHERE e.StudentProfileID = :studentId
        AND g.GradeStatusID = (SELECT StatusID FROM gradestatus WHERE StatusName = 'Approved')
        ORDER BY g.Quarter, s.SubjectName";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':studentId', $studentId);
    $stmt->execute();
    $grades = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $grades
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>