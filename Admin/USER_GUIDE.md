# Admin System - User Guide

## Overview
The Admin System is the central control panel for managing the entire School Management System. Administrators can manage users, configure system settings, set academic calendars, manage grading deadlines, generate reports, and oversee all subsystems.

---

## System Requirements

### Software
- Modern web browser (Chrome, Firefox, Edge recommended)
- XAMPP (Apache, MySQL, PHP 8.x)
- Node.js (for development)
- Internet connection

---

## Getting Started

### 1. System Access

**Login URL:** `http://localhost:5173/` or `http://localhost/SMS-GCA-3H/Admin/frontend/`

**Default Admin Credentials:**
- Username: `admin` (or provided by system administrator)
- Password: (set during initial setup)

### 2. Dashboard Overview

After login, the admin dashboard displays:
- **System Statistics**
  - Total Users (Students, Teachers, Staff)
  - Active School Year
  - Current Quarter
  - System Status
- **Quick Actions**
  - User Management
  - School Year Setup
  - Grade Deadline Management
  - System Configuration
- **Recent Activity**
  - User logins
  - System changes
  - Critical alerts
- **Alerts & Notifications**
  - Pending approvals
  - System warnings
  - Important updates

---

## Core Features

### 1. User Management

#### View All Users

**Access:**
1. Click **"User Management"** in sidebar
2. View tabs:
   - Students
   - Teachers
   - Registrar Staff
   - Guard Staff
   - Admins

**User List Shows:**
- User ID
- Full Name
- Email
- Role/Position
- Status (Active/Inactive)
- Last Login
- Actions

#### Add New User

**Add Teacher:**
1. Go to **User Management** → **Teachers**
2. Click **"Add New Teacher"** button
3. Fill in required information:
   - Employee ID
   - First Name, Last Name
   - Email Address
   - Phone Number
   - Department
   - Position
   - Date Hired
4. Set initial password
5. Assign permissions
6. Click **"Create Account"**

**Add Student:**
1. Go to **User Management** → **Students**
2. Click **"Add New Student"**
3. Enter student details:
   - Student Number
   - Name (First, Middle, Last)
   - Birthdate
   - Grade Level
   - Section
   - Parent/Guardian Information
   - Contact Details
   - Emergency Contact
4. Upload photo (optional)
5. Set initial password
6. Click **"Enroll Student"**

**Add Staff (Guard/Registrar):**
1. Select appropriate tab
2. Click **"Add New [Role]"**
3. Fill in personal details
4. Set credentials
5. Assign specific permissions
6. Click **"Create Account"**

#### Edit User Information

1. Find user in list
2. Click **"Edit"** icon
3. Modify information:
   - Personal details
   - Contact information
   - Role/permissions
   - Status (Active/Inactive)
4. Click **"Save Changes"**

#### Delete/Deactivate User

**Deactivate (Recommended):**
1. Click **"Edit"** on user
2. Change status to **"Inactive"**
3. Saves data for records

**Permanent Delete:**
1. Click **"Delete"** icon
2. Confirm deletion warning
3. User and related data removed

**⚠️ Warning:** Deleting users is permanent and removes all associated records

#### Reset User Password

1. Find user in list
2. Click **"Reset Password"** icon
3. Choose method:
   - Auto-generate and email
   - Set specific password
4. User receives notification
5. Confirm reset

---

### 2. School Year Management

#### View School Years

**Access:**
1. Go to **School Year Management**
2. View all academic years:
   - School Year (e.g., 2024-2025)
   - Start Date
   - End Date
   - Status (Active/Inactive/Completed)
   - Quarters configuration

#### Create New School Year

**Steps:**
1. Click **"Add New School Year"**
2. Enter:
   - School Year (format: YYYY-YYYY)
   - Start Date
   - End Date
3. Configure quarters:
   - **1st Quarter:** Start and End dates
   - **2nd Quarter:** Start and End dates
   - **3rd Quarter:** Start and End dates
   - **4th Quarter:** Start and End dates
4. Set as **Active** (only one active at a time)
5. Click **"Create"**

**Important:**
- Only ONE school year can be active
- Activating new year deactivates previous
- All quarters must have valid date ranges

#### Edit School Year

1. Click **"Edit"** on school year
2. Modify:
   - Dates
   - Quarter periods
   - Status
3. Click **"Update"**

