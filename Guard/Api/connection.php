<?php 

$host = 'localhost';
$user = 'root';
$pass = 'aggabaorenz';
$db = 'guard_db';


$conn = new mysqli($host, $user, $pass, $db); 
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
header('Content-Type: application/json; charset=utf-8');
$method = $_SERVER['REQUEST_METHOD']; 
?>