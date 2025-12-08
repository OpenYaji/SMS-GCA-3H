<?php
// api/grades/get-student-report-cards.php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

if (!isset($_GET['studentId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Student ID required']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    $studentId = (int)$_GET['studentId'];
    
    // Get student info
    $studentQuery = "
        SELECT 
            CONCAT(p.FirstName, ' ', p.LastName) as fullName,
            sp.StudentNumber,
            gl.LevelName as gradeLevel,
            s.SectionName,
            sy.YearName as schoolYear
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
        JOIN section s ON e.SectionID = s.SectionID
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
        WHERE sp.StudentProfileID = :studentId
        AND sy.IsActive = 1";
    
    $stmt = $db->prepare($studentQuery);
    $stmt->bindParam(':studentId', $studentId);
    $stmt->execute();
    $studentInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$studentInfo) {
        throw new Exception('Student not found');
    }
    
    // Get grades (only Approved grades)
    $gradesQuery = "
        SELECT 
            sub.SubjectName,
            sub.SubjectCode,
            g.Quarter,
            g.GradeValue,
            gs.StatusName
        FROM grade g
        JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
        JOIN subject sub ON g.SubjectID = sub.SubjectID
        JOIN gradestatus gs ON g.GradeStatusID = gs.StatusID
        WHERE e.StudentProfileID = :studentId
        AND gs.StatusName = 'Approved'
        ORDER BY sub.SubjectName, g.Quarter";
    
    $stmt = $db->prepare($gradesQuery);
    $stmt->bindParam(':studentId', $studentId);
    $stmt->execute();
    $grades = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Organize grades by subject
    $organized = [];
    foreach ($grades as $grade) {
        $subjectKey = $grade['SubjectCode'];
        if (!isset($organized[$subjectKey])) {
            $organized[$subjectKey] = [
                'subjectName' => $grade['SubjectName'],
                'subjectCode' => $grade['SubjectCode'],
                'quarters' => []
            ];
        }
        $organized[$subjectKey]['quarters'][$grade['Quarter']] = $grade['GradeValue'];
    }
    
    // Calculate averages
    foreach ($organized as &$subject) {
        $quarterGrades = array_values($subject['quarters']);
        $subject['average'] = count($quarterGrades) > 0 ? 
            round(array_sum($quarterGrades) / count($quarterGrades), 2) : 0;
    }
    
    echo json_encode([
        'success' => true,
        'student' => $studentInfo,
        'grades' => array_values($organized)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>