**Note:** Cannot edit active school year with existing data without admin approval

#### Activate/Deactivate School Year

**Activate:**
1. Find school year
2. Click **"Set as Active"**
3. Confirm (this deactivates other years)
4. System updates all modules

**Deactivate:**
1. Click **"Deactivate"**
2. Confirm action
3. No school year will be active (emergency only)

---

### 3. Grade Submission Deadline Management

#### View Grading Deadlines

**Access:**
1. Go to **Grading Deadlines**
2. View all deadlines:
   - School Year
   - Quarter
   - Start Date (when grading opens)
   - Deadline Date (when grading closes)
   - Status (Active/Upcoming/Expired)
   - Created By

#### Set New Grading Deadline

**When to Set:**
- Before each quarter ends
- When teachers need to submit grades

**Steps:**
1. Click **"Set New Deadline"**
2. Select:
   - School Year (usually current active year)
   - Quarter (Q1, Q2, Q3, Q4)
3. Set dates:
   - **Start Date:** When teachers can start inputting grades
   - **Deadline Date:** Last day to submit grades
4. Add optional notes/instructions
5. Click **"Create Deadline"**

**What Happens:**
- Teachers receive notification
- "Input Grade" button enables on Start Date
- Button disables after Deadline Date
- Registrar can track submissions

**Important Rules:**
- Cannot set deadline for past quarters
- Only one deadline per quarter per school year
- Start Date must be before Deadline Date
- Deadline should be reasonable (usually 1-2 weeks)

#### Edit Grading Deadline

**Access:**
1. Find deadline in list
2. Click **"Edit"** icon
3. Modify:
   - Start Date
   - Deadline Date
   - Notes
4. Click **"Update"**

**⚠️ Warning:** Changing dates affects all teachers

#### Delete Grading Deadline

1. Click **"Delete"** icon
2. Confirm deletion
3. This will **disable** teacher grade input

**Use Cases:**
- Deadline set incorrectly
- Quarter needs to be rescheduled
- Emergency system maintenance

---

### 4. Section Management

#### View Sections

**Access:**
1. Go to **Section Management**
2. View all sections by:
   - Grade Level (Grade 7-12)
   - Section Name
   - Adviser
   - Number of Students
   - Status (Pending/Approved)

#### Create New Section

**Steps:**
1. Click **"Add New Section"**
2. Enter:
   - Grade Level (7, 8, 9, 10, 11, 12)
   - Section Name (e.g., "Einstein", "Newton", "A", "B")
   - School Year
3. Assign:
   - Section Adviser (teacher)
   - Room Number
   - Maximum Capacity
4. Set Status:
   - **Pending:** Awaiting approval
   - **Approved:** Active and operational
5. Click **"Create Section"**

#### Approve Section

**Why Approval Needed:**
- Quality control
- Verify adviser assignment
- Ensure room availability
- Check student capacity

**Steps:**
1. Find section with "Pending" status
2. Click **"Approve"** button
3. Verify details are correct
4. Confirm approval

**What Happens:**
- Section becomes active
- Teachers can request emergency dismissals
- Students can be enrolled
- Appears in all relevant modules

#### Edit Section

1. Click **"Edit"** on section
2. Modify:
   - Section name
   - Adviser
   - Room number
   - Capacity
   - Status
3. Click **"Save"**

#### Delete Section

1. Click **"Delete"** icon
2. Confirm deletion
3. **Warning:** Only delete empty sections (no students enrolled)

---

### 5. Subject Management

#### View Subjects

**Access:**
1. Go to **Curriculum** → **Subjects**
2. View subjects by:
   - Grade Level
   - Subject Code
   - Subject Name
   - Type (Core/Elective)
   - Units/Hours

#### Add New Subject

**Steps:**
1. Click **"Add Subject"**
2. Enter:
   - Subject Code (e.g., MATH7, ENG8)
   - Subject Name
   - Grade Level
   - Subject Type (Core/Elective)
   - Units
   - Hours per week
3. Add description
4. Click **"Create"**

#### Assign Subject to Teacher

**Steps:**
1. Go to **Subject Assignment**
2. Select teacher
3. Choose subject(s)
4. Assign section(s)
5. Set schedule
6. Click **"Assign"**

---

### 6. System Configuration

#### General Settings

**Access:** Settings → General

**Configurable Options:**
- School Name
- School Logo
- School Year Format
- Contact Information
- System Email
- Timezone

