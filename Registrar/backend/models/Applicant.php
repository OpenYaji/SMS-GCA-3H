<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../php-error.log');

header("Access-Control-Allow-Origin: http://192.168.254.176:5174");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';

class Applicant
{
    public $conn; // Changed to public so validateApplicant.php can access it

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    private function mapId($rows)
    {
        foreach ($rows as &$row) {
            $row['id'] = $row['ApplicationID'];
            if (isset($row['LevelName'])) {
                $row['grade'] = $row['LevelName'];
            }
        }
        return $rows;
    }

    public function getApplicants()
    {
        $stmt = $this->conn->prepare("
            SELECT a.*, g.LevelName
            FROM application a
            LEFT JOIN gradelevel g ON g.GradeLevelID = a.ApplyingForGradeLevelID
            WHERE a.ApplicationStatus = 'Pending'
        ");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $this->mapId($rows);
    }

    public function getScreeningApplicants()
    {
        $stmt = $this->conn->prepare("
            SELECT a.*, g.LevelName
            FROM application a
            LEFT JOIN gradelevel g ON g.GradeLevelID = a.ApplyingForGradeLevelID
            WHERE a.ApplicationStatus = 'For Review'
        ");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as &$row) {
            $row['documents'] = [];
        }

        return $this->mapId($rows);
    }

    public function getValidatedApplicants()
    {
        $stmt = $this->conn->prepare("
            SELECT a.*, g.LevelName,
                   t.TransactionID, t.TotalAmount, t.PaidAmount,
                   (t.TotalAmount - t.PaidAmount) as OutstandingBalance
            FROM application a
            LEFT JOIN gradelevel g ON g.GradeLevelID = a.ApplyingForGradeLevelID
            LEFT JOIN transaction t ON t.TransactionID = a.TransactionID
            WHERE a.ApplicationStatus = 'Approved'
        ");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $this->mapId($rows);
    }

    public function updateStage($applicantId)
    {
        $stmt = $this->conn->prepare("
            UPDATE application
            SET ApplicationStatus = 'For Review'
            WHERE ApplicationID = :id
        ");
        $stmt->bindParam(':id', $applicantId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function validateApplicant($applicantId)
    {
        $stmt = $this->conn->prepare("
            UPDATE application
            SET ApplicationStatus = 'Approved'
            WHERE ApplicationID = :id
        ");
        $stmt->bindParam(':id', $applicantId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function validateApplicantWithPayment($applicantId, $paymentData)
    {
        // Get applicant data first
        $applicant = $this->getApplicantById($applicantId);

        $stmt = $this->conn->prepare("
            UPDATE application
            SET 
                ApplicationStatus = 'Approved',
                PaymentMode = :paymentMode,
                DownPayment = :downPayment,
                OutstandingBalance = :outstandingBalance,
                TotalFee = :totalFee,
                RegistrarNotes = :notes,
                ReviewedDate = NOW()
            WHERE ApplicationID = :id
        ");

        $stmt->bindParam(':paymentMode', $paymentData['paymentMode']);
        $stmt->bindParam(':downPayment', $paymentData['downPayment']);
        $stmt->bindParam(':outstandingBalance', $paymentData['outstandingBalance']);
        $stmt->bindParam(':totalFee', $paymentData['totalFee']);
        $stmt->bindParam(':notes', $paymentData['notes']);
        $stmt->bindParam(':id', $applicantId, PDO::PARAM_INT);
        $stmt->execute();

        return [
            'applicant' => $applicant,
            'payment' => $paymentData
        ];
    }

    public function getApplicantById($applicantId)
    {
        $stmt = $this->conn->prepare("
            SELECT a.*, g.LevelName
            FROM application a
            LEFT JOIN gradelevel g ON g.GradeLevelID = a.ApplyingForGradeLevelID
            WHERE a.ApplicationID = :id
        ");
        $stmt->bindParam(':id', $applicantId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $row['id'] = $row['ApplicationID'];
            if (isset($row['LevelName'])) {
                $row['grade'] = $row['LevelName'];
            }
        }

        return $row;
    }
}
