# Registrar System - User Guide

## Overview
The Registrar System is the central hub for student enrollment, academic records management, grade processing, document issuance, and student information management. This system coordinates with all other subsystems to maintain accurate and up-to-date student records.

---

## System Requirements

### Software
- Modern web browser (Chrome, Firefox, Edge)
- XAMPP (Apache, MySQL, PHP 8.x)
- Internet connection
- QR code reader (for student ID scanning)

---

## Getting Started

### 1. System Access

**Login URL:** `http://localhost:5175/registrar` or `http://localhost/SMS-GCA-3H/Registrar/frontend/`

**Login Credentials:**
- Username: Provided by admin
- Password: Set during account creation

### 2. Dashboard Overview

The registrar dashboard displays:
- **Student Statistics**
  - Total enrolled students
  - By grade level breakdown
  - New enrollees
  - Transferees
- **Recent Activity**
  - Latest enrollments
  - Grade submissions from teachers
  - Document requests
  - System updates
- **Quick Actions**
  - Enroll new student
  - Process grades
  - Generate reports
  - Issue documents
- **Pending Tasks**
  - Pending enrollments
  - Document requests awaiting processing
  - Grade submissions to review
  - Missing student information

---

## Core Features

### 1. Student Enrollment Management

#### View All Students

**Access:**
1. Click **"Student Records"** in sidebar
2. View complete student database

**Student List Shows:**
- Student Number
- Full Name
- Grade Level
- Section
- Status (Active/Inactive/Transferred/Graduated)
- Photo
- Actions (View/Edit/Delete)

**Filter Options:**
- By grade level (7, 8, 9, 10, 11, 12)
- By section
- By status
- By school year
- By enrollment date

**Search:**
- Search by name
- Search by student number
- Search by parent name

#### Enroll New Student

**Access:**
1. Click **"Enroll Student"** button
2. Select enrollment type:
   - **New Student** (freshmen, transferees)
   - **Returning Student** (re-enrollment)

**New Student Enrollment:**

**Step 1: Personal Information**
- Student Number (auto-generated or manual)
- Last Name
- First Name
- Middle Name
- Suffix (Jr., Sr., III, etc.)
- Birthdate
- Gender
- Birthplace
- Religion
- Nationality

**Step 2: Address Information**
- House/Lot/Block Number
- Street
- Barangay
- City/Municipality
- Province
- ZIP Code

**Step 3: Family Information**
- Father's Name
- Father's Occupation
- Father's Contact Number
- Mother's Name
- Mother's Occupation
- Mother's Contact Number
- Guardian (if applicable)
- Guardian's Contact

**Step 4: Academic Information**
- Grade Level to Enroll
- Section (select from available)
- School Year
- LRN (Learner Reference Number)
- Previous School (if transferee)
- Date of Transfer

**Step 5: Emergency Contact**
- Contact Person Name
- Relationship
- Phone Number
- Alternative Number

**Step 6: Documents**
- Upload Required Documents:
  - Birth Certificate (PSA copy)
  - Form 137 (Report Card)
  - Certificate of Good Moral
  - ID Photo (2x2)
  - Transfer Certificate (if applicable)

**Step 7: Generate QR Code**
- System auto-generates unique QR code
- Print QR code for student ID
- Encode in attendance system

**Step 8: Create Account**
- Set temporary password
- Email login credentials to student/parent
- Mark enrollment as complete

**Important:**
- All required fields must be filled
- Documents must be uploaded before finalizing
- Verify all information accuracy before saving

#### Edit Student Information

**Access:**
1. Find student in records
2. Click **"Edit"** button

**Editable Fields:**
- Personal information
- Contact details
- Address
- Parent/guardian information
- Emergency contact
- Section assignment
- Status (Active/Inactive)

**Cannot Edit:**
- Student Number (permanent)
- Enrollment history
- Grade records

**Steps:**
1. Modify required fields
2. Upload new photo (optional)
3. Click **"Save Changes"**
4. Changes logged in system

#### Transfer Student

**When to Use:**
- Student moving to different school
- Student changing sections

**Transfer to Another School:**
1. Find student
2. Click **"Transfer Student"**
3. Enter:
   - Destination school name
   - Transfer date
   - Reason
