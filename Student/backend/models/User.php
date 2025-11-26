<?php

class User
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

// models/User.php

public function getUserByIdentifier($identifier)
{
    // This query checks if the input matches:
    // 1. Email in user table
    // 2. StudentNumber in studentprofile
    // 3. EmployeeNumber in teacher/admin/registrar/guard profiles
    $query = "
        SELECT 
            u.UserID,
            u.UserType,
            u.AccountStatus,
            pp.PasswordHash,
            CONCAT(p.FirstName, ' ', p.LastName) AS FullName
        FROM user u
        JOIN profile p ON u.UserID = p.UserID
        JOIN passwordpolicy pp ON u.UserID = pp.UserID
        LEFT JOIN studentprofile sp ON p.ProfileID = sp.ProfileID
        LEFT JOIN teacherprofile tp ON p.ProfileID = tp.ProfileID
        LEFT JOIN adminprofile ap ON p.ProfileID = ap.ProfileID
        LEFT JOIN registrarprofile rp ON p.ProfileID = rp.ProfileID
        LEFT JOIN guardprofile gp ON p.ProfileID = gp.ProfileID
        WHERE 
            (u.EmailAddress = :identifier) OR 
            (sp.StudentNumber = :identifier) OR 
            (tp.EmployeeNumber = :identifier) OR
            (ap.EmployeeNumber = :identifier) OR
            (rp.EmployeeNumber = :identifier) OR
            (gp.EmployeeNumber = :identifier)
        LIMIT 1
    ";

    try {
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':identifier', $identifier);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }
}


    public function getStudentByUserId($userId)
    {
        $query = "
            SELECT 
                u.UserID, u.EmailAddress, u.UserType, u.AccountStatus, u.LastLoginDate,
                p.ProfileID, p.FirstName, p.LastName, p.MiddleName,
                CONCAT_WS(' ', p.FirstName, p.MiddleName, p.LastName) AS FullName,
                CAST(p.EncryptedPhoneNumber AS CHAR) AS PhoneNumber,
                CAST(p.EncryptedAddress AS CHAR) AS Address,
                p.ProfilePictureURL,
                sp.StudentProfileID, sp.StudentNumber, sp.QRCodeID, sp.DateOfBirth, sp.Gender, sp.Nationality, sp.StudentStatus,
                TIMESTAMPDIFF(YEAR, sp.DateOfBirth, CURDATE()) AS Age,
                sy.YearName AS SchoolYear, sy.SchoolYearID,
                gl.LevelName AS GradeLevel,
                sec.SectionName, sec.SectionID,
                CONCAT(gl.LevelName, ' - ', sec.SectionName) AS GradeAndSection,
                CONCAT_WS(' ', adviser_profile.FirstName, adviser_profile.LastName) AS AdviserName,
                mi.Weight, mi.Height,
                CAST(mi.EncryptedAllergies AS CHAR) AS Allergies,
                CAST(mi.EncryptedMedicalConditions AS CHAR) AS MedicalConditions,
                CAST(mi.EncryptedMedications AS CHAR) AS Medications,
                ec.ContactPerson AS EmergencyContactPerson,
                CAST(ec.EncryptedContactNumber AS CHAR) AS EmergencyContactNumber,
                g_primary.FullName AS PrimaryGuardianName,
                sg_primary.RelationshipType AS PrimaryGuardianRelationship,
                CAST(g_primary.EncryptedPhoneNumber AS CHAR) AS PrimaryGuardianContactNumber,
                CAST(g_primary.EncryptedEmailAddress AS CHAR) AS PrimaryGuardianEmail
            FROM 
                user u
            JOIN profile p ON u.UserID = p.UserID
            JOIN studentprofile sp ON p.ProfileID = sp.ProfileID
            
            LEFT JOIN (
                SELECT e_inner.*
                FROM enrollment e_inner
                INNER JOIN (
                    -- This subquery finds the single highest EnrollmentID for each student
                    SELECT StudentProfileID, MAX(EnrollmentID) as MaxID
                    FROM enrollment
                    GROUP BY StudentProfileID
                ) latest_e ON e_inner.StudentProfileID = latest_e.StudentProfileID AND e_inner.EnrollmentID = latest_e.MaxID
            ) e ON sp.StudentProfileID = e.StudentProfileID

            LEFT JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
            LEFT JOIN section sec ON e.SectionID = sec.SectionID
            LEFT JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
            LEFT JOIN teacherprofile tp ON sec.AdviserTeacherID = tp.TeacherProfileID
            LEFT JOIN profile adviser_profile ON tp.ProfileID = adviser_profile.ProfileID
            LEFT JOIN medicalinfo mi ON sp.StudentProfileID = mi.StudentProfileID
            LEFT JOIN emergencycontact ec ON sp.StudentProfileID = ec.StudentProfileID
            LEFT JOIN studentguardian sg_primary ON sp.StudentProfileID = sg_primary.StudentProfileID AND sg_primary.IsPrimaryContact = 1
            LEFT JOIN guardian g_primary ON sg_primary.GuardianID = g_primary.GuardianID
            WHERE 
                u.UserID = :userId 
                AND u.UserType = 'Student'
                AND u.IsDeleted = 0
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return false;
        }
    }

    public function findByStudentNumberOrEmail($identifier)
    {
        $query = "
            SELECT 
                u.UserID, u.EmailAddress,
                CONCAT(p.FirstName, ' ', p.LastName) AS FullName,
                sp.StudentNumber
            FROM user u
            JOIN profile p ON u.UserID = p.UserID
            JOIN studentprofile sp ON p.ProfileID = sp.ProfileID
            WHERE (sp.StudentNumber = :identifier OR u.EmailAddress = :identifier)
                AND u.UserType = 'Student'
                AND u.IsDeleted = 0
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':identifier', $identifier);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error finding user: " . $e->getMessage());
            return false;
        }
    }

    public function createPasswordResetToken($userId, $token, $expiresAt)
    {
        $query = "INSERT INTO password_reset_tokens (UserID, Token, ExpiresAt) VALUES (:userId, :token, :expiresAt)";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->bindParam(':token', $token);
            $stmt->bindParam(':expiresAt', $expiresAt);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error creating reset token: " . $e->getMessage());
            return false;
        }
    }

    public function getPasswordResetToken($token)
    {
        $query = "
            SELECT prt.*, u.UserID, u.EmailAddress,
                CONCAT(p.FirstName, ' ', p.LastName) AS FullName
            FROM password_reset_tokens prt
            JOIN user u ON prt.UserID = u.UserID
            JOIN profile p ON u.UserID = p.UserID
            WHERE prt.Token = :token 
                AND prt.IsUsed = 0 
                AND prt.ExpiresAt > NOW()
        ";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error getting reset token: " . $e->getMessage());
            return false;
        }
    }

    public function markTokenAsUsed($token)
    {
        $query = "UPDATE password_reset_tokens SET IsUsed = 1 WHERE Token = :token";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error marking token as used: " . $e->getMessage());
            return false;
        }
    }

    public function updatePassword($userId, $newPasswordHash)
    {
        $query = "UPDATE passwordpolicy SET PasswordHash = :passwordHash, PasswordSetDate = NOW() WHERE UserID = :userId";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':passwordHash', $newPasswordHash);
            $stmt->bindParam(':userId', $userId);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error updating password: " . $e->getMessage());
            return false;
        }
    }
}
