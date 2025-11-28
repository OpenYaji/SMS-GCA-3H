-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2025 at 10:27 PM
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
-- Database: `aa`
--

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
  `Summary` text DEFAULT NULL,
  `Category` enum('Academic','Events','General') NOT NULL DEFAULT 'General',
  `BannerURL` varchar(255) DEFAULT NULL,
  `PublishDate` datetime NOT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `TargetAudience` enum('All Users','Students','Teachers','Parents','Staff') NOT NULL,
  `IsPinned` tinyint(1) NOT NULL DEFAULT 0,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `ApplicationID` int(11) NOT NULL,
  `ApplicantProfileID` int(11) DEFAULT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `ApplyingForGradeLevelID` int(11) NOT NULL,
  `EnrolleeType` enum('New','Old','Transferee') NOT NULL,
  `ApplicationStatus` enum('Pending','For Review','Approved','Rejected','Waitlisted','Enrolled') NOT NULL DEFAULT 'Pending',
  `SubmissionDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ReviewedDate` datetime DEFAULT NULL,
  `PreviousSchool` varchar(255) DEFAULT NULL,
  `StudentFirstName` varchar(100) DEFAULT NULL,
  `StudentLastName` varchar(100) DEFAULT NULL,
  `StudentMiddleName` varchar(100) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` enum('Male','Female') DEFAULT NULL,
  `Address` varchar(512) DEFAULT NULL,
  `ContactNumber` varchar(20) DEFAULT NULL,
  `EmailAddress` varchar(255) DEFAULT NULL,
  `GuardianFirstName` varchar(100) DEFAULT NULL,
  `GuardianLastName` varchar(100) DEFAULT NULL,
  `GuardianRelationship` varchar(50) DEFAULT NULL,
  `GuardianContact` varchar(20) DEFAULT NULL,
  `GuardianEmail` varchar(255) DEFAULT NULL,
  `TrackingNumber` varchar(50) DEFAULT NULL,
  `PrivacyAgreement` tinyint(1) DEFAULT 0,
  `ReviewedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`ApplicationID`, `ApplicantProfileID`, `SchoolYearID`, `ApplyingForGradeLevelID`, `EnrolleeType`, `ApplicationStatus`, `SubmissionDate`, `ReviewedDate`, `PreviousSchool`, `StudentFirstName`, `StudentLastName`, `StudentMiddleName`, `DateOfBirth`, `Gender`, `Address`, `ContactNumber`, `EmailAddress`, `GuardianFirstName`, `GuardianLastName`, `GuardianRelationship`, `GuardianContact`, `GuardianEmail`, `TrackingNumber`, `PrivacyAgreement`, `ReviewedByUserID`) VALUES
(1, NULL, 7, 7, 'New', 'Enrolled', '2025-11-28 04:11:56', NULL, '', 'Aaaa', 'AA', 'AA', '2020-11-11', 'Male', '21 ahahahaha', '09123456789', 'haha@gmail.com', 'Hahaha', 'hahaha', 'father', '09123456789', 'hahahaha@gmail.com', 'GCA-2025-15774', 1, NULL);

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

--
-- Dumping data for table `attendancemethod`
--

INSERT INTO `attendancemethod` (`MethodID`, `MethodName`, `IsActive`) VALUES
(1, 'Manual', 1),
(2, 'QR Code Scan', 1),
(3, 'RFID Card', 1),
(4, 'Biometric', 1);

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
(1, 1, 7, 0, 0, '2025-11-28 04:22:41');

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
-- Table structure for table `authorized_escort`
--

