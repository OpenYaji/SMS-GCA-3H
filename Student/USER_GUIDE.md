# Student System - User Guide

## Overview
The Student Portal provides students with access to their academic information, including grades, attendance records, class schedules, announcements, and personal profile management.

---

## System Requirements

### Software
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection
- Smartphone with camera (for QR code)

---

## Getting Started

### 1. System Access

**Login URL:** `http://localhost:5174/student` or `http://localhost/SMS-GCA-3H/Student/frontend/`

**Initial Login:**
- Username: Your Student Number
- Password: (provided by school registrar)

**First-Time Login:**
1. Enter student number and temporary password
2. System prompts for password change
3. Set new secure password
4. Update profile information
5. Upload profile picture

### 2. Dashboard Overview

Your dashboard displays:
- **Welcome Message** with your name
- **Today's Schedule** - Your classes for the day
- **Recent Grades** - Latest grade entries
- **Attendance Summary** - Your attendance rate
- **Announcements** - School news and updates
- **Quick Links** - Fast access to common features

---

## Core Features

### 1. My Grades

#### View Grades

**Access:**
1. Click **"My Grades"** in sidebar
2. Select school year and quarter

**Grades Display:**
- Subject name
- Written Work (WW) score
- Performance Task (PT) score
- Quarterly Exam (QE) score
- **Final Grade** (calculated)
- Grade description (e.g., "Outstanding", "Satisfactory")

**Grade Components Explained:**
- **Written Work (40%):** Tests, quizzes, assignments
- **Performance Task (40%):** Projects, presentations, performances
- **Quarterly Exam (20%):** End-of-quarter test

**Final Grade Calculation:**
```
Final Grade = (WW × 0.40) + (PT × 0.40) + (QE × 0.20)
```

#### View by Quarter

**Select Quarter:**
1. Use dropdown menu
2. Choose Q1, Q2, Q3, or Q4
3. Grades update automatically

**View All Quarters:**
1. Select "All Quarters"
2. See complete academic year overview

#### Grade Reports

**Generate Report:**
1. Go to **My Grades**
2. Click **"Generate Report"** button
3. Select:
   - School Year
   - Quarter or "All"
4. Click **"Download"**

**Report Formats:**
- PDF (for printing)
- Excel (for analysis)

**Report Shows:**
- All subjects
- Component scores
- Final grades
- Grade descriptions
- General average
- Class ranking (if available)

#### Understanding Your Grades

**Grade Scale (DepEd):**
- **96-100:** Outstanding
- **90-95:** Very Satisfactory
- **85-89:** Satisfactory
- **80-84:** Fairly Satisfactory
- **75-79:** Did Not Meet Expectations
- **Below 75:** Failed (needs remedial)

**General Average:**
- Average of all subject final grades
- Calculated automatically
- Shown at bottom of grade report

---

### 2. My Attendance

#### View Attendance Record

**Access:**
1. Click **"Attendance"** in sidebar
2. View attendance summary

**Summary Shows:**
- Total school days
- Days present
- Days absent
- Days late
- Days excused
- **Attendance Rate** (percentage)

#### Daily Attendance Details

**View by Date:**
1. Select date range
2. Click **"View Details"**
3. See daily records:
   - Date
   - Time In
   - Time Out
   - Status (Present/Absent/Late/Excused)
   - Remarks

**Filter Options:**
- By month
- By quarter
- By subject (if subject-specific)
- By status

#### Attendance Reports

**Generate Report:**
1. Go to **Attendance**
2. Click **"Download Report"**
3. Select period
4. Download PDF or Excel

**Report Includes:**
- Total days attended
- Absence breakdown
- Late arrival count
- Attendance percentage
- Monthly breakdown
- Parent/guardian signature section

#### QR Code for Attendance

**Your QR Code:**
1. Go to **Profile** → **My QR Code**
2. View your unique QR code
3. Options:
   - Display on screen for scanning
   - Print as card
   - Download as image
   - Share via email

**Using QR Code:**
- Present to guard when entering school
- Scan at gate for automatic attendance
- Keep code visible and clean
- Don't share your QR code

