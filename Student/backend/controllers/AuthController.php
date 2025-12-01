<?php

class AuthController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    // Generate a secure token
    private function generateToken($userId) {
        return bin2hex(random_bytes(32)) . '_' . $userId . '_' . time();
    }

    // Store token in database
    private function storeToken($userId, $token) {
        // Token expires in 30 days (1 month)
        $query = "INSERT INTO user_sessions (UserID, Token, ExpiresAt, CreatedAt) 
                  VALUES (:user_id, :token, DATE_ADD(NOW(), INTERVAL 30 DAY), NOW())
                  ON DUPLICATE KEY UPDATE Token = :token, ExpiresAt = DATE_ADD(NOW(), INTERVAL 30 DAY)";
        
        try {
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':token', $token);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Token storage error: " . $e->getMessage());
            return false;
        }
    }

    public function login($identifier, $password) {
        // 1. Get user data
        $userData = $this->user->getUserByIdentifier($identifier);

        if (!$userData) {
            return ['success' => false, 'message' => 'Invalid username or password.'];
        }

        if ($userData['AccountStatus'] !== 'Active') {
            return ['success' => false, 'message' => 'Account is inactive. Contact admin.'];
        }

        if (password_verify($password, $userData['PasswordHash'])) {
            // Generate authentication token
            $token = $this->generateToken($userData['UserID']);
            
            // Store token in database
            if (!$this->storeToken($userData['UserID'], $token)) {
                return ['success' => false, 'message' => 'Failed to create session.'];
            }

            // Start session for backward compatibility
            if (session_status() === PHP_SESSION_NONE) {
                session_set_cookie_params([
                    'lifetime' => 2592000, // 30 days in seconds (30 * 24 * 60 * 60)
                    'path' => '/', 
                    'domain' => 'localhost',
                    'secure' => false,
                    'httponly' => true,
                    'samesite' => 'Lax'
                ]);
                session_start();
            }

            session_regenerate_id(true);
            
            // Store session data
            $_SESSION['user_id'] = $userData['UserID'];
            $_SESSION['full_name'] = $userData['FullName'];
            $_SESSION['user_type'] = $userData['UserType'];
            $_SESSION['auth_token'] = $token;

            // Determine redirect URL based on UserType
            $port = '';
            $dashboardRoute = '';

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
                    $dashboardRoute = '/dashboard';
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
                    $port = '5173';
                    $dashboardRoute = '/';
            }

            $redirectUrl = "http://10.153.119.17:" . $port . $dashboardRoute;

            return [
                'success' => true, 
                'message' => 'Login successful!',
                'user' => [
                    'userId' => $userData['UserID'],
                    'fullName' => $userData['FullName'],
                    'userType' => $userData['UserType']
                ],
                'token' => $token, // Send token to frontend
                'redirectUrl' => $redirectUrl
            ];
        } else {
            return ['success' => false, 'message' => 'Invalid username or password.'];
        }
    }

    // Verify token
    public function verifyToken($token) {
        $query = "SELECT u.UserID, u.UserType, u.AccountStatus, 
                         CONCAT(p.FirstName, ' ', p.LastName) AS FullName,
                         us.ExpiresAt
                  FROM user_sessions us
                  JOIN user u ON us.UserID = u.UserID
                  JOIN profile p ON u.UserID = p.UserID
                  WHERE us.Token = :token AND us.ExpiresAt > NOW()";
        
        try {
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Token verification error: " . $e->getMessage());
            return false;
        }
    }

    // Logout - invalidate token
    public function logout($token) {
        $query = "DELETE FROM user_sessions WHERE Token = :token";
        
        try {
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':token', $token);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Logout error: " . $e->getMessage());
            return false;
        }
    }
}
?>