# Guard System - User Guide

## Overview
The Guard System is responsible for monitoring student attendance through QR code scanning at entry and exit points, tracking emergency dismissals, and managing gate access control.

---

## System Requirements

### Hardware
- QR Code Scanner or Camera-enabled device
- Computer/Tablet with web browser
- Internet connection

### Software
- Modern web browser (Chrome, Firefox, Edge)
- XAMPP (Apache, MySQL, PHP 8.x)
- Node.js (for development)

---

## Getting Started

### 1. System Access

**Login URL:** `http://localhost:5177/guard` or `http://localhost/SMS-GCA-3H/Guard/frontend/`

**Default Credentials:**
- Username: `guard` (provided by admin)
- Password: (set by admin)

### 2. First Time Setup

1. Launch XAMPP Control Panel
2. Start Apache and MySQL services
3. Open browser and navigate to login URL
4. Enter your credentials
5. System will redirect to Guard Dashboard

---

## Features & Usage

### 1. QR Code Attendance Scanning

**Purpose:** Track student entry and exit times

**Steps:**
1. Click **"Scan QR Code"** button on dashboard
2. Allow camera access when prompted
3. Position student's QR code in front of camera
4. System automatically:
   - Records attendance
   - Shows student information
   - Displays timestamp
   - Plays confirmation sound/animation

**Student Information Displayed:**
- Student Name
- Grade Level & Section
- Student Number
- Photo
- Current Status (IN/OUT)
- Last Scan Time

### 2. Manual Attendance Entry

**When to Use:** QR scanner malfunction or lost student ID

**Steps:**
1. Click **"Manual Entry"** button
2. Enter Student Number
3. Select Time In/Out
4. Add optional notes
5. Click **"Submit"**

### 3. Emergency Dismissal Monitoring

**Purpose:** Track early dismissals sent by teachers

**View Emergency Dismissals:**
1. Navigate to **"Emergency Dismissal"** page
2. View list of students authorized for early release
3. Check:
   - Student Name
   - Teacher who authorized
   - Dismissal Time
   - Reason
   - Status (Pending/Released)

**Process Dismissal:**
1. Verify student identity
2. Scan QR code or click student name
3. Mark as **"Released"**
4. System updates timestamp

### 4. Attendance Reports

**Daily Report:**
1. Go to **"Reports"** → **"Daily Attendance"**
2. Select date
3. View:
   - Total students present
   - Time In/Out records
   - Late arrivals
   - Early departures

**Export Options:**
- PDF Download
- Excel Export
- Print Report

### 5. Search & Filter

**Search Students:**
1. Use search bar at top
2. Enter: Name, Student Number, or Section
3. Results update in real-time

**Filter Options:**
- By Grade Level
- By Section
- By Status (IN/OUT)
- By Time Range

---

## Dashboard Overview

### Main Dashboard Components

**1. Today's Statistics**
- Total Scans Today
- Students Currently Inside
- Late Arrivals
- Emergency Dismissals

**2. Recent Activity**
- Last 10 scan records
- Timestamp
- Student info
- Status

**3. Quick Actions**
- Scan QR Code
- Manual Entry
- View Emergency Dismissals
- Generate Report

**4. Alerts**
- Duplicate scans
- System errors
- Emergency notifications

---

## Troubleshooting

### Camera Issues

**Problem:** Camera not working
**Solutions:**
1. Check browser permissions
   - Click padlock icon in address bar
   - Allow camera access
2. Refresh page (F5)
3. Try different browser
4. Check if camera is being used by another app
5. Restart browser

**Problem:** QR code not scanning
**Solutions:**
1. Ensure good lighting
2. Hold code steady
3. Check code isn't damaged
4. Try manual entry as alternative

### Attendance Recording Issues

**Problem:** Duplicate scans showing
**Solutions:**
1. Check if student actually scanned twice
2. Verify time difference is significant
3. Delete duplicate if error (requires admin)

**Problem:** Student not found
**Solutions:**
1. Verify student number is correct
2. Check if student is registered in system
3. Contact registrar to add student
4. Use manual entry with notes