**Lost QR Code:**
1. Report to registrar immediately
2. Request new QR code
3. Old code will be deactivated
4. Use manual entry until new code issued

---

### 3. My Schedule

#### View Class Schedule

**Access:**
1. Click **"My Schedule"** in sidebar
2. View weekly timetable

**Schedule Shows:**
- **Day and Time**
- **Subject**
- **Teacher Name**
- **Room Number**
- **Section**

**View Options:**
- **Weekly View:** See entire week
- **Daily View:** Focus on today
- **List View:** All classes listed

#### Print Schedule

**Steps:**
1. Click **"Print Schedule"**
2. Choose format:
   - Weekly calendar
   - Simple list
3. Print or save as PDF

#### Export Schedule

**Download Options:**
- PDF format
- Excel spreadsheet
- iCalendar (.ics) - Import to phone calendar

**Sync with Phone:**
1. Download .ics file
2. Open on smartphone
3. Import to calendar app
4. Receive class reminders

---

### 4. Announcements

#### View Announcements

**Access:**
1. Click **"Announcements"** in sidebar
2. See all school announcements

**Announcement Details:**
- Title
- Message/Content
- Posted by (Admin/Teacher)
- Date posted
- Priority (High/Normal)
- Attachments (if any)

**Features:**
- **Mark as Read:** Track which you've seen
- **Search:** Find specific announcements
- **Filter:** By date, priority, category
- **Notifications:** Get alerts for new posts

#### Important Announcements

**High Priority:**
- Highlighted in red
- Show at top of list
- Push notification sent
- May require acknowledgment

**Categories:**
- Academic (exams, deadlines)
- Events (programs, activities)
- Administrative (policy changes)
- Emergency (urgent notifications)

#### Download Attachments

**If Announcement Has Attachments:**
1. Click announcement
2. View attachment list
3. Click **"Download"** on file
4. Save to your device

**Attachment Types:**
- PDF documents
- Images
- Forms
- Schedules

---

### 5. Profile Management

#### View Profile

**Access:**
1. Click **"Profile"** in sidebar or click your name/photo
2. View your information:
   - Student Number
   - Full Name
   - Grade Level & Section
   - Email Address
   - Phone Number
   - Address
   - Parent/Guardian Info
   - Emergency Contact
   - Profile Picture

#### Edit Profile

**Editable Fields:**
- Profile Picture
- Email Address (personal)
- Phone Number
- Address
- Emergency Contact

**Update Profile:**
1. Click **"Edit Profile"** button
2. Modify allowed fields
3. Upload new photo (optional)
4. Click **"Save Changes"**

**⚠️ Cannot Edit:**
- Student Number
- Full Name
- Grade Level
- Section
- Parent names
(Contact registrar to update these)

#### Change Profile Picture

**Steps:**
1. Click current profile picture
2. Click **"Upload New Photo"**
3. Select image file:
   - Max size: 2MB
   - Formats: JPG, PNG, GIF
   - Recommended: Square photo, clear face
4. Crop/adjust if needed
5. Click **"Save"**

#### Change Password

**Access:** Profile → Security → Change Password

**Steps:**
1. Enter **Current Password**
2. Enter **New Password**
   - Minimum 8 characters
   - Include uppercase and lowercase
   - Include numbers
   - Include special character (recommended)
3. **Confirm New Password**
4. Click **"Update Password"**

**Password Tips:**
- Don't use birthdate or student number
- Use mix of characters
- Don't share password with anyone
- Change regularly (every 3 months)

---

### 6. Document Requests

#### Request Official Documents

**Access:**
1. Go to **"Document Requests"**
2. Click **"New Request"**

**Available Documents:**
- **Transcript of Records** (TOR)
- **Certificate of Enrollment**
- **Certificate of Good Moral**
- **Certification/Clearance**
- **Report Card Copy**
- **ID Replacement**

**Request Process:**
1. Select document type
2. Enter required details:
   - Purpose
   - Number of copies
   - Preferred pickup date
3. Attach requirements (if any)
4. Click **"Submit Request"**

**Payment:**
- View document fees
- Pay at cashier
- Upload payment receipt
- Wait for approval

