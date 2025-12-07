<?php
// Prevent any output before JSON. This is crucial for a clean response.
ob_start();

// validateApplicant.php - Final Version for Asynchronous Processing

// Ensure there is no output before the header. This is critical.
header('Content-Type: application/json');

// --- 0. Performance Timer Start ---
$start_time = microtime(true);

// Error logging setup
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);

// --- 1. Dependencies ---

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/fee_structure.php';
require_once __DIR__ . '/../../models/Applicant.php';
require_once __DIR__ . '/../../config/mailer.php'; 

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    // Flush any temporary output and exit immediately
    ob_end_flush();
    exit;
}

// --- CRITICAL FIX: Read and parse the JSON input ---
// Clear any previous output (e.g., from included files)
ob_clean();
$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

// Check for JSON decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input: ' . json_last_error_msg()]);
    ob_end_flush();
    exit;
}
// ---------------------------------------------------

$applicantId = $data['applicantId'] ?? null;
$paymentMode = $data['paymentMode'] ?? 'full';
$downPayment = $data['downPayment'] ?? 0;
$notes = $data['notes'] ?? '';

if (!$applicantId) {
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'Applicant ID is required']);
    ob_end_flush();
    exit;
}

$conn = null;
$applicant = null;
$transactionId = null;
$lastName = '';
$totalFee = 0;
$outstandingBalance = 0;

try {
    $applicantModel = new Applicant();
    $conn = $applicantModel->conn;

    // Step 1: Get Applicant Data
    $applicant = $applicantModel->getApplicantById($applicantId); 

    if (!$applicant) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Applicant not found']);
        ob_end_flush();
        exit;
    }
 // --- Timer Log 1: Time spent on initial data fetch ---
    $time_after_fetch = microtime(true);
    error_log("Applicant Validation Timing: Initial Data Fetch took " . number_format($time_after_fetch - $start_time, 4) . " seconds.");
    
    // CRITICAL CHECK: Get the StudentProfileID
    $studentProfileId = $applicant['StudentProfileID'] ?? $applicant['ApplicationID']; 
    
    // Safety check 
    if ($studentProfileId === 0 || empty($studentProfileId)) {
         throw new Exception("Critical Data Missing: Student Profile ID is required for transaction creation.");
    }

    $conn->beginTransaction();

    // Step 2: Calculate Fees
    $fees = FeeStructure::getFeesByGrade($applicant['grade']); 
    $totalFee = $fees['full_payment'];
    $outstandingBalance = (float)$totalFee - (float)$downPayment;
    
    // Step 3: Create Transaction Record (Heavy DB operation)
    $stmt = $conn->prepare("
        INSERT INTO transaction (StudentProfileID, SchoolYearID, IssueDate, DueDate, TotalAmount, PaidAmount, TransactionStatusID)
        VALUES (:studentProfileId, :schoolYearId, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), :totalAmount, :paidAmount, :statusId)
    ");

    $schoolYearId = $applicant['SchoolYearID'];
    $statusId = ($outstandingBalance > 0) ? 2 : 3; 

    $stmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
    $stmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $stmt->bindParam(':totalAmount', $totalFee);
    $stmt->bindParam(':paidAmount', $downPayment);
    $stmt->bindParam(':statusId', $statusId, PDO::PARAM_INT);
    $stmt->execute();

    $transactionId = $conn->lastInsertId();

    // Step 4: Update application status to 'Approved' (Heavy DB operation)
    $stmt = $conn->prepare("
        UPDATE application 
        SET ApplicationStatus = 'Approved',
            PaymentMode = :paymentMode,
            TransactionID = :transactionId,
            RegistrarNotes = :notes,
            ReviewedDate = NOW()
        WHERE ApplicationID = :id
    ");

    $stmt->bindParam(':paymentMode', $paymentMode);
    $stmt->bindParam(':transactionId', $transactionId, PDO::PARAM_INT);
    $stmt->bindParam(':notes', $notes);
    $stmt->bindParam(':id', $applicantId, PDO::PARAM_INT);
    $stmt->execute();

    // COMMIT: The CRITICAL DATABASE work ends here.
    $conn->commit();
    
    // --- Timer Log 2: Time spent on database transaction ---
    $time_after_commit = microtime(true);
    error_log("Applicant Validation Timing: DB Transaction (Commit) took " . number_format($time_after_commit - $time_after_fetch, 4) . " seconds.");

    $lastName = $applicant['StudentLastName']; 
    
    // --- FINAL SUCCESS JSON RESPONSE ---
    echo json_encode([
        'success' => true,
        'message' => "Applicant {$lastName} Approved Successfully!",
        'data' => [
            'applicantId' => $applicantId,
            'transactionId' => $transactionId, 
            'paymentMode' => $paymentMode,
            'downPayment' => $downPayment,
            'outstandingBalance' => $outstandingBalance,
            'totalFee' => $totalFee,
            'emailSent' => false 
        ]
    ]);

    // 🛑 ASYNCHRONOUS MAGIC: Release the connection to the browser so the email sending runs in the background 🛑
    // This code will speed up the response to the user.
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request(); 
    }
} catch (Exception $e) {
    if ($conn && $conn->inTransaction()) {
        $conn->rollBack();
    }

    error_log("Validation Fatal Error for applicant {$applicantId}: " . $e->getMessage() . "\nStack Trace: " . $e->getTraceAsString()); 

    http_response_code(500); 
    echo json_encode([
        'success' => false,
        'message' => 'An internal server error occurred. Transaction rolled back.'
    ]);
    ob_end_flush(); // Flush the output buffer and exit.
    exit;
}

// The original script now continues here for background tasks (email, logging, etc.)

// ----------------------------------------------------------------
// --- OPTIONAL: EMAIL NOTIFICATION (Post-Transaction/Background Execution) ---
// ... (The commented-out email block is fine to remain commented out for a quick fix)
// ----------------------------------------------------------------
// if ($applicant && $transactionId) {
//     try {
//         $mailer = new Mailer(); 
//         // ... email setup ...
//     } catch (Exception $mailError) {
//         error_log("Email sending failed (background) for applicant {$applicantId}: " . $mailError->getMessage());
//     }
// }

// // --- Timer Log 3: Total Script Execution Time ---
// $end_time = microtime(true);
// error_log("Applicant Validation Timing: TOTAL SCRIPT Execution Time: " . number_format($end_time - $start_time, 4) . " seconds.");

ob_end_flush();
// END OF FILE