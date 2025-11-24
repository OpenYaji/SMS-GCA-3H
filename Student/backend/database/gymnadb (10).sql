-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2025 at 09:54 PM
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
-- Database: `gymnadb`
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
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `AnnouncementID` int(11) NOT NULL,
  `AuthorUserID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Content` text NOT NULL,
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
  `ApplicantProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `ApplyingForGradeLevelID` int(11) NOT NULL,
  `EnrolleeType` enum('New','Old','Transferee') NOT NULL,
  `ApplicationStatus` enum('Pending','For Review','Approved','Rejected','Waitlisted') NOT NULL DEFAULT 'Pending',
  `SubmissionDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ReviewedDate` datetime DEFAULT NULL,
  `PreviousSchool` varchar(255) DEFAULT NULL,
  `ReviewedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`ApplicationID`, `ApplicantProfileID`, `SchoolYearID`, `ApplyingForGradeLevelID`, `EnrolleeType`, `ApplicationStatus`, `SubmissionDate`, `ReviewedDate`, `PreviousSchool`, `ReviewedByUserID`) VALUES
(1, 9, 6, 1, 'New', 'Pending', '2025-10-22 16:38:01', NULL, NULL, NULL),
(2, 10, 6, 6, 'New', 'Approved', '2025-10-21 16:38:01', '2025-10-22 16:38:01', NULL, NULL),
(3, 12, 6, 5, 'Old', 'Approved', '2025-10-21 16:38:01', '2025-10-22 16:38:01', NULL, NULL);

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

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`AttendanceID`, `StudentProfileID`, `ClassScheduleID`, `AttendanceDate`, `CheckInTime`, `CheckOutTime`, `AttendanceStatus`, `AttendanceMethodID`, `Notes`) VALUES
(1, 9, 1, '2025-10-20', '2025-10-20 07:58:00', NULL, 'Present', NULL, NULL);

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
(1, 4, 2, 58, 60, '2025-10-22 15:07:05'),
(2, 5, 2, 60, 60, '2025-10-22 15:07:05'),
(3, 7, 6, 45, 60, '2025-10-22 15:50:00'),
(4, 7, 2, 180, 180, '2025-10-22 15:07:05'),
(5, 7, 1, 178, 180, '2025-10-22 15:07:05'),
(6, 7, 3, 179, 180, '2025-10-22 15:07:05'),
(7, 7, 4, 180, 180, '2025-10-22 15:07:05'),
(8, 7, 5, 177, 180, '2025-10-22 15:07:05');

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

--
-- Dumping data for table `classschedule`
--

