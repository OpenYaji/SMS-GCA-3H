<?php
// C:\xampp\htdocs\SMS-GCA-3H\Registrar\backend\api\records\get_completed_requests.php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

try {
    $database = new Database();
    $conn = $database->getConnection();

    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    // FIXED: Now joins with application table to get REAL grade level
    $query = "
        SELECT 
            dr.RequestID as id,
            CONCAT(p.FirstName, ' ', IFNULL(p.MiddleName, ''), ' ', p.LastName) as studentName,
            sp.StudentNumber as studentId,
            app.ApplyingForGradeLevelID as gradeLevel,
            dr.DocumentType as documentType,
            dr.Purpose as requestPurpose,
            dr.DateRequested as requestDate,
            dr.DateCompleted as completedDate,
            DATE_FORMAT(dr.DateRequested, '%b %d, %Y') as requestDateFormatted,
            DATE_FORMAT(dr.DateCompleted, '%b %d, %Y') as completedDateFormatted,
            DATE_FORMAT(DATE_ADD(dr.DateCompleted, INTERVAL 2 DAY), '%b %d, %Y') as pickupDate,
            '2:00 PM' as pickupTime,
            u.EmailAddress as email,
            'Released' as status
        FROM document_request dr
        JOIN studentprofile sp ON dr.StudentProfileID = sp.StudentProfileID
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN user u ON p.UserID = u.UserID
        LEFT JOIN application app ON (
            app.StudentFirstName = p.FirstName 
            AND app.StudentLastName = p.LastName
            AND app.ApplicationStatus = 'Enrolled'
        )
        WHERE dr.RequestStatus = 'Completed'
        ORDER BY dr.DateCompleted DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Clean up the data
    foreach ($requests as &$request) {
        // Use formatted dates for display
        $request['requestDate'] = $request['requestDateFormatted'];
        $request['completedDate'] = $request['completedDateFormatted'];

        // Remove the formatted versions (keep originals for filtering)
        unset($request['requestDateFormatted']);
        unset($request['completedDateFormatted']);

        // Default grade level if not found
        if (empty($request['gradeLevel'])) {
            $request['gradeLevel'] = 'N/A';
        }
    }

    echo json_encode($requests);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
    error_log("get_completed_requests.php error: " . $e->getMessage());
}
