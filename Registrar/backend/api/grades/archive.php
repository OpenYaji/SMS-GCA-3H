<?php
// File: api/registrar/grade_submissions_archive.php

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
    
    // Get filter parameters
    $schoolYearId = isset($_GET['schoolYearId']) ? (int)$_GET['schoolYearId'] : null;
    $gradingPeriod = isset($_GET['gradingPeriod']) ? $_GET['gradingPeriod'] : '';
    $gradeLevel = isset($_GET['gradeLevel']) ? $_GET['gradeLevel'] : '';
    $status = isset($_GET['status']) ? $_GET['status'] : '';
    
    // Build query to fetch grade submissions for INACTIVE school years
    $query = "
        SELECT 
            gs.SubmissionID,
            gs.SectionID,
            gs.SchoolYearID,
            gs.Quarter,
            gs.SubmissionStatus,
            gs.SubmittedDate,
            gs.TotalStudents,
            gs.StudentsWithGrades,
            gs.ReviewedDate,
            gs.RegistrarNotes,
            gs.TeacherNotes,
            s.SectionName,
            gl.LevelName as GradeLevel,
            gl.GradeLevelID,
            sy.YearName,
            CONCAT(p.FirstName, ' ', p.LastName) as SubmittedBy,
            CONCAT(tp.FirstName, ' ', tp.LastName) as AdviserName
        FROM gradesubmission gs
        JOIN section s ON gs.SectionID = s.SectionID
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        JOIN schoolyear sy ON gs.SchoolYearID = sy.SchoolYearID
        LEFT JOIN user u ON gs.SubmittedByUserID = u.UserID
        LEFT JOIN profile p ON u.UserID = p.ProfileID -- Adjusted for common practice, check your schema
        LEFT JOIN teacherprofile tprof ON s.AdviserTeacherID = tprof.TeacherProfileID
        LEFT JOIN profile tp ON tprof.ProfileID = tp.ProfileID
        WHERE sy.IsActive = 0 -- <<< KEY CHANGE: Fetching from inactive school years
    ";
    
    $params = [];
    
    // Apply filters
    if ($schoolYearId) {
        $query .= " AND gs.SchoolYearID = :schoolYearId";
        $params[':schoolYearId'] = $schoolYearId;
    }

    if (!empty($gradingPeriod)) {
        // ... (quarter mapping logic here, same as your original script)
        $quarterMap = [
            'Q1' => 'First Quarter', 'Q2' => 'Second Quarter', 'Q3' => 'Third Quarter', 'Q4' => 'Fourth Quarter',
            'First Quarter' => 'First Quarter', 'Second Quarter' => 'Second Quarter', 
            'Third Quarter' => 'Third Quarter', 'Fourth Quarter' => 'Fourth Quarter'
        ];
        $quarterValue = isset($quarterMap[$gradingPeriod]) ? $quarterMap[$gradingPeriod] : $gradingPeriod;
        $query .= " AND gs.Quarter = :quarter";
        $params[':quarter'] = $quarterValue;
    }
    
    if (!empty($gradeLevel)) {
        $query .= " AND gl.LevelName = :gradeLevel";
        $params[':gradeLevel'] = $gradeLevel;
    }
    
    if (!empty($status)) {
        $query .= " AND gs.SubmissionStatus = :status";
        $params[':status'] = $status;
    }
    
    $query .= " ORDER BY sy.YearName DESC, gs.SubmittedDate DESC";
    
    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data for frontend (same as your original script)
    $formattedSubmissions = [];
    $quarterMapShort = [
        'First Quarter' => 'Q1', 'Second Quarter' => 'Q2', 
        'Third Quarter' => 'Q3', 'Fourth Quarter' => 'Q4'
    ];
    
    foreach ($submissions as $sub) {
        $formattedSubmissions[] = [
            'id' => $sub['SubmissionID'],
            'sectionId' => $sub['SectionID'],
            'teacher' => $sub['AdviserName'] ?: $sub['SubmittedBy'] ?: 'Unknown',
            'submittedBy' => $sub['SubmittedBy'],
            'gradeLevel' => $sub['GradeLevel'],
            'section' => $sub['SectionName'],
            'studentCount' => $sub['TotalStudents'],
            'studentsWithGrades' => $sub['StudentsWithGrades'],
            'gradingPeriod' => $quarterMapShort[$sub['Quarter']] ?? $sub['Quarter'],
            'quarter' => $sub['Quarter'],
            'status' => $sub['SubmissionStatus'],
            'submittedDate' => $sub['SubmittedDate'] ? date('Y-m-d', strtotime($sub['SubmittedDate'])) : null,
            'submittedDateTime' => $sub['SubmittedDate'],
            'reviewedDate' => $sub['ReviewedDate'],
            'registrarNotes' => $sub['RegistrarNotes'],
            'teacherNotes' => $sub['TeacherNotes'],
            'schoolYear' => $sub['YearName'] // Important: Display the School Year
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $formattedSubmissions,
        // Optional: Include a list of INACTIVE School Years for filter dropdown
        'schoolYears' => $db->query("SELECT SchoolYearID as id, YearName as name FROM schoolyear WHERE IsActive = 0 ORDER BY YearName DESC")->fetchAll(PDO::FETCH_ASSOC)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>