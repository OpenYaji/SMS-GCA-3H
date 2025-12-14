<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once '../../config/cors.php';
require_once '../../config/db.php';
require_once '../../models/Dashboard.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    error_log("Database connection failed");
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

try {
    $dashboard = new Dashboard($db);

    $stats = [
        'applications' => getApplicationStats($db),
        'enrollments' => [
            'total' => $dashboard->getActiveEnrollmentsCount(),
            'thisYear' => $dashboard->getActiveEnrollmentsCount(),
            'pending' => 0,
            'cancelled' => 0
        ],
        'transactions' => getTransactionStats($db),
        'students' => getStudentStats($db),
        'documents' => getDocumentStats($db)
    ];

    echo json_encode([
        'success' => true,
        'data' => $stats,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    error_log("Dashboard Stats Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching dashboard statistics',
        'error' => $e->getMessage()
    ]);
}

function getActiveSchoolYear($db)
{
    try {
        $stmt = $db->prepare("SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1");
        $stmt->execute();
        return $stmt->fetchColumn();
    } catch (PDOException $e) {
        error_log("Error getting active school year: " . $e->getMessage());
        return null;
    }
}

function getApplicationStats($db)
{
    $activeYear = getActiveSchoolYear($db);
    if (!$activeYear) {
        return ['pending' => 0, 'forReview' => 0, 'approved' => 0, 'rejected' => 0];
    }

    try {
        $query = "
            SELECT 
                COUNT(CASE WHEN ApplicationStatus = 'Pending' THEN 1 END) as pending,
                COUNT(CASE WHEN ApplicationStatus = 'For Screening' THEN 1 END) as forScreening,
                COUNT(CASE WHEN ApplicationStatus = 'For Review' THEN 1 END) as forReview,
                COUNT(CASE WHEN ApplicationStatus = 'Approved' THEN 1 END) as approved,
                COUNT(CASE WHEN ApplicationStatus = 'Enrolled' THEN 1 END) as enrolled,
                COUNT(CASE WHEN ApplicationStatus = 'Rejected' THEN 1 END) as rejected
            FROM application 
            WHERE SchoolYearID = :schoolYearId
        ";

        $stmt = $db->prepare($query);
        $stmt->execute([':schoolYearId' => $activeYear]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        error_log("Application Stats: " . json_encode($result));

        return [
            'pending' => (int)($result['pending'] ?? 0),
            'forReview' => (int)($result['forScreening'] ?? 0) + (int)($result['forReview'] ?? 0),
            'approved' => (int)($result['approved'] ?? 0) + (int)($result['enrolled'] ?? 0),
            'rejected' => (int)($result['rejected'] ?? 0)
        ];
    } catch (PDOException $e) {
        error_log("Error in getApplicationStats: " . $e->getMessage());
        return ['pending' => 0, 'forReview' => 0, 'approved' => 0, 'rejected' => 0];
    }
}

function getTransactionStats($db)
{
    $activeYear = getActiveSchoolYear($db);
    if (!$activeYear) {
        return [
            'totalCollected' => 0,
            'pendingVerification' => 0,
            'outstandingCount' => 0,
            'verifiedThisMonth' => 0,
            'clearedThisQuarter' => 0
        ];
    }

    try {
        // Get total collected
        $collectedQuery = "
            SELECT COALESCE(SUM(pay.AmountPaid), 0) as totalCollected
            FROM payment pay
            JOIN transaction t ON pay.TransactionID = t.TransactionID
            WHERE t.SchoolYearID = :schoolYearId 
            AND pay.VerificationStatus = 'Verified'
        ";

        $stmt = $db->prepare($collectedQuery);
        $stmt->execute([':schoolYearId' => $activeYear]);
        $totalCollected = (float)$stmt->fetchColumn();

        // Outstanding count
        $outstandingQuery = "
            SELECT COUNT(*) FROM transaction t
            WHERE t.SchoolYearID = :schoolYearId
            AND t.BalanceAmount > 0
        ";

        $stmt = $db->prepare($outstandingQuery);
        $stmt->execute([':schoolYearId' => $activeYear]);
        $outstandingCount = (int)$stmt->fetchColumn();

        // Pending verification
        $pendingQuery = "
            SELECT COUNT(*) FROM payment p
            JOIN transaction t ON p.TransactionID = t.TransactionID
            WHERE t.SchoolYearID = :schoolYearId AND p.VerificationStatus = 'Pending'
        ";
        $stmt = $db->prepare($pendingQuery);
        $stmt->execute([':schoolYearId' => $activeYear]);
        $pendingVerification = (int)$stmt->fetchColumn();

        // Verified this month
        $verifiedMonthQuery = "
            SELECT COUNT(*) FROM payment p
            JOIN transaction t ON p.TransactionID = t.TransactionID
            WHERE t.SchoolYearID = :schoolYearId 
            AND p.VerificationStatus = 'Verified'
            AND MONTH(p.VerifiedAt) = MONTH(CURDATE()) 
            AND YEAR(p.VerifiedAt) = YEAR(CURDATE())
        ";
        $stmt = $db->prepare($verifiedMonthQuery);
        $stmt->execute([':schoolYearId' => $activeYear]);
        $verifiedThisMonth = (int)$stmt->fetchColumn();

        // Cleared this quarter
        $clearedQuery = "
            SELECT COUNT(*) FROM transaction t
            WHERE t.SchoolYearID = :schoolYearId 
            AND t.TransactionStatusID = 3
            AND QUARTER(t.IssueDate) = QUARTER(CURDATE())
            AND YEAR(t.IssueDate) = YEAR(CURDATE())
        ";
        $stmt = $db->prepare($clearedQuery);
        $stmt->execute([':schoolYearId' => $activeYear]);
        $clearedThisQuarter = (int)$stmt->fetchColumn();

        return [
            'totalCollected' => $totalCollected,
            'pendingVerification' => $pendingVerification,
            'outstandingCount' => $outstandingCount,
            'verifiedThisMonth' => $verifiedThisMonth,
            'clearedThisQuarter' => $clearedThisQuarter
        ];
    } catch (PDOException $e) {
        error_log("Error in getTransactionStats: " . $e->getMessage());
        return [
            'totalCollected' => 0,
            'pendingVerification' => 0,
            'outstandingCount' => 0,
            'verifiedThisMonth' => 0,
            'clearedThisQuarter' => 0
        ];
    }
}

function getStudentStats($db)
{
    $activeYear = getActiveSchoolYear($db);
    if (!$activeYear) {
        return ['totalActive' => 0, 'newThisYear' => 0, 'transferees' => 0, 'graduated' => 0];
    }

    try {
        $query = "
            SELECT 
                COUNT(DISTINCT sp.StudentProfileID) as totalActive
            FROM studentprofile sp
            JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID
            JOIN section s ON e.SectionID = s.SectionID
            WHERE s.SchoolYearID = :schoolYearId
        ";

        $stmt = $db->prepare($query);
        $stmt->execute([':schoolYearId' => $activeYear]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            'totalActive' => (int)($result['totalActive'] ?? 0),
            'newThisYear' => 0,
            'transferees' => 0,
            'graduated' => 0
        ];
    } catch (PDOException $e) {
        error_log("Error in getStudentStats: " . $e->getMessage());
        return ['totalActive' => 0, 'newThisYear' => 0, 'transferees' => 0, 'graduated' => 0];
    }
}

function getDocumentStats($db)
{
    try {
        $stmt = $db->query("SHOW TABLES LIKE 'documentrequest'");
        if ($stmt->rowCount() === 0) {
            return ['pending' => 0, 'processing' => 0, 'completed' => 0, 'thisMonth' => 0];
        }

        $query = "
            SELECT 
                COUNT(CASE WHEN RequestStatus = 'Pending' THEN 1 END) as pending,
                COUNT(CASE WHEN RequestStatus = 'Processing' THEN 1 END) as processing,
                COUNT(CASE WHEN RequestStatus = 'Completed' THEN 1 END) as completed,
                COUNT(CASE WHEN MONTH(RequestDate) = MONTH(CURDATE()) 
                    AND YEAR(RequestDate) = YEAR(CURDATE()) THEN 1 END) as thisMonth
            FROM documentrequest
        ";

        $stmt = $db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            'pending' => (int)($result['pending'] ?? 0),
            'processing' => (int)($result['processing'] ?? 0),
            'completed' => (int)($result['completed'] ?? 0),
            'thisMonth' => (int)($result['thisMonth'] ?? 0)
        ];
    } catch (PDOException $e) {
        error_log("Error in getDocumentStats: " . $e->getMessage());
        return ['pending' => 0, 'processing' => 0, 'completed' => 0, 'thisMonth' => 0];
    }
}
