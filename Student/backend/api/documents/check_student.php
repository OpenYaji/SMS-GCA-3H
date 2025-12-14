<?php
session_start();
header('Content-Type: application/json');

try {
    require_once __DIR__ . '/../../config/db.php';
    
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Not logged in']);
        exit;
    }
    
    $userID = $_SESSION['user_id'];
    
    // Check if user has a profile
    $query1 = "SELECT * FROM profile WHERE UserID = ?";
    $stmt1 = $pdo->prepare($query1);
    $stmt1->execute([$userID]);
    $profile = $stmt1->fetch(PDO::FETCH_ASSOC);
    
    // Check if user has a student profile
    $studentProfile = null;
    if ($profile) {
        $query2 = "SELECT * FROM studentprofile WHERE ProfileID = ?";
        $stmt2 = $pdo->prepare($query2);
        $stmt2->execute([$profile['ProfileID']]);
        $studentProfile = $stmt2->fetch(PDO::FETCH_ASSOC);
    }
    
    echo json_encode([
        'success' => true,
        'userID' => $userID,
        'hasProfile' => $profile ? true : false,
        'profile' => $profile,
        'hasStudentProfile' => $studentProfile ? true : false,
        'studentProfile' => $studentProfile
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}