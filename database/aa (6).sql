-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 05:00 AM
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
  `PaymentMode` enum('full','quarterly','monthly') DEFAULT NULL,
  `TransactionID` int(11) DEFAULT NULL,
  `RegistrarNotes` text DEFAULT NULL,
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

INSERT INTO `application` (`ApplicationID`, `ApplicantProfileID`, `SchoolYearID`, `ApplyingForGradeLevelID`, `EnrolleeType`, `ApplicationStatus`, `PaymentMode`, `TransactionID`, `RegistrarNotes`, `SubmissionDate`, `ReviewedDate`, `PreviousSchool`, `StudentFirstName`, `StudentLastName`, `StudentMiddleName`, `DateOfBirth`, `Gender`, `Address`, `ContactNumber`, `EmailAddress`, `GuardianFirstName`, `GuardianLastName`, `GuardianRelationship`, `GuardianContact`, `GuardianEmail`, `TrackingNumber`, `PrivacyAgreement`, `ReviewedByUserID`) VALUES
(1, NULL, 7, 7, 'New', 'Enrolled', NULL, NULL, NULL, '2025-11-28 04:11:56', NULL, '', 'Aaaa', 'AA', 'AA', '2020-11-11', 'Male', '21 ahahahaha', '09123456789', 'haha@gmail.com', 'Hahaha', 'hahaha', 'father', '09123456789', 'hahahaha@gmail.com', 'GCA-2025-15774', 1, NULL),
(2, NULL, 7, 3, 'New', 'Enrolled', 'full', 2, '', '2025-11-28 06:32:49', '2025-11-28 06:48:26', '', 'JOAA', 'GAA', 'REY', '2020-12-20', 'Male', 'AAAAADASDADASDA', '09123456789', 'SADASDASD@GMAIL.COM', 'DDA', 'AA', 'ADSADSA', '09123456789', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-88188', 1, NULL),
(3, NULL, 7, 6, 'New', 'Enrolled', 'monthly', 3, '', '2025-11-28 06:58:04', '2025-11-28 06:58:43', '', 'aaaaga', 'hahaha', 'haha', '2020-11-11', 'Male', '2121212 hahahaha', '09123456789', 'hahaha@gmail.com', 'hahaha', 'hahahaha', 'father', '09123456789', 'j@gmail.com', 'GCA-2025-56645', 1, NULL),
(4, NULL, 7, 3, 'New', 'Enrolled', 'monthly', 4, '', '2025-11-28 07:05:49', '2025-11-28 07:06:30', '', 'Sana', 'Ka', 'Gumana', '2020-11-11', 'Male', 'AAaaaaaadsadsadada', '09123456789', 'sas@gmail.com', 'ASDasdas', 'dasd', 'father', '09123456678', 'johnre@gmail.com', 'GCA-2025-75766', 1, NULL),
(5, NULL, 7, 4, 'Old', 'Enrolled', 'quarterly', 6, '', '2025-11-28 07:11:41', '2025-11-28 08:49:23', '', 'HAHAHA', 'HAHAHA', 'HAHAHAHA', '2020-12-12', 'Male', 'hahahahahahaha', '09123456789', 'hahahaha@gmail.com', 'GHAHAHAHA', 'HAHAHAHA', 'father', '09123456789', 'ghahaha@gmail.com', 'GCA-2025-43302', 1, NULL),
(6, NULL, 7, 8, 'Old', 'Enrolled', 'quarterly', 5, '', '2025-11-28 07:26:58', '2025-11-28 07:27:24', '', 'Haha', 'ahahaha', 'haha', '2020-11-11', 'Male', 'HAhahaADASDADA', '0912345789', 'haha@gmail.com', 'hahahahaha', 'hahahaha', 'FATHER', '09123567890', 'FGSDF@GMAIL.COM', 'GCA-2025-08791', 1, NULL),
(7, NULL, 7, 6, 'New', 'Enrolled', 'full', 7, '', '2025-11-28 19:00:59', '2025-11-28 19:02:08', '', 'jerald', 'angeles', 'calipes', '2020-11-11', 'Male', 'asd qwertyaaaaaaa', '09886543789', 'jhegodacayo02@gmail.com', 'John Ret', 'Hahaha', 'farher', '09123456789', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-54420', 1, NULL),
(8, NULL, 7, 3, 'New', 'Enrolled', 'quarterly', 8, '', '2025-11-28 19:06:59', '2025-11-28 19:09:34', '', 'AHAHA', 'hahahahaha', 'ahahaha', '2020-10-10', 'Male', '21 hahahawhawhahaha', '09123456789', 'haha@gmail.com', 'Hahahaha', 'hahahaha', 'father', '09123456789', 'joh@gmail.com', 'GCA-2025-00981', 1, NULL),
(9, NULL, 7, 3, 'New', 'Enrolled', 'quarterly', 9, '', '2025-11-29 01:46:30', '2025-11-29 02:04:11', '', 'hahah', 'hahahaha', 'hahah', '2020-11-11', 'Male', 'hahaha hahaha haha', '09123456789', 'haha@gmail.com', 'hahahaha', 'ahahahah', 'father', '09123456789', 'ahaha@gmail.com', 'GCA-2025-10011', 1, NULL),
(10, NULL, 7, 8, 'New', 'Enrolled', 'full', 10, '', '2025-11-30 13:18:59', '2025-11-30 13:36:08', '', 'haha', 'hahaha', 'haha', '2020-11-11', 'Male', 'Hshhshhahaha hahahah', '09123456789', 'joas@gmail.com', 'Haha', 'ahahah', 'father', '09551355073', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-13582', 1, NULL),
(11, NULL, 7, 8, 'New', 'Enrolled', 'full', 11, '', '2025-11-30 16:25:20', '2025-11-30 17:45:25', '', 'haha', 'hahaha', 'haha', '2020-11-11', 'Male', 'H21 hahahahah', '09123456789', 'johnreybisnarcalipes@gmail.com', 'Hahaha', 'hahaha', 'hahaha', '09123456789', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-82001', 1, NULL),
(12, NULL, 7, 8, 'Old', 'Approved', 'full', 12, '', '2025-11-30 17:50:23', '2025-12-01 03:32:38', '', 'aa', 'aaa', 'aa', '2020-11-20', 'Male', '21 hahahahahahaha', '09123456789', 'john@gmail.com', 'hahahaha', 'hahahaha', 'father', '09123456789', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-20976', 1, NULL),
(13, NULL, 7, 3, 'New', 'Enrolled', 'full', 13, '', '2025-12-01 03:32:02', '2025-12-01 03:37:15', '', 'AHAHAHA', 'HAHA', 'HAHAHAHA', '2020-10-10', 'Male', 'HAHAHAHhahahahaha', '09949247885', 'john@gmail.com', 'hahaha', 'haha', 'father', '09949247885', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-59091', 1, NULL);

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
(1, 1, 7, 0, 0, '2025-11-28 04:22:41'),
(2, 2, 7, 0, 0, '2025-11-28 06:48:51'),
(3, 3, 7, 0, 0, '2025-11-28 06:59:24'),
(4, 4, 7, 0, 0, '2025-11-28 07:06:41'),
(5, 5, 7, 0, 0, '2025-11-28 07:27:36'),
(6, 6, 7, 0, 0, '2025-11-28 08:49:31'),
(7, 7, 7, 0, 0, '2025-11-28 19:02:27'),
(8, 8, 7, 0, 0, '2025-11-28 19:09:55'),
(9, 9, 7, 0, 0, '2025-11-29 19:38:53'),
(10, 10, 7, 0, 0, '2025-11-30 13:36:29'),
(11, 11, 7, 0, 0, '2025-12-01 03:32:52'),
(12, 12, 7, 0, 0, '2025-12-01 03:38:16');

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

--
-- Dumping data for table `authorized_escort`
--

INSERT INTO `authorized_escort` (`EscortID`, `StudentProfileID`, `FullName`, `RelationshipToStudent`, `ContactNumber`, `Address`, `AdditionalNotes`, `EscortStatus`, `IsActive`, `DateAdded`, `ApprovedByUserID`) VALUES
(1, 10, 'asdasdah', 'Mother', '09123456789', 'dasdad', 'dadsasda', 'Pending', 1, '2025-11-30 14:37:10', NULL);

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
(1, 1, 'Hahaha hahaha', 0x3039313233343536373839),
(2, 2, 'DDA AA', 0x3039313233343536373839),
(3, 3, 'hahaha hahahaha', 0x3039313233343536373839),
(4, 4, 'ASDasdas dasd', 0x3039313233343536363738),
(5, 5, 'hahahahaha hahahaha', 0x3039313233353637383930),
(6, 6, 'GHAHAHAHA HAHAHAHA', 0x3039313233343536373839),
(7, 7, 'John Ret Hahaha', 0x3039313233343536373839),
(8, 8, 'Hahahaha hahahaha', 0x3039313233343536373839),
(9, 9, 'hahahaha ahahahah', 0x3039313233343536373839),
(10, 10, 'Haha ahahah', 0x3039353531333535303733),
(11, 11, 'Hahaha hahaha', 0x3039313233343536373839),
(12, 12, 'hahaha haha', 0x3039393439323437383835);

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `EnrollmentID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SectionID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `EnrollmentDate` date NOT NULL,
  `OutstandingBalance` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`EnrollmentID`, `StudentProfileID`, `SectionID`, `SchoolYearID`, `EnrollmentDate`, `OutstandingBalance`) VALUES
(1, 1, 14, 7, '2025-11-28', 0.00),
(2, 2, 6, 7, '2025-11-28', 0.00),
(3, 3, 12, 7, '2025-11-28', 0.00),
(4, 4, 6, 7, '2025-11-28', 0.00),
(5, 5, 16, 7, '2025-11-28', 0.00),
(6, 6, 8, 7, '2025-11-28', 0.00),
(7, 7, 12, 7, '2025-11-28', 0.00),
(8, 8, 6, 7, '2025-11-28', 0.00),
(9, 9, 6, 7, '2025-11-29', 0.00),
(10, 10, 16, 7, '2025-11-30', 0.00),
(11, 11, 16, 7, '2025-12-01', 0.00),
(12, 12, 6, 7, '2025-12-01', 0.00);

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
(36, 1, 45, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 04:22:41', NULL),
(37, 2, 1, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(38, 2, 1, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(39, 2, 1, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(40, 2, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(41, 2, 2, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(42, 2, 2, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(43, 2, 2, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(44, 2, 2, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(45, 2, 3, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(46, 2, 3, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(47, 2, 3, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(48, 2, 3, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(49, 2, 4, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(50, 2, 4, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(51, 2, 4, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(52, 2, 4, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(53, 2, 5, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(54, 2, 5, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(55, 2, 5, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(56, 2, 5, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(57, 2, 6, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(58, 2, 6, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(59, 2, 6, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(60, 2, 6, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(61, 2, 7, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(62, 2, 7, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(63, 2, 7, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(64, 2, 7, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(65, 2, 8, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(66, 2, 8, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(67, 2, 8, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(68, 2, 8, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(69, 2, 9, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(70, 2, 9, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(71, 2, 9, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(72, 2, 9, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:48:51', NULL),
(73, 3, 28, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(74, 3, 28, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(75, 3, 28, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(76, 3, 28, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(77, 3, 29, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(78, 3, 29, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(79, 3, 29, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(80, 3, 29, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(81, 3, 30, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(82, 3, 30, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(83, 3, 30, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(84, 3, 30, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(85, 3, 31, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(86, 3, 31, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(87, 3, 31, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(88, 3, 31, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(89, 3, 32, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(90, 3, 32, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(91, 3, 32, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(92, 3, 32, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(93, 3, 33, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(94, 3, 33, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(95, 3, 33, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(96, 3, 33, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(97, 3, 34, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(98, 3, 34, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(99, 3, 34, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(100, 3, 34, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(101, 3, 35, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(102, 3, 35, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(103, 3, 35, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(104, 3, 35, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(105, 3, 36, 'First Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(106, 3, 36, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(107, 3, 36, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(108, 3, 36, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 06:59:24', NULL),
(109, 4, 1, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(110, 4, 1, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(111, 4, 1, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(112, 4, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(113, 4, 2, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(114, 4, 2, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(115, 4, 2, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(116, 4, 2, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(117, 4, 3, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(118, 4, 3, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(119, 4, 3, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(120, 4, 3, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(121, 4, 4, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(122, 4, 4, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(123, 4, 4, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(124, 4, 4, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(125, 4, 5, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(126, 4, 5, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(127, 4, 5, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(128, 4, 5, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(129, 4, 6, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(130, 4, 6, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(131, 4, 6, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(132, 4, 6, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(133, 4, 7, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(134, 4, 7, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(135, 4, 7, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(136, 4, 7, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:41', NULL),
(137, 4, 8, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(138, 4, 8, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(139, 4, 8, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(140, 4, 8, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(141, 4, 9, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(142, 4, 9, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(143, 4, 9, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(144, 4, 9, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:06:42', NULL),
(145, 5, 46, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(146, 5, 46, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(147, 5, 46, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(148, 5, 46, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(149, 5, 47, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(150, 5, 47, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(151, 5, 47, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(152, 5, 47, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(153, 5, 48, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(154, 5, 48, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(155, 5, 48, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(156, 5, 48, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(157, 5, 49, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(158, 5, 49, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(159, 5, 49, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(160, 5, 49, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(161, 5, 50, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(162, 5, 50, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(163, 5, 50, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(164, 5, 50, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(165, 5, 51, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(166, 5, 51, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(167, 5, 51, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(168, 5, 51, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(169, 5, 52, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(170, 5, 52, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(171, 5, 52, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(172, 5, 52, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(173, 5, 53, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(174, 5, 53, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(175, 5, 53, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(176, 5, 53, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(177, 5, 54, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(178, 5, 54, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(179, 5, 54, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(180, 5, 54, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(181, 5, 55, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(182, 5, 55, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(183, 5, 55, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(184, 5, 55, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(185, 5, 56, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(186, 5, 56, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(187, 5, 56, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(188, 5, 56, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(189, 5, 57, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(190, 5, 57, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(191, 5, 57, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(192, 5, 57, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(193, 5, 58, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(194, 5, 58, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(195, 5, 58, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(196, 5, 58, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(197, 5, 59, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(198, 5, 59, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(199, 5, 59, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(200, 5, 59, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(201, 5, 60, 'First Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(202, 5, 60, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(203, 5, 60, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(204, 5, 60, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 07:27:36', NULL),
(205, 6, 10, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(206, 6, 10, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(207, 6, 10, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(208, 6, 10, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(209, 6, 11, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(210, 6, 11, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(211, 6, 11, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(212, 6, 11, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(213, 6, 12, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(214, 6, 12, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(215, 6, 12, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(216, 6, 12, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(217, 6, 13, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(218, 6, 13, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(219, 6, 13, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(220, 6, 13, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(221, 6, 14, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(222, 6, 14, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(223, 6, 14, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(224, 6, 14, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(225, 6, 15, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(226, 6, 15, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(227, 6, 15, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(228, 6, 15, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(229, 6, 16, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(230, 6, 16, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(231, 6, 16, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(232, 6, 16, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(233, 6, 17, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(234, 6, 17, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(235, 6, 17, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(236, 6, 17, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(237, 6, 18, 'First Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(238, 6, 18, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(239, 6, 18, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(240, 6, 18, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 08:49:31', NULL),
(241, 7, 28, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(242, 7, 28, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(243, 7, 28, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(244, 7, 28, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(245, 7, 29, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(246, 7, 29, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(247, 7, 29, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(248, 7, 29, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(249, 7, 30, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(250, 7, 30, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(251, 7, 30, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(252, 7, 30, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(253, 7, 31, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(254, 7, 31, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(255, 7, 31, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(256, 7, 31, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(257, 7, 32, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(258, 7, 32, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(259, 7, 32, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(260, 7, 32, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(261, 7, 33, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(262, 7, 33, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(263, 7, 33, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(264, 7, 33, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(265, 7, 34, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(266, 7, 34, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(267, 7, 34, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(268, 7, 34, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(269, 7, 35, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(270, 7, 35, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(271, 7, 35, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(272, 7, 35, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(273, 7, 36, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(274, 7, 36, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(275, 7, 36, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(276, 7, 36, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:02:27', NULL),
(277, 8, 1, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(278, 8, 1, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(279, 8, 1, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(280, 8, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(281, 8, 2, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(282, 8, 2, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(283, 8, 2, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(284, 8, 2, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(285, 8, 3, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(286, 8, 3, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(287, 8, 3, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(288, 8, 3, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(289, 8, 4, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(290, 8, 4, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(291, 8, 4, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(292, 8, 4, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(293, 8, 5, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(294, 8, 5, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(295, 8, 5, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(296, 8, 5, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(297, 8, 6, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(298, 8, 6, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(299, 8, 6, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(300, 8, 6, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(301, 8, 7, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(302, 8, 7, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(303, 8, 7, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(304, 8, 7, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(305, 8, 8, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(306, 8, 8, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(307, 8, 8, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(308, 8, 8, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(309, 8, 9, 'First Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(310, 8, 9, 'Second Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(311, 8, 9, 'Third Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(312, 8, 9, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-28 19:09:55', NULL),
(313, 9, 1, 'First Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(314, 9, 1, 'Second Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(315, 9, 1, 'Third Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(316, 9, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(317, 9, 2, 'First Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(318, 9, 2, 'Second Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(319, 9, 2, 'Third Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(320, 9, 2, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(321, 9, 3, 'First Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(322, 9, 3, 'Second Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(323, 9, 3, 'Third Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(324, 9, 3, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(325, 9, 4, 'First Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(326, 9, 4, 'Second Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(327, 9, 4, 'Third Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(328, 9, 4, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(329, 9, 5, 'First Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(330, 9, 5, 'Second Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(331, 9, 5, 'Third Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(332, 9, 5, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(333, 9, 6, 'First Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(334, 9, 6, 'Second Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(335, 9, 6, 'Third Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(336, 9, 6, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(337, 9, 7, 'First Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(338, 9, 7, 'Second Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(339, 9, 7, 'Third Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(340, 9, 7, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(341, 9, 8, 'First Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(342, 9, 8, 'Second Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(343, 9, 8, 'Third Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(344, 9, 8, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(345, 9, 9, 'First Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(346, 9, 9, 'Second Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(347, 9, 9, 'Third Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(348, 9, 9, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-29 19:38:53', NULL),
(349, 10, 46, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(350, 10, 46, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(351, 10, 46, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(352, 10, 46, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(353, 10, 47, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(354, 10, 47, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(355, 10, 47, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(356, 10, 47, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(357, 10, 48, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(358, 10, 48, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(359, 10, 48, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(360, 10, 48, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(361, 10, 49, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(362, 10, 49, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(363, 10, 49, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(364, 10, 49, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(365, 10, 50, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(366, 10, 50, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(367, 10, 50, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(368, 10, 50, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(369, 10, 51, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(370, 10, 51, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(371, 10, 51, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(372, 10, 51, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(373, 10, 52, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(374, 10, 52, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(375, 10, 52, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(376, 10, 52, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(377, 10, 53, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(378, 10, 53, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(379, 10, 53, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(380, 10, 53, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(381, 10, 54, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(382, 10, 54, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(383, 10, 54, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(384, 10, 54, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(385, 10, 55, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(386, 10, 55, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(387, 10, 55, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(388, 10, 55, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(389, 10, 56, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(390, 10, 56, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(391, 10, 56, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(392, 10, 56, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(393, 10, 57, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(394, 10, 57, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(395, 10, 57, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(396, 10, 57, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(397, 10, 58, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(398, 10, 58, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(399, 10, 58, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(400, 10, 58, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(401, 10, 59, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(402, 10, 59, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(403, 10, 59, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(404, 10, 59, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(405, 10, 60, 'First Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(406, 10, 60, 'Second Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(407, 10, 60, 'Third Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(408, 10, 60, 'Fourth Quarter', NULL, NULL, NULL, '2025-11-30 13:36:29', NULL),
(409, 11, 46, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(410, 11, 46, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(411, 11, 46, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(412, 11, 46, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(413, 11, 47, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(414, 11, 47, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(415, 11, 47, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(416, 11, 47, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(417, 11, 48, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(418, 11, 48, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(419, 11, 48, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(420, 11, 48, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(421, 11, 49, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(422, 11, 49, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(423, 11, 49, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(424, 11, 49, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(425, 11, 50, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(426, 11, 50, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(427, 11, 50, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(428, 11, 50, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(429, 11, 51, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(430, 11, 51, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(431, 11, 51, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(432, 11, 51, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(433, 11, 52, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(434, 11, 52, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(435, 11, 52, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(436, 11, 52, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(437, 11, 53, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(438, 11, 53, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(439, 11, 53, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(440, 11, 53, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(441, 11, 54, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(442, 11, 54, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(443, 11, 54, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(444, 11, 54, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(445, 11, 55, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(446, 11, 55, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(447, 11, 55, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(448, 11, 55, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(449, 11, 56, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(450, 11, 56, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(451, 11, 56, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(452, 11, 56, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(453, 11, 57, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(454, 11, 57, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(455, 11, 57, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(456, 11, 57, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(457, 11, 58, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(458, 11, 58, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(459, 11, 58, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(460, 11, 58, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(461, 11, 59, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(462, 11, 59, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(463, 11, 59, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(464, 11, 59, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(465, 11, 60, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(466, 11, 60, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(467, 11, 60, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(468, 11, 60, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:32:52', NULL),
(469, 12, 1, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(470, 12, 1, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(471, 12, 1, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(472, 12, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(473, 12, 2, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(474, 12, 2, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(475, 12, 2, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(476, 12, 2, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(477, 12, 3, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(478, 12, 3, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(479, 12, 3, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(480, 12, 3, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(481, 12, 4, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(482, 12, 4, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(483, 12, 4, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(484, 12, 4, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(485, 12, 5, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(486, 12, 5, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(487, 12, 5, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(488, 12, 5, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(489, 12, 6, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(490, 12, 6, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(491, 12, 6, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(492, 12, 6, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(493, 12, 7, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(494, 12, 7, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(495, 12, 7, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(496, 12, 7, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(497, 12, 8, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(498, 12, 8, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(499, 12, 8, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(500, 12, 8, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(501, 12, 9, 'First Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(502, 12, 9, 'Second Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(503, 12, 9, 'Third Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL),
(504, 12, 9, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-01 03:38:16', NULL);

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
-- Table structure for table `gradesubmissiondeadline`
--

CREATE TABLE `gradesubmissiondeadline` (
  `DeadlineID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `Quarter` enum('First Quarter','Second Quarter','Third Quarter','Fourth Quarter') NOT NULL,
  `StartDate` datetime NOT NULL,
  `DeadlineDate` datetime NOT NULL,
  `CreatedByUserID` int(11) DEFAULT NULL
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
(1, 'Hahaha hahaha', 0x3039313233343536373839, 0x686168616861686140676d61696c2e636f6d, NULL, NULL),
(2, 'DDA AA', 0x3039313233343536373839, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(3, 'hahaha hahahaha', 0x3039313233343536373839, 0x6a40676d61696c2e636f6d, NULL, NULL),
(4, 'ASDasdas dasd', 0x3039313233343536363738, 0x6a6f686e726540676d61696c2e636f6d, NULL, NULL),
(5, 'hahahahaha hahahaha', 0x3039313233353637383930, 0x464753444640474d41494c2e434f4d, NULL, NULL),
(6, 'GHAHAHAHA HAHAHAHA', 0x3039313233343536373839, 0x6768616861686140676d61696c2e636f6d, NULL, NULL),
(7, 'John Ret Hahaha', 0x3039313233343536373839, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(8, 'Hahahaha hahahaha', 0x3039313233343536373839, 0x6a6f6840676d61696c2e636f6d, NULL, NULL),
(9, 'hahahaha ahahahah', 0x3039313233343536373839, 0x616861686140676d61696c2e636f6d, NULL, NULL),
(10, 'Haha ahahah', 0x3039353531333535303733, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(11, 'Hahaha hahaha', 0x3039313233343536373839, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(12, 'hahaha haha', 0x3039393439323437383835, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL);

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
(1, 1, NULL, NULL, NULL, NULL, NULL),
(2, 2, NULL, NULL, NULL, NULL, NULL),
(3, 3, NULL, NULL, NULL, NULL, NULL),
(4, 4, NULL, NULL, NULL, NULL, NULL),
(5, 5, NULL, NULL, NULL, NULL, NULL),
(6, 6, NULL, NULL, NULL, NULL, NULL),
(7, 7, NULL, NULL, NULL, NULL, NULL),
(8, 8, NULL, NULL, NULL, NULL, NULL),
(9, 9, NULL, NULL, NULL, NULL, NULL),
(10, 10, NULL, NULL, NULL, NULL, NULL),
(11, 11, NULL, NULL, NULL, NULL, NULL),
(12, 12, NULL, NULL, NULL, NULL, NULL);

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
(2, 2, '$2y$10$QU0kRSZdfDL1k/1K/CrMdelhcRJAFH21knzI4Ahb2vVZi7vpvOIoy', '2025-11-28 04:22:41', NULL, 1, 0, NULL),
(3, 3, '$2y$10$QU0kRSZdfDL1k/1K/CrMdelhcRJAFH21knzI4Ahb2vVZi7vpvOIoy', '2025-11-28 06:48:51', NULL, 1, 0, NULL),
(4, 4, '$2y$10$SYHLmjvpCMITs2ofs46PeOddmqhXGXgm.Q.Wxlzc.wZUvqPW8I3k.', '2025-11-28 06:59:24', NULL, 1, 0, NULL),
(5, 5, '$2y$10$WHpwhKLwEYZ9bIrYS6meAumTbZOL3GDA4AoPqhn6Xl3sz/m7r12SW', '2025-11-28 07:06:41', NULL, 1, 0, NULL),
(6, 6, '$2y$10$QU0kRSZdfDL1k/1K/CrMdelhcRJAFH21knzI4Ahb2vVZi7vpvOIoy', '2025-11-28 07:27:35', NULL, 1, 0, NULL),
(7, 7, '$2y$10$QU0kRSZdfDL1k/1K/CrMdelhcRJAFH21knzI4Ahb2vVZi7vpvOIoy', '2025-11-28 08:49:31', NULL, 1, 0, NULL),
(8, 8, '$2y$10$Lyts4jZBSALrOcjLTbJo/.xYTFW8lqB2LgDasrTPcpTgtbn2WDa62', '2025-11-28 19:02:27', NULL, 1, 0, NULL),
(9, 9, '$2y$10$dX/bU1gg//Kk6JHhgoJux.CRo3/VtNGLle8L8Ug5tTawu7oNgIMqq', '2025-11-28 19:09:55', NULL, 1, 0, NULL),
(10, 10, '$2y$10$mA51RFYP1Ir1bvicNiZrjuWnWVE1lBVFgRLtcm7mqYNwow6eeHJMK', '2025-11-29 19:38:53', NULL, 1, 0, NULL),
(11, 11, '$2y$10$t8VpXHSkOp8b1IUc8iZMuOeMbg392TvM0KbbPb281qkUuyxVs/3ky', '2025-11-30 13:36:29', NULL, 1, 0, NULL),
(12, 12, '$2y$10$HEE0iXjbPCgj7rSIA0s.Ru7w/txiCMtCxLgCqNbtFMLc5fJgcn2wC', '2025-12-01 03:32:51', NULL, 1, 0, NULL),
(13, 13, '$2y$10$wVPFix3t7OBaw4/w1B/Wu.QjP7Ph29DqM0dwSIGeMe/E.bgMNST8C', '2025-12-01 03:38:16', NULL, 1, 0, NULL);

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
  `RejectionReason` text DEFAULT NULL,
  `VerifiedBy` int(11) DEFAULT NULL,
  `VerificationRemarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`PaymentID`, `TransactionID`, `PaymentMethodID`, `AmountPaid`, `PaymentDateTime`, `ReferenceNumber`, `ProofFileID`, `VerificationStatus`, `VerifiedByUserID`, `VerifiedAt`, `RejectionReason`, `VerifiedBy`, `VerificationRemarks`) VALUES
(1, 1, 3, 6000.00, '2025-11-28 05:20:14', 'TXN1764278411304153', NULL, 'Verified', 1, '2025-11-28 09:57:40', '', NULL, NULL),
(2, 2, 1, 18500.00, '2025-11-28 06:48:26', 'DOWNPAY-2-1764283706', NULL, 'Verified', NULL, '2025-11-28 09:48:06', NULL, NULL, NULL),
(3, 3, 1, 8300.00, '2025-11-28 06:58:43', 'DOWNPAY-3-1764284323', NULL, 'Verified', 1, '2025-11-28 06:58:43', NULL, NULL, NULL),
(4, 3, 3, 11700.00, '2025-11-28 07:03:51', 'TXN1764284625372268', NULL, 'Verified', 1, '2025-11-28 09:55:32', '', NULL, NULL),
(5, 4, 1, 7700.00, '2025-11-28 07:06:30', 'DOWNPAY-4-1764284790', NULL, 'Verified', 1, '2025-11-28 07:06:30', NULL, NULL, NULL),
(6, 5, 1, 9600.00, '2025-11-28 07:27:24', 'DOWNPAY-6-1764286044', NULL, 'Verified', 1, '2025-11-28 07:27:24', NULL, NULL, NULL),
(7, 5, 3, 10400.00, '2025-11-28 07:29:15', 'TXN1764286144632499', NULL, 'Verified', 1, '2025-11-28 09:36:14', '', NULL, NULL),
(8, 6, 1, 8900.00, '2025-11-28 08:49:23', 'DOWNPAY-5-1764290963', NULL, 'Verified', 1, '2025-11-28 08:49:23', NULL, NULL, NULL),
(9, 6, 3, 9600.00, '2025-11-28 08:51:08', 'TXN1764291065951286', NULL, 'Verified', 1, '2025-11-28 09:30:25', '', NULL, NULL),
(10, 1, 3, 5000.00, '2025-11-28 18:52:44', 'TXN1764327160774756', NULL, 'Verified', 1, '2025-11-28 18:53:26', '', 1, NULL),
(11, 7, 1, 20000.00, '2025-11-28 19:02:08', 'DOWNPAY-7-1764327728', NULL, 'Verified', 1, '2025-11-28 19:02:08', NULL, NULL, NULL),
(12, 8, 1, 8900.00, '2025-11-28 19:09:34', 'DOWNPAY-8-1764328174', NULL, 'Verified', 1, '2025-11-28 19:09:34', NULL, NULL, NULL),
(13, 8, 3, 9600.00, '2025-11-28 19:12:33', 'TXN1764328348442130', NULL, 'Verified', 1, '2025-11-28 19:17:56', '', 1, NULL),
(14, 9, 1, 6500.00, '2025-11-29 02:04:11', 'DOWNPAY-9-1764353051', NULL, 'Verified', 1, '2025-11-29 02:04:11', NULL, NULL, NULL),
(15, 10, 1, 2000.00, '2025-11-30 13:36:08', 'DOWNPAY-10-1764480968', NULL, 'Verified', 1, '2025-11-30 13:36:08', NULL, NULL, NULL),
(16, 11, 1, 20000.00, '2025-11-30 17:45:25', 'DOWNPAY-11-1764495925', NULL, 'Verified', 1, '2025-11-30 17:45:25', NULL, NULL, NULL),
(17, 12, 1, 20000.00, '2025-12-01 03:32:38', 'DOWNPAY-12-1764531158', NULL, 'Verified', 1, '2025-12-01 03:32:38', NULL, NULL, NULL),
(18, 13, 1, 18500.00, '2025-12-01 03:37:15', 'DOWNPAY-13-1764531435', NULL, 'Verified', 1, '2025-12-01 03:37:15', NULL, NULL, NULL);

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
(2, 2, 'Aaaa', 'AA', 'AA', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x323120616861686168616861, NULL),
(3, 3, 'JOAA', 'GAA', 'REY', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x414141414144415344414441534441, NULL),
(4, 4, 'aaaaga', 'hahaha', 'haha', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x32313231323132206861686168616861, NULL),
(5, 5, 'Sana', 'Ka', 'Gumana', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x414161616161616164736164736164616461, NULL),
(6, 6, 'Haha', 'ahahaha', 'haha', NULL, NULL, NULL, NULL, NULL, 0x30393132333435373839, 0x4841686168614144415344414441, NULL),
(7, 7, 'HAHAHA', 'HAHAHA', 'HAHAHAHA', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x6861686168616861686168616861, NULL),
(8, 8, 'jerald', 'angeles', 'calipes', NULL, NULL, NULL, NULL, NULL, 0x3039383836353433373839, 0x6173642071776572747961616161616161, NULL),
(9, 9, 'AHAHA', 'hahahahaha', 'ahahaha', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x32312068616861686177686177686168616861, NULL),
(10, 10, 'hahah', 'hahahaha', 'hahah', NULL, NULL, NULL, NULL, NULL, 0x009949247885, 0x686168616861206861686168612068616861, NULL),
(11, 11, 'haha', 'hahaha', 'haha', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x4873686873686861686168612068616861686168, NULL),
(12, 12, 'haha', 'hahaha', 'haha', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x48323120686168616861686168, NULL),
(13, 13, 'AHAHAHA', 'HAHA', 'HAHAHAHA', NULL, NULL, NULL, NULL, NULL, 0x3039393439323437383835, 0x4841484148414868616861686168616861, NULL);

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
(6, 3, 7, NULL, 'Grade 1 Afternoon', 15, 5, 1),
(7, 4, 7, NULL, 'Grade 2 Morning', 15, 0, 1),
(8, 4, 7, NULL, 'Grade 2 Afternoon', 15, 1, 1),
(9, 5, 7, NULL, 'Grade 3 Morning', 15, 0, 1),
(10, 5, 7, NULL, 'Grade 3 Afternoon', 15, 0, 1),
(11, 6, 7, NULL, 'Grade 4 Morning', 15, 0, 1),
(12, 6, 7, NULL, 'Grade 4 Afternoon', 15, 2, 1),
(13, 7, 7, NULL, 'Grade 5 Morning', 15, 0, 1),
(14, 7, 7, NULL, 'Grade 5 Afternoon', 15, 1, 1),
(15, 8, 7, NULL, 'Grade 6 Morning', 15, 0, 1),
(16, 8, 7, NULL, 'Grade 6 Afternoon', 15, 3, 1);

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
(1, 1, 1, 'Father', 1, 1, 1, 0),
(2, 2, 2, 'Guardian', 1, 1, 1, 0),
(3, 3, 3, 'Father', 1, 1, 1, 0),
(4, 4, 4, 'Father', 1, 1, 1, 0),
(5, 5, 5, 'Father', 1, 1, 1, 0),
(6, 6, 6, 'Father', 1, 1, 1, 0),
(7, 7, 7, 'Guardian', 1, 1, 1, 0),
(8, 8, 8, 'Father', 1, 1, 1, 0),
(9, 9, 9, 'Father', 1, 1, 1, 0),
(10, 10, 10, 'Father', 1, 1, 1, 0),
(11, 11, 11, 'Guardian', 1, 1, 1, 0),
(12, 12, 12, 'Father', 1, 1, 1, 0);

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
(1, 2, 'GCA-2025-00001', 'QR-GCA-2025-00001', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(2, 3, 'GCA-2025-00002', 'QR-GCA-2025-00002', '2020-12-20', 'Male', 'Filipino', 'Enrolled', NULL),
(3, 4, 'GCA-2025-00003', 'QR-GCA-2025-00003', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(4, 5, 'GCA-2025-00004', 'QR-GCA-2025-00004', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(5, 6, 'GCA-2025-00005', 'QR-GCA-2025-00005', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(6, 7, 'GCA-2025-00006', 'QR-GCA-2025-00006', '2020-12-12', 'Male', 'Filipino', 'Enrolled', NULL),
(7, 8, 'GCA-2025-00007', 'QR-GCA-2025-00007', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(8, 9, 'GCA-2025-00008', 'QR-GCA-2025-00008', '2020-10-10', 'Male', 'Filipino', 'Enrolled', NULL),
(9, 10, 'GCA-2025-00009', 'QR-GCA-2025-00009', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(10, 11, 'GCA-2025-00010', 'QR-GCA-2025-00010', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(11, 12, 'GCA-2025-00011', 'QR-GCA-2025-00011', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(12, 13, 'GCA-2025-00012', 'QR-GCA-2025-00012', '2020-10-10', 'Male', 'Filipino', 'Enrolled', NULL);

--
-- Triggers `studentprofile`
--
DELIMITER $$
CREATE TRIGGER `after_student_profile_insert` AFTER INSERT ON `studentprofile` FOR EACH ROW BEGIN
    DECLARE app_transaction_id INT;
    DECLARE app_school_year_id INT;
    DECLARE transaction_balance DECIMAL(10,2);
    
    -- Find the application that matches this student's name
    SELECT a.TransactionID, a.SchoolYearID
    INTO app_transaction_id, app_school_year_id
    FROM application a
    JOIN profile p ON p.FirstName = a.StudentFirstName AND p.LastName = a.StudentLastName
    WHERE p.ProfileID = NEW.ProfileID
    AND a.ApplicationStatus IN ('Approved', 'Enrolled')
    AND a.TransactionID IS NOT NULL
    ORDER BY a.ApplicationID DESC
    LIMIT 1;
    
    -- If we found a matching transaction, link it automatically
    IF app_transaction_id IS NOT NULL THEN
        -- Update transaction with student profile ID
        UPDATE transaction 
        SET StudentProfileID = NEW.StudentProfileID
        WHERE TransactionID = app_transaction_id
        AND StudentProfileID IS NULL;
        
        -- Get the outstanding balance
        SELECT (TotalAmount - PaidAmount)
        INTO transaction_balance
        FROM transaction
        WHERE TransactionID = app_transaction_id;
        
        -- Update enrollment outstanding balance automatically
        UPDATE enrollment 
        SET OutstandingBalance = transaction_balance
        WHERE StudentProfileID = NEW.StudentProfileID
        AND SchoolYearID = app_school_year_id;
    END IF;
END
$$
DELIMITER ;

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
  `StudentProfileID` int(11) DEFAULT NULL,
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
(1, 1, 7, '2025-11-28', '2025-11-30', 11000.00, 11000.00, 3),
(2, 2, 7, '2025-11-28', '2025-12-28', 18500.00, 0.00, 1),
(3, 3, 7, '2025-11-28', '2025-12-28', 20000.00, 20000.00, 2),
(4, NULL, 7, '2025-11-28', '2025-12-28', 18500.00, 7700.00, 2),
(5, 5, 7, '2025-11-28', '2025-12-28', 20000.00, 20000.00, 3),
(6, 6, 7, '2025-11-28', '2025-12-28', 18500.00, 18500.00, 3),
(7, 7, 7, '2025-11-28', '2025-12-28', 20000.00, 20000.00, 3),
(8, 8, 7, '2025-11-28', '2025-12-28', 18500.00, 18500.00, 3),
(9, 9, 7, '2025-11-29', '2025-12-29', 18500.00, 6500.00, 2),
(10, 10, 7, '2025-11-30', '2025-12-30', 20000.00, 2000.00, 2),
(11, 11, 7, '2025-11-30', '2025-12-30', 20000.00, 20000.00, 3),
(12, NULL, 7, '2025-12-01', '2025-12-31', 20000.00, 20000.00, 3),
(13, 12, 7, '2025-12-01', '2025-12-31', 18500.00, 18500.00, 3);

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
(1, 1, 1, 'ha', 100.00, 1),
(2, 2, 1, 'Registration Fee', 2000.00, 1),
(3, 2, 2, 'Miscellaneous Fee', 4500.00, 1),
(4, 2, 1, 'Tuition Fee', 12000.00, 1),
(5, 3, 1, 'Registration Fee', 2000.00, 1),
(6, 3, 2, 'Miscellaneous Fee', 5000.00, 1),
(7, 3, 1, 'Tuition Fee', 13000.00, 1),
(8, 4, 1, 'Registration Fee', 2000.00, 1),
(9, 4, 2, 'Miscellaneous Fee', 4500.00, 1),
(10, 4, 1, 'Tuition Fee', 12000.00, 1),
(11, 5, 1, 'Registration Fee', 2000.00, 1),
(12, 5, 2, 'Miscellaneous Fee', 5000.00, 1),
(13, 5, 1, 'Tuition Fee', 13000.00, 1),
(14, 6, 1, 'Registration Fee', 2000.00, 1),
(15, 6, 2, 'Miscellaneous Fee', 4500.00, 1),
(16, 6, 1, 'Tuition Fee', 12000.00, 1),
(17, 7, 1, 'Registration Fee', 2000.00, 1),
(18, 7, 2, 'Miscellaneous Fee', 5000.00, 1),
(19, 7, 1, 'Tuition Fee', 13000.00, 1),
(20, 8, 1, 'Registration Fee', 2000.00, 1),
(21, 8, 2, 'Miscellaneous Fee', 4500.00, 1),
(22, 8, 1, 'Tuition Fee', 12000.00, 1),
(23, 9, 1, 'Registration Fee', 2000.00, 1),
(24, 9, 2, 'Miscellaneous Fee', 4500.00, 1),
(25, 9, 1, 'Tuition Fee', 12000.00, 1),
(26, 10, 1, 'Registration Fee', 2000.00, 1),
(27, 10, 2, 'Miscellaneous Fee', 5000.00, 1),
(28, 10, 1, 'Tuition Fee', 13000.00, 1),
(29, 11, 1, 'Registration Fee', 2000.00, 1),
(30, 11, 2, 'Miscellaneous Fee', 5000.00, 1),
(31, 11, 1, 'Tuition Fee', 13000.00, 1),
(32, 12, 1, 'Registration Fee', 2000.00, 1),
(33, 12, 2, 'Miscellaneous Fee', 5000.00, 1),
(34, 12, 1, 'Tuition Fee', 13000.00, 1),
(35, 13, 1, 'Registration Fee', 2000.00, 1),
(36, 13, 2, 'Miscellaneous Fee', 4500.00, 1),
(37, 13, 1, 'Tuition Fee', 12000.00, 1);

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
(2, 'aaaa.aa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 04:22:41', '2025-11-28 04:22:41', 0, NULL),
(3, 'joaa.gaa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 06:48:51', '2025-11-28 06:48:51', 0, NULL),
(4, 'aaaaga.hahaha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 06:59:24', '2025-11-28 06:59:24', 0, NULL),
(5, 'sana.ka@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 07:06:41', '2025-11-28 07:06:41', 0, NULL),
(6, 'haha.ahahaha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 07:27:35', '2025-11-28 07:27:35', 0, NULL),
(7, 'hahaha.hahaha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 08:49:31', '2025-11-28 08:49:31', 0, NULL),
(8, 'jerald.angeles@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 19:02:27', '2025-11-28 19:02:27', 0, NULL),
(9, 'ahaha.hahahahaha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-28 19:09:54', '2025-11-28 19:09:54', 0, NULL),
(10, 'hahah.hahahaha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-29 19:38:53', '2025-11-29 19:38:53', 0, NULL),
(11, 'haha.hahaha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-30 13:36:28', '2025-11-30 13:36:28', 0, NULL),
(12, 'haha.hahaha00011@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-01 03:32:51', '2025-12-01 03:32:51', 0, NULL),
(13, 'ahahaha.haha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-01 03:38:16', '2025-12-01 03:38:16', 0, NULL);

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
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `SessionID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `ExpiresAt` datetime NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `LastActivity` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`SessionID`, `UserID`, `Token`, `ExpiresAt`, `CreatedAt`, `LastActivity`) VALUES
(1, 1, '3c185428a32292ec60b087d607813ff96b49f88377fd378eecd1b75f4667545a_1_1764498829', '2025-12-30 18:33:49', '2025-11-28 08:12:27', '2025-11-30 18:33:49'),
(6, 7, 'b9b26c597a95eda2ba9e22a3c8ac8ada654615ec34f12cc4efc9db845c2b0648_7_1764419950', '2025-12-29 20:39:12', '2025-11-28 08:49:50', '2025-11-29 20:39:12'),
(12, 6, 'aaa2bc638688b3c99cddfa08f015ff5dae4638cca6d964516c19095214c92474_6_1764293721', '2025-12-28 09:35:21', '2025-11-28 09:35:21', '2025-11-28 09:35:21'),
(13, 3, '08e4f4fd9d5c492073c64ec2961e597743fc00dabde0b4304be78c0870943753_3_1764294862', '2025-12-28 09:54:22', '2025-11-28 09:47:47', '2025-11-28 09:54:22'),
(17, 2, '748650eea2b8a24a7da5686c3a75295e2a45556fed633d496c5ffa416ea4ee42_2_1764354987', '2025-12-29 02:36:27', '2025-11-28 09:55:09', '2025-11-29 02:36:27'),
(20, 8, '3cbc729c82243342269df59f4de775af47cfbb56eed8a237b42b4c368d4108e4_8_1764327774', '2025-12-28 19:02:54', '2025-11-28 19:02:54', '2025-11-28 19:02:54'),
(21, 9, '0a10454180f0adfb344d3818866a103b334f61583689ddaf7c227136431c4b67_9_1764328248', '2025-12-28 19:10:48', '2025-11-28 19:10:48', '2025-11-28 19:10:48'),
(27, 10, '4ec48c909309e0525f5d9247f3b1f8f98349f21a5e23680e119b64fd25002baa_10_1764416396', '2025-12-29 19:39:56', '2025-11-29 19:39:56', '2025-11-29 19:39:56'),
(30, 11, '1ce91cff0395bebdbe4e27a5584b444889d00297493a8a5552d7f07760fd9b8a_11_1764481171', '2025-12-30 13:39:31', '2025-11-30 13:39:31', '2025-11-30 13:39:31');

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
  ADD KEY `idx_tracking_number` (`TrackingNumber`),
  ADD KEY `fk_Application_Transaction` (`TransactionID`);

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
-- Indexes for table `gradesubmissiondeadline`
--
ALTER TABLE `gradesubmissiondeadline`
  ADD PRIMARY KEY (`DeadlineID`),
  ADD UNIQUE KEY `unique_schoolyear_quarter` (`SchoolYearID`,`Quarter`),
  ADD KEY `fk_GradeDeadline_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_GradeDeadline_CreatedByUser` (`CreatedByUserID`);

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
  ADD KEY `fk_Payment_VerifiedByUser` (`VerifiedByUserID`),
  ADD KEY `VerifiedBy` (`VerifiedBy`);

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
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`SessionID`),
  ADD UNIQUE KEY `Token` (`Token`),
  ADD UNIQUE KEY `UserID` (`UserID`),
  ADD KEY `fk_UserSessions_User` (`UserID`),
  ADD KEY `idx_token_expiry` (`Token`,`ExpiresAt`);

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
  MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `AttendanceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `attendancemethod`
--
ALTER TABLE `attendancemethod`
  MODIFY `MethodID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `attendancesummary`
--
ALTER TABLE `attendancesummary`
  MODIFY `AttendanceSummaryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `AuditID` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `authorized_escort`
--
ALTER TABLE `authorized_escort`
  MODIFY `EscortID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `GradeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=505;

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
-- AUTO_INCREMENT for table `gradesubmissiondeadline`
--
ALTER TABLE `gradesubmissiondeadline`
  MODIFY `DeadlineID` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `ItemTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  MODIFY `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  MODIFY `PolicyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `TokenID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

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
  MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `studentprofile`
--
ALTER TABLE `studentprofile`
  MODIFY `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `transactionitem`
--
ALTER TABLE `transactionitem`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `transactionstatus`
--
ALTER TABLE `transactionstatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `SessionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

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
  ADD CONSTRAINT `fk_Application_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Application_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE SET NULL;

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

--
-- Constraints for table `gradesubmissiondeadline`
--
ALTER TABLE `gradesubmissiondeadline`
  ADD CONSTRAINT `fk_GradeDeadline_CreatedByUser` FOREIGN KEY (`CreatedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_GradeDeadline_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`VerifiedBy`) REFERENCES `user` (`UserID`);

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `fk_Profile_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `studentprofile`
--
ALTER TABLE `studentprofile`
  ADD CONSTRAINT `fk_StudentProfile_Profile` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `fk_UserSessions_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
