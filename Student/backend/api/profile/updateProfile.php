<?php
session_start();

require_once __DIR__ . '/../../config/db.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated.']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit();
}

$userId = $_SESSION['user_id'];
$allowedFields = ['address', 'gender', 'nationality', 'email', 'phone'];

try {
    $db->beginTransaction();

    // Get ProfileID
    $stmt = $db->prepare("SELECT ProfileID FROM profile WHERE UserID = :user_id");
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        throw new Exception('Profile not found.');
    }

    $profileId = $profile['ProfileID'];

    // Build profile table updates
    $profileUpdates = [];
    $profileParams = [];

    if (isset($input['address']) && in_array('address', $allowedFields)) {
        $profileUpdates[] = "EncryptedAddress = :address";
        $profileParams[':address'] = trim($input['address']);
    }

    if (isset($input['phone']) && in_array('phone', $allowedFields)) {
        $profileUpdates[] = "EncryptedPhoneNumber = :phone";
        $profileParams[':phone'] = trim($input['phone']);
    }

    // Execute profile updates
    if (!empty($profileUpdates)) {
        $query = "UPDATE profile SET " . implode(', ', $profileUpdates) . " WHERE ProfileID = :profile_id";
        $profileParams[':profile_id'] = $profileId;
        $stmt = $db->prepare($query);
        $stmt->execute($profileParams);
    }

    // Update gender in studentprofile table
    if (isset($input['gender']) && in_array('gender', $allowedFields)) {
        $stmt = $db->prepare("
            UPDATE studentprofile 
            SET Gender = :gender 
            WHERE ProfileID = :profile_id
        ");
        $stmt->bindParam(':gender', $input['gender']);
        $stmt->bindParam(':profile_id', $profileId, PDO::PARAM_INT);
        $stmt->execute();
    }

    // Update nationality in studentprofile table
    if (isset($input['nationality']) && in_array('nationality', $allowedFields)) {
        $stmt = $db->prepare("
            UPDATE studentprofile 
            SET Nationality = :nationality 
            WHERE ProfileID = :profile_id
        ");
        $stmt->bindParam(':nationality', $input['nationality']);
        $stmt->bindParam(':profile_id', $profileId, PDO::PARAM_INT);
        $stmt->execute();
    }

    // Update email in user table
    if (isset($input['email']) && in_array('email', $allowedFields)) {
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format.');
        }
        $stmt = $db->prepare("UPDATE user SET EmailAddress = :email WHERE UserID = :user_id");
        $stmt->bindParam(':email', trim($input['email']));
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
    }

    $db->commit();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully.'
    ]);
} catch (Exception $e) {
    $db->rollBack();
    error_log("Update profile error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
