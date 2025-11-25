<?php 

function json($data) {
    echo json_encode($data);
}

function error($message) {
    json([
        'status' => 'error',
        'message' => $message
    ]);
    die();
}

function success($data) {
    json([
        'status' => 'success',
        'data' => $data
    ]);
    die();
}

function validate($field, $message) {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'POST') {
        if (!isset($_POST[$field]) || empty($_POST[$field])) {
            error($message);
        }
        return $_POST[$field];
    }

    if ($method == 'GET') {
        if (!isset($_GET[$field]) || empty($_GET[$field])) {
            error($message);
        }
        return $_GET[$field];
    }

    die();
}


?>