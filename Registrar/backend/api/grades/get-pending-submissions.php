<?php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "
        SELECT gs.SubmissionID as id,
               CONCAT(p.FirstName, ' ', p.LastName) as teacherName,
               s.SectionName as sectionName,
               gl.LevelName as gradeLevel,
               gs.Quarter as quarter,
               gs.TotalStudents as totalStudents,
               gs.StudentsWithGrades as studentsWithGrades,
               gs.SubmittedDate as submittedDate
        FROM gradesubmission gs
        JOIN section s ON gs.SectionID = s.SectionID
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        JOIN teacherprofile tp ON s.AdviserTeacherID = tp.TeacherProfileID
        JOIN profile p ON tp.ProfileID = p.ProfileID
        WHERE gs.SubmissionStatus = 'Submitted'
        ORDER BY gs.SubmittedDate DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $submissions
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>