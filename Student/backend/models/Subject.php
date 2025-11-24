<?php

class Subject
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Get all subjects for a student based on their grades
     * Includes teacher information from class schedules
     */
    public function getStudentSubjects($userId)
    {
        error_log("=== getStudentSubjects called for UserID: $userId ===");

        $query = "
            SELECT DISTINCT
                s.SubjectID as id,
                s.SubjectName as name,
                s.SubjectCode as code,
                GROUP_CONCAT(
                    DISTINCT CONCAT(tp_profile.FirstName, ' ', tp_profile.LastName)
                    SEPARATOR ', '
                ) as teacher,
                MAX(cs.RoomNumber) as room,
                GROUP_CONCAT(
                    DISTINCT CONCAT(
                        cs.DayOfWeek, ' ', 
                        TIME_FORMAT(cs.StartTime, '%h:%i %p'), ' - ', 
                        TIME_FORMAT(cs.EndTime, '%h:%i %p')
                    )
                    ORDER BY FIELD(cs.DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
                    SEPARATOR ', '
                ) as schedule
            FROM subject s
            INNER JOIN grade g ON s.SubjectID = g.SubjectID
            INNER JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
            INNER JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
            INNER JOIN profile p ON sp.ProfileID = p.ProfileID
            INNER JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
            LEFT JOIN section sec ON e.SectionID = sec.SectionID
            LEFT JOIN classschedule cs ON s.SubjectID = cs.SubjectID AND sec.SectionID = cs.SectionID
            LEFT JOIN teacherprofile tp ON cs.TeacherProfileID = tp.TeacherProfileID
            LEFT JOIN profile tp_profile ON tp.ProfileID = tp_profile.ProfileID
            WHERE p.UserID = :user_id 
                AND sy.IsActive = 1
                AND s.IsActive = 1
            GROUP BY s.SubjectID, s.SubjectName, s.SubjectCode
            ORDER BY s.SubjectName
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();

            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            error_log("Query returned " . count($results) . " subjects for UserID: $userId");

            // Clean up results
            foreach ($results as &$result) {
                // Handle teacher: if empty or null, set to "Not Assigned"
                if (empty(trim($result['teacher']))) {
                    $result['teacher'] = 'Not Assigned';
                }

                // Handle schedule: remove if empty or invalid
                if (empty($result['schedule']) || $result['schedule'] === ' 12:00 AM -  12:00 AM') {
                    $result['schedule'] = null;
                }

                // Handle room: set to null if empty
                if (empty($result['room'])) {
                    $result['room'] = null;
                }
            }
            unset($result);

            return $results;
        } catch (PDOException $e) {
            error_log("Error in getStudentSubjects: " . $e->getMessage());
            error_log("Query: " . $query);
            return false;
        }
    }

    /**
     * Get subject details by ID with teacher info
     */
    public function getSubjectById($subjectId, $userId)
    {
        $query = "
            SELECT 
                s.SubjectID as id,
                s.SubjectName as name,
                s.SubjectCode as code,
                COALESCE(
                    CONCAT(tp_profile.FirstName, ' ', tp_profile.LastName),
                    'Not Assigned'
                ) as teacher,
                cs.RoomNumber as room,
                GROUP_CONCAT(
                    DISTINCT CONCAT(
                        cs.DayOfWeek, ' ', 
                        TIME_FORMAT(cs.StartTime, '%h:%i %p'), ' - ', 
                        TIME_FORMAT(cs.EndTime, '%h:%i %p')
                    )
                    ORDER BY FIELD(cs.DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
                    SEPARATOR ', '
                ) as schedule,
                gl.LevelName as gradeLevel
            FROM subject s
            INNER JOIN grade g ON s.SubjectID = g.SubjectID
            INNER JOIN enrollment e ON g.EnrollmentID = e.EnrollmentID
            INNER JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
            INNER JOIN profile p ON sp.ProfileID = p.ProfileID
            INNER JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
            LEFT JOIN section sec ON e.SectionID = sec.SectionID
            LEFT JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
            LEFT JOIN classschedule cs ON s.SubjectID = cs.SubjectID AND sec.SectionID = cs.SectionID
            LEFT JOIN teacherprofile tp ON cs.TeacherProfileID = tp.TeacherProfileID
            LEFT JOIN profile tp_profile ON tp.ProfileID = tp_profile.ProfileID
            WHERE s.SubjectID = :subject_id 
                AND p.UserID = :user_id 
                AND sy.IsActive = 1
            GROUP BY s.SubjectID, s.SubjectName, s.SubjectCode, tp_profile.FirstName, tp_profile.LastName, cs.RoomNumber, gl.LevelName
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':subject_id', $subjectId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            // Clean up result
            if ($result) {
                if (empty($result['schedule']) || $result['schedule'] === ' 12:00 AM -  12:00 AM') {
                    $result['schedule'] = null;
                }
                if (empty($result['room'])) {
                    $result['room'] = null;
                }
            }

            return $result;
        } catch (PDOException $e) {
            error_log("Error in getSubjectById: " . $e->getMessage());
            return false;
        }
    }
}
