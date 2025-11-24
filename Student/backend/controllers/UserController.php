<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../config/db.php';

class UserController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        
        if (!$this->db) {
            $this->sendResponse(500, false, 'Database connection failed.');
            exit();
        }
        
        $this->user = new User($this->db);
    }

    public function getCurrentUser() {
        // Check if user is authenticated
        if (!isset($_SESSION['user_id'])) {
            $this->sendResponse(401, false, 'Not authenticated. Please log in.');
            return;
        }

        // Get user data from model
        $userData = $this->user->getStudentByUserId($_SESSION['user_id']);

        if (!$userData) {
            $this->sendResponse(404, false, 'User data not found.');
            return;
        }

        // Format response
        $this->sendResponse(200, true, 'User data retrieved successfully.', [
            'user' => $this->formatUserData($userData)
        ]);
    }

    private function formatUserData($userData) {
        return [
            'userId' => $userData['UserID'],
            'emailAddress' => $userData['EmailAddress'],
            'userType' => $userData['UserType'],
            'accountStatus' => $userData['AccountStatus'],
            'lastLoginDate' => $userData['LastLoginDate'],
            'profileId' => $userData['ProfileID'],
            'firstName' => $userData['FirstName'],
            'lastName' => $userData['LastName'],
            'middleName' => $userData['MiddleName'],
            'fullName' => $userData['FullName'],
            'phoneNumber' => $userData['PhoneNumber'],
            'address' => $userData['Address'],
            'profilePictureURL' => $userData['ProfilePictureURL'],
            'studentProfileId' => $userData['StudentProfileID'],
            'studentNumber' => $userData['StudentNumber'],
            'qrCodeId' => $userData['QRCodeID'],
            'dateOfBirth' => $userData['DateOfBirth'],
            'gender' => $userData['Gender'],
            'nationality' => $userData['Nationality'],
            'studentStatus' => $userData['StudentStatus'],
            'age' => $userData['Age'],
            'schoolYear' => $userData['SchoolYear'],
            'schoolYearId' => $userData['SchoolYearID'],
            'gradeLevel' => $userData['GradeLevel'],
            'sectionName' => $userData['SectionName'],
            'sectionId' => $userData['SectionID'],
            'gradeAndSection' => $userData['GradeAndSection'],
            'adviserName' => $userData['AdviserName'],
            'weight' => $userData['Weight'],
            'height' => $userData['Height'],
            'allergies' => $userData['Allergies'],
            'medicalConditions' => $userData['MedicalConditions'],
            'medications' => $userData['Medications'],
            'emergencyContactPerson' => $userData['EmergencyContactPerson'],
            'emergencyContactNumber' => $userData['EmergencyContactNumber'],
            'primaryGuardianName' => $userData['PrimaryGuardianName'],
            'primaryGuardianRelationship' => $userData['PrimaryGuardianRelationship'],
            'primaryGuardianContactNumber' => $userData['PrimaryGuardianContactNumber'],
            'primaryGuardianEmail' => $userData['PrimaryGuardianEmail']
        ];
    }

    private function sendResponse($statusCode, $success, $message, $data = []) {
        http_response_code($statusCode);
        $response = [
            'success' => $success,
            'message' => $message
        ];
        
        if (!empty($data)) {
            $response = array_merge($response, $data);
        }
        
        echo json_encode($response);
    }
}

?>