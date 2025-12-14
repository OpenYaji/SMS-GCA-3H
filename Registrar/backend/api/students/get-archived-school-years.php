<?php
// Set headers for JSON response and CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Ensure the path to your Database configuration is correct
require_once __DIR__ . '/../../config/db.php'; 

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Query to get all INACTIVE (IsActive = 0) school years, 
    // AND Exclude school years older than 2024-2025
    $query = "
        SELECT 
            SchoolYearID, 
            YearName, 
            IsActive 
        FROM schoolyear 
        WHERE IsActive = 0 
        AND YearName >= '2024-2025' -- Ito ang naglilista ng School Years sa dropdown
        ORDER BY StartDate DESC
    ";

    $schoolYearsQuery = $conn->prepare($query);
    $schoolYearsQuery->execute();
    $schoolYears = $schoolYearsQuery->fetchAll(PDO::FETCH_ASSOC);

    // FIX: Format the output and assign it to the variable used below
    $formattedSchoolYears = array_map(function($sy) {
        return [
            'SchoolYearID' => (int)$sy['SchoolYearID'],
            'YearName' => $sy['YearName'],
            'IsActive' => (int)$sy['IsActive'],
        ];
    }, $schoolYears);
    

    echo json_encode([
        'success' => true,
        'data' => $formattedSchoolYears,
        'count' => count($formattedSchoolYears)
    ]);

} catch (Exception $e) {
    // FIX: Properly handle exceptions and return a JSON error
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>