<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/FinancialHold.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class FinancialHoldController
{
    private $db;
    private $financialHold;
    private $auth;

    public function __construct($db)
    {
        $this->db = $db;
        $this->financialHold = new FinancialHold($db);
        $this->auth = new AuthMiddleware($db);
    }

    /**
     * Get all financial holds with filters
     */
    public function getFinancialHolds()
    {
        try {
            $filters = [
                'examPeriod' => $_GET['examPeriod'] ?? '',
                'gradeLevel' => $_GET['gradeLevel'] ?? '',
                'holdStatus' => $_GET['holdStatus'] ?? ''
            ];

            $holds = $this->financialHold->getFinancialHolds($filters);
            $stats = $this->financialHold->getSummaryStats();

            if ($holds === false) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to fetch financial holds']);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'holds' => $holds,
                'stats' => $stats,
                'count' => count($holds)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Get hold details by ID
     */
    public function getHoldDetails()
    {
        $holdId = $_GET['holdId'] ?? null;

        if (!$holdId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Hold ID is required']);
            return;
        }

        try {
            $hold = $this->financialHold->getHoldById($holdId);

            if (!$hold) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Financial hold not found']);
                return;
            }

            http_response_code(200);
            echo json_encode(['success' => true, 'hold' => $hold]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Clear a financial hold
     */
    public function clearHold()
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['holdId'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Transaction ID is required']);
            return;
        }

        try {
            $clearedBy = 1; // TODO: Get from session
            $result = $this->financialHold->clearHold(
                $input['holdId'],
                $clearedBy,
                $input['remarks'] ?? null
            );

            if ($result) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Balance cleared successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to clear balance']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Extend payment deadline
     */
    public function extendDeadline()
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['holdId']) || !isset($input['newDeadline'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Hold ID and new deadline are required']);
            return;
        }

        try {
            $result = $this->financialHold->extendDeadline(
                $input['holdId'],
                $input['newDeadline'],
                $input['reason'] ?? 'Deadline extension requested'
            );

            if ($result) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Deadline extended successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to extend deadline']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Send notification to parents
     */
    public function sendNotification()
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['holdId']) || !isset($input['message'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Hold ID and message are required']);
            return;
        }

        try {
            $result = $this->financialHold->sendNotification(
                $input['holdId'],
                $input['type'] ?? 'Email',
                $input['email'] ?? null,
                $input['phone'] ?? null,
                $input['subject'] ?? 'Financial Hold Notification',
                $input['message']
            );

            if ($result) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Notification sent successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to send notification']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
