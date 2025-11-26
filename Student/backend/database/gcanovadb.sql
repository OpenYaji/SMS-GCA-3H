-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2025 at 05:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gcanovadb`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_submit_admission_application` (IN `p_enrollee_type` VARCHAR(20), IN `p_student_first_name` VARCHAR(100), IN `p_student_last_name` VARCHAR(100), IN `p_birthdate` DATE, IN `p_gender` VARCHAR(20), IN `p_address` VARCHAR(512), IN `p_contact_number` VARCHAR(20), IN `p_email_address` VARCHAR(255), IN `p_guardian_first_name` VARCHAR(100), IN `p_guardian_last_name` VARCHAR(100), IN `p_relationship` VARCHAR(50), IN `p_guardian_contact` VARCHAR(20), IN `p_guardian_email` VARCHAR(255), IN `p_grade_level` VARCHAR(50), IN `p_previous_school` VARCHAR(255), IN `p_school_year_id` INT, OUT `p_tracking_number` VARCHAR(50), OUT `p_application_id` INT)   BEGIN
  DECLARE v_applicant_id INT;
  DECLARE v_grade_level_id INT;
  DECLARE v_enrollee_enum ENUM('New','Old','Transferee');
  DECLARE v_max_attempts INT DEFAULT 10;
  DECLARE v_attempt INT DEFAULT 0;
  
  -- Start transaction
  START TRANSACTION;
  
  -- Convert enrollee type to proper enum
  SET v_enrollee_enum = CASE LOWER(p_enrollee_type)
    WHEN 'returnee' THEN 'Old'
    WHEN 'new' THEN 'New'
    WHEN 'transferee' THEN 'Transferee'
    ELSE 'New'
  END;
  
  -- Get grade level ID
  SELECT GradeLevelID INTO v_grade_level_id 
  FROM gradelevel 
  WHERE LOWER(REPLACE(LevelName, ' ', '')) = LOWER(REPLACE(p_grade_level, ' ', ''))
  LIMIT 1;
  
  -- If grade level not found, rollback
  IF v_grade_level_id IS NULL THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Invalid grade level';
  END IF;
  
  -- Create applicant profile
  INSERT INTO applicantprofile (
    FirstName, LastName, DateOfBirth, Gender, 
    Address, ContactNumber, EmailAddress
  ) VALUES (
    p_student_first_name, p_student_last_name, p_birthdate, p_gender,
    p_address, p_contact_number, p_email_address
  );
  
  SET v_applicant_id = LAST_INSERT_ID();
  
  -- Create applicant guardian
  INSERT INTO applicantguardian (
    ApplicantProfileID, FirstName, LastName, 
    RelationshipType, ContactNumber, EmailAddress
  ) VALUES (
    v_applicant_id, p_guardian_first_name, p_guardian_last_name,
    p_relationship, p_guardian_contact, p_guardian_email
  );
  
  -- Generate unique tracking number (format: GCA-YYYY-XXXXX)
  REPEAT
    SET p_tracking_number = CONCAT(
      'GCA-',
      YEAR(CURDATE()),
      '-',
      LPAD(FLOOR(RAND() * 99999), 5, '0')
    );
    SET v_attempt = v_attempt + 1;
  UNTIL NOT EXISTS (SELECT 1 FROM application WHERE TrackingNumber = p_tracking_number) 
     OR v_attempt >= v_max_attempts
  END REPEAT;
  
  -- If we couldn't generate unique number, rollback
  IF v_attempt >= v_max_attempts THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Unable to generate unique tracking number';
  END IF;
  
  -- Create application
  INSERT INTO application (
    TrackingNumber,
    TemporaryApplicantID,
    SchoolYearID,
    ApplyingForGradeLevelID,
    EnrolleeType,
    ApplicationStatus,
    SubmissionDate,
    PreviousSchool
  ) VALUES (
    p_tracking_number,
    v_applicant_id,
    p_school_year_id,
    v_grade_level_id,
    v_enrollee_enum,
    'Pending',
    NOW(),
    p_previous_school
  );
  
  SET p_application_id = LAST_INSERT_ID();
  
  -- Commit transaction
  COMMIT;
  
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `academicstanding`
--