4. Set status to **"Transferred"**
5. Generate transfer certificate
6. Click **"Process Transfer"**

**What Happens:**
- Student marked as transferred
- No longer appears in active roster
- Records archived but accessible
- Transfer certificate generated

**Change Section:**
1. Edit student information
2. Select new section
3. Verify section capacity
4. Save changes
5. Update class rosters

#### Print Student ID

**Access:**
1. Go to student record
2. Click **"Print ID"**

**ID Includes:**
- Student photo
- Student number
- Full name
- Grade level & section
- School year
- QR code
- School logo

**Printing Options:**
- **Single ID:** Print one student
- **Batch Print:** Print multiple IDs (select students)
- **Section Print:** Print all IDs for a section

**ID Card Format:**
- Standard ID size (CR80: 85.6mm × 53.98mm)
- Front: Photo, name, details
- Back: QR code, emergency contact, barcode

---

### 2. Grade Management

#### Receive Grades from Teachers

**Access:**
1. Go to **"Grade Management"**
2. Click **"Pending Submissions"**

**View Submitted Grades:**
- Teacher name
- Subject
- Section
- Quarter
- Number of students
- Submission date
- Status (Pending/Approved/Rejected)

**Review Grades:**
1. Click on submission
2. Review all student grades:
   - WW (Written Work)
   - PT (Performance Task)
   - QE (Quarterly Exam)
   - Final Grade
3. Check for:
   - Missing grades
   - Invalid values (below 0 or above 100)
   - Calculation errors

**Approve Grades:**
1. Verify all grades are complete
2. Check calculations
3. Click **"Approve"** button
4. Grades locked and final

**Reject Grades:**
1. If errors found
2. Click **"Reject"**
3. Enter reason/remarks
4. Notify teacher
5. Teacher must resubmit

#### View Student Grades

**Access:**
1. Go to **"Grade Records"**
2. Search student by name or number

**Grade View:**
- All quarters (Q1, Q2, Q3, Q4)
- All subjects
- Components (WW, PT, QE)
- Final grade per subject
- General average per quarter
- Cumulative GPA

**Filter by:**
- School year
- Quarter
- Grade level
- Section
- Subject

#### Edit Grades (Authorization Required)

**When to Edit:**
- Teacher request for correction
- Calculation error
- Data entry mistake

**Process:**
1. Require written request from teacher
2. Get approval from school head
3. Go to grade record
4. Click **"Edit Grade"**
5. Modify grade
6. Enter reason for change
7. Attach approval document
8. Save changes
9. System logs the edit

**Important:**
- All edits are logged
- Previous values saved in history
- Requires proper authorization
- Cannot edit after final report card issued

#### Generate Report Cards

**Access:**
1. Go to **"Reports"** → **"Report Cards"**

**Generate Individual Report Card:**
1. Search student
2. Select school year and quarter
3. Click **"Generate Report Card"**
4. Review:
   - Student information
   - All subject grades
   - General average
   - Ranking (if applicable)
   - Attendance summary
   - Remarks
5. Download PDF or print

**Batch Generate Report Cards:**
1. Select grade level and section
2. Choose quarter
3. Click **"Generate All"**
4. System creates report cards for all students
5. Download as ZIP file
6. Print in bulk

**Report Card Includes:**
- School header and logo
- Student information
- Subject grades (all components)
- General average
- Attendance record
- Conduct grade
- Teacher remarks
- Parent signature section
- School seal

---

### 3. Document Request Processing

#### View Document Requests

**Access:**
1. Go to **"Document Requests"**
2. View all pending requests

**Request Information:**
- Student name and number
- Document type requested
- Purpose
- Number of copies
- Requested date
- Payment status
- Current status

**Request Types:**
- Certificate of Enrollment
- Transcript of Records (TOR)
- Certificate of Good Moral
- Report Card Copy
- Certificate of Grades
- Diploma Copy
- Honorable Dismissal
- Transfer Credentials (Form 137)

#### Process Document Request

**Steps:**

**1. Verify Request**
- Check if student is eligible
- Verify payment status
- Confirm required information complete

**2. Prepare Document**
- Open document template
- Auto-fill student data
- Verify accuracy
- Add official stamps/signatures

