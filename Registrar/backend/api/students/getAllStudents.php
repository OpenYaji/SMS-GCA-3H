<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../config/db.php';

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Get active school year
    $schoolYearQuery = $conn->prepare("
        SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1
    ");
    $schoolYearQuery->execute();
    $activeSchoolYear = $schoolYearQuery->fetch(PDO::FETCH_ASSOC);

    if (!$activeSchoolYear) {
        throw new Exception("No active school year found");
    }

    $schoolYearID = $activeSchoolYear['SchoolYearID'];

    // Optional filters from query parameters
    $gradeLevel = isset($_GET['gradeLevel']) ? $_GET['gradeLevel'] : null;
    $section = isset($_GET['section']) ? $_GET['section'] : null;
    $status = isset($_GET['status']) ? $_GET['status'] : null;
    $searchTerm = isset($_GET['search']) ? $_GET['search'] : null;

    // Build query with filters
    $query = "
        SELECT 
            sp.StudentProfileID,
            sp.StudentNumber,
            sp.StudentStatus,
            sp.DateOfBirth,
            sp.Gender,
            p.FirstName,
            p.LastName,
            p.MiddleName,
            CONCAT(p.LastName, ', ', p.FirstName, 
                CASE WHEN p.MiddleName IS NOT NULL 
                THEN CONCAT(' ', SUBSTRING(p.MiddleName, 1, 1), '.') 
                ELSE '' END
            ) as FullName,
            u.EmailAddress,
            u.AccountStatus,
            CAST(p.EncryptedPhoneNumber AS CHAR) as PhoneNumber,
            CAST(p.EncryptedAddress AS CHAR) as Address,
            
            -- Section info
            s.SectionName,
            s.SectionID,
            gl.LevelName as GradeLevel,
            gl.GradeLevelID,
            
            -- Teacher info
            COALESCE(CONCAT(tp_profile.FirstName, ' ', tp_profile.LastName), 'No Adviser') as AdviserName,
            
            -- Guardian info (primary contact)
            g_primary.FullName as PrimaryGuardianName,
            CAST(g_primary.EncryptedPhoneNumber AS CHAR) as GuardianPhone,
            CAST(g_primary.EncryptedEmailAddress AS CHAR) as GuardianEmail,
            sg_primary.RelationshipType as GuardianRelationship,
            
            -- Emergency contact
            ec.ContactPerson as EmergencyContactName,
            CAST(ec.EncryptedContactNumber AS CHAR) as EmergencyContactNumber,
            
            -- Enrollment info
            e.EnrollmentID,
            e.EnrollmentDate,
            sy.YearName as SchoolYear
            
        FROM studentprofile sp
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN user u ON p.UserID = u.UserID
        
        -- Latest enrollment
        LEFT JOIN (
            SELECT e_inner.StudentProfileID, e_inner.EnrollmentID, e_inner.SectionID, 
                   e_inner.SchoolYearID, e_inner.EnrollmentDate
            FROM enrollment e_inner
            WHERE e_inner.SchoolYearID = ?
        ) e ON sp.StudentProfileID = e.StudentProfileID
        
        LEFT JOIN section s ON e.SectionID = s.SectionID
        LEFT JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
        LEFT JOIN schoolyear sy ON e.SchoolYearID = sy.SchoolYearID
        
        -- Teacher info
        LEFT JOIN teacherprofile tp ON s.AdviserTeacherID = tp.TeacherProfileID
        LEFT JOIN profile tp_profile ON tp.ProfileID = tp_profile.ProfileID
        
        -- Primary guardian
        LEFT JOIN studentguardian sg_primary ON sp.StudentProfileID = sg_primary.StudentProfileID 
            AND sg_primary.IsPrimaryContact = 1
        LEFT JOIN guardian g_primary ON sg_primary.GuardianID = g_primary.GuardianID
        
        -- Emergency contact
        LEFT JOIN emergencycontact ec ON sp.StudentProfileID = ec.StudentProfileID
        
        WHERE u.IsDeleted = 0
    ";

    $params = [$schoolYearID];

    // Add filters
    if ($gradeLevel && $gradeLevel !== 'All Grades') {
        $query .= " AND gl.LevelName = ?";
        $params[] = $gradeLevel;
    }

    if ($section && $section !== 'All Sections') {
        $query .= " AND s.SectionName = ?";
        $params[] = $section;
    }

    if ($status && $status !== 'All Status') {
        $query .= " AND sp.StudentStatus = ?";
        $params[] = $status;
    }

    if ($searchTerm) {
        $query .= " AND (
            p.FirstName LIKE ? OR 
            p.LastName LIKE ? OR 
            sp.StudentNumber LIKE ? OR
            CONCAT(p.FirstName, ' ', p.LastName) LIKE ?
        )";
        $searchParam = "%{$searchTerm}%";
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
    }

     $query .= " ORDER BY sp.StudentNumber ASC";

    $studentsQuery = $conn->prepare($query);
    $studentsQuery->execute($params);
    $students = $studentsQuery->fetchAll(PDO::FETCH_ASSOC);

    // Format students data
    $formattedStudents = array_map(function($student) {
        // Calculate age
        $age = null;
        if ($student['DateOfBirth']) {
            $dob = new DateTime($student['DateOfBirth']);
            $now = new DateTime();
            $age = $now->diff($dob)->y;
        }

        return [
            'id' => (int)$student['StudentProfileID'],
            'studentId' => $student['StudentNumber'],
            'studentNumber' => $student['StudentNumber'],
            'name' => $student['FullName'],
            'fullName' => $student['FullName'],
            'firstName' => $student['FirstName'],
            'lastName' => $student['LastName'],
            'middleName' => $student['MiddleName'],
            'email' => $student['EmailAddress'],
            'phoneNumber' => $student['PhoneNumber'] ?: 'N/A',
            'address' => $student['Address'] ?: 'N/A',
            'status' => $student['StudentStatus'],
            'accountStatus' => $student['AccountStatus'],
            
            // Personal info
            'dateOfBirth' => $student['DateOfBirth'],
            'age' => $age,
            'gender' => $student['Gender'],
            
            // Academic info
            'gradeLevel' => $student['GradeLevel'] ?: 'Not Assigned',
            'gradeLevelId' => $student['GradeLevelID'],
            'section' => $student['SectionName'] ?: 'Not Assigned',
            'sectionId' => $student['SectionID'],
            'sectionName' => $student['SectionName'] ?: 'Not Assigned',
            'adviserName' => $student['AdviserName'],
            'schoolYear' => $student['SchoolYear'] ?: 'N/A',
            
            // Guardian info
            'parentGuardian' => $student['PrimaryGuardianName'] ?: 'N/A',
            'guardianName' => $student['PrimaryGuardianName'] ?: 'N/A',
            'guardianPhone' => $student['GuardianPhone'] ?: 'N/A',
            'guardianEmail' => $student['GuardianEmail'] ?: 'N/A',
            'guardianRelationship' => $student['GuardianRelationship'] ?: 'N/A',
            'contactNumber' => $student['GuardianPhone'] ?: 'N/A',
            
            // Emergency contact
            'emergencyContactName' => $student['EmergencyContactName'] ?: 'N/A',
            'emergencyContactNumber' => $student['EmergencyContactNumber'] ?: 'N/A',
            
            // Enrollment info
            'enrollmentId' => $student['EnrollmentID'] ? (int)$student['EnrollmentID'] : null,
            'enrollmentDate' => $student['EnrollmentDate'],
        ];
    }, $students);

    echo json_encode([
        'success' => true,
        'data' => $formattedStudents,
        'count' => count($formattedStudents),
        'schoolYearID' => (int)$schoolYearID
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>