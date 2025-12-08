<?php
// get-archived-grades.php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "
        SELECT CONCAT(p.FirstName, ' ', p.LastName) as studentName,
               gl.LevelName as gradeLevel,
               sy.YearName as schoolYear,
               AVG(g.GradeValue) as finalAverage,
               MAX(g.LastModified) as releasedDate
        FROM grade g
        JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
        JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN section s ON e.SectionID = s.SectionID
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
        WHERE g.GradeStatusID = (SELECT StatusID FROM gradestatus WHERE StatusName = 'Released')
        GROUP BY e.StudentProfileID, e.SchoolYearID
        ORDER BY releasedDate DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $archived = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data
    foreach ($archived as &$record) {
        $record['finalAverage'] = round($record['finalAverage'], 2);
        $record['releasedDate'] = date('Y-m-d', strtotime($record['releasedDate']));
    }
    
    echo json_encode([
        'success' => true,
        'data' => $archived
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>