**3. Update Status**
- Change from "Pending" to "Processing"
- Student receives notification

**4. Quality Check**
- Review document for errors
- Check formatting
- Verify seal placement
- Confirm signature

**5. Mark Ready**
- Change status to "Ready for Pickup"
- Email notification sent to student
- Add to pickup list

**6. Release Document**
- Verify student identity
- Get signature on logbook
- Mark as "Released"
- Archive transaction

#### Document Templates

**Access:** Settings → Document Templates

**Manage Templates:**
- Edit existing templates
- Upload new templates
- Set default layouts
- Configure auto-fill fields

**Template Variables:**
- `{{student_name}}`
- `{{student_number}}`
- `{{grade_level}}`
- `{{school_year}}`
- `{{date_issued}}`
- And more...

---

### 4. Class & Section Management

#### View All Sections

**Access:**
1. Go to **"Sections"**
2. View by grade level

**Section Information:**
- Section name
- Grade level
- Adviser
- Number of students
- Capacity
- Room assignment
- School year

#### Create New Section

**Steps:**
1. Click **"Add New Section"**
2. Enter:
   - Grade Level
   - Section Name
   - Maximum Capacity
   - Room Number
3. Assign Class Adviser (teacher)
4. Select School Year
5. Click **"Create"**

**What Happens:**
- Section created as "Pending"
- Requires admin approval
- After approval, becomes active
- Students can be enrolled

#### Assign Students to Section

**Manual Assignment:**
1. Go to section details
2. Click **"Add Students"**
3. Search and select students
4. Verify capacity not exceeded
5. Click **"Assign"**

**Bulk Assignment:**
1. Import CSV file with student numbers
2. System matches students
3. Assigns to section automatically
4. Generates error report if issues

**Auto-Assignment:**
1. Set criteria (alphabetical, gender balance, etc.)
2. System distributes students evenly
3. Review assignments
4. Confirm or adjust

#### View Section Roster

**Access:**
1. Click on section
2. View complete student list

**Roster Shows:**
- Student number
- Full name
- Gender
- Contact number
- Parent contact
- Photo
- Status

**Actions:**
- Export to Excel
- Print class list
- Generate QR codes for section
- Send message to all students

---

### 5. Academic Records Management

#### Student Permanent Record

**Access:**
1. Go to **"Student Records"**
2. Click student name
3. View **"Permanent Record"**

**Record Contains:**
- **Personal Information**
  - Complete details
  - ID photo
  - QR code
- **Academic History**
  - All grades from enrollment
  - Quarter by quarter
  - Year by year
- **Attendance History**
  - Daily attendance records
  - Absence/tardy count
  - Attendance rate
- **Conduct Records**
  - Behavior notes
  - Awards/recognitions
  - Disciplinary actions
- **Document History**
  - All issued documents
  - Request dates
  - Release dates

#### Form 137 Management

**Access:** Student Record → Form 137

**Form 137 (Permanent Record):**
- Official academic transcript
- All grades from elementary to current
- Required for graduation/transfer

**Update Form 137:**
1. Verify all grades are complete
2. Add latest quarter grades
3. Calculate general average
4. Update attendance
5. Add teacher remarks
6. Print and file

**Export Form 137:**
1. Select student
2. Click **"Generate Form 137"**
3. System compiles all data
4. Download PDF
5. Print on official paper
6. Add signatures and seal

---

### 6. Reports & Analytics

#### Student Reports

**Enrollment Reports:**
1. Go to **"Reports"** → **"Enrollment"**
2. Select school year
3. Generate:
   - Total enrollment by grade level
   - New vs. returning students
   - Transferees
   - Enrollment trends
   - Demographics breakdown

**Grade Reports:**
1. Go to **"Reports"** → **"Academic"**
2. Select parameters
3. Generate:
   - Honor students by quarter
   - Subject performance analysis
   - Pass/fail rates
   - Grade distribution
   - Teacher grading analysis

**Attendance Reports:**
1. Go to **"Reports"** → **"Attendance"**
2. Generate:
   - Daily attendance summary
   - Monthly trends
   - Chronic absenteeism list
   - Perfect attendance list
   - Section attendance comparison

