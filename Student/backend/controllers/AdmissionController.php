<?php
require_once __DIR__ . '/../models/Admission.php';
require_once __DIR__ . '/../config/mailer.php';

class AdmissionController
{
    private $pdo;
    private $admissionModel;
    private $uploadDir;
    private $mailer;
    private $allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    private $maxFileSize = 5242880; // 5MB

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
        $this->admissionModel = new Admission($pdo);
        $this->uploadDir = __DIR__ . '/../uploads/admission_documents/';
        $this->mailer = new Mailer();
        $this->ensureUploadDirectory();
    }

    private function ensureUploadDirectory()
    {
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    private function sanitize($data)
    {
        if (is_array($data)) {
            return array_map([$this, 'sanitize'], $data);
        }
        return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
    }

    private function isValidEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    private function isValidPhoneNumber($phone)
    {
        $cleaned = preg_replace('/[^0-9+]/', '', $phone);
        return preg_match('/^(09|\+639)\d{9}$/', $cleaned) || preg_match('/^\d{7,11}$/', $cleaned);
    }

    private function generateTrackingNumber()
    {
        $year = date('Y');
        $randomNum = str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
        $trackingNumber = "GCA-{$year}-{$randomNum}";

        // Check if tracking number exists
        $exists = $this->admissionModel->findByTrackingNumber($trackingNumber);
        if ($exists) {
            return $this->generateTrackingNumber(); // Recursive call if exists
        }

        return $trackingNumber;
    }

    private function validate($data)
    {
        $errors = [];

        // Enrollee type validation
        if (empty($data['enrolleeType']) || !in_array($data['enrolleeType'], ['returnee', 'new', 'transferee'])) {
            $errors[] = "Valid enrollee type is required (returnee, new, or transferee)";
        }

        // Student name validation
        if (empty($data['studentFirstName']) || strlen($data['studentFirstName']) < 2) {
            $errors[] = "Student first name must be at least 2 characters";
        }
        if (empty($data['studentLastName']) || strlen($data['studentLastName']) < 2) {
            $errors[] = "Student last name must be at least 2 characters";
        }

        // Birthdate validation
        if (empty($data['birthdate'])) {
            $errors[] = "Birthdate is required";
        } else {
            try {
                $birthDate = new DateTime($data['birthdate']);
                $today = new DateTime();
                $age = $today->diff($birthDate)->y;
                if ($age < 2 || $age > 25) {
                    $errors[] = "Student age must be between 2 and 25 years";
                }
            } catch (Exception $e) {
                $errors[] = "Invalid birthdate format";
            }
        }

        // Gender validation
        if (empty($data['gender']) || !in_array(strtolower($data['gender']), ['male', 'female'])) {
            $errors[] = "Valid gender is required (male or female)";
        }

        // Address validation
        if (empty($data['address']) || strlen($data['address']) < 10) {
            $errors[] = "Complete address is required (minimum 10 characters)";
        }

        // Contact number validation
        if (empty($data['contactNumber']) || !$this->isValidPhoneNumber($data['contactNumber'])) {
            $errors[] = "Valid Philippine contact number is required (e.g., 09123456789)";
        }

        // Email validation (optional but if provided must be valid)
        if (!empty($data['emailAddress']) && !$this->isValidEmail($data['emailAddress'])) {
            $errors[] = "Valid email address format required";
        }

        // Guardian validation
        if (empty($data['guardianFirstName'])) {
            $errors[] = "Guardian first name is required";
        }
        if (empty($data['guardianLastName'])) {
            $errors[] = "Guardian last name is required";
        }
        if (empty($data['relationship'])) {
            $errors[] = "Relationship to student is required";
        }

        // Guardian contact validation
        if (empty($data['guardianContact']) || !$this->isValidPhoneNumber($data['guardianContact'])) {
            $errors[] = "Valid guardian contact number is required";
        }

        // Guardian email validation (optional)
        if (!empty($data['guardianEmail']) && !$this->isValidEmail($data['guardianEmail'])) {
            $errors[] = "Valid guardian email format required";
        }

        // Grade level validation
        if (empty($data['gradeLevel'])) {
            $errors[] = "Grade level is required";
        }

        // Privacy agreement
        if (empty($data['privacyAgreement']) || $data['privacyAgreement'] !== 'agreed') {
            $errors[] = "You must agree to the Privacy Policy";
        }

        return $errors;
    }

    public function submitApplication($postData, $files = [])
    {
        try {
            $this->pdo->beginTransaction();

            // Sanitize input
            $postData = $this->sanitize($postData);

            // Validate data
            $errors = $this->validate($postData);
            if (!empty($errors)) {
                throw new Exception(implode("; ", $errors));
            }

            // Generate tracking number
            $trackingNumber = $this->generateTrackingNumber();

            // Get active school year
            $schoolYearId = $this->admissionModel->getActiveSchoolYear();
            if (!$schoolYearId) {
                throw new Exception("No active school year found. Please contact administration.");
            }

            // Get grade level ID
            $gradeLevelId = $this->admissionModel->getGradeLevelIdByName($postData['gradeLevel']);
            if (!$gradeLevelId) {
                throw new Exception("Invalid grade level selected: " . $postData['gradeLevel']);
            }

            // Map enrollee type to match enum values
            $enrolleeTypeMap = [
                'new' => 'New',
                'returnee' => 'Old',
                'transferee' => 'Transferee'
            ];
            $enrolleeType = $enrolleeTypeMap[strtolower($postData['enrolleeType'])] ?? 'New';

            // Map gender to match enum values
            $gender = ucfirst(strtolower($postData['gender'])); // Male or Female

            // Prepare data for insertion - REMOVE ApplicantProfileID since it's causing issues
            $data = [
                ':applicantProfileId' => NULL, // Set to NULL instead of 999
                ':schoolYearId' => $schoolYearId,
                ':applyingForGradeLevelId' => $gradeLevelId,
                ':enrolleeType' => $enrolleeType,
                ':previousSchool' => $postData['previousSchool'] ?? null,
                ':studentFirstName' => $postData['studentFirstName'],
                ':studentLastName' => $postData['studentLastName'],
                ':studentMiddleName' => $postData['studentMiddleName'] ?? null,
                ':dateOfBirth' => $postData['birthdate'],
                ':gender' => $gender,
                ':address' => $postData['address'],
                ':contactNumber' => $postData['contactNumber'],
                ':emailAddress' => $postData['emailAddress'] ?? null,
                ':guardianFirstName' => $postData['guardianFirstName'],
                ':guardianLastName' => $postData['guardianLastName'],
                ':guardianRelationship' => $postData['relationship'],
                ':guardianContact' => $postData['guardianContact'],
                ':guardianEmail' => $postData['guardianEmail'] ?? null,
                ':trackingNumber' => $trackingNumber,
                ':privacyAgreement' => 1
            ];

            // Log the data being inserted for debugging
            error_log("Attempting to insert application with data: " . print_r($data, true));

            // Insert application
            $applicationId = $this->admissionModel->create($data);

            if (!$applicationId) {
                throw new Exception("Database insert failed. Please check server logs.");
            }

            // Handle file uploads if any
            if (!empty($files)) {
                $this->processDocuments($files, $applicationId, $trackingNumber);
            }

            $this->pdo->commit();

            // Send confirmation email
            $this->sendConfirmationEmail($postData, $trackingNumber);

            return [
                'success' => true,
                'message' => 'Application submitted successfully! Please check your email for confirmation.',
                'tracking_number' => $trackingNumber,
                'application_id' => $applicationId
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            error_log("Admission submission error: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    private function sendConfirmationEmail($postData, $trackingNumber)
    {
        try {
            // Prepare email data
            $studentFullName = trim($postData['studentFirstName'] . ' ' .
                ($postData['studentMiddleName'] ?? '') . ' ' .
                $postData['studentLastName']);

            $guardianFullName = trim($postData['guardianFirstName'] . ' ' .
                $postData['guardianLastName']);

            // Format grade level for display
            $gradeLevelDisplay = ucwords(str_replace(['-', '_'], ' ', $postData['gradeLevel']));

            // Format enrollee type for display
            $enrolleeTypeDisplay = ucfirst($postData['enrolleeType']);

            $emailData = [
                'trackingNumber' => $trackingNumber,
                'studentName' => $studentFullName,
                'guardianName' => $guardianFullName,
                'gradeLevel' => $gradeLevelDisplay,
                'enrolleeType' => $enrolleeTypeDisplay,
                'submissionDate' => date('F d, Y h:i A'),
                'contactNumber' => $postData['contactNumber'],
                'address' => $postData['address'],
                'studentEmail' => $postData['emailAddress'] ?? null
            ];

            // Send email to guardian
            $guardianEmail = $postData['guardianEmail'] ?? null;

            if ($guardianEmail) {
                $emailSent = $this->mailer->sendAdmissionConfirmation($guardianEmail, $emailData);

                if (!$emailSent) {
                    error_log("Failed to send confirmation email to: " . $guardianEmail);
                }
            } else {
                error_log("No guardian email provided for tracking number: " . $trackingNumber);
            }
        } catch (Exception $e) {
            error_log("Error sending confirmation email: " . $e->getMessage());
            // Don't throw exception - email failure shouldn't fail the entire submission
        }
    }

    private function processDocuments($files, $applicationId, $trackingNumber)
    {
        $documentTypes = [
            'reportCard' => 'Report Card',
            'goodMoral' => 'Good Moral Certificate',
            'birthCertificate' => 'Birth Certificate',
            'certificateOfCompletion' => 'Certificate of Completion',
            'sf10Form137' => 'SF10 Form 137'
        ];

        foreach ($documentTypes as $key => $label) {
            if (isset($files[$key]) && $files[$key]['error'] !== UPLOAD_ERR_NO_FILE) {
                try {
                    $result = $this->handleFileUpload($files[$key], $trackingNumber, $key);

                    if ($result) {
                        $this->admissionModel->addDocument(
                            $applicationId,
                            $label,
                            $result['fileName'],
                            $result['filePath'],
                            $result['fileSize'],
                            $result['mimeType']
                        );
                    }
                } catch (Exception $e) {
                    error_log("Document upload error for {$key}: " . $e->getMessage());
                    // Continue processing other files
                }
            }
        }
    }

    private function handleFileUpload($file, $studentId, $documentType)
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("File upload error code: " . $file['error']);
        }

        if ($file['size'] > $this->maxFileSize) {
            throw new Exception("File size exceeds 5MB limit");
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $this->allowedFileTypes)) {
            throw new Exception("Invalid file type. Only PDF, JPG, JPEG, and PNG allowed");
        }

        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = $studentId . '_' . $documentType . '_' . time() . '.' . $fileExtension;
        $filePath = $this->uploadDir . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            throw new Exception("Failed to save uploaded file");
        }

        return [
            'fileName' => $fileName,
            'filePath' => $filePath,
            'fileSize' => $file['size'],
            'mimeType' => $mimeType
        ];
    }

    public function checkStatus($trackingNumber)
    {
        return $this->admissionModel->findByTrackingNumber($trackingNumber);
    }

    public function getGradeLevels()
    {
        return $this->admissionModel->getGradeLevels();
    }
}
