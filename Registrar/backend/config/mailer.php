<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

// Simple QR Code class - no external dependencies
class SimpleQRCode
{
    private $size;
    private $data;
    
    public function __construct($data, $size = 300)
    {
        $this->data = $data;
        $this->size = $size;
    }
    
    public function saveToFile($filepath)
    {
        try {
            // Use Google Charts API to generate QR code
            $url = 'https://chart.googleapis.com/chart?chs=' . $this->size . 'x' . $this->size . '&cht=qr&chl=' . urlencode($this->data) . '&choe=UTF-8';
            
            $imageData = @file_get_contents($url);
            
            if ($imageData === false) {
                return $this->generateLocalQR($filepath);
            }
            
            file_put_contents($filepath, $imageData);
            return true;
        } catch (Exception $e) {
            error_log("QR Code generation error: " . $e->getMessage());
            return false;
        }
    }
    
    private function generateLocalQR($filepath)
    {
        $img = imagecreate($this->size, $this->size);
        $white = imagecolorallocate($img, 255, 255, 255);
        $black = imagecolorallocate($img, 0, 0, 0);
        imagerectangle($img, 0, 0, $this->size - 1, $this->size - 1, $black);
        
        $text = "QR Code";
        $font = 5;
        $textWidth = imagefontwidth($font) * strlen($text);
        $textHeight = imagefontheight($font);
        $x = ($this->size - $textWidth) / 2;
        $y = ($this->size - $textHeight) / 2;
        
        imagestring($img, $font, $x, $y, $text, $black);
        imagepng($img, $filepath);
        imagedestroy($img);
        
        return true;
    }
}

class Mailer
{
    private $mail;
    private $qrCodeDir;

    public function __construct()
    {
        $this->mail = new PHPMailer(true);
        
        // Set up QR code directory
        $this->qrCodeDir = __DIR__ . '/../temp/qrcodes/';
        if (!file_exists($this->qrCodeDir)) {
            mkdir($this->qrCodeDir, 0755, true);
        }

        try {
            // Server settings
            $this->mail->isSMTP();
            $this->mail->Host       = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
            $this->mail->SMTPAuth   = true;
            $this->mail->Username   = getenv('SMTP_USERNAME') ?: 'johnreybisnarcalipes@gmail.com';
            $this->mail->Password   = getenv('SMTP_PASSWORD') ?: 'iljb mmag gmsl mvnk';
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mail->Port       = getenv('SMTP_PORT') ?: 587;

            // Default sender
            $this->mail->setFrom(
                getenv('SMTP_FROM_EMAIL') ?: 'johnreybisnarcalipes@gmail.com',
                getenv('SMTP_FROM_NAME') ?: 'Gymnazo Christian Academy'
            );
        } catch (Exception $e) {
            error_log("Mailer initialization error: " . $e->getMessage());
        }
    }

