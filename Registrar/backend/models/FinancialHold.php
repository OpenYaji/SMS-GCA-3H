<?php

class FinancialHold
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Get all students with outstanding balances (financial holds)
     */
    public function getFinancialHolds($filters = [])
    {
        $query = "
            SELECT 
                t.TransactionID as FinancialHoldID,
                sp.StudentProfileID,
                CONCAT(p.FirstName, ' ', p.LastName) as studentName,
                sp.StudentNumber as studentId,
                gl.LevelName as gradeLevel,
                s.SectionName as section,
                
                -- Calculate Real Outstanding Balance
                (t.TotalAmount - (
                    SELECT COALESCE(SUM(pay.AmountPaid), 0) 
                    FROM payment pay 
                    WHERE pay.TransactionID = t.TransactionID 
                    AND pay.VerificationStatus = 'Verified'
                )) as outstandingBalance,
                
                CASE 
                    WHEN DATEDIFF(CURDATE(), t.DueDate) > 60 THEN 'Final'
                    WHEN DATEDIFF(CURDATE(), t.DueDate) > 30 THEN 'Midterm'
                    ELSE 'Quarterly'
                END as examPeriod,
                
                CASE 
                    WHEN (t.TotalAmount - (
                        SELECT COALESCE(SUM(pay.AmountPaid), 0) 
                        FROM payment pay 
                        WHERE pay.TransactionID = t.TransactionID 
                        AND pay.VerificationStatus = 'Verified'
                    )) > 0 THEN 'Active'
                    ELSE 'Cleared'
                END as holdStatus,
                
                t.IssueDate as HoldAppliedDate,
                t.DueDate as PaymentDeadline,
                NULL as ExtendedDeadline,
                t.TransactionID,
                g.FullName as parentGuardian,
                CAST(g.EncryptedPhoneNumber AS CHAR) as contact,
                ts.StatusName as transactionStatus
            FROM transaction t
            JOIN studentprofile sp ON t.StudentProfileID = sp.StudentProfileID
            JOIN profile p ON sp.ProfileID = p.ProfileID
            JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
            JOIN section s ON e.SectionID = s.SectionID
            JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
            JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
            LEFT JOIN transactionstatus ts ON t.TransactionStatusID = ts.StatusID
            LEFT JOIN studentguardian sg ON sp.StudentProfileID = sg.StudentProfileID AND sg.IsPrimaryContact = 1
            LEFT JOIN guardian g ON sg.GuardianID = g.GuardianID
            WHERE sy.IsActive = 1
            HAVING outstandingBalance > 0
        ";

        $conditions = [];
        $params = [];

        if (!empty($filters['examPeriod'])) {
            $conditions[] = "examPeriod = :examPeriod";
            $params[':examPeriod'] = $filters['examPeriod'];
        }

        if (!empty($filters['gradeLevel'])) {
            $conditions[] = "gl.LevelName = :gradeLevel";
            $params[':gradeLevel'] = $filters['gradeLevel'];
        }

        if (!empty($filters['holdStatus'])) {
            $conditions[] = "holdStatus = :holdStatus";
            $params[':holdStatus'] = $filters['holdStatus'];
        }

        if (!empty($conditions)) {
            $query .= " AND " . implode(" AND ", $conditions);
        }

        $query .= " ORDER BY outstandingBalance DESC, t.DueDate ASC";

        try {
            $stmt = $this->conn->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getFinancialHolds: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get summary statistics
     */
    public function getSummaryStats()
    {
        $query = "
            SELECT 
                COUNT(CASE WHEN (t.TotalAmount - (
                    SELECT COALESCE(SUM(pay.AmountPaid), 0) 
                    FROM payment pay 
                    WHERE pay.TransactionID = t.TransactionID 
                    AND pay.VerificationStatus = 'Verified'
                )) > 0 THEN 1 END) as activeHolds,
                
                COUNT(CASE WHEN DATEDIFF(CURDATE(), t.DueDate) BETWEEN 30 AND 60 
                    AND (t.TotalAmount - (
                        SELECT COALESCE(SUM(pay.AmountPaid), 0) 
                        FROM payment pay 
                        WHERE pay.TransactionID = t.TransactionID 
                        AND pay.VerificationStatus = 'Verified'
                    )) > 0 THEN 1 END) as midtermHolds,
                
                COUNT(CASE WHEN DATEDIFF(CURDATE(), t.DueDate) > 60 
                    AND (t.TotalAmount - (
                        SELECT COALESCE(SUM(pay.AmountPaid), 0) 
                        FROM payment pay 
                        WHERE pay.TransactionID = t.TransactionID 
                        AND pay.VerificationStatus = 'Verified'
                    )) > 0 THEN 1 END) as finalExamHolds,
                
                COUNT(CASE WHEN t.TransactionStatusID = 3 
                    AND DATE(t.IssueDate) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as clearedThisWeek
            FROM transaction t
            JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
            WHERE sy.IsActive = 1
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getSummaryStats: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get hold details by Transaction ID
     */
    public function getHoldById($transactionId)
    {
        $query = "
            SELECT 
                t.TransactionID as FinancialHoldID,
                sp.StudentProfileID,
                CONCAT(p.FirstName, ' ', p.LastName) as studentName,
                sp.StudentNumber as studentId,
                gl.LevelName as gradeLevel,
                s.SectionName as section,
                t.TotalAmount,
                
                -- Calculate Real Paid Amount
                (SELECT COALESCE(SUM(pay.AmountPaid), 0) 
                 FROM payment pay 
                 WHERE pay.TransactionID = t.TransactionID 
                 AND pay.VerificationStatus = 'Verified') as PaidAmount,
                
                -- Calculate Real Balance
                (t.TotalAmount - (
                    SELECT COALESCE(SUM(pay.AmountPaid), 0) 
                    FROM payment pay 
                    WHERE pay.TransactionID = t.TransactionID 
                    AND pay.VerificationStatus = 'Verified'
                )) as BalanceAmount,
                
                (t.TotalAmount - (
                    SELECT COALESCE(SUM(pay.AmountPaid), 0) 
                    FROM payment pay 
                    WHERE pay.TransactionID = t.TransactionID 
                    AND pay.VerificationStatus = 'Verified'
                )) as OutstandingAmount,
                
                CASE 
                    WHEN DATEDIFF(CURDATE(), t.DueDate) > 60 THEN 'Final'
                    WHEN DATEDIFF(CURDATE(), t.DueDate) > 30 THEN 'Midterm'
                    ELSE 'Quarterly'
                END as HoldType,
                
                CASE 
                    WHEN (t.TotalAmount - (
                        SELECT COALESCE(SUM(pay.AmountPaid), 0) 
                        FROM payment pay 
                        WHERE pay.TransactionID = t.TransactionID 
                        AND pay.VerificationStatus = 'Verified'
                    )) > 0 THEN 'Active'
                    ELSE 'Cleared'
                END as HoldStatus,
                
                t.IssueDate as HoldAppliedDate,
                NULL as HoldClearedDate,
                t.DueDate as PaymentDeadline,
                NULL as ExtendedDeadline,
                NULL as Remarks,
                g.FullName as parentGuardian,
                CAST(g.EncryptedPhoneNumber AS CHAR) as contact,
                CAST(g.EncryptedEmailAddress AS CHAR) as guardianEmail
            FROM transaction t
            JOIN studentprofile sp ON t.StudentProfileID = sp.StudentProfileID
            JOIN profile p ON sp.ProfileID = p.ProfileID
            JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
            JOIN section s ON e.SectionID = s.SectionID
            JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
            LEFT JOIN studentguardian sg ON sp.StudentProfileID = sg.StudentProfileID AND sg.IsPrimaryContact = 1
            LEFT JOIN guardian g ON sg.GuardianID = g.GuardianID
            WHERE t.TransactionID = :transaction_id
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':transaction_id', $transactionId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getHoldById: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Mark balance as cleared (update transaction status)
     */
    public function clearHold($transactionId, $clearedBy, $remarks = null)
    {
        // In this case, clearing means marking transaction as paid
        $query = "
            UPDATE transaction 
            SET TransactionStatusID = 3
            WHERE TransactionID = :transaction_id
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':transaction_id', $transactionId, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in clearHold: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Extend payment deadline
     */
    public function extendDeadline($transactionId, $newDeadline, $reason)
    {
        $query = "
            UPDATE transaction 
            SET DueDate = :new_deadline
            WHERE TransactionID = :transaction_id
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':transaction_id', $transactionId, PDO::PARAM_INT);
            $stmt->bindParam(':new_deadline', $newDeadline);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in extendDeadline: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send notification to parents (optional: log to notification table)
     */
    public function sendNotification($transactionId, $type, $email, $phone, $subject, $message)
    {
        // Optional: If you want to keep notification logs, create a simple log table
        // For now, we'll just return true as notification would be sent externally
        try {
            // Here you would integrate with email/SMS service
            // For now, just log it
            error_log("Notification sent for Transaction ID: $transactionId");
            return true;
        } catch (Exception $e) {
            error_log("Error in sendNotification: " . $e->getMessage());
            return false;
        }
    }
}
