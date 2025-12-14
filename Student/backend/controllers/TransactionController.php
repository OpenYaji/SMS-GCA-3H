<?php

require_once __DIR__ . '/../models/Transaction.php';
require_once __DIR__ . '/../config/db.php';

class TransactionController
{
    private $db;
    private $transaction;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();

        if (!$this->db) {
            $this->sendResponse(500, false, 'Database connection failed.');
            exit();
        }

        $this->transaction = new Transaction($this->db);
    }

    public function getTransactionData()
    {
        if (!isset($_SESSION['user_id'])) {
            $this->sendResponse(401, false, 'Not authenticated.');
            return;
        }

        $userId = $_SESSION['user_id'];

        $studentProfileId = $this->transaction->getStudentProfileIdByUserId($userId);

        if ($studentProfileId === false) {
            $this->sendResponse(500, false, 'Error fetching student profile.');
            return;
        }

        if (!$studentProfileId) {
            $this->sendResponse(404, false, 'Student profile not found.');
            return;
        }

        $currentBalance = $this->transaction->getTotalBalance($studentProfileId);
        if ($currentBalance === false) {
            $currentBalance = 0.00;
        }

        $currentTransaction = $this->transaction->getCurrentTransaction($studentProfileId);
        if ($currentTransaction === false) {
            $currentTransaction = null;
        }

        $breakdownItems = [];
        if ($currentTransaction) {
            $items = $this->transaction->getTransactionItems($currentTransaction['TransactionID']);
            if ($items !== false) {
                $breakdownItems = $items;
            }
        }

        $paymentHistory = $this->transaction->getPaymentHistory($studentProfileId);
        if ($paymentHistory === false) {
            $paymentHistory = [];
        }

        $payAnalysis = $this->calculatePayAnalysis($currentTransaction);

        $balanceBreakdown = [
            'breakdownItems' => $breakdownItems,
            'totalAmount'    => $currentTransaction ? (float)$currentTransaction['TotalAmount'] : 0.00,
            'paidAmount'     => $currentTransaction ? (float)$currentTransaction['PaidAmount'] : 0.00,
            'balanceAmount'  => $currentTransaction ? (float)$currentTransaction['BalanceAmount'] : 0.00
        ];

        // Debug log
        error_log("TransactionController - Balance: {$currentBalance}, BalanceAmount: {$balanceBreakdown['balanceAmount']}");

        $responseData = [
            'currentBalance'   => (float)$currentBalance,
            'balanceBreakdown' => $balanceBreakdown,
            'paymentHistory'   => $paymentHistory,
            'payAnalysis'      => $payAnalysis
        ];

        $this->sendResponse(200, true, 'Transaction data retrieved successfully.', [
            'data' => $responseData
        ]);
    }

    /**
     * Get payment data for modal
     */
    public function getPaymentData()
    {
        if (!isset($_SESSION['user_id'])) {
            $this->sendResponse(401, false, 'Not authenticated.');
            return;
        }

        $userId = $_SESSION['user_id'];

        $studentProfileId = $this->transaction->getStudentProfileIdByUserId($userId);

        if ($studentProfileId === false) {
            $this->sendResponse(500, false, 'Error fetching student profile.');
            return;
        }

        if (!$studentProfileId) {
            $this->sendResponse(404, false, 'Student profile not found.');
            return;
        }

        $paymentData = $this->transaction->getPaymentModalData($studentProfileId);

        if (!$paymentData) {
            $this->sendResponse(404, false, 'No active transaction found.');
            return;
        }

        $this->sendResponse(200, true, 'Payment data retrieved successfully.', [
            'data' => $paymentData
        ]);
    }

    public function submitPayment()
    {
        if (!isset($_SESSION['user_id'])) {
            $this->sendResponse(401, false, 'Not authenticated.');
            return;
        }

        $userId = $_SESSION['user_id'];

        // Log the incoming POST data for debugging
        error_log("Submit Payment POST data: " . print_r($_POST, true));

        // Validate required fields
        if (!isset($_POST['transactionId']) || !isset($_POST['amount']) || !isset($_POST['method'])) {
            $missingFields = [];
            if (!isset($_POST['transactionId'])) $missingFields[] = 'transactionId';
            if (!isset($_POST['amount'])) $missingFields[] = 'amount';
            if (!isset($_POST['method'])) $missingFields[] = 'method';

            $this->sendResponse(400, false, 'Missing required fields: ' . implode(', ', $missingFields));
            return;
        }

        // Get student profile ID
        $studentProfileId = $this->transaction->getStudentProfileIdByUserId($userId);
        if (!$studentProfileId) {
            $this->sendResponse(404, false, 'Student profile not found.');
            return;
        }

        // Verify the transaction belongs to this student
        $currentTransaction = $this->transaction->getCurrentTransaction($studentProfileId);
        if (!$currentTransaction || $currentTransaction['TransactionID'] != $_POST['transactionId']) {
            $this->sendResponse(403, false, 'Invalid transaction.');
            return;
        }

        // Validate payment amount doesn't exceed balance
        $paymentAmount = floatval($_POST['amount']);
        if ($paymentAmount > floatval($currentTransaction['BalanceAmount'])) {
            $this->sendResponse(400, false, 'Payment amount exceeds balance.');
            return;
        }

        if ($paymentAmount <= 0) {
            $this->sendResponse(400, false, 'Payment amount must be greater than zero.');
            return;
        }

        // Generate unique reference number if not provided or empty
        $reference = trim($_POST['reference'] ?? '');
        if (empty($reference)) {
            $reference = 'PAY-' . $_POST['transactionId'] . '-' . time() . '-' . rand(1000, 9999);
        }

        // Prepare payment data with defaults
        $paymentData = [
            'amount' => $paymentAmount,
            'method' => $_POST['method'],
            'reference' => $reference,
            'phoneNumber' => $_POST['phoneNumber'] ?? '',
            'paymentMode' => $_POST['paymentMode'] ?? 'custom',
            'installmentNumber' => isset($_POST['installmentNumber']) ? intval($_POST['installmentNumber']) : 1
        ];

        error_log("Submitting payment with data: " . print_r($paymentData, true));

        // Submit payment
        try {
            $paymentId = $this->transaction->submitPayment(
                $studentProfileId,
                intval($_POST['transactionId']),
                $paymentData
            );

            if ($paymentId) {
                $this->sendResponse(200, true, 'Payment submitted successfully.', [
                    'paymentId' => $paymentId,
                    'referenceNumber' => $reference
                ]);
            } else {
                $this->sendResponse(500, false, 'Failed to submit payment. Check server logs for details.');
            }
        } catch (Exception $e) {
            error_log("Error submitting payment: " . $e->getMessage());
            $this->sendResponse(500, false, 'Failed to submit payment: ' . $e->getMessage());
        }
    }

    private function calculatePayAnalysis($currentTransaction)
    {
        $paidPercent = 0;
        $pendingPercent = 0;
        $overduePercent = 0;

        if ($currentTransaction && isset($currentTransaction['TotalAmount']) && $currentTransaction['TotalAmount'] > 0) {
            $total = (float)$currentTransaction['TotalAmount'];
            $paid = (float)($currentTransaction['PaidAmount'] ?? 0);
            $balance = (float)($currentTransaction['BalanceAmount'] ?? 0);
            $dueDate = $currentTransaction['DueDate'] ?? null;

            $paidPercent = round(($paid / $total) * 100);

            if ($balance > 0) {
                try {
                    if ($dueDate && new DateTime($dueDate) < new DateTime()) {
                        $overduePercent = round(($balance / $total) * 100);
                    } else {
                        $pendingPercent = round(($balance / $total) * 100);
                    }
                } catch (Exception $e) {
                    $pendingPercent = round(($balance / $total) * 100);
                }
            }
        }

        return [
            ['name' => 'Paid', 'value' => $paidPercent],
            ['name' => 'Pending', 'value' => $pendingPercent],
            ['name' => 'Overdue', 'value' => $overduePercent]
        ];
    }

    private function sendResponse($statusCode, $success, $message, $data = [])
    {
        http_response_code($statusCode);
        $response = [
            'success' => $success,
            'message' => $message
        ];

        if (!empty($data)) {
            $response = array_merge($response, $data);
        }

        echo json_encode($response);
    }
}
