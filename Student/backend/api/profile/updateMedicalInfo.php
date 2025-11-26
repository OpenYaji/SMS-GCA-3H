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

$input = json_decode(file_get_contents("php://input"), true);

try {
    $db->beginTransaction();

    // Get StudentProfileID
    $stmt = $db->prepare("
        SELECT sp.StudentProfileID 
        FROM studentprofile sp 
        JOIN profile p ON sp.ProfileID = p.ProfileID 
        WHERE p.UserID = :user_id
    ");
    $stmt->bindParam(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        throw new Exception('Student profile not found.');
    }

    $studentProfileId = $result['StudentProfileID'];

    // Update medical info
    $stmt = $db->prepare("
        UPDATE medicalinfo 
        SET Weight = :weight,
            Height = :height,
            EncryptedAllergies = :allergies,
            EncryptedMedicalConditions = :conditions
        WHERE StudentProfileID = :student_profile_id
    ");
    $stmt->bindParam(':weight', $input['weight']);
    $stmt->bindParam(':height', $input['height']);
    $stmt->bindParam(':allergies', $input['allergies']);
    $stmt->bindParam(':conditions', $input['conditions']);
    $stmt->bindParam(':student_profile_id', $studentProfileId, PDO::PARAM_INT);
    $stmt->execute();

    // Update emergency contact
    $stmt = $db->prepare("
        UPDATE emergencycontact 
        SET ContactPerson = :contact_person,
            EncryptedContactNumber = :contact_number
        WHERE StudentProfileID = :student_profile_id
    ");
    $stmt->bindParam(':contact_person', $input['emergencyContactPerson']);
    $stmt->bindParam(':contact_number', $input['emergencyContactNumber']);
    $stmt->bindParam(':student_profile_id', $studentProfileId, PDO::PARAM_INT);
    $stmt->execute();

    $db->commit();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Medical information updated successfully.'
    ]);
} catch (Exception $e) {
    $db->rollBack();
    error_log("Update medical info error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
