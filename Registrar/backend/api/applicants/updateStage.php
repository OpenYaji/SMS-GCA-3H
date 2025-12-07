<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type");

// Ensure that errors are logged but not visible to the user
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// --- Handle Preflight OPTIONS Request ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); 
    exit();
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/mailer.php';

$applicant = null;
$action = null;
$applicantId = null;
$newStatus = '';
$successMessage = '';
$emailSent = false;

try {
    $db = new Database();
    $conn = $db->getConnection();

    $data = json_decode(file_get_contents("php://input"), true);
    $applicantId = $data['applicantId'] ?? null;
    $action = $data['action'] ?? 'proceed'; 

    if (!$applicantId) {
        throw new Exception("Applicant ID is required");
    }

      // 1. Get applicant details (needed for email)
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
      $mailer = new Mailer();

    // 2. Determine and Update Status (Database Commit)
    if ($action === 'reject') {
        $newStatus = 'Rejected';
        $successMessage = "Applicant rejected successfully.";
    } else { // 'proceed'
        $newStatus = 'For Review';
        $successMessage = "Applicant moved to screening stage.";
    }
    $updateStmt = $conn->prepare("
        UPDATE application
        SET ApplicationStatus = ?
        WHERE ApplicationID = ?
    ");

    $updateStmt->execute([$newStatus, $applicantId]);
        // 3. Send the INSTANT RESPONSE to the User


    echo json_encode([
        "success" => true,
        "message" => $successMessage,
        "emailSent" => false // We don't know yet if the email is successful, but the response is instant
    ]);

     // ⚠️ CRITICAL: CLOSE the connection to the user so they don't have to wait.
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
        error_log("Connection closed to user. Email job running in background.");
    } else {
        // If there is no FPM, it still needs to continue, but there will still be a delay
        error_log("fastcgi_finish_request not available. Proceeding with sync email.");
    }

} catch (Exception $e) {
        // Errors will go here even before the connection is closed
    http_response_code(500);
    error_log("updateStage.php Sync Error (Pre-Close): " . $e->getMessage()); 
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
    exit;
}

// ----------------------------------------------------------------
// --- BACKGROUND EMAIL SENDING (Will run after the response) ---
// ----------------------------------------------------------------

if ($action === 'proceed' && $applicant['GuardianEmail']) {
    
    try {
        // Check if Mailer class exists and initialize again (safety check)
        if (!isset($mailer) && class_exists('Mailer')) {
             $mailer = new Mailer();
        }

        // --- Document Logic (From your working code) ---
        $requiredDocuments = [];
        $enrolleeType = strtolower($applicant['EnrolleeType'] ?? '');
        
        if (strpos($enrolleeType, 'new') !== false) {
            $requiredDocuments = [
                'Birth Certificate (PSA)', 'Report Card (Form 138)', 'Good Moral Certificate', 
                'Certificate of Completion', 'Form 137'
            ];
        } elseif (strpos($enrolleeType, 'transf') !== false) {
            $requiredDocuments = [
                'Birth Certificate (PSA)', 'Good Moral Certificate', 
                'Certificate of Completion', 'Form 137'
            ];
        } elseif (strpos($enrolleeType, 'old') !== false || strpos($enrolleeType, 'return') !== false) {
            $requiredDocuments = [ 'Report Card (Form 138)' ];
        }
        
        $emailData = [
            'trackingNumber' => $applicant['TrackingNumber'],
            'studentName' => trim($applicant['StudentFirstName'] . ' ' . $applicant['StudentLastName']),
            'guardianName' => trim($applicant['GuardianFirstName'] . ' ' . $applicant['GuardianLastName']),
            'gradeLevel' => $applicant['GradeLevel'],
            'enrolleeType' => $applicant['EnrolleeType'],
            'requiredDocuments' => $requiredDocuments,
            'studentEmail' => $applicant['StudentEmail'] ?? null
        ];

        // Send the email in the background
        $emailSent = $mailer->sendScreeningNotification($applicant['GuardianEmail'], $emailData);
    } catch (Exception $e) {
        // Errors in the email sending process will go here
        error_log("updateStage.php Background Email Exception: " . $e->getMessage());
    }
}
?>