**Steps:**
1. Click **"Edit"** on any setting
2. Modify value
3. Click **"Save"**
4. Changes apply system-wide

#### Email Configuration

**Access:** Settings → Email

**Setup:**
1. Enter SMTP details:
   - Server (e.g., smtp.gmail.com)
   - Port (usually 587)
   - Username
   - Password
2. Enable SSL/TLS
3. Test connection
4. Save configuration

#### Security Settings

**Access:** Settings → Security

**Options:**
- Session timeout duration
- Password requirements:
  - Minimum length
  - Require uppercase
  - Require numbers
  - Require special characters
- Login attempt limits
- IP whitelisting (advanced)

#### Backup Settings

**Access:** Settings → Backup

**Configure:**
- Automatic backup schedule
- Backup retention period
- Backup location
- Email notifications

**Manual Backup:**
1. Click **"Create Backup Now"**
2. Wait for completion
3. Download backup file
4. Store securely

---

### 7. Reports & Analytics

#### System Reports

**Available Reports:**

**1. User Activity Report**
- Login history
- Active users
- Inactive accounts
- Role distribution

**2. Academic Report**
- Enrollment statistics
- Grade distribution
- Pass/fail rates
- Honor students

**3. Attendance Report**
- Daily attendance rates
- Absence patterns
- Late arrivals
- By grade level/section

**4. Grade Submission Report**
- Teachers who submitted
- Pending submissions
- Late submissions
- Completion rate

**Generate Report:**
1. Select report type
2. Choose filters:
   - Date range
   - School year
   - Quarter
   - Grade level/section
   - User role
3. Click **"Generate"**
4. View report
5. Export as PDF/Excel

#### Analytics Dashboard

**Access:** Reports → Analytics

**Metrics Displayed:**
- User growth trends
- System usage statistics
- Peak activity times
- Performance metrics
- Error rates

**Visualizations:**
- Line graphs
- Bar charts
- Pie charts
- Heat maps

---

### 8. Announcements Management

#### Create Announcement

**Access:**
1. Go to **Announcements**
2. Click **"Create Announcement"**

**Steps:**
1. Enter title
2. Write message content
3. Select recipients:
   - All Users
   - Students Only
   - Teachers Only
   - Specific Grade Levels
   - Specific Sections
4. Set:
   - Priority (High/Normal/Low)
   - Expiration date
   - Visibility (Public/Private)
5. Attach files (optional)
6. Click **"Publish"**

**What Happens:**
- Recipients see notification
- Announcement appears in their dashboard
- Email sent (if enabled)

#### Manage Announcements

**View:**
- All announcements
- Active/Expired
- By priority

**Edit:**
1. Click announcement
2. Click **"Edit"**
3. Modify content
4. Save changes

**Delete:**
1. Select announcement
2. Click **"Delete"**
3. Confirm removal

---

### 9. System Logs & Monitoring

#### View System Logs

**Access:** Settings → System Logs

**Log Types:**
- **Activity Logs:** User actions
- **Error Logs:** System errors
- **Security Logs:** Login attempts, unauthorized access
- **Database Logs:** Query logs (advanced)

**Filter Logs:**
1. Select log type
2. Choose date range
3. Filter by user/action
4. Search keywords
5. View results

**Export Logs:**
- Download as CSV
- Email to administrator
- Generate PDF report

#### System Health Monitoring

**Access:** Settings → System Health

**Monitors:**
- Database connection status
- Server response time
- Storage usage
- Memory usage
- Active sessions
- API response times

**Alerts:**
- Email notification for critical issues
- Dashboard warnings
- SMS alerts (if configured)

---

## Troubleshooting

### Login & Access Issues

**Problem:** Cannot login as admin
**Solutions:**
1. Verify username and password
2. Check Caps Lock
3. Reset password using database backup
4. Contact system administrator
5. Check if account is active

**Problem:** "Access denied" error
**Solutions:**
1. Verify you have admin role
2. Check permissions in database
3. Clear browser cache
4. Login with different browser
5. Contact higher-level admin

### User Management Issues

**Problem:** Cannot create new user
**Solutions:**
1. Check if email already exists
2. Verify all required fields filled
3. Check database connection
4. Ensure unique Student ID/Employee ID
5. Check for special characters in fields

