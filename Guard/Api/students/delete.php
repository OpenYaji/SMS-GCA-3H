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
$result = $conn->query("SELECT * FROM students WHERE id = $id");
if(!$result) {
    error('Failed to get student: ' . $conn->error);
}
if($result->num_rows == 0) {
    error('Student not found');
}
$result = $conn->query("DELETE FROM `students` WHERE id = $id");

if(!$result) {
    error('Failed to Delete student: ' . $conn->error);
}



success('Deleted Successful');
?>