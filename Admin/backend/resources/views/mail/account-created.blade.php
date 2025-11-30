<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gymnazo Account Created</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&display=swap" rel="stylesheet">
    <style>
        /* Reset styles for email clients */
        body, table, td, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        /* Main styles */
        body {
            font-family: 'Kumbh Sans', Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fefce8;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #facc15;
            padding: 30px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
        }
        .logo {
            color: #1c1917;
            font-size: 36px;
            font-weight: 800;
            margin: 0;
            position: relative;
            letter-spacing: -0.5px;
        }
        .logo-subtitle {
            color: #1c1917;
            font-size: 16px;
            margin: 5px 0 0;
            font-weight: 500;
            opacity: 0.8;
            position: relative;
        }
        .content {
            padding: 40px;
            color: #1c1917;
            line-height: 1.6;
        }
        .greeting {
            font-size: 20px;
            margin-bottom: 25px;
            font-weight: 600;
        }
        .message {
            margin-bottom: 30px;
            font-size: 16px;
        }
        .credentials {
            background-color: #fefce8;
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
            border: 1px solid #fef08a;
        }
        .credential-item {
            margin-bottom: 12px;
            display: flex;
        }
        .credential-label {
            font-weight: 600;
            color: #854d0e;
        }
        .credential-value {
            font-weight: 500;
            color: #1c1917;
        }
        .login-button {
            display: inline-block;
            background-color: #facc15;
            color: #1c1917;
            padding: 14px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            margin: 20px 0;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(250, 204, 21, 0.2);
        }
        .login-button:hover {
            background-color: #eab308;
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(250, 204, 21, 0.3);
        }
        .contact-info {
            margin-top: 35px;
            font-size: 15px;
            color: #57534e;
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 12px;
        }
        .contact-title {
            font-weight: 700;
            margin-bottom: 12px;
            color: #1c1917;
        }
        .contact-link {
            color: #ca8a04;
            text-decoration: none;
        }
        .contact-link:hover {
            text-decoration: underline;
        }
        .location-link {
            display: inline-flex;
            align-items: center;
            color: #ca8a04;
            text-decoration: none;
            margin-top: 8px;
            transition: color 0.3s ease;
        }
        .location-link:hover {
            color: #854d0e;
            text-decoration: underline;
        }
        .location-icon {
            width: 18px;
            height: 18px;
            margin-right: 8px;
            flex-shrink: 0;
        }
        .signature {
            margin-top: 30px;
            font-weight: 700;
            color: #1c1917;
        }
        .academy-name {
            font-size: 18px;
            margin-top: 5px;
            color: #854d0e;
        }
        .footer {
            background-color: #1c1917;
            padding: 25px;
            text-align: center;
            font-size: 13px;
            color: #d6d3d1;
        }
        .footer a {
            color: #facc15;
            text-decoration: none;
        }
        
        /* Responsive styles */
        @media screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                border-radius: 0;
            }
            .content {
                padding: 25px !important;
            }
            .credential-item {
                flex-direction: column;
            }
            .credential-label {
                min-width: auto;
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fefce8">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="container" cellpadding="0" cellspacing="0" border="0">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <h1 class="logo">Gymnazo</h1>
                            <p class="logo-subtitle">Education Management Platform</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="content">
                            <p class="greeting">Welcome to Gymnazo!</p>
                            
                            <p>Dear: <strong style="color: #854d0e;">{{ $user->profile->FirstName . ' ' . $user->profile->LastName}} </strong>,</p>
                            
                            <div class="message">
                                <p>We are excited to inform you that your Gymnazo account has been set up and is ready for use!</p>
                            </div>
                            
                            <div class="credentials">
                                <div class="credential-item">
                                    <span class="credential-label">Email:<span>
                                    <span class="credential-value">{{ $user->EmailAddress }}</span>
                                </div>
                                <div class="credential-item">
                                    <span class="credential-label">Password:</span>
                                    <span class="credential-value">{{ $password }}</span>
                                </div>
                                <div>
                                    <p>
                                        <strong>Important:</strong> For security reasons, we recommend that you change your password after your first login.
                                    </p>
                                </div>
                            </div>
                            
                            <p style="text-align: center;">
                                <a href="#" class="login-button">Access Gymnazo Portal</a>
                            </p>
                            
                            <div class="contact-info">
                                <p class="contact-title">Need Assistance?</p>
                                <p>If you encounter any issues please contact us at:</p>
                                <p>Our website: <a href="#" class="contact-link">[website URL]</a></p>
                                <p>Email: <a href="mailto:gymnazochristian.acad.novaliches@gmail.com" class="contact-link">gymnazochristian.acad.novaliches@gmail.com</a></p>
                                <p>Visit us at: 
                                    <a href="https://www.google.com/maps/place/Gymnazo+Chrisian+Academy/@14.7095717,121.0490383,3a,75y,344.29h,93.39t/data=!3m7!1e1!3m5!1s87D7KdeCXgyQQ10es9JCQQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-3.389355618721609%26panoid%3D87D7KdeCXgyQQ10es9JCQQ%26yaw%3D344.28791889107043!7i16384!8i8192!4m14!1m7!3m6!1s0x3397b0eecbdcb337:0xb487715c3abe405a!2sGymnazo+Chrisian+Academy!8m2!3d14.7096566!4d121.0490264!16s%2Fg%2F11fkt52ptj!3m5!1s0x3397b0eecbdcb337:0xb487715c3abe405a!8m2!3d14.7096566!4d121.0490264!16s%2Fg%2F11fkt52ptj?entry=ttu&g_ep=EgoyMDI1MTAyNy4wIKXMDSoASAFQAw%3D%3D" target="_blank" class="location-link">
                                        <svg class="location-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M12 12q.825 0 1.413-.587T14 10t-.587-1.412T12 8t-1.412.588T10 10t.588 1.413T12 12m0 10q-4.025-3.425-6.012-6.362T4 10.2q0-3.75 2.413-5.975T12 2t5.588 2.225T20 10.2q0 2.5-1.987 5.438T12 22"/>
                                        </svg>
                                        F. Calderon, Novaliches, Quezon City, Metro Manila
                                    </a>
                                </p>
                            </div>
                            
                            <div class="signature">
                                <p>Best regards,</p>
                                <p class="academy-name">Gymnazo Christian Academy - Novaliches</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <p>&copy; 2025 Gymnazo Christian Academy - Novaliches. All rights reserved.</p>
                            <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>