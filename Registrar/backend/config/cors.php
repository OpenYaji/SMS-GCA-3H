<?php
// Prevent any stray characters/spaces before <?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Hide HTML errors, we only want JSON

// Allow React Frontend
header("Access-Control-Allow-Origin: http://localhost:5174"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
?>