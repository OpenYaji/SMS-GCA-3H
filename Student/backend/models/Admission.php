<?php
class Admission
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function create($data)
    {
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO application (
                    ApplicantProfileID,
                    SchoolYearID,
                    ApplyingForGradeLevelID,
                    EnrolleeType,
                    ApplicationStatus,
                    SubmissionDate,
                    PreviousSchool,
                    StudentFirstName,
                    StudentLastName,
                    StudentMiddleName,
                    DateOfBirth,
                    Gender,
                    Address,
                    ContactNumber,
                    EmailAddress,
                    GuardianFirstName,
                    GuardianLastName,
                    GuardianRelationship,
                    GuardianContact,
                    GuardianEmail,
                    TrackingNumber,
                    PrivacyAgreement
                ) VALUES (
                    :applicantProfileId,
                    :schoolYearId,
                    :applyingForGradeLevelId,
                    :enrolleeType,
                    'Pending',
                    NOW(),
                    :previousSchool,
                    :studentFirstName,
                    :studentLastName,
                    :studentMiddleName,
                    :dateOfBirth,
                    :gender,
                    :address,
                    :contactNumber,
                    :emailAddress,
                    :guardianFirstName,
                    :guardianLastName,
                    :guardianRelationship,
                    :guardianContact,
                    :guardianEmail,
                    :trackingNumber,
                    :privacyAgreement
                )
            ");

            $executed = $stmt->execute($data);

            if (!$executed) {
                error_log("Database insert failed: " . print_r($stmt->errorInfo(), true));
                return false;
            }

            return $this->pdo->lastInsertId();
        } catch (PDOException $e) {
            error_log("Database error in Admission::create: " . $e->getMessage());
            return false;
        }
    }

    public function findByTrackingNumber($trackingNumber)
    {
        $stmt = $this->pdo->prepare("
            SELECT 
                a.ApplicationID as id,
                a.TrackingNumber as tracking_number,
                CONCAT(a.StudentFirstName, ' ', 
                       IFNULL(CONCAT(a.StudentMiddleName, ' '), ''), 
                       a.StudentLastName) as student_name,
                gl.LevelName as grade_level,
                a.ApplicationStatus as application_status,
                a.SubmissionDate as submitted_at,
                a.ReviewedDate as updated_at
            FROM application a
            LEFT JOIN gradelevel gl ON a.ApplyingForGradeLevelID = gl.GradeLevelID
            WHERE a.TrackingNumber = :tracking_number
        ");

        $stmt->execute([':tracking_number' => $trackingNumber]);
        return $stmt->fetch();
    }

    public function addDocument($applicationId, $documentType, $fileName, $filePath, $fileSize = null, $mimeType = null)
    {
        // First, upload to securefile table
        $stmt = $this->pdo->prepare("
            INSERT INTO securefile (
                OriginalFileName,
                StoredFileName,
                FilePath,
                FileSize,
                MimeType,
                UploadedByUserID,
                UploadedAt,
                AccessLevel
            ) VALUES (
                :originalFileName,
                :storedFileName,
                :filePath,
                :fileSize,
                :mimeType,
                999,
                NOW(),
                'private'
            )
        ");

        $stmt->execute([
            ':originalFileName' => $fileName,
            ':storedFileName' => $fileName,
            ':filePath' => $filePath,
            ':fileSize' => $fileSize,
            ':mimeType' => $mimeType
        ]);

        $secureFileId = $this->pdo->lastInsertId();

        // Get or create requirement type
        $reqTypeStmt = $this->pdo->prepare("
            SELECT RequirementTypeID FROM requirementtype WHERE TypeName = :typeName
        ");
        $reqTypeStmt->execute([':typeName' => $documentType]);
        $reqType = $reqTypeStmt->fetch();

        if (!$reqType) {
            $insertReqType = $this->pdo->prepare("
                INSERT INTO requirementtype (TypeName, IsMandatory, SortOrder) 
                VALUES (:typeName, 1, 0)
            ");
            $insertReqType->execute([':typeName' => $documentType]);
            $requirementTypeId = $this->pdo->lastInsertId();
        } else {
            $requirementTypeId = $reqType['RequirementTypeID'];
        }

        // Link to applicationrequirement
        $stmt = $this->pdo->prepare("
            INSERT INTO applicationrequirement (
                ApplicationID,
                RequirementTypeID,
                SecureFileID,
                RequirementStatus,
                SubmittedDate
            ) VALUES (
                :applicationId,
                :requirementTypeId,
                :secureFileId,
                'Submitted',
                NOW()
            )
        ");

        return $stmt->execute([
            ':applicationId' => $applicationId,
            ':requirementTypeId' => $requirementTypeId,
            ':secureFileId' => $secureFileId
        ]);
    }

    public function getAll($limit = 50, $offset = 0, $status = null)
    {
        $query = "
            SELECT 
                a.ApplicationID as id,
                a.TrackingNumber as tracking_number,
                CONCAT(a.StudentFirstName, ' ', a.StudentLastName) as student_name,
                gl.LevelName as grade_level,
                a.ApplicationStatus as application_status,
                a.SubmissionDate as submitted_at
            FROM application a
            LEFT JOIN gradelevel gl ON a.ApplyingForGradeLevelID = gl.GradeLevelID";

        if ($status) {
            $query .= " WHERE a.ApplicationStatus = :status";
        }

        $query .= " ORDER BY a.SubmissionDate DESC LIMIT :limit OFFSET :offset";

        $stmt = $this->pdo->prepare($query);

        if ($status) {
            $stmt->bindValue(':status', $status);
        }

        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function updateStatus($id, $status, $reviewedByUserId = null)
    {
        $stmt = $this->pdo->prepare("
            UPDATE application 
            SET ApplicationStatus = :status,
                ReviewedDate = NOW(),
                ReviewedByUserID = :reviewedByUserId
            WHERE ApplicationID = :id
        ");

        return $stmt->execute([
            ':status' => $status,
            ':reviewedByUserId' => $reviewedByUserId,
            ':id' => $id
        ]);
    }

    public function getGradeLevels()
    {
        $stmt = $this->pdo->query("
            SELECT GradeLevelID as id, LevelName as name 
            FROM gradelevel 
            ORDER BY SortOrder ASC
        ");

        return $stmt->fetchAll();
    }

    public function getActiveSchoolYear()
    {
        $stmt = $this->pdo->query("
            SELECT SchoolYearID 
            FROM schoolyear 
            WHERE IsActive = 1 
            LIMIT 1
        ");

        $result = $stmt->fetch();
        return $result ? $result['SchoolYearID'] : 1;
    }

    public function getGradeLevelIdByName($levelName)
    {
        $stmt = $this->pdo->prepare("
            SELECT GradeLevelID 
            FROM gradelevel 
            WHERE LOWER(REPLACE(LevelName, ' ', '')) = LOWER(REPLACE(:levelName, ' ', ''))
            OR LOWER(REPLACE(LevelName, '-', '')) = LOWER(REPLACE(:levelName, '-', ''))
        ");

        $stmt->execute([':levelName' => $levelName]);
        $result = $stmt->fetch();

        return $result ? $result['GradeLevelID'] : null;
    }
}
