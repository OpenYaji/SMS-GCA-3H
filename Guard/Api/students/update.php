<?php 

include '../connection.php';
include '../function.php';

if($method != 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed'
    ]);
}
#validation here
$id = validate('id', 'ID is required');
$student_id = validate('student_id', 'Student ID is required');
$name = validate('name', 'Name is required');
$qrcode = validate('qrcode', 'QR Code is required');
$section = validate('section', 'Section is required');
$grade_level = validate('grade_level', 'Grade Level is required');
$adviser_name = validate('adviser_name', 'Adviser is required');

$result = $conn->query("UPDATE
    `students`
SET 
    `student_id` = '$student_id',
    `qrcode` = '$qrcode',
    `name` = '$name',
    `section` = '$section',
    `grade_level` = '$grade_level',
    `adviser_name` = '$adviser_name'
WHERE id = $id");

if(!$result) {
    error('Failed to add student: ' . $conn->error);
}

success('Updated Successful');
?>