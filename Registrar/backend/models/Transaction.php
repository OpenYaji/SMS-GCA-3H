<?php

class Transaction
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Get all pending payments for verification
     */
    public function getPendingPayments($filters = [])
    {
        $query = "
            SELECT 
                p.PaymentID,
                CONCAT(pr.FirstName, ' ', pr.LastName) as studentName,
                gl.GradeLevelName as gradeLevel,
                pm.MethodName as paymentMethod,
                p.AmountPaid as amount,
                p.VerificationStatus as status,
                p.PaymentDateTime as dateAdded,
                p.ReferenceNumber as referenceNumber,
                t.TransactionID,
                sy.YearName as schoolYear,
                pr.ContactNumber as phoneNumber,
                sp.StudentProfileID
            FROM payment p
            JOIN transaction t ON p.TransactionID = t.TransactionID
            JOIN studentprofile sp ON t.StudentProfileID = sp.StudentProfileID
            JOIN profile pr ON sp.ProfileID = pr.ProfileID
            JOIN paymentmethod pm ON p.PaymentMethodID = pm.PaymentMethodID
            JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
            JOIN gradelevel gl ON e.GradeLevelID = gl.GradeLevelID
            JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
            WHERE sy.IsActive = 1 AND e.EnrollmentStatus = 'Enrolled'
        ";

        $conditions = [];
        $params = [];

        if (!empty($filters['paymentMethod'])) {
            $conditions[] = "pm.MethodName = :paymentMethod";
            $params[':paymentMethod'] = $filters['paymentMethod'];
        }

        if (!empty($filters['paymentStatus'])) {
            $conditions[] = "p.VerificationStatus = :paymentStatus";
            $params[':paymentStatus'] = $filters['paymentStatus'];
        }

        if (!empty($filters['gradeLevel'])) {
            $conditions[] = "gl.GradeLevelName = :gradeLevel";
            $params[':gradeLevel'] = $filters['gradeLevel'];
        }

        if (!empty($conditions)) {
            $query .= " AND " . implode(" AND ", $conditions);
        }

        $query .= " ORDER BY p.PaymentDateTime DESC";

        try {
            $stmt = $this->conn->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getPendingPayments: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get payment summary statistics
     */
    public function getPaymentSummary()
    {
        $query = "
            SELECT 
                pm.MethodName,
                p.VerificationStatus,
                COUNT(*) as count,
                SUM(p.AmountPaid) as totalAmount
            FROM payment p
            JOIN transaction t ON p.TransactionID = t.TransactionID
            JOIN paymentmethod pm ON p.PaymentMethodID = pm.PaymentMethodID
            JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
            WHERE sy.IsActive = 1
            GROUP BY pm.MethodName, p.VerificationStatus
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $summary = [
                'pendingGCash' => 0,
                'pendingBankTransfer' => 0,
                'verifiedToday' => 0,
                'totalPending' => 0
            ];

            $today = date('Y-m-d');

            foreach ($results as $row) {
                if ($row['VerificationStatus'] === 'Pending') {
                    $summary['totalPending'] += $row['count'];
                    
                    if ($row['MethodName'] === 'GCash') {
                        $summary['pendingGCash'] += $row['count'];
                    } elseif ($row['MethodName'] === 'Bank Transfer') {
                        $summary['pendingBankTransfer'] += $row['count'];
                    }
                }
            }

            // Get verified today count
            $verifiedTodayQuery = "
                SELECT COUNT(*) as count
                FROM payment p
                JOIN transaction t ON p.TransactionID = t.TransactionID
                JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
                WHERE sy.IsActive = 1 
                AND p.VerificationStatus = 'Verified'
                AND DATE(p.VerifiedAt) = :today
            ";
            
            $stmt = $this->conn->prepare($verifiedTodayQuery);
            $stmt->bindParam(':today', $today);
            $stmt->execute();
            $verifiedResult = $stmt->fetch(PDO::FETCH_ASSOC);
            $summary['verifiedToday'] = $verifiedResult['count'];

            return $summary;
        } catch (PDOException $e) {
            error_log("Error in getPaymentSummary: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update payment verification status
     */
    public function updateVerificationStatus($paymentId, $status, $verifiedBy, $remarks = null)
    {
        $query = "
            UPDATE payment 
            SET 
                VerificationStatus = :status,
                VerifiedBy = :verified_by,
                VerifiedAt = NOW(),
                VerificationRemarks = :remarks
            WHERE PaymentID = :payment_id
        ";

        try {
            $this->conn->beginTransaction();

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':verified_by', $verifiedBy);
            $stmt->bindParam(':remarks', $remarks);
            $stmt->bindParam(':payment_id', $paymentId, PDO::PARAM_INT);
            $stmt->execute();

            // If verified, update transaction balance
            if ($status === 'Verified') {
                $this->updateTransactionBalance($paymentId);
            } elseif ($status === 'Rejected') {
                $this->revertTransactionBalance($paymentId);
            }

            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            error_log("Error in updateVerificationStatus: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update transaction balance when payment is verified
     */
    private function updateTransactionBalance($paymentId)
    {
        $query = "
            UPDATE transaction t
            JOIN payment p ON t.TransactionID = p.TransactionID
            SET t.BalanceAmount = t.TotalAmount - t.PaidAmount
            WHERE p.PaymentID = :payment_id
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':payment_id', $paymentId, PDO::PARAM_INT);
            $stmt->execute();

            // Update transaction status
            $this->updateTransactionStatusByPayment($paymentId);
        } catch (PDOException $e) {
            error_log("Error updating transaction balance: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Revert transaction balance when payment is rejected
     */
    private function revertTransactionBalance($paymentId)
    {
        $query = "
            UPDATE transaction t
            JOIN payment p ON t.TransactionID = p.TransactionID
            SET 
                t.PaidAmount = t.PaidAmount - p.AmountPaid,
                t.BalanceAmount = t.TotalAmount - (t.PaidAmount - p.AmountPaid)
            WHERE p.PaymentID = :payment_id
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':payment_id', $paymentId, PDO::PARAM_INT);
            $stmt->execute();

            // Update transaction status
            $this->updateTransactionStatusByPayment($paymentId);
        } catch (PDOException $e) {
            error_log("Error reverting transaction balance: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update transaction status based on balance
     */
    private function updateTransactionStatusByPayment($paymentId)
    {
        $query = "
            UPDATE transaction t
            JOIN payment p ON t.TransactionID = p.TransactionID
            SET t.TransactionStatusID = CASE 
                WHEN t.BalanceAmount <= 0 THEN 3
                WHEN t.PaidAmount > 0 AND t.BalanceAmount > 0 THEN 2
                ELSE 1
            END
            WHERE p.PaymentID = :payment_id
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':payment_id', $paymentId, PDO::PARAM_INT);
            $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error updating transaction status: " . $e->getMessage());
        }
    }

    /**
     * Get payment details for confirmation modal
     */
    public function getPaymentDetails($paymentId)
    {
        $query = "
            SELECT 
                p.PaymentID,
                p.AmountPaid,
                p.ReferenceNumber,
                p.PaymentDateTime,
                p.VerificationStatus,
                pm.MethodName as paymentMethod,
                CONCAT(pr.FirstName, ' ', pr.LastName) as studentName,
                pr.ContactNumber as phoneNumber,
                gl.GradeLevelName as gradeLevel,
                t.TotalAmount,
                t.PaidAmount,
                t.BalanceAmount,
                sy.YearName as schoolYear
            FROM payment p
            JOIN transaction t ON p.TransactionID = t.TransactionID
            JOIN paymentmethod pm ON p.PaymentMethodID = pm.PaymentMethodID
            JOIN studentprofile sp ON t.StudentProfileID = sp.StudentProfileID
            JOIN profile pr ON sp.ProfileID = pr.ProfileID
            JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
            JOIN gradelevel gl ON e.GradeLevelID = gl.GradeLevelID
            JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
            WHERE p.PaymentID = :payment_id AND sy.IsActive = 1
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':payment_id', $paymentId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getPaymentDetails: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Bulk verify payments
     */
    public function bulkVerifyPayments($paymentIds, $verifiedBy)
    {
        if (empty($paymentIds)) {
            return false;
        }

        $placeholders = implode(',', array_fill(0, count($paymentIds), '?'));
        
        $query = "
            UPDATE payment 
            SET 
                VerificationStatus = 'Verified',
                VerifiedBy = ?,
                VerifiedAt = NOW()
            WHERE PaymentID IN ($placeholders)
            AND VerificationStatus = 'Pending'
        ";

        try {
            $this->conn->beginTransaction();

            $stmt = $this->conn->prepare($query);
            $stmt->execute(array_merge([$verifiedBy], $paymentIds));

            // Update transaction balances for each payment
            foreach ($paymentIds as $paymentId) {
                $this->updateTransactionBalance($paymentId);
            }

            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            error_log("Error in bulkVerifyPayments: " . $e->getMessage());
            return false;
        }
    }
}
