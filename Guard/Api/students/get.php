<?php 
include '../connection.php';
include '../function.php';
$id = validate('id', 'ID is required');
$result = $conn->query("SELECT * FROM students WHERE id = $id");
if(!$result) {
    error('Failed to get student: ' . $conn->error);
}
$student = $result->fetch_assoc();
success($student);
?>