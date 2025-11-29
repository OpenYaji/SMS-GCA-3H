<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class TransactionController {
    private $db;
    private $auth;

    public function __construct($db) {
        $this->db = $db;
        $this->auth = new AuthMiddleware($db);
    }

    // --- GET PENDING PAYMENTS ---
    public function getPendingPayments() {
        try {
            $method = $_GET['paymentMethod'] ?? '';
            $status = $_GET['paymentStatus'] ?? '';
            $grade  = $_GET['gradeLevel'] ?? '';

            $whereClause = "WHERE p.VerificationStatus = 'Pending'"; 
            $params = [];

            if (!empty($method)) {
                $whereClause .= " AND pm.MethodName = :method";
                $params[':method'] = $method;
            }
            if (!empty($grade)) {
                $whereClause .= " AND gl.LevelName = :grade";
                $params[':grade'] = $grade;
            }

            // LEFT JOINs ensure we see the payment even if student data is missing
            $query = "SELECT 
                        p.PaymentID,
                        COALESCE(CONCAT(pr.FirstName, ' ', pr.LastName), 'Unknown') as studentName,
                        COALESCE(gl.LevelName, 'N/A') as gradeLevel,
                        pm.MethodName as paymentMethod,
                        p.AmountPaid as amount,
                        p.VerificationStatus as status,
                        p.PaymentDateTime as dateAdded,
                        p.ReferenceNumber as referenceNumber,
                        t.TransactionID,
                        COALESCE(sy.YearName, 'N/A') as schoolYear,
                        '' as phoneNumber, 
                        sp.StudentProfileID
                      FROM payment p
                      INNER JOIN transaction t ON p.TransactionID = t.TransactionID
                      INNER JOIN paymentmethod pm ON p.PaymentMethodID = pm.PaymentMethodID
                      LEFT JOIN studentprofile sp ON t.StudentProfileID = sp.StudentProfileID
                      LEFT JOIN profile pr ON sp.ProfileID = pr.ProfileID
                      LEFT JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID 
                      LEFT JOIN section s ON e.SectionID = s.SectionID
                      LEFT JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
                      LEFT JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
                      $whereClause
                      GROUP BY p.PaymentID
                      ORDER BY p.PaymentDateTime DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Summary Counts
            $summaryQuery = "SELECT 
                SUM(CASE WHEN p.VerificationStatus = 'Pending' THEN 1 ELSE 0 END) as totalPending,
                SUM(CASE WHEN p.VerificationStatus = 'Pending' AND pm.MethodName = 'GCash' THEN 1 ELSE 0 END) as pendingGCash,
                SUM(CASE WHEN p.VerificationStatus = 'Pending' AND pm.MethodName = 'Bank Transfer' THEN 1 ELSE 0 END) as pendingBankTransfer,
                SUM(CASE WHEN p.VerificationStatus = 'Verified' AND DATE(p.VerifiedAt) = CURDATE() THEN 1 ELSE 0 END) as verifiedToday
             FROM payment p
             JOIN paymentmethod pm ON p.PaymentMethodID = pm.PaymentMethodID";
            
            $stmtSum = $this->db->prepare($summaryQuery);
            $stmtSum->execute();
            $summary = $stmtSum->fetch(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'payments' => $payments, 
                'summary' => $summary,
                'count' => count($payments)
            ]);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // --- GET SINGLE PAYMENT DETAILS ---
    public function getPaymentDetails() {
        $paymentId = $_GET['paymentId'] ?? $_GET['id'] ?? null;
        
        if (!$paymentId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Payment ID Required']);
            return;
        }

        try {
            $query = "SELECT 
                        p.*,
                        pm.MethodName as paymentMethod,
                        CONCAT(prof.FirstName, ' ', prof.LastName) AS studentName,
                        COALESCE(gl.LevelName, 'N/A') as gradeLevel,
                        COALESCE(sy.YearName, 'N/A') as schoolYear,
                        '' as phoneNumber,
                        t.TotalAmount,
                        
                        -- Calculate Real Paid/Balance dynamically for the view
                        (SELECT COALESCE(SUM(pay.AmountPaid), 0) FROM payment pay WHERE pay.TransactionID = t.TransactionID AND pay.VerificationStatus = 'Verified') as PaidAmount,
                        (t.TotalAmount - (SELECT COALESCE(SUM(pay.AmountPaid), 0) FROM payment pay WHERE pay.TransactionID = t.TransactionID AND pay.VerificationStatus = 'Verified')) as BalanceAmount

                      FROM payment p
                      JOIN paymentmethod pm ON p.PaymentMethodID = pm.PaymentMethodID
                      JOIN transaction t ON p.TransactionID = t.TransactionID
                      LEFT JOIN studentprofile sp ON t.StudentProfileID = sp.StudentProfileID
                      LEFT JOIN profile prof ON sp.ProfileID = prof.ProfileID
                      LEFT JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
                      LEFT JOIN section s ON e.SectionID = s.SectionID
                      LEFT JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
                      LEFT JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
                      WHERE p.PaymentID = :pid LIMIT 1";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([':pid' => $paymentId]);
            $payment = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$payment) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Not Found']);
                return;
            }

            echo json_encode(['success' => true, 'payment' => $payment]);
            
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // --- UPDATE VERIFICATION STATUS (SELF-HEALING LOGIC) ---
    public function updateVerificationStatus() {
        $input = json_decode(file_get_contents('php://input'));
        
        if (!isset($input->paymentId) || !isset($input->status)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing Data']);
            return;
        }

        $userId = 1; // Default Admin ID

        try {
            $this->db->beginTransaction();

            // 1. Update Payment Status
            $query = "UPDATE payment 
                      SET VerificationStatus = :status, 
                          VerifiedByUserID = :uid, 
                          VerifiedBy = :uid, 
                          VerifiedAt = NOW(), 
                          RejectionReason = :reason 
                      WHERE PaymentID = :pid";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                ':status' => $input->status, 
                ':uid' => $userId, 
                ':reason' => $input->remarks ?? null, 
                ':pid' => $input->paymentId
            ]);

            // 2. RECALCULATE Transaction (The Fix)
            // Instead of adding blindly, we recalculate the sum of ALL verified payments for this transaction.
            $this->recalculateTransaction((int)$input->paymentId);

            $this->db->commit();
            echo json_encode(['success' => true, 'message' => 'Updated Successfully']);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // --- BULK VERIFY (SELF-HEALING LOGIC) ---
    public function bulkVerifyPayments() {
        $input = json_decode(file_get_contents('php://input'));
        if (empty($input->paymentIds)) {
            echo json_encode(['success' => false, 'message' => 'No IDs']); return;
        }

        try {
            $this->db->beginTransaction();
            $ids = implode(',', array_map('intval', $input->paymentIds));
            
            // 1. Update Payments
            $this->db->exec("UPDATE payment SET VerificationStatus='Verified', VerifiedAt=NOW() WHERE PaymentID IN ($ids) AND VerificationStatus='Pending'");
            
            // 2. Recalculate Transactions for EACH payment verified
            // (We iterate to ensure every affected transaction is corrected)
            foreach ($input->paymentIds as $pid) {
                $this->recalculateTransaction((int)$pid);
            }

            $this->db->commit();
            echo json_encode(['success' => true, 'message' => 'Bulk Verified']);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // --- HELPER: RECALCULATE TRANSACTION TOTALS ---
    // This function ensures the main 'transaction' table is always perfectly synced with the 'payment' table.
    private function recalculateTransaction($paymentId) {
        // 1. Get Transaction ID from the Payment
        $stmt = $this->db->prepare("SELECT TransactionID FROM payment WHERE PaymentID = ?");
        $stmt->execute([$paymentId]);
        $tid = $stmt->fetchColumn();

        if ($tid) {
            // 2. Sum up ONLY 'Verified' payments
            $sumSql = "SELECT COALESCE(SUM(AmountPaid), 0) FROM payment WHERE TransactionID = ? AND VerificationStatus = 'Verified'";
            $stmtSum = $this->db->prepare($sumSql);
            $stmtSum->execute([$tid]);
            $totalPaid = $stmtSum->fetchColumn();

            // 3. Update Transaction Table with correct PaidAmount, Balance, and Status
            $updateSql = "UPDATE transaction 
                          SET PaidAmount = :paid,
                              BalanceAmount = TotalAmount - :paid,
                              TransactionStatusID = CASE 
                                  WHEN (TotalAmount - :paid) <= 0 THEN 3 -- Paid
                                  WHEN :paid > 0 THEN 2 -- Partial
                                  ELSE 1 -- Unpaid
                              END
                          WHERE TransactionID = :tid";
            
            $stmtUpdate = $this->db->prepare($updateSql);
            $stmtUpdate->execute([':paid' => $totalPaid, ':tid' => $tid]);
        }
    }
}
?>