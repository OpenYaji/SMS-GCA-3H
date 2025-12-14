<?php

class Enrollment
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
     * Get enrollment status for student
     */
    public function getEnrollmentStatus($studentProfileId)
    {
        try {
            // Get current active school year
            $currentSY = $this->getCurrentSchoolYear();
            
            // Get next school year (for enrollment)
            $nextSY = $this->getNextSchoolYear();
            
            // Check if student is enrolled in current school year
            $isEnrolled = $this->isEnrolledInSchoolYear($studentProfileId, $currentSY['SchoolYearID'] ?? null);
            
            // Check if enrollment is open for next school year
            $isEnrollmentOpen = $nextSY ? $this->isEnrollmentOpen($nextSY['SchoolYearID']) : false;

            return [
                'isEnrolled' => $isEnrolled,
                'isEnrollmentOpen' => $isEnrollmentOpen,
                'currentSchoolYear' => $currentSY['YearName'] ?? null,
                'nextSchoolYear' => $nextSY['YearName'] ?? null
            ];
        } catch (Exception $e) {
            error_log("Error in getEnrollmentStatus: " . $e->getMessage());
            return [
                'isEnrolled' => false,
                'isEnrollmentOpen' => false,
                'currentSchoolYear' => null,
                'nextSchoolYear' => null
            ];
        }
    }

    /**
     * Get current active school year
     */
    private function getCurrentSchoolYear()
    {
        $query = "
            SELECT SchoolYearID, YearName 
            FROM schoolyear 
            WHERE IsActive = 1 
            LIMIT 1
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getCurrentSchoolYear: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get next school year (upcoming enrollment period)
     */
    private function getNextSchoolYear()
    {
        $query = "
            SELECT SchoolYearID, YearName 
            FROM schoolyear 
            WHERE IsActive = 0 
            AND SchoolYearID > (SELECT COALESCE(MAX(SchoolYearID), 0) FROM schoolyear WHERE IsActive = 1)
            ORDER BY SchoolYearID ASC 
            LIMIT 1
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getNextSchoolYear: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Check if student is enrolled in a specific school year
     */
    private function isEnrolledInSchoolYear($studentProfileId, $schoolYearId)
    {
        if (!$schoolYearId) {
            return false;
        }

        $query = "
            SELECT COUNT(*) as count 
            FROM enrollment 
            WHERE StudentProfileID = :student_profile_id 
            AND SchoolYearID = :school_year_id
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':student_profile_id', $studentProfileId, PDO::PARAM_INT);
            $stmt->bindParam(':school_year_id', $schoolYearId, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['count'] > 0;
        } catch (PDOException $e) {
            error_log("Error in isEnrolledInSchoolYear: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if enrollment is open for a school year
     * You can customize this logic based on your enrollment period settings
     */
    private function isEnrollmentOpen($schoolYearId)
    {
        // For now, we'll assume enrollment is open if there's a next school year
        // You can add more complex logic here (e.g., check enrollment start/end dates)
        
        $query = "
            SELECT 
                EnrollmentStartDate,
                EnrollmentEndDate
            FROM schoolyear 
            WHERE SchoolYearID = :school_year_id
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':school_year_id', $schoolYearId, PDO::PARAM_INT);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$result) {
                return false;
            }

            // If no dates are set, assume enrollment is not open
            if (!$result['EnrollmentStartDate'] || !$result['EnrollmentEndDate']) {
                return false;
            }

            $now = new DateTime();
            $startDate = new DateTime($result['EnrollmentStartDate']);
            $endDate = new DateTime($result['EnrollmentEndDate']);

            // Check if current date is within enrollment period
            return $now >= $startDate && $now <= $endDate;
        } catch (Exception $e) {
            error_log("Error in isEnrollmentOpen: " . $e->getMessage());
            return false;
        }
    }
}
