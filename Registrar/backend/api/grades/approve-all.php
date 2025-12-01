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
    if (!isset($data->submissionIds) || !is_array($data->submissionIds)) {
        throw new Exception('Missing required field: submissionIds (array)');
    }
    
    $submissionIds = $data->submissionIds;
    $notes = isset($data->notes) ? trim($data->notes) : null;
    $registrarUserId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    if (empty($submissionIds)) {
        throw new Exception('No submissions selected');
    }
    
    $db->beginTransaction();
    
    $approvedCount = 0;
    $skippedCount = 0;
    
    foreach ($submissionIds as $submissionId) {
        $submissionId = (int)$submissionId;
        
        // Get the submission
        $getQuery = "SELECT * FROM gradesubmission WHERE SubmissionID = :submissionId";
        $getStmt = $db->prepare($getQuery);
        $getStmt->bindParam(':submissionId', $submissionId, PDO::PARAM_INT);
        $getStmt->execute();
        $submission = $getStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$submission) {
            $skippedCount++;
            continue;
        }
        
        // Skip if already approved or not in submitted state
        if ($submission['SubmissionStatus'] === 'Approved' || 
            !in_array($submission['SubmissionStatus'], ['Submitted', 'Resubmitted'])) {
            $skippedCount++;
            continue;
        }
        
        // Update submission status
        $updateQuery = "
            UPDATE gradesubmission 
            SET SubmissionStatus = 'Approved',
                ReviewedByUserID = :userId,
                ReviewedDate = NOW(),
                RegistrarNotes = :notes
            WHERE SubmissionID = :submissionId
        ";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':userId', $registrarUserId, PDO::PARAM_INT);
        $updateStmt->bindParam(':notes', $notes, PDO::PARAM_STR);
        $updateStmt->bindParam(':submissionId', $submissionId, PDO::PARAM_INT);
        $updateStmt->execute();
        
        // Update grade status for all grades in this submission
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
        
        $approvedCount++;
    }
    
    $db->commit();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "Successfully approved {$approvedCount} submission(s)" . 
                     ($skippedCount > 0 ? ". {$skippedCount} skipped (already approved or not submitted)." : "."),
        'data' => [
            'approvedCount' => $approvedCount,
            'skippedCount' => $skippedCount
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