    /**
     * Generate QR Code for student identification
     */
    private function generateQRCode($studentNumber, $additionalData = [])
    {
        try {
            $qrData = [
                'student_number' => $studentNumber,
                'school' => 'Gymnazo Christian Academy',
                'timestamp' => date('Y-m-d H:i:s')
            ];
            
            $qrData = array_merge($qrData, $additionalData);
            $qrContent = json_encode($qrData);
            
            $filename = 'qr_' . $studentNumber . '_' . time() . '.png';
            $filepath = $this->qrCodeDir . $filename;
            
            // Create QR code
            $qrCode = new SimpleQRCode($qrContent, 300);
            $qrCode->saveToFile($filepath);
            
            return $filepath;
        } catch (Exception $e) {
            error_log("QR Code generation error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Clean up temporary QR code files older than 1 hour
     */
    private function cleanupOldQRCodes()
    {
        $files = glob($this->qrCodeDir . 'qr_*.png');
        $now = time();
        
        foreach ($files as $file) {
            if (is_file($file) && ($now - filemtime($file)) >= 3600) {
                unlink($file);
            }
        }
    }

    // ==================== SENDING METHODS ====================

    public function sendAdmissionConfirmation($recipientEmail, $applicationData)
    {
        try {
            $this->mail->clearAddresses();
            
            if (!empty($recipientEmail)) {
                $this->mail->addAddress($recipientEmail, $applicationData['guardianName']);
            }
            
            if (!empty($applicationData['studentEmail'])) {
                $this->mail->addAddress($applicationData['studentEmail'], $applicationData['studentName']);
            }

            $this->mail->isHTML(true);
            $this->mail->Subject = '🎓 Admission Application Confirmation - Gymnazo Christian Academy';
            $this->mail->Body = $this->getAdmissionConfirmationTemplate($applicationData);
            $this->mail->AltBody = $this->getAdmissionConfirmationPlainText($applicationData);

            $this->mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Admission confirmation email error: " . $this->mail->ErrorInfo);
            return false;
        }
    }

    public function sendScreeningNotification($recipientEmail, $applicationData)
    {
        try {
            $this->mail->clearAddresses();
            
            if (!empty($recipientEmail)) {
                $this->mail->addAddress($recipientEmail, $applicationData['guardianName']);
            }
            
            if (!empty($applicationData['studentEmail'])) {
                $this->mail->addAddress($applicationData['studentEmail'], $applicationData['studentName']);
            }

            $this->mail->isHTML(true);
            $this->mail->Subject = '📋 Next Step: Document Submission Required - Gymnazo Christian Academy';
            $this->mail->Body = $this->getScreeningNotificationTemplate($applicationData);
            $this->mail->AltBody = $this->getScreeningNotificationPlainText($applicationData);

            $this->mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Screening notification email error: " . $this->mail->ErrorInfo);
            return false;
        }
    }

    public function sendApprovalNotification($recipientEmail, $applicationData)
    {
        try {
            $this->mail->clearAddresses();
            
            if (!empty($recipientEmail)) {
                $this->mail->addAddress($recipientEmail, $applicationData['guardianName']);
            }
            
            if (!empty($applicationData['studentEmail'])) {
                $this->mail->addAddress($applicationData['studentEmail'], $applicationData['studentName']);
            }

            $this->mail->isHTML(true);
            $this->mail->Subject = '🎉 Application Approved - Awaiting Enrollment - Gymnazo Christian Academy';
            $this->mail->Body = $this->getApprovalNotificationTemplate($applicationData);
            $this->mail->AltBody = $this->getApprovalNotificationPlainText($applicationData);

            $this->mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Approval notification email error: " . $this->mail->ErrorInfo);
            return false;
        }
    }

    public function sendEnrollmentConfirmation($recipientEmail, $enrollmentData)
    {
        try {
            $this->mail->clearAddresses();
            
            if (!empty($recipientEmail)) {
                $this->mail->addAddress($recipientEmail, $enrollmentData['guardianName']);
            }
            
            if (!empty($enrollmentData['studentEmail'])) {
                $this->mail->addAddress($enrollmentData['studentEmail'], $enrollmentData['studentName']);
            }

            // Generate QR Code
            $qrCodeData = [
                'student_name' => $enrollmentData['studentName'],
                'grade_level' => $enrollmentData['gradeLevel'],
                'section' => $enrollmentData['sectionName'],
                'email' => $enrollmentData['emailAddress']
            ];
            
            $qrCodePath = $this->generateQRCode($enrollmentData['studentNumber'], $qrCodeData);
            
            // Attach QR code if generated successfully
            if ($qrCodePath && file_exists($qrCodePath)) {
                $this->mail->addEmbeddedImage($qrCodePath, 'student_qr_code', 'student_qr.png');
            }

            $this->mail->isHTML(true);
            $this->mail->Subject = '🎓 Enrollment Confirmed - Welcome to Gymnazo Christian Academy!';
            $this->mail->Body = $this->getEnrollmentConfirmationTemplate($enrollmentData, $qrCodePath ? true : false);
            $this->mail->AltBody = $this->getEnrollmentConfirmationPlainText($enrollmentData);

            $this->mail->send();
            
            // Clean up old QR codes
            $this->cleanupOldQRCodes();
            
            return true;
        } catch (Exception $e) {
            error_log("Enrollment confirmation email error: " . $this->mail->ErrorInfo);
            return false;
        }
    }

    // ==================== HTML TEMPLATES ====================
    
    private function getUnifiedCss() {
        return "
        <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; }
            table, td { border-collapse: collapse; }
            a { color: #4f46e5; text-decoration: none; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
            .header { background-color: #4f46e5; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 8px 0 0 0; font-size: 15px; opacity: 0.9; }
            .content { padding: 30px 25px; }
            .highlight-box { padding: 18px; margin: 25px 0; border-radius: 6px; }
            .confirmation-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; }
            .action-box { background-color: #eef2ff; border-left: 4px solid #4f46e5; }
            .success-box { background-color: #d1fae5; border-left: 4px solid #10b981; }
            .warning-box { background-color: #fee2e2; border-left: 4px solid #ef4444; }
            .qr-box { background-color: #f9fafb; border: 2px solid #4f46e5; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0; }
            .qr-box img { max-width: 250px; height: auto; margin: 15px auto; display: block; }
            .qr-box h3 { color: #4f46e5; margin-top: 0; }
            .qr-box p { color: #6b7280; font-size: 13px; margin: 10px 0; }
            .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .data-table th, .data-table td { padding: 12px 0; text-align: left; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
            .data-table th { font-weight: bold; color: #6b7280; width: 180px; }
            .data-table td { color: #1f2937; font-weight: 500; }
            .tracking-number { font-size: 24px; font-weight: bold; color: #92400e; letter-spacing: 1px; display: block; margin-top: 5px; }
            .step-list { margin: 15px 0 0 0; padding-left: 20px; }
            .step-list li { margin: 8px 0; font-size: 14px; color: #374151; }
            .footer { background-color: #374151; color: #d1d5db; padding: 20px; text-align: center; font-size: 12px; }
            .footer a { color: #f59e0b; text-decoration: underline; }
            .center-text { text-align: center; }
            .logo-text { font-weight: bold; color: #f59e0b; font-size: 16px; display: block; margin-bottom: 5px; }
            .strong-text { font-weight: bold; color: #4f46e5; }
        </style>
        ";
    }

    private function getAdmissionConfirmationTemplate($data)
    {
        $trackingNumber = $data['trackingNumber'];
        $studentName = $data['studentName'];
        $guardianName = $data['guardianName'];
        $gradeLevel = $data['gradeLevel'];
        $enrolleeType = $data['enrolleeType'];
        
        return "
        <!DOCTYPE html>
        <html>
        <head>{$this->getUnifiedCss()}</head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎓 Application Received!</h1>
                    <p>Confirmation for Gymnazo Christian Academy</p>
                </div>
                <div class='content'>
                    <p>Dear <strong>{$guardianName}</strong>,</p>
                    <p>We are pleased to confirm that we have received the admission application for <span class='strong-text'>{$studentName}</span>.</p>
                    <div class='highlight-box confirmation-box'>
                        <p style='margin: 0; color: #92400e;'>📋 Your <strong>Tracking Number</strong> is:</p>
                        <span class='tracking-number'>{$trackingNumber}</span>
                    </div>
                    <table class='data-table'>
                        <tr><th>Student Name:</th><td>{$studentName}</td></tr>
                        <tr><th>Applying for Grade:</th><td>{$gradeLevel}</td></tr>
                        <tr><th>Enrollee Type:</th><td>{$enrolleeType}</td></tr>
                    </table>
                    <div class='highlight-box action-box'>
                        <h3 style='margin-top:0; color: #1e40af;'>📌 What Happens Next?</h3>
                        <ol class='step-list'>
                            <li><span class='strong-text'>Application Review:</span> Our team will review your submission (3-5 business days).</li>
                            <li><span class='strong-text'>Document Request:</span> You will receive a separate email requesting required documents, if necessary.</li>
                            <li><span class='strong-text'>Final Notification:</span> We will notify you via email of the final decision.</li>
                        </ol>
                    </div>
                    <p class='center-text' style='margin-top: 30px;'>Thank you for choosing Gymnazo Christian Academy.</p>
                </div>
                <div class='footer'>
                    <span class='logo-text'>Gymnazo Christian Academy</span>
                    <p>Building Future Leaders with Christian Values</p>
                    <p>Contact: (02) 8123-4567 | admissions@gymnazo.edu</p>
                    <p style='margin-top: 10px;'>© 2025 Gymnazo Christian Academy</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    private function getScreeningNotificationTemplate($data)
    {
        $trackingNumber = $data['trackingNumber'];
        $studentName = $data['studentName'];
        $guardianName = $data['guardianName'];
        $gradeLevel = $data['gradeLevel'];
        $enrolleeType = $data['enrolleeType'];
        $requiredDocuments = $data['requiredDocuments'] ?? [];
        
        $docsList = '';
        foreach ($requiredDocuments as $doc) {
            $docsList .= "<li>{$doc}</li>";
        }

        return "
        <!DOCTYPE html>
        <html>
        <head>{$this->getUnifiedCss()}<style>.header { background-color: #f59e0b; }</style></head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>📋 Application Update</h1>
                    <p>Next Step: Document Submission Required</p>
                </div>
                <div class='content'>
                    <p>Dear <strong>{$guardianName}</strong>,</p>
                    <div class='highlight-box success-box'>
                        <h2 style='margin-top:0; color: #065f46;'>✅ Great News!</h2>
                        <p>The application for <span class='strong-text'>{$studentName}</span> (Grade {$gradeLevel}) has passed initial review and is now in the <strong>Screening Stage</strong>.</p>
                        <p><strong>Tracking Number:</strong> {$trackingNumber}</p>
                    </div>
                    <div class='highlight-box action-box'>
                        <h3 style='margin-top:0; color: #1e40af;'>📄 Required Documents for {$enrolleeType}:</h3>
                        <p>Please submit the following original or certified true copies:</p>
                        <ul class='step-list' style='color: #1e3a8a;'>{$docsList}</ul>
                        <p style='margin-top: 15px;'><strong>Action Required:</strong> Please submit documents to our admissions office or upload them through our portal.</p>
                    </div>
                    <div class='highlight-box warning-box'>
                        <h3 style='margin-top:0; color: #dc2626;'>💳 Payment Requirements</h3>
                        <p>To proceed with enrollment, please ensure the necessary down payment or full tuition is settled at the finance office.</p>
                    </div>
                    <p class='center-text' style='margin-top: 30px;'><strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM<br><strong>Phone:</strong> (02) 8123-4567 | <strong>Email:</strong> admissions@gymnazo.edu</p>
                </div>
                <div class='footer'>
                    <span class='logo-text'>Gymnazo Christian Academy</span>
                    <p>Building Future Leaders with Christian Values</p>
                    <p>Contact: (02) 8123-4567 | admissions@gymnazo.edu</p>
                    <p style='margin-top: 10px;'>© 2025 Gymnazo Christian Academy</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    private function getApprovalNotificationTemplate($data)
    {
        $trackingNumber = $data['trackingNumber'];
        $studentName = $data['studentName'];
        $guardianName = $data['guardianName'];
        $gradeLevel = $data['gradeLevel'];
        
        return "
        <!DOCTYPE html>
        <html>
        <head>{$this->getUnifiedCss()}<style>.header { background-color: #10b981; }</style></head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎉 Congratulations!</h1>
                    <p>Application Approved</p>
                </div>
                <div class='content'>
                    <p>Dear <strong>{$guardianName}</strong>,</p>
                    <div class='highlight-box success-box'>
                        <h2 style='margin-top:0; color: #065f46;'>✅ Application Approved!</h2>
                        <p>We are delighted to inform you that <strong>{$studentName}</strong>'s application for Grade {$gradeLevel} has been <strong>approved</strong>!</p>
                        <p><strong>Tracking Number:</strong> {$trackingNumber}</p>
                    </div>
                    <p>This is the final step before official enrollment. Here's what you need to do next to secure your child's slot:</p>
                    <div class='highlight-box action-box'>
                        <h3 style='margin-top:0; color: #1e40af;'>📌 Next Steps: Complete Enrollment</h3>
                        <ol class='step-list'>
                            <li><span class='strong-text'>Complete Payment:</span> Ensure all tuition and fees are settled.</li>
                            <li><span class='strong-text'>Section Assignment:</span> Our admissions team will finalize your child's section assignment.</li>
                            <li><span class='strong-text'>Credential Email:</span> You will receive a separate <strong>Enrollment Confirmation</strong> email with student credentials for the portal.</li>
                        </ol>
                    </div>
                    <p class='center-text' style='margin-top: 30px;'>We look forward to welcoming your child to Gymnazo Christian Academy!</p>
                </div>
                <div class='footer'>
                    <span class='logo-text'>Gymnazo Christian Academy</span>
                    <p>Building Future Leaders with Christian Values</p>
                    <p>Contact: (02) 8123-4567 | admissions@gymnazo.edu</p>
                    <p style='margin-top: 10px;'>© 2025 Gymnazo Christian Academy</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    private function getEnrollmentConfirmationTemplate($data, $hasQRCode = false)
    {
        $studentName = $data['studentName'];
        $guardianName = $data['guardianName'];
        $studentNumber = $data['studentNumber'];
        $emailAddress = $data['emailAddress'];
        $defaultPassword = $data['defaultPassword'];
        $gradeLevel = $data['gradeLevel'];
        $sectionName = $data['sectionName'];
        $assignedSubjects = $data['assignedSubjects'] ?? [];
        
        $subjectsList = '';
        foreach ($assignedSubjects as $subject) {
            $subjectsList .= "<li>{$subject}</li>";
        }
        
        $qrCodeSection = '';
        if ($hasQRCode) {
            $qrCodeSection = "
            <div class='qr-box'>
                <h3>📱 Student QR Code</h3>
                <img src='cid:student_qr_code' alt='Student QR Code' />
                <p><strong>Download and save this QR code!</strong></p>
                <p>Present this QR code at the school gate for quick identification and attendance tracking.</p>
                <p style='font-size: 12px; color: #dc2626;'><strong>Important:</strong> Keep this QR code secure and do not share it with others.</p>
            </div>
            ";
        }
        
        return "
        <!DOCTYPE html>
        <html>
        <head>{$this->getUnifiedCss()}</head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎓 Welcome to GCA!</h1>
                    <p>Enrollment Confirmed</p>
                </div>
                <div class='content'>
                    <p>Dear <strong>{$guardianName}</strong>,</p>
                    <div class='highlight-box success-box'>
                        <h2 style='margin-top:0; color: #065f46;'>🎉 Enrollment Complete!</h2>
                        <p>Congratulations! <strong>{$studentName}</strong> is now officially enrolled at <strong>Gymnazo Christian Academy</strong> for Grade {$gradeLevel}.</p>
                    </div>
                    <h3 style='color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-top: 30px;'>📋 Student Information</h3>
                    <table class='data-table'>
                        <tr><th>Student Name:</th><td>{$studentName}</td></tr>
                        <tr><th>Grade Level:</th><td>{$gradeLevel}</td></tr>
                        <tr><th>Section:</th><td>{$sectionName}</td></tr>
                        <tr><th>Student Number:</th><td><span style='font-family: monospace; font-size: 16px; color: #4f46e5; font-weight: bold;'>{$studentNumber}</span></td></tr>
                    </table>
                    {$qrCodeSection}
                    <div class='highlight-box warning-box'>
                        <h3 style='margin-top:0; color: #dc2626;'>🔐 Student Portal Login Credentials</h3>
                        <p style='font-size: 13px; color: #7f1d1d;'><strong>Important:</strong> You must change your default password immediately upon first login for security.</p>
                        <table style='width: 100%; margin-top: 10px;'>
                            <tr>
                                <td style='padding: 8px 0; font-weight: bold; width: 130px; font-size: 14px;'>Email Address:</td>
                                <td style='padding: 8px 0; font-family: monospace; font-weight: bold; color: #1f2937;'>{$emailAddress}</td>
                            </tr>
                            <tr>
                                <td style='padding: 8px 0; font-weight: bold; width: 130px; font-size: 14px;'>Default Password:</td>
                                <td style='padding: 8px 0; font-family: monospace; font-weight: bold; color: #ef4444;'>{$defaultPassword}</td>
                            </tr>
                        </table>
                    </div>
                    <h3 style='color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-top: 30px;'>📚 Assigned Subjects</h3>
                    <div style='background: #eef2ff; padding: 15px; border-radius: 4px;'>
                        <ul class='step-list' style='padding-left: 20px;'>{$subjectsList}</ul>
                    </div>
                    <p class='center-text' style='margin-top: 30px; font-size: 15px;'><strong>Welcome to the GCA Family!</strong><br>We are excited to be part of your educational journey.</p>
                </div>
                <div class='footer'>
                    <span class='logo-text'>Gymnazo Christian Academy</span>
                    <p>Building Future Leaders with Christian Values</p>
                    <p>Contact: (02) 8123-4567 | registrar@gymnazo.edu</p>
                    <p style='margin-top: 15px; opacity: 0.8;'>© 2025 Gymnazo Christian Academy</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    // ==================== PLAIN TEXT VERSIONS ====================

    private function getAdmissionConfirmationPlainText($data)
    {
        return "GYMNAZO CHRISTIAN ACADEMY - Application Confirmation\n\nDear {$data['guardianName']},\n\nYour application has been received.\nTracking Number: {$data['trackingNumber']}\n\n© 2025 Gymnazo Christian Academy";
    }

    private function getScreeningNotificationPlainText($data)
    {
        return "GYMNAZO CHRISTIAN ACADEMY - Screening Stage\n\nDear {$data['guardianName']},\n\n{$data['studentName']}'s application is now in screening stage.\nPlease submit required documents and payment.\n\n© 2025 Gymnazo Christian Academy";
    }

    private function getApprovalNotificationPlainText($data)
    {
        return "GYMNAZO CHRISTIAN ACADEMY - Application Approved\n\nDear {$data['guardianName']},\n\nCongratulations! {$data['studentName']}'s application has been approved.\nWe will contact you for enrollment.\n\n© 2025 Gymnazo Christian Academy";
    }

    private function getEnrollmentConfirmationPlainText($data)
    {
        return "GYMNAZO CHRISTIAN ACADEMY - Enrollment Confirmed\n\nDear {$data['guardianName']},\n\n{$data['studentName']} is now officially enrolled!\n\nStudent Number: {$data['studentNumber']}\nEmail: {$data['emailAddress']}\nPassword: {$data['defaultPassword']}\n\nA QR code has been attached to this email. Please save it for school identification.\n\nPlease change your password upon first login.\n\n© 2025 Gymnazo Christian Academy";
    }
}
?>