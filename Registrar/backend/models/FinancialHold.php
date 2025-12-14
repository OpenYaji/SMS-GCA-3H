<?php

class FinancialHold
{
    private $conn;

    public function __construct($db)
    {
        // Constructor: Initializes the database connection.
        $this->conn = $db;
    }

    /**
     * Get all students with outstanding balances (financial holds).
     * Filters are applied either to a specific School Year ID or default to the active school year.
     * * @param array $filters Additional filtering criteria (gradeLevel, examPeriod, holdStatus).
     * @param int|null $schoolYearId Specific SchoolYearID to query. If null, defaults to active year.
     */
    public function getFinancialHolds($filters = [], $schoolYearId = null)
    {
        // SQL query to fetch detailed transaction records (financial holds)
        $query = "
            SELECT 
                t.TransactionID as FinancialHoldID,
                sp.StudentProfileID,
                CONCAT(p.FirstName, ' ', p.LastName) as studentName,
                sp.StudentNumber as studentId,
                gl.LevelName as gradeLevel,
                s.SectionName as section,
                
                t.PaidAmount,
                t.BalanceAmount as outstandingBalance,
                
                -- Dynamic classification of exam period based on due date
                CASE 
                    WHEN DATEDIFF(CURDATE(), t.DueDate) > 60 THEN 'Final'
                    WHEN DATEDIFF(CURDATE(), t.DueDate) > 30 THEN 'Midterm'
                    ELSE 'Quarterly'
                END as examPeriod,
                
                -- Hold Status based on BalanceAmount
                CASE 
                    WHEN t.BalanceAmount > 0 THEN 'Active'
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
            WHERE 1=1 -- Base condition
        ";

        $conditions = [];
        $params = [];

        // Condition based on School Year: specific ID (for archives) or IsActive = 1 (for dashboard)
        if ($schoolYearId !== null) {
            $conditions[] = "sy.SchoolYearID = :schoolYearId";
            $params[':schoolYearId'] = $schoolYearId;
        } else {
            // Default: Filter only for the currently Active School Year
            $conditions[] = "sy.IsActive = 1";
        }

        // Grade Level (WHERE clause condition)
        if (!empty($filters['gradeLevel'])) {
            $conditions[] = "gl.LevelName = :gradeLevel";
            $params[':gradeLevel'] = $filters['gradeLevel'];
        }

        // Apply WHERE conditions
        if (!empty($conditions)) {
            $query .= " AND " . implode(" AND ", $conditions);
        }
        
        // Start HAVING clause to filter transactions that still have an outstanding balance
        $query .= " HAVING outstandingBalance > 0 "; 

        $havingConditions = [];
        
        // Exam Period (HAVING clause condition - computed field)
        if (!empty($filters['examPeriod'])) {
            $havingConditions[] = "examPeriod = :examPeriod";
            $params[':examPeriod'] = $filters['examPeriod'];
        }

        // Hold Status (HAVING clause condition - computed field)
        if (!empty($filters['holdStatus'])) {
            $havingConditions[] = "holdStatus = :holdStatus";
            $params[':holdStatus'] = $filters['holdStatus'];
        }

        // Apply HAVING conditions
        if (!empty($havingConditions)) {
            $query .= " AND " . implode(" AND ", $havingConditions);
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
     * Get summary statistics for the ACTIVE school year.
     * Returns zero values if no active school year or no transactions are found.
     */
    public function getSummaryStats()
    {
        $query = "
            SELECT 
                -- 1. Active Financial Holds (Count transactions with remaining BalanceAmount > 0)
                COALESCE(COUNT(CASE WHEN t.BalanceAmount > 0 THEN 1 END), 0) as activeHolds,
                
                -- 2. Total Remaining Balance (SUM of all outstanding BalanceAmount)
                COALESCE(SUM(t.BalanceAmount), 0) AS totalRemainingBalance,
                
                -- 3. Total Tuition Collected (SUM of the PaidAmount column across all transactions)
                COALESCE(SUM(t.PaidAmount), 0) AS totalTuitionCollected,
                
                -- 4. Cleared This Quarter (Assuming 'Cleared This Week/Last 7 Days')
                COALESCE(COUNT(CASE WHEN t.TransactionStatusID = 3 
                    AND DATE(t.IssueDate) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END), 0) as clearedThisQuarter
            FROM transaction t
            JOIN schoolyear sy ON t.SchoolYearID = sy.SchoolYearID
            WHERE sy.IsActive = 1
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Check for active school year status
            if (!$stats || $stats['totalTuitionCollected'] === null || $stats['totalTuitionCollected'] === '0') {
                $sy_check_query = "SELECT COUNT(*) FROM schoolyear WHERE IsActive = 1";
                $sy_stmt = $this->conn->query($sy_check_query);
                $has_active_sy = $sy_stmt->fetchColumn() > 0;
                
                if (!$has_active_sy) {
                    // No active school year, force all values to zero and flag the status
                    return [
                        'activeHolds' => 0,
                        'totalRemainingBalance' => 0.00,
                        'totalTuitionCollected' => 0.00,
                        'clearedThisQuarter' => 0,
                        'isSchoolYearActive' => false // Flag for the frontend
                    ];
                }
            }

            // Ensure types are consistent
            $stats['activeHolds'] = (int)$stats['activeHolds'];
            $stats['clearedThisQuarter'] = (int)$stats['clearedThisQuarter'];
            $stats['totalRemainingBalance'] = (float)$stats['totalRemainingBalance'];
            $stats['totalTuitionCollected'] = (float)$stats['totalTuitionCollected'];
            $stats['isSchoolYearActive'] = true; // Flag for the frontend
            
            return $stats;
            
        } catch (PDOException $e) {
            error_log("Error in getSummaryStats: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get summary statistics for *INACTIVE* school years ONLY (for archives).
     * Filters for 2025-2026 and later (SchoolYearID > 6) to exclude older, empty data.
     */
    public function getArchiveStats()
    {
        $query = "
            SELECT 
                sy.SchoolYearID,
                sy.YearName AS schoolYearName, -- Using the correct column name YearName
                sy.IsActive,
                
                -- Total collections for the specific school year
                COALESCE(SUM(t.PaidAmount), 0) AS totalCollectionsSY,
                
                -- Total transactions (students with a bill)
                COUNT(t.TransactionID) AS totalTransactionsSY,
                
                -- Total balance still outstanding for this school year
                COALESCE(SUM(t.BalanceAmount), 0) AS remainingBalanceSY
            FROM schoolyear sy
            LEFT JOIN transaction t ON sy.SchoolYearID = t.SchoolYearID
            WHERE sy.IsActive = 0 
            AND sy.SchoolYearID > 6 -- Filter: Include only ID > 6 (i.e., 2025-2026 and later)
            GROUP BY sy.SchoolYearID, sy.YearName, sy.IsActive
            ORDER BY sy.SchoolYearID DESC
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getArchiveStats: " . $e->getMessage());
            return false;
        }
    }
    
    // ... (rest of the class methods remain the same)
    
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
                
                t.PaidAmount,
                t.BalanceAmount,
                t.BalanceAmount as OutstandingAmount,
                
                CASE 
                    WHEN DATEDIFF(CURDATE(), t.DueDate) > 60 THEN 'Final'
                    WHEN DATEDIFF(CURDATE(), t.DueDate) > 30 THEN 'Midterm'
                    ELSE 'Quarterly'
                END as HoldType,
                
                CASE 
                    WHEN t.BalanceAmount > 0 THEN 'Active'
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
        // Set TransactionStatusID to 3 (Cleared/Paid)
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
        // Placeholder logic for sending notification (e.g., integrating with external service)
        try {
            error_log("Notification sent for Transaction ID: $transactionId via $type.");
            return true;
        } catch (Exception $e) {
            error_log("Error in sendNotification: " . $e->getMessage());
            return false;
        }
    }
}