**Problem:** Time not recording correctly
**Solutions:**
1. Check server time settings
2. Verify computer clock is correct
3. Contact IT support to sync server time

### Connection Issues

**Problem:** "Cannot connect to server"
**Solutions:**
1. Check XAMPP Apache is running
2. Check XAMPP MySQL is running
3. Verify network connection
4. Check if backend server is accessible
5. Clear browser cache (Ctrl+Shift+Delete)
6. Restart Apache in XAMPP

**Problem:** "Session expired" error
**Solutions:**
1. Login again
2. If persists, clear cookies
3. Check if session timeout is too short (contact admin)

### Data Not Showing

**Problem:** Reports are empty
**Solutions:**
1. Verify date range is correct
2. Check if any scans were recorded that day
3. Try refreshing page
4. Check database connection
5. Contact admin if data is missing

**Problem:** Student photos not loading
**Solutions:**
1. Check internet connection
2. Clear browser cache
3. Verify image files exist on server
4. Contact admin to re-upload photos

---

## Best Practices

### Daily Operations

1. **Start of Day:**
   - Login 15 minutes before school starts
   - Test QR scanner
   - Check for emergency dismissal notifications

2. **During School Hours:**
   - Monitor dashboard for alerts
   - Process emergency dismissals promptly
   - Keep scanner clean and ready

3. **End of Day:**
   - Ensure all students scanned out
   - Review daily report
   - Report any issues to admin

### Security

1. **Never share login credentials**
2. **Lock screen when leaving post**
3. **Verify student identity visually**
4. **Report suspicious activity**
5. **Logout when shift ends**

### Record Keeping

1. **Note any manual entries made**
2. **Document scanner issues**
3. **Keep log of emergency dismissals**
4. **Report discrepancies immediately**

---

## Common Tasks Quick Reference

| Task | Steps |
|------|-------|
| Scan student IN | Click Scan → Position QR code → Auto-records |
| Scan student OUT | Same as IN (system detects direction) |
| Manual entry | Manual Entry → Enter Student# → Select IN/OUT → Submit |
| Check if student is inside | Search student → View status |
| Process emergency dismissal | Emergency Dismissals → Find student → Mark Released |
| Generate daily report | Reports → Daily → Select date → Download |
| Search student | Type in search bar → View results |

---

## Error Messages & Solutions

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "Student already scanned in" | Duplicate entry attempt | Verify if student needs to scan again |
| "Invalid QR code" | Code not recognized | Check if code is from this school |
| "Database error" | Connection issue | Check XAMPP MySQL, contact admin |
| "Unauthorized access" | Not logged in | Login again |
| "Session timeout" | Inactive too long | Login again |
| "Camera permission denied" | Browser blocked camera | Allow camera in browser settings |

---

## Contact & Support

**For Technical Issues:**
- IT Support: Contact school IT department
- Admin Panel: Request admin assistance

**For Student Record Issues:**
- Registrar Office
- School Administration

**Emergency Contacts:**
- School Office: [Phone number]
- Security Supervisor: [Phone number]

---

## System Maintenance

**Guard users should NOT attempt:**
- Database modifications
- System configuration changes
- User account creation
- Software updates

**Contact admin for:**
- Password reset
- Permission changes
- System errors
- Data corrections

---

## Keyboard Shortcuts

- `Ctrl + S` - Open Scanner
- `Ctrl + M` - Manual Entry
- `Ctrl + R` - Refresh Dashboard
- `Ctrl + F` - Focus Search
- `Esc` - Close Modal

---

## Version Information

**Current Version:** 1.0.0
**Last Updated:** December 2025
**System:** Guard Attendance Management

---

## Appendix

### QR Code Format
- Standard: QR Code 2D barcode
- Content: Student Number + School ID
- Size: Minimum 2cm x 2cm for reliable scanning

### Data Privacy
- All attendance data is confidential
- Follow school privacy policies
- Report data breaches immediately

### Backup Procedures
- System auto-backs up every 24 hours
- Contact admin for manual backup
- Report data loss immediately
