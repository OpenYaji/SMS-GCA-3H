<?php

class AuthController {
    private $db;
    private $user;


    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }


   // controllers/AuthController.php

public function login($identifier, $password) {
    // 1. Use the new generic lookup
    $userData = $this->user->getUserByIdentifier($identifier);

    if (!$userData) {
        return ['success' => false, 'message' => 'Invalid username or password.'];
    }

    if ($userData['AccountStatus'] !== 'Active') {
        return ['success' => false, 'message' => 'Account is inactive. Contact admin.'];
    }

    if (password_verify($password, $userData['PasswordHash'])) {
        if (session_status() === PHP_SESSION_NONE) {
            // Important: Set cookie path to '/' so all ports on localhost can read it
            session_set_cookie_params([
                'lifetime' => 3600,
                'path' => '/', 
                'domain' => 'localhost', // Explicitly set localhost
                'secure' => false, // Set to true if using HTTPS
                'httponly' => true,
                'samesite' => 'Lax'
            ]);
            session_start();
        }

        session_regenerate_id(true);
        
        // Store Session Data
        $_SESSION['user_id'] = $userData['UserID'];
        $_SESSION['full_name'] = $userData['FullName'];
        $_SESSION['user_type'] = $userData['UserType'];

        // Determine Redirect URL based on UserType
        $redirectUrl = '';
        $dashboardRoute = ''; // Where they go after hitting the domain

        switch ($userData['UserType']) {
            case 'Student':
                $port = '5173';
                $dashboardRoute = '/student-dashboard';
                break;
            case 'Registrar':
                $port = '5174';
                $dashboardRoute = '/registrar-dashboard';
                break;
            case 'Admin':
                $port = '5175';
                $dashboardRoute = '/admin-dashboard';
                break;
            case 'Guard':
                $port = '5176';
                $dashboardRoute = '/guard-dashboard';
                break;
            case 'Teacher':
                $port = '5177';
                $dashboardRoute = '/teacher-dashboard';
                break;
            default:
                $port = '5173'; // Default
                $dashboardRoute = '/';
        }

        $redirectUrl = "http://192.168.0.110:" . $port . $dashboardRoute;

        return [
            'success' => true, 
            'message' => 'Login successful!',
            'user' => [
                'fullName' => $userData['FullName'],
                'userType' => $userData['UserType']
            ],
            'redirectUrl' => $redirectUrl // Send this to frontend
        ];
    } else {
        return ['success' => false, 'message' => 'Invalid username or password.'];
    }
}
}
?>