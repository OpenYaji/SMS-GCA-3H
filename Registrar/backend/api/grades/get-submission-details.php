<?php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get submission ID
    if (!isset($_GET['submissionId'])) {
        throw new Exception('Missing required parameter: submissionId');
    }
    
    $submissionId = (int)$_GET['submissionId'];
    
    // Get submission details
    $subQuery = "
        SELECT gs.*, s.SectionName, gl.LevelName, gl.GradeLevelID
        FROM gradesubmission gs
        JOIN section s ON gs.SectionID = s.SectionID
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        WHERE gs.SubmissionID = :submissionId
    ";
    $subStmt = $db->prepare($subQuery);
    $subStmt->bindParam(':submissionId', $submissionId, PDO::PARAM_INT);
    $subStmt->execute();
    $submission = $subStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$submission) {
        throw new Exception('Submission not found');
    }
    
    // Get all students with their grades for this section and quarter
    $gradesQuery = "
        SELECT 
            sp.StudentProfileID,
            CONCAT(p.LastName, ', ', p.FirstName, ' ', IFNULL(p.MiddleName, '')) as StudentName,
            sp.StudentNumber,
            sub.SubjectID,
            sub.SubjectName,
            sub.SubjectCode,
            g.GradeValue,
            g.Remarks
        FROM enrollment e
        JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN subject sub ON sub.GradeLevelID = :gradeLevelId AND sub.IsActive = 1
        LEFT JOIN grade g ON g.EnrollmentID = e.EnrollmentID 
            AND g.SubjectID = sub.SubjectID 
            AND g.Quarter = :quarter
        WHERE e.SectionID = :sectionId
        AND e.SchoolYearID = :schoolYearId
        ORDER BY p.LastName, p.FirstName, sub.SubjectName
    ";
    
    $gradesStmt = $db->prepare($gradesQuery);
    $gradesStmt->bindParam(':gradeLevelId', $submission['GradeLevelID'], PDO::PARAM_INT);
    $gradesStmt->bindParam(':quarter', $submission['Quarter'], PDO::PARAM_STR);
    $gradesStmt->bindParam(':sectionId', $submission['SectionID'], PDO::PARAM_INT);
    $gradesStmt->bindParam(':schoolYearId', $submission['SchoolYearID'], PDO::PARAM_INT);
    $gradesStmt->execute();
    $grades = $gradesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Organize grades by student
    $students = [];
    foreach ($grades as $grade) {
        $studentId = $grade['StudentProfileID'];
        if (!isset($students[$studentId])) {
            $students[$studentId] = [
                'id' => $studentId,
                'name' => trim($grade['StudentName']),
                'studentNumber' => $grade['StudentNumber'],
                'subjects' => []
            ];
        }
        $students[$studentId]['subjects'][] = [
            'id' => $grade['SubjectID'],
            'name' => $grade['SubjectName'],
            'code' => $grade['SubjectCode'],
            'grade' => $grade['GradeValue'],
            'remarks' => $grade['Remarks']
        ];
    }
    
    // Calculate averages for each student
    foreach ($students as &$student) {
        $validGrades = array_filter($student['subjects'], function($s) {
            return $s['grade'] !== null;
        });
        
        if (count($validGrades) > 0) {
            $total = array_sum(array_column($validGrades, 'grade'));
            $student['average'] = round($total / count($validGrades), 2);
        } else {
            $student['average'] = null;
        }
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'submission' => [
                'id' => $submission['SubmissionID'],
                'sectionName' => $submission['SectionName'],
                'gradeLevel' => $submission['LevelName'],
                'quarter' => $submission['Quarter'],
                'status' => $submission['SubmissionStatus'],
                'submittedDate' => $submission['SubmittedDate'],
                'totalStudents' => $submission['TotalStudents'],
                'teacherNotes' => $submission['TeacherNotes']
            ],
            'students' => array_values($students)
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
