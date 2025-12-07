<?php
// C:\xampp\htdocs\SMS-GCA-3H\Registrar\backend\api\records\check_database.php
// DIAGNOSTIC TOOL - Run this in your browser to see your table structure
require_once __DIR__ . '/../../config/db.php';

header('Content-Type: application/json; charset=UTF-8');

try {
    $database = new Database();
    $conn = $database->getConnection();

    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    $result = [];

    // Check document_request table
    $stmt = $conn->query("DESCRIBE document_request");
    $result['document_request'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check studentprofile table
    $stmt = $conn->query("DESCRIBE studentprofile");
    $result['studentprofile'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check profile table
    $stmt = $conn->query("DESCRIBE profile");
    $result['profile'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check user table
    $stmt = $conn->query("DESCRIBE user");
    $result['user'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check archive_search table
    $stmt = $conn->query("DESCRIBE archive_search");
    $result['archive_search'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Sample data from document_request
    $stmt = $conn->query("SELECT * FROM document_request LIMIT 2");
    $result['document_request_sample'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Sample data from studentprofile
    $stmt = $conn->query("SELECT * FROM studentprofile LIMIT 2");
    $result['studentprofile_sample'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<html><body><h1>Database Structure</h1>";
    echo "<pre>" . json_encode($result, JSON_PRETTY_PRINT) . "</pre>";
    echo "</body></html>";
} catch (Exception $e) {
    echo "<html><body><h1>Error</h1>";
    echo "<p style='color:red;'>" . $e->getMessage() . "</p>";
    echo "</body></html>";
}
