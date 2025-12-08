<?php
// release-grades.php
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
    $studentId = (int)$data->studentId;
    
    $db->beginTransaction();
    
    // Update grade status to Released
    $query = "
        UPDATE grade g
        JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
        SET g.GradeStatusID = (SELECT StatusID FROM gradestatus WHERE StatusName = 'Released')
        WHERE e.StudentProfileID = :studentId
        AND g.GradeStatusID = (SELECT StatusID FROM gradestatus WHERE StatusName = 'Approved')";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':studentId', $studentId);
    $stmt->execute();
    
    $db->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Grades released to student account'
    ]);
    
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