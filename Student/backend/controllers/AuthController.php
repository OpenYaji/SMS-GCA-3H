<?php

class AuthController
{
    private $db;
    private $user;

    public function __construct($db)
    {
        $this->db = $db;
        $this->user = new User($db);
    }

    // Generate a secure token
    private function generateToken($userId)
    {
        return bin2hex(random_bytes(32)) . '_' . $userId . '_' . time();
    }

    // Store token in database
    private function storeToken($userId, $token)
    {
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

    public function login($identifier, $password)
    {
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
                // Dynamic domain for cookies
                $cookieDomain = ($_SERVER['HTTP_HOST'] === 'localhost') ? 'localhost' : null; // null lets PHP handle ngrok domain automatically

                session_set_cookie_params([
                    'lifetime' => 2592000,
                    'path' => '/',
                    'domain' => $cookieDomain,
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

            // Determine redirect URL
            $dashboardRoute = '';
            $targetPort = '5173';

            switch ($userData['UserType']) {
                case 'Student':
                    $targetPort = '5173';
                    $dashboardRoute = '/student-dashboard';
                    break;
                case 'Registrar':
                    $targetPort = '5174';
                    $dashboardRoute = '/registrar-dashboard';
                    break;
                case 'Admin':
                    $targetPort = '5175';
                    $dashboardRoute = '/dashboard';
                    break;
                case 'Guard':
                    $targetPort = '5176';
                    $dashboardRoute = '/guard-dashboard';
                    break;
                case 'Teacher':
                    $targetPort = '5177';
                    $dashboardRoute = '/teacher-dashboard';
                    break;
                default:
                    $targetPort = '5173';
                    $dashboardRoute = '/';
            }

            // --- UPDATED REDIRECT LOGIC ---
            $currentHost = $_SERVER['HTTP_HOST']; // Gets 'localhost:5173' or 'xxxx.ngrok-free.app'

            // Check if we are NOT on localhost (meaning we are on Ngrok)
            if (strpos($currentHost, 'localhost') === false && strpos($currentHost, '127.0.0.1') === false) {
                // We are on Ngrok. return a RELATIVE path.
                // The frontend will treat this as "current-domain.com/dashboard"
                $redirectUrl = $dashboardRoute;
            } else {
                // We are on Localhost. We force the specific port.
                $redirectUrl = "http://localhost:" . $targetPort . $dashboardRoute;
            }

            return [
                'success' => true,
                'message' => 'Login successful!',
                'user' => [
                    'userId' => $userData['UserID'],
                    'fullName' => $userData['FullName'],
                    'userType' => $userData['UserType']
                ],
                'token' => $token,
                'redirectUrl' => $redirectUrl
            ];
        } else {
            return ['success' => false, 'message' => 'Invalid username or password.'];
        }
    }

    // Verify token
    public function verifyToken($token)
    {
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
    public function logout($token)
    {
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