**Problem:** Password reset not working
**Solutions:**
1. Verify email configuration
2. Check spam folder
3. Use manual password set option
4. Check user email is valid
5. Test SMTP connection

### School Year Issues

**Problem:** Cannot activate school year
**Solutions:**
1. Check if another year is active (deactivate first)
2. Verify dates don't overlap
3. Ensure quarters are configured
4. Check for database errors
5. Verify date format is correct

**Problem:** Quarters not showing correctly
**Solutions:**
1. Edit school year
2. Verify quarter start/end dates
3. Ensure dates are sequential
4. Check for date conflicts
5. Save changes and refresh

### Grading Deadline Issues

**Problem:** Teachers report deadline not working
**Solutions:**
1. Verify deadline is set for correct quarter
2. Check Start Date is not in future
3. Confirm School Year ID matches active year
4. Check deadline hasn't expired
5. Verify Quarter name matches exactly

**Problem:** Cannot set deadline
**Solutions:**
1. Ensure school year is active
2. Check if deadline already exists for that quarter
3. Verify Start Date < Deadline Date
4. Check database connection
5. Try different browser

### Section Management Issues

**Problem:** Section not appearing in teacher view
**Solutions:**
1. Verify section status is "Approved"
2. Check school year matches active year
3. Ensure teacher is assigned
4. Refresh teacher dashboard
5. Check database for section entry

**Problem:** Cannot approve section
**Solutions:**
1. Verify all required fields filled
2. Check if adviser is valid teacher
3. Ensure room number doesn't conflict
4. Check database constraints
5. Try editing then approving

### Report Generation Issues

**Problem:** Reports are empty
**Solutions:**
1. Verify date range is correct
2. Check if data exists for selected period
3. Ensure filters aren't too restrictive
4. Check database connection
5. Try generating different report type

**Problem:** Cannot export report
**Solutions:**
1. Check popup blocker settings
2. Ensure sufficient disk space
3. Try different export format (PDF/Excel)
4. Clear browser cache
5. Use different browser

### System Configuration Issues

**Problem:** Email notifications not sending
**Solutions:**
1. Verify SMTP configuration
2. Test email connection
3. Check firewall settings
4. Verify credentials are correct
5. Check if service allows less secure apps

**Problem:** Settings not saving
**Solutions:**
1. Check database write permissions
2. Verify input values are valid
3. Look for JavaScript errors (F12 console)
4. Try clearing browser cache
5. Check server error logs

---

## Best Practices

### Daily Administrative Tasks

**Morning Routine:**
1. Login and check dashboard
2. Review system alerts
3. Check pending approvals
4. Monitor system health
5. Review recent activity logs

**Throughout Day:**
1. Respond to user support requests
2. Approve pending items promptly
3. Monitor system performance
4. Review and respond to notifications

**End of Day:**
1. Check for critical alerts
2. Review day's activity logs
3. Verify backup completed
4. Plan next day's tasks

### Security Best Practices

1. **Use strong admin password**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Change regularly (every 90 days)

2. **Protect admin credentials**
   - Never share password
   - Don't save in browser
   - Use password manager
   - Enable 2FA if available

3. **Monitor access**
   - Review login logs weekly
   - Check for suspicious activity
   - Investigate failed login attempts
   - Disable inactive accounts

4. **Regular audits**
   - Review user permissions monthly
   - Verify active users quarterly
   - Check system logs weekly
   - Update security settings as needed

### Data Management

1. **Regular Backups**
   - Daily automatic backups
   - Weekly manual verification
   - Monthly offsite backup
   - Test restore procedure quarterly

2. **Data Integrity**
   - Verify user data accuracy
   - Check for duplicate records
   - Validate grade submissions
   - Audit attendance records

3. **Privacy Compliance**
   - Follow data protection policies
   - Handle student data securely
   - Limit access to sensitive information
   - Document data handling procedures

### User Support

1. **Respond promptly** to user issues
2. **Document** common problems and solutions
3. **Train** users on system features
4. **Communicate** system updates clearly
5. **Gather feedback** for improvements

---

## Common Administrative Tasks

### Start of School Year

**Checklist:**
- [ ] Create new school year
- [ ] Configure quarters
- [ ] Set as active
- [ ] Create sections for all grade levels
- [ ] Approve sections
- [ ] Assign teachers to sections
- [ ] Enroll students
- [ ] Set up subjects for each grade
- [ ] Configure grading deadlines
- [ ] Send announcement to all users
- [ ] Verify all systems operational

