<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/cors.php';

header('Content-Type: application/json');
// get_requests.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'db_connect.php';

try {
    // We need to join document_request -> studentprofile -> profile -> user to get the email
    $query = "
        SELECT 
            dr.RequestID as id,
            CONCAT(p.FirstName, ' ', p.LastName) as studentName,
            u.EmailAddress as email,
            dr.DocumentType as documentType,
            dr.Purpose as purpose,
            dr.Quantity as quantity,
            dr.DeliveryMethod as deliveryMethod,
            dr.RequestStatus as status,
            DATE_FORMAT(dr.DateRequested, '%b %d, %Y') as date
        FROM document_request dr
        JOIN studentprofile sp ON dr.StudentProfileID = sp.StudentProfileID
        JOIN profile p ON sp.ProfileID = p.ProfileID
        JOIN user u ON p.UserID = u.UserID
        ORDER BY dr.DateRequested DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format delivery method to look nice (e.g., 'pickup' -> 'Pickup')
    foreach ($requests as &$req) {
        $req['deliveryMethod'] = ucfirst($req['deliveryMethod']);
    }

    echo json_encode($requests);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>