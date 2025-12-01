<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelHigh;
use Endroid\QrCode\Writer\PngWriter;

class QRGenerator
{
    private $qrDirectory;

    public function __construct()
    {
        // Set QR code storage directory inside backend
        $this->qrDirectory = __DIR__ . '/../qrcodes/';
        
        // Create directory if it doesn't exist
        if (!file_exists($this->qrDirectory)) {
            mkdir($this->qrDirectory, 0777, true);
        }
    }

    /**
     * Generate QR code for student
     * @param string $studentNumber - Student number (e.g., GCA-2025-00000)
     * @return array - Returns array with file path and base64 encoded image
     */
    public function generateStudentQR($studentNumber)
    {
        try {
            // Create QR code ID
            $qrCodeId = "QR-{$studentNumber}";
            
            // Build QR code using Builder
            $result = Builder::create()
                ->writer(new PngWriter())
                ->data($qrCodeId)
                ->encoding(new Encoding('UTF-8'))
                ->errorCorrectionLevel(new ErrorCorrectionLevelHigh())
                ->size(300)
                ->margin(10)
                ->build();
            
            // Save to file
            $filename = "{$studentNumber}.png";
            $filePath = $this->qrDirectory . $filename;
            $result->saveToFile($filePath);
            
            // Get base64 encoded string for email embedding
            $base64Image = base64_encode($result->getString());
            
            return [
                'success' => true,
                'qrCodeId' => $qrCodeId,
                'filePath' => $filePath,
                'base64' => $base64Image,
                'mimeType' => $result->getMimeType()
            ];
            
        } catch (Exception $e) {
            error_log("QR Code generation error: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get existing QR code if it exists
     * @param string $studentNumber
     * @return array|null
     */
    public function getExistingQR($studentNumber)
    {
        $filename = "{$studentNumber}.png";
        $filePath = $this->qrDirectory . $filename;
        
        if (file_exists($filePath)) {
            $qrCodeId = "QR-{$studentNumber}";
            $base64Image = base64_encode(file_get_contents($filePath));
            
            return [
                'success' => true,
                'qrCodeId' => $qrCodeId,
                'filePath' => $filePath,
                'base64' => $base64Image,
                'mimeType' => 'image/png'
            ];
        }
        
        return null;
    }

    /**
     * Delete QR code file
     * @param string $studentNumber
     * @return bool
     */
    public function deleteQR($studentNumber)
    {
        $filename = "{$studentNumber}.png";
        $filePath = $this->qrDirectory . $filename;
        
        if (file_exists($filePath)) {
            return unlink($filePath);
        }
        
        return false;
    }
}
?>
