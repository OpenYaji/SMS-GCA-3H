<!-- <?php

class Grade {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get all grades for a student by user ID for the active school year
     */
    public function getStudentGradesByUserId($userId) {
        $query = "
            SELECT 
                s.SubjectID AS id,
                s.SubjectName AS name,
                MAX(CASE WHEN g.Quarter = 'First Quarter' THEN g.GradeValue ELSE NULL END) AS q1,
                MAX(CASE WHEN g.Quarter = 'Second Quarter' THEN g.GradeValue ELSE NULL END) AS q2,
                MAX(CASE WHEN g.Quarter = 'Third Quarter' THEN g.GradeValue ELSE NULL END) AS q3,
                MAX(CASE WHEN g.Quarter = 'Fourth Quarter' THEN g.GradeValue ELSE NULL END) AS q4
            FROM grade g
            JOIN subject s ON g.SubjectID = s.SubjectID
            JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
            JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
            JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
            JOIN profile p ON sp.ProfileID = p.ProfileID
            WHERE p.UserID = :user_id AND sy.IsActive = 1
            GROUP BY s.SubjectID, s.SubjectName
            ORDER BY s.SubjectID
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getStudentGradesByUserId: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get GWA (General Weighted Average) for the latest quarter
     */
    public function getLatestQuarterGWA($userId) {
        $query = "
            SELECT 
                AVG(g.GradeValue) as generalAverage,
                g.Quarter as quarter
            FROM grade g
            JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
            JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
            JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
            JOIN profile p ON sp.ProfileID = p.ProfileID
            WHERE p.UserID = :user_id AND sy.IsActive = 1
            GROUP BY g.Quarter
            ORDER BY FIELD(g.Quarter, 'First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter') DESC
            LIMIT 1
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getLatestQuarterGWA: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get grades for a specific subject and student
     */
    public function getGradesBySubject($userId, $subjectId) {
        $query = "
            SELECT 
                g.GradeID,
                g.Quarter,
                g.GradeValue,
                g.Remarks,
                s.SubjectName
            FROM grade g
            JOIN subject s ON g.SubjectID = s.SubjectID
            JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
            JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
            JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
            JOIN profile p ON sp.ProfileID = p.ProfileID
            WHERE p.UserID = :user_id 
                AND s.SubjectID = :subject_id 
                AND sy.IsActive = 1
            ORDER BY 
                FIELD(g.Quarter, 'First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter')
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':subject_id', $subjectId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getGradesBySubject: " . $e->getMessage());
            return false;
        }
    }

    public function getPreviousGradesByUserId($userId) {
        $query = "
            SELECT 
                sy.YearName as schoolYear,
                sy.SchoolYearID as schoolYearId, -- <-- MODIFICATION: Added this line
                gl.LevelName as gradeLevel,
                s.SubjectID as subjectId,
                s.SubjectName as subjectName,
                g.Quarter,
                g.GradeValue
            FROM grade g
            JOIN subject s ON g.SubjectID = s.SubjectID
            JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
            JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
            JOIN section sec ON e.SectionID = sec.SectionID
            JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
            JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
            JOIN profile p ON sp.ProfileID = p.ProfileID
            WHERE p.UserID = :user_id AND sy.IsActive = 0
            ORDER BY sy.StartDate DESC, s.SubjectID, g.Quarter
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getPreviousGradesByUserId: " . $e->getMessage());
            return false;
        }
    }
    
    public function getAttendanceSummary($userId) {
        $query = "
            SELECT 
                ats.TotalDaysPresent,
                ats.TotalSchoolDays,
                ats.AttendancePercentage
            FROM attendancesummary ats
            JOIN studentprofile sp ON ats.StudentProfileID = sp.StudentProfileID
            JOIN profile p ON sp.ProfileID = p.ProfileID
            JOIN schoolyear sy ON ats.SchoolYearID = sy.SchoolYearID
            WHERE p.UserID = :user_id AND sy.IsActive = 1
            LIMIT 1
        ";
    
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getAttendanceSummary: " . $e->getMessage());
            return false;
        }
    }
    
    public function getParticipationRating($userId) {
        $query = "
            SELECT 
                pr.Rating,
                pr.Remark
            FROM participationrating pr
            JOIN studentprofile sp ON pr.StudentProfileID = sp.StudentProfileID
            JOIN profile p ON sp.ProfileID = p.ProfileID
            JOIN schoolyear sy ON pr.SchoolYearID = sy.SchoolYearID
            WHERE p.UserID = :user_id AND sy.IsActive = 1
            LIMIT 1
        ";
    
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getParticipationRating: " . $e->getMessage());
            return false;
        }
    }
    
    public function getAttendanceSummaryBySchoolYear($userId, $schoolYearId) {
        $query = "
            SELECT 
                ats.TotalDaysPresent,
                ats.TotalSchoolDays,
                ats.AttendancePercentage
            FROM attendancesummary ats
            JOIN studentprofile sp ON ats.StudentProfileID = sp.StudentProfileID
            JOIN profile p ON sp.ProfileID = p.ProfileID
            WHERE p.UserID = :user_id AND ats.SchoolYearID = :school_year_id
            LIMIT 1
        ";
    
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':school_year_id', $schoolYearId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getAttendanceSummaryBySchoolYear: " . $e->getMessage());
            return false;
        }
    }
}
?> -->