<?php
/**
 * API Endpoint: Enroll Student with Automatic Section Assignment
 * Method: POST
 * 
 * Automatically assigns student to a section based on:
 * 1. Grade Level
 * 2. Section capacity (max 15 students per section)
 * 3. Assigns to first available section with space
 * 
 * Expected JSON Body:
 * {
 *   "studentProfileId": 123,
 *   "gradeLevelId": 1,
 *   "schoolYearId": 1
 * }
 */

session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

// Get request data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['studentProfileId']) || !isset($data['gradeLevelId']) || !isset($data['schoolYearId'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Missing required fields: studentProfileId, gradeLevelId, schoolYearId'
    ]);
    exit();
}

$studentProfileId = $data['studentProfileId'];
$gradeLevelId = $data['gradeLevelId'];
$schoolYearId = $data['schoolYearId'];

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

try {
    $db->beginTransaction();
    
    // Step 0: Verify student exists first
    $verifyStudentQuery = "
        SELECT sp.StudentProfileID, p.FirstName, p.LastName, sp.StudentNumber
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        WHERE sp.StudentProfileID = :studentProfileId
    ";
    
    $verifyStmt = $db->prepare($verifyStudentQuery);
    $verifyStmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
    $verifyStmt->execute();
    $studentExists = $verifyStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$studentExists) {
        throw new Exception("Student with StudentProfileID {$studentProfileId} not found in the database.");
    }
    
    // Step 1: Find the first available section for the grade level that has space
    // Use actual enrollment count from enrollment table
    $sectionQuery = "
        SELECT 
            s.SectionID,
            s.SectionName,
            s.MaxCapacity,
            s.CurrentEnrollment,
            COALESCE(
                (SELECT COUNT(*) 
                 FROM enrollment e 
                 WHERE e.SectionID = s.SectionID 
                 AND e.SchoolYearID = :schoolYearId), 
                0
            ) as ActualEnrollmentCount
        FROM section s
        WHERE s.GradeLevelID = :gradeLevelId
        AND s.SchoolYearID = :schoolYearId
        AND (s.MaxCapacity IS NULL OR 
             COALESCE(
                 (SELECT COUNT(*) 
                  FROM enrollment e 
                  WHERE e.SectionID = s.SectionID 
                  AND e.SchoolYearID = :schoolYearId2), 
                 0
             ) < s.MaxCapacity)
        ORDER BY s.SectionName ASC
        LIMIT 1
    ";
    
    $stmt = $db->prepare($sectionQuery);
    $stmt->bindParam(':gradeLevelId', $gradeLevelId, PDO::PARAM_INT);
    $stmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $stmt->bindParam(':schoolYearId2', $schoolYearId, PDO::PARAM_INT);
    $stmt->execute();
    
    $availableSection = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$availableSection) {
        // Check if sections exist for this grade level
        $checkSectionExistsQuery = "
            SELECT COUNT(*) as sectionCount
            FROM section
            WHERE GradeLevelID = :gradeLevelId
            AND SchoolYearID = :schoolYearId
        ";
        $checkStmt = $db->prepare($checkSectionExistsQuery);
        $checkStmt->bindParam(':gradeLevelId', $gradeLevelId, PDO::PARAM_INT);
        $checkStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
        $checkStmt->execute();
        $sectionCount = $checkStmt->fetch(PDO::FETCH_ASSOC)['sectionCount'];
        
        if ($sectionCount == 0) {
            throw new Exception('No sections exist for this grade level in the selected school year. Please create sections first.');
        } else {
            // Get details about why sections are full for better error message
            $fullSectionsQuery = "
                SELECT 
                    s.SectionName,
                    s.MaxCapacity,
                    COALESCE(
                        (SELECT COUNT(*) 
                         FROM enrollment e 
                         WHERE e.SectionID = s.SectionID 
                         AND e.SchoolYearID = :schoolYearId), 
                        0
                    ) as ActualCount
                FROM section s
                WHERE s.GradeLevelID = :gradeLevelId
                AND s.SchoolYearID = :schoolYearId
            ";
            $fullStmt = $db->prepare($fullSectionsQuery);
            $fullStmt->bindParam(':gradeLevelId', $gradeLevelId, PDO::PARAM_INT);
            $fullStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
            $fullStmt->execute();
            $fullSections = $fullStmt->fetchAll(PDO::FETCH_ASSOC);
            
            $sectionDetails = array_map(function($sec) {
                return "{$sec['SectionName']} ({$sec['ActualCount']}/{$sec['MaxCapacity']})";
            }, $fullSections);
            
            throw new Exception('No available sections found for this grade level. All sections are full. Sections: ' . implode(', ', $sectionDetails));
        }
    }
    
    $sectionId = $availableSection['SectionID'];
    $sectionName = $availableSection['SectionName'];
    $maxCapacity = $availableSection['MaxCapacity'];
    $actualEnrollmentCount = $availableSection['ActualEnrollmentCount'];
    
    // Step 2: Check if student is already enrolled in this school year
    $checkEnrollmentQuery = "
        SELECT e.EnrollmentID, sec.SectionName, gl.LevelName
        FROM enrollment e
        JOIN section sec ON e.SectionID = sec.SectionID
        JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
        WHERE e.StudentProfileID = :studentProfileId
        AND sec.SchoolYearID = :schoolYearId
    ";
    
    $checkStmt = $db->prepare($checkEnrollmentQuery);
    $checkStmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
    $checkStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        $existingEnrollment = $checkStmt->fetch(PDO::FETCH_ASSOC);
        throw new Exception("Student {$studentExists['FirstName']} {$studentExists['LastName']} is already enrolled in Grade {$existingEnrollment['LevelName']} - {$existingEnrollment['SectionName']} for this school year.");
    }
    
    // Step 3: Get student information for response
    $studentQuery = "
        SELECT 
            p.FirstName,
            p.LastName,
            sp.StudentNumber
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        WHERE sp.StudentProfileID = :studentProfileId
    ";
    
    $studentStmt = $db->prepare($studentQuery);
    $studentStmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
    $studentStmt->execute();
    $student = $studentStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$student) {
        throw new Exception('Student profile not found.');
    }
    
    // Step 4: Insert enrollment record
    // EnrollmentDate is a DATE field, so use CURDATE() instead of NOW()
    $enrollmentQuery = "
        INSERT INTO enrollment (
            StudentProfileID,
            SectionID,
            SchoolYearID,
            EnrollmentDate
        ) VALUES (
            :studentProfileId,
            :sectionId,
            :schoolYearId,
            CURDATE()
        )
    ";
    
    $enrollStmt = $db->prepare($enrollmentQuery);
    $enrollStmt->bindParam(':studentProfileId', $studentProfileId, PDO::PARAM_INT);
    $enrollStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $enrollStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    
    if (!$enrollStmt->execute()) {
        throw new Exception('Failed to create enrollment record.');
    }
    
    $enrollmentId = $db->lastInsertId();
    
    // Step 5: Update section's current enrollment count
    // Update CurrentEnrollment field to keep it in sync
    $updateSectionQuery = "
        UPDATE section 
        SET CurrentEnrollment = (
            SELECT COUNT(*) 
            FROM enrollment 
            WHERE SectionID = :sectionId 
            AND SchoolYearID = :schoolYearId
        )
        WHERE SectionID = :sectionId
    ";
    
    $updateStmt = $db->prepare($updateSectionQuery);
    $updateStmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    $updateStmt->bindParam(':schoolYearId', $schoolYearId, PDO::PARAM_INT);
    $updateStmt->execute();
    
    // Step 6: Get grade level name for response
    $gradeLevelQuery = "SELECT LevelName FROM gradelevel WHERE GradeLevelID = :gradeLevelId";
    $gradeLevelStmt = $db->prepare($gradeLevelQuery);
    $gradeLevelStmt->bindParam(':gradeLevelId', $gradeLevelId, PDO::PARAM_INT);
    $gradeLevelStmt->execute();
    $gradeLevel = $gradeLevelStmt->fetch(PDO::FETCH_ASSOC);
    
    $db->commit();
    
    // Get updated enrollment count for response
    $finalEnrollmentCount = $actualEnrollmentCount + 1;
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Student successfully enrolled and assigned to section.',
        'data' => [
            'enrollmentId' => $enrollmentId,
            'studentName' => $student['FirstName'] . ' ' . $student['LastName'],
            'studentNumber' => $student['StudentNumber'],
            'gradeLevel' => $gradeLevel['LevelName'],
            'sectionName' => $sectionName,
            'sectionId' => $sectionId,
            'currentStudentCount' => $finalEnrollmentCount,
            'maxCapacity' => $maxCapacity,
            'enrollmentDate' => date('Y-m-d')
        ]
    ]);
    
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollback();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