CREATE TABLE `academicstanding` (
  `StandingID` int(11) NOT NULL,
  `EnrollmentID` int(11) NOT NULL,
  `GeneralAverage` decimal(5,2) DEFAULT NULL,
  `AttendanceRate` decimal(5,2) DEFAULT NULL COMMENT 'As a percentage',
  `StandingLevelID` int(11) DEFAULT NULL,
  `ParticipationLevelID` int(11) DEFAULT NULL,
  `ComputedDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `academicstandinglevel`
--

CREATE TABLE `academicstandinglevel` (
  `StandingLevelID` int(11) NOT NULL,
  `LevelName` varchar(100) NOT NULL,
  `MinAverage` decimal(5,2) DEFAULT NULL,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adminprofile`
--

CREATE TABLE `adminprofile` (
  `AdminProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `AnnouncementID` int(11) NOT NULL,
  `AuthorUserID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `BannerURL` varchar(255) DEFAULT NULL,
  `PublishDate` datetime NOT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `TargetAudience` enum('All Users','Students','Teachers','Parents','Staff') NOT NULL,
  `IsPinned` tinyint(1) NOT NULL DEFAULT 0,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicantguardian`
--

CREATE TABLE `applicantguardian` (
  `ApplicantGuardianID` int(11) NOT NULL,
  `ApplicantProfileID` int(11) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `RelationshipType` varchar(50) NOT NULL,
  `ContactNumber` varchar(20) NOT NULL,
  `EmailAddress` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicantprofile`
--

CREATE TABLE `applicantprofile` (
  `ApplicantProfileID` int(11) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `DateOfBirth` date NOT NULL,
  `Gender` enum('Male','Female') NOT NULL,
  `Address` varchar(512) NOT NULL,
  `ContactNumber` varchar(20) NOT NULL,
  `EmailAddress` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `ApplicationID` int(11) NOT NULL,
  `TrackingNumber` varchar(50) DEFAULT NULL,
  `ApplicantProfileID` int(11) DEFAULT NULL,
  `TemporaryApplicantID` int(11) DEFAULT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `ApplyingForGradeLevelID` int(11) NOT NULL,
  `EnrolleeType` enum('New','Old','Transferee') NOT NULL,
  `ApplicationStatus` enum('Pending','For Review','Approved','Rejected','Waitlisted') NOT NULL DEFAULT 'Pending',
  `SubmissionDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ReviewedDate` datetime DEFAULT NULL,
  `PreviousSchool` varchar(255) DEFAULT NULL,
  `ReviewedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicationrequirement`
--

CREATE TABLE `applicationrequirement` (
  `RequirementID` int(11) NOT NULL,
  `ApplicationID` int(11) NOT NULL,
  `RequirementTypeID` int(11) NOT NULL,
  `SecureFileID` int(11) DEFAULT NULL,
  `RequirementStatus` enum('Submitted','Verified','Missing','Rejected') NOT NULL DEFAULT 'Missing',
  `SubmittedDate` datetime DEFAULT NULL,
  `VerifiedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applieddiscount`
--

CREATE TABLE `applieddiscount` (
  `AppliedDiscountID` int(11) NOT NULL,
  `TransactionID` int(11) NOT NULL,
  `DiscountID` int(11) NOT NULL,
  `DiscountAmount` decimal(10,2) NOT NULL,
  `ApprovedByUserID` int(11) DEFAULT NULL,
  `AppliedDate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `AttendanceID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `ClassScheduleID` int(11) NOT NULL,
  `AttendanceDate` date NOT NULL,
  `CheckInTime` datetime DEFAULT NULL,
  `CheckOutTime` datetime DEFAULT NULL,
  `AttendanceStatus` enum('Present','Late','Absent','Excused') NOT NULL,
  `AttendanceMethodID` int(11) DEFAULT NULL,
  `Notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendancemethod`
--

CREATE TABLE `attendancemethod` (
  `MethodID` int(11) NOT NULL,
  `MethodName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendancesummary`
--

CREATE TABLE `attendancesummary` (
  `AttendanceSummaryID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `TotalDaysPresent` int(11) NOT NULL DEFAULT 0,
  `TotalSchoolDays` int(11) NOT NULL DEFAULT 0,
  `AttendancePercentage` decimal(5,2) GENERATED ALWAYS AS (case when `TotalSchoolDays` > 0 then round(`TotalDaysPresent` / `TotalSchoolDays` * 100,2) else 0 end) STORED,
  `LastUpdated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendancesummary`
--

INSERT INTO `attendancesummary` (`AttendanceSummaryID`, `StudentProfileID`, `SchoolYearID`, `TotalDaysPresent`, `TotalSchoolDays`, `LastUpdated`) VALUES
(1, 1, 6, 115, 120, '2025-11-15 23:25:58'),
(2, 2, 6, 118, 120, '2025-11-15 23:25:58'),
(3, 3, 6, 112, 120, '2025-11-15 23:25:58'),
(4, 4, 6, 120, 120, '2025-11-15 23:25:58'),
(5, 5, 6, 119, 120, '2025-11-15 23:25:58'),
(6, 6, 6, 117, 120, '2025-11-15 23:25:58');

-- --------------------------------------------------------

--
-- Table structure for table `auditlog`
--

CREATE TABLE `auditlog` (
  `AuditID` bigint(20) NOT NULL,
  `TableName` varchar(100) NOT NULL,
  `RecordID` int(11) DEFAULT NULL,
  `Operation` enum('INSERT','UPDATE','DELETE','LOGIN','LOGOUT') NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `OldValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`OldValues`)),
  `NewValues` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`NewValues`)),
  `IPAddress` varchar(45) DEFAULT NULL,
  `UserAgent` varchar(255) DEFAULT NULL,
  `Timestamp` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classschedule`
--

CREATE TABLE `classschedule` (
  `ScheduleID` int(11) NOT NULL,
  `SectionID` int(11) NOT NULL,
  `SubjectID` int(11) NOT NULL,
  `TeacherProfileID` int(11) DEFAULT NULL,
  `DayOfWeek` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL,
  `ScheduleStatusID` int(11) DEFAULT NULL,
  `RoomNumber` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discount`
--

CREATE TABLE `discount` (
  `DiscountID` int(11) NOT NULL,
  `DiscountName` varchar(100) NOT NULL,
  `DiscountTypeID` int(11) NOT NULL,
  `PercentageOrAmount` decimal(10,2) NOT NULL,
  `IsPercentage` tinyint(1) NOT NULL,
  `ValidFrom` date DEFAULT NULL,
  `ValidUntil` date DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discounttype`
--

CREATE TABLE `discounttype` (
  `DiscountTypeID` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emergencycontact`
--

CREATE TABLE `emergencycontact` (
  `EmergencyContactID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `ContactPerson` varchar(255) NOT NULL,
  `EncryptedContactNumber` varbinary(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emergencycontact`
--

INSERT INTO `emergencycontact` (`EmergencyContactID`, `StudentProfileID`, `ContactPerson`, `EncryptedContactNumber`) VALUES
(1, 1, 'Carmen Alvarez', 0x2b363339313731323334353032),
(2, 2, 'Linda Torres', 0x2b363339313831323334353032),
(3, 3, 'Patricia Ramos', 0x2b363339313931323334353032),
(4, 4, 'Teresa Santos', 0x2b363339323031323334353032),
(5, 5, 'Elena Castro', 0x2b363339323131323334353032),
(6, 6, 'Gloria Morales', 0x2b363339323231323334353032);

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `EnrollmentID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SectionID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `EnrollmentDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`EnrollmentID`, `StudentProfileID`, `SectionID`, `SchoolYearID`, `EnrollmentDate`) VALUES
(1, 1, 1, 6, '2024-08-01'),
(2, 2, 17, 5, '2023-08-01'),
(3, 2, 2, 6, '2024-08-01'),
(4, 3, 13, 4, '2022-08-01'),
(5, 3, 18, 5, '2023-08-01'),
(6, 3, 3, 6, '2024-08-01'),
(7, 4, 10, 3, '2021-08-01'),
(8, 4, 14, 4, '2022-08-01'),
(9, 4, 19, 5, '2023-08-01'),
(10, 4, 4, 6, '2024-08-01'),
(11, 5, 8, 2, '2020-08-01'),
(12, 5, 11, 3, '2021-08-01'),
(13, 5, 15, 4, '2022-08-01'),
(14, 5, 20, 5, '2023-08-01'),
(15, 5, 5, 6, '2024-08-01'),
(16, 6, 7, 1, '2019-08-01'),
(17, 6, 9, 2, '2020-08-01'),
(18, 6, 12, 3, '2021-08-01'),
(19, 6, 16, 4, '2022-08-01'),
(20, 6, 21, 5, '2023-08-01'),
(21, 6, 6, 6, '2024-08-01');

-- --------------------------------------------------------

--
-- Table structure for table `faq`
--

CREATE TABLE `faq` (
  `FAQID` int(11) NOT NULL,
  `Question` text NOT NULL,
  `Answer` text NOT NULL,
  `Category` varchar(100) DEFAULT NULL,
  `ViewCount` int(11) NOT NULL DEFAULT 0,
  `IsPublished` tinyint(1) NOT NULL DEFAULT 0,
  `SortOrder` int(11) DEFAULT 0,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grade`
--

CREATE TABLE `grade` (
  `GradeID` int(11) NOT NULL,
  `EnrollmentID` int(11) NOT NULL,
  `SubjectID` int(11) NOT NULL,
  `Quarter` enum('First Quarter','Second Quarter','Third Quarter','Fourth Quarter') NOT NULL,
  `GradeValue` decimal(5,2) DEFAULT NULL,
  `Remarks` text DEFAULT NULL,
  `GradeStatusID` int(11) DEFAULT NULL,
  `LastModified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ModifiedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grade`
--

INSERT INTO `grade` (`GradeID`, `EnrollmentID`, `SubjectID`, `Quarter`, `GradeValue`, `Remarks`, `GradeStatusID`, `LastModified`, `ModifiedByUserID`) VALUES
(1, 11, 1, 'First Quarter', 85.00, 'Good', NULL, '2025-11-15 23:25:58', NULL),
(2, 11, 1, 'Second Quarter', 87.00, 'Good', NULL, '2025-11-15 23:25:58', NULL),
(3, 11, 1, 'Third Quarter', 88.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(4, 11, 1, 'Fourth Quarter', 86.00, 'Good', NULL, '2025-11-15 23:25:58', NULL),
(5, 11, 2, 'First Quarter', 88.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(6, 11, 2, 'Second Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(7, 11, 2, 'Third Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(8, 11, 2, 'Fourth Quarter', 88.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(9, 11, 3, 'First Quarter', 87.00, 'Good', NULL, '2025-11-15 23:25:58', NULL),
(10, 11, 3, 'Second Quarter', 88.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(11, 11, 3, 'Third Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(12, 11, 3, 'Fourth Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(13, 11, 4, 'First Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(14, 11, 4, 'Second Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(15, 11, 4, 'Third Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(16, 11, 4, 'Fourth Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(17, 11, 5, 'First Quarter', 88.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(18, 11, 5, 'Second Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(19, 11, 5, 'Third Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(20, 11, 5, 'Fourth Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(21, 12, 6, 'First Quarter', 88.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(22, 12, 6, 'Second Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(23, 12, 6, 'Third Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(24, 12, 6, 'Fourth Quarter', 88.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(25, 12, 7, 'First Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(26, 12, 7, 'Second Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(27, 12, 7, 'Third Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(28, 12, 7, 'Fourth Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(29, 12, 8, 'First Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(30, 12, 8, 'Second Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(31, 12, 8, 'Third Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(32, 12, 8, 'Fourth Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(33, 12, 9, 'First Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(34, 12, 9, 'Second Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(35, 12, 9, 'Third Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(36, 12, 9, 'Fourth Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(37, 12, 10, 'First Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(38, 12, 10, 'Second Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(39, 12, 10, 'Third Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(40, 12, 10, 'Fourth Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(41, 13, 11, 'First Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(42, 13, 11, 'Second Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(43, 13, 11, 'Third Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(44, 13, 11, 'Fourth Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(45, 13, 12, 'First Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(46, 13, 12, 'Second Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(47, 13, 12, 'Third Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(48, 13, 12, 'Fourth Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(49, 13, 13, 'First Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(50, 13, 13, 'Second Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(51, 13, 13, 'Third Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(52, 13, 13, 'Fourth Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(53, 13, 14, 'First Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(54, 13, 14, 'Second Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(55, 13, 14, 'Third Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(56, 13, 14, 'Fourth Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(57, 13, 15, 'First Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(58, 13, 15, 'Second Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(59, 13, 15, 'Third Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(60, 13, 15, 'Fourth Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(61, 14, 16, 'First Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(62, 14, 16, 'Second Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(63, 14, 16, 'Third Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(64, 14, 16, 'Fourth Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(65, 14, 17, 'First Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(66, 14, 17, 'Second Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(67, 14, 17, 'Third Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(68, 14, 17, 'Fourth Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(69, 14, 18, 'First Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(70, 14, 18, 'Second Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(71, 14, 18, 'Third Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(72, 14, 18, 'Fourth Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(73, 14, 19, 'First Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(74, 14, 19, 'Second Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(75, 14, 19, 'Third Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(76, 14, 19, 'Fourth Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(77, 14, 20, 'First Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(78, 14, 20, 'Second Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(79, 14, 20, 'Third Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(80, 14, 20, 'Fourth Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(81, 15, 21, 'First Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(82, 15, 21, 'Second Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(83, 15, 21, 'Third Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(84, 15, 21, 'Fourth Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(85, 15, 22, 'First Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(86, 15, 22, 'Second Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(87, 15, 22, 'Third Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(88, 15, 22, 'Fourth Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(89, 15, 23, 'First Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(90, 15, 23, 'Second Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(91, 15, 23, 'Third Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(92, 15, 23, 'Fourth Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(93, 15, 24, 'First Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(94, 15, 24, 'Second Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(95, 15, 24, 'Third Quarter', 96.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(96, 15, 24, 'Fourth Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(97, 15, 25, 'First Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(98, 15, 25, 'Second Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(99, 15, 25, 'Third Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(100, 15, 25, 'Fourth Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(101, 1, 1, 'First Quarter', 88.00, 'Good', NULL, '2025-11-15 23:25:58', NULL),
(102, 1, 2, 'First Quarter', 85.00, 'Good', NULL, '2025-11-15 23:25:58', NULL),
(103, 1, 3, 'First Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(104, 1, 4, 'First Quarter', 87.00, 'Good', NULL, '2025-11-15 23:25:58', NULL),
(105, 1, 5, 'First Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(106, 1, 1, 'Second Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(107, 1, 2, 'Second Quarter', 86.00, 'Good', NULL, '2025-11-15 23:25:58', NULL),
(108, 1, 3, 'Second Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(109, 1, 4, 'Second Quarter', 88.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(110, 1, 5, 'Second Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(111, 1, 1, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(112, 1, 2, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(113, 1, 3, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(114, 1, 4, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(115, 1, 5, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(116, 1, 1, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(117, 1, 2, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(118, 1, 3, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(119, 1, 4, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(120, 1, 5, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(121, 2, 6, 'First Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(122, 2, 7, 'First Quarter', 86.00, 'Good', NULL, '2025-11-15 23:25:58', NULL),
(123, 2, 8, 'First Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(124, 2, 9, 'First Quarter', 88.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(125, 2, 10, 'First Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(126, 2, 6, 'Second Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(127, 2, 7, 'Second Quarter', 87.00, 'Good', NULL, '2025-11-15 23:25:58', NULL),
(128, 2, 8, 'Second Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(129, 2, 9, 'Second Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(130, 2, 10, 'Second Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(131, 2, 6, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(132, 2, 7, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(133, 2, 8, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(134, 2, 9, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(135, 2, 10, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(136, 2, 6, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(137, 2, 7, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(138, 2, 8, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(139, 2, 9, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(140, 2, 10, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(141, 4, 11, 'First Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(142, 4, 12, 'First Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(143, 4, 13, 'First Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(144, 4, 14, 'First Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(145, 4, 15, 'First Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(146, 4, 11, 'Second Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(147, 4, 12, 'Second Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(148, 4, 13, 'Second Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(149, 4, 14, 'Second Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(150, 4, 15, 'Second Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(151, 4, 11, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(152, 4, 12, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(153, 4, 13, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(154, 4, 14, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(155, 4, 15, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(156, 4, 11, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(157, 4, 12, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(158, 4, 13, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(159, 4, 14, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(160, 4, 15, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(161, 7, 16, 'First Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(162, 7, 17, 'First Quarter', 89.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(163, 7, 18, 'First Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(164, 7, 19, 'First Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(165, 7, 20, 'First Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(166, 7, 16, 'Second Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(167, 7, 17, 'Second Quarter', 90.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(168, 7, 18, 'Second Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(169, 7, 19, 'Second Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(170, 7, 20, 'Second Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(171, 7, 16, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(172, 7, 17, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(173, 7, 18, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(174, 7, 19, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(175, 7, 20, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(176, 7, 16, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(177, 7, 17, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(178, 7, 18, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(179, 7, 19, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(180, 7, 20, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(181, 11, 21, 'First Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(182, 11, 22, 'First Quarter', 91.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(183, 11, 23, 'First Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(184, 11, 24, 'First Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(185, 11, 25, 'First Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(186, 11, 21, 'Second Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(187, 11, 22, 'Second Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(188, 11, 23, 'Second Quarter', 96.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(189, 11, 24, 'Second Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(190, 11, 25, 'Second Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(191, 11, 21, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(192, 11, 22, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(193, 11, 23, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(194, 11, 24, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(195, 11, 25, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(196, 11, 21, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(197, 11, 22, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(198, 11, 23, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(199, 11, 24, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(200, 11, 25, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(201, 16, 26, 'First Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(202, 16, 27, 'First Quarter', 92.00, 'Very Good', NULL, '2025-11-15 23:25:58', NULL),
(203, 16, 28, 'First Quarter', 96.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(204, 16, 29, 'First Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(205, 16, 30, 'First Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(206, 16, 26, 'Second Quarter', 95.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(207, 16, 27, 'Second Quarter', 93.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(208, 16, 28, 'Second Quarter', 97.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(209, 16, 29, 'Second Quarter', 94.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(210, 16, 30, 'Second Quarter', 96.00, 'Excellent', NULL, '2025-11-15 23:25:58', NULL),
(211, 16, 26, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(212, 16, 27, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(213, 16, 28, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(214, 16, 29, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(215, 16, 30, 'Third Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(216, 16, 26, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(217, 16, 27, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(218, 16, 28, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(219, 16, 29, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL),
(220, 16, 30, 'Fourth Quarter', NULL, 'N/A', NULL, '2025-11-15 23:25:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `gradelevel`
--

CREATE TABLE `gradelevel` (
  `GradeLevelID` int(11) NOT NULL,
  `LevelName` varchar(50) NOT NULL,
  `SortOrder` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gradelevel`
--

INSERT INTO `gradelevel` (`GradeLevelID`, `LevelName`, `SortOrder`) VALUES
(1, 'Grade 1', 1),
(2, 'Grade 2', 2),
(3, 'Grade 3', 3),
(4, 'Grade 4', 4),
(5, 'Grade 5', 5),
(6, 'Grade 6', 6);

-- --------------------------------------------------------

--
-- Table structure for table `gradestatus`
--

CREATE TABLE `gradestatus` (
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guardian`
--

CREATE TABLE `guardian` (
  `GuardianID` int(11) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedEmailAddress` varbinary(255) DEFAULT NULL,
  `Occupation` varchar(100) DEFAULT NULL,
  `WorkAddress` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guardian`
--

INSERT INTO `guardian` (`GuardianID`, `FullName`, `EncryptedPhoneNumber`, `EncryptedEmailAddress`, `Occupation`, `WorkAddress`) VALUES
(1, 'Roberto Alvarez', 0x2b363339313731323334353031, 0x726f626572746f2e616c766172657a40656d61696c2e636f6d, 'Engineer', NULL),
(2, 'Carmen Alvarez', 0x2b363339313731323334353032, 0x6361726d656e2e616c766172657a40656d61696c2e636f6d, 'Teacher', NULL),
(3, 'Fernando Torres', 0x2b363339313831323334353031, 0x6665726e616e646f2e746f7272657340656d61696c2e636f6d, 'Business Owner', NULL),
(4, 'Linda Torres', 0x2b363339313831323334353032, 0x6c696e64612e746f7272657340656d61696c2e636f6d, 'Nurse', NULL),
(5, 'Ricardo Ramos', 0x2b363339313931323334353031, 0x7269636172646f2e72616d6f7340656d61696c2e636f6d, 'Lawyer', NULL),
(6, 'Patricia Ramos', 0x2b363339313931323334353032, 0x70617472696369612e72616d6f7340656d61696c2e636f6d, 'Doctor', NULL),
(7, 'Manuel Santos', 0x2b363339323031323334353031, 0x6d616e75656c2e73616e746f7340656d61696c2e636f6d, 'Accountant', NULL),
(8, 'Teresa Santos', 0x2b363339323031323334353032, 0x7465726573612e73616e746f7340656d61696c2e636f6d, 'HR Manager', NULL),
(9, 'Jorge Castro', 0x2b363339323131323334353031, 0x6a6f7267652e63617374726f40656d61696c2e636f6d, 'Architect', NULL),
(10, 'Elena Castro', 0x2b363339323131323334353032, 0x656c656e612e63617374726f40656d61696c2e636f6d, 'Interior Designer', NULL),
(11, 'Francisco Morales', 0x2b363339323231323334353031, 0x6672616e636973636f2e6d6f72616c657340656d61696c2e636f6d, 'Bank Manager', NULL),
(12, 'Gloria Morales', 0x2b363339323231323334353032, 0x676c6f7269612e6d6f72616c657340656d61696c2e636f6d, 'Marketing Director', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `guardprofile`
--

CREATE TABLE `guardprofile` (
  `GuardProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `itemtype`
--

CREATE TABLE `itemtype` (
  `ItemTypeID` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `itemtype`
--

INSERT INTO `itemtype` (`ItemTypeID`, `TypeName`, `IsActive`, `SortOrder`) VALUES
(1, 'Tuition Fee', 1, 1),
(2, 'Miscellaneous Fee', 1, 2),
(3, 'Books', 1, 3),
(4, 'Uniform', 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `medicalinfo`
--

CREATE TABLE `medicalinfo` (
  `MedicalInfoID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `Weight` decimal(5,2) DEFAULT NULL COMMENT 'In kilograms',
  `Height` decimal(5,2) DEFAULT NULL COMMENT 'In centimeters',
  `EncryptedAllergies` blob DEFAULT NULL,
  `EncryptedMedicalConditions` blob DEFAULT NULL,
  `EncryptedMedications` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicalinfo`
--

INSERT INTO `medicalinfo` (`MedicalInfoID`, `StudentProfileID`, `Weight`, `Height`, `EncryptedAllergies`, `EncryptedMedicalConditions`, `EncryptedMedications`) VALUES
(1, 1, 22.50, 115.00, 0x4e6f6e65, 0x4e6f6e65, NULL),
(2, 2, 25.00, 120.00, 0x5065616e757473, 0x417374686d6120284d696c6429, NULL),
(3, 3, 28.00, 125.00, 0x4e6f6e65, 0x4e6f6e65, NULL),
(4, 4, 32.00, 135.00, 0x5368656c6c66697368, 0x4e6f6e65, NULL),
(5, 5, 35.00, 140.00, 0x4e6f6e65, 0x4e6f6e65, NULL),
(6, 6, 38.00, 145.00, 0x4e6f6e65, 0x4d796f7069612028576561727320676c617373657329, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notificationlog`
--

CREATE TABLE `notificationlog` (
  `LogID` int(11) NOT NULL,
  `RecipientUserID` int(11) NOT NULL,
  `NotificationTypeID` int(11) DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `SentAt` datetime NOT NULL DEFAULT current_timestamp(),
  `IsRead` tinyint(1) NOT NULL DEFAULT 0,
  `NotificationStatus` enum('Sent','Failed','Pending','Delivered','Read') NOT NULL,
  `ErrorMessage` text DEFAULT NULL,
  `RetryCount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notificationtype`
--

CREATE TABLE `notificationtype` (
  `NotificationTypeID` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL,
  `TemplateContent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `participationlevel`
--

CREATE TABLE `participationlevel` (
  `ParticipationLevelID` int(11) NOT NULL,
  `LevelName` varchar(100) NOT NULL,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `participationrating`
--

CREATE TABLE `participationrating` (
  `ParticipationRatingID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `Rating` int(11) NOT NULL CHECK (`Rating` >= 1 and `Rating` <= 5),
  `Remark` varchar(100) DEFAULT NULL,
  `EvaluatedByUserID` int(11) DEFAULT NULL,
  `EvaluationDate` datetime NOT NULL DEFAULT current_timestamp(),
  `LastUpdated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `participationrating`
--

INSERT INTO `participationrating` (`ParticipationRatingID`, `StudentProfileID`, `SchoolYearID`, `Rating`, `Remark`, `EvaluatedByUserID`, `EvaluationDate`, `LastUpdated`) VALUES
(1, 1, 6, 4, 'Good participation', 1, '2024-11-15 10:00:00', '2025-11-15 23:25:58'),
(2, 2, 6, 5, 'Excellent participation', 2, '2024-11-15 10:00:00', '2025-11-15 23:25:58'),
(3, 3, 6, 5, 'Outstanding participation', 3, '2024-11-15 10:00:00', '2025-11-15 23:25:58'),
(4, 4, 6, 4, 'Very good participation', 4, '2024-11-15 10:00:00', '2025-11-15 23:25:58'),
(5, 5, 6, 5, 'Excellent class involvement', 5, '2024-11-15 10:00:00', '2025-11-15 23:25:58'),
(6, 6, 6, 5, 'Outstanding leadership', 6, '2024-11-15 10:00:00', '2025-11-15 23:25:58');

-- --------------------------------------------------------

--
-- Table structure for table `passwordhistory`
--

CREATE TABLE `passwordhistory` (
  `HistoryID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `passwordpolicy`
--

CREATE TABLE `passwordpolicy` (
  `PolicyID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `PasswordSetDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ExpiryDate` datetime DEFAULT NULL,
  `MustChange` tinyint(1) NOT NULL DEFAULT 0,
  `FailedLoginAttempts` int(11) NOT NULL DEFAULT 0,
  `LockedUntil` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `passwordpolicy`
--

INSERT INTO `passwordpolicy` (`PolicyID`, `UserID`, `PasswordHash`, `PasswordSetDate`, `ExpiryDate`, `MustChange`, `FailedLoginAttempts`, `LockedUntil`) VALUES
(1, 1, '$2y$10$TeacherHash1xxxxxxxxxx', '2019-07-01 09:00:00', NULL, 0, 0, NULL),
(2, 2, '$2y$10$TeacherHash2xxxxxxxxxx', '2019-07-01 09:00:00', NULL, 0, 0, NULL),
(3, 3, '$2y$10$TeacherHash3xxxxxxxxxx', '2019-07-01 09:00:00', NULL, 0, 0, NULL),
(4, 4, '$2y$10$TeacherHash4xxxxxxxxxx', '2019-07-01 09:00:00', NULL, 0, 0, NULL),
(5, 5, '$2y$10$TeacherHash5xxxxxxxxxx', '2019-07-01 09:00:00', NULL, 0, 0, NULL),
(6, 6, '$2y$10$TeacherHash6xxxxxxxxxx', '2019-07-01 09:00:00', NULL, 0, 0, NULL),
(7, 7, '$2y$10$StudentHash1xxxxxxxxxx', '2024-07-15 10:00:00', NULL, 0, 0, NULL),
(8, 8, '$2y$10$StudentHash2xxxxxxxxxx', '2023-07-15 10:00:00', NULL, 0, 0, NULL),
(9, 9, '$2y$10$StudentHash3xxxxxxxxxx', '2022-07-15 10:00:00', NULL, 0, 0, NULL),
(10, 10, '$2y$10$StudentHash4xxxxxxxxxx', '2021-07-15 10:00:00', NULL, 0, 0, NULL),
(11, 11, '$2y$10$y0zXgrezTPpMJ7JMWHUee.EnyNPPinfXoy2Z8iFHWooh9Qy7yx2iq', '2025-11-15 23:27:27', NULL, 0, 0, NULL),
(12, 12, '$2y$10$/Cu/dWq6VidK.T6b27kcZ.8M4RWGOv4ReOlOAk6/TG5rzhd9CWfu6', '2025-11-19 19:14:38', NULL, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `TokenID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `ExpiresAt` datetime NOT NULL,
  `IsUsed` tinyint(1) NOT NULL DEFAULT 0,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`TokenID`, `UserID`, `Token`, `ExpiresAt`, `IsUsed`, `CreatedAt`) VALUES
(1, 11, '0bd965af3b035cc462b855d3a88cb9a1ceaf94037aab96cc283275369c08dd2c', '2025-11-16 00:27:04', 1, '2025-11-15 23:27:04'),
(2, 11, 'ed0ca4156c0a8b589301c3780525fad61027488a56d3e074aa0563523f1d3808', '2025-11-19 19:47:34', 0, '2025-11-19 18:47:34'),
(3, 11, 'f8c39c9786467fec505e0e36aabf5e5b064cba34d4ada06889353937167654cf', '2025-11-19 19:48:27', 0, '2025-11-19 18:48:27'),
(4, 11, '18bd3f982bf9d2e2011560d855f267ca6e1adb7ef3128e43b09a386eb0decada', '2025-11-19 19:50:39', 0, '2025-11-19 18:50:39'),
(5, 11, 'd3bdc5669fe0d614779acaf7079fbd2ff93cdf0a9ac7b89ebf7ad2014bdf40b7', '2025-11-19 19:50:50', 0, '2025-11-19 18:50:50'),
(6, 11, 'c047fd2bd46e08355f14583646407d12092e97b7fab4345897dd5dca0e9159b5', '2025-11-19 19:58:35', 0, '2025-11-19 18:58:35'),
(7, 12, '409e4cd4254515417ea0fb10753071809088225124f1c91e8561872473c7ae5a', '2025-11-19 20:14:01', 1, '2025-11-19 19:14:01');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `PaymentID` int(11) NOT NULL,
  `TransactionID` int(11) NOT NULL,
  `PaymentMethodID` int(11) NOT NULL,
  `AmountPaid` decimal(10,2) NOT NULL,
  `PaymentDateTime` datetime NOT NULL DEFAULT current_timestamp(),
  `ReferenceNumber` varchar(255) DEFAULT NULL,
  `ProofFileID` int(11) DEFAULT NULL,
  `VerificationStatus` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
  `VerifiedByUserID` int(11) DEFAULT NULL,
  `VerifiedAt` datetime DEFAULT NULL,
  `RejectionReason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`PaymentID`, `TransactionID`, `PaymentMethodID`, `AmountPaid`, `PaymentDateTime`, `ReferenceNumber`, `ProofFileID`, `VerificationStatus`, `VerifiedByUserID`, `VerifiedAt`, `RejectionReason`) VALUES
(1, 1, 1, 10000.00, '2024-08-05 10:00:00', NULL, NULL, 'Verified', 1, NULL, NULL),
(2, 1, 2, 5000.00, '2024-09-10 14:30:00', NULL, NULL, 'Verified', 1, NULL, NULL),
(3, 2, 2, 26000.00, '2024-08-03 09:00:00', NULL, NULL, 'Verified', 2, NULL, NULL),
(4, 4, 3, 10000.00, '2024-08-07 11:00:00', NULL, NULL, 'Verified', 4, NULL, NULL),
(5, 4, 1, 8000.00, '2024-10-15 15:00:00', NULL, NULL, 'Verified', 4, NULL, NULL),
(6, 5, 4, 29000.00, '2024-08-02 08:30:00', NULL, NULL, 'Verified', 5, NULL, NULL),
(7, 6, 2, 15000.00, '2024-08-06 10:30:00', NULL, NULL, 'Verified', 6, NULL, NULL),
(8, 6, 3, 5000.00, '2024-09-20 16:00:00', NULL, NULL, 'Verified', 6, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `paymentmethod`
--

CREATE TABLE `paymentmethod` (
  `PaymentMethodID` int(11) NOT NULL,
  `MethodName` varchar(100) NOT NULL,
  `MethodIcon` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paymentmethod`
--

INSERT INTO `paymentmethod` (`PaymentMethodID`, `MethodName`, `MethodIcon`, `IsActive`, `SortOrder`) VALUES
(1, 'Cash', NULL, 1, 1),
(2, 'Bank Transfer', NULL, 1, 2),
(3, 'GCash', NULL, 1, 3),
(4, 'Credit Card', NULL, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `PermissionID` int(11) NOT NULL,
  `PermissionCode` varchar(100) NOT NULL,
  `ModuleName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `ProfileID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `MiddleName` varchar(100) DEFAULT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedAddress` varbinary(512) DEFAULT NULL,
  `ProfilePictureURL` varchar(2048) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`ProfileID`, `UserID`, `FirstName`, `LastName`, `MiddleName`, `EncryptedPhoneNumber`, `EncryptedAddress`, `ProfilePictureURL`) VALUES
(1, 1, 'Maria', 'Santos', 'Luna', NULL, NULL, NULL),
(2, 2, 'Juan', 'Cruz', 'Dela Rosa', NULL, NULL, NULL),
(3, 3, 'Ana', 'Reyes', 'Bautista', NULL, NULL, NULL),
(4, 4, 'Pedro', 'Garcia', 'Ramos', NULL, NULL, NULL),
(5, 5, 'Rosa', 'Fernandez', 'Villanueva', NULL, NULL, NULL),
(6, 6, 'Carlos', 'Mendoza', 'Torres', NULL, NULL, NULL),
(7, 7, 'Sofia', 'Alvarez', 'Maria', 0x2b363339313731323334353637, 0x313233204d61696e2053742c204d616e696c61, NULL),
(8, 8, 'Miguel', 'Torres', 'Jose', 0x2b363339313831323334353637, 0x343536204f616b204176652c205175657a6f6e2043697479, NULL),
(9, 9, 'Isabella', 'Ramos', 'Cruz', 0x2b363339313931323334353637, 0x3738392050696e652052642c204d616b617469, NULL),
(10, 10, 'Gabriel', 'Santos', 'Luis', 0x2b363339323031323334353637, 0x33323120456c6d2053742c205061736967, NULL),
(11, 11, 'Valentina', 'Castro', 'Isabel', 0x2b363339323131323334353637, 0x363534204d61706c652044722c204d616e64616c75796f6e67, NULL),
(12, 12, 'Diego', 'Morales', 'Antonio', 0x2b363339323231323334353637, 0x393837204365646172204c6e2c20546167756967, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `registrarprofile`
--

CREATE TABLE `registrarprofile` (
  `RegistrarProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `requirementtype`
--

CREATE TABLE `requirementtype` (
  `RequirementTypeID` int(11) NOT NULL,
  `TypeName` varchar(255) NOT NULL,
  `IsMandatory` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `RoleID` int(11) NOT NULL,
  `RoleName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rolepermission`
--

CREATE TABLE `rolepermission` (
  `RolePermissionID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `PermissionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedulestatus`
--

CREATE TABLE `schedulestatus` (
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schoolyear`
--

CREATE TABLE `schoolyear` (
  `SchoolYearID` int(11) NOT NULL,
  `YearName` varchar(50) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schoolyear`
--

INSERT INTO `schoolyear` (`SchoolYearID`, `YearName`, `StartDate`, `EndDate`, `IsActive`) VALUES
(1, 'S.Y. 2019-2020', '2019-08-01', '2020-05-31', 0),
(2, 'S.Y. 2020-2021', '2020-08-01', '2021-05-31', 0),
(3, 'S.Y. 2021-2022', '2021-08-01', '2022-05-31', 0),
(4, 'S.Y. 2022-2023', '2022-08-01', '2023-05-31', 0),
(5, 'S.Y. 2023-2024', '2023-08-01', '2024-05-31', 0),
(6, 'S.Y. 2024-2025', '2024-08-01', '2025-05-31', 1);

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `SectionID` int(11) NOT NULL,
  `GradeLevelID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `AdviserTeacherID` int(11) DEFAULT NULL,
  `SectionName` varchar(100) NOT NULL,
  `MaxCapacity` int(11) DEFAULT NULL,
  `CurrentEnrollment` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`SectionID`, `GradeLevelID`, `SchoolYearID`, `AdviserTeacherID`, `SectionName`, `MaxCapacity`, `CurrentEnrollment`) VALUES
(1, 1, 6, 1, 'St. Peter', 30, 1),
(2, 2, 6, 2, 'St. Paul', 30, 1),
(3, 3, 6, 3, 'St. John', 30, 1),
(4, 4, 6, 4, 'St. Mark', 30, 1),
(5, 5, 6, 5, 'St. Luke', 30, 1),
(6, 6, 6, 6, 'St. Matthew', 30, 1),
(7, 1, 1, 1, 'St. Peter', 30, 0),
(8, 1, 2, 1, 'St. Peter', 30, 0),
(9, 2, 2, 2, 'St. Paul', 30, 0),
(10, 1, 3, 1, 'St. Peter', 30, 0),
(11, 2, 3, 2, 'St. Paul', 30, 0),
(12, 3, 3, 3, 'St. John', 30, 0),
(13, 1, 4, 1, 'St. Peter', 30, 0),
(14, 2, 4, 2, 'St. Paul', 30, 0),
(15, 3, 4, 3, 'St. John', 30, 0),
(16, 4, 4, 4, 'St. Mark', 30, 0),
(17, 1, 5, 1, 'St. Peter', 30, 0),
(18, 2, 5, 2, 'St. Paul', 30, 0),
(19, 3, 5, 3, 'St. John', 30, 0),
(20, 4, 5, 4, 'St. Mark', 30, 0),
(21, 5, 5, 5, 'St. Luke', 30, 0);

-- --------------------------------------------------------

--
-- Table structure for table `securefile`
--

CREATE TABLE `securefile` (
  `FileID` int(11) NOT NULL,
  `OriginalFileName` varchar(255) NOT NULL,
  `StoredFileName` varchar(255) NOT NULL,
  `FilePath` varchar(1024) NOT NULL,
  `FileSize` bigint(20) NOT NULL COMMENT 'In bytes',
  `MimeType` varchar(100) NOT NULL,
  `FileHash` varchar(255) DEFAULT NULL,
  `UploadedByUserID` int(11) DEFAULT NULL,
  `UploadedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `EncryptionMethod` varchar(50) DEFAULT NULL,
  `AccessLevel` varchar(50) DEFAULT 'private',
  `ExpiryDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `studentguardian`
--

CREATE TABLE `studentguardian` (
  `StudentGuardianID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `GuardianID` int(11) NOT NULL,
  `RelationshipType` enum('Father','Mother','Guardian','Sibling','Other') NOT NULL,
  `IsPrimaryContact` tinyint(1) NOT NULL DEFAULT 0,
  `IsEmergencyContact` tinyint(1) NOT NULL DEFAULT 0,
  `IsAuthorizedPickup` tinyint(1) NOT NULL DEFAULT 0,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentguardian`
--

INSERT INTO `studentguardian` (`StudentGuardianID`, `StudentProfileID`, `GuardianID`, `RelationshipType`, `IsPrimaryContact`, `IsEmergencyContact`, `IsAuthorizedPickup`, `SortOrder`) VALUES
(1, 1, 1, 'Father', 0, 0, 0, 0),
(2, 1, 2, 'Mother', 1, 0, 0, 0),
(3, 2, 3, 'Father', 1, 0, 0, 0),
(4, 2, 4, 'Mother', 0, 0, 0, 0),
(5, 3, 5, 'Father', 1, 0, 0, 0),
(6, 3, 6, 'Mother', 0, 0, 0, 0),
(7, 4, 7, 'Father', 0, 0, 0, 0),
(8, 4, 8, 'Mother', 1, 0, 0, 0),
(9, 5, 9, 'Father', 1, 0, 0, 0),
(10, 5, 10, 'Mother', 0, 0, 0, 0),
(11, 6, 11, 'Father', 0, 0, 0, 0),
(12, 6, 12, 'Mother', 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- Stand-in structure for view `studentlogindetails`
-- (See below for the actual view)
--
CREATE TABLE `studentlogindetails` (
`UserID` int(11)
,`StudentNumber` varchar(50)
,`PasswordHash` varchar(255)
,`FullName` varchar(201)
,`UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff')
,`AccountStatus` enum('Active','Inactive','Suspended','PendingVerification')
,`ProfileID` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `studentprofile`
--

CREATE TABLE `studentprofile` (
  `StudentProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `StudentNumber` varchar(50) NOT NULL,
  `QRCodeID` varchar(255) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Nationality` varchar(100) DEFAULT NULL,
  `StudentStatus` enum('Enrolled','Withdrawn','Graduated','On Leave') NOT NULL DEFAULT 'Enrolled',
  `ArchiveDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentprofile`
--

INSERT INTO `studentprofile` (`StudentProfileID`, `ProfileID`, `StudentNumber`, `QRCodeID`, `DateOfBirth`, `Gender`, `Nationality`, `StudentStatus`, `ArchiveDate`) VALUES
(1, 7, 'STU-2024-0001', NULL, '2018-03-15', 'Female', 'Filipino', 'Enrolled', NULL),
(2, 8, 'STU-2023-0001', NULL, '2017-05-20', 'Male', 'Filipino', 'Enrolled', NULL),
(3, 9, 'STU-2022-0001', NULL, '2016-08-10', 'Female', 'Filipino', 'Enrolled', NULL),
(4, 10, 'STU-2021-0001', NULL, '2015-11-25', 'Male', 'Filipino', 'Enrolled', NULL),
(5, 11, 'STU-2020-0001', NULL, '2014-02-14', 'Female', 'Filipino', 'Enrolled', NULL),
(6, 12, 'STU-2019-0001', NULL, '2013-07-08', 'Male', 'Filipino', 'Enrolled', NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `student_personal_info`
-- (See below for the actual view)
--
CREATE TABLE `student_personal_info` (
`UserID` int(11)
,`StudentProfileID` int(11)
,`ProfilePictureURL` varchar(2048)
,`FullName` varchar(302)
,`EmailAddress` varchar(255)
,`PhoneNumber` varchar(255)
,`Address` varchar(512)
,`StudentNumber` varchar(50)
,`DateOfBirth` date
,`Age` bigint(21)
,`Gender` varchar(20)
,`Nationality` varchar(100)
,`StudentStatus` enum('Enrolled','Withdrawn','Graduated','On Leave')
,`SchoolYear` varchar(50)
,`GradeAndSection` varchar(153)
,`AdviserName` varchar(201)
,`Weight` decimal(5,2)
,`Height` decimal(5,2)
,`Allergies` mediumtext
,`MedicalConditions` mediumtext
,`EmergencyContactPerson` varchar(255)
,`EmergencyContactNumber` varchar(255)
,`FatherName` varchar(255)
,`MotherName` varchar(255)
,`PrimaryGuardianName` varchar(255)
,`PrimaryGuardianRelationship` enum('Father','Mother','Guardian','Sibling','Other')
,`PrimaryGuardianContactNumber` varchar(255)
,`PrimaryGuardianEmail` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `SubjectID` int(11) NOT NULL,
  `SubjectName` varchar(100) NOT NULL,
  `SubjectCode` varchar(20) NOT NULL,
  `GradeLevelID` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`SubjectID`, `SubjectName`, `SubjectCode`, `GradeLevelID`, `IsActive`) VALUES
(1, 'English 1', 'ENG1', 1, 1),
(2, 'Math 1', 'MATH1', 1, 1),
(3, 'Filipino 1', 'FIL1', 1, 1),
(4, 'MAPEH 1', 'MAPEH1', 1, 1),
(5, 'Araling Panlipunan 1', 'AP1', 1, 1),
(6, 'English 2', 'ENG2', 2, 1),
(7, 'Math 2', 'MATH2', 2, 1),
(8, 'Filipino 2', 'FIL2', 2, 1),
(9, 'MAPEH 2', 'MAPEH2', 2, 1),
(10, 'Araling Panlipunan 2', 'AP2', 2, 1),
(11, 'English 3', 'ENG3', 3, 1),
(12, 'Math 3', 'MATH3', 3, 1),
(13, 'Filipino 3', 'FIL3', 3, 1),
(14, 'MAPEH 3', 'MAPEH3', 3, 1),
(15, 'Araling Panlipunan 3', 'AP3', 3, 1),
(16, 'English 4', 'ENG4', 4, 1),
(17, 'Math 4', 'MATH4', 4, 1),
(18, 'Filipino 4', 'FIL4', 4, 1),
(19, 'MAPEH 4', 'MAPEH4', 4, 1),
(20, 'Araling Panlipunan 4', 'AP4', 4, 1),
(21, 'English 5', 'ENG5', 5, 1),
(22, 'Math 5', 'MATH5', 5, 1),
(23, 'Filipino 5', 'FIL5', 5, 1),
(24, 'MAPEH 5', 'MAPEH5', 5, 1),
(25, 'Araling Panlipunan 5', 'AP5', 5, 1),
(26, 'English 6', 'ENG6', 6, 1),
(27, 'Math 6', 'MATH6', 6, 1),
(28, 'Filipino 6', 'FIL6', 6, 1),
(29, 'MAPEH 6', 'MAPEH6', 6, 1),
(30, 'Araling Panlipunan 6', 'AP6', 6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `supportticket`
--

CREATE TABLE `supportticket` (
  `TicketID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Subject` varchar(255) NOT NULL,
  `TicketStatus` enum('Open','In Progress','On Hold','Closed') NOT NULL DEFAULT 'Open',
  `TicketPriority` enum('Low','Medium','High','Urgent') NOT NULL DEFAULT 'Medium',
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `ResolvedAt` datetime DEFAULT NULL,
  `AssignedToUserID` int(11) DEFAULT NULL,
  `ResolvedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacherprofile`
--

CREATE TABLE `teacherprofile` (
  `TeacherProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `Specialization` varchar(255) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacherprofile`
--

INSERT INTO `teacherprofile` (`TeacherProfileID`, `ProfileID`, `EmployeeNumber`, `Specialization`, `HireDate`) VALUES
(1, 1, 'T-2019-001', 'Elementary Education - Grade 1', '2019-07-01'),
(2, 2, 'T-2019-002', 'Elementary Education - Grade 2', '2019-07-01'),
(3, 3, 'T-2019-003', 'Elementary Education - Grade 3', '2019-07-01'),
(4, 4, 'T-2019-004', 'Elementary Education - Grade 4', '2019-07-01'),
(5, 5, 'T-2019-005', 'Elementary Education - Grade 5', '2019-07-01'),
(6, 6, 'T-2019-006', 'Elementary Education - Grade 6', '2019-07-01');

-- --------------------------------------------------------

--
-- Table structure for table `ticketmessage`
--

CREATE TABLE `ticketmessage` (
  `MessageID` int(11) NOT NULL,
  `TicketID` int(11) NOT NULL,
  `SenderUserID` int(11) NOT NULL,
  `Message` text NOT NULL,
  `AttachmentFileID` int(11) DEFAULT NULL,
  `SentAt` datetime NOT NULL DEFAULT current_timestamp(),
  `IsInternal` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `TransactionID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `IssueDate` date NOT NULL,
  `DueDate` date DEFAULT NULL,
  `TotalAmount` decimal(10,2) NOT NULL,
  `PaidAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `BalanceAmount` decimal(10,2) GENERATED ALWAYS AS (`TotalAmount` - `PaidAmount`) STORED,
  `TransactionStatusID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`TransactionID`, `StudentProfileID`, `SchoolYearID`, `IssueDate`, `DueDate`, `TotalAmount`, `PaidAmount`, `TransactionStatusID`) VALUES
(1, 1, 6, '2024-08-01', '2025-03-31', 25000.00, 15000.00, 2),
(2, 2, 6, '2024-08-01', '2025-03-31', 26000.00, 26000.00, 1),
(3, 3, 6, '2024-08-01', '2025-03-31', 27000.00, 0.00, 3),
(4, 4, 6, '2024-08-01', '2025-03-31', 28000.00, 18000.00, 2),
(5, 5, 6, '2024-08-01', '2025-03-31', 29000.00, 29000.00, 1),
(6, 6, 6, '2024-08-01', '2025-03-31', 30000.00, 20000.00, 2);

-- --------------------------------------------------------

--
-- Table structure for table `transactionitem`
--

CREATE TABLE `transactionitem` (
  `ItemID` int(11) NOT NULL,
  `TransactionID` int(11) NOT NULL,
  `ItemTypeID` int(11) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactionitem`
--

INSERT INTO `transactionitem` (`ItemID`, `TransactionID`, `ItemTypeID`, `Description`, `Amount`, `Quantity`) VALUES
(1, 1, 1, 'Tuition Fee - Grade 1 SY 2024-2025', 20000.00, 1),
(2, 1, 2, 'Miscellaneous Fee - Grade 1', 3000.00, 1),
(3, 1, 3, 'Books - Grade 1', 1500.00, 1),
(4, 1, 4, 'School Uniform', 500.00, 1),
(5, 2, 1, 'Tuition Fee - Grade 2 SY 2024-2025', 21000.00, 1),
(6, 2, 2, 'Miscellaneous Fee - Grade 2', 3000.00, 1),
(7, 2, 3, 'Books - Grade 2', 1500.00, 1),
(8, 2, 4, 'School Uniform', 500.00, 1),
(9, 3, 1, 'Tuition Fee - Grade 3 SY 2024-2025', 22000.00, 1),
(10, 3, 2, 'Miscellaneous Fee - Grade 3', 3000.00, 1),
(11, 3, 3, 'Books - Grade 3', 1500.00, 1),
(12, 3, 4, 'School Uniform', 500.00, 1),
(13, 4, 1, 'Tuition Fee - Grade 4 SY 2024-2025', 23000.00, 1),
(14, 4, 2, 'Miscellaneous Fee - Grade 4', 3000.00, 1),
(15, 4, 3, 'Books - Grade 4', 1500.00, 1),
(16, 4, 4, 'School Uniform', 500.00, 1),
(17, 5, 1, 'Tuition Fee - Grade 5 SY 2024-2025', 24000.00, 1),
(18, 5, 2, 'Miscellaneous Fee - Grade 5', 3000.00, 1),
(19, 5, 3, 'Books - Grade 5', 1500.00, 1),
(20, 5, 4, 'School Uniform', 500.00, 1),
(21, 6, 1, 'Tuition Fee - Grade 6 SY 2024-2025', 25000.00, 1),
(22, 6, 2, 'Miscellaneous Fee - Grade 6', 3000.00, 1),
(23, 6, 3, 'Books - Grade 6', 1500.00, 1),
(24, 6, 4, 'School Uniform', 500.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `transactionstatus`
--

CREATE TABLE `transactionstatus` (
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(50) NOT NULL,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactionstatus`
--

INSERT INTO `transactionstatus` (`StatusID`, `StatusName`, `SortOrder`) VALUES
(1, 'Paid', 1),
(2, 'Partially Paid', 2),
(3, 'Unpaid', 3),
(4, 'Overdue', 4);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `EmailAddress` varchar(255) NOT NULL,
  `UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff') NOT NULL,
  `AccountStatus` enum('Active','Inactive','Suspended','PendingVerification') NOT NULL DEFAULT 'PendingVerification',
  `LastLoginDate` datetime DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `DeletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `EmailAddress`, `UserType`, `AccountStatus`, `LastLoginDate`, `CreatedAt`, `UpdatedAt`, `IsDeleted`, `DeletedAt`) VALUES
(1, 'maria.santos@school.edu', 'Teacher', 'Active', NULL, '2019-07-01 09:00:00', '2025-11-15 23:25:58', 0, NULL),
(2, 'juan.cruz@school.edu', 'Teacher', 'Active', NULL, '2019-07-01 09:00:00', '2025-11-15 23:25:58', 0, NULL),
(3, 'ana.reyes@school.edu', 'Teacher', 'Active', NULL, '2019-07-01 09:00:00', '2025-11-15 23:25:58', 0, NULL),
(4, 'pedro.garcia@school.edu', 'Teacher', 'Active', NULL, '2019-07-01 09:00:00', '2025-11-15 23:25:58', 0, NULL),
(5, 'rosa.fernandez@school.edu', 'Teacher', 'Active', NULL, '2019-07-01 09:00:00', '2025-11-15 23:25:58', 0, NULL),
(6, '11', 'Teacher', 'Active', NULL, '2019-07-01 09:00:00', '2025-11-19 19:13:27', 0, NULL),
(7, 'sofia.alvarez@school.edu', 'Student', 'Active', NULL, '2024-07-15 10:00:00', '2025-11-15 23:25:58', 0, NULL),
(8, 'miguel.torres@school.edu', 'Student', 'Active', NULL, '2023-07-15 10:00:00', '2025-11-15 23:25:58', 0, NULL),
(9, 'isabella.ramos@school.edu', 'Student', 'Active', NULL, '2022-07-15 10:00:00', '2025-11-15 23:25:58', 0, NULL),
(10, 'gabriel.santos@school.edu', 'Student', 'Active', NULL, '2021-07-15 10:00:00', '2025-11-15 23:25:58', 0, NULL),
(11, 'johnrey', 'Student', 'Active', NULL, '2020-07-15 10:00:00', '2025-11-19 19:13:40', 0, NULL),
(12, 'johnreybisnarcalipes@gmail.com', 'Student', 'Active', NULL, '2019-07-15 10:00:00', '2025-11-19 19:13:51', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `userrole`
--

CREATE TABLE `userrole` (
  `UserRoleID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `AssignedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ExpiryDate` datetime DEFAULT NULL,
  `AssignedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usersettings`
--

CREATE TABLE `usersettings` (
  `SettingsID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Theme` varchar(50) DEFAULT 'default',
  `AccentColor` varchar(20) DEFAULT '#007bff',
  `NotificationPreferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`NotificationPreferences`)),
  `TwoFactorEnabled` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_admission_applications`
-- (See below for the actual view)
--
CREATE TABLE `vw_admission_applications` (
`ApplicationID` int(11)
,`TrackingNumber` varchar(50)
,`EnrolleeType` enum('New','Old','Transferee')
,`ApplicationStatus` enum('Pending','For Review','Approved','Rejected','Waitlisted')
,`SubmissionDate` datetime
,`ReviewedDate` datetime
,`PreviousSchool` varchar(255)
,`StudentFirstName` varchar(100)
,`StudentLastName` varchar(100)
,`Birthdate` date
,`Gender` varchar(20)
,`Address` varchar(512)
,`ContactNumber` varchar(255)
,`EmailAddress` varchar(255)
,`GuardianFirstName` varchar(100)
,`GuardianLastName` varchar(100)
,`Relationship` varchar(50)
,`GuardianContact` varchar(20)
,`GuardianEmail` varchar(255)
,`GradeLevel` varchar(50)
,`GradeLevelID` int(11)
,`SchoolYear` varchar(50)
,`SchoolYearID` int(11)
,`ApplicantProfileID` int(11)
,`TemporaryApplicantID` int(11)
,`ReviewedByUserID` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_student_auth`
-- (See below for the actual view)
--
CREATE TABLE `vw_student_auth` (
`UserID` int(11)
,`EmailAddress` varchar(255)
,`UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff')
,`AccountStatus` enum('Active','Inactive','Suspended','PendingVerification')
,`LastLoginDate` datetime
,`UserCreatedAt` datetime
,`IsDeleted` tinyint(1)
,`ProfileID` int(11)
,`FirstName` varchar(100)
,`LastName` varchar(100)
,`MiddleName` varchar(100)
,`FullName` varchar(302)
,`EncryptedPhoneNumber` varbinary(255)
,`EncryptedAddress` varbinary(512)
,`ProfilePictureURL` varchar(2048)
,`StudentProfileID` int(11)
,`StudentNumber` varchar(50)
,`QRCodeID` varchar(255)
,`DateOfBirth` date
,`Gender` varchar(20)
,`Nationality` varchar(100)
,`StudentStatus` enum('Enrolled','Withdrawn','Graduated','On Leave')
,`ArchiveDate` date
,`PasswordHash` varchar(255)
,`PasswordSetDate` datetime
,`ExpiryDate` datetime
,`MustChange` tinyint(1)
,`FailedLoginAttempts` int(11)
,`LockedUntil` datetime
,`LoginStatus` varchar(12)
,`Age` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_teacher_login_details`
-- (See below for the actual view)
--
CREATE TABLE `vw_teacher_login_details` (
`UserID` int(11)
,`EmailAddress` varchar(255)
,`PasswordHash` varchar(255)
,`AccountStatus` enum('Active','Inactive','Suspended','PendingVerification')
,`FirstName` varchar(100)
,`LastName` varchar(100)
);

-- --------------------------------------------------------

--
-- Structure for view `studentlogindetails`
--
DROP TABLE IF EXISTS `studentlogindetails`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `studentlogindetails`  AS SELECT `u`.`UserID` AS `UserID`, `sp`.`StudentNumber` AS `StudentNumber`, `pp`.`PasswordHash` AS `PasswordHash`, concat(`p`.`FirstName`,' ',`p`.`LastName`) AS `FullName`, `u`.`UserType` AS `UserType`, `u`.`AccountStatus` AS `AccountStatus`, `p`.`ProfileID` AS `ProfileID` FROM (((`studentprofile` `sp` join `profile` `p` on(`sp`.`ProfileID` = `p`.`ProfileID`)) join `user` `u` on(`p`.`UserID` = `u`.`UserID`)) join `passwordpolicy` `pp` on(`u`.`UserID` = `pp`.`UserID`)) WHERE `u`.`UserType` = 'Student' ;

-- --------------------------------------------------------

--
-- Structure for view `student_personal_info`
--
DROP TABLE IF EXISTS `student_personal_info`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `student_personal_info`  AS SELECT `u`.`UserID` AS `UserID`, `sp`.`StudentProfileID` AS `StudentProfileID`, `p`.`ProfilePictureURL` AS `ProfilePictureURL`, concat_ws(' ',`p`.`FirstName`,`p`.`MiddleName`,`p`.`LastName`) AS `FullName`, `u`.`EmailAddress` AS `EmailAddress`, cast(`p`.`EncryptedPhoneNumber` as char charset utf8mb4) AS `PhoneNumber`, cast(`p`.`EncryptedAddress` as char charset utf8mb4) AS `Address`, `sp`.`StudentNumber` AS `StudentNumber`, `sp`.`DateOfBirth` AS `DateOfBirth`, timestampdiff(YEAR,`sp`.`DateOfBirth`,curdate()) AS `Age`, `sp`.`Gender` AS `Gender`, `sp`.`Nationality` AS `Nationality`, `sp`.`StudentStatus` AS `StudentStatus`, `sy`.`YearName` AS `SchoolYear`, concat(`gl`.`LevelName`,' - ',`sec`.`SectionName`) AS `GradeAndSection`, concat_ws(' ',`adviser_profile`.`FirstName`,`adviser_profile`.`LastName`) AS `AdviserName`, `mi`.`Weight` AS `Weight`, `mi`.`Height` AS `Height`, cast(`mi`.`EncryptedAllergies` as char charset utf8mb4) AS `Allergies`, cast(`mi`.`EncryptedMedicalConditions` as char charset utf8mb4) AS `MedicalConditions`, `ec`.`ContactPerson` AS `EmergencyContactPerson`, cast(`ec`.`EncryptedContactNumber` as char charset utf8mb4) AS `EmergencyContactNumber`, (select `g`.`FullName` from (`guardian` `g` join `studentguardian` `sg` on(`g`.`GuardianID` = `sg`.`GuardianID`)) where `sg`.`StudentProfileID` = `sp`.`StudentProfileID` and `sg`.`RelationshipType` = 'Father' limit 1) AS `FatherName`, (select `g`.`FullName` from (`guardian` `g` join `studentguardian` `sg` on(`g`.`GuardianID` = `sg`.`GuardianID`)) where `sg`.`StudentProfileID` = `sp`.`StudentProfileID` and `sg`.`RelationshipType` = 'Mother' limit 1) AS `MotherName`, `g_primary`.`FullName` AS `PrimaryGuardianName`, `sg_primary`.`RelationshipType` AS `PrimaryGuardianRelationship`, cast(`g_primary`.`EncryptedPhoneNumber` as char charset utf8mb4) AS `PrimaryGuardianContactNumber`, cast(`g_primary`.`EncryptedEmailAddress` as char charset utf8mb4) AS `PrimaryGuardianEmail` FROM ((((((((((((`user` `u` join `profile` `p` on(`u`.`UserID` = `p`.`UserID`)) join `studentprofile` `sp` on(`p`.`ProfileID` = `sp`.`ProfileID`)) left join (select `e_inner`.`EnrollmentID` AS `EnrollmentID`,`e_inner`.`StudentProfileID` AS `StudentProfileID`,`e_inner`.`SectionID` AS `SectionID`,`e_inner`.`SchoolYearID` AS `SchoolYearID`,`e_inner`.`EnrollmentDate` AS `EnrollmentDate` from (`enrollment` `e_inner` join (select `enrollment`.`StudentProfileID` AS `StudentProfileID`,max(`enrollment`.`EnrollmentID`) AS `MaxID` from `enrollment` group by `enrollment`.`StudentProfileID`) `latest_e` on(`e_inner`.`StudentProfileID` = `latest_e`.`StudentProfileID` and `e_inner`.`EnrollmentID` = `latest_e`.`MaxID`))) `e` on(`sp`.`StudentProfileID` = `e`.`StudentProfileID`)) left join `schoolyear` `sy` on(`e`.`SchoolYearID` = `sy`.`SchoolYearID`)) left join `section` `sec` on(`e`.`SectionID` = `sec`.`SectionID`)) left join `gradelevel` `gl` on(`sec`.`GradeLevelID` = `gl`.`GradeLevelID`)) left join `teacherprofile` `tp` on(`sec`.`AdviserTeacherID` = `tp`.`TeacherProfileID`)) left join `profile` `adviser_profile` on(`tp`.`ProfileID` = `adviser_profile`.`ProfileID`)) left join `medicalinfo` `mi` on(`sp`.`StudentProfileID` = `mi`.`StudentProfileID`)) left join `emergencycontact` `ec` on(`sp`.`StudentProfileID` = `ec`.`StudentProfileID`)) left join `studentguardian` `sg_primary` on(`sp`.`StudentProfileID` = `sg_primary`.`StudentProfileID` and `sg_primary`.`IsPrimaryContact` = 1)) left join `guardian` `g_primary` on(`sg_primary`.`GuardianID` = `g_primary`.`GuardianID`)) WHERE `u`.`IsDeleted` = 0 ;

-- --------------------------------------------------------

--
-- Structure for view `vw_admission_applications`
--
DROP TABLE IF EXISTS `vw_admission_applications`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_admission_applications`  AS SELECT `a`.`ApplicationID` AS `ApplicationID`, `a`.`TrackingNumber` AS `TrackingNumber`, `a`.`EnrolleeType` AS `EnrolleeType`, `a`.`ApplicationStatus` AS `ApplicationStatus`, `a`.`SubmissionDate` AS `SubmissionDate`, `a`.`ReviewedDate` AS `ReviewedDate`, `a`.`PreviousSchool` AS `PreviousSchool`, coalesce(`ap`.`FirstName`,`p`.`FirstName`) AS `StudentFirstName`, coalesce(`ap`.`LastName`,`p`.`LastName`) AS `StudentLastName`, coalesce(`ap`.`DateOfBirth`,`sp`.`DateOfBirth`) AS `Birthdate`, coalesce(`ap`.`Gender`,`sp`.`Gender`) AS `Gender`, coalesce(`ap`.`Address`,cast(`p`.`EncryptedAddress` as char charset utf8mb4)) AS `Address`, coalesce(`ap`.`ContactNumber`,cast(`p`.`EncryptedPhoneNumber` as char charset utf8mb4)) AS `ContactNumber`, coalesce(`ap`.`EmailAddress`,`u`.`EmailAddress`) AS `EmailAddress`, `ag`.`FirstName` AS `GuardianFirstName`, `ag`.`LastName` AS `GuardianLastName`, `ag`.`RelationshipType` AS `Relationship`, `ag`.`ContactNumber` AS `GuardianContact`, `ag`.`EmailAddress` AS `GuardianEmail`, `gl`.`LevelName` AS `GradeLevel`, `gl`.`GradeLevelID` AS `GradeLevelID`, `sy`.`YearName` AS `SchoolYear`, `sy`.`SchoolYearID` AS `SchoolYearID`, `a`.`ApplicantProfileID` AS `ApplicantProfileID`, `a`.`TemporaryApplicantID` AS `TemporaryApplicantID`, `a`.`ReviewedByUserID` AS `ReviewedByUserID` FROM (((((((`application` `a` left join `applicantprofile` `ap` on(`a`.`TemporaryApplicantID` = `ap`.`ApplicantProfileID`)) left join `applicantguardian` `ag` on(`ap`.`ApplicantProfileID` = `ag`.`ApplicantProfileID`)) left join `profile` `p` on(`a`.`ApplicantProfileID` = `p`.`ProfileID`)) left join `user` `u` on(`p`.`UserID` = `u`.`UserID`)) left join `studentprofile` `sp` on(`p`.`ProfileID` = `sp`.`ProfileID`)) left join `gradelevel` `gl` on(`a`.`ApplyingForGradeLevelID` = `gl`.`GradeLevelID`)) left join `schoolyear` `sy` on(`a`.`SchoolYearID` = `sy`.`SchoolYearID`)) ;

-- --------------------------------------------------------

--
-- Structure for view `vw_student_auth`
--
DROP TABLE IF EXISTS `vw_student_auth`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_student_auth`  AS SELECT `u`.`UserID` AS `UserID`, `u`.`EmailAddress` AS `EmailAddress`, `u`.`UserType` AS `UserType`, `u`.`AccountStatus` AS `AccountStatus`, `u`.`LastLoginDate` AS `LastLoginDate`, `u`.`CreatedAt` AS `UserCreatedAt`, `u`.`IsDeleted` AS `IsDeleted`, `p`.`ProfileID` AS `ProfileID`, `p`.`FirstName` AS `FirstName`, `p`.`LastName` AS `LastName`, `p`.`MiddleName` AS `MiddleName`, concat_ws(' ',`p`.`FirstName`,`p`.`MiddleName`,`p`.`LastName`) AS `FullName`, `p`.`EncryptedPhoneNumber` AS `EncryptedPhoneNumber`, `p`.`EncryptedAddress` AS `EncryptedAddress`, `p`.`ProfilePictureURL` AS `ProfilePictureURL`, `sp`.`StudentProfileID` AS `StudentProfileID`, `sp`.`StudentNumber` AS `StudentNumber`, `sp`.`QRCodeID` AS `QRCodeID`, `sp`.`DateOfBirth` AS `DateOfBirth`, `sp`.`Gender` AS `Gender`, `sp`.`Nationality` AS `Nationality`, `sp`.`StudentStatus` AS `StudentStatus`, `sp`.`ArchiveDate` AS `ArchiveDate`, `pp`.`PasswordHash` AS `PasswordHash`, `pp`.`PasswordSetDate` AS `PasswordSetDate`, `pp`.`ExpiryDate` AS `ExpiryDate`, `pp`.`MustChange` AS `MustChange`, `pp`.`FailedLoginAttempts` AS `FailedLoginAttempts`, `pp`.`LockedUntil` AS `LockedUntil`, CASE WHEN `pp`.`LockedUntil` is not null AND `pp`.`LockedUntil` > current_timestamp() THEN 'Locked' WHEN `u`.`AccountStatus` = 'Active' AND `sp`.`StudentStatus` = 'Enrolled' THEN 'Can Login' ELSE 'Cannot Login' END AS `LoginStatus`, timestampdiff(YEAR,`sp`.`DateOfBirth`,curdate()) AS `Age` FROM (((`user` `u` join `profile` `p` on(`u`.`UserID` = `p`.`UserID`)) join `studentprofile` `sp` on(`p`.`ProfileID` = `sp`.`ProfileID`)) left join `passwordpolicy` `pp` on(`u`.`UserID` = `pp`.`UserID`)) WHERE `u`.`UserType` = 'Student' AND `u`.`IsDeleted` = 0 ;

-- --------------------------------------------------------

--
-- Structure for view `vw_teacher_login_details`
--
DROP TABLE IF EXISTS `vw_teacher_login_details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_teacher_login_details`  AS SELECT `u`.`UserID` AS `UserID`, `u`.`EmailAddress` AS `EmailAddress`, `pp`.`PasswordHash` AS `PasswordHash`, `u`.`AccountStatus` AS `AccountStatus`, `p`.`FirstName` AS `FirstName`, `p`.`LastName` AS `LastName` FROM ((`user` `u` join `passwordpolicy` `pp` on(`u`.`UserID` = `pp`.`UserID`)) join `profile` `p` on(`u`.`UserID` = `p`.`UserID`)) WHERE `u`.`UserType` = 'Teacher' ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academicstanding`
--
ALTER TABLE `academicstanding`
  ADD PRIMARY KEY (`StandingID`),
  ADD UNIQUE KEY `EnrollmentID` (`EnrollmentID`),
  ADD KEY `fk_AcademicStanding_StandingLevel` (`StandingLevelID`),
  ADD KEY `fk_AcademicStanding_ParticipationLevel` (`ParticipationLevelID`);

--
-- Indexes for table `academicstandinglevel`
--
ALTER TABLE `academicstandinglevel`
  ADD PRIMARY KEY (`StandingLevelID`),
  ADD UNIQUE KEY `LevelName` (`LevelName`);

--
-- Indexes for table `adminprofile`
--
ALTER TABLE `adminprofile`
  ADD PRIMARY KEY (`AdminProfileID`),
  ADD KEY `profile_admin_fk` (`ProfileID`);

--
-- Indexes for table `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`AnnouncementID`),
  ADD KEY `fk_Announcement_User` (`AuthorUserID`);

--
-- Indexes for table `applicantguardian`
--
ALTER TABLE `applicantguardian`
  ADD PRIMARY KEY (`ApplicantGuardianID`),
  ADD KEY `fk_applicantguardian_applicantprofile` (`ApplicantProfileID`);

--
-- Indexes for table `applicantprofile`
--
ALTER TABLE `applicantprofile`
  ADD PRIMARY KEY (`ApplicantProfileID`),
  ADD KEY `idx_email` (`EmailAddress`);

--
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`ApplicationID`),
  ADD UNIQUE KEY `TrackingNumber` (`TrackingNumber`),
  ADD KEY `fk_Application_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_Application_GradeLevel` (`ApplyingForGradeLevelID`),
  ADD KEY `fk_Application_ReviewedByUser` (`ReviewedByUserID`),
  ADD KEY `idx_tracking_number` (`TrackingNumber`),
  ADD KEY `fk_application_temporary_applicant` (`TemporaryApplicantID`),
  ADD KEY `fk_Application_Profile` (`ApplicantProfileID`);

--
-- Indexes for table `applicationrequirement`
--
ALTER TABLE `applicationrequirement`
  ADD PRIMARY KEY (`RequirementID`),
  ADD KEY `fk_ApplicationRequirement_Application` (`ApplicationID`),
  ADD KEY `fk_ApplicationRequirement_RequirementType` (`RequirementTypeID`),
  ADD KEY `fk_ApplicationRequirement_SecureFile` (`SecureFileID`),
  ADD KEY `fk_ApplicationRequirement_VerifiedByUser` (`VerifiedByUserID`);

--
-- Indexes for table `applieddiscount`
--
ALTER TABLE `applieddiscount`
  ADD PRIMARY KEY (`AppliedDiscountID`),
  ADD KEY `fk_AppliedDiscount_Transaction` (`TransactionID`),
  ADD KEY `fk_AppliedDiscount_Discount` (`DiscountID`),
  ADD KEY `fk_AppliedDiscount_ApprovedByUser` (`ApprovedByUserID`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`AttendanceID`),
  ADD UNIQUE KEY `StudentProfileID` (`StudentProfileID`,`ClassScheduleID`,`AttendanceDate`),
  ADD KEY `fk_Attendance_ClassSchedule` (`ClassScheduleID`),
  ADD KEY `fk_Attendance_Method` (`AttendanceMethodID`);

--
-- Indexes for table `attendancemethod`
--
ALTER TABLE `attendancemethod`
  ADD PRIMARY KEY (`MethodID`),
  ADD UNIQUE KEY `MethodName` (`MethodName`);

--
-- Indexes for table `attendancesummary`
--
ALTER TABLE `attendancesummary`
  ADD PRIMARY KEY (`AttendanceSummaryID`),
  ADD UNIQUE KEY `unique_student_year` (`StudentProfileID`,`SchoolYearID`),
  ADD KEY `fk_AttendanceSummary_SchoolYear` (`SchoolYearID`);

--
-- Indexes for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD PRIMARY KEY (`AuditID`),
  ADD KEY `fk_AuditLog_User` (`UserID`);

--
-- Indexes for table `classschedule`
--
ALTER TABLE `classschedule`
  ADD PRIMARY KEY (`ScheduleID`),
  ADD KEY `fk_ClassSchedule_Section` (`SectionID`),
  ADD KEY `fk_ClassSchedule_Subject` (`SubjectID`),
  ADD KEY `fk_ClassSchedule_TeacherProfile` (`TeacherProfileID`),
  ADD KEY `fk_ClassSchedule_Status` (`ScheduleStatusID`);

--
-- Indexes for table `discount`
--
ALTER TABLE `discount`
  ADD PRIMARY KEY (`DiscountID`),
  ADD KEY `fk_Discount_DiscountType` (`DiscountTypeID`);

--
-- Indexes for table `discounttype`
--
ALTER TABLE `discounttype`
  ADD PRIMARY KEY (`DiscountTypeID`),
  ADD UNIQUE KEY `TypeName` (`TypeName`);

--
-- Indexes for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  ADD PRIMARY KEY (`EmergencyContactID`),
  ADD KEY `fk_EmergencyContact_StudentProfile` (`StudentProfileID`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD UNIQUE KEY `StudentProfileID` (`StudentProfileID`,`SchoolYearID`),
  ADD KEY `fk_Enrollment_Section` (`SectionID`),
  ADD KEY `fk_Enrollment_SchoolYear` (`SchoolYearID`);

--
-- Indexes for table `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`FAQID`);

--
-- Indexes for table `grade`
--
ALTER TABLE `grade`
  ADD PRIMARY KEY (`GradeID`),
  ADD UNIQUE KEY `EnrollmentID` (`EnrollmentID`,`SubjectID`,`Quarter`),
  ADD KEY `fk_Grade_Subject` (`SubjectID`),
  ADD KEY `fk_Grade_Status` (`GradeStatusID`),
  ADD KEY `fk_Grade_ModifiedByUser` (`ModifiedByUserID`);

--
-- Indexes for table `gradelevel`
--
ALTER TABLE `gradelevel`
  ADD PRIMARY KEY (`GradeLevelID`),
  ADD UNIQUE KEY `LevelName` (`LevelName`);

--
-- Indexes for table `gradestatus`
--
ALTER TABLE `gradestatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD UNIQUE KEY `StatusName` (`StatusName`);

--
-- Indexes for table `guardian`
--
ALTER TABLE `guardian`
  ADD PRIMARY KEY (`GuardianID`);

--
-- Indexes for table `guardprofile`
--
ALTER TABLE `guardprofile`
  ADD PRIMARY KEY (`GuardProfileID`),
  ADD KEY `profile_guard_fk` (`ProfileID`);

--
-- Indexes for table `itemtype`
--
ALTER TABLE `itemtype`
  ADD PRIMARY KEY (`ItemTypeID`),
  ADD UNIQUE KEY `TypeName` (`TypeName`);

--
-- Indexes for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  ADD PRIMARY KEY (`MedicalInfoID`),
  ADD UNIQUE KEY `StudentProfileID` (`StudentProfileID`);

--
-- Indexes for table `notificationlog`
--
ALTER TABLE `notificationlog`
  ADD PRIMARY KEY (`LogID`),
  ADD KEY `fk_NotificationLog_User` (`RecipientUserID`),
  ADD KEY `fk_NotificationLog_NotificationType` (`NotificationTypeID`);

--
-- Indexes for table `notificationtype`
--
ALTER TABLE `notificationtype`
  ADD PRIMARY KEY (`NotificationTypeID`),
  ADD UNIQUE KEY `TypeName` (`TypeName`);

--
-- Indexes for table `participationlevel`
--
ALTER TABLE `participationlevel`
  ADD PRIMARY KEY (`ParticipationLevelID`),
  ADD UNIQUE KEY `LevelName` (`LevelName`);

--
-- Indexes for table `participationrating`
--
ALTER TABLE `participationrating`
  ADD PRIMARY KEY (`ParticipationRatingID`),
  ADD UNIQUE KEY `unique_student_year` (`StudentProfileID`,`SchoolYearID`),
  ADD KEY `fk_ParticipationRating_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_ParticipationRating_EvaluatedByUser` (`EvaluatedByUserID`);

--
-- Indexes for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  ADD PRIMARY KEY (`HistoryID`),
  ADD KEY `fk_PasswordHistory_User` (`UserID`);

--
-- Indexes for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  ADD PRIMARY KEY (`PolicyID`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`TokenID`),
  ADD UNIQUE KEY `Token` (`Token`),
  ADD KEY `fk_PasswordResetToken_User` (`UserID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`PaymentID`),
  ADD UNIQUE KEY `ReferenceNumber` (`ReferenceNumber`),
  ADD KEY `fk_Payment_Transaction` (`TransactionID`),
  ADD KEY `fk_Payment_PaymentMethod` (`PaymentMethodID`),
  ADD KEY `fk_Payment_SecureFile` (`ProofFileID`),
  ADD KEY `fk_Payment_VerifiedByUser` (`VerifiedByUserID`);

--
-- Indexes for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  ADD PRIMARY KEY (`PaymentMethodID`),
  ADD UNIQUE KEY `MethodName` (`MethodName`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`PermissionID`),
  ADD UNIQUE KEY `PermissionCode` (`PermissionCode`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`ProfileID`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `registrarprofile`
--
ALTER TABLE `registrarprofile`
  ADD PRIMARY KEY (`RegistrarProfileID`),
  ADD KEY `profile_registrar_fk` (`ProfileID`);

--
-- Indexes for table `requirementtype`
--
ALTER TABLE `requirementtype`
  ADD PRIMARY KEY (`RequirementTypeID`),
  ADD UNIQUE KEY `TypeName` (`TypeName`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`RoleID`),
  ADD UNIQUE KEY `RoleName` (`RoleName`);

--
-- Indexes for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD PRIMARY KEY (`RolePermissionID`),
  ADD UNIQUE KEY `RoleID` (`RoleID`,`PermissionID`),
  ADD KEY `fk_RolePermission_Permission` (`PermissionID`);

--
-- Indexes for table `schedulestatus`
--
ALTER TABLE `schedulestatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD UNIQUE KEY `StatusName` (`StatusName`);

--
-- Indexes for table `schoolyear`
--
ALTER TABLE `schoolyear`
  ADD PRIMARY KEY (`SchoolYearID`),
  ADD UNIQUE KEY `YearName` (`YearName`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`SectionID`),
  ADD KEY `fk_Section_GradeLevel` (`GradeLevelID`),
  ADD KEY `fk_Section_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_Section_TeacherProfile` (`AdviserTeacherID`);

--
-- Indexes for table `securefile`
--
ALTER TABLE `securefile`
  ADD PRIMARY KEY (`FileID`),
  ADD UNIQUE KEY `StoredFileName` (`StoredFileName`),
  ADD KEY `fk_SecureFile_User` (`UploadedByUserID`);

--
-- Indexes for table `studentguardian`
--
ALTER TABLE `studentguardian`
  ADD PRIMARY KEY (`StudentGuardianID`),
  ADD KEY `fk_StudentGuardian_StudentProfile` (`StudentProfileID`),
  ADD KEY `fk_StudentGuardian_Guardian` (`GuardianID`);

--
-- Indexes for table `studentprofile`
--
ALTER TABLE `studentprofile`
  ADD PRIMARY KEY (`StudentProfileID`),
  ADD UNIQUE KEY `ProfileID` (`ProfileID`),
  ADD UNIQUE KEY `StudentNumber` (`StudentNumber`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`SubjectID`),
  ADD UNIQUE KEY `SubjectCode` (`SubjectCode`),
  ADD KEY `fk_Subject_GradeLevel` (`GradeLevelID`);

--
-- Indexes for table `supportticket`
--
ALTER TABLE `supportticket`
  ADD PRIMARY KEY (`TicketID`),
  ADD KEY `fk_SupportTicket_User` (`UserID`),
  ADD KEY `fk_SupportTicket_AssignedToUser` (`AssignedToUserID`),
  ADD KEY `fk_SupportTicket_ResolvedByUser` (`ResolvedByUserID`);

--
-- Indexes for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  ADD PRIMARY KEY (`TeacherProfileID`),
  ADD UNIQUE KEY `ProfileID` (`ProfileID`);

--
-- Indexes for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  ADD PRIMARY KEY (`MessageID`),
  ADD KEY `fk_TicketMessage_SupportTicket` (`TicketID`),
  ADD KEY `fk_TicketMessage_User` (`SenderUserID`),
  ADD KEY `fk_TicketMessage_SecureFile` (`AttachmentFileID`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `fk_Transaction_StudentProfile` (`StudentProfileID`),
  ADD KEY `fk_Transaction_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_transaction_status` (`TransactionStatusID`);

--
-- Indexes for table `transactionitem`
--
ALTER TABLE `transactionitem`
  ADD PRIMARY KEY (`ItemID`),
  ADD KEY `fk_TransactionItem_Transaction` (`TransactionID`),
  ADD KEY `fk_TransactionItem_ItemType` (`ItemTypeID`);

--
-- Indexes for table `transactionstatus`
--
ALTER TABLE `transactionstatus`
  ADD PRIMARY KEY (`StatusID`),
  ADD UNIQUE KEY `StatusName` (`StatusName`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `EmailAddress` (`EmailAddress`);

--
-- Indexes for table `userrole`
--
ALTER TABLE `userrole`
  ADD PRIMARY KEY (`UserRoleID`),
  ADD UNIQUE KEY `UserID` (`UserID`,`RoleID`),
  ADD KEY `fk_UserRole_Role` (`RoleID`),
  ADD KEY `fk_UserRole_AssignedByUser` (`AssignedByUserID`);

--
-- Indexes for table `usersettings`
--
ALTER TABLE `usersettings`
  ADD PRIMARY KEY (`SettingsID`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academicstanding`
--
ALTER TABLE `academicstanding`
  MODIFY `StandingID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `academicstandinglevel`
--
ALTER TABLE `academicstandinglevel`
  MODIFY `StandingLevelID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `adminprofile`
--
ALTER TABLE `adminprofile`
  MODIFY `AdminProfileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `AnnouncementID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applicantguardian`
--
ALTER TABLE `applicantguardian`
  MODIFY `ApplicantGuardianID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applicantprofile`
--
ALTER TABLE `applicantprofile`
  MODIFY `ApplicantProfileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applicationrequirement`
--
ALTER TABLE `applicationrequirement`
  MODIFY `RequirementID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applieddiscount`
--
ALTER TABLE `applieddiscount`
  MODIFY `AppliedDiscountID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `AttendanceID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendancemethod`
--
ALTER TABLE `attendancemethod`
  MODIFY `MethodID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendancesummary`
--
ALTER TABLE `attendancesummary`
  MODIFY `AttendanceSummaryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `AuditID` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classschedule`
--
ALTER TABLE `classschedule`
  MODIFY `ScheduleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discount`
--
ALTER TABLE `discount`
  MODIFY `DiscountID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discounttype`
--
ALTER TABLE `discounttype`
  MODIFY `DiscountTypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  MODIFY `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `GradeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=221;

--
-- AUTO_INCREMENT for table `gradelevel`
--
ALTER TABLE `gradelevel`
  MODIFY `GradeLevelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `gradestatus`
--
ALTER TABLE `gradestatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guardian`
--
ALTER TABLE `guardian`
  MODIFY `GuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `guardprofile`
--
ALTER TABLE `guardprofile`
  MODIFY `GuardProfileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `itemtype`
--
ALTER TABLE `itemtype`
  MODIFY `ItemTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  MODIFY `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notificationlog`
--
ALTER TABLE `notificationlog`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notificationtype`
--
ALTER TABLE `notificationtype`
  MODIFY `NotificationTypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participationlevel`
--
ALTER TABLE `participationlevel`
  MODIFY `ParticipationLevelID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participationrating`
--
ALTER TABLE `participationrating`
  MODIFY `ParticipationRatingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  MODIFY `PolicyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `TokenID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  MODIFY `PaymentMethodID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `PermissionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `registrarprofile`
--
ALTER TABLE `registrarprofile`
  MODIFY `RegistrarProfileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `requirementtype`
--
ALTER TABLE `requirementtype`
  MODIFY `RequirementTypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `RoleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rolepermission`
--
ALTER TABLE `rolepermission`
  MODIFY `RolePermissionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedulestatus`
--
ALTER TABLE `schedulestatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schoolyear`
--
ALTER TABLE `schoolyear`
  MODIFY `SchoolYearID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `SectionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `securefile`
--
ALTER TABLE `securefile`
  MODIFY `FileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `studentguardian`
--
ALTER TABLE `studentguardian`
  MODIFY `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `studentprofile`
--
ALTER TABLE `studentprofile`
  MODIFY `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `SubjectID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `supportticket`
--
ALTER TABLE `supportticket`
  MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  MODIFY `TeacherProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transactionitem`
--
ALTER TABLE `transactionitem`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `transactionstatus`
--
ALTER TABLE `transactionstatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `userrole`
--
ALTER TABLE `userrole`
  MODIFY `UserRoleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usersettings`
--
ALTER TABLE `usersettings`
  MODIFY `SettingsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `academicstanding`
--
ALTER TABLE `academicstanding`
  ADD CONSTRAINT `fk_AcademicStanding_Enrollment` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollment` (`EnrollmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_AcademicStanding_ParticipationLevel` FOREIGN KEY (`ParticipationLevelID`) REFERENCES `participationlevel` (`ParticipationLevelID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_AcademicStanding_StandingLevel` FOREIGN KEY (`StandingLevelID`) REFERENCES `academicstandinglevel` (`StandingLevelID`) ON DELETE SET NULL;

--
-- Constraints for table `adminprofile`
--
ALTER TABLE `adminprofile`
  ADD CONSTRAINT `profile_admin_fk` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `announcement`
--
ALTER TABLE `announcement`
  ADD CONSTRAINT `fk_Announcement_User` FOREIGN KEY (`AuthorUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `applicantguardian`
--
ALTER TABLE `applicantguardian`
  ADD CONSTRAINT `fk_applicantguardian_applicantprofile` FOREIGN KEY (`ApplicantProfileID`) REFERENCES `applicantprofile` (`ApplicantProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `fk_Application_GradeLevel` FOREIGN KEY (`ApplyingForGradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`),
  ADD CONSTRAINT `fk_Application_Profile` FOREIGN KEY (`ApplicantProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Application_ReviewedByUser` FOREIGN KEY (`ReviewedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Application_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_application_temporary_applicant` FOREIGN KEY (`TemporaryApplicantID`) REFERENCES `applicantprofile` (`ApplicantProfileID`) ON DELETE SET NULL;

--
-- Constraints for table `applicationrequirement`
--
ALTER TABLE `applicationrequirement`
  ADD CONSTRAINT `fk_ApplicationRequirement_Application` FOREIGN KEY (`ApplicationID`) REFERENCES `application` (`ApplicationID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ApplicationRequirement_RequirementType` FOREIGN KEY (`RequirementTypeID`) REFERENCES `requirementtype` (`RequirementTypeID`),
  ADD CONSTRAINT `fk_ApplicationRequirement_SecureFile` FOREIGN KEY (`SecureFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ApplicationRequirement_VerifiedByUser` FOREIGN KEY (`VerifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `applieddiscount`
--
ALTER TABLE `applieddiscount`
  ADD CONSTRAINT `fk_AppliedDiscount_ApprovedByUser` FOREIGN KEY (`ApprovedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_AppliedDiscount_Discount` FOREIGN KEY (`DiscountID`) REFERENCES `discount` (`DiscountID`),
  ADD CONSTRAINT `fk_AppliedDiscount_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE CASCADE;

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_Attendance_ClassSchedule` FOREIGN KEY (`ClassScheduleID`) REFERENCES `classschedule` (`ScheduleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Attendance_Method` FOREIGN KEY (`AttendanceMethodID`) REFERENCES `attendancemethod` (`MethodID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Attendance_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `attendancesummary`
--
ALTER TABLE `attendancesummary`
  ADD CONSTRAINT `fk_AttendanceSummary_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_AttendanceSummary_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD CONSTRAINT `fk_AuditLog_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `classschedule`
--
ALTER TABLE `classschedule`
  ADD CONSTRAINT `fk_ClassSchedule_Section` FOREIGN KEY (`SectionID`) REFERENCES `section` (`SectionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ClassSchedule_Status` FOREIGN KEY (`ScheduleStatusID`) REFERENCES `schedulestatus` (`StatusID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ClassSchedule_Subject` FOREIGN KEY (`SubjectID`) REFERENCES `subject` (`SubjectID`),
  ADD CONSTRAINT `fk_ClassSchedule_TeacherProfile` FOREIGN KEY (`TeacherProfileID`) REFERENCES `teacherprofile` (`TeacherProfileID`) ON DELETE SET NULL;

--
-- Constraints for table `discount`
--
ALTER TABLE `discount`
  ADD CONSTRAINT `fk_Discount_DiscountType` FOREIGN KEY (`DiscountTypeID`) REFERENCES `discounttype` (`DiscountTypeID`);

--
-- Constraints for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  ADD CONSTRAINT `fk_EmergencyContact_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `fk_Enrollment_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Enrollment_Section` FOREIGN KEY (`SectionID`) REFERENCES `section` (`SectionID`),
  ADD CONSTRAINT `fk_Enrollment_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `grade`
--
ALTER TABLE `grade`
  ADD CONSTRAINT `fk_Grade_Enrollment` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollment` (`EnrollmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Grade_ModifiedByUser` FOREIGN KEY (`ModifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_Status` FOREIGN KEY (`GradeStatusID`) REFERENCES `gradestatus` (`StatusID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_Subject` FOREIGN KEY (`SubjectID`) REFERENCES `subject` (`SubjectID`);

--
-- Constraints for table `guardprofile`
--
ALTER TABLE `guardprofile`
  ADD CONSTRAINT `profile_guard_fk` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  ADD CONSTRAINT `fk_MedicalInfo_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `notificationlog`
--
ALTER TABLE `notificationlog`
  ADD CONSTRAINT `fk_NotificationLog_NotificationType` FOREIGN KEY (`NotificationTypeID`) REFERENCES `notificationtype` (`NotificationTypeID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_NotificationLog_User` FOREIGN KEY (`RecipientUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `participationrating`
--
ALTER TABLE `participationrating`
  ADD CONSTRAINT `fk_ParticipationRating_EvaluatedByUser` FOREIGN KEY (`EvaluatedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ParticipationRating_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ParticipationRating_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  ADD CONSTRAINT `fk_PasswordHistory_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  ADD CONSTRAINT `fk_PasswordPolicy_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `fk_PasswordResetToken_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_Payment_PaymentMethod` FOREIGN KEY (`PaymentMethodID`) REFERENCES `paymentmethod` (`PaymentMethodID`),
  ADD CONSTRAINT `fk_Payment_SecureFile` FOREIGN KEY (`ProofFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Payment_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`),
  ADD CONSTRAINT `fk_Payment_VerifiedByUser` FOREIGN KEY (`VerifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `fk_Profile_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `registrarprofile`
--
ALTER TABLE `registrarprofile`
  ADD CONSTRAINT `profile_registrar_fk` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD CONSTRAINT `fk_RolePermission_Permission` FOREIGN KEY (`PermissionID`) REFERENCES `permission` (`PermissionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_RolePermission_Role` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`) ON DELETE CASCADE;

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `fk_Section_GradeLevel` FOREIGN KEY (`GradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`),
  ADD CONSTRAINT `fk_Section_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Section_TeacherProfile` FOREIGN KEY (`AdviserTeacherID`) REFERENCES `teacherprofile` (`TeacherProfileID`) ON DELETE SET NULL;

--
-- Constraints for table `securefile`
--
ALTER TABLE `securefile`
  ADD CONSTRAINT `fk_SecureFile_User` FOREIGN KEY (`UploadedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `studentguardian`
--
ALTER TABLE `studentguardian`
  ADD CONSTRAINT `fk_StudentGuardian_Guardian` FOREIGN KEY (`GuardianID`) REFERENCES `guardian` (`GuardianID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_StudentGuardian_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `studentprofile`
--
ALTER TABLE `studentprofile`
  ADD CONSTRAINT `fk_StudentProfile_Profile` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `subject`
--
ALTER TABLE `subject`
  ADD CONSTRAINT `fk_Subject_GradeLevel` FOREIGN KEY (`GradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`);

--
-- Constraints for table `supportticket`
--
ALTER TABLE `supportticket`
  ADD CONSTRAINT `fk_SupportTicket_AssignedToUser` FOREIGN KEY (`AssignedToUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_SupportTicket_ResolvedByUser` FOREIGN KEY (`ResolvedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_SupportTicket_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  ADD CONSTRAINT `fk_TeacherProfile_Profile` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  ADD CONSTRAINT `fk_TicketMessage_SecureFile` FOREIGN KEY (`AttachmentFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_TicketMessage_SupportTicket` FOREIGN KEY (`TicketID`) REFERENCES `supportticket` (`TicketID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_TicketMessage_User` FOREIGN KEY (`SenderUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `fk_Transaction_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Transaction_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`),
  ADD CONSTRAINT `fk_transaction_status` FOREIGN KEY (`TransactionStatusID`) REFERENCES `transactionstatus` (`StatusID`);

--
-- Constraints for table `transactionitem`
--
ALTER TABLE `transactionitem`
  ADD CONSTRAINT `fk_TransactionItem_ItemType` FOREIGN KEY (`ItemTypeID`) REFERENCES `itemtype` (`ItemTypeID`),
  ADD CONSTRAINT `fk_TransactionItem_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE CASCADE;

--
-- Constraints for table `userrole`
--
ALTER TABLE `userrole`
  ADD CONSTRAINT `fk_UserRole_AssignedByUser` FOREIGN KEY (`AssignedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_UserRole_Role` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_UserRole_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `usersettings`
--
ALTER TABLE `usersettings`
  ADD CONSTRAINT `fk_UserSettings_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
