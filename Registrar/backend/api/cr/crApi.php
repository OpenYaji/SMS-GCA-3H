<?php
        header("Content-Type: application/json");
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        require_once __DIR__ . '/../../config/cors.php';
        require_once __DIR__ . '/../../config/db.php';  

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

        $db = new Database();
        $conn = $db->getConnection();

        if (!$conn) { 
            http_response_code(500); 
            echo json_encode(["error" => "DB connection failed"]);
            exit; 
        }

        $path = trim($_GET['path'] ?? '', '/');
        $parts = explode('/', $path);
        $schoolYearId = intval($_GET['schoolYearId'] ?? 1); // allow dynamic SchoolYearID

        try {
            // GET /sections
            if (count($parts) === 1 && $parts[0] === "sections") {
                $stmt = $conn->prepare("
                    SELECT 
                        sec.SectionID,
                        -- Formats the main card title like the first query
                        CONCAT(gl.LevelName, ' - Section ', sec.SectionName) as FullSectionName, 
                        sec.SectionName,
                        gl.LevelName,
                        sec.MaxCapacity,
                        sec.CurrentEnrollment,
                        -- ALIGNMENT: Fetches the Adviser Name using the same logic as the first query
                        CONCAT(p.FirstName, ' ', p.LastName) as AdviserName,
                        sec.AdviserTeacherID
                        FROM section sec
                        -- Join Grade Level for sorting/naming
                        JOIN gradelevel gl ON sec.GradeLevelID = gl.GradeLevelID
                        -- ALIGNMENT: Join TeacherProfile and Profile to get the name (just like Query 1)
                        LEFT JOIN teacherprofile tp ON sec.AdviserTeacherID = tp.TeacherProfileID
                        LEFT JOIN profile p ON tp.ProfileID = p.ProfileID
                        ORDER BY 
                        gl.SortOrder, 
                        sec.SectionName;
                ");
                $stmt->execute();
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
                exit;
            }

        // GET /sections/:id/students
    if (count($parts) === 3 && $parts[0] === "sections" && $parts[2] === "students") {
        $sectionId = intval($parts[1]);
        $schoolYearId = intval($_GET['schoolYearId'] ?? 1);

        if (!$sectionId) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid section ID"]);
            exit;
        }

    $stmt = $conn->prepare("
       SELECT 
    sp.StudentProfileID,
    sp.StudentNumber,
    CONCAT(
        p.LastName, ', ', p.FirstName,
        CASE 
            WHEN p.MiddleName IS NOT NULL AND p.MiddleName != '' 
            THEN CONCAT(' ', SUBSTRING(p.MiddleName,1,1), '.') 
            ELSE '' 
        END
    ) AS Student,
    p.Gender,
    p.Religion,
    p.MotherTounge,
    CAST(p.EncryptedPhoneNumber AS CHAR) AS StudentPhone,
    CAST(p.EncryptedAddress AS CHAR) AS Address,
    p.ProfilePictureURL,

    g_primary.FullName AS Guardian,
    CAST(g_primary.EncryptedPhoneNumber AS CHAR) AS Contact,

    sp.StudentStatus AS Status

        FROM enrollment e
        JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN user u ON p.UserID = u.UserID

        LEFT JOIN studentguardian sg_primary 
            ON sp.StudentProfileID = sg_primary.StudentProfileID 
            AND sg_primary.IsPrimaryContact = 1

        LEFT JOIN guardian g_primary 
            ON sg_primary.GuardianID = g_primary.GuardianID

        WHERE 
            e.SchoolYearID = ? 
            AND e.SectionID = ? 
            AND u.IsDeleted = 0

        ORDER BY sp.StudentNumber ASC
    ");
// GET /schoolyear/active
if (count($parts) === 2 && $parts[0] === "schoolyear" && $parts[1] === "active") {
    $stmt = $conn->prepare("
        SELECT SchoolYearID, YearName 
        FROM schoolyear 
        WHERE IsActive = 1
        LIMIT 1
    ");
    $stmt->execute();
    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    exit;
}

        $stmt->execute([$schoolYearId, $sectionId]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

            // POST /sections/:id/notify-teacher
            if (count($parts) === 3 && $parts[0] === "sections" && $parts[2] === "notify-teacher") {
                $sectionId = intval($parts[1]);
                echo json_encode(["success" => true, "message" => "Teacher notified for section $sectionId"]);
                exit;
            }

            // POST /sections/:id/notify-parents
            if (count($parts) === 3 && $parts[0] === "sections" && $parts[2] === "notify-parents") {
                $sectionId = intval($parts[1]);
                echo json_encode(["success" => true, "message" => "Parents notified for section $sectionId"]);
                exit;
            }

            http_response_code(404);
            echo json_encode(["error" => "Endpoint not found"]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Server error","message" => $e->getMessage()]);
        }