<?php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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
    
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // Validate required fields
    if (!isset($data->submissionId) || !isset($data->action)) {
        throw new Exception('Missing required fields: submissionId, action');
    }
    
    $submissionId = (int)$data->submissionId;
    $action = $data->action; // 'approve' or 'reject'
    $notes = isset($data->notes) ? trim($data->notes) : null;
    $registrarUserId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    if (!in_array($action, ['approve', 'reject'])) {
        throw new Exception('Invalid action. Must be "approve" or "reject"');
    }
    
    $db->beginTransaction();
    
    // Get the submission
    $getQuery = "SELECT * FROM gradesubmission WHERE SubmissionID = :submissionId";
    $getStmt = $db->prepare($getQuery);
    $getStmt->bindParam(':submissionId', $submissionId, PDO::PARAM_INT);
    $getStmt->execute();
    $submission = $getStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$submission) {
        throw new Exception('Submission not found');
    }
    
    if ($submission['SubmissionStatus'] === 'Released') {
        throw new Exception('This submission has already been approved');
    }
    
    if (!in_array($submission['SubmissionStatus'], ['Submitted', 'Resubmitted'])) {
        throw new Exception('Only submitted grades can be approved or rejected');
    }
    
    // Update submission status
    $newStatus = ($action === 'approve') ? 'Released' : 'Rejected';
    
    $updateQuery = "
        UPDATE gradesubmission 
        SET SubmissionStatus = :status,
            ReviewedByUserID = :userId,
            ReviewedDate = NOW(),
            RegistrarNotes = :notes
        WHERE SubmissionID = :submissionId
    ";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':status', $newStatus, PDO::PARAM_STR);
    $updateStmt->bindParam(':userId', $registrarUserId, PDO::PARAM_INT);
    $updateStmt->bindParam(':notes', $notes, PDO::PARAM_STR);
    $updateStmt->bindParam(':submissionId', $submissionId, PDO::PARAM_INT);
    $updateStmt->execute();
    
    // If approved, update the grade status for all grades in this submission
    if ($action === 'approve') {
        $updateGradesQuery = "
            UPDATE grade g
            JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
            SET g.GradeStatusID = (SELECT StatusID FROM gradestatus WHERE StatusName = 'Approved' LIMIT 1)
            WHERE e.SectionID = :sectionId
            AND e.SchoolYearID = :schoolYearId
            AND g.Quarter = :quarter
            AND g.GradeValue IS NOT NULL
        ";
        $updateGradesStmt = $db->prepare($updateGradesQuery);
        $updateGradesStmt->bindParam(':sectionId', $submission['SectionID'], PDO::PARAM_INT);
        $updateGradesStmt->bindParam(':schoolYearId', $submission['SchoolYearID'], PDO::PARAM_INT);
        $updateGradesStmt->bindParam(':quarter', $submission['Quarter'], PDO::PARAM_STR);
        $updateGradesStmt->execute();
    }
    
    $db->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => $action === 'approve' 
            ? 'Grades approved successfully' 
            : 'Grades rejected. Teacher will be notified.',
        'data' => [
            'submissionId' => $submissionId,
            'newStatus' => $newStatus,
            'reviewedDate' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
