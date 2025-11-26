<?php
session_start();
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header("Content-Type: application/json; charset=UTF-8");

// Check authentication
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please log in.'
    ]);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit();
}

try {
    // Get database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Get section ID from query parameters
    if (!isset($_GET['sectionId'])) {
        throw new Exception('Section ID is required');
    }
    
    $sectionId = (int)$_GET['sectionId'];
    
    // Get all parents/guardians of students in this section
    $query = "
        SELECT DISTINCT 
            g.GuardianID as id,
            g.FullName as name,
            CAST(AES_DECRYPT(g.EncryptedEmailAddress, 'encryption_key') AS CHAR) as email,
            CAST(AES_DECRYPT(g.EncryptedPhoneNumber, 'encryption_key') AS CHAR) as phone,
            sp_prof.FirstName as studentFirstName,
            sp_prof.LastName as studentLastName,
            sg.RelationshipType as relationship
        FROM enrollment e
        JOIN studentprofile sp ON e.StudentProfileID = sp.StudentProfileID
        JOIN profile sp_prof ON sp.ProfileID = sp_prof.ProfileID
        JOIN studentguardian sg ON sp.StudentProfileID = sg.StudentProfileID
        JOIN guardian g ON sg.GuardianID = g.GuardianID
        WHERE e.SectionID = :sectionId
        AND g.EncryptedEmailAddress IS NOT NULL
        ORDER BY g.FullName ASC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':sectionId', $sectionId, PDO::PARAM_INT);
    
    if (!$stmt->execute()) {
        throw new Exception('Database query failed: ' . implode(', ', $stmt->errorInfo()));
    }
    
    $parents = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $parents[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'studentName' => $row['studentFirstName'] . ' ' . $row['studentLastName'],
            'relationship' => $row['relationship']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $parents,
        'count' => count($parents)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'sql_error' => $e->errorInfo ?? null
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'line' => $e->getLine(),
        'file' => basename($e->getFile())
    ]);
}
?>
