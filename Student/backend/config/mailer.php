<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

class Mailer
{
    private $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer(true);

        try {
            // Server settings
            $this->mail->isSMTP();
            $this->mail->Host       = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
            $this->mail->SMTPAuth   = true;
            $this->mail->Username   = getenv('SMTP_USERNAME') ?: 'johnreybisnarcalipes@gmail.com'; // TODO: Change this
            $this->mail->Password   = getenv('SMTP_PASSWORD') ?: 'iljb mmag gmsl mvnk';     // TODO: Change this (use App Password)
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

    public function sendPasswordResetEmail($recipientEmail, $recipientName, $resetToken)
    {
        try {
            // Clear any previous recipients
            $this->mail->clearAddresses();
            $this->mail->addAddress($recipientEmail, $recipientName);

            $this->mail->isHTML(true);
            $this->mail->Subject = 'Password Reset Request - Gymnazo Christian Academy';

            // Update this URL to match frontend URL
            $baseUrl = getenv('APP_URL') ?: 'http://localhost:5173';
            $resetLink = $baseUrl . '/reset-password?token=' . $resetToken;

            $this->mail->Body = $this->getPasswordResetTemplate($recipientName, $resetLink);
            $this->mail->AltBody = "Hello {$recipientName},\n\nYou requested to reset your password. Click the link below to reset it:\n\n{$resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.";

            $this->mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Password reset email error: " . $this->mail->ErrorInfo);
            return false;
        }
    }

    public function sendAdmissionConfirmation($recipientEmail, $applicationData)
    {
        try {
            $this->mail->clearAddresses();
            
            // Send to guardian email
            if (!empty($recipientEmail)) {
                $this->mail->addAddress($recipientEmail, $applicationData['guardianName']);
            }
            
            // Also send to student email if provided
            if (!empty($applicationData['studentEmail'])) {
                $this->mail->addAddress($applicationData['studentEmail'], $applicationData['studentName']);
            }

            $this->mail->isHTML(true);
            $this->mail->Subject = 'Admission Application Confirmation - Gymnazo Christian Academy';

            $this->mail->Body = $this->getAdmissionConfirmationTemplate($applicationData);
            $this->mail->AltBody = $this->getAdmissionConfirmationPlainText($applicationData);

            $this->mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Admission confirmation email error: " . $this->mail->ErrorInfo);
            return false;
        }
    }

    private function getPasswordResetTemplate($name, $resetLink)
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 30px; }
                .button { display: inline-block; padding: 12px 30px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Password Reset Request</h1>
                </div>
                <div class='content'>
                    <p>Hello <strong>{$name}</strong>,</p>
                    <p>You have requested to reset your password for your Gymnazo Christian Academy student account.</p>
                    <p>Click the button below to reset your password:</p>
                    <center>
                        <a href='{$resetLink}' class='button'>Reset Password</a>
                    </center>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    <p>If you didn't request this password reset, please ignore this email or contact the school office if you have concerns.</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2025 Gymnazo Christian Academy. All rights reserved.</p>
                    <p>This is an automated email, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    private function getAdmissionConfirmationTemplate($data)
    {
        $trackingNumber = $data['trackingNumber'];
        $studentName = $data['studentName'];
        $guardianName = $data['guardianName'];
        $gradeLevel = $data['gradeLevel'];
        $enrolleeType = $data['enrolleeType'];
        $submissionDate = $data['submissionDate'];
        $contactNumber = $data['contactNumber'];
        $address = $data['address'];
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
                .container { max-width: 650px; margin: 0 auto; background-color: white; }
                .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 40px 30px; }
                .tracking-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px; }
                .tracking-box h2 { margin: 0 0 10px 0; color: #d97706; font-size: 16px; }
                .tracking-number { font-size: 28px; font-weight: bold; color: #92400e; letter-spacing: 2px; }
                .info-section { margin: 30px 0; }
                .info-section h3 { color: #92400e; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; }
                .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
                .info-label { font-weight: bold; color: #6b7280; min-width: 180px; }
                .info-value { color: #111827; }
                .important-note { background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 4px; }
                .important-note h4 { margin: 0 0 10px 0; color: #dc2626; font-size: 14px; }
                .important-note ul { margin: 10px 0; padding-left: 20px; }
                .important-note li { margin: 5px 0; font-size: 13px; color: #7f1d1d; }
                .next-steps { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 4px; }
                .next-steps h3 { margin: 0 0 15px 0; color: #1e40af; font-size: 16px; }
                .next-steps ol { margin: 10px 0; padding-left: 20px; }
                .next-steps li { margin: 8px 0; font-size: 14px; color: #1e3a8a; }
                .footer { background-color: #1f2937; color: white; padding: 30px; text-align: center; }
                .footer p { margin: 5px 0; font-size: 13px; }
                .footer a { color: #fbbf24; text-decoration: none; }
                .divider { border-top: 2px solid #e5e7eb; margin: 30px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎓 Application Received!</h1>
                    <p>Thank you for applying to Gymnazo Christian Academy</p>
                </div>
                
                <div class='content'>
                    <p>Dear <strong>{$guardianName}</strong>,</p>
                    
                    <p>We are pleased to confirm that we have received the admission application for <strong>{$studentName}</strong>. Your application is now being reviewed by our admissions team.</p>
                    
                    <div class='tracking-box'>
                        <h2>📋 Your Tracking Number</h2>
                        <div class='tracking-number'>{$trackingNumber}</div>
                        <p style='margin: 10px 0 0 0; font-size: 13px; color: #78350f;'><strong>Important:</strong> Please save this number for tracking your application status.</p>
                    </div>
                    
                    <div class='info-section'>
                        <h3>📝 Application Summary</h3>
                        <div class='info-row'>
                            <div class='info-label'>Student Name:</div>
                            <div class='info-value'>{$studentName}</div>
                        </div>
                        <div class='info-row'>
                            <div class='info-label'>Guardian Name:</div>
                            <div class='info-value'>{$guardianName}</div>
                        </div>
                        <div class='info-row'>
                            <div class='info-label'>Applying for Grade:</div>
                            <div class='info-value'>{$gradeLevel}</div>
                        </div>
                        <div class='info-row'>
                            <div class='info-label'>Enrollee Type:</div>
                            <div class='info-value'>{$enrolleeType}</div>
                        </div>
                        <div class='info-row'>
                            <div class='info-label'>Contact Number:</div>
                            <div class='info-value'>{$contactNumber}</div>
                        </div>
                        <div class='info-row'>
                            <div class='info-label'>Address:</div>
                            <div class='info-value'>{$address}</div>
                        </div>
                        <div class='info-row'>
                            <div class='info-label'>Submission Date:</div>
                            <div class='info-value'>{$submissionDate}</div>
                        </div>
                    </div>
                    
                    <div class='next-steps'>
                        <h3>📌 What Happens Next?</h3>
                        <ol>
                            <li><strong>Application Review:</strong> Our admissions team will review your application and submitted documents within 3-5 business days.</li>
                            <li><strong>Document Verification:</strong> We will verify all required documents (Birth Certificate, Report Card, etc.) for completeness and authenticity.</li>
                            <li><strong>Status Update:</strong> You will receive email notifications about your application status. You can also track your application using your tracking number.</li>
                            <li><strong>Assessment (if required):</strong> For some grade levels, a basic assessment may be conducted to determine appropriate class placement.</li>
                            <li><strong>Final Decision:</strong> You will be notified of the final admission decision via email within 7-10 business days.</li>
                    </div>
                    
                    <div class='important-note'>
                        <h4>⚠️ Important Reminders</h4>
                        <ul>
                            <li>Please ensure all required documents are complete and submitted.</li>
                            <li>Check your email regularly for updates on your application status.</li>
                            <li>You can track your application status using your tracking number.</li>
                            <li>For urgent concerns, please contact our admissions office.</li>
                        </ul>
                    </div>
                    
                    <div class='divider'></div>
                    
                    <p style='text-align: center; color: #6b7280; font-size: 14px;'>
                        If you have any questions, please don't hesitate to contact us:<br>
                        <strong>Phone:</strong> (02) 8123-4567 | <strong>Email:</strong> admissions@gymnazo.edu<br>
                        <strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM
                    </p>
                </div>
                
                <div class='footer'>
                    <p><strong>Gymnazo Christian Academy</strong></p>
                    <p>Building Future Leaders with Christian Values</p>
                    <p style='margin-top: 15px; opacity: 0.8;'>© 2025 Gymnazo Christian Academy. All rights reserved.</p>
                    <p style='font-size: 11px; opacity: 0.7;'>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    private function getAdmissionConfirmationPlainText($data)
    {
        $trackingNumber = $data['trackingNumber'];
        $studentName = $data['studentName'];
        $guardianName = $data['guardianName'];
        $gradeLevel = $data['gradeLevel'];
        $enrolleeType = $data['enrolleeType'];
        $submissionDate = $data['submissionDate'];
        
        return "
GYMNAZO CHRISTIAN ACADEMY
Application Confirmation

Dear {$guardianName},

We are pleased to confirm that we have received the admission application for {$studentName}.

TRACKING NUMBER: {$trackingNumber}
(Please save this number for tracking your application status)

APPLICATION SUMMARY:
- Student Name: {$studentName}
- Guardian Name: {$guardianName}
- Applying for Grade: {$gradeLevel}
- Enrollee Type: {$enrolleeType}
- Submission Date: {$submissionDate}

WHAT HAPPENS NEXT?
1. Application Review: Our admissions team will review your application within 3-5 business days.
2. Status Update: You will receive email notifications about your application status.
3. Interview Schedule: If approved, we will contact you to schedule an interview.
4. Final Decision: You will be notified of the final admission decision via email.

IMPORTANT REMINDERS:
- Please ensure all required documents are complete and submitted.
- Check your email regularly for updates on your application status.
- You can track your application status using your tracking number.

For questions, contact us:
Phone: (02) 8123-4567
Email: admissions@gymnazo.edu
Office Hours: Monday - Friday, 8:00 AM - 5:00 PM

© 2025 Gymnazo Christian Academy. All rights reserved.
This is an automated email. Please do not reply to this message.
        ";
    }
}
?>
