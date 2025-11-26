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

    // Get applicant details before updating
    $stmt = $conn->prepare("
        SELECT 
            a.ApplicationID,
            a.TrackingNumber,
            a.StudentFirstName,
            a.StudentLastName,
            a.StudentMiddleName,
            a.EmailAddress as StudentEmail,
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

    // Update status to "For Review"
    $updateStmt = $conn->prepare("
        UPDATE application
        SET ApplicationStatus = 'For Review'
        WHERE ApplicationID = ?
    ");
    $updateStmt->execute([$applicantId]);

    // Determine required documents based on enrollee type
    $requiredDocuments = [];
    $enrolleeType = strtolower($applicant['EnrolleeType']);
    
    if (strpos($enrolleeType, 'new') !== false) {
        $requiredDocuments = [
            'Birth Certificate (PSA)',
            'Report Card (Form 138)',
            'Good Moral Certificate',
            'Certificate of Completion',
            'Form 137'
        ];
    } elseif (strpos($enrolleeType, 'transf') !== false) {
        $requiredDocuments = [
            'Birth Certificate (PSA)',
            'Good Moral Certificate',
            'Certificate of Completion',
            'Form 137'
        ];
    } elseif (strpos($enrolleeType, 'old') !== false || strpos($enrolleeType, 'return') !== false) {
        $requiredDocuments = [
            'Report Card (Form 138)'
        ];
    }

    // Send screening notification email
    $mailer = new Mailer();
    $emailData = [
        'trackingNumber' => $applicant['TrackingNumber'],
        'studentName' => trim($applicant['StudentFirstName'] . ' ' . $applicant['StudentLastName']),
        'guardianName' => trim($applicant['GuardianFirstName'] . ' ' . $applicant['GuardianLastName']),
        'gradeLevel' => $applicant['GradeLevel'],
        'enrolleeType' => $applicant['EnrolleeType'],
        'requiredDocuments' => $requiredDocuments,
        'studentEmail' => $applicant['StudentEmail'] ?? null
    ];

    $emailSent = $mailer->sendScreeningNotification($applicant['GuardianEmail'], $emailData);

    echo json_encode([
        "success" => true,
        "message" => "Applicant moved to screening stage",
        "emailSent" => $emailSent
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>