CREATE TABLE `authorized_escort` (
  `EscortID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `RelationshipToStudent` varchar(100) NOT NULL,
  `ContactNumber` varchar(20) NOT NULL,
  `Address` varchar(512) DEFAULT NULL,
  `AdditionalNotes` text DEFAULT NULL,
  `EscortStatus` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `DateAdded` datetime NOT NULL DEFAULT current_timestamp(),
  `ApprovedByUserID` int(11) DEFAULT NULL
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
-- Table structure for table `document_request`
--

CREATE TABLE `document_request` (
  `RequestID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `DocumentType` enum('form137','grades','goodMoral','enrollment','completion','honorable') NOT NULL,
  `Purpose` varchar(255) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `DeliveryMethod` enum('pickup','mail') NOT NULL DEFAULT 'pickup',
  `AdditionalNotes` text DEFAULT NULL,
  `RequestStatus` enum('Pending','Processing','Ready','Completed','Rejected') NOT NULL DEFAULT 'Pending',
  `DateRequested` datetime NOT NULL DEFAULT current_timestamp(),
  `DateCompleted` datetime DEFAULT NULL,
  `ProcessedByUserID` int(11) DEFAULT NULL
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
(1, 1, 'Hahaha hahaha', 0x3039313233343536373839);

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
(1, 1, 14, 7, '2025-11-28');

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
(1, 1, 37, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(2, 1, 37, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(3, 1, 37, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(4, 1, 37, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(5, 1, 38, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(6, 1, 38, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(7, 1, 38, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(8, 1, 38, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(9, 1, 39, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(10, 1, 39, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(11, 1, 39, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(12, 1, 39, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(13, 1, 40, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(14, 1, 40, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(15, 1, 40, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(16, 1, 40, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(17, 1, 41, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(18, 1, 41, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(19, 1, 41, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(20, 1, 41, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(21, 1, 42, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(22, 1, 42, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(23, 1, 42, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(24, 1, 42, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(25, 1, 43, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(26, 1, 43, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(27, 1, 43, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(28, 1, 43, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(29, 1, 44, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(30, 1, 44, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(31, 1, 44, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(32, 1, 44, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(33, 1, 45, 'First Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(34, 1, 45, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(35, 1, 45, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(36, 1, 45, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL);

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
(1, 'Pre-Elem', 1),
(2, 'Kinder', 2),
(3, 'Grade 1', 3),
(4, 'Grade 2', 4),
(5, 'Grade 3', 5),
(6, 'Grade 4', 6),
(7, 'Grade 5', 7),
(8, 'Grade 6', 8);

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
(1, 'Hahaha hahaha', 0x3039313233343536373839, 0x686168616861686140676d61696c2e636f6d, NULL, NULL);

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
(3, 'Books and Materials', 1, 3),
(4, 'Computer Lab Fee', 1, 4),
(5, 'Development Fee', 1, 5);

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
(1, 1, NULL, NULL, NULL, NULL, NULL);

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

--
-- Dumping data for table `notificationtype`
--

INSERT INTO `notificationtype` (`NotificationTypeID`, `TypeName`, `TemplateContent`) VALUES
(1, 'Grade Release', 'Grades for {{quarter}} released'),
(2, 'Payment Reminder', 'Payment due {{due_date}}'),
(3, 'Attendance Alert', '{{student_name}} marked {{status}}');

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
(1, 1, '$2y$10$VrnrUrqRa.sY9/JpB/Wlu.k1ZhL3QjYPJo2Teblche6/uq70KXIIC', '2025-11-28 04:20:13', NULL, 0, 0, NULL),
(2, 2, '$2y$10$KiFHvjECPS9EIJteP3N24OxRXLp5FTzgXqqi6T.LEXB3wwAb2JCzK', '2025-11-28 04:22:41', NULL, 1, 0, NULL);

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
(1, 1, 3, 6000.00, '2025-11-28 05:20:14', 'TXN1764278411304153', NULL, 'Pending', NULL, NULL, NULL);

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
(4, 'PayMaya', NULL, 1, 4),
(5, 'Check', NULL, 1, 5);

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
  `Gender` enum('Male','Female') DEFAULT NULL,
  `BirthDate` date DEFAULT NULL,
  `Age` int(11) DEFAULT NULL,
  `Religion` varchar(255) DEFAULT NULL,
  `MotherTounge` varchar(255) DEFAULT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedAddress` varbinary(512) DEFAULT NULL,
  `ProfilePictureURL` varchar(2048) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`ProfileID`, `UserID`, `FirstName`, `LastName`, `MiddleName`, `Gender`, `BirthDate`, `Age`, `Religion`, `MotherTounge`, `EncryptedPhoneNumber`, `EncryptedAddress`, `ProfilePictureURL`) VALUES
(1, 1, 'Registrar', 'Ako', 'Si', 'Male', '2025-11-02', 19, '11', '11', 0x11, 0x11, '11'),
(2, 2, 'Aaaa', 'AA', 'AA', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x323120616861686168616861, NULL);

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

--
-- Dumping data for table `registrarprofile`
--

INSERT INTO `registrarprofile` (`RegistrarProfileID`, `ProfileID`, `EmployeeNumber`, `HireDate`) VALUES
(1, 1, '1', NULL);

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

--
-- Dumping data for table `requirementtype`
--

INSERT INTO `requirementtype` (`RequirementTypeID`, `TypeName`, `IsMandatory`, `SortOrder`) VALUES
(1, 'Birth Certificate (PSA)', 1, 1),
(2, 'Report Card', 1, 2),
(3, 'Good Moral', 1, 3),
(4, '2x2 ID Picture', 1, 4);

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

--
-- Dumping data for table `schedulestatus`
--

INSERT INTO `schedulestatus` (`StatusID`, `StatusName`) VALUES
(1, 'Active'),
(2, 'Cancelled'),
(3, 'Completed'),
(4, 'Suspended');

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
(2, '2020-2021', '2020-06-01', '2021-03-31', 0),
(3, '2021-2022', '2021-06-01', '2022-03-31', 0),
(4, '2022-2023', '2022-06-01', '2023-03-31', 0),
(5, '2023-2024', '2023-06-01', '2024-03-31', 0),
(6, '2024-2025', '2024-06-01', '2025-03-31', 0),
(7, '2025-2026', '2025-06-01', '2026-03-31', 1);

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
  `CurrentEnrollment` int(11) NOT NULL DEFAULT 0,
  `IsDefault` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`SectionID`, `GradeLevelID`, `SchoolYearID`, `AdviserTeacherID`, `SectionName`, `MaxCapacity`, `CurrentEnrollment`, `IsDefault`) VALUES
(1, 1, 7, NULL, 'Pre-elem Morning', 15, 0, 1),
(2, 1, 7, NULL, 'Pre-elem Afternoon', 15, 0, 1),
(3, 2, 7, NULL, 'Kinder Morning', 15, 0, 1),
(4, 2, 7, NULL, 'Kinder Afternoon', 15, 0, 1),
(5, 3, 7, NULL, 'Grade 1 Morning', 15, 0, 1),
(6, 3, 7, NULL, 'Grade 1 Afternoon', 15, 0, 1),
(7, 4, 7, NULL, 'Grade 2 Morning', 15, 0, 1),
(8, 4, 7, NULL, 'Grade 2 Afternoon', 15, 0, 1),
(9, 5, 7, NULL, 'Grade 3 Morning', 15, 0, 1),
(10, 5, 7, NULL, 'Grade 3 Afternoon', 15, 0, 1),
(11, 6, 7, NULL, 'Grade 4 Morning', 15, 0, 1),
(12, 6, 7, NULL, 'Grade 4 Afternoon', 15, 0, 1),
(13, 7, 7, NULL, 'Grade 5 Morning', 15, 0, 1),
(14, 7, 7, NULL, 'Grade 5 Afternoon', 15, 1, 1),
(15, 8, 7, NULL, 'Grade 6 Morning', 15, 0, 1),
(16, 8, 7, NULL, 'Grade 6 Afternoon', 15, 0, 1);

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
(1, 1, 1, 'Father', 1, 1, 1, 0);

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
,`UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff','HeadTeacher')
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
(1, 2, 'GCA-2025-00001', 'QR-GCA-2025-00001', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL);

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
(1, 'Filipino', 'FIL-1', 3, 1),
(2, 'English', 'ENG-1', 3, 1),
(3, 'Mathematics', 'MATH-1', 3, 1),
(4, 'Makabansa', 'MAK-1', 3, 1),
(5, 'GMRC', 'GMRC-1', 3, 1),
(6, 'Music', 'MUS-1', 3, 1),
(7, 'Arts', 'ART-1', 3, 1),
(8, 'Physical Education', 'PE-1', 3, 1),
(9, 'Health', 'HLT-1', 3, 1),
(10, 'Filipino', 'FIL-2', 4, 1),
(11, 'English', 'ENG-2', 4, 1),
(12, 'Mathematics', 'MATH-2', 4, 1),
(13, 'Makabansa', 'MAK-2', 4, 1),
(14, 'GMRC', 'GMRC-2', 4, 1),
(15, 'Music', 'MUS-2', 4, 1),
(16, 'Arts', 'ART-2', 4, 1),
(17, 'Physical Education', 'PE-2', 4, 1),
(18, 'Health', 'HLT-2', 4, 1),
(19, 'Filipino', 'FIL-3', 5, 1),
(20, 'English', 'ENG-3', 5, 1),
(21, 'Mathematics', 'MATH-3', 5, 1),
(22, 'Makabansa', 'MAK-3', 5, 1),
(23, 'GMRC', 'GMRC-3', 5, 1),
(24, 'Music', 'MUS-3', 5, 1),
(25, 'Arts', 'ART-3', 5, 1),
(26, 'Physical Education', 'PE-3', 5, 1),
(27, 'Health', 'HLT-3', 5, 1),
(28, 'Filipino', 'FIL-4', 6, 1),
(29, 'English', 'ENG-4', 6, 1),
(30, 'Mathematics', 'MATH-4', 6, 1),
(31, 'Makabansa', 'MAK-4', 6, 1),
(32, 'GMRC', 'GMRC-4', 6, 1),
(33, 'Music', 'MUS-4', 6, 1),
(34, 'Arts', 'ART-4', 6, 1),
(35, 'Physical Education', 'PE-4', 6, 1),
(36, 'Health', 'HLT-4', 6, 1),
(37, 'Filipino', 'FIL-5', 7, 1),
(38, 'English', 'ENG-5', 7, 1),
(39, 'Mathematics', 'MATH-5', 7, 1),
(40, 'Makabansa', 'MAK-5', 7, 1),
(41, 'GMRC', 'GMRC-5', 7, 1),
(42, 'Music', 'MUS-5', 7, 1),
(43, 'Arts', 'ART-5', 7, 1),
(44, 'Physical Education', 'PE-5', 7, 1),
(45, 'Health', 'HLT-5', 7, 1),
(46, 'Filipino', 'FIL-6', 8, 1),
(47, 'English', 'ENG-6', 8, 1),
(48, 'Mathematics', 'MATH-6', 8, 1),
(49, 'Makabansa', 'MAK-6', 8, 1),
(50, 'GMRC', 'GMRC-6', 8, 1),
(51, 'Music', 'MUS-6', 8, 1),
(52, 'Arts', 'ART-6', 8, 1),
(53, 'Physical Education', 'PE-6', 8, 1),
(54, 'Health', 'HLT-6', 8, 1),
(55, 'ENGLISH', 'ENG6', 8, 1),
(56, 'MATH', 'MTH6', 8, 1),
(57, 'FILIPINO', 'FIL6', 8, 1),
(58, 'SCIENCE', 'SCI6', 8, 1),
(59, 'ARALING PANLIPUNAN', 'AP6', 8, 1),
(60, 'MAPEH', 'MAPEH6', 8, 1);

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
(1, 1, 7, '2025-11-28', '2025-11-30', 11000.00, 11000.00, 3);

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
(1, 1, 1, 'ha', 100.00, 1);

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
(1, 'Unpaid', 1),
(2, 'Partial', 2),
(3, 'Paid', 3),
(4, 'Overdue', 4);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `EmailAddress` varchar(255) NOT NULL,
  `UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff','HeadTeacher') NOT NULL,
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
(1, '1', 'Registrar', 'Active', NULL, '2025-11-28 04:12:58', '2025-11-28 04:12:58', 0, NULL),
(2, 'aaaa.aa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 04:22:41', '2025-11-28 04:22:41', 0, NULL);

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
-- Stand-in structure for view `vw_student_auth`
-- (See below for the actual view)
--
CREATE TABLE `vw_student_auth` (
`UserID` int(11)
,`EmailAddress` varchar(255)
,`UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff','HeadTeacher')
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
-- Structure for view `vw_student_auth`
--
DROP TABLE IF EXISTS `vw_student_auth`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_student_auth`  AS SELECT `u`.`UserID` AS `UserID`, `u`.`EmailAddress` AS `EmailAddress`, `u`.`UserType` AS `UserType`, `u`.`AccountStatus` AS `AccountStatus`, `u`.`LastLoginDate` AS `LastLoginDate`, `u`.`CreatedAt` AS `UserCreatedAt`, `u`.`IsDeleted` AS `IsDeleted`, `p`.`ProfileID` AS `ProfileID`, `p`.`FirstName` AS `FirstName`, `p`.`LastName` AS `LastName`, `p`.`MiddleName` AS `MiddleName`, concat_ws(' ',`p`.`FirstName`,`p`.`MiddleName`,`p`.`LastName`) AS `FullName`, `p`.`EncryptedPhoneNumber` AS `EncryptedPhoneNumber`, `p`.`EncryptedAddress` AS `EncryptedAddress`, `p`.`ProfilePictureURL` AS `ProfilePictureURL`, `sp`.`StudentProfileID` AS `StudentProfileID`, `sp`.`StudentNumber` AS `StudentNumber`, `sp`.`QRCodeID` AS `QRCodeID`, `sp`.`DateOfBirth` AS `DateOfBirth`, `sp`.`Gender` AS `Gender`, `sp`.`Nationality` AS `Nationality`, `sp`.`StudentStatus` AS `StudentStatus`, `sp`.`ArchiveDate` AS `ArchiveDate`, `pp`.`PasswordHash` AS `PasswordHash`, `pp`.`PasswordSetDate` AS `PasswordSetDate`, `pp`.`ExpiryDate` AS `ExpiryDate`, `pp`.`MustChange` AS `MustChange`, `pp`.`FailedLoginAttempts` AS `FailedLoginAttempts`, `pp`.`LockedUntil` AS `LockedUntil`, CASE WHEN `pp`.`LockedUntil` is not null AND `pp`.`LockedUntil` > current_timestamp() THEN 'Locked' WHEN `u`.`AccountStatus` = 'Active' AND `sp`.`StudentStatus` = 'Enrolled' THEN 'Can Login' ELSE 'Cannot Login' END AS `LoginStatus`, timestampdiff(YEAR,`sp`.`DateOfBirth`,curdate()) AS `Age` FROM (((`user` `u` join `profile` `p` on(`u`.`UserID` = `p`.`UserID`)) join `studentprofile` `sp` on(`p`.`ProfileID` = `sp`.`ProfileID`)) left join `passwordpolicy` `pp` on(`u`.`UserID` = `pp`.`UserID`)) WHERE `u`.`UserType` = 'Student' AND `u`.`IsDeleted` = 0 ;

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
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`ApplicationID`),
  ADD UNIQUE KEY `TrackingNumber` (`TrackingNumber`),
  ADD KEY `fk_Application_Profile` (`ApplicantProfileID`),
  ADD KEY `fk_Application_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_Application_GradeLevel` (`ApplyingForGradeLevelID`),
  ADD KEY `fk_Application_ReviewedByUser` (`ReviewedByUserID`),
  ADD KEY `idx_tracking_number` (`TrackingNumber`);

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
-- Indexes for table `authorized_escort`
--
ALTER TABLE `authorized_escort`
  ADD PRIMARY KEY (`EscortID`),
  ADD KEY `fk_AuthorizedEscort_Student` (`StudentProfileID`),
  ADD KEY `fk_AuthorizedEscort_Approver` (`ApprovedByUserID`);

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
-- Indexes for table `document_request`
--
ALTER TABLE `document_request`
  ADD PRIMARY KEY (`RequestID`),
  ADD KEY `fk_DocumentRequest_Student` (`StudentProfileID`),
  ADD KEY `fk_DocumentRequest_Processor` (`ProcessedByUserID`);

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
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `MethodID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `attendancesummary`
--
ALTER TABLE `attendancesummary`
  MODIFY `AttendanceSummaryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `AuditID` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `authorized_escort`
--
ALTER TABLE `authorized_escort`
  MODIFY `EscortID` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `document_request`
--
ALTER TABLE `document_request`
  MODIFY `RequestID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  MODIFY `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `GradeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `gradelevel`
--
ALTER TABLE `gradelevel`
  MODIFY `GradeLevelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `gradestatus`
--
ALTER TABLE `gradestatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guardian`
--
ALTER TABLE `guardian`
  MODIFY `GuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `guardprofile`
--
ALTER TABLE `guardprofile`
  MODIFY `GuardProfileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `itemtype`
--
ALTER TABLE `itemtype`
  MODIFY `ItemTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  MODIFY `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notificationlog`
--
ALTER TABLE `notificationlog`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notificationtype`
--
ALTER TABLE `notificationtype`
  MODIFY `NotificationTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `participationlevel`
--
ALTER TABLE `participationlevel`
  MODIFY `ParticipationLevelID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participationrating`
--
ALTER TABLE `participationrating`
  MODIFY `ParticipationRatingID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  MODIFY `PolicyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `TokenID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  MODIFY `PaymentMethodID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `PermissionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `registrarprofile`
--
ALTER TABLE `registrarprofile`
  MODIFY `RegistrarProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `requirementtype`
--
ALTER TABLE `requirementtype`
  MODIFY `RequirementTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `schoolyear`
--
ALTER TABLE `schoolyear`
  MODIFY `SchoolYearID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `SectionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `securefile`
--
ALTER TABLE `securefile`
  MODIFY `FileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `studentguardian`
--
ALTER TABLE `studentguardian`
  MODIFY `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `studentprofile`
--
ALTER TABLE `studentprofile`
  MODIFY `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `SubjectID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `supportticket`
--
ALTER TABLE `supportticket`
  MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  MODIFY `TeacherProfileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactionitem`
--
ALTER TABLE `transactionitem`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactionstatus`
--
ALTER TABLE `transactionstatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- Constraints for table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `fk_Application_GradeLevel` FOREIGN KEY (`ApplyingForGradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`),
  ADD CONSTRAINT `fk_Application_Profile` FOREIGN KEY (`ApplicantProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Application_ReviewedByUser` FOREIGN KEY (`ReviewedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Application_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`);

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
-- Constraints for table `authorized_escort`
--
ALTER TABLE `authorized_escort`
  ADD CONSTRAINT `fk_AuthorizedEscort_Approver` FOREIGN KEY (`ApprovedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_AuthorizedEscort_Student` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

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
-- Constraints for table `document_request`
--
ALTER TABLE `document_request`
  ADD CONSTRAINT `fk_DocumentRequest_Processor` FOREIGN KEY (`ProcessedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_DocumentRequest_Student` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  ADD CONSTRAINT `fk_EmergencyContact_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `grade`
--
ALTER TABLE `grade`
  ADD CONSTRAINT `fk_Grade_Enrollment` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollment` (`EnrollmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Grade_ModifiedByUser` FOREIGN KEY (`ModifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_Status` FOREIGN KEY (`GradeStatusID`) REFERENCES `gradestatus` (`StatusID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_Subject` FOREIGN KEY (`SubjectID`) REFERENCES `subject` (`SubjectID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
