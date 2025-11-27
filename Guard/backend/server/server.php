<?php

// 1. CORS Headers and Configuration
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle pre-flight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 2. Database Configuration
$DB_HOST = "localhost";
$DB_USER = "root";
$DB_PASSWORD = "aggabaorenz";
$DB_DATABASE = "aggabao_db";

// 3. Database Connection
try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_DATABASE;charset=utf8mb4",
        $DB_USER,
        $DB_PASSWORD,
        [
            PDO::ATTR_ERRMODE             => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database Error: " . $e->getMessage()]);
    exit();
}

// 4. Utility Functions

/**
 * Sends a JSON response and terminates the script.
 */
function send_json($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

/**
 * Sends a 500 server error JSON response and terminates the script.
 */
function handle_error($error) {
    http_response_code(500);
    echo json_encode(["message" => $error]);
    exit();
}

// 5. Routing Logic
$request = $_SERVER["REQUEST_URI"];
$apiBase = "/server/server.php";


// --- GET /server/server.php/student-log ---
if ($_SERVER['REQUEST_METHOD'] === 'GET' && strpos($request, "$apiBase/student-log") !== false) {
    try {
        $stmt = $pdo->query("SELECT id, user, section FROM user_info");
        send_json($stmt->fetchAll());
    } catch (PDOException $e) {
        handle_error($e->getMessage());
    }
}

// --- GET /server/server.php/profile/{employeeId} ---
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match("#$apiBase/profile/([^/]+)#", $request, $match)) {
    $employeeId = $match[1];

    try {
        $stmt = $pdo->prepare("
            SELECT fname, email, employee_id, sex, birthday, phone_number, address, religion, mother_tounge, nationality, weight, height, avatar
            FROM guard_profile
            WHERE employee_id = ?
        ");
        $stmt->execute([$employeeId]);
        $profile = $stmt->fetch();

        if (!$profile) {
            send_json(["message" => "Profile not found"], 404);
        }

        send_json($profile);
    } catch (PDOException $e) {
        handle_error($e->getMessage());
    }
}

// --- POST /server/server.php/attendance ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && strpos($request, "$apiBase/attendance") !== false) {
    $body = json_decode(file_get_contents("php://input"), true);

    if (!isset($body["user"]) || !isset($body["section"])) {
        send_json(["message" => "Missing user or section"], 400);
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO user_info (user, section) VALUES (?, ?)");
        $stmt->execute([$body["user"], $body["section"]]);
        send_json(["message" => "Attendance recorded"], 201);
    } catch (PDOException $e) {
        handle_error($e->getMessage());
    }
}

// 6. Fallback (404 Not Found)
send_json(["message" => "Endpoint not found: $request"], 404);
?>