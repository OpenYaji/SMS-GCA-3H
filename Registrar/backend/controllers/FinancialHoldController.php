<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/FinancialHold.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class FinancialHoldController
{
    private $db;
    private $financialHold;
    private $auth; // Assuming AuthMiddleware handles user authentication and session management

    public function __construct($db)
    {
        $this->db = $db;
        $this->financialHold = new FinancialHold($db);
        $this->auth = new AuthMiddleware($db);
    }

    /**
     * Get all financial holds for the ACTIVE school year, along with summary statistics.
     * Uses the default behavior of FinancialHold::getFinancialHolds (IsActive = 1).
     */
    public function getFinancialHolds()
    {
        // TODO: Add Authorization Check here, e.g., $this->auth->requirePermission('read_financial_holds');
        
        try {
            $filters = [
                'examPeriod' => $_GET['examPeriod'] ?? '',
                'gradeLevel' => $_GET['gradeLevel'] ?? '',
                'holdStatus' => $_GET['holdStatus'] ?? ''
            ];

            // 1. Get the list of students with holds (Only from Active SY)
            $holds = $this->financialHold->getFinancialHolds($filters);
            
            // 2. Get the summary statistics (Includes Active SY check for zeroing cards)
            $stats = $this->financialHold->getSummaryStats(); 

            if ($holds === false || $stats === false) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to fetch financial data. Check model and database connection.']);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'holds' => $holds,
                'stats' => $stats, // Sends the updated stats array: totalRemainingBalance, isSchoolYearActive, etc.
                'count' => count($holds)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Get financial holds archive data (Summary stats for all INACTIVE school years).
     */
    public function getArchiveFinancialHolds()
    {
        // TODO: Add Authorization Check here, e.g., $this->auth->requirePermission('read_financial_archives');

        try {
            // Get all INACTIVE school year stats for the archive page
            $archiveStats = $this->financialHold->getArchiveStats(); 

            if ($archiveStats === false) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to fetch archive statistics']);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'archiveStats' => $archiveStats
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Get detailed financial holds (individual student balances) for a specific archived School Year.
     * This method uses the optional $schoolYearId parameter in FinancialHold::getFinancialHolds().
     */
    public function getDetailedArchivedHolds()
    {
        // TODO: Add Authorization Check here

        $schoolYearId = $_GET['schoolYearId'] ?? null;

        if (!$schoolYearId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'School Year ID is required for detailed archives.']);
            return;
        }

        try {
            $filters = [
                'examPeriod' => $_GET['examPeriod'] ?? '',
                'gradeLevel' => $_GET['gradeLevel'] ?? '',
                'holdStatus' => $_GET['holdStatus'] ?? ''
            ];

            // Fetch holds for the specified, usually inactive, school year ID
            $holds = $this->financialHold->getFinancialHolds($filters, $schoolYearId); 

            if ($holds === false) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to fetch detailed archive financial data.']);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'holds' => $holds,
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
        // TODO: Add Authorization Check here
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
        // TODO: Add Authorization Check here, e.g., $this->auth->requirePermission('clear_financial_holds');
        
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['holdId'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Transaction ID is required']);
            return;
        }

        try {
            // Placeholder: Replace '1' with actual authenticated user ID from session/token
            $clearedBy = 1; 
            
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
        // TODO: Add Authorization Check here
        
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
        // TODO: Add Authorization Check here
        
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