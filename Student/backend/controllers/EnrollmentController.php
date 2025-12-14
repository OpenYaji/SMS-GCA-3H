<?php

require_once __DIR__ . '/../models/Enrollment.php';
require_once __DIR__ . '/../config/db.php';

class EnrollmentController
{
    private $db;
    private $enrollment;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();

        if (!$this->db) {
            $this->sendResponse(500, false, 'Database connection failed.');
            exit();
        }

        $this->enrollment = new Enrollment($this->db);
    }

    public function getEnrollmentStatus()
    {
        if (!isset($_SESSION['user_id'])) {
            $this->sendResponse(401, false, 'Not authenticated.');
            return;
        }

        $userId = $_SESSION['user_id'];

        try {
            $studentProfileId = $this->enrollment->getStudentProfileIdByUserId($userId);

            if (!$studentProfileId) {
                $this->sendResponse(404, false, 'Student profile not found.');
                return;
            }

            $enrollmentData = $this->enrollment->getEnrollmentStatus($studentProfileId);

            $this->sendResponse(200, true, 'Enrollment status retrieved successfully.', [
                'data' => $enrollmentData
            ]);
        } catch (Exception $e) {
            error_log("Error in getEnrollmentStatus: " . $e->getMessage());
            $this->sendResponse(500, false, 'Failed to fetch enrollment status.');
        }
    }

    private function sendResponse($statusCode, $success, $message, $data = [])
    {
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
