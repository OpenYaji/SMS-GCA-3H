<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once __DIR__ . '/../../config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $userID = $_SESSION['user_id'];

    // Get StudentProfileID from the user's profile
    $profileQuery = "SELECT sp.StudentProfileID, sp.QRCodeID 
                     FROM studentprofile sp
                     INNER JOIN profile p ON sp.ProfileID = p.ProfileID
                     WHERE p.UserID = :userID";
    $profileStmt = $db->prepare($profileQuery);
    $profileStmt->bindParam(':userID', $userID);
    $profileStmt->execute();

    $student = $profileStmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        echo json_encode([
            'success' => false,
            'message' => 'Student profile not found'
        ]);
        exit();
    }

    // If QR code already exists, return it
    if (!empty($student['QRCodeID'])) {
        $_SESSION['qrCodeID'] = $student['QRCodeID'];
        
        echo json_encode([
            'success' => true,
            'message' => 'QR Code retrieved successfully',
            'qrCodeID' => $student['QRCodeID']
        ]);
        exit();
    }

    // Generate unique QR code ID
    $qrCodeID = 'QR-' . strtoupper(uniqid()) . '-' . $student['StudentProfileID'];

    // Update studentprofile record with QR code ID
    $updateQuery = "UPDATE studentprofile SET QRCodeID = :qrCodeID WHERE StudentProfileID = :studentProfileID";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':qrCodeID', $qrCodeID);
    $updateStmt->bindParam(':studentProfileID', $student['StudentProfileID']);

    if ($updateStmt->execute()) {
        // Update session
        $_SESSION['qrCodeID'] = $qrCodeID;

        echo json_encode([
            'success' => true,
            'message' => 'QR Code generated successfully',
            'qrCodeID' => $qrCodeID
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to generate QR code'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