### End of Quarter

**Checklist:**
- [ ] Set grading deadline for quarter
- [ ] Notify teachers of deadline
- [ ] Monitor grade submissions
- [ ] Follow up with teachers who haven't submitted
- [ ] Generate grade submission report
- [ ] Verify all grades submitted
- [ ] Close grading period
- [ ] Generate quarter reports
- [ ] Backup data

### Monthly Maintenance

**Checklist:**
- [ ] Review system logs
- [ ] Check user activity
- [ ] Deactivate inactive accounts
- [ ] Verify backups are working
- [ ] Update system if needed
- [ ] Review and respond to feedback
- [ ] Check storage usage
- [ ] Test system performance

---

## Quick Reference Table

| Task | Navigation | Key Action |
|------|-----------|-----------|
| Add user | User Management → Role Tab → Add New | Fill form, set password |
| Set grading deadline | Grading Deadlines → Set New Deadline | Select quarter, set dates |
| Approve section | Section Management → Find Section → Approve | Click approve button |
| Create school year | School Year Management → Add New | Enter dates, configure quarters |
| Generate report | Reports → Select Type → Generate | Choose filters, export |
| Create announcement | Announcements → Create | Write message, select recipients |
| Backup database | Settings → Backup → Create Now | Wait, download file |
| Reset password | User Management → Find User → Reset | Auto-generate or set manually |
| View logs | Settings → System Logs → Select Type | Filter, search, export |

---

## Error Messages & Solutions

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "School year already active" | Another year is active | Deactivate current year first |
| "Deadline already exists for this quarter" | Duplicate deadline | Edit existing or delete first |
| "Cannot delete user with existing data" | User has records | Deactivate instead of delete |
| "Invalid date range" | End date before start date | Check dates are logical |
| "Email already exists" | Duplicate email | Use unique email address |
| "Database connection failed" | MySQL not running | Start MySQL in XAMPP |
| "Permission denied" | Insufficient privileges | Login as super admin |
| "Session expired" | Inactive too long | Login again |
| "Section not approved" | Pending status | Approve section first |

---

## Keyboard Shortcuts

- `Ctrl + D` - Dashboard
- `Ctrl + U` - User Management
- `Ctrl + S` - System Settings
- `Ctrl + R` - Reports
- `Ctrl + L` - System Logs
- `Ctrl + ,` - Settings
- `F5` - Refresh Page

---

## Contact & Support

**System Administrator:**
- Email: [System Admin Email]
- Phone: [Phone Number]

**Technical Support:**
- IT Department
- Help Desk: Submit ticket

**Vendor Support:**
- [Vendor Contact Information]

---

## Version Information

**Current Version:** 1.0.0
**Last Updated:** December 2025
**System:** School Management System - Admin Panel

---

## Appendix

### Database Information

**Tables Used:**
- `users` - User accounts
- `schoolyears` - Academic years
- `gradesubmissiondeadline` - Grading deadlines
- `sections` - Class sections
- `subjects` - Curriculum subjects
- `attendance` - Attendance records
- `grades` - Student grades

### API Endpoints (for developers)

**Base URL:** `http://localhost/SMS-GCA-3H/Admin/backend/api/`

**Common Endpoints:**
- `/users` - User management
- `/schoolyear` - School year operations
- `/deadline` - Grading deadlines
- `/sections` - Section management
- `/reports` - Report generation

### Permissions Matrix

| Role | User Mgmt | School Year | Deadlines | Sections | Reports | Settings |
|------|-----------|-------------|-----------|----------|---------|----------|
| Super Admin | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Admin | ✅ View/Edit | ✅ View/Edit | ✅ Create/Edit | ✅ Approve | ✅ View | ❌ Limited |
| Staff | ✅ View Only | ✅ View | ❌ No | ❌ No | ✅ View | ❌ No |

### System Requirements

**Server:**
- PHP 8.0 or higher
- MySQL 5.7 or higher
- Apache 2.4 or higher
- 4GB RAM minimum
- 20GB storage

**Client:**
- Modern browser (Chrome 90+, Firefox 88+, Edge 90+)
- 1920x1080 resolution recommended
- Stable internet connection

---

**Last Reviewed:** December 2025  
**Document Version:** 1.0