INSERT INTO `classschedule` (`ScheduleID`, `SectionID`, `SubjectID`, `TeacherProfileID`, `DayOfWeek`, `StartTime`, `EndTime`, `ScheduleStatusID`, `RoomNumber`) VALUES
(1, 3, 6, 1, 'Monday', '08:00:00', '09:00:00', NULL, 'Room 101');

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
(1, 3, 'Tomasa Silang', 0x3039323031313132323232),
(2, 4, 'Maria Dacayo', 0x2b363339313731323334353637),
(3, 5, 'Teodora Alonzo', 0x2b363339313738383839393939),
(5, 7, 'Gloria Marie James', 0x2b3132313337383931323334);

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
(1, 4, 1, 2, '2024-08-01'),
(2, 4, 2, 1, '2023-08-01'),
(3, 5, 1, 2, '2024-08-05'),
(4, 5, 2, 1, '2023-08-07'),
(11, 7, 7, 5, '2020-08-15'),
(12, 7, 6, 4, '2021-08-14'),
(13, 7, 5, 3, '2022-08-13'),
(14, 7, 2, 1, '2023-08-12'),
(15, 7, 4, 2, '2024-08-11'),
(16, 7, 3, 6, '2025-08-10'),
(17, 9, 3, 6, '2025-08-15'),
(18, 10, 1, 2, '2024-08-01'),
(19, 11, 1, 2, '2024-08-02');

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
(1, 1, 1, 'First Quarter', 85.42, NULL, NULL, '2025-10-13 23:53:19', NULL),
(2, 1, 1, 'Second Quarter', 88.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(3, 1, 2, 'First Quarter', 85.42, NULL, NULL, '2025-10-13 23:53:19', NULL),
(4, 1, 2, 'Second Quarter', 86.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(5, 1, 3, 'First Quarter', 85.42, NULL, NULL, '2025-10-13 23:53:19', NULL),
(6, 1, 3, 'Second Quarter', 90.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(7, 1, 4, 'First Quarter', 85.42, NULL, NULL, '2025-10-13 23:53:19', NULL),
(8, 1, 4, 'Second Quarter', 89.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(9, 1, 5, 'First Quarter', 85.42, NULL, NULL, '2025-10-13 23:53:19', NULL),
(10, 1, 5, 'Second Quarter', 91.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(11, 2, 1, 'First Quarter', 86.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(12, 2, 1, 'Second Quarter', 88.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(13, 2, 1, 'Third Quarter', 90.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(14, 2, 1, 'Fourth Quarter', 91.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(15, 2, 2, 'First Quarter', 85.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(16, 2, 2, 'Second Quarter', 84.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(17, 2, 2, 'Third Quarter', 83.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(18, 2, 2, 'Fourth Quarter', 86.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(19, 2, 3, 'First Quarter', 87.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(20, 2, 3, 'Second Quarter', 89.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(21, 2, 3, 'Third Quarter', 90.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(22, 2, 3, 'Fourth Quarter', 88.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(23, 2, 4, 'First Quarter', 90.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(24, 2, 4, 'Second Quarter', 92.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(25, 2, 4, 'Third Quarter', 91.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(26, 2, 4, 'Fourth Quarter', 94.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(27, 2, 5, 'First Quarter', 83.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(28, 2, 5, 'Second Quarter', 85.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(29, 2, 5, 'Third Quarter', 84.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(30, 2, 5, 'Fourth Quarter', 86.00, NULL, NULL, '2025-10-13 23:53:19', NULL),
(31, 3, 1, 'First Quarter', 92.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(32, 3, 1, 'Second Quarter', 94.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(33, 3, 2, 'First Quarter', 88.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(34, 3, 2, 'Second Quarter', 90.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(35, 3, 3, 'First Quarter', 95.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(36, 3, 3, 'Second Quarter', 93.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(37, 3, 4, 'First Quarter', 89.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(38, 3, 4, 'Second Quarter', 91.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(39, 3, 5, 'First Quarter', 93.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(40, 3, 5, 'Second Quarter', 95.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(41, 4, 1, 'First Quarter', 89.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(42, 4, 1, 'Second Quarter', 90.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(43, 4, 1, 'Third Quarter', 91.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(44, 4, 1, 'Fourth Quarter', 92.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(45, 4, 2, 'First Quarter', 85.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(46, 4, 2, 'Second Quarter', 86.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(47, 4, 2, 'Third Quarter', 88.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(48, 4, 2, 'Fourth Quarter', 87.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(49, 4, 3, 'First Quarter', 91.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(50, 4, 3, 'Second Quarter', 93.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(51, 4, 3, 'Third Quarter', 92.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(52, 4, 3, 'Fourth Quarter', 94.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(53, 4, 4, 'First Quarter', 88.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(54, 4, 4, 'Second Quarter', 89.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(55, 4, 4, 'Third Quarter', 90.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(56, 4, 4, 'Fourth Quarter', 91.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(57, 4, 5, 'First Quarter', 90.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(58, 4, 5, 'Second Quarter', 92.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(59, 4, 5, 'Third Quarter', 91.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(60, 4, 5, 'Fourth Quarter', 93.00, NULL, NULL, '2025-10-14 16:56:47', NULL),
(101, 11, 1, 'First Quarter', 85.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(102, 11, 1, 'Second Quarter', 88.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(103, 11, 1, 'Third Quarter', 87.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(104, 11, 1, 'Fourth Quarter', 89.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(105, 11, 2, 'First Quarter', 88.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(106, 11, 2, 'Second Quarter', 86.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(107, 11, 2, 'Third Quarter', 89.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(108, 11, 2, 'Fourth Quarter', 90.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(109, 12, 1, 'First Quarter', 88.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(110, 12, 1, 'Second Quarter', 89.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(111, 12, 1, 'Third Quarter', 90.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(112, 12, 1, 'Fourth Quarter', 89.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(113, 12, 2, 'First Quarter', 89.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(114, 12, 2, 'Second Quarter', 90.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(115, 12, 2, 'Third Quarter', 91.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(116, 12, 2, 'Fourth Quarter', 92.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(117, 13, 1, 'First Quarter', 90.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(118, 13, 1, 'Second Quarter', 91.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(119, 13, 1, 'Third Quarter', 92.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(120, 13, 1, 'Fourth Quarter', 90.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(121, 13, 2, 'First Quarter', 91.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(122, 13, 2, 'Second Quarter', 90.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(123, 13, 2, 'Third Quarter', 92.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(124, 13, 2, 'Fourth Quarter', 93.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(125, 14, 1, 'First Quarter', 91.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(126, 14, 1, 'Second Quarter', 92.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(127, 14, 1, 'Third Quarter', 93.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(128, 14, 1, 'Fourth Quarter', 92.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(129, 14, 2, 'First Quarter', 92.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(130, 14, 2, 'Second Quarter', 93.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(131, 14, 2, 'Third Quarter', 94.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(132, 14, 2, 'Fourth Quarter', 91.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(133, 15, 1, 'First Quarter', 93.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(134, 15, 1, 'Second Quarter', 94.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(135, 15, 1, 'Third Quarter', 92.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(136, 15, 1, 'Fourth Quarter', 95.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(137, 15, 2, 'First Quarter', 94.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(138, 15, 2, 'Second Quarter', 92.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(139, 15, 2, 'Third Quarter', 95.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(140, 15, 2, 'Fourth Quarter', 96.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(141, 16, 1, 'First Quarter', 95.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(142, 16, 1, 'Second Quarter', 94.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(143, 16, 1, 'Third Quarter', 96.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(144, 16, 2, 'First Quarter', 96.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(145, 16, 2, 'Second Quarter', 95.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(146, 16, 2, 'Third Quarter', 97.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(147, 16, 3, 'First Quarter', 94.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(148, 16, 3, 'Second Quarter', 95.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(149, 16, 3, 'Third Quarter', 95.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(150, 16, 4, 'First Quarter', 97.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(151, 16, 4, 'Second Quarter', 98.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(152, 16, 4, 'Third Quarter', 96.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(153, 16, 5, 'First Quarter', 95.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(154, 16, 5, 'Second Quarter', 96.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(155, 16, 5, 'Third Quarter', 97.00, NULL, NULL, '2025-10-15 15:33:33', NULL),
(156, 17, 6, 'First Quarter', 92.50, NULL, NULL, '2025-10-22 16:38:01', NULL),
(157, 18, 1, 'First Quarter', 85.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(158, 18, 1, 'Second Quarter', 87.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(159, 18, 2, 'First Quarter', 88.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(160, 18, 2, 'Second Quarter', 86.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(161, 19, 1, 'First Quarter', 90.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(162, 19, 1, 'Second Quarter', 91.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(163, 19, 1, 'Third Quarter', 89.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(164, 19, 1, 'Fourth Quarter', 92.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(165, 19, 2, 'First Quarter', 93.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(166, 19, 2, 'Second Quarter', 92.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(167, 19, 2, 'Third Quarter', 94.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(168, 19, 2, 'Fourth Quarter', 95.00, NULL, NULL, '2025-10-22 16:38:01', NULL),
(169, 16, 5, 'Fourth Quarter', 99.00, 'Passed', NULL, '2025-10-27 01:45:23', NULL),
(170, 16, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-10-27 01:47:20', NULL),
(172, 16, 2, 'Fourth Quarter', 90.00, NULL, NULL, '2025-10-27 01:53:16', NULL);

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
(1, 'Grade 1', 4),
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
(1, 'Tomasa Silang', 0x3039323031313132323232, NULL, 'Homemaker', NULL),
(2, 'Maria Dacayo', 0x2b363339313731323334353637, 0x6d617269612e64616361796f40656d61696c2e636f6d, NULL, NULL),
(3, 'Juan Dacayo', NULL, NULL, NULL, NULL),
(4, 'Teodora Alonzo', 0x2b363339313738383839393939, 0x742e616c6f6e7a6f40656d61696c2e636f6d, 'Businesswoman', NULL),
(5, 'Francisco Mercado', NULL, NULL, NULL, NULL),
(7, 'Gloria Marie James', 0x2b3132313337383931323334, 0x676c6f7269612e6a616d657340656d61696c2e636f6d, NULL, NULL),
(8, 'Sarah Davis', 0x2b363339313731313132323333, 0x73617261682e646176697340656d61696c2e636f6d, 'Lawyer', NULL);

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
(1, 'Tuition Fee', 1, 0),
(2, 'Books', 1, 0),
(3, 'Test Paper', 1, 0);

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
(1, 3, 55.00, 157.00, 0x4e6f206b6e6f776e20616c6c657267696573, 0x4e6f6e65, NULL),
(2, 4, 35.00, 140.00, 0x4e6f6e65, 0x4e6f6e65, NULL),
(3, 5, 38.50, 142.00, 0x5065616e757473, 0x417374686d61, NULL),
(5, 7, 70.00, 210.00, 0x4e6f6e65, 0x4e6f6e65, NULL);

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
(1, 4, 2, 4, 'Excellent', NULL, '2025-10-22 15:07:05', '2025-10-22 15:07:05'),
(2, 5, 2, 5, 'Outstanding', NULL, '2025-10-22 15:07:05', '2025-10-22 15:07:05'),
(3, 7, 6, 5, 'Excellent', NULL, '2025-10-22 15:07:05', '2025-10-22 15:46:00'),
(4, 7, 2, 5, 'Outstanding', NULL, '2025-10-22 15:07:05', '2025-10-22 15:07:05'),
(5, 7, 1, 4, 'Excellent', NULL, '2025-10-22 15:07:05', '2025-10-22 15:07:05'),
(6, 7, 3, 5, 'Outstanding', NULL, '2025-10-22 15:07:05', '2025-10-22 15:07:05'),
(7, 7, 4, 4, 'Excellent', NULL, '2025-10-22 15:07:05', '2025-10-22 15:07:05'),
(8, 7, 5, 5, 'Outstanding', NULL, '2025-10-22 15:07:05', '2025-10-22 15:07:05');

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

--
-- Dumping data for table `passwordhistory`
--

INSERT INTO `passwordhistory` (`HistoryID`, `UserID`, `PasswordHash`, `CreatedAt`) VALUES
(1, 8, '$2y$10$j5KBFcOjK4w2gCGNOURpSuzD.sH5.2HhTBXpno3QN8uF39N8WDfVC', '2025-10-28 03:13:56'),
(2, 8, '$2y$10$Ux1Zto2lUaWYGpUkaNbOpen4Y3ooEdtfC1Csve5K3REWNTOcGGVLG', '2025-10-28 03:15:42'),
(3, 8, '$2y$10$BQqJ/zfuTzPgBKk4FlAoYO37ODVUcsHHrZ45VoqcI.llNNHCzoCQ6', '2025-10-28 03:18:32');

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
(1, 1, '$2y$10$Y8asf3.OLs/8s7aK2iEwP.jX7K8.21.Ue10F.j9.5fG9.qD4.hW2G', '2025-10-13 14:32:53', NULL, 0, 0, NULL),
(2, 3, '$2y$10$ZPi08iYzpGfvd68RsRSPn.VTikAkhcTQ9FTrum7aw3.R/AB/m3Mfe', '2025-10-13 22:47:44', NULL, 0, 0, NULL),
(3, 4, '$2y$10$b37k3B5zryXBXxeQa7prW.RCksBtTRzYFQaZ1QCloi87WaSMENRrm', '2025-10-13 23:50:00', NULL, 0, 0, NULL),
(4, 6, '$2y$10$wM1Ny4V8XJ5c75Qk0/WKEODVCQHXS2R8kM9BlYNp5MrXr593MfUlC', '2025-10-14 16:56:46', NULL, 0, 0, NULL),
(6, 8, '$2y$10$9NJ6ZyPqZMKiGtQJLvFOIu/JdawVJUKAtVbbcNuACcPs1XvwsT4FO', '2025-10-28 03:18:32', NULL, 0, 0, NULL),
(7, 9, '$2y$10$NotRealHashForPendingUser1.c', '2025-10-22 16:38:01', NULL, 0, 0, NULL),
(8, 10, '$2y$10$NotRealHashForPendingUser2.c', '2025-10-22 16:38:01', NULL, 0, 0, NULL),
(9, 11, '$2y$10$RealPasswordHashForActiveUser1', '2025-10-22 16:38:01', NULL, 0, 0, NULL),
(10, 12, '$2y$10$RealPasswordHashForActiveUser2', '2025-10-22 16:38:01', NULL, 0, 0, NULL),
(11, 13, '$2y$10$PasswordHashFromLastYear1', '2025-10-22 16:38:01', NULL, 0, 0, NULL),
(12, 14, '$2y$10$PasswordHashForAlumni1', '2025-10-22 16:38:01', NULL, 0, 0, NULL);

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
(1, 8, 'a50c8231165e7f700aba27b804fb91d316320fd486d9a9e8884f5ba7e1368a95', '2025-10-27 22:13:13', 0, '2025-10-28 04:13:13'),
(2, 8, 'd8735354b616aa79f3fa79b12d5d5d3c8be4e7e51ef319c3297d30d338aa61f8', '2025-10-27 22:14:07', 0, '2025-10-28 04:14:07'),
(3, 8, 'cd9a3e0957446ef3ee170389f546dd1651e23b1f75ced392f85ee9dc80fe00b7', '2025-10-27 22:24:32', 0, '2025-10-28 04:24:32'),
(4, 8, 'eddba003d7673734ca02c95a0cdb045008625458d3c22f7750dbc8591dc86688', '2025-10-27 22:25:10', 0, '2025-10-28 04:25:10'),
(5, 8, 'dc18739b4cf8c9b171c4be3af8f70fff6dccf7f4fbb0e6ecb9dd66ff1b79875f', '2025-10-27 22:30:38', 0, '2025-10-28 04:30:38'),
(6, 8, 'cb2ea1afea9eadc216c899484177870732d8452471adb2b9cfb94ef7d747d477', '2025-10-27 22:32:29', 0, '2025-10-28 04:32:29'),
(7, 8, 'bd0feaa7b029aa9840d9b178e4013850fe9140f492897b2b8002414b3ff6f5d5', '2025-10-27 22:38:10', 0, '2025-10-28 04:38:10'),
(8, 8, '74c79e953f8958eaedc5f744fc787725fb78510d5e51bdcfe65390d38d2ef0f4', '2025-10-27 22:46:11', 0, '2025-10-28 04:46:11'),
(9, 8, '296d3469ee772f7ca77a3deb10b388bc014fbdff89618545ba83b88b4a5bfb61', '2025-10-27 22:49:32', 0, '2025-10-28 04:49:32');

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
(6, 7, 1, 20000.00, '2020-08-15 10:00:00', NULL, NULL, 'Verified', NULL, NULL, NULL),
(7, 8, 1, 21000.00, '2021-08-14 10:00:00', NULL, NULL, 'Verified', NULL, NULL, NULL),
(8, 9, 2, 22000.00, '2022-08-13 10:00:00', NULL, NULL, 'Verified', NULL, NULL, NULL),
(9, 10, 1, 23000.00, '2023-08-12 10:00:00', NULL, NULL, 'Verified', NULL, NULL, NULL),
(10, 11, 2, 24000.00, '2024-08-11 10:00:00', NULL, NULL, 'Verified', NULL, NULL, NULL),
(12, 14, 2, 5000.00, '2025-08-15 09:30:00', 'GCASH-REF-12345', NULL, 'Verified', NULL, NULL, NULL),
(13, 16, 1, 24000.00, '2024-08-02 10:00:00', NULL, NULL, 'Verified', NULL, NULL, NULL);

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
(1, 'Cash', NULL, 1, 0),
(2, 'GCash', NULL, 1, 0);

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
(1, 1, 'Juan', 'Dela Cruz', 'Santos', NULL, NULL, NULL),
(2, 2, 'Maria', 'Clara', NULL, NULL, NULL, NULL),
(3, 3, 'Gabriela', 'Silang', 'Cariño', 0x3039313839383736353433, 0x53616e74612c20496c6f636f7320537572, 'https://example.com/profiles/gabrielasilang.jpg'),
(4, 4, 'Zhego Ian', 'Co', 'B.', 0x2b363339313435353639383735, 0x536175796f2c205175657a6f6e20436974792c204d6574726f204d616e696c61, 'http://localhost/Gymnazo-Student-Side/backend/profilepic/student/jhego.jpg'),
(5, 5, 'Marlyn', 'Shedeson', NULL, NULL, NULL, NULL),
(6, 6, 'Jose', 'Rizal', 'P.', 0x2b363339313931323334353637, 0x43616c616d62612c204c6167756e61, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Unidentified_photographer_-_Jos%C3%A9_Rizal_-_Google_Art_Project_2.jpg/800px-Unidentified_photographer_-_Jos%C3%A9_Rizal_-_Google_Art_Project_2.jpg'),
(8, 8, 'Lebron', 'James', 'Raymone', 0x2b3132313331323334353632, 0x536175796f2068616861, 'https://upload.wikimedia.org/wikipedia/commons/a/a7/LeBron_James_Lakers.jpg'),
(9, 9, 'Alice', 'Smith', 'Jane', NULL, NULL, NULL),
(10, 10, 'Ben', 'Carter', 'Michael', NULL, NULL, NULL),
(11, 11, 'Chloe', 'Davis', 'Anne', NULL, NULL, NULL),
(12, 13, 'David', 'Lee', 'James', NULL, NULL, NULL),
(13, 14, 'Eva', 'Wilson', 'Marie', NULL, NULL, NULL);

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
(1, 'S.Y. 2023-2024', '2023-08-01', '2024-06-01', 0),
(2, 'S.Y. 2024-2025', '2024-08-01', '2025-06-01', 0),
(3, 'S.Y. 2022-2023', '2022-08-01', '2023-06-01', 0),
(4, 'S.Y. 2021-2022', '2021-08-01', '2022-06-01', 0),
(5, 'S.Y. 2020-2021', '2020-08-01', '2021-06-01', 0),
(6, 'S.Y. 2025-2026', '2025-08-01', '2026-06-01', 1);

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
(1, 4, 2, 1, 'St. Peter', 30, 0),
(2, 4, 1, NULL, 'St. Paul', NULL, 0),
(3, 6, 6, NULL, 'St. Michael', NULL, 0),
(4, 5, 2, NULL, 'St. Michael', NULL, 0),
(5, 3, 3, NULL, 'St. Michael', NULL, 0),
(6, 2, 4, NULL, 'St. Michael', NULL, 0),
(7, 1, 5, NULL, 'St. Michael', NULL, 0);

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

--
-- Dumping data for table `securefile`
--

INSERT INTO `securefile` (`FileID`, `OriginalFileName`, `StoredFileName`, `FilePath`, `FileSize`, `MimeType`, `FileHash`, `UploadedByUserID`, `UploadedAt`, `EncryptionMethod`, `AccessLevel`, `ExpiryDate`) VALUES
(1, 'quarter-1-grade-slip-2025-10-27 (1).pdf', '68ffc6e565635_1761593061.pdf', 'C:\\xampp\\htdocs\\Gymazo-Student-Side\\backend\\api\\support/../../uploads/tickets/68ffc6e565635_1761593061.pdf', 11927, 'application/pdf', NULL, 8, '2025-10-28 03:24:21', NULL, 'private', NULL);

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
(1, 3, 1, 'Mother', 1, 1, 1, 0),
(2, 4, 2, 'Mother', 1, 1, 1, 0),
(3, 4, 3, 'Father', 0, 0, 1, 1),
(4, 5, 4, 'Mother', 1, 1, 1, 0),
(5, 5, 5, 'Father', 0, 0, 1, 0),
(7, 7, 7, 'Mother', 1, 1, 1, 0),
(8, 9, 8, 'Mother', 1, 1, 1, 0);

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
,`UserType` enum('Admin','Teacher','Student','Parent','Staff')
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
(1, 1, '2024-00001', NULL, NULL, 'Male', NULL, 'Enrolled', NULL),
(2, 2, '2024-00002', NULL, NULL, NULL, NULL, 'Enrolled', NULL),
(3, 3, '1731-1763', NULL, '1731-03-19', 'Female', 'Filipino', 'Enrolled', NULL),
(4, 4, '2025-00001', NULL, '2015-08-01', 'Male', 'Filipino', 'Enrolled', NULL),
(5, 6, '2025-00002', NULL, '2015-08-30', 'Male', 'Filipino', 'Enrolled', NULL),
(7, 8, '2025-00003', NULL, '2013-12-30', 'Male', 'American', 'Enrolled', NULL),
(8, 10, '2025-00004', NULL, '2013-05-10', 'Male', 'Filipino', 'Enrolled', NULL),
(9, 11, '2025-00005', NULL, '2013-02-14', 'Female', 'Filipino', 'Enrolled', NULL),
(10, 12, '2024-00003', NULL, '2015-01-20', 'Male', 'Filipino', 'Enrolled', NULL),
(11, 13, '2024-00004', NULL, '2015-03-03', 'Female', 'Filipino', 'Graduated', '2025-06-02');

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
(1, 'English', 'ENG4', 4, 1),
(2, 'Math', 'MATH4', 4, 1),
(3, 'Filipino', 'FIL4', 4, 1),
(4, 'MAPEH', 'MAPEH4', 4, 1),
(5, 'E.S.P', 'ESP4', 4, 1),
(6, 'English 6', 'ENG6', 6, 1),
(7, 'Math 6', 'MATH6', 6, 1),
(8, 'Science 6', 'SCI6', 6, 1);

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

--
-- Dumping data for table `supportticket`
--

INSERT INTO `supportticket` (`TicketID`, `UserID`, `Subject`, `TicketStatus`, `TicketPriority`, `CreatedAt`, `ResolvedAt`, `AssignedToUserID`, `ResolvedByUserID`) VALUES
(1, 8, 'Report an Issue', 'Open', 'Medium', '2025-10-28 03:24:21', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teacherprofile`
--

CREATE TABLE `teacherprofile` (
  `TeacherProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) NOT NULL,
  `Specialization` varchar(255) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacherprofile`
--

INSERT INTO `teacherprofile` (`TeacherProfileID`, `ProfileID`, `EmployeeNumber`, `Specialization`, `HireDate`) VALUES
(1, 5, 'T-2024-001', NULL, NULL);

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

--
-- Dumping data for table `ticketmessage`
--

INSERT INTO `ticketmessage` (`MessageID`, `TicketID`, `SenderUserID`, `Message`, `AttachmentFileID`, `SentAt`, `IsInternal`) VALUES
(1, 1, 8, 'there\'s a bug on the grades ', 1, '2025-10-28 03:24:21', 0);

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
(7, 7, 5, '2020-08-15', NULL, 20000.00, 20000.00, 1),
(8, 7, 4, '2021-08-14', NULL, 21000.00, 21000.00, 1),
(9, 7, 3, '2022-08-13', NULL, 22000.00, 22000.00, 1),
(10, 7, 1, '2023-08-12', NULL, 23000.00, 23000.00, 1),
(11, 7, 2, '2024-08-11', NULL, 24000.00, 24000.00, 1),
(12, 7, 6, '2025-08-10', '2026-03-30', 12000.00, 5000.00, 2),
(13, 8, 6, '2025-10-22', '2026-03-30', 25000.00, 0.00, 3),
(14, 9, 6, '2025-08-15', '2026-03-30', 25000.00, 5000.00, 2),
(15, 10, 6, '2025-10-22', '2026-03-30', 25000.00, 0.00, 3),
(16, 11, 2, '2024-08-02', NULL, 24000.00, 24000.00, 1);

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
(12, 12, 1, 'Test paper ni maam sindanum', 12000.00, 1),
(13, 13, 1, 'Tuition Fee S.Y. 2025-2026', 25000.00, 1),
(14, 14, 1, 'Tuition Fee S.Y. 2025-2026', 25000.00, 1),
(15, 15, 1, 'Tuition Fee S.Y. 2025-2026', 25000.00, 1),
(16, 16, 1, 'Tuition Fee S.Y. 2024-2025', 24000.00, 1);

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
  `UserType` enum('Admin','Teacher','Student','Parent','Staff') NOT NULL,
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
(1, 'student@test.com', 'Student', 'Active', NULL, '2025-10-13 14:32:53', '2025-10-13 14:32:53', 0, NULL),
(2, '', 'Student', 'Active', NULL, '2025-10-13 22:43:19', '2025-10-13 22:43:19', 0, NULL),
(3, 'g.silang@school.edu', 'Student', 'Active', NULL, '2025-10-13 22:47:44', '2025-10-13 22:47:44', 0, NULL),
(4, 'jhego.co@gmail.com', 'Student', 'Active', NULL, '2025-10-13 23:50:00', '2025-10-13 23:50:00', 0, NULL),
(5, 'm.shedeson@school.edu', 'Teacher', 'Active', NULL, '2025-10-13 23:53:19', '2025-10-13 23:53:19', 0, NULL),
(6, 'jose.rizal@school.edu', 'Student', 'Active', NULL, '2025-10-14 16:56:46', '2025-10-14 16:56:46', 0, NULL),
(8, 'johnreybisnarcalipes@gmail.com', 'Student', 'Active', NULL, '2025-10-15 15:33:32', '2025-10-28 04:36:47', 0, NULL),
(9, 'alice.smith@applicant.com', 'Student', 'PendingVerification', NULL, '2025-10-22 16:38:01', '2025-10-22 16:38:01', 0, NULL),
(10, 'ben.carter@applicant.com', 'Student', 'PendingVerification', NULL, '2025-10-22 16:38:01', '2025-10-22 16:38:01', 0, NULL),
(11, 'chloe.davis@student.com', 'Student', 'Active', NULL, '2025-10-22 16:38:01', '2025-10-22 16:38:01', 0, NULL),
(12, 'sarah.davis@parent.com', 'Parent', 'Active', NULL, '2025-10-22 16:38:01', '2025-10-22 16:38:01', 0, NULL),
(13, 'david.lee@student.com', 'Student', 'Active', NULL, '2024-07-30 10:00:00', '2025-10-22 16:38:01', 0, NULL),
(14, 'eva.wilson@alumni.com', 'Student', 'Inactive', NULL, '2024-07-30 11:00:00', '2025-06-02 17:00:00', 0, NULL);

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
,`UserType` enum('Admin','Teacher','Student','Parent','Staff')
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
  ADD KEY `fk_Application_SchoolYear` (`SchoolYearID`),
  ADD KEY `fk_Application_GradeLevel` (`ApplyingForGradeLevelID`),
  ADD KEY `fk_Application_ReviewedByUser` (`ReviewedByUserID`),
  ADD KEY `idx_application_applicant` (`ApplicantProfileID`);

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
  ADD KEY `fk_Attendance_Method` (`AttendanceMethodID`),
  ADD KEY `idx_attendance_student_schedule` (`StudentProfileID`,`ClassScheduleID`);

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
  ADD KEY `fk_AttendanceSummary_StudentProfile` (`StudentProfileID`),
  ADD KEY `fk_AttendanceSummary_SchoolYear` (`SchoolYearID`);

--
-- Indexes for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD PRIMARY KEY (`AuditID`),
  ADD KEY `idx_auditlog_table_record` (`TableName`,`RecordID`),
  ADD KEY `idx_auditlog_user` (`UserID`);

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
  ADD KEY `fk_Enrollment_SchoolYear` (`SchoolYearID`),
  ADD KEY `idx_enrollment_student` (`StudentProfileID`);

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
  ADD KEY `fk_Grade_ModifiedByUser` (`ModifiedByUserID`),
  ADD KEY `idx_grade_enrollment_subject` (`EnrollmentID`,`SubjectID`);

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
  ADD KEY `fk_ParticipationRating_StudentProfile` (`StudentProfileID`),
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
  ADD KEY `fk_PasswordResetToken_User` (`UserID`),
  ADD KEY `idx_token_expiry` (`Token`,`ExpiresAt`,`IsUsed`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`PaymentID`),
  ADD UNIQUE KEY `ReferenceNumber` (`ReferenceNumber`),
  ADD KEY `fk_Payment_PaymentMethod` (`PaymentMethodID`),
  ADD KEY `fk_Payment_SecureFile` (`ProofFileID`),
  ADD KEY `fk_Payment_VerifiedByUser` (`VerifiedByUserID`),
  ADD KEY `idx_payment_transaction` (`TransactionID`);

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
  ADD UNIQUE KEY `UserID` (`UserID`),
  ADD KEY `idx_profile_user` (`UserID`);

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
  ADD UNIQUE KEY `FileHash` (`FileHash`),
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
  ADD UNIQUE KEY `StudentNumber` (`StudentNumber`),
  ADD UNIQUE KEY `QRCodeID` (`QRCodeID`),
  ADD KEY `idx_studentprofile_profile` (`ProfileID`);

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
  ADD UNIQUE KEY `ProfileID` (`ProfileID`),
  ADD UNIQUE KEY `EmployeeNumber` (`EmployeeNumber`),
  ADD KEY `idx_teacherprofile_profile` (`ProfileID`);

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
  ADD KEY `fk_Transaction_SchoolYear` (`SchoolYearID`),
  ADD KEY `idx_transaction_student` (`StudentProfileID`),
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
  ADD UNIQUE KEY `EmailAddress` (`EmailAddress`),
  ADD KEY `idx_user_email` (`EmailAddress`);

--
-- Indexes for table `userrole`
--
ALTER TABLE `userrole`
  ADD PRIMARY KEY (`UserRoleID`),
  ADD UNIQUE KEY `UserID` (`UserID`,`RoleID`),
  ADD KEY `fk_UserRole_Role` (`RoleID`),
  ADD KEY `fk_UserRole_AssignedByUser` (`AssignedByUserID`),
  ADD KEY `idx_userrole_user_role` (`UserID`,`RoleID`);

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
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `AnnouncementID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `AttendanceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `attendancemethod`
--
ALTER TABLE `attendancemethod`
  MODIFY `MethodID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendancesummary`
--
ALTER TABLE `attendancesummary`
  MODIFY `AttendanceSummaryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `AuditID` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classschedule`
--
ALTER TABLE `classschedule`
  MODIFY `ScheduleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `GradeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

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
  MODIFY `GuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `itemtype`
--
ALTER TABLE `itemtype`
  MODIFY `ItemTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  MODIFY `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `ParticipationRatingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  MODIFY `PolicyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `TokenID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  MODIFY `PaymentMethodID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `SectionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `securefile`
--
ALTER TABLE `securefile`
  MODIFY `FileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `studentguardian`
--
ALTER TABLE `studentguardian`
  MODIFY `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `studentprofile`
--
ALTER TABLE `studentprofile`
  MODIFY `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `SubjectID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `supportticket`
--
ALTER TABLE `supportticket`
  MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  MODIFY `TeacherProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `transactionitem`
--
ALTER TABLE `transactionitem`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `transactionstatus`
--
ALTER TABLE `transactionstatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
