<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/mailer.php';

try {
    $db = new Database();
    $conn = $db->getConnection();

    $data = json_decode(file_get_contents("php://input"), true);
    $applicantId = $data['applicantId'] ?? null;

    if (!$applicantId) {
        throw new Exception("Applicant ID is required");
    }

    // Get applicant details
    $stmt = $conn->prepare("
        SELECT 
            a.ApplicationID,
            a.TrackingNumber,
            a.StudentFirstName,
            a.StudentLastName,
            a.EmailAddress,
            a.GuardianFirstName,
            a.GuardianLastName,
            a.GuardianEmail,
            a.EnrolleeType,
            g.LevelName as GradeLevel
        FROM application a
        LEFT JOIN gradelevel g ON a.ApplyingForGradeLevelID = g.GradeLevelID
        WHERE a.ApplicationID = ?
    ");
    $stmt->execute([$applicantId]);
    $applicant = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$applicant) {
        throw new Exception("Applicant not found");
    }

    // Update status to "Approved"
    $updateStmt = $conn->prepare("
        UPDATE application
        SET ApplicationStatus = 'Approved'
        WHERE ApplicationID = ?
    ");
    $updateStmt->execute([$applicantId]);

    // Send approval notification email
    $mailer = new Mailer();
    $emailData = [
        'trackingNumber' => $applicant['TrackingNumber'],
        'studentName' => trim($applicant['StudentFirstName'] . ' ' . $applicant['StudentLastName']),
        'guardianName' => trim($applicant['GuardianFirstName'] . ' ' . $applicant['GuardianLastName']),
        'gradeLevel' => $applicant['GradeLevel'],
        'studentEmail' => $applicant['StudentEmail'] ?? null
    ];

    $emailSent = $mailer->sendApprovalNotification($applicant['GuardianEmail'], $emailData);

    echo json_encode([
        "success" => true,
        "message" => "Applicant validated successfully",
        "emailSent" => $emailSent,
        "data" => [
            "id" => $applicant['ApplicationID'],
            "name" => $emailData['studentName'],
            "status" => "Approved"
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>