**Custom Reports:**
1. Go to **"Reports"** → **"Custom"**
2. Select data fields
3. Set filters
4. Generate report
5. Export as Excel/PDF

#### Export Data

**Export Options:**
- CSV format
- Excel spreadsheet
- PDF document
- JSON (for integration)

**Bulk Export:**
1. Select data type (students, grades, etc.)
2. Choose filters
3. Select format
4. Click **"Export"**
5. Download file

---

### 7. System Administration (Registrar Level)

#### Manage School Year

**Access:** Settings → School Year

**View:**
- Active school year
- All school years
- Quarter periods

**Note:** Only admin can create/modify school years, registrar can only view

#### Manage Subjects

**Access:** Curriculum → Subjects

**Add Subject:**
1. Click **"Add Subject"**
2. Enter:
   - Subject Code
   - Subject Name
   - Grade Level
   - Type (Core/Elective)
   - Units
3. Save

**Edit/Delete Subject:**
- Modify subject details
- Delete unused subjects
- Cannot delete if has grade records

#### Generate QR Codes

**Bulk QR Generation:**
1. Go to **"Tools"** → **"QR Code Generator"**
2. Select:
   - Grade level
   - Section
   - Or upload student list
3. Click **"Generate"**
4. System creates QR codes for all
5. Download as ZIP
6. Print on ID cards

**Single QR Code:**
1. Go to student record
2. Click **"Generate QR"**
3. Download image
4. Print

---

## Troubleshooting

### Enrollment Issues

**Problem:** Cannot enroll student
**Solutions:**
1. Check if student number already exists
2. Verify all required fields filled
3. Check section capacity
4. Ensure valid school year is active
5. Check for duplicate entries

**Problem:** QR code not generating
**Solutions:**
1. Verify student has valid student number
2. Check if QR code already exists
3. Clear browser cache
4. Try regenerating
5. Use manual QR creation tool

**Problem:** Document upload failing
**Solutions:**
1. Check file size (max 5MB per file)
2. Verify file format (PDF, JPG, PNG)
3. Ensure stable internet connection
4. Try different browser
5. Compress files if too large

### Grade Management Issues

**Problem:** Cannot approve grades
**Solutions:**
1. Verify all students have grades
2. Check for invalid values
3. Ensure deadline has passed
4. Verify you have permission
5. Check database connection

**Problem:** Grade calculations incorrect
**Solutions:**
1. Verify formula: (WW×0.4) + (PT×0.4) + (QE×0.2)
2. Check if all components entered
3. Recalculate manually to confirm
4. Check for rounding errors
5. Contact system admin if persistent

**Problem:** Grades not showing for student
**Solutions:**
1. Verify teacher submitted grades
2. Check if grades approved
3. Confirm correct school year selected
4. Verify student enrolled in subject
5. Check database for missing records

### Document Request Issues

**Problem:** Cannot generate document
**Solutions:**
1. Check if template exists
2. Verify student data is complete
3. Ensure payment processed
4. Check printer/PDF settings
5. Try different browser

**Problem:** Auto-fill not working
**Solutions:**
1. Verify template variables correct
2. Check student data fields populated
3. Update document template
4. Test with different student
5. Contact IT support

### Report Generation Issues

**Problem:** Reports are empty
**Solutions:**
1. Verify data exists for selected period
2. Check filters aren't too restrictive
3. Ensure correct school year selected
4. Check database connection
5. Try broader date range

**Problem:** Cannot export report
**Solutions:**
1. Check popup blocker settings
2. Ensure sufficient permissions
3. Try different export format
4. Check disk space
5. Clear browser cache

### System Performance Issues

**Problem:** System is slow
**Solutions:**
1. Close unnecessary tabs
2. Clear browser cache and cookies
3. Check internet connection
4. Restart browser
5. Contact IT if persistent

**Problem:** Cannot save changes
**Solutions:**
1. Check internet connection
2. Verify you have edit permissions
3. Check for JavaScript errors (F12)
4. Try refreshing page
5. Login again

---

## Best Practices

### Daily Operations

**Morning Routine:**
1. Login and check dashboard
2. Review pending tasks
3. Check document requests
4. Monitor grade submissions
5. Review any alerts or notifications

