<?php

require_once __DIR__ . '/../models/Subject.php';
require_once __DIR__ . '/../config/db.php';

class SubjectController
{
    private $db;
    private $subject;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();

        if (!$this->db) {
            $this->sendResponse(500, false, 'Database connection failed.');
            exit();
        }

        $this->subject = new Subject($this->db);
    }

    public function getStudentSubjects()
    {
        if (!isset($_SESSION['user_id'])) {
            $this->sendResponse(401, false, 'Not authenticated.');
            return;
        }

        $userId = $_SESSION['user_id'];

        $subjects = $this->subject->getStudentSubjects($userId);

        if ($subjects === false) {
            $this->sendResponse(500, false, 'An error occurred while fetching subjects.');
            return;
        }

        // Add description based on subject name
        foreach ($subjects as &$subject) {
            $subject['description'] = $this->getSubjectDescription($subject['name']);
        }
        unset($subject);

        $this->sendResponse(200, true, 'Subjects retrieved successfully.', [
            'subjects' => $subjects
        ]);
    }

    public function getSubjectDetails($subjectId)
    {
        if (!isset($_SESSION['user_id'])) {
            $this->sendResponse(401, false, 'Not authenticated.');
            return;
        }

        $userId = $_SESSION['user_id'];

        $subject = $this->subject->getSubjectById($subjectId, $userId);

        if ($subject === false) {
            $this->sendResponse(500, false, 'An error occurred while fetching subject details.');
            return;
        }

        if (!$subject) {
            $this->sendResponse(404, false, 'Subject not found.');
            return;
        }

        $subject['description'] = $this->getSubjectDescription($subject['name']);

        $this->sendResponse(200, true, 'Subject details retrieved successfully.', [
            'subject' => $subject
        ]);
    }

    private function getSubjectDescription($subjectName)
    {
        $descriptions = [
            'ENGLISH' => 'Learn grammar, reading comprehension, and writing skills.',
            'MATH' => 'Basic arithmetic, algebra, and problem-solving techniques.',
            'FILIPINO' => 'Pag-aaral ng wika, panitikan, at kultura ng Pilipinas.',
            'SCIENCE' => 'Explore biology, chemistry, physics, and earth science.',
            'ARALING PANLIPUNAN' => 'Kasaysayan, heograpiya, at lipunang pag-aaral.',
            'MAPEH' => 'Music, Arts, Physical Education, and Health education.',
            'EDUKASYON SA PAGPAPAKATAO' => 'Values education and character development.',
            'COMPUTER' => 'Computer literacy and basic programming concepts.',
            'TECHNOLOGY AND LIVELIHOOD EDUCATION' => 'Practical skills for technology and livelihood.',
            'MOTHER TONGUE' => 'Study of local language and culture.'
        ];

        $upperName = strtoupper($subjectName);
        return $descriptions[$upperName] ?? 'Subject description not available.';
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
