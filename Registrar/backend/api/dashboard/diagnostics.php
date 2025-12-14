<?php
require_once '../../config/cors.php';
require_once '../../config/db.php';
require_once '../../models/Dashboard.php';

$database = new Database();
$db = $database->getConnection();

header('Content-Type: application/json');

try {
    $dashboard = new Dashboard($db);

    // Get active school year
    $stmt = $db->prepare("SELECT * FROM schoolyear WHERE IsActive = 1");
    $stmt->execute();
    $activeYear = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get total applications
    $stmt = $db->prepare("SELECT COUNT(*) as total, SchoolYearID FROM application GROUP BY SchoolYearID");
    $stmt->execute();
    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get total enrollments
    $stmt = $db->prepare("
        SELECT COUNT(*) as total, s.SchoolYearID 
        FROM enrollment e 
        JOIN section s ON e.SectionID = s.SectionID 
        GROUP BY s.SchoolYearID
    ");
    $stmt->execute();
    $enrollments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get total students
    $stmt = $db->prepare("SELECT COUNT(*) as total FROM studentprofile");
    $stmt->execute();
    $students = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get application statuses
    $stmt = $db->prepare("SELECT ApplicationStatus, COUNT(*) as count FROM application GROUP BY ApplicationStatus");
    $stmt->execute();
    $appStatuses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Using Dashboard model
    $pendingApps = $dashboard->getPendingApplicationsCount();
    $activeEnrollments = $dashboard->getActiveEnrollmentsCount();
    $pendingTasks = $dashboard->getPendingTasksCount();

    echo json_encode([
        'success' => true,
        'database' => [
            'host' => 'localhost',
            'name' => 'aaa'
        ],
        'activeSchoolYear' => $activeYear,
        'dashboardModel' => [
            'pendingApplications' => $pendingApps,
            'activeEnrollments' => $activeEnrollments,
            'pendingTasks' => $pendingTasks
        ],
        'applications' => [
            'bySchoolYear' => $applications,
            'byStatus' => $appStatuses
        ],
        'enrollments' => [
            'bySchoolYear' => $enrollments
        ],
        'students' => $students
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
}
