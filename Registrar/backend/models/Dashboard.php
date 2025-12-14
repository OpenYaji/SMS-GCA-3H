<?php

class Dashboard {
    private $pdo;
    private $activeSchoolYearID;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        // Get the active School Year ID upon class instantiation
        $this->activeSchoolYearID = $this->getActiveSchoolYearID();
    }

    /**
     * Retrieves the SchoolYearID where IsActive is TRUE (or 1).
     * If no active school year is found, returns null.
     * @return int|null The active SchoolYearID or null.
     */
    private function getActiveSchoolYearID() {
        // Fetch the ID of the currently active school year
        $stmt = $this->pdo->prepare("SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1");
        $stmt->execute();
        $id = $stmt->fetchColumn();
        return $id !== false ? $id : null; // Return null if no active ID is found
    }

    /**
     * Checks if there is no active school year, which triggers the reset to 0.
     * @return bool True if counts should be zeroed out.
     */
    private function getZeroIfNoActiveYear() {
        return $this->activeSchoolYearID === null;
    }

    public function getPendingApplicationsCount() {
        if ($this->getZeroIfNoActiveYear()) {
            return 0;
        }
        
        // Filter by ApplicationStatus AND the active SchoolYearID
        $sql = "SELECT COUNT(*) FROM application 
                WHERE ApplicationStatus = :ApplicationStatus 
                AND SchoolYearID = :SchoolYearID";
        
        $stmt = $this->pdo->prepare($sql);
        $params = [
            'ApplicationStatus' => 'Pending',
            'SchoolYearID' => $this->activeSchoolYearID
        ];
        
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    public function getPendingTasksCount() {
        if ($this->getZeroIfNoActiveYear()) {
            return 0;
        }

        // Filter by multiple ApplicationStatus AND the active SchoolYearID
        $sql = "SELECT COUNT(*) FROM application 
                WHERE ApplicationStatus IN ('Pending', 'For Review') 
                AND SchoolYearID = :SchoolYearID";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['SchoolYearID' => $this->activeSchoolYearID]);
        return $stmt->fetchColumn();
    }

    public function getActiveEnrollmentsCount() {
        if ($this->getZeroIfNoActiveYear()) {
            return 0;
        }

        // Filter by ApplicationStatus AND the active SchoolYearID
        $sql = "SELECT COUNT(*) FROM application 
                WHERE ApplicationStatus = :ApplicationStatus 
                AND SchoolYearID = :SchoolYearID";
                
        $stmt = $this->pdo->prepare($sql);
        $params = [
            'ApplicationStatus' => 'Enrolled',
            'SchoolYearID' => $this->activeSchoolYearID
        ];
        
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }
}