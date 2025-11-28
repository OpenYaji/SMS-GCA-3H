<?php

class Transaction
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Get student profile ID by user ID
     */
    public function getStudentProfileIdByUserId($userId)
    {
        $query = "
            SELECT sp.StudentProfileID 
            FROM studentprofile sp 
            JOIN profile p ON sp.ProfileID = p.ProfileID 
            WHERE p.UserID = :user_id
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ? $result['StudentProfileID'] : null;
        } catch (PDOException $e) {
            error_log("Error in getStudentProfileIdByUserId: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get total unpaid balance for a student
     */
    public function getTotalBalance($studentProfileId)
    {
        $query = "
            SELECT SUM(t.BalanceAmount) as totalBalance
            FROM transaction t
            JOIN TransactionStatus ts ON t.TransactionStatusID = ts.StatusID
            WHERE t.StudentProfileID = :student_profile_id AND ts.StatusName != 'Paid'
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':student_profile_id', $studentProfileId, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['totalBalance'] ?? 0.00;
        } catch (PDOException $e) {
            error_log("Error in getTotalBalance: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get current transaction for active school year
     */
    public function getCurrentTransaction($studentProfileId)
    {
        $query = "
            SELECT t.TransactionID, t.TotalAmount, t.PaidAmount, t.BalanceAmount, t.DueDate
            FROM transaction t
            JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
            WHERE t.StudentProfileID = :student_profile_id AND sy.IsActive = 1
            LIMIT 1
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':student_profile_id', $studentProfileId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getCurrentTransaction: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get transaction item breakdown
     */
    public function getTransactionItems($transactionId)
    {
        $query = "
            SELECT ti.Description as description, SUM(ti.Amount) as amount
            FROM transactionitem ti
            WHERE ti.TransactionID = :transaction_id
            GROUP BY ti.Description
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':transaction_id', $transactionId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getTransactionItems: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get available unpaid transaction items for payment
     */
    public function getAvailablePaymentItems($transactionId)
    {
        $query = "
            SELECT 
                ti.Description as description,
                ti.Amount as amount
            FROM transactionitem ti
            WHERE ti.TransactionID = :transaction_id
            ORDER BY ti.Description
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':transaction_id', $transactionId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getAvailablePaymentItems: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get payment data for modal - uses BalanceAmount from transaction
     */
    public function getPaymentModalData($studentProfileId)
    {
        $currentTransaction = $this->getCurrentTransaction($studentProfileId);

        if (!$currentTransaction) {
            return null;
        }

        $availableItems = $this->getAvailablePaymentItems($currentTransaction['TransactionID']);

        return [
            'transactionId' => $currentTransaction['TransactionID'],
            'dueDate' => $currentTransaction['DueDate'],
            'totalAmount' => (float)$currentTransaction['TotalAmount'],
            'paidAmount' => (float)$currentTransaction['PaidAmount'],
            'balanceAmount' => (float)$currentTransaction['BalanceAmount'],
            'availableItems' => $availableItems ?: []
        ];
    }

    /**
     * Get payment history for a student - includes all payments regardless of status
     */
    public function getPaymentHistory($studentProfileId)
    {
        $query = "
            SELECT
                p.PaymentDateTime as dateTime,
                CONCAT('Payment for S.Y. ', sy.YearName) as purpose,
                pm.MethodName as method,
                p.AmountPaid as cost,
                p.VerificationStatus as status,
                p.ReferenceNumber as referenceNumber
            FROM payment p
            JOIN transaction t ON p.TransactionID = t.TransactionID
            JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
            JOIN paymentmethod pm ON p.PaymentMethodID = pm.PaymentMethodID
            WHERE t.StudentProfileID = :student_profile_id
            ORDER BY p.PaymentDateTime DESC
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':student_profile_id', $studentProfileId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getPaymentHistory: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Submit a new payment
     */
    public function submitPayment($studentProfileId, $transactionId, $paymentData)
    {
        $insertQuery = "
            INSERT INTO payment (
                TransactionID, 
                PaymentMethodID, 
                AmountPaid, 
                PaymentDateTime, 
                ReferenceNumber,
                VerificationStatus
            ) VALUES (
                :transaction_id,
                :payment_method_id,
                :amount_paid,
                NOW(),
                :reference_number,
                'Pending'
            )
        ";

        $updateTransactionQuery = "
            UPDATE transaction 
            SET PaidAmount = PaidAmount + :amount_paid
            WHERE TransactionID = :transaction_id
        ";

        try {
            $this->conn->beginTransaction();

            // Get payment method ID
            $methodId = $this->getPaymentMethodId($paymentData['method']);
            if (!$methodId) {
                throw new Exception('Invalid payment method');
            }

            // Insert payment record
            $stmt = $this->conn->prepare($insertQuery);
            $stmt->bindParam(':transaction_id', $transactionId, PDO::PARAM_INT);
            $stmt->bindParam(':payment_method_id', $methodId, PDO::PARAM_INT);
            $stmt->bindParam(':amount_paid', $paymentData['amount'], PDO::PARAM_STR);
            $stmt->bindParam(':reference_number', $paymentData['reference'], PDO::PARAM_STR);
            $stmt->execute();
            $paymentId = $this->conn->lastInsertId();

            // Update transaction paid amount
            $stmt = $this->conn->prepare($updateTransactionQuery);
            $stmt->bindParam(':amount_paid', $paymentData['amount'], PDO::PARAM_STR);
            $stmt->bindParam(':transaction_id', $transactionId, PDO::PARAM_INT);
            $stmt->execute();

            // Update transaction status
            $this->updateTransactionStatus($transactionId);

            $this->conn->commit();
            return $paymentId;
        } catch (Exception $e) {
            $this->conn->rollBack();
            error_log("Error in submitPayment: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update transaction status based on paid amount
     */
    private function updateTransactionStatus($transactionId)
    {
        $query = "
            UPDATE transaction 
            SET TransactionStatusID = CASE 
                WHEN BalanceAmount <= 0 THEN 3
                WHEN PaidAmount > 0 AND BalanceAmount > 0 THEN 2
                WHEN PaidAmount = 0 THEN 1
                ELSE 1
            END
            WHERE TransactionID = :transaction_id
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':transaction_id', $transactionId, PDO::PARAM_INT);
            $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error updating transaction status: " . $e->getMessage());
        }
    }

    /**
     * Get payment method ID by name
     */
    private function getPaymentMethodId($methodName)
    {
        $query = "SELECT PaymentMethodID FROM paymentmethod WHERE MethodName = :method_name LIMIT 1";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':method_name', $methodName, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ? $result['PaymentMethodID'] : null;
        } catch (PDOException $e) {
            error_log("Error in getPaymentMethodId: " . $e->getMessage());
            return null;
        }
    }
}