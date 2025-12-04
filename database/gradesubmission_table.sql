-- Grade Submission Table
-- This table tracks grade submission status from teachers to registrar
-- Each record represents a submission for a specific section and quarter
-- Run this SQL in your database to create the gradesubmission table

-- First, ensure gradestatus table has the required statuses
INSERT IGNORE INTO `gradestatus` (`StatusID`, `StatusName`) VALUES
(1, 'Draft'),
(2, 'Submitted'),
(3, 'Approved'),
(4, 'Rejected');

-- Create the gradesubmission table
CREATE TABLE IF NOT EXISTS `gradesubmission` (
  `SubmissionID` int(11) NOT NULL AUTO_INCREMENT,
  `SectionID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `Quarter` enum('First Quarter','Second Quarter','Third Quarter','Fourth Quarter') NOT NULL,
  `SubmissionStatus` enum('Draft','Submitted','Approved','Rejected','Resubmitted') NOT NULL DEFAULT 'Draft',
  `SubmittedByUserID` int(11) DEFAULT NULL,
  `SubmittedDate` datetime DEFAULT NULL,
  `TotalStudents` int(11) NOT NULL DEFAULT 0,
  `StudentsWithGrades` int(11) NOT NULL DEFAULT 0,
  `ReviewedByUserID` int(11) DEFAULT NULL,
  `ReviewedDate` datetime DEFAULT NULL,
  `RegistrarNotes` text DEFAULT NULL,
  `TeacherNotes` text DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SubmissionID`),
  UNIQUE KEY `unique_section_quarter` (`SectionID`, `SchoolYearID`, `Quarter`),
  KEY `idx_section` (`SectionID`),
  KEY `idx_school_year` (`SchoolYearID`),
  KEY `idx_status` (`SubmissionStatus`),
  KEY `idx_submitted_by` (`SubmittedByUserID`),
  KEY `idx_reviewed_by` (`ReviewedByUserID`),
  KEY `idx_submission_date` (`SubmittedDate`),
  CONSTRAINT `fk_gradesubmission_section` FOREIGN KEY (`SectionID`) REFERENCES `section` (`SectionID`) ON DELETE CASCADE,
  CONSTRAINT `fk_gradesubmission_schoolyear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`) ON DELETE CASCADE,
  CONSTRAINT `fk_gradesubmission_submitted_by` FOREIGN KEY (`SubmittedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `fk_gradesubmission_reviewed_by` FOREIGN KEY (`ReviewedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
