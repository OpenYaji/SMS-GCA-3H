<?php 
include '../connection.php';


$result = $conn->query("SELECT * FROM students");
$students = array();
while($row = $result->fetch_assoc()) {
    $students[] = $row;
} 
echo json_encode($students);
?>