**Throughout the Day:**
1. Process document requests promptly
2. Respond to student/parent inquiries
3. Update student records as needed
4. Monitor enrollment activities
5. Approve grades when submitted

**End of Day:**
1. Complete pending document requests
2. Review day's enrollments
3. Check system logs
4. Backup critical data
5. Prepare next day's tasks

### Data Management

**Accuracy:**
1. Double-check all data entries
2. Verify student information with documents
3. Cross-reference with previous records
4. Have second person review critical data
5. Correct errors immediately

**Security:**
1. Never share login credentials
2. Lock screen when away
3. Logout after work
4. Handle student data confidentially
5. Follow data privacy policies

**Organization:**
1. Keep physical files organized
2. Scan and archive documents
3. Maintain consistent naming conventions
4. Regular database cleanup
5. Archive old records properly

### Quarter-End Procedures

**Before Quarter Ends:**
1. Remind teachers of grade deadline
2. Prepare report card templates
3. Verify all student records updated
4. Check attendance records complete

**After Grades Submitted:**
1. Review all grade submissions
2. Approve/reject promptly
3. Generate report cards
4. Print and prepare for distribution
5. Archive quarter data

**Start of New Quarter:**
1. Update system for new quarter
2. Reset temporary data
3. Prepare new report templates
4. Communicate deadlines

---

## Common Tasks Quick Reference

| Task | Navigation | Steps |
|------|-----------|-------|
| Enroll student | Student Records → Enroll | Fill form, upload docs, save |
| Approve grades | Grade Management → Pending | Review, click Approve |
| Process document request | Document Requests → Pending | Verify, prepare, mark ready |
| Generate report card | Reports → Report Cards | Select student/section, generate |
| Create section | Sections → Add New | Enter details, assign adviser |
| Print student ID | Student Record → Print ID | Select format, print |
| Export student list | Student Records → Export | Select filters, choose format |
| Generate QR codes | Tools → QR Generator → Bulk | Select students, generate |

---

## Keyboard Shortcuts

- `Ctrl + N` - New Enrollment
- `Ctrl + F` - Find Student
- `Ctrl + P` - Print Current Page
- `Ctrl + S` - Save Changes
- `Ctrl + R` - Refresh Data
- `Esc` - Close Modal

---

## Error Messages & Solutions

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Student number already exists" | Duplicate entry | Use different number or check existing record |
| "Section is full" | Capacity reached | Increase capacity or choose different section |
| "Invalid date format" | Wrong format | Use YYYY-MM-DD format |
| "Payment not verified" | No payment record | Verify payment, update status |
| "Template not found" | Missing document template | Upload template in settings |
| "Insufficient permissions" | Access restricted | Contact admin for permissions |
| "Database connection failed" | MySQL not running | Check XAMPP, restart services |
| "Invalid grade value" | Grade out of range | Enter 0-100 only |

---

## Contact & Support

**IT Support:**
- For technical issues, system errors
- Email: [IT Email]
- Extension: [Phone Extension]

**Admin Office:**
- For permissions, policy questions
- Email: [Admin Email]
- Office: [Location]

**Teacher Concerns:**
- For grade-related inquiries
- Contact through proper channels
- Document all communications

---

## Version Information

**Current Version:** 1.0.0
**Last Updated:** December 2025
**System:** Registrar Management System

---

## Appendix

### Student Number Format

**Format:** YYYY-XXXX
- YYYY: Year of enrollment
- XXXX: Sequential number

**Example:** 2024-0001

### DepEd Forms Reference

**Form 137:** Student Permanent Record
**Form 138:** Report Card
**Form 9:** School Register

### Document Retention

**Permanent Records:**
- Form 137
- Enrollment records
- Graduation records

**7-Year Retention:**
- Report cards
- Attendance records
- Conduct records

**3-Year Retention:**
- Document request logs
- Correspondence
- Daily reports

### Grade Scale

- 96-100: Outstanding
- 90-95: Very Satisfactory
- 85-89: Satisfactory
- 80-84: Fairly Satisfactory
- 75-79: Did Not Meet Expectations
- Below 75: Failed

---

**Document Version:** 1.0  
**Last Reviewed:** December 2025  
**Reviewed By:** [Registrar Office]
