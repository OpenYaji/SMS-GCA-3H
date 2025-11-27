<?php
/**
 * Verify Subject Assignment - Check what subjects are assigned to a student
 * Place in: api/applicants/verifySubjectAssignment.php
 * Access: http://localhost/SMS-GCA-3H/Registrar/backend/api/applicants/verifySubjectAssignment.php?enrollmentId=12
 */

error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

try {
    require_once __DIR__ . '/../../config/database.php';
    
    $db = new Database();
    $conn = $db->getConnection();

    // Get enrollment ID from query string
    $enrollmentId = isset($_GET['enrollmentId']) ? intval($_GET['enrollmentId']) : null;
    
    if (!$enrollmentId) {
        throw new Exception("Please provide enrollmentId parameter");
    }

    // Get enrollment details
    $enrollmentQuery = $conn->prepare("
        SELECT 
            e.EnrollmentID,
            e.StudentProfileID,
            e.EnrollmentDate,
            sp.StudentNumber,
            p.FirstName,
            p.LastName,
            gl.LevelName as GradeLevel,
            s.SectionName,
            sy.YearName as SchoolYear
        FROM enrollment e
        JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN section s ON e.SectionID = s.SectionID
        JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
        WHERE e.EnrollmentID = ?
    ");
    $enrollmentQuery->execute([$enrollmentId]);
    $enrollment = $enrollmentQuery->fetch(PDO::FETCH_ASSOC);

    if (!$enrollment) {
        throw new Exception("Enrollment not found");
    }

    // Get assigned subjects with grades
    $subjectsQuery = $conn->prepare("
        SELECT 
            g.GradeID,
            s.SubjectID,
            s.SubjectName,
            s.SubjectCode,
            g.Quarter,
            g.GradeValue,
            g.Remarks,
            gs.StatusName as GradeStatus
        FROM grade g
        JOIN subject s ON g.SubjectID = s.SubjectID
        LEFT JOIN gradestatus gs ON g.GradeStatusID = gs.StatusID
        WHERE g.EnrollmentID = ?
        ORDER BY s.SubjectID, 
                 FIELD(g.Quarter, 'First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter')
    ");
    $subjectsQuery->execute([$enrollmentId]);
    $grades = $subjectsQuery->fetchAll(PDO::FETCH_ASSOC);

    // Group grades by subject
    $subjectSummary = [];
    foreach ($grades as $grade) {
        $subjectId = $grade['SubjectID'];
        if (!isset($subjectSummary[$subjectId])) {
            $subjectSummary[$subjectId] = [
                'subjectName' => $grade['SubjectName'],
                'subjectCode' => $grade['SubjectCode'],
                'quarters' => []
            ];
        }
        $subjectSummary[$subjectId]['quarters'][] = [
            'quarter' => $grade['Quarter'],
            'grade' => $grade['GradeValue'],
            'remarks' => $grade['Remarks'],
            'status' => $grade['GradeStatus']
        ];
    }

    // Get available subjects for this grade level
    $availableSubjectsQuery = $conn->prepare("
        SELECT SubjectID, SubjectName, SubjectCode
        FROM subject
        WHERE GradeLevelID = (
            SELECT GradeLevelID 
            FROM section 
            WHERE SectionID = (
                SELECT SectionID 
                FROM enrollment 
                WHERE EnrollmentID = ?
            )
        ) AND IsActive = 1
        ORDER BY SubjectID
    ");
    $availableSubjectsQuery->execute([$enrollmentId]);
    $availableSubjects = $availableSubjectsQuery->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "Subject assignment verification",
        "data" => [
            "enrollment" => $enrollment,
            "assigned_subjects" => array_values($subjectSummary),
            "total_assigned" => count($subjectSummary),
            "available_subjects" => $availableSubjects,
            "total_available" => count($availableSubjects),
            "all_grades" => $grades
        ]
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>