<?php

require_once __DIR__ . '/../models/Grade.php';
require_once __DIR__ . '/../config/db.php';

class GradeController {
    private $db;
    private $grade;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        
        if (!$this->db) {
            $this->sendResponse(500, false, 'Database connection failed.');
            exit();
        }
        
        $this->grade = new Grade($this->db);
    }

    public function getCurrentGrades() {
        if (!isset($_SESSION['user_id'])) {
            $this->sendResponse(401, false, 'Not authenticated.');
            return;
        }

        $userId = $_SESSION['user_id'];

        $subjects = $this->grade->getStudentGradesByUserId($userId);

        // FIX 1: If no subjects found, don't crash. Just set as empty array.
        if ($subjects === false) {
            $subjects = [];
        }

        $processedSubjects = $this->processSubjects($subjects);
        $summary = $this->calculateSummary($processedSubjects, $userId);

        $this->sendResponse(200, true, 'Grades retrieved successfully.', [
            'data' => [
                'summary' => $summary,
                'subjects' => $processedSubjects
            ]
        ]);
    }

    public function getAcademicSummary() {
        if (!isset($_SESSION['user_id'])) {
            $this->sendResponse(401, false, 'Not authenticated.');
            return;
        }

        $userId = $_SESSION['user_id'];

        // 1. GET GWA
        $gwaData = $this->grade->getLatestQuarterGWA($userId);

        // FIX 2: CRITICAL FIX HERE
        // If $gwaData is false, it means the student has no grades yet.
        // We set default values (0) instead of throwing a 500 error.
        if ($gwaData === false) {
            $generalAverage = 0;
            $currentQuarter = 'N/A';
        } else {
            $generalAverage = isset($gwaData['generalAverage']) ? floatval($gwaData['generalAverage']) : 0;
            $currentQuarter = isset($gwaData['quarter']) ? $gwaData['quarter'] : 'N/A';
        }
        
        $remark = $this->calculateGradeRemark($generalAverage);

        // 2. GET ATTENDANCE
        $attendanceData = $this->grade->getAttendanceSummary($userId);
        
        // Safe handling for attendance
        $totalDaysPresent = ($attendanceData && isset($attendanceData['TotalDaysPresent'])) ? intval($attendanceData['TotalDaysPresent']) : 0;
        $totalSchoolDays = ($attendanceData && isset($attendanceData['TotalSchoolDays'])) ? intval($attendanceData['TotalSchoolDays']) : 0;
        $attendancePercentage = ($attendanceData && isset($attendanceData['AttendancePercentage'])) ? floatval($attendanceData['AttendancePercentage']) : 0;
        
        $attendanceRemark = $this->calculateAttendanceRemark($attendancePercentage);

        // 3. GET PARTICIPATION
        $participationData = $this->grade->getParticipationRating($userId);
        $participation = [
            "rating" => ($participationData && isset($participationData['Rating'])) ? intval($participationData['Rating']) : 0,
            "remark" => ($participationData && isset($participationData['Remark'])) ? $participationData['Remark'] : 'Not Rated'
        ];

        $summaryData = [
            'generalAverage' => $generalAverage,
            'remark' => $remark,
            'quarter' => $currentQuarter,
            'attendance' => $attendancePercentage,
            'totalDaysPresent' => $totalDaysPresent,
            'totalDays' => $totalSchoolDays,
            'attendanceRemark' => $attendanceRemark,
            'participation' => $participation
        ];

        $this->sendResponse(200, true, 'Academic summary retrieved successfully.', [
            'data' => $summaryData
        ]);
    }

    public function getPreviousGrades() {
        if (!isset($_SESSION['user_id'])) {
            $this->sendResponse(401, false, 'Not authenticated.');
            return;
        }

        $userId = $_SESSION['user_id'];

        $results = $this->grade->getPreviousGradesByUserId($userId);

        // FIX 3: Handle empty previous grades safely
        if ($results === false) {
            $results = [];
        }

        $finalData = $this->processPreviousGrades($results, $userId);

        $this->sendResponse(200, true, 'Previous grades retrieved successfully.', [
            'data' => $finalData
        ]);
    }

    // ... HELPER FUNCTIONS (Keep these exactly as they were) ...

    private function processPreviousGrades($results, $userId) {
        $groupedGrades = [];

        foreach ($results as $row) {
            $year = $row['schoolYear'];
            
            if (!isset($groupedGrades[$year])) {
                $groupedGrades[$year] = [
                    'schoolYear' => $year,
                    'schoolYearId' => $row['schoolYearId'], 
                    'gradeLevel' => $row['gradeLevel'],
                    'subjects_map' => [],
                ];
            }

            $subjectId = $row['subjectId'];
            if (!isset($groupedGrades[$year]['subjects_map'][$subjectId])) {
                $groupedGrades[$year]['subjects_map'][$subjectId] = [
                    'id' => $subjectId,
                    'name' => $row['subjectName'],
                    'q1' => null, 'q2' => null, 'q3' => null, 'q4' => null
                ];
            }

            switch ($row['Quarter']) {
                case 'First Quarter': $groupedGrades[$year]['subjects_map'][$subjectId]['q1'] = $row['GradeValue']; break;
                case 'Second Quarter': $groupedGrades[$year]['subjects_map'][$subjectId]['q2'] = $row['GradeValue']; break;
                case 'Third Quarter': $groupedGrades[$year]['subjects_map'][$subjectId]['q3'] = $row['GradeValue']; break;
                case 'Fourth Quarter': $groupedGrades[$year]['subjects_map'][$subjectId]['q4'] = $row['GradeValue']; break;
            }
        }

        $finalData = [];
        foreach ($groupedGrades as $year => $data) {
            $totalFinalGrade = 0;
            $subjectCount = 0;
            
            foreach ($data['subjects_map'] as $subjectId => $subjectData) {
                $grades = array_filter([$subjectData['q1'], $subjectData['q2'], $subjectData['q3'], $subjectData['q4']], 'is_numeric');
                
                $finalGrade = (count($grades) > 0) ? round(array_sum($grades) / count($grades), 2) : 0;
                
                $data['subjects_map'][$subjectId]['final'] = $finalGrade;
                $data['subjects_map'][$subjectId]['remarks'] = ($finalGrade >= 75) ? 'Passed' : 'Failed';

                if ($finalGrade > 0) {
                    $totalFinalGrade += $finalGrade;
                    $subjectCount++;
                }
            }
            
            $data['subjects'] = array_values($data['subjects_map']);
            unset($data['subjects_map']);

            $finalAverage = ($subjectCount > 0) ? round($totalFinalGrade / $subjectCount, 2) : 0;

            $attendanceData = $this->grade->getAttendanceSummaryBySchoolYear($userId, $data['schoolYearId']);
            $attendanceRate = ($attendanceData && isset($attendanceData['AttendancePercentage'])) ? floatval($attendanceData['AttendancePercentage']) : 0;

            $data['summary'] = [
                'finalAverage' => $finalAverage,
                'attendanceRate' => $attendanceRate,
                'academicStanding' => $finalAverage >= 75 ? 'Promoted' : 'Retained'
            ];

            $finalData[] = $data;
        }

        return $finalData;
    }

    private function calculateGradeRemark($average) {
        if ($average >= 90) return "Excellent";
        if ($average >= 85) return "Very Satisfactory";
        if ($average >= 80) return "Satisfactory";
        if ($average >= 75) return "Fair";
        return "Needs Improvement";
    }

    private function calculateAttendanceRemark($percentage) {
        if ($percentage >= 100) return "Perfect Attendance";
        if ($percentage >= 95) return "Excellent Attendance";
        if ($percentage >= 90) return "Very Good Attendance";
        if ($percentage >= 85) return "Good Attendance";
        if ($percentage >= 75) return "Fair Attendance";
        return "Poor Attendance";
    }

    private function processSubjects($subjects) {
        if (empty($subjects)) return [];

        foreach ($subjects as &$subject) {
            $grades = array_filter([$subject['q1'], $subject['q2'], $subject['q3'], $subject['q4']], 'is_numeric');

            if (count($grades) === 4) {
                $subject['final'] = round(array_sum($grades) / 4, 2);
                $subject['remarks'] = $subject['final'] >= 75 ? 'Passed' : 'Failed';
            } else {
                $subject['final'] = null;
                $subject['remarks'] = 'In Progress';
            }
        }
        unset($subject);
        return $subjects;
    }

    private function calculateSummary($subjects, $userId) {
        $totalGrade = 0;
        $subjectCount = 0;

        foreach ($subjects as $subject) {
            $grades = array_filter([$subject['q1'], $subject['q2'], $subject['q3'], $subject['q4']], 'is_numeric');
            if (count($grades) > 0) {
                $runningAverage = array_sum($grades) / count($grades);
                $totalGrade += $runningAverage;
                $subjectCount++;
            }
        }

        $generalAverage = $subjectCount > 0 ? round($totalGrade / $subjectCount, 2) : 0;
        
        $attendanceData = $this->grade->getAttendanceSummary($userId);
        $attendanceRate = ($attendanceData && isset($attendanceData['AttendancePercentage'])) ? floatval($attendanceData['AttendancePercentage']) : 0;

        return [
            'generalAverage' => $generalAverage,
            'attendanceRate' => $attendanceRate, 
            'academicStanding' => $this->determineAcademicStanding($generalAverage)
        ];
    }

    private function determineAcademicStanding($average) {
        if ($average >= 95) return 'Outstanding';
        if ($average >= 90) return 'Excellent';
        if ($average >= 85) return 'Very Good';
        if ($average >= 80) return 'Good';
        if ($average >= 75) return 'Fair';
        return 'Needs Improvement';
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