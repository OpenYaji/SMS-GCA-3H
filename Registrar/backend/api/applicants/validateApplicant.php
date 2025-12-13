<?php
// Prevent any output before JSON
ob_start();

// Only include configuration files initially. 
// Classes/Models that might throw fatal errors should be included later.
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/fee_structure.php';

// Clear any previous output, including potential BOM or whitespaces from includes
ob_clean();

// Set the header ONLY after ensuring all potential preceding output is cleared
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $applicantId = $data['applicantId'] ?? null;
    $paymentMode = $data['paymentMode'] ?? 'full';
    $downPayment = $data['downPayment'] ?? 0;
    $notes = $data['notes'] ?? '';

    if (!$applicantId) {
        echo json_encode(['success' => false, 'message' => 'Applicant ID is required']);
        ob_end_flush();
        exit;
    }

    $conn = null;

    try {
        // *** MOVED INSIDE TRY-CATCH BLOCK ***
        // Ensure Applicant model is available before trying to instantiate it
        require_once __DIR__ . '/../../models/Applicant.php';

        $applicantModel = new Applicant();
        $conn = $applicantModel->conn;

        // Check if connection is established before proceeding
        if (!$conn) {
            // Throwing an exception is cleaner than a raw connection failure
            throw new Exception("Database connection failed or Applicant model failed to initialize.");
        }

        $conn->beginTransaction();

        $applicant = $applicantModel->getApplicantById($applicantId);

        if (!$applicant) {
            $conn->rollBack();
            echo json_encode(['success' => false, 'message' => 'Applicant not found']);
            ob_end_flush();
            exit;
        }

        // FeeStructure is usually a static class and was included earlier.
        // If FeeStructure failed, it would have been a 500 already.
        $fees = FeeStructure::getFeesByGrade($applicant['grade']);
        $totalFee = $fees['full_payment'];
        $outstandingBalance = $totalFee - $downPayment;

        // Create transaction record WITHOUT StudentProfileID
        $stmt = $conn->prepare("
            INSERT INTO transaction (StudentProfileID, SchoolYearID, IssueDate, DueDate, TotalAmount, PaidAmount, TransactionStatusID)
            VALUES (NULL, :schoolYearId, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), :totalAmount, :paidAmount, :statusId)
        ");

        $schoolYearId = $applicant['SchoolYearID'];
        // Status 2: Pending/Partial Payment, Status 3: Paid/Completed
        $statusId = ($outstandingBalance > 0) ? 2 : 3;

        $stmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
        $stmt->bindParam(':totalAmount', $totalFee);
        $stmt->bindParam(':paidAmount', $downPayment);
        $stmt->bindParam(':statusId', $statusId, PDO::PARAM_INT);
        $stmt->execute();

        $transactionId = $conn->lastInsertId();

        // Create transaction items
        $items = [
            ['type' => 1, 'desc' => 'Registration Fee', 'amount' => $fees['registration']],
            ['type' => 2, 'desc' => 'Miscellaneous Fee', 'amount' => $fees['miscellaneous']],
            ['type' => 1, 'desc' => 'Tuition Fee', 'amount' => $fees['tuition']]
        ];

        $stmt = $conn->prepare("
            INSERT INTO transactionitem (TransactionID, ItemTypeID, Description, Amount, Quantity)
            VALUES (:transactionId, :itemTypeId, :description, :amount, 1)
        ");

        foreach ($items as $item) {
            $stmt->bindParam(':transactionId', $transactionId, PDO::PARAM_INT);
            $stmt->bindParam(':itemTypeId', $item['type'], PDO::PARAM_INT);
            $stmt->bindParam(':description', $item['desc']);
            $stmt->bindParam(':amount', $item['amount']);
            $stmt->execute();
        }

        // Record down payment
        if ($downPayment > 0) {
            $refNumber = 'DOWNPAY-' . $applicantId . '-' . time();

            $stmt = $conn->prepare("
                INSERT INTO payment (TransactionID, PaymentMethodID, AmountPaid, PaymentDateTime, ReferenceNumber, VerificationStatus, VerifiedByUserID, VerifiedAt)
                VALUES (:transactionId, 1, :amountPaid, NOW(), :refNumber, 'Verified', 1, NOW())
            ");

            $stmt->bindParam(':transactionId', $transactionId, PDO::PARAM_INT);
            $stmt->bindParam(':amountPaid', $downPayment);
            $stmt->bindParam(':refNumber', $refNumber);
            $stmt->execute();
        }

        // Update application
        $stmt = $conn->prepare("
            UPDATE application 
            SET 
                ApplicationStatus = 'Approved',
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

        $conn->commit();

        // Send email notification
        $emailSent = false;
        try {
            // *** MOVED INSIDE TRY-CATCH BLOCK ***
            require_once __DIR__ . '/../../config/mailer.php';
            
            // Check for the mailer function before calling it
            if (!function_exists('getMailer')) {
                 throw new Exception("Mailer configuration function 'getMailer' not found.");
            }

            $mail = getMailer();
            
            // Basic sanitization for email content
            $guardianEmail = filter_var($applicant['GuardianEmail'], FILTER_SANITIZE_EMAIL);
            $guardianFirstName = htmlspecialchars($applicant['GuardianFirstName']);
            $guardianLastName = htmlspecialchars($applicant['GuardianLastName']);
            $studentFirstName = htmlspecialchars($applicant['StudentFirstName']);
            $studentLastName = htmlspecialchars($applicant['StudentLastName']);
            $applicantGrade = htmlspecialchars($applicant['grade']);

            if ($guardianEmail) {
                $mail->addAddress($guardianEmail);
                $mail->Subject = 'Application Approved - Gymnazo Christian Academy';

                $requiredDocs = FeeStructure::getRequiredDocuments($applicant['EnrolleeType']);
                $docsList = implode("\n", array_map(fn($doc) => "• " . htmlspecialchars($doc), $requiredDocs));

                $paymentModeText = ucfirst($paymentMode);

                $mail->Body = "
Dear {$guardianFirstName} {$guardianLastName},

Congratulations! We are pleased to inform you that the application for {$studentFirstName} {$studentLastName} has been APPROVED for enrollment in {$applicantGrade} for School Year 2025-2026.

PAYMENT INFORMATION:
--------------------
Payment Mode: {$paymentModeText} Payment
Total Fee: PHP " . number_format($totalFee, 2) . "
Down Payment: PHP " . number_format($downPayment, 2) . "
Outstanding Balance: PHP " . number_format($outstandingBalance, 2) . "

REQUIRED DOCUMENTS:
-------------------
{$docsList}

NEXT STEPS:
-----------
1. Submit all required documents to the Registrar's Office
2. Complete the down payment of PHP " . number_format($downPayment, 2) . "
3. Wait for the section assignment notification

NOTE: Uniforms and books are NOT included in the fees above.

For any concerns, please contact our Registrar's Office.

Best regards,
Gymnazo Christian Academy
Registrar's Office
                ";

                $mail->send();
                $emailSent = true;
            } else {
                error_log("Email sending failed: Invalid guardian email address in DB.");
            }
        } catch (Exception $mailError) {
            // Email failure is logged but does not stop the overall process success.
            error_log("Email sending failed: " . $mailError->getMessage());
        }

        echo json_encode([
            'success' => true,
            'message' => 'Applicant validated successfully',
            'data' => [
                'applicantId' => $applicantId,
                'transactionId' => $transactionId,
                'paymentMode' => $paymentMode,
                'downPayment' => $downPayment,
                'outstandingBalance' => $outstandingBalance,
                'totalFee' => $totalFee,
                'emailSent' => $emailSent
            ]
        ]);
    } catch (Exception $e) {
        // This catch block handles all PDO and general exceptions.
        if ($conn && $conn->inTransaction()) {
            $conn->rollBack();
        }

        // Log the full error details to the server log
        error_log("Validation Fatal Error: " . $e->getMessage() . " on line " . $e->getLine());

        // Output a generic 500 error message to the client 
        // (the server status is already 500, this ensures valid JSON is sent with the error)
        echo json_encode([
            'success' => false,
            'message' => 'An internal server error occurred. Please check server logs for details.'
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

// Final flush to send the content
ob_end_flush();