<?php
// Registrar/backend/middleware/AuthMiddleware.php

/**
 * Authentication Middleware for Registrar Backend
 * Verifies tokens created by Student backend login
 */
class AuthMiddleware {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Main authentication method
     * Checks token from Authorization header OR request body
     */
    public function authenticate() {
        $token = $this->getTokenFromRequest();
        
        if (!$token) {
            return false;
        }

        return $this->verifyToken($token);
    }

    /**
     * Get token from multiple sources
     */
    private function getTokenFromRequest() {
        // 1. Check Authorization header
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            return str_replace('Bearer ', '', $headers['Authorization']);
        }
        if (isset($headers['authorization'])) {
            return str_replace('Bearer ', '', $headers['authorization']);
        }

        // 2. Check request body
        $input = json_decode(file_get_contents('php://input'), true);
        if (isset($input['token'])) {
            return $input['token'];
        }

        // 3. Check query parameter
        if (isset($_GET['token'])) {
            return $_GET['token'];
        }

        // 4. Check POST data
        if (isset($_POST['token'])) {
            return $_POST['token'];
        }

        return null;
    }

    /**
     * Verify token against database
     */
    private function verifyToken($token) {
        $query = "SELECT 
                    u.UserID, 
                    u.UserType, 
                    u.AccountStatus, 
                    u.EmailAddress,
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
            
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($userData && $userData['AccountStatus'] === 'Active') {
                // Refresh token expiry
                $this->refreshToken($token);
                
                return [
                    'user_id' => $userData['UserID'],
                    'user_type' => $userData['UserType'],
                    'email' => $userData['EmailAddress'],
                    'full_name' => $userData['FullName']
                ];
            }
        } catch (PDOException $e) {
            error_log("Token verification error: " . $e->getMessage());
        }

        return false;
    }

    /**
     * Refresh token expiry on each valid request
     */
    private function refreshToken($token) {
        $query = "UPDATE user_sessions 
                  SET LastActivity = NOW(),
                      ExpiresAt = DATE_ADD(NOW(), INTERVAL 30 DAY)
                  WHERE Token = :token";
        
        try {
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
        } catch (PDOException $e) {
            error_log("Token refresh error: " . $e->getMessage());
        }
    }

    /**
     * Authorize user with role checking
     */
    public function authorize($allowedRoles = []) {
        $user = $this->authenticate();

        if (!$user) {
            http_response_code(401);
            echo json_encode([
                'success' => false, 
                'message' => 'Authentication required. Please login.'
            ]);
            exit();
        }

        if (!empty($allowedRoles) && !in_array($user['user_type'], $allowedRoles)) {
            http_response_code(403);
            echo json_encode([
                'success' => false, 
                'message' => 'Access denied. Registrar or Admin role required.',
                'your_role' => $user['user_type'],
                'required_roles' => $allowedRoles
            ]);
            exit();
        }

        return $user;
    }

    /**
     * Quick auth helpers
     */
    public function requireAuth() {
        return $this->authorize([]);
    }

    public function requireRegistrar() {
        return $this->authorize(['Registrar', 'Admin']);
    }

    public function requireAdmin() {
        return $this->authorize(['Admin']);
    }
}
?>