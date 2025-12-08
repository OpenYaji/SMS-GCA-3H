<?php
// verify-submission.php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    $submissionId = (int)$data->submissionId;
    $action = $data->action; // 'approve' or 'reject'
    
    $db->beginTransaction();
    
    // Get submission details
    $query = "SELECT gs.*, s.GradeLevelID 
              FROM gradesubmission gs
              JOIN section s ON gs.SectionID = s.SectionID
              WHERE gs.SubmissionID = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $submissionId);
    $stmt->execute();
    $submission = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$submission) {
        throw new Exception('Submission not found');
    }
    
    // STRICT VALIDATION
    if ($action === 'approve') {
        // Check for missing students
        $checkStudents = "
            SELECT COUNT(DISTINCT e.StudentProfileID) as enrolled,
                   COUNT(DISTINCT CASE WHEN g.GradeValue IS NOT NULL THEN e.StudentProfileID END) as with_grades
            FROM enrollment e
            LEFT JOIN grade g ON e.EnrollmentID = g.EnrollmentID 
                AND g.Quarter = :quarter
                AND g.SubjectID IN (SELECT SubjectID FROM subject WHERE GradeLevelID = :gradeLevelId)
            WHERE e.SectionID = :sectionId
            AND e.SchoolYearID = :schoolYearId";
        
        $checkStmt = $db->prepare($checkStudents);
        $checkStmt->bindParam(':quarter', $submission['Quarter']);
        $checkStmt->bindParam(':gradeLevelId', $submission['GradeLevelID']);
        $checkStmt->bindParam(':sectionId', $submission['SectionID']);
        $checkStmt->bindParam(':schoolYearId', $submission['SchoolYearID']);
        $checkStmt->execute();
        $counts = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($counts['enrolled'] != $counts['with_grades']) {
            throw new Exception('VALIDATION FAILED: Missing grades for ' . 
                ($counts['enrolled'] - $counts['with_grades']) . ' student(s)');
        }
        
        // Check for invalid grades (>100 or <=0)
        $checkInvalid = "
            SELECT COUNT(*) as invalid_count
            FROM grade g
            JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
            WHERE e.SectionID = :sectionId
            AND e.SchoolYearID = :schoolYearId
            AND g.Quarter = :quarter
            AND (g.GradeValue > 100 OR g.GradeValue <= 0)";
        
        $invalidStmt = $db->prepare($checkInvalid);
        $invalidStmt->bindParam(':sectionId', $submission['SectionID']);
        $invalidStmt->bindParam(':schoolYearId', $submission['SchoolYearID']);
        $invalidStmt->bindParam(':quarter', $submission['Quarter']);
        $invalidStmt->execute();
        $invalidResult = $invalidStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($invalidResult['invalid_count'] > 0) {
            throw new Exception('VALIDATION FAILED: Found ' . $invalidResult['invalid_count'] . 
                ' invalid grade(s). Grades must be between 1-100');
        }
        
        // Check for failing grades (<=74)
        $checkFailing = "
            SELECT COUNT(*) as failing_count
            FROM grade g
            JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
            WHERE e.SectionID = :sectionId
            AND e.SchoolYearID = :schoolYearId
            AND g.Quarter = :quarter
            AND g.GradeValue <= 74";
        
        $failStmt = $db->prepare($checkFailing);
        $failStmt->bindParam(':sectionId', $submission['SectionID']);
        $failStmt->bindParam(':schoolYearId', $submission['SchoolYearID']);
        $failStmt->bindParam(':quarter', $submission['Quarter']);
        $failStmt->execute();
        $failResult = $failStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($failResult['failing_count'] > 0) {
            throw new Exception('VALIDATION FAILED: Found ' . $failResult['failing_count'] . 
                ' failing grade(s) (≤74). Review required');
        }
        
        // All validations passed - approve and LOCK
        $updateSubmission = "
            UPDATE gradesubmission 
            SET SubmissionStatus = 'Approved',
                ReviewedByUserID = :userId,
                ReviewedDate = NOW()
            WHERE SubmissionID = :id";
        
        $updateStmt = $db->prepare($updateSubmission);
        $updateStmt->bindParam(':userId', $_SESSION['user_id']);
        $updateStmt->bindParam(':id', $submissionId);
        $updateStmt->execute();
        
        // Lock all grades - set to Approved status
        $lockGrades = "
            UPDATE grade g
            JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
            SET g.GradeStatusID = (SELECT StatusID FROM gradestatus WHERE StatusName = 'Approved' LIMIT 1)
            WHERE e.SectionID = :sectionId
            AND e.SchoolYearID = :schoolYearId
            AND g.Quarter = :quarter";
        
        $lockStmt = $db->prepare($lockGrades);
        $lockStmt->bindParam(':sectionId', $submission['SectionID']);
        $lockStmt->bindParam(':schoolYearId', $submission['SchoolYearID']);
        $lockStmt->bindParam(':quarter', $submission['Quarter']);
        $lockStmt->execute();
        
        $db->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Grades verified and locked successfully'
        ]);
    } else {
        // Reject submission
        $updateSubmission = "
            UPDATE gradesubmission 
            SET SubmissionStatus = 'Rejected',
                ReviewedByUserID = :userId,
                ReviewedDate = NOW()
            WHERE SubmissionID = :id";
        
        $updateStmt = $db->prepare($updateSubmission);
        $updateStmt->bindParam(':userId', $_SESSION['user_id']);
        $updateStmt->bindParam(':id', $submissionId);
        $updateStmt->execute();
        
        $db->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Submission rejected successfully'
        ]);
    }
    
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>