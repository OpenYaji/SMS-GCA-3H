<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors (send to log only)
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// Handle CORS
$allowed_origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://172.20.10.5:5173',
    'https://localhost:5173',
    'https://127.0.0.1:5173',
    'https://172.20.10.5:5173'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Set JSON content type for all responses
header('Content-Type: application/json; charset=utf-8');

// Include dependencies
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../controllers/AdmissionController.php';

// Initialize controller
try {
    if (!$pdo) {
        throw new Exception("Database connection failed");
    }
    $controller = new AdmissionController($pdo);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server configuration error: ' . $e->getMessage()
    ]);
    error_log("Controller initialization error: " . $e->getMessage());
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($method) {
        case 'POST':
            handlePost($action, $controller);
            break;

        case 'GET':
            handleGet($action, $controller);
            break;

        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Method not allowed'
            ]);
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred processing your request'
    ]);
}

function handlePost($action, $controller)
{
    switch ($action) {
        case 'submit':
            submitAdmission($controller);
            break;

        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action'
            ]);
    }
}

function handleGet($action, $controller)
{
    switch ($action) {
        case 'check_status':
            checkStatus($controller);
            break;

        case 'grade_levels':
            getGradeLevels($controller);
            break;

        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action'
            ]);
    }
}

function submitAdmission($controller)
{
    $postData = $_POST;
    $files = $_FILES ?? [];

    $result = $controller->submitApplication($postData, $files);

    http_response_code($result['success'] ? 201 : 400);
    echo json_encode($result);
}

function checkStatus($controller)
{
    $trackingNumber = $_GET['tracking_number'] ?? '';

    if (empty($trackingNumber)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Tracking number is required'
        ]);
        return;
    }

    $application = $controller->checkStatus($trackingNumber);

    if ($application) {
        echo json_encode([
            'success' => true,
            'data' => $application
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Application not found'
        ]);
    }
}

function getGradeLevels($controller)
{
    try {
        $gradeLevels = $controller->getGradeLevels();

        echo json_encode([
            'success' => true,
            'data' => $gradeLevels
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch grade levels'
        ]);
    }
}