#### Track Request Status

**View Requests:**
1. Go to **Document Requests** → **My Requests**
2. See all requests with status:
   - **Pending:** Under review
   - **Processing:** Being prepared
   - **Ready for Pickup:** Available at registrar
   - **Released:** Completed
   - **Rejected:** See remarks for reason

**Notifications:**
- Email when status changes
- Dashboard alert when ready
- SMS notification (if enabled)

---

### 7. Messages (If Available)

#### Send Message to Teacher

**Access:**
1. Go to **Messages**
2. Click **"New Message"**

**Steps:**
1. Select recipient (teacher)
2. Enter subject
3. Write message
4. Attach file (optional)
5. Click **"Send"**

#### View Messages

**Inbox:**
- Received messages
- Teacher replies
- System notifications

**Sent:**
- Messages you've sent
- Delivery status

**Features:**
- Mark as read/unread
- Delete messages
- Search messages
- Filter by sender

---

## Troubleshooting

### Login Issues

**Problem:** "Invalid credentials"
**Solutions:**
1. Check student number format (no spaces)
2. Verify password (case-sensitive)
3. Check Caps Lock is off
4. Click **"Forgot Password"** to reset
5. Contact registrar if account locked

**Problem:** "Account not found"
**Solutions:**
1. Verify you entered correct student number
2. Check if you're registered in system
3. Contact registrar office
4. May need to activate account first

**Problem:** "Session expired"
**Solutions:**
1. Login again
2. Clear browser cookies
3. Check internet connection
4. Try different browser

### Grade Viewing Issues

**Problem:** Grades not showing
**Solutions:**
1. Verify correct school year selected
2. Check if quarter has started
3. Confirm teacher has submitted grades
4. Refresh page (F5)
5. Contact teacher if grades should be available

**Problem:** Grade calculation seems wrong
**Solutions:**
1. Verify all components are entered (WW, PT, QE)
2. Check formula: (WW×0.4) + (PT×0.4) + (QE×0.2)
3. Screenshot and report to teacher
4. Contact registrar if persists

**Problem:** Cannot download grade report
**Solutions:**
1. Check popup blocker (allow popups)
2. Ensure browser allows downloads
3. Try different browser
4. Check internet connection
5. Contact IT support

### Attendance Issues

**Problem:** Attendance record incorrect
**Solutions:**
1. Verify date and time
2. Check if you actually scanned QR code
3. Contact teacher for that day
4. Report to registrar with proof (e.g., classmate confirmation)
5. May need teacher adjustment

**Problem:** QR code not working
**Solutions:**
1. Ensure code is clean and visible
2. Check if image quality is good
3. Try displaying on phone (brighter screen)
4. Request new QR code from registrar
5. Use manual entry at guard

### Schedule Issues

**Problem:** Schedule not showing
**Solutions:**
1. Verify you're enrolled
2. Check if school year is active
3. Confirm section assignment
4. Refresh page
5. Contact registrar

**Problem:** Schedule is incorrect
**Solutions:**
1. Verify with classmates
2. Check for schedule updates/announcements
3. Contact class adviser
4. Report to registrar if different from official

### Profile Issues

**Problem:** Cannot upload photo
**Solutions:**
1. Check file size (max 2MB)
2. Verify file format (JPG, PNG, GIF)
3. Try compressing image
4. Use different image
5. Clear browser cache

**Problem:** Email/phone not updating
**Solutions:**
1. Verify format is correct
2. Check if email already used by another user
3. Clear browser cache
4. Try different browser
5. Contact registrar for manual update

**Problem:** Cannot change password
**Solutions:**
1. Verify current password is correct
2. Check new password meets requirements
3. Ensure passwords match
4. Clear browser cache
5. Use "Forgot Password" if current password unknown

### Document Request Issues

**Problem:** Cannot submit request
**Solutions:**
1. Fill all required fields
2. Check file attachments are valid
3. Verify internet connection
4. Try submitting again
5. Contact registrar office directly

**Problem:** Request status not updating
**Solutions:**
1. Refresh page
2. Check your email for updates
3. Visit registrar office for status
4. Processing may take several days

---

## Best Practices

### Daily Routine

**Morning:**
1. Check dashboard for announcements
2. Review today's schedule
3. Prepare QR code for scanning
4. Check for new messages

**After School:**
1. Verify attendance was recorded
2. Check for new grades posted
3. Review homework/announcements
4. Prepare for next day

### Academic Monitoring

**Weekly:**
1. Check all subject grades
2. Review attendance rate
3. Read new announcements
4. Plan for upcoming deadlines

**Monthly:**
1. Generate grade report
2. Review attendance record
3. Compare with previous month
4. Set academic goals

### Security

**Protect Your Account:**
1. Never share password
2. Logout when using public computers
3. Don't save password on shared devices
4. Change password regularly
5. Report suspicious activity

**Protect Your Data:**
1. Keep QR code secure
2. Don't share student number publicly
3. Verify website URL before login
4. Report lost/stolen student ID immediately

---

## Parent/Guardian Access

### Parent Portal

**If Available:**
- Parents can view your grades
- See attendance records
- Receive announcements
- Contact teachers

**Parent Login:**
1. Separate parent account required
2. Contact registrar for setup
3. Parent can monitor your progress

---

## Common Tasks Quick Reference

| Task | Navigation | Action |
|------|-----------|--------|
| View grades | My Grades → Select Quarter | View all subjects |
| Download report card | My Grades → Generate Report | Select quarter, download |
| Check attendance | Attendance → View Summary | See attendance rate |
| View schedule | My Schedule | Weekly/daily view |
| Download QR code | Profile → My QR Code → Download | Save image |
| Change password | Profile → Security → Change Password | Enter old & new password |
| Request document | Document Requests → New Request | Fill form, submit |
| Read announcements | Announcements | View all posts |

---

## Keyboard Shortcuts

- `Ctrl + D` - Dashboard
- `Ctrl + G` - My Grades
- `Ctrl + A` - Attendance
- `Ctrl + S` - My Schedule
- `Ctrl + P` - Profile
- `F5` - Refresh Page

---

## Error Messages & Solutions

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "No grades available" | Teacher hasn't posted | Wait or contact teacher |
| "QR code expired" | Old code in use | Request new QR from registrar |
| "Session timeout" | Inactive too long | Login again |
| "File too large" | Image > 2MB | Compress image, retry |
| "Invalid password" | Password doesn't meet rules | Use 8+ chars, mix types |
| "No schedule found" | Not enrolled or inactive | Contact registrar |
| "Request already exists" | Duplicate document request | Check existing requests |

---

## Contact & Support

**Registrar Office:**
- For enrollment, grades, records
- Hours: [Office Hours]
- Email: [Email]
- Phone: [Phone]

**IT Support:**
- For login, technical issues
- Help Desk: [Location]
- Email: [Email]

**Class Adviser:**
- For academic concerns
- Contact through messages or in person

**Guidance Office:**
- For personal/academic counseling
- Hours: [Office Hours]

---

## Mobile App (If Available)

**Features:**
- View grades on the go
- Check attendance
- Read announcements
- Access QR code
- Receive push notifications

**Download:**
- [App Store Link]
- [Google Play Link]

---

## FAQs

**Q: When are grades posted?**
A: Teachers post grades after the grading deadline set by admin, usually end of each quarter.

**Q: How do I know my attendance is recorded?**
A: Scan QR code at entrance, verify with guard, check your attendance page later.

**Q: Can I see other students' grades?**
A: No, you can only view your own grades (privacy policy).

**Q: What if I disagree with a grade?**
A: Contact your subject teacher first, then class adviser if needed.

**Q: How long do document requests take?**
A: Usually 3-5 business days, check request status online.

**Q: Can I change my section?**
A: Contact registrar, approval depends on availability and school policy.

---

## Version Information

**Current Version:** 1.0.0
**Last Updated:** December 2025
**System:** Student Portal

---

## Privacy Notice

- Your data is confidential
- Grades visible only to you, parents (if enabled), and authorized staff
- Don't share login credentials
- Report privacy concerns to admin

---

**Document Version:** 1.0  
**Last Reviewed:** December 2025
