-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2025 at 08:27 PM
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
-- Database: `aaa`
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
(12, NULL, 7, 8, 'Old', 'Enrolled', 'full', 12, '', '2025-11-30 17:50:23', '2025-12-01 03:32:38', '', 'aa', 'aaa', 'aa', '2020-11-20', 'Male', '21 hahahahahahaha', '09123456789', 'john@gmail.com', 'hahahaha', 'hahahaha', 'father', '09123456789', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-20976', 1, NULL),
(13, NULL, 7, 3, 'New', 'Enrolled', 'full', 13, '', '2025-12-01 03:32:02', '2025-12-01 03:37:15', '', 'AHAHAHA', 'HAHA', 'HAHAHAHA', '2020-10-10', 'Male', 'HAHAHAHhahahahaha', '09949247885', 'john@gmail.com', 'hahaha', 'haha', 'father', '09949247885', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-59091', 1, NULL),
(14, NULL, 7, 4, 'Old', 'Enrolled', 'quarterly', 14, '', '2025-12-05 03:33:23', '2025-12-05 03:34:13', '', 'Heaven', 'Tranilla', 'Ybanez', '2017-12-12', 'Male', 'qcustreetcommonwealth', '09564230159', 'e21qwed3@gmail.com', 'Ven', 'Heave', 'Father', '09876543214', '2ujhnwqi213e@gmail.com', 'GCA-2025-91476', 1, NULL),
(15, NULL, 7, 5, 'New', 'Enrolled', 'full', 43, '', '2025-12-06 20:27:59', '2025-12-07 05:46:31', '', 'Heaven', 'Tranilla', 'Ybanez', '2017-12-12', 'Male', 'dupaxstreetquezoncity', '09564230159', 'sdnu21e21ji@gmail.com', 'Ven', 'Heav', 'Father', '09876543212', 'sdnu21e21ji@gmail.com', 'GCA-2025-58313', 1, NULL),
(16, NULL, 7, 3, 'Old', 'Enrolled', 'monthly', 44, '', '2025-12-06 21:03:54', '2025-12-07 05:47:33', '', 'asd', 'asd', 'asd', '2018-12-12', 'Male', 'qcustreetcommonwealths', '09564230159', 'sdnu21e21ji@gmail.com', 'Ven', 'jiewqji', 'ewq', '09876543214', 'sdnu21e21ji@gmail.com', 'GCA-2025-81256', 1, NULL),
(17, NULL, 7, 3, 'Transferee', 'Enrolled', 'full', 42, '', '2025-12-06 23:20:06', '2025-12-07 04:51:58', '', 'Nevaeh', 'Allinart', 'Y', '2017-12-12', 'Male', 'dupaxstreetquezoncity', '09865421032', 'sdnu21e21ji@gmail.com', 'Ven', 'Heaves', 'mother', '09876543214', 'sdnu21e21ji@gmail.com', 'GCA-2025-01269', 1, NULL),
(18, NULL, 7, 5, 'Old', 'Enrolled', 'full', 45, '', '2025-12-07 03:15:04', '2025-12-07 08:03:57', '', 'Nevs', 'Art', 'Z', '2018-12-12', 'Male', 'ewqewqewqewq', '09865421032', 'sdnu21e21ji@gmail.com', 'Ven', 'Heave', 'Father', '09876543212', 'sdnu21e21ji@gmail.com', 'GCA-2025-01821', 1, NULL),
(19, NULL, 7, 5, 'Old', 'Enrolled', 'full', 35, '', '2025-12-07 03:20:22', '2025-12-07 03:57:30', '', 'Cardo', 'De Leon', 'D', '2019-12-12', 'Male', 'cidgcidgcidg', '09564230159', 'cd99322@gmail.com', 'Flora', 'Dalisay', 'Grandmother', '09465220132', 'cd99322@gmail.com', 'GCA-2025-82873', 1, NULL),
(20, NULL, 7, 4, 'Old', 'Enrolled', 'quarterly', 47, '', '2025-12-07 17:09:19', '2025-12-09 00:25:33', '', 'Juan', 'Cruz', 'Dela', '2018-02-01', 'Male', 'dupaxstreetquezoncity', '09564230159', 'e21qwed3@gmail.com', 'Ven', 'Heav', 'Father', '09876543212', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-28211', 1, NULL),
(21, NULL, 7, 3, 'New', 'Enrolled', 'full', 46, '', '2025-12-08 23:50:34', '2025-12-08 23:58:53', '', 'aa', 'aaaa', 'aa', '2020-11-01', 'Male', 'aaaaaasdasdsada', '09123444444', 'johnreybisnarcalipes@gmail.com', 'Kpds', 'dasdsa', 'Father', '09123456789', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-94664', 1, NULL),
(22, NULL, 7, 7, 'Old', 'Enrolled', 'quarterly', 48, '', '2025-12-09 00:30:05', '2025-12-09 00:30:34', '', 'John', 'Calipes', 'Rey', '2020-11-11', 'Male', '21 hahahadada', '09123455555', 'dsa@gmail.com', 'dasdsadasd', 'dasdsadsa', 'father', '09123321123', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-08733', 1, NULL),
(23, NULL, 7, 3, 'New', 'Enrolled', 'full', 49, '', '2025-12-09 00:34:17', '2025-12-09 00:34:54', '', 'adasd', 'asasa', 'adsada', '2020-11-11', 'Male', 'aaaaaaaaaaaaaaaaa', '09123123123', 'dasda@gmail.com', 'dasdsa', 'dasdasda', 'father', '09123123123', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-22320', 1, NULL),
(24, NULL, 7, 8, 'New', 'Enrolled', 'full', 50, '', '2025-12-09 01:42:42', '2025-12-09 01:43:12', '', 'aaaa', 'aaaaa', 'aa', '2020-11-11', 'Male', '1321212323123dsadsa', '09123123231', 'dsa@gmail.com', 'dadasdasd', 'dasdasdasda', 'father', '09123123123', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-45143', 1, NULL),
(25, NULL, 7, 7, 'New', 'Enrolled', 'full', 51, '', '2025-12-09 01:44:11', '2025-12-09 01:44:55', '', 'aaaa', 'aaa', 'aa', '2020-11-11', 'Male', 'aaaaasdasdasda', '09123123123', 'ddsadsadadad@gmail.com', 'dadada', 'dasd', 'asdasda', '09123123123', 'dsada@gmail.com', 'GCA-2025-54475', 1, NULL),
(26, NULL, 7, 7, 'New', 'Enrolled', 'quarterly', 52, '', '2025-12-09 01:57:21', '2025-12-09 02:03:13', '', 'aaaa', 'aaa', 'aaaa', '2020-11-11', 'Male', 'asdasd sadasdadadad', '09123123312', 'jo@gmail.com', 'dasdada', 'dasdas', 'dasdasdasd', '09123123123', 'dsada@gmail.com', 'GCA-2025-58457', 1, NULL),
(27, NULL, 7, 3, 'New', 'Enrolled', 'quarterly', 53, '', '2025-12-09 02:09:18', '2025-12-09 02:09:47', '', 'adasdsadad', 'dasdada', 'adasd', '2020-11-12', 'Male', 'dasdasdasdasdasdsadsa', '09123123123', 'joh@gmail.com', 'dasdsadas', 'dasdasdasda', 'father', '09123231232', 'john@gmail.com', 'GCA-2025-73426', 1, NULL),
(28, NULL, 7, 7, 'New', 'Enrolled', 'quarterly', 54, '', '2025-12-09 02:31:37', '2025-12-09 02:32:05', '', 'aaa', 'aaaa', 'aa', '2020-11-11', 'Male', '32131231231123dsadasdad', '09123123312', 'dsad@gmail.com', 'dasdasda', 'dasdasd', 'father', '09121232311', 'jo@gmail.com', 'GCA-2025-94299', 1, NULL),
(29, NULL, 7, 6, 'New', 'Enrolled', 'quarterly', 55, '', '2025-12-09 02:46:29', '2025-12-09 03:04:03', '', 'aa', 'aaa', 'aaa', '2020-11-21', 'Male', '121212121212212', '01233122311', '31231313@gmailc.om', 'asdsada', 'dasds', 'adad', '32131313131', 'adsadasda@gmail.com', 'GCA-2025-68475', 1, NULL);

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
-- Table structure for table `archive_search`
--

CREATE TABLE `archive_search` (
  `id` int(11) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `grade_level` varchar(50) NOT NULL,
  `exit_type` varchar(100) NOT NULL,
  `exit_status` varchar(100) NOT NULL,
  `new_school` varchar(255) DEFAULT NULL,
  `transfer_reason` text DEFAULT NULL,
  `request_date` date NOT NULL,
  `contact_email` varchar(255) NOT NULL,
  `archived_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `archive_search`
--

INSERT INTO `archive_search` (`id`, `student_id`, `full_name`, `grade_level`, `exit_type`, `exit_status`, `new_school`, `transfer_reason`, `request_date`, `contact_email`, `archived_at`, `created_at`, `updated_at`) VALUES
(1, 'GCA-2025-00001', 'Juan D Efg', 'Grade 7', 'Transfer Out', 'Completed', NULL, 'Scholarship application', '2025-12-08', 'aaaa.aa@student.gca.edu.ph', '2025-12-08 23:31:59', '2025-12-08 23:31:59', '2025-12-08 23:31:59'),
(2, 'GCA-2025-00001', 'Juan D Efg', 'Grade 7', 'Transfer Out', 'Completed', NULL, 'Scholarship application', '2025-12-08', 'aaaa.aa@student.gca.edu.ph', '2025-12-08 23:39:09', '2025-12-08 23:39:09', '2025-12-08 23:39:09');

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
(12, 12, 7, 0, 0, '2025-12-01 03:38:16'),
(13, 13, 7, 0, 0, '2025-12-05 03:34:22'),
(14, 14, 7, 0, 0, '2025-12-05 03:34:49'),
(15, 15, 7, 0, 0, '2025-12-07 03:57:42'),
(16, 16, 7, 0, 0, '2025-12-07 05:13:23'),
(17, 17, 7, 0, 0, '2025-12-07 05:46:44'),
(18, 18, 7, 0, 0, '2025-12-07 05:47:39'),
(19, 19, 7, 0, 0, '2025-12-07 08:05:08'),
(20, 20, 7, 0, 0, '2025-12-08 23:59:23'),
(21, 21, 7, 0, 0, '2025-12-09 00:25:57'),
(22, 22, 7, 0, 0, '2025-12-09 00:31:23'),
(23, 23, 7, 0, 0, '2025-12-09 00:35:07'),
(24, 24, 7, 0, 0, '2025-12-09 01:45:09'),
(25, 25, 7, 0, 0, '2025-12-09 01:46:01'),
(26, 26, 7, 0, 0, '2025-12-09 02:03:26'),
(27, 27, 7, 0, 0, '2025-12-09 02:10:01'),
(28, 28, 7, 0, 0, '2025-12-09 02:32:19'),
(29, 29, 7, 0, 0, '2025-12-09 03:04:21');

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

--
-- Dumping data for table `document_request`
--

INSERT INTO `document_request` (`RequestID`, `StudentProfileID`, `DocumentType`, `Purpose`, `Quantity`, `DeliveryMethod`, `AdditionalNotes`, `RequestStatus`, `DateRequested`, `DateCompleted`, `ProcessedByUserID`) VALUES
(1, 1, 'completion', 'Scholarship application', 1, 'pickup', '', 'Completed', '2025-12-08 23:30:49', '2025-12-08 23:31:47', NULL),
(2, 1, 'enrollment', 'Transfer to another school', 1, 'pickup', '', 'Pending', '2025-12-08 23:40:15', NULL, NULL);

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
(1, 1, 'Tuv Wxyz', 0x3039313233343536373831),
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
(12, 12, 'hahaha haha', 0x3039393439323437383835),
(13, 13, 'hahahaha hahahaha', 0x3039313233343536373839),
(14, 14, 'Ven Heave', 0x3039383736353433323134),
(15, 15, 'Flora Dalisay', 0x3039343635323230313332),
(16, 16, 'Ven Heaves', 0x3039383736353433323134),
(17, 17, 'Ven Heav', 0x3039383736353433323132),
(18, 18, 'Ven jiewqji', 0x3039383736353433323134),
(19, 19, 'Ven Heave', 0x3039383736353433323132),
(20, 20, 'Kpds dasdsa', 0x3039313233343536373839),
(21, 21, 'Ven Heav', 0x3039383736353433323132),
(22, 22, 'dasdsadasd dasdsadsa', 0x3039313233333231313233),
(23, 23, 'dasdsa dasdasda', 0x3039313233313233313233),
(24, 24, 'dadada dasd', 0x3039313233313233313233),
(25, 25, 'dadasdasd dasdasdasda', 0x3039313233313233313233),
(26, 26, 'dasdada dasdas', 0x3039313233313233313233),
(27, 27, 'dasdsadas dasdasdasda', 0x3039313233323331323332),
(28, 28, 'dasdasda dasdasd', 0x3039313231323332333131),
(29, 29, 'asdsada dasds', 0x3332313331333133313331);

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
(12, 12, 6, 7, '2025-12-01', 0.00),
(13, 13, 16, 7, '2025-12-05', 0.00),
(14, 14, 7, 7, '2025-12-05', 0.00),
(15, 15, 10, 7, '2025-12-07', 0.00),
(16, 16, 5, 7, '2025-12-07', 0.00),
(17, 17, 9, 7, '2025-12-07', 0.00),
(18, 18, 5, 7, '2025-12-07', 0.00),
(19, 19, 10, 7, '2025-12-07', 0.00),
(20, 20, 6, 7, '2025-12-08', 0.00),
(21, 21, 8, 7, '2025-12-09', 0.00),
(22, 22, 14, 7, '2025-12-09', 0.00),
(23, 23, 6, 7, '2025-12-09', 0.00),
(24, 24, 14, 7, '2025-12-09', 0.00),
(25, 25, 16, 7, '2025-12-09', 0.00),
(26, 26, 14, 7, '2025-12-09', 0.00),
(27, 27, 6, 7, '2025-12-09', 0.00),
(28, 28, 14, 7, '2025-12-09', 0.00),
(29, 29, 12, 7, '2025-12-09', 0.00);

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
(1, 1, 37, 'First Quarter', 81.00, NULL, 2, '2025-12-08 03:41:15', 13),
(2, 1, 37, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(3, 1, 37, 'Third Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(4, 1, 37, 'Fourth Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(5, 1, 38, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(6, 1, 38, 'Second Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(7, 1, 38, 'Third Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(8, 1, 38, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(9, 1, 39, 'First Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(10, 1, 39, 'Second Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(11, 1, 39, 'Third Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(12, 1, 39, 'Fourth Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(13, 1, 40, 'First Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(14, 1, 40, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(15, 1, 40, 'Third Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(16, 1, 40, 'Fourth Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(17, 1, 41, 'First Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(18, 1, 41, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(19, 1, 41, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(20, 1, 41, 'Fourth Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(21, 1, 42, 'First Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(22, 1, 42, 'Second Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(23, 1, 42, 'Third Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(24, 1, 42, 'Fourth Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(25, 1, 43, 'First Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(26, 1, 43, 'Second Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(27, 1, 43, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(28, 1, 43, 'Fourth Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(29, 1, 44, 'First Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(30, 1, 44, 'Second Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(31, 1, 44, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(32, 1, 44, 'Fourth Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(33, 1, 45, 'First Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(34, 1, 45, 'Second Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(35, 1, 45, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(36, 1, 45, 'Fourth Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(37, 2, 1, 'First Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(38, 2, 1, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(39, 2, 1, 'Third Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(40, 2, 1, 'Fourth Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(41, 2, 2, 'First Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(42, 2, 2, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(43, 2, 2, 'Third Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(44, 2, 2, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(45, 2, 3, 'First Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(46, 2, 3, 'Second Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(47, 2, 3, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(48, 2, 3, 'Fourth Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(49, 2, 4, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(50, 2, 4, 'Second Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(51, 2, 4, 'Third Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(52, 2, 4, 'Fourth Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(53, 2, 5, 'First Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(54, 2, 5, 'Second Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(55, 2, 5, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(56, 2, 5, 'Fourth Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(57, 2, 6, 'First Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(58, 2, 6, 'Second Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(59, 2, 6, 'Third Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(60, 2, 6, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(61, 2, 7, 'First Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(62, 2, 7, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(63, 2, 7, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(64, 2, 7, 'Fourth Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(65, 2, 8, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(66, 2, 8, 'Second Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(67, 2, 8, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(68, 2, 8, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(69, 2, 9, 'First Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(70, 2, 9, 'Second Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(71, 2, 9, 'Third Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(72, 2, 9, 'Fourth Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(73, 3, 28, 'First Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(74, 3, 28, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(75, 3, 28, 'Third Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(76, 3, 28, 'Fourth Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(77, 3, 29, 'First Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(78, 3, 29, 'Second Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(79, 3, 29, 'Third Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(80, 3, 29, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(81, 3, 30, 'First Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(82, 3, 30, 'Second Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(83, 3, 30, 'Third Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(84, 3, 30, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(85, 3, 31, 'First Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(86, 3, 31, 'Second Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(87, 3, 31, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(88, 3, 31, 'Fourth Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(89, 3, 32, 'First Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(90, 3, 32, 'Second Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(91, 3, 32, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(92, 3, 32, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(93, 3, 33, 'First Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(94, 3, 33, 'Second Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(95, 3, 33, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(96, 3, 33, 'Fourth Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(97, 3, 34, 'First Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(98, 3, 34, 'Second Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(99, 3, 34, 'Third Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(100, 3, 34, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(101, 3, 35, 'First Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(102, 3, 35, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(103, 3, 35, 'Third Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(104, 3, 35, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(105, 3, 36, 'First Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(106, 3, 36, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(107, 3, 36, 'Third Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(108, 3, 36, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(109, 4, 1, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(110, 4, 1, 'Second Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(111, 4, 1, 'Third Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(112, 4, 1, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(113, 4, 2, 'First Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(114, 4, 2, 'Second Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(115, 4, 2, 'Third Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(116, 4, 2, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(117, 4, 3, 'First Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(118, 4, 3, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(119, 4, 3, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(120, 4, 3, 'Fourth Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(121, 4, 4, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(122, 4, 4, 'Second Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(123, 4, 4, 'Third Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(124, 4, 4, 'Fourth Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(125, 4, 5, 'First Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(126, 4, 5, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(127, 4, 5, 'Third Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(128, 4, 5, 'Fourth Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(129, 4, 6, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(130, 4, 6, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(131, 4, 6, 'Third Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(132, 4, 6, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(133, 4, 7, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(134, 4, 7, 'Second Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(135, 4, 7, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(136, 4, 7, 'Fourth Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(137, 4, 8, 'First Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(138, 4, 8, 'Second Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(139, 4, 8, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(140, 4, 8, 'Fourth Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(141, 4, 9, 'First Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(142, 4, 9, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(143, 4, 9, 'Third Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(144, 4, 9, 'Fourth Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(145, 5, 46, 'First Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(146, 5, 46, 'Second Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(147, 5, 46, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(148, 5, 46, 'Fourth Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(149, 5, 47, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(150, 5, 47, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(151, 5, 47, 'Third Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(152, 5, 47, 'Fourth Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(153, 5, 48, 'First Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(154, 5, 48, 'Second Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(155, 5, 48, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(156, 5, 48, 'Fourth Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(157, 5, 49, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(158, 5, 49, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(159, 5, 49, 'Third Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(160, 5, 49, 'Fourth Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(161, 5, 50, 'First Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(162, 5, 50, 'Second Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(163, 5, 50, 'Third Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(164, 5, 50, 'Fourth Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(165, 5, 51, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(166, 5, 51, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(167, 5, 51, 'Third Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(168, 5, 51, 'Fourth Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(169, 5, 52, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(170, 5, 52, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(171, 5, 52, 'Third Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(172, 5, 52, 'Fourth Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(173, 5, 53, 'First Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(174, 5, 53, 'Second Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(175, 5, 53, 'Third Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(176, 5, 53, 'Fourth Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(177, 5, 54, 'First Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(178, 5, 54, 'Second Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(179, 5, 54, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(180, 5, 54, 'Fourth Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(181, 5, 55, 'First Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(182, 5, 55, 'Second Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(183, 5, 55, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(184, 5, 55, 'Fourth Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(185, 5, 56, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(186, 5, 56, 'Second Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(187, 5, 56, 'Third Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(188, 5, 56, 'Fourth Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(189, 5, 57, 'First Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(190, 5, 57, 'Second Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(191, 5, 57, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(192, 5, 57, 'Fourth Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(193, 5, 58, 'First Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(194, 5, 58, 'Second Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(195, 5, 58, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(196, 5, 58, 'Fourth Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(197, 5, 59, 'First Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(198, 5, 59, 'Second Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(199, 5, 59, 'Third Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(200, 5, 59, 'Fourth Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(201, 5, 60, 'First Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(202, 5, 60, 'Second Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(203, 5, 60, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(204, 5, 60, 'Fourth Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(205, 6, 10, 'First Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(206, 6, 10, 'Second Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(207, 6, 10, 'Third Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(208, 6, 10, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(209, 6, 11, 'First Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(210, 6, 11, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(211, 6, 11, 'Third Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(212, 6, 11, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(213, 6, 12, 'First Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(214, 6, 12, 'Second Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(215, 6, 12, 'Third Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(216, 6, 12, 'Fourth Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(217, 6, 13, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(218, 6, 13, 'Second Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(219, 6, 13, 'Third Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(220, 6, 13, 'Fourth Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(221, 6, 14, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(222, 6, 14, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(223, 6, 14, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(224, 6, 14, 'Fourth Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(225, 6, 15, 'First Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(226, 6, 15, 'Second Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(227, 6, 15, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(228, 6, 15, 'Fourth Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(229, 6, 16, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(230, 6, 16, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(231, 6, 16, 'Third Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(232, 6, 16, 'Fourth Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(233, 6, 17, 'First Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(234, 6, 17, 'Second Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(235, 6, 17, 'Third Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(236, 6, 17, 'Fourth Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(237, 6, 18, 'First Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(238, 6, 18, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(239, 6, 18, 'Third Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(240, 6, 18, 'Fourth Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(241, 7, 28, 'First Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(242, 7, 28, 'Second Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(243, 7, 28, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(244, 7, 28, 'Fourth Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(245, 7, 29, 'First Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(246, 7, 29, 'Second Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(247, 7, 29, 'Third Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(248, 7, 29, 'Fourth Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(249, 7, 30, 'First Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(250, 7, 30, 'Second Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(251, 7, 30, 'Third Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(252, 7, 30, 'Fourth Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(253, 7, 31, 'First Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(254, 7, 31, 'Second Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(255, 7, 31, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(256, 7, 31, 'Fourth Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(257, 7, 32, 'First Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(258, 7, 32, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(259, 7, 32, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(260, 7, 32, 'Fourth Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(261, 7, 33, 'First Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(262, 7, 33, 'Second Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(263, 7, 33, 'Third Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(264, 7, 33, 'Fourth Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(265, 7, 34, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(266, 7, 34, 'Second Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(267, 7, 34, 'Third Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(268, 7, 34, 'Fourth Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(269, 7, 35, 'First Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(270, 7, 35, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(271, 7, 35, 'Third Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(272, 7, 35, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(273, 7, 36, 'First Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(274, 7, 36, 'Second Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(275, 7, 36, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(276, 7, 36, 'Fourth Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(277, 8, 1, 'First Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(278, 8, 1, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(279, 8, 1, 'Third Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(280, 8, 1, 'Fourth Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(281, 8, 2, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(282, 8, 2, 'Second Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(283, 8, 2, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(284, 8, 2, 'Fourth Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(285, 8, 3, 'First Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(286, 8, 3, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(287, 8, 3, 'Third Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(288, 8, 3, 'Fourth Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(289, 8, 4, 'First Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(290, 8, 4, 'Second Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(291, 8, 4, 'Third Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(292, 8, 4, 'Fourth Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(293, 8, 5, 'First Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(294, 8, 5, 'Second Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(295, 8, 5, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(296, 8, 5, 'Fourth Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(297, 8, 6, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(298, 8, 6, 'Second Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(299, 8, 6, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(300, 8, 6, 'Fourth Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(301, 8, 7, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(302, 8, 7, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(303, 8, 7, 'Third Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(304, 8, 7, 'Fourth Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(305, 8, 8, 'First Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(306, 8, 8, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(307, 8, 8, 'Third Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(308, 8, 8, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(309, 8, 9, 'First Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(310, 8, 9, 'Second Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(311, 8, 9, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(312, 8, 9, 'Fourth Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(313, 9, 1, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(314, 9, 1, 'Second Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(315, 9, 1, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(316, 9, 1, 'Fourth Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(317, 9, 2, 'First Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(318, 9, 2, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(319, 9, 2, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(320, 9, 2, 'Fourth Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(321, 9, 3, 'First Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(322, 9, 3, 'Second Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(323, 9, 3, 'Third Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(324, 9, 3, 'Fourth Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(325, 9, 4, 'First Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(326, 9, 4, 'Second Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(327, 9, 4, 'Third Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(328, 9, 4, 'Fourth Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(329, 9, 5, 'First Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(330, 9, 5, 'Second Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(331, 9, 5, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(332, 9, 5, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(333, 9, 6, 'First Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(334, 9, 6, 'Second Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(335, 9, 6, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(336, 9, 6, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(337, 9, 7, 'First Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(338, 9, 7, 'Second Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(339, 9, 7, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(340, 9, 7, 'Fourth Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(341, 9, 8, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(342, 9, 8, 'Second Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(343, 9, 8, 'Third Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(344, 9, 8, 'Fourth Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(345, 9, 9, 'First Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(346, 9, 9, 'Second Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(347, 9, 9, 'Third Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(348, 9, 9, 'Fourth Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(349, 10, 46, 'First Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(350, 10, 46, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(351, 10, 46, 'Third Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(352, 10, 46, 'Fourth Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(353, 10, 47, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(354, 10, 47, 'Second Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(355, 10, 47, 'Third Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(356, 10, 47, 'Fourth Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(357, 10, 48, 'First Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(358, 10, 48, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(359, 10, 48, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(360, 10, 48, 'Fourth Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(361, 10, 49, 'First Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(362, 10, 49, 'Second Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(363, 10, 49, 'Third Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(364, 10, 49, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(365, 10, 50, 'First Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(366, 10, 50, 'Second Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(367, 10, 50, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(368, 10, 50, 'Fourth Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(369, 10, 51, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(370, 10, 51, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(371, 10, 51, 'Third Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(372, 10, 51, 'Fourth Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(373, 10, 52, 'First Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(374, 10, 52, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(375, 10, 52, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(376, 10, 52, 'Fourth Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(377, 10, 53, 'First Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(378, 10, 53, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(379, 10, 53, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(380, 10, 53, 'Fourth Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(381, 10, 54, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(382, 10, 54, 'Second Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(383, 10, 54, 'Third Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(384, 10, 54, 'Fourth Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(385, 10, 55, 'First Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(386, 10, 55, 'Second Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(387, 10, 55, 'Third Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(388, 10, 55, 'Fourth Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(389, 10, 56, 'First Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(390, 10, 56, 'Second Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(391, 10, 56, 'Third Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(392, 10, 56, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(393, 10, 57, 'First Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(394, 10, 57, 'Second Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(395, 10, 57, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(396, 10, 57, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(397, 10, 58, 'First Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(398, 10, 58, 'Second Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(399, 10, 58, 'Third Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(400, 10, 58, 'Fourth Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(401, 10, 59, 'First Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(402, 10, 59, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(403, 10, 59, 'Third Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(404, 10, 59, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(405, 10, 60, 'First Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(406, 10, 60, 'Second Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(407, 10, 60, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(408, 10, 60, 'Fourth Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(409, 11, 46, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(410, 11, 46, 'Second Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(411, 11, 46, 'Third Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(412, 11, 46, 'Fourth Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(413, 11, 47, 'First Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(414, 11, 47, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(415, 11, 47, 'Third Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(416, 11, 47, 'Fourth Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(417, 11, 48, 'First Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(418, 11, 48, 'Second Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(419, 11, 48, 'Third Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(420, 11, 48, 'Fourth Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(421, 11, 49, 'First Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(422, 11, 49, 'Second Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(423, 11, 49, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(424, 11, 49, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(425, 11, 50, 'First Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(426, 11, 50, 'Second Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(427, 11, 50, 'Third Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(428, 11, 50, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(429, 11, 51, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(430, 11, 51, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(431, 11, 51, 'Third Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(432, 11, 51, 'Fourth Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(433, 11, 52, 'First Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(434, 11, 52, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(435, 11, 52, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(436, 11, 52, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(437, 11, 53, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(438, 11, 53, 'Second Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(439, 11, 53, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(440, 11, 53, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(441, 11, 54, 'First Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(442, 11, 54, 'Second Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(443, 11, 54, 'Third Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(444, 11, 54, 'Fourth Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(445, 11, 55, 'First Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(446, 11, 55, 'Second Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(447, 11, 55, 'Third Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(448, 11, 55, 'Fourth Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(449, 11, 56, 'First Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(450, 11, 56, 'Second Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(451, 11, 56, 'Third Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(452, 11, 56, 'Fourth Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(453, 11, 57, 'First Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(454, 11, 57, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(455, 11, 57, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(456, 11, 57, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(457, 11, 58, 'First Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(458, 11, 58, 'Second Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(459, 11, 58, 'Third Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(460, 11, 58, 'Fourth Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(461, 11, 59, 'First Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(462, 11, 59, 'Second Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(463, 11, 59, 'Third Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(464, 11, 59, 'Fourth Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(465, 11, 60, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(466, 11, 60, 'Second Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(467, 11, 60, 'Third Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(468, 11, 60, 'Fourth Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(469, 12, 1, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(470, 12, 1, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(471, 12, 1, 'Third Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(472, 12, 1, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(473, 12, 2, 'First Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(474, 12, 2, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(475, 12, 2, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(476, 12, 2, 'Fourth Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(477, 12, 3, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(478, 12, 3, 'Second Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(479, 12, 3, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(480, 12, 3, 'Fourth Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(481, 12, 4, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(482, 12, 4, 'Second Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(483, 12, 4, 'Third Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(484, 12, 4, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(485, 12, 5, 'First Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(486, 12, 5, 'Second Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(487, 12, 5, 'Third Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(488, 12, 5, 'Fourth Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(489, 12, 6, 'First Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(490, 12, 6, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(491, 12, 6, 'Third Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(492, 12, 6, 'Fourth Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(493, 12, 7, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(494, 12, 7, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(495, 12, 7, 'Third Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(496, 12, 7, 'Fourth Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(497, 12, 8, 'First Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(498, 12, 8, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(499, 12, 8, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(500, 12, 8, 'Fourth Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(501, 12, 9, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(502, 12, 9, 'Second Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(503, 12, 9, 'Third Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(504, 12, 9, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(505, 13, 46, 'First Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(506, 13, 46, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(507, 13, 46, 'Third Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(508, 13, 46, 'Fourth Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(509, 13, 47, 'First Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(510, 13, 47, 'Second Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(511, 13, 47, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(512, 13, 47, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(513, 13, 48, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(514, 13, 48, 'Second Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(515, 13, 48, 'Third Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(516, 13, 48, 'Fourth Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(517, 13, 49, 'First Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(518, 13, 49, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(519, 13, 49, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(520, 13, 49, 'Fourth Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(521, 13, 50, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(522, 13, 50, 'Second Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(523, 13, 50, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(524, 13, 50, 'Fourth Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(525, 13, 51, 'First Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(526, 13, 51, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(527, 13, 51, 'Third Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(528, 13, 51, 'Fourth Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(529, 13, 52, 'First Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(530, 13, 52, 'Second Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(531, 13, 52, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(532, 13, 52, 'Fourth Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(533, 13, 53, 'First Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(534, 13, 53, 'Second Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(535, 13, 53, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(536, 13, 53, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(537, 13, 54, 'First Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(538, 13, 54, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(539, 13, 54, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(540, 13, 54, 'Fourth Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(541, 13, 55, 'First Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(542, 13, 55, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(543, 13, 55, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(544, 13, 55, 'Fourth Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(545, 13, 56, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(546, 13, 56, 'Second Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(547, 13, 56, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(548, 13, 56, 'Fourth Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(549, 13, 57, 'First Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(550, 13, 57, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(551, 13, 57, 'Third Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(552, 13, 57, 'Fourth Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(553, 13, 58, 'First Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(554, 13, 58, 'Second Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(555, 13, 58, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(556, 13, 58, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(557, 13, 59, 'First Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(558, 13, 59, 'Second Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(559, 13, 59, 'Third Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(560, 13, 59, 'Fourth Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(561, 13, 60, 'First Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(562, 13, 60, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(563, 13, 60, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(564, 13, 60, 'Fourth Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(565, 14, 10, 'First Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(566, 14, 10, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(567, 14, 10, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(568, 14, 10, 'Fourth Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(569, 14, 11, 'First Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(570, 14, 11, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(571, 14, 11, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(572, 14, 11, 'Fourth Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(573, 14, 12, 'First Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(574, 14, 12, 'Second Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(575, 14, 12, 'Third Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(576, 14, 12, 'Fourth Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(577, 14, 13, 'First Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(578, 14, 13, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(579, 14, 13, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(580, 14, 13, 'Fourth Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(581, 14, 14, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(582, 14, 14, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(583, 14, 14, 'Third Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(584, 14, 14, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(585, 14, 15, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(586, 14, 15, 'Second Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(587, 14, 15, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(588, 14, 15, 'Fourth Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(589, 14, 16, 'First Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(590, 14, 16, 'Second Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(591, 14, 16, 'Third Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(592, 14, 16, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(593, 14, 17, 'First Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(594, 14, 17, 'Second Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(595, 14, 17, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(596, 14, 17, 'Fourth Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(597, 14, 18, 'First Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(598, 14, 18, 'Second Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(599, 14, 18, 'Third Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(600, 14, 18, 'Fourth Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(601, 15, 19, 'First Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(602, 15, 19, 'Second Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(603, 15, 19, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(604, 15, 19, 'Fourth Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(605, 15, 20, 'First Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(606, 15, 20, 'Second Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(607, 15, 20, 'Third Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(608, 15, 20, 'Fourth Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(609, 15, 21, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(610, 15, 21, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(611, 15, 21, 'Third Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(612, 15, 21, 'Fourth Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(613, 15, 22, 'First Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(614, 15, 22, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(615, 15, 22, 'Third Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(616, 15, 22, 'Fourth Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(617, 15, 23, 'First Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(618, 15, 23, 'Second Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(619, 15, 23, 'Third Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(620, 15, 23, 'Fourth Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(621, 15, 24, 'First Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(622, 15, 24, 'Second Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(623, 15, 24, 'Third Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(624, 15, 24, 'Fourth Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(625, 15, 25, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(626, 15, 25, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(627, 15, 25, 'Third Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(628, 15, 25, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(629, 15, 26, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(630, 15, 26, 'Second Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(631, 15, 26, 'Third Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(632, 15, 26, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(633, 15, 27, 'First Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(634, 15, 27, 'Second Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(635, 15, 27, 'Third Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(636, 15, 27, 'Fourth Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(637, 16, 1, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(638, 16, 1, 'Second Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(639, 16, 1, 'Third Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(640, 16, 1, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(641, 16, 2, 'First Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(642, 16, 2, 'Second Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(643, 16, 2, 'Third Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(644, 16, 2, 'Fourth Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(645, 16, 3, 'First Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(646, 16, 3, 'Second Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(647, 16, 3, 'Third Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(648, 16, 3, 'Fourth Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(649, 16, 4, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(650, 16, 4, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(651, 16, 4, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(652, 16, 4, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(653, 16, 5, 'First Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(654, 16, 5, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(655, 16, 5, 'Third Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(656, 16, 5, 'Fourth Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(657, 16, 6, 'First Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(658, 16, 6, 'Second Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(659, 16, 6, 'Third Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13);
INSERT INTO `grade` (`GradeID`, `EnrollmentID`, `SubjectID`, `Quarter`, `GradeValue`, `Remarks`, `GradeStatusID`, `LastModified`, `ModifiedByUserID`) VALUES
(660, 16, 6, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(661, 16, 7, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(662, 16, 7, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(663, 16, 7, 'Third Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(664, 16, 7, 'Fourth Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(665, 16, 8, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(666, 16, 8, 'Second Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(667, 16, 8, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(668, 16, 8, 'Fourth Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(669, 16, 9, 'First Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(670, 16, 9, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(671, 16, 9, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(672, 16, 9, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(673, 17, 19, 'First Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(674, 17, 19, 'Second Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(675, 17, 19, 'Third Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(676, 17, 19, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(677, 17, 20, 'First Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(678, 17, 20, 'Second Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(679, 17, 20, 'Third Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(680, 17, 20, 'Fourth Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(681, 17, 21, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(682, 17, 21, 'Second Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(683, 17, 21, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(684, 17, 21, 'Fourth Quarter', 88.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(685, 17, 22, 'First Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(686, 17, 22, 'Second Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(687, 17, 22, 'Third Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(688, 17, 22, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(689, 17, 23, 'First Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(690, 17, 23, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(691, 17, 23, 'Third Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(692, 17, 23, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(693, 17, 24, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(694, 17, 24, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(695, 17, 24, 'Third Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(696, 17, 24, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(697, 17, 25, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(698, 17, 25, 'Second Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(699, 17, 25, 'Third Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(700, 17, 25, 'Fourth Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(701, 17, 26, 'First Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(702, 17, 26, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(703, 17, 26, 'Third Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(704, 17, 26, 'Fourth Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(705, 17, 27, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(706, 17, 27, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(707, 17, 27, 'Third Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(708, 17, 27, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(709, 18, 1, 'First Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(710, 18, 1, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(711, 18, 1, 'Third Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(712, 18, 1, 'Fourth Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(713, 18, 2, 'First Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(714, 18, 2, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(715, 18, 2, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(716, 18, 2, 'Fourth Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(717, 18, 3, 'First Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(718, 18, 3, 'Second Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(719, 18, 3, 'Third Quarter', 97.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(720, 18, 3, 'Fourth Quarter', 86.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(721, 18, 4, 'First Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(722, 18, 4, 'Second Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(723, 18, 4, 'Third Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(724, 18, 4, 'Fourth Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(725, 18, 5, 'First Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(726, 18, 5, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(727, 18, 5, 'Third Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(728, 18, 5, 'Fourth Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(729, 18, 6, 'First Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(730, 18, 6, 'Second Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(731, 18, 6, 'Third Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(732, 18, 6, 'Fourth Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(733, 18, 7, 'First Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(734, 18, 7, 'Second Quarter', 82.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(735, 18, 7, 'Third Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(736, 18, 7, 'Fourth Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(737, 18, 8, 'First Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(738, 18, 8, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(739, 18, 8, 'Third Quarter', 99.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(740, 18, 8, 'Fourth Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(741, 18, 9, 'First Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(742, 18, 9, 'Second Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(743, 18, 9, 'Third Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(744, 18, 9, 'Fourth Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(745, 19, 19, 'First Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(746, 19, 19, 'Second Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(747, 19, 19, 'Third Quarter', 91.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(748, 19, 19, 'Fourth Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(749, 19, 20, 'First Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(750, 19, 20, 'Second Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(751, 19, 20, 'Third Quarter', 80.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(752, 19, 20, 'Fourth Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(753, 19, 21, 'First Quarter', 95.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(754, 19, 21, 'Second Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(755, 19, 21, 'Third Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(756, 19, 21, 'Fourth Quarter', 76.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(757, 19, 22, 'First Quarter', 98.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(758, 19, 22, 'Second Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(759, 19, 22, 'Third Quarter', 77.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(760, 19, 22, 'Fourth Quarter', 83.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(761, 19, 23, 'First Quarter', 85.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(762, 19, 23, 'Second Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(763, 19, 23, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(764, 19, 23, 'Fourth Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(765, 19, 24, 'First Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(766, 19, 24, 'Second Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(767, 19, 24, 'Third Quarter', 93.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(768, 19, 24, 'Fourth Quarter', 87.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(769, 19, 25, 'First Quarter', 81.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(770, 19, 25, 'Second Quarter', 96.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(771, 19, 25, 'Third Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(772, 19, 25, 'Fourth Quarter', 84.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(773, 19, 26, 'First Quarter', 94.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(774, 19, 26, 'Second Quarter', 92.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(775, 19, 26, 'Third Quarter', 75.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(776, 19, 26, 'Fourth Quarter', 78.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(777, 19, 27, 'First Quarter', 90.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(778, 19, 27, 'Second Quarter', 89.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(779, 19, 27, 'Third Quarter', 100.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(780, 19, 27, 'Fourth Quarter', 79.00, NULL, NULL, '2025-12-08 03:40:32', 13),
(781, 20, 1, 'First Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(782, 20, 1, 'Second Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(783, 20, 1, 'Third Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(784, 20, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(785, 20, 2, 'First Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(786, 20, 2, 'Second Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(787, 20, 2, 'Third Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(788, 20, 2, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(789, 20, 3, 'First Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(790, 20, 3, 'Second Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(791, 20, 3, 'Third Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(792, 20, 3, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(793, 20, 4, 'First Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(794, 20, 4, 'Second Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(795, 20, 4, 'Third Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(796, 20, 4, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(797, 20, 5, 'First Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(798, 20, 5, 'Second Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(799, 20, 5, 'Third Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(800, 20, 5, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(801, 20, 6, 'First Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(802, 20, 6, 'Second Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(803, 20, 6, 'Third Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(804, 20, 6, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(805, 20, 7, 'First Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(806, 20, 7, 'Second Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(807, 20, 7, 'Third Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(808, 20, 7, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(809, 20, 8, 'First Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(810, 20, 8, 'Second Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(811, 20, 8, 'Third Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(812, 20, 8, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(813, 20, 9, 'First Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(814, 20, 9, 'Second Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(815, 20, 9, 'Third Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(816, 20, 9, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-08 23:59:23', NULL),
(817, 21, 10, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(818, 21, 10, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(819, 21, 10, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(820, 21, 10, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(821, 21, 11, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(822, 21, 11, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(823, 21, 11, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(824, 21, 11, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(825, 21, 12, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(826, 21, 12, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(827, 21, 12, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(828, 21, 12, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(829, 21, 13, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(830, 21, 13, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(831, 21, 13, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(832, 21, 13, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(833, 21, 14, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(834, 21, 14, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(835, 21, 14, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(836, 21, 14, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(837, 21, 15, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(838, 21, 15, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(839, 21, 15, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(840, 21, 15, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(841, 21, 16, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(842, 21, 16, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(843, 21, 16, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(844, 21, 16, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(845, 21, 17, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(846, 21, 17, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(847, 21, 17, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(848, 21, 17, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(849, 21, 18, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(850, 21, 18, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(851, 21, 18, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(852, 21, 18, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:25:57', NULL),
(853, 22, 37, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(854, 22, 37, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(855, 22, 37, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(856, 22, 37, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(857, 22, 38, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(858, 22, 38, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(859, 22, 38, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(860, 22, 38, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(861, 22, 39, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(862, 22, 39, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(863, 22, 39, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(864, 22, 39, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(865, 22, 40, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(866, 22, 40, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(867, 22, 40, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(868, 22, 40, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(869, 22, 41, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(870, 22, 41, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(871, 22, 41, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(872, 22, 41, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(873, 22, 42, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(874, 22, 42, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(875, 22, 42, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(876, 22, 42, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(877, 22, 43, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(878, 22, 43, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(879, 22, 43, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(880, 22, 43, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(881, 22, 44, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(882, 22, 44, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(883, 22, 44, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(884, 22, 44, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(885, 22, 45, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(886, 22, 45, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(887, 22, 45, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(888, 22, 45, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:31:23', NULL),
(889, 23, 1, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(890, 23, 1, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(891, 23, 1, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(892, 23, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(893, 23, 2, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(894, 23, 2, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(895, 23, 2, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(896, 23, 2, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(897, 23, 3, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(898, 23, 3, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(899, 23, 3, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(900, 23, 3, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(901, 23, 4, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(902, 23, 4, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(903, 23, 4, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(904, 23, 4, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(905, 23, 5, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(906, 23, 5, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(907, 23, 5, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(908, 23, 5, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(909, 23, 6, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(910, 23, 6, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(911, 23, 6, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(912, 23, 6, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(913, 23, 7, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(914, 23, 7, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(915, 23, 7, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(916, 23, 7, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(917, 23, 8, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(918, 23, 8, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(919, 23, 8, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(920, 23, 8, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(921, 23, 9, 'First Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(922, 23, 9, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(923, 23, 9, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(924, 23, 9, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 00:35:07', NULL),
(925, 24, 37, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(926, 24, 37, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(927, 24, 37, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(928, 24, 37, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(929, 24, 38, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(930, 24, 38, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(931, 24, 38, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(932, 24, 38, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(933, 24, 39, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(934, 24, 39, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(935, 24, 39, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(936, 24, 39, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(937, 24, 40, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(938, 24, 40, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(939, 24, 40, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(940, 24, 40, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(941, 24, 41, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(942, 24, 41, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(943, 24, 41, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(944, 24, 41, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(945, 24, 42, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(946, 24, 42, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(947, 24, 42, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(948, 24, 42, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(949, 24, 43, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(950, 24, 43, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(951, 24, 43, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(952, 24, 43, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(953, 24, 44, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(954, 24, 44, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(955, 24, 44, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(956, 24, 44, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(957, 24, 45, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(958, 24, 45, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(959, 24, 45, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(960, 24, 45, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:45:09', NULL),
(961, 25, 46, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(962, 25, 46, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(963, 25, 46, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(964, 25, 46, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(965, 25, 47, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(966, 25, 47, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(967, 25, 47, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(968, 25, 47, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(969, 25, 48, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(970, 25, 48, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(971, 25, 48, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(972, 25, 48, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(973, 25, 49, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(974, 25, 49, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(975, 25, 49, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(976, 25, 49, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(977, 25, 50, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(978, 25, 50, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(979, 25, 50, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(980, 25, 50, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(981, 25, 51, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(982, 25, 51, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(983, 25, 51, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(984, 25, 51, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(985, 25, 52, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(986, 25, 52, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(987, 25, 52, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(988, 25, 52, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(989, 25, 53, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(990, 25, 53, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(991, 25, 53, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(992, 25, 53, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(993, 25, 54, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(994, 25, 54, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(995, 25, 54, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(996, 25, 54, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(997, 25, 55, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(998, 25, 55, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(999, 25, 55, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1000, 25, 55, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1001, 25, 56, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1002, 25, 56, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1003, 25, 56, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1004, 25, 56, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1005, 25, 57, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1006, 25, 57, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1007, 25, 57, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1008, 25, 57, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1009, 25, 58, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1010, 25, 58, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1011, 25, 58, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1012, 25, 58, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1013, 25, 59, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1014, 25, 59, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1015, 25, 59, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1016, 25, 59, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1017, 25, 60, 'First Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1018, 25, 60, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1019, 25, 60, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1020, 25, 60, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 01:46:01', NULL),
(1021, 26, 37, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1022, 26, 37, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1023, 26, 37, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1024, 26, 37, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1025, 26, 38, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1026, 26, 38, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1027, 26, 38, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1028, 26, 38, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1029, 26, 39, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1030, 26, 39, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1031, 26, 39, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1032, 26, 39, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1033, 26, 40, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1034, 26, 40, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1035, 26, 40, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1036, 26, 40, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1037, 26, 41, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1038, 26, 41, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1039, 26, 41, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1040, 26, 41, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1041, 26, 42, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1042, 26, 42, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1043, 26, 42, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1044, 26, 42, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1045, 26, 43, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1046, 26, 43, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1047, 26, 43, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1048, 26, 43, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1049, 26, 44, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1050, 26, 44, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1051, 26, 44, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1052, 26, 44, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1053, 26, 45, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1054, 26, 45, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1055, 26, 45, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1056, 26, 45, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:03:26', NULL),
(1057, 27, 1, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1058, 27, 1, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1059, 27, 1, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1060, 27, 1, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1061, 27, 2, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1062, 27, 2, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1063, 27, 2, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1064, 27, 2, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1065, 27, 3, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1066, 27, 3, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1067, 27, 3, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1068, 27, 3, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1069, 27, 4, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1070, 27, 4, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1071, 27, 4, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1072, 27, 4, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1073, 27, 5, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1074, 27, 5, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1075, 27, 5, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1076, 27, 5, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1077, 27, 6, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1078, 27, 6, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1079, 27, 6, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1080, 27, 6, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1081, 27, 7, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1082, 27, 7, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1083, 27, 7, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1084, 27, 7, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1085, 27, 8, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1086, 27, 8, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1087, 27, 8, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1088, 27, 8, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1089, 27, 9, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1090, 27, 9, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1091, 27, 9, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1092, 27, 9, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:10:01', NULL),
(1093, 28, 37, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1094, 28, 37, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1095, 28, 37, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1096, 28, 37, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1097, 28, 38, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1098, 28, 38, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1099, 28, 38, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1100, 28, 38, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1101, 28, 39, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1102, 28, 39, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1103, 28, 39, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1104, 28, 39, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1105, 28, 40, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1106, 28, 40, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1107, 28, 40, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1108, 28, 40, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1109, 28, 41, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1110, 28, 41, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1111, 28, 41, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1112, 28, 41, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1113, 28, 42, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1114, 28, 42, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1115, 28, 42, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1116, 28, 42, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1117, 28, 43, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1118, 28, 43, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1119, 28, 43, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1120, 28, 43, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1121, 28, 44, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1122, 28, 44, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1123, 28, 44, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1124, 28, 44, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1125, 28, 45, 'First Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1126, 28, 45, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1127, 28, 45, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1128, 28, 45, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 02:32:19', NULL),
(1129, 29, 28, 'First Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1130, 29, 28, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1131, 29, 28, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1132, 29, 28, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1133, 29, 29, 'First Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1134, 29, 29, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1135, 29, 29, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1136, 29, 29, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1137, 29, 30, 'First Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1138, 29, 30, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1139, 29, 30, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1140, 29, 30, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1141, 29, 31, 'First Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1142, 29, 31, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1143, 29, 31, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1144, 29, 31, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1145, 29, 32, 'First Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1146, 29, 32, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1147, 29, 32, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1148, 29, 32, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1149, 29, 33, 'First Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1150, 29, 33, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1151, 29, 33, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1152, 29, 33, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1153, 29, 34, 'First Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1154, 29, 34, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1155, 29, 34, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1156, 29, 34, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1157, 29, 35, 'First Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1158, 29, 35, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1159, 29, 35, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1160, 29, 35, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1161, 29, 36, 'First Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1162, 29, 36, 'Second Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1163, 29, 36, 'Third Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL),
(1164, 29, 36, 'Fourth Quarter', NULL, NULL, NULL, '2025-12-09 03:04:21', NULL);

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

--
-- Dumping data for table `gradestatus`
--

INSERT INTO `gradestatus` (`StatusID`, `StatusName`) VALUES
(3, 'Approved'),
(1, 'Draft'),
(4, 'Rejected'),
(2, 'Submitted');

-- --------------------------------------------------------

--
-- Table structure for table `gradesubmission`
--

CREATE TABLE `gradesubmission` (
  `SubmissionID` int(11) NOT NULL,
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
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gradesubmission`
--

INSERT INTO `gradesubmission` (`SubmissionID`, `SectionID`, `SchoolYearID`, `Quarter`, `SubmissionStatus`, `SubmittedByUserID`, `SubmittedDate`, `TotalStudents`, `StudentsWithGrades`, `ReviewedByUserID`, `ReviewedDate`, `RegistrarNotes`, `TeacherNotes`, `CreatedAt`, `UpdatedAt`) VALUES
(7, 6, 7, 'First Quarter', 'Approved', 21, '2025-12-01 13:32:07', 2, 2, 21, '2025-12-01 13:32:23', '', 'test', '2025-12-01 13:32:07', '2025-12-01 13:32:23'),
(8, 6, 7, 'Second Quarter', 'Approved', 24, '2025-12-01 13:32:07', 0, 0, 24, '2025-12-01 13:32:23', '', 'test', '2025-12-01 13:32:07', '2025-12-01 13:32:23');

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
(1, 'Hij Klm', 0x3039313233343536373830, 0x6e6f7071727340676d61696c2e636f6d, NULL, NULL),
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
(12, 'hahaha haha', 0x3039393439323437383835, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(13, 'hahahaha hahahaha', 0x3039313233343536373839, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(14, 'Ven Heave', 0x3039383736353433323134, 0x7472616473616e696c6c612e68656176656e676962736f6e2e79647362616e657a40676d61696c2e636f6d, NULL, NULL),
(15, 'Flora Dalisay', 0x3039343635323230313332, 0x6364393933323240676d61696c2e636f6d, NULL, NULL),
(16, 'Ven Heaves', 0x3039383736353433323134, 0x73646e7532316532316a6940676d61696c2e636f6d, NULL, NULL),
(17, 'Ven Heav', 0x3039383736353433323132, 0x73646e7532316532316a6940676d61696c2e636f6d, NULL, NULL),
(18, 'Ven jiewqji', 0x3039383736353433323134, 0x73646e7532316532316a6940676d61696c2e636f6d, NULL, NULL),
(19, 'Ven Heave', 0x3039383736353433323132, 0x73646e7532316532316a6940676d61696c2e636f6d, NULL, NULL),
(20, 'Kpds dasdsa', 0x3039313233343536373839, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(21, 'Ven Heav', 0x3039383736353433323132, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(22, 'dasdsadasd dasdsadsa', 0x3039313233333231313233, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(23, 'dasdsa dasdasda', 0x3039313233313233313233, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(24, 'dadada dasd', 0x3039313233313233313233, 0x647361646140676d61696c2e636f6d, NULL, NULL),
(25, 'dadasdasd dasdasdasda', 0x3039313233313233313233, 0x6a6f686e7265796269736e617263616c6970657340676d61696c2e636f6d, NULL, NULL),
(26, 'dasdada dasdas', 0x3039313233313233313233, 0x647361646140676d61696c2e636f6d, NULL, NULL),
(27, 'dasdsadas dasdasdasda', 0x3039313233323331323332, 0x6a6f686e40676d61696c2e636f6d, NULL, NULL),
(28, 'dasdasda dasdasd', 0x3039313231323332333131, 0x6a6f40676d61696c2e636f6d, NULL, NULL),
(29, 'asdsada dasds', 0x3332313331333133313331, 0x61647361646173646140676d61696c2e636f6d, NULL, NULL);

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
(12, 12, NULL, NULL, NULL, NULL, NULL),
(13, 13, NULL, NULL, NULL, NULL, NULL),
(14, 14, NULL, NULL, NULL, NULL, NULL),
(15, 15, NULL, NULL, NULL, NULL, NULL),
(16, 16, NULL, NULL, NULL, NULL, NULL),
(17, 17, NULL, NULL, NULL, NULL, NULL),
(18, 18, NULL, NULL, NULL, NULL, NULL),
(19, 19, NULL, NULL, NULL, NULL, NULL),
(20, 20, NULL, NULL, NULL, NULL, NULL),
(21, 21, NULL, NULL, NULL, NULL, NULL),
(22, 22, NULL, NULL, NULL, NULL, NULL),
(23, 23, NULL, NULL, NULL, NULL, NULL),
(24, 24, NULL, NULL, NULL, NULL, NULL),
(25, 25, NULL, NULL, NULL, NULL, NULL),
(26, 26, NULL, NULL, NULL, NULL, NULL),
(27, 27, NULL, NULL, NULL, NULL, NULL),
(28, 28, NULL, NULL, NULL, NULL, NULL),
(29, 29, NULL, NULL, NULL, NULL, NULL);

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
(13, 13, '$2y$10$wVPFix3t7OBaw4/w1B/Wu.QjP7Ph29DqM0dwSIGeMe/E.bgMNST8C', '2025-12-01 03:38:16', NULL, 1, 0, NULL),
(14, 14, '$2y$10$M76bH/8jMihQ7zCI1S9XwefoP.sXME0.aW3Nnnw16vBHqi0rxiBC2', '2025-12-05 03:34:22', NULL, 1, 0, NULL),
(15, 15, '$2y$10$ys82VjxNJvqpqBTf9wz0Sek7LrbnQRn4cedrmCLmTHcOab7RUDXui', '2025-12-05 03:34:49', NULL, 1, 0, NULL),
(16, 16, '$2y$10$qtNczhmSahmbhKDDbMHb8elNEUIgDL6pxqvQNtq0zkjz7RPao3rOK', '2025-12-07 03:57:42', NULL, 1, 0, NULL),
(17, 17, '$2y$10$R3nFpRtcUvzwTW6on82TquSadYdK/VjcEwRoUDj59rgdIY3u/vDRC', '2025-12-07 05:13:23', NULL, 1, 0, NULL),
(18, 18, '$2y$10$24LM8n318dSIVzYrIOTmeOt5anIB10ci0TJJ/cxOdWut/hIrveXtS', '2025-12-07 05:46:44', NULL, 1, 0, NULL),
(19, 19, '$2y$10$lBwn30O0biKEFiojRmMl5eoiF.T1oYt7b8XSVZlXpqoRJTHGZG1eu', '2025-12-07 05:47:39', NULL, 1, 0, NULL),
(20, 20, '$2y$10$M4l76Z6MN3XV3JutRgD5T.RjuEdQvU0mw1pR7QD9ttj16jlMQYqGm', '2025-12-07 08:05:08', NULL, 1, 0, NULL),
(21, 24, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2025-12-07 21:34:49', NULL, 0, 0, NULL),
(22, 25, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2025-12-07 21:34:49', NULL, 0, 0, NULL),
(23, 26, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2025-12-07 21:34:49', NULL, 0, 0, NULL),
(24, 27, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2025-12-07 21:34:49', NULL, 0, 0, NULL),
(25, 28, '$2y$10$pO1l8BEnhleX1mK0tJBrmO5q5JPrQaCR4kxiQPbsH0pacp1BrER96', '2025-12-08 23:59:23', NULL, 1, 0, NULL),
(26, 29, '$2y$10$YvSqXFUUJChuqUHzpKE4U.ibCgQhbQLFt7gXjqTm2vxvekkZxUIP6', '2025-12-09 00:25:57', NULL, 1, 0, NULL),
(27, 30, '$2y$10$XqFgLreKQMusmr15JOInQ.JirLqkrOsz4hkXqat00GxEyTLY.TcWe', '2025-12-09 00:31:23', NULL, 1, 0, NULL),
(28, 31, '$2y$10$5S3dyg0tDcNPD2AL2vWquO.uTYGuhwwsigkF1BaYbS8QbTCzacU7G', '2025-12-09 00:35:07', NULL, 1, 0, NULL),
(29, 32, '$2y$10$f49tjakJHmbiZgnJGCwebOBVXTdTMlsal7cXWSTQ88RJMgtKZvrV6', '2025-12-09 01:45:09', NULL, 1, 0, NULL),
(30, 33, '$2y$10$AVlMHuTfhZ9JcyJM2LW7weiPyu/X4fvuZJ9x4Eb.YJNtokxOj3ydi', '2025-12-09 01:46:01', NULL, 1, 0, NULL),
(31, 34, '$2y$10$k/PDIMxBxvO.zVaT0/jQ6uuAo7vzb5mvdKRTrXwDEK66iNvh9m7HW', '2025-12-09 02:03:26', NULL, 1, 0, NULL),
(32, 35, '$2y$10$8VXEDdZNDA/C/sntwJmdge9zlUrqlkgMR9imuWP0exrvIeRLIaR5K', '2025-12-09 02:10:01', NULL, 1, 0, NULL),
(33, 36, '$2y$10$Mvz0FOw9U5YkqjjhjGAthuy/CB8woUz3arHpT1qPlGQLQ/4tiZczq', '2025-12-09 02:32:19', NULL, 1, 0, NULL),
(34, 37, '$2y$10$I6mItYoHQ3attlJH9EPiSO9bF20NH0cNyFgx77J9d3QO7sFYxKJ5q', '2025-12-09 03:04:21', NULL, 1, 0, NULL);

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
  `PaymentMode` enum('full','quarterly','monthly','custom') DEFAULT 'full',
  `InstallmentNumber` int(11) DEFAULT 1,
  `VerifiedByUserID` int(11) DEFAULT NULL,
  `VerifiedAt` datetime DEFAULT NULL,
  `RejectionReason` text DEFAULT NULL,
  `VerifiedBy` int(11) DEFAULT NULL,
  `VerificationRemarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`PaymentID`, `TransactionID`, `PaymentMethodID`, `AmountPaid`, `PaymentDateTime`, `ReferenceNumber`, `ProofFileID`, `VerificationStatus`, `PaymentMode`, `InstallmentNumber`, `VerifiedByUserID`, `VerifiedAt`, `RejectionReason`, `VerifiedBy`, `VerificationRemarks`) VALUES
(1, 1, 3, 6000.00, '2025-11-28 05:20:14', 'TXN1764278411304153', NULL, 'Verified', 'full', 1, 1, '2025-11-28 09:57:40', '', NULL, NULL),
(2, 2, 1, 18500.00, '2025-11-28 06:48:26', 'DOWNPAY-2-1764283706', NULL, 'Verified', 'full', 1, NULL, '2025-11-28 09:48:06', NULL, NULL, NULL),
(3, 3, 1, 8300.00, '2025-11-28 06:58:43', 'DOWNPAY-3-1764284323', NULL, 'Verified', 'full', 1, 1, '2025-11-28 06:58:43', NULL, NULL, NULL),
(4, 3, 3, 11700.00, '2025-11-28 07:03:51', 'TXN1764284625372268', NULL, 'Verified', 'full', 1, 1, '2025-11-28 09:55:32', '', NULL, NULL),
(5, 4, 1, 7700.00, '2025-11-28 07:06:30', 'DOWNPAY-4-1764284790', NULL, 'Verified', 'full', 1, 1, '2025-11-28 07:06:30', NULL, NULL, NULL),
(6, 5, 1, 9600.00, '2025-11-28 07:27:24', 'DOWNPAY-6-1764286044', NULL, 'Verified', 'full', 1, 1, '2025-11-28 07:27:24', NULL, NULL, NULL),
(7, 5, 3, 10400.00, '2025-11-28 07:29:15', 'TXN1764286144632499', NULL, 'Verified', 'full', 1, 1, '2025-11-28 09:36:14', '', NULL, NULL),
(8, 6, 1, 8900.00, '2025-11-28 08:49:23', 'DOWNPAY-5-1764290963', NULL, 'Verified', 'full', 1, 1, '2025-11-28 08:49:23', NULL, NULL, NULL),
(9, 6, 3, 9600.00, '2025-11-28 08:51:08', 'TXN1764291065951286', NULL, 'Verified', 'full', 1, 1, '2025-11-28 09:30:25', '', NULL, NULL),
(10, 1, 3, 5000.00, '2025-11-28 18:52:44', 'TXN1764327160774756', NULL, 'Verified', 'full', 1, 1, '2025-11-28 18:53:26', '', 1, NULL),
(11, 7, 1, 20000.00, '2025-11-28 19:02:08', 'DOWNPAY-7-1764327728', NULL, 'Verified', 'full', 1, 1, '2025-11-28 19:02:08', NULL, NULL, NULL),
(12, 8, 1, 8900.00, '2025-11-28 19:09:34', 'DOWNPAY-8-1764328174', NULL, 'Verified', 'full', 1, 1, '2025-11-28 19:09:34', NULL, NULL, NULL),
(13, 8, 3, 9600.00, '2025-11-28 19:12:33', 'TXN1764328348442130', NULL, 'Verified', 'full', 1, 1, '2025-11-28 19:17:56', '', 1, NULL),
(14, 9, 1, 6500.00, '2025-11-29 02:04:11', 'DOWNPAY-9-1764353051', NULL, 'Verified', 'full', 1, 1, '2025-11-29 02:04:11', NULL, NULL, NULL),
(15, 10, 1, 2000.00, '2025-11-30 13:36:08', 'DOWNPAY-10-1764480968', NULL, 'Verified', 'full', 1, 1, '2025-11-30 13:36:08', NULL, NULL, NULL),
(16, 11, 1, 20000.00, '2025-11-30 17:45:25', 'DOWNPAY-11-1764495925', NULL, 'Verified', 'full', 1, 1, '2025-11-30 17:45:25', NULL, NULL, NULL),
(17, 12, 1, 20000.00, '2025-12-01 03:32:38', 'DOWNPAY-12-1764531158', NULL, 'Verified', 'full', 1, 1, '2025-12-01 03:32:38', NULL, NULL, NULL),
(18, 13, 1, 18500.00, '2025-12-01 03:37:15', 'DOWNPAY-13-1764531435', NULL, 'Verified', 'full', 1, 1, '2025-12-01 03:37:15', NULL, NULL, NULL),
(19, 14, 1, 8900.00, '2025-12-05 03:34:13', 'DOWNPAY-14-1764876853', NULL, 'Verified', 'full', 1, 1, '2025-12-05 03:34:13', NULL, NULL, NULL),
(20, 15, 1, 8900.00, '2025-12-06 21:09:10', 'DOWNPAY-15-1765026550', NULL, 'Verified', 'full', 1, 1, '2025-12-06 21:09:10', NULL, NULL, NULL),
(21, 16, 1, 18500.00, '2025-12-07 01:38:58', 'DOWNPAY-15-1765042738', NULL, 'Verified', 'full', 1, 1, '2025-12-07 01:38:58', NULL, NULL, NULL),
(22, 17, 1, 18500.00, '2025-12-07 01:43:11', 'DP-17-1765042991', NULL, 'Verified', 'full', 1, 1, '2025-12-07 01:43:11', NULL, NULL, NULL),
(23, 18, 1, 18500.00, '2025-12-07 01:48:53', 'DP-15-1765043333', NULL, 'Verified', 'full', 1, 1, '2025-12-07 01:48:53', NULL, NULL, NULL),
(24, 50, 1, 20000.00, '2025-12-09 01:43:12', 'DOWNPAY-24-1765215792', NULL, 'Verified', 'full', 1, 1, '2025-12-09 01:43:12', NULL, NULL, NULL),
(25, 51, 1, 20000.00, '2025-12-09 01:44:55', 'DOWNPAY-25-1765215895', NULL, 'Verified', 'full', 1, 1, '2025-12-09 01:44:55', NULL, NULL, NULL),
(26, 52, 1, 9600.00, '2025-12-09 02:03:13', 'DOWNPAY-26-1765216993', NULL, 'Verified', 'full', 1, 1, '2025-12-09 02:03:13', NULL, NULL, NULL),
(27, 53, 1, 8900.00, '2025-12-09 02:09:47', 'DOWNPAY-27-1765217387', NULL, 'Verified', 'full', 1, 1, '2025-12-09 02:09:47', NULL, NULL, NULL),
(28, 54, 1, 9600.00, '2025-12-09 02:32:05', 'DOWNPAY-28-1765218725', NULL, 'Verified', 'full', 1, 1, '2025-12-09 02:32:05', NULL, NULL, NULL),
(29, 55, 1, 9600.00, '2025-12-09 03:04:03', 'DOWNPAY-29-1765220643', NULL, 'Verified', 'full', 1, 1, '2025-12-09 03:04:03', NULL, NULL, NULL);

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
(2, 2, 'Juan', 'Efg', 'D', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373830, 0x3132336162637374726565747163756e696c6164, 'uploads/profile_pictures/profile_2_1765206289.png'),
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
(13, 13, 'AHAHAHA', 'HAHA', 'HAHAHAHA', NULL, NULL, NULL, NULL, NULL, 0x3039393439323437383835, 0x4841484148414868616861686168616861, NULL),
(14, 14, 'aaa', 'aaa', 'aa', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x3231206861686168616861686168616861, NULL),
(15, 15, 'Heaven', 'Tranilla', 'Ybanez', NULL, NULL, NULL, NULL, NULL, 0x3039353634323330313539, 0x716375737472656574636f6d6d6f6e7765616c7468, NULL),
(16, 16, 'Cardo', 'De Leon', 'D', NULL, NULL, NULL, NULL, NULL, 0x3039353634323330313539, 0x636964676369646763696467, NULL),
(17, 17, 'Nevaeh', 'Allinart', 'Y', NULL, NULL, NULL, NULL, NULL, 0x3039383635343231303332, 0x64757061787374726565747175657a6f6e63697479, NULL),
(18, 18, 'Heaven', 'Tranilla', 'Ybanez', NULL, NULL, NULL, NULL, NULL, 0x3039353634323330313539, 0x64757061787374726565747175657a6f6e63697479, NULL),
(19, 19, 'asd', 'asd', 'asd', NULL, NULL, NULL, NULL, NULL, 0x3039353634323330313539, 0x716375737472656574636f6d6d6f6e7765616c746873, NULL),
(20, 20, 'Nevs', 'Art', 'Z', NULL, NULL, NULL, NULL, NULL, 0x3039383635343231303332, 0x657771657771657771657771, NULL),
(21, 21, 'Maria', 'Santos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 24, 'Jose', 'Reyes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 25, 'Ana', 'Dela Cruz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 26, 'Pedro', 'Garcia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 27, 'Clara', 'Bautista', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 28, 'aa', 'aaaa', 'aa', NULL, NULL, NULL, NULL, NULL, 0x3039313233343434343434, 0x616161616161736461736473616461, NULL),
(27, 29, 'Juan', 'Cruz', 'Dela', NULL, NULL, NULL, NULL, NULL, 0x3039353634323330313539, 0x64757061787374726565747175657a6f6e63697479, NULL),
(28, 30, 'John', 'Calipes', 'Rey', NULL, NULL, NULL, NULL, NULL, 0x3039313233343535353535, 0x32312068616861686164616461, NULL),
(29, 31, 'adasd', 'asasa', 'adsada', NULL, NULL, NULL, NULL, NULL, 0x3039313233313233313233, 0x6161616161616161616161616161616161, NULL),
(30, 32, 'aaaa', 'aaa', 'aa', NULL, NULL, NULL, NULL, NULL, 0x3039313233313233313233, 0x6161616161736461736461736461, NULL),
(31, 33, 'aaaa', 'aaaaa', 'aa', NULL, NULL, NULL, NULL, NULL, 0x3039313233313233323331, 0x31333231323132333233313233647361647361, NULL),
(32, 34, 'aaaa', 'aaa', 'aaaa', NULL, NULL, NULL, NULL, NULL, 0x3039313233313233333132, 0x61736461736420736164617364616461646164, NULL),
(33, 35, 'adasdsadad', 'dasdada', 'adasd', NULL, NULL, NULL, NULL, NULL, 0x3039313233313233313233, 0x646173646173646173646173646173647361647361, NULL),
(34, 36, 'aaa', 'aaaa', 'aa', NULL, NULL, NULL, NULL, NULL, 0x3039313233313233333132, 0x3332313331323331323331313233647361646173646164, NULL),
(35, 37, 'aa', 'aaa', 'aaa', NULL, NULL, NULL, NULL, NULL, 0x3031323333313232333131, 0x313231323132313231323132323132, NULL);

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
(1, 1, 7, 1, 'Pre-elem Morning', 15, 0, 1),
(2, 1, 7, 2, 'Pre-elem Afternoon', 15, 0, 1),
(3, 2, 7, 3, 'Kinder Morning', 15, 0, 1),
(4, 2, 7, 4, 'Kinder Afternoon', 15, 0, 1),
(5, 3, 7, 5, 'Grade 1 Morning', 15, 2, 1),
(6, 3, 7, 1, 'Grade 1 Afternoon', 15, 8, 1),
(7, 4, 7, 1, 'Grade 2 Morning', 15, 1, 1),
(8, 4, 7, 2, 'Grade 2 Afternoon', 15, 2, 1),
(9, 5, 7, 3, 'Grade 3 Morning', 15, 1, 1),
(10, 5, 7, 4, 'Grade 3 Afternoon', 15, 2, 1),
(11, 6, 7, 5, 'Grade 4 Morning', 15, 0, 1),
(12, 6, 7, 1, 'Grade 4 Afternoon', 15, 3, 1),
(13, 7, 7, 1, 'Grade 5 Morning', 15, 0, 1),
(14, 7, 7, 2, 'Grade 5 Afternoon', 15, 5, 1),
(15, 8, 7, 3, 'Grade 6 Morning', 15, 0, 1),
(16, 8, 7, 4, 'Grade 6 Afternoon', 15, 5, 1);

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
(12, 12, 12, 'Father', 1, 1, 1, 0),
(13, 13, 13, 'Father', 1, 1, 1, 0),
(14, 14, 14, 'Father', 1, 1, 1, 0),
(15, 15, 15, 'Guardian', 1, 1, 1, 0),
(16, 16, 16, 'Mother', 1, 1, 1, 0),
(17, 17, 17, 'Father', 1, 1, 1, 0),
(18, 18, 18, 'Guardian', 1, 1, 1, 0),
(19, 19, 19, 'Father', 1, 1, 1, 0),
(20, 20, 20, 'Father', 1, 1, 1, 0),
(21, 21, 21, 'Father', 1, 1, 1, 0),
(22, 22, 22, 'Father', 1, 1, 1, 0),
(23, 23, 23, 'Father', 1, 1, 1, 0),
(24, 24, 24, 'Guardian', 1, 1, 1, 0),
(25, 25, 25, 'Father', 1, 1, 1, 0),
(26, 26, 26, 'Guardian', 1, 1, 1, 0),
(27, 27, 27, 'Father', 1, 1, 1, 0),
(28, 28, 28, 'Father', 1, 1, 1, 0),
(29, 29, 29, 'Guardian', 1, 1, 1, 0);

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
(12, 13, 'GCA-2025-00012', 'QR-GCA-2025-00012', '2020-10-10', 'Male', 'Filipino', 'Enrolled', NULL),
(13, 14, 'GCA-2025-00013', 'QR-GCA-2025-00013', '2019-07-20', 'Male', 'Filipino', 'Enrolled', NULL),
(14, 15, 'GCA-2025-00014', 'QR-GCA-2025-00014', '2017-12-12', 'Male', 'Filipino', 'Enrolled', NULL),
(15, 16, 'GCA-2025-00015', 'QR-GCA-2025-00015', '2019-12-12', 'Male', 'Filipino', 'Enrolled', NULL),
(16, 17, 'GCA-2025-00016', 'QR-GCA-2025-00016', '2017-12-12', 'Male', 'Filipino', 'Enrolled', NULL),
(17, 18, 'GCA-2025-00017', 'QR-GCA-2025-00017', '2017-12-12', 'Male', 'Filipino', 'Enrolled', NULL),
(18, 19, 'GCA-2025-00018', 'QR-GCA-2025-00018', '2018-12-12', 'Male', 'Filipino', 'Enrolled', NULL),
(19, 20, 'GCA-2025-00019', 'QR-GCA-2025-00019', '2018-12-12', 'Male', 'Filipino', 'Enrolled', NULL),
(20, 26, 'GCA-2025-00020', 'QR-GCA-2025-00020', '2020-11-01', 'Male', 'Filipino', 'Enrolled', NULL),
(21, 27, 'GCA-2025-00021', 'QR-GCA-2025-00021', '2018-02-01', 'Male', 'Filipino', 'Enrolled', NULL),
(22, 28, 'GCA-2025-00022', 'QR-GCA-2025-00022', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(23, 29, 'GCA-2025-00023', 'QR-GCA-2025-00023', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(24, 30, 'GCA-2025-00024', 'QR-GCA-2025-00024', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(25, 31, 'GCA-2025-00025', 'QR-GCA-2025-00025', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(26, 32, 'GCA-2025-00026', 'QR-GCA-2025-00026', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(27, 33, 'GCA-2025-00027', 'QR-GCA-2025-00027', '2020-11-12', 'Male', 'Filipino', 'Enrolled', NULL),
(28, 34, 'GCA-2025-00028', 'QR-GCA-2025-00028', '2020-11-11', 'Male', 'Filipino', 'Enrolled', NULL),
(29, 35, 'GCA-2025-00029', 'QR-GCA-2025-00029', '2020-11-21', 'Male', 'Filipino', 'Enrolled', NULL);

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

--
-- Dumping data for table `teacherprofile`
--

INSERT INTO `teacherprofile` (`TeacherProfileID`, `ProfileID`, `EmployeeNumber`, `Specialization`, `HireDate`) VALUES
(1, 21, 'T-2025-001', 'Mathematics', '2025-12-07'),
(2, 22, 'T-2025-002', 'Science', '2025-12-07'),
(3, 23, 'T-2025-003', 'English', '2025-12-07'),
(4, 24, 'T-2025-004', 'History', '2025-12-07'),
(5, 25, 'T-2025-005', 'Filipino', '2025-12-07');

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
  `TransactionStatusID` int(11) DEFAULT NULL,
  `PaymentMode` enum('full','quarterly','monthly') DEFAULT 'full'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`TransactionID`, `StudentProfileID`, `SchoolYearID`, `IssueDate`, `DueDate`, `TotalAmount`, `PaidAmount`, `TransactionStatusID`, `PaymentMode`) VALUES
(1, 1, 7, '2025-11-28', '2025-11-30', 11000.00, 11000.00, 3, 'full'),
(2, 2, 7, '2025-11-28', '2025-12-28', 18500.00, 0.00, 1, 'full'),
(3, 3, 7, '2025-11-28', '2025-12-28', 20000.00, 20000.00, 2, 'full'),
(4, NULL, 7, '2025-11-28', '2025-12-28', 18500.00, 7700.00, 2, 'full'),
(5, 5, 7, '2025-11-28', '2025-12-28', 20000.00, 20000.00, 3, 'full'),
(6, 6, 7, '2025-11-28', '2025-12-28', 18500.00, 18500.00, 3, 'full'),
(7, 7, 7, '2025-11-28', '2025-12-28', 20000.00, 20000.00, 3, 'full'),
(8, 8, 7, '2025-11-28', '2025-12-28', 18500.00, 18500.00, 3, 'full'),
(9, 9, 7, '2025-11-29', '2025-12-29', 18500.00, 6500.00, 2, 'full'),
(10, 10, 7, '2025-11-30', '2025-12-30', 20000.00, 2000.00, 3, 'full'),
(11, 11, 7, '2025-11-30', '2025-12-30', 20000.00, 20000.00, 3, 'full'),
(12, 13, 7, '2025-12-01', '2025-12-31', 20000.00, 20000.00, 3, 'full'),
(13, 12, 7, '2025-12-01', '2025-12-31', 18500.00, 18500.00, 3, 'full'),
(14, 14, 7, '2025-12-05', '2026-01-04', 18500.00, 8900.00, 2, 'full'),
(15, NULL, 7, '2025-12-06', '2026-01-05', 18500.00, 8900.00, 2, 'full'),
(16, NULL, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(17, 0, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(18, 0, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(19, 0, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(20, 0, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(21, 0, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(22, 0, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(23, 0, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(24, 15, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(25, 15, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(26, 16, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(27, 17, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(28, 15, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(29, 16, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(30, 15, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(31, 16, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(32, 15, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(33, 15, 7, '2025-12-07', '2026-01-06', 18500.00, 8900.00, 2, 'full'),
(34, 17, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(35, 19, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(36, 17, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(37, 17, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(38, 17, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(39, 17, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(40, 17, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(41, 17, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(42, 17, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(43, 15, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(44, 16, 7, '2025-12-07', '2026-01-06', 18500.00, 6500.00, 2, 'full'),
(45, 18, 7, '2025-12-07', '2026-01-06', 18500.00, 18500.00, 3, 'full'),
(46, 21, 7, '2025-12-08', '2026-01-07', 18500.00, 18500.00, 3, 'full'),
(47, 20, 7, '2025-12-09', '2026-01-08', 18500.00, 8900.00, 2, 'full'),
(48, 22, 7, '2025-12-09', '2026-01-08', 20000.00, 9600.00, 2, 'full'),
(49, 23, 7, '2025-12-09', '2026-01-08', 18500.00, 18500.00, 3, 'full'),
(50, 25, 7, '2025-12-09', '2026-01-08', 20000.00, 20000.00, 3, 'full'),
(51, 24, 7, '2025-12-09', '2026-01-08', 20000.00, 20000.00, 3, 'full'),
(52, 26, 7, '2025-12-09', '2026-01-08', 20000.00, 9600.00, 2, 'full'),
(53, 27, 7, '2025-12-09', '2026-01-08', 18500.00, 8900.00, 2, 'full'),
(54, 28, 7, '2025-12-09', '2026-01-08', 20000.00, 9600.00, 2, 'full'),
(55, 29, 7, '2025-12-09', '2025-12-09', 20000.00, 9600.00, 2, 'quarterly');

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
(37, 13, 1, 'Tuition Fee', 12000.00, 1),
(38, 14, 1, 'Registration Fee', 2000.00, 1),
(39, 14, 2, 'Miscellaneous Fee', 4500.00, 1),
(40, 14, 1, 'Tuition Fee', 12000.00, 1),
(41, 15, 1, 'Registration Fee', 2000.00, 1),
(42, 15, 2, 'Miscellaneous Fee', 4500.00, 1),
(43, 15, 1, 'Tuition Fee', 12000.00, 1),
(44, 16, 1, 'Registration Fee', 2000.00, 1),
(45, 16, 2, 'Miscellaneous Fee', 4500.00, 1),
(46, 16, 1, 'Tuition Fee', 12000.00, 1),
(47, 17, 1, 'Registration Fee', 2000.00, 1),
(48, 17, 2, 'Miscellaneous Fee', 4500.00, 1),
(49, 17, 1, 'Tuition Fee', 12000.00, 1),
(50, 18, 1, 'Registration Fee', 2000.00, 1),
(51, 18, 2, 'Miscellaneous Fee', 4500.00, 1),
(52, 18, 1, 'Tuition Fee', 12000.00, 1),
(53, 50, 1, 'Registration Fee', 2000.00, 1),
(54, 50, 2, 'Miscellaneous Fee', 5000.00, 1),
(55, 50, 1, 'Tuition Fee', 13000.00, 1),
(56, 51, 1, 'Registration Fee', 2000.00, 1),
(57, 51, 2, 'Miscellaneous Fee', 5000.00, 1),
(58, 51, 1, 'Tuition Fee', 13000.00, 1),
(59, 52, 1, 'Registration Fee', 2000.00, 1),
(60, 52, 2, 'Miscellaneous Fee', 5000.00, 1),
(61, 52, 1, 'Tuition Fee', 13000.00, 1),
(62, 53, 1, 'Registration Fee', 2000.00, 1),
(63, 53, 2, 'Miscellaneous Fee', 4500.00, 1),
(64, 53, 1, 'Tuition Fee', 12000.00, 1),
(65, 54, 1, 'Registration Fee', 2000.00, 1),
(66, 54, 2, 'Miscellaneous Fee', 5000.00, 1),
(67, 54, 1, 'Tuition Fee', 13000.00, 1),
(68, 55, 1, 'Registration Fee', 2000.00, 1),
(69, 55, 2, 'Miscellaneous Fee', 5000.00, 1),
(70, 55, 1, 'Tuition Fee', 13000.00, 1);

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
(13, 'ahahaha.haha@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-01 03:38:16', '2025-12-01 03:38:16', 0, NULL),
(14, 'aa.aaa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-05 03:34:22', '2025-12-05 03:34:22', 0, NULL),
(15, 'heaven.tranilla@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-05 03:34:49', '2025-12-05 03:34:49', 0, NULL),
(16, 'cardo.deleon@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-07 03:57:42', '2025-12-07 03:57:42', 0, NULL),
(17, 'nevaeh.allinart@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-07 05:13:23', '2025-12-07 05:13:23', 0, NULL),
(18, 'heaven.tranilla00017@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-07 05:46:44', '2025-12-07 05:46:44', 0, NULL),
(19, 'asd.asd@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-07 05:47:39', '2025-12-07 05:47:39', 0, NULL),
(20, 'nevs.art@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-07 08:05:08', '2025-12-07 08:05:08', 0, NULL),
(21, 'maria.santos@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-12-07 21:33:35', '2025-12-07 21:33:35', 0, NULL),
(24, 'jose.reyes@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-12-07 21:34:49', '2025-12-07 21:34:49', 0, NULL),
(25, 'ana.delacruz@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-12-07 21:34:49', '2025-12-07 21:34:49', 0, NULL),
(26, 'pedro.garcia@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-12-07 21:34:49', '2025-12-07 21:34:49', 0, NULL),
(27, 'clara.bautista@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-12-07 21:34:49', '2025-12-07 21:34:49', 0, NULL),
(28, 'aa.aaaa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-08 23:59:23', '2025-12-08 23:59:23', 0, NULL),
(29, 'juan.cruz@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-09 00:25:56', '2025-12-09 00:25:56', 0, NULL),
(30, 'john.calipes@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-09 00:31:23', '2025-12-09 00:31:23', 0, NULL),
(31, 'adasd.asasa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-09 00:35:07', '2025-12-09 00:35:07', 0, NULL),
(32, 'aaaa.aaa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-09 01:45:09', '2025-12-09 01:45:09', 0, NULL),
(33, 'aaaa.aaaaa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-09 01:46:01', '2025-12-09 01:46:01', 0, NULL),
(34, 'aaaa.aaa00026@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-09 02:03:26', '2025-12-09 02:03:26', 0, NULL),
(35, 'adasdsadad.dasdada@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-09 02:10:01', '2025-12-09 02:10:01', 0, NULL),
(36, 'aaa.aaaa@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-09 02:32:19', '2025-12-09 02:32:19', 0, NULL),
(37, 'aa.aaa00029@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-12-09 03:04:21', '2025-12-09 03:04:21', 0, NULL);

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

--
-- Dumping data for table `userrole`
--

INSERT INTO `userrole` (`UserRoleID`, `UserID`, `RoleID`, `AssignedDate`, `ExpiryDate`, `AssignedByUserID`) VALUES
(1, 24, 4, '2025-12-07 00:00:00', NULL, NULL),
(2, 25, 4, '2025-12-07 00:00:00', NULL, NULL),
(3, 26, 4, '2025-12-07 00:00:00', NULL, NULL),
(4, 27, 4, '2025-12-07 00:00:00', NULL, NULL);

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
(1, 1, '534f8ddc45e6bdced2d0ba6baaaec946451e95b95ea92b5280de2d66e715eca0_1_1765215326', '2026-01-08 01:35:26', '2025-11-28 08:12:27', '2025-12-09 01:35:26'),
(6, 7, 'b9b26c597a95eda2ba9e22a3c8ac8ada654615ec34f12cc4efc9db845c2b0648_7_1764419950', '2025-12-29 20:39:12', '2025-11-28 08:49:50', '2025-11-29 20:39:12'),
(12, 6, 'aaa2bc638688b3c99cddfa08f015ff5dae4638cca6d964516c19095214c92474_6_1764293721', '2025-12-28 09:35:21', '2025-11-28 09:35:21', '2025-11-28 09:35:21'),
(13, 3, '08e4f4fd9d5c492073c64ec2961e597743fc00dabde0b4304be78c0870943753_3_1764294862', '2025-12-28 09:54:22', '2025-11-28 09:47:47', '2025-11-28 09:54:22'),
(17, 2, '3b85f530d2f2a428651abfd6ce6fbd2e3e473abb9acb463988d8899b8104424b_2_1765207790', '2026-01-07 23:29:50', '2025-11-28 09:55:09', '2025-12-08 23:29:50'),
(20, 8, '3cbc729c82243342269df59f4de775af47cfbb56eed8a237b42b4c368d4108e4_8_1764327774', '2025-12-28 19:02:54', '2025-11-28 19:02:54', '2025-11-28 19:02:54'),
(21, 9, '0a10454180f0adfb344d3818866a103b334f61583689ddaf7c227136431c4b67_9_1764328248', '2025-12-28 19:10:48', '2025-11-28 19:10:48', '2025-11-28 19:10:48'),
(27, 10, '4ec48c909309e0525f5d9247f3b1f8f98349f21a5e23680e119b64fd25002baa_10_1764416396', '2025-12-29 19:39:56', '2025-11-29 19:39:56', '2025-11-29 19:39:56'),
(30, 11, 'e64965696f807244199eec7e54cf019117742146dc6481ec38f3791dfd8db013_11_1764876387', '2026-01-04 03:26:27', '2025-11-30 13:39:31', '2025-12-05 03:26:27'),
(32, 13, '600d56f73bbe4118c9479b8399b0b3f7748f23b07fc0dd7e4d3547bb221e4578_13_1765066463', '2026-01-06 08:14:23', '2025-12-05 00:35:41', '2025-12-07 08:14:23'),
(37, 15, '12406970de57cbba5db9e856ad141bbfc49c6b2d5b7fccca3b7490f04acc755d_15_1764876915', '2026-01-04 03:35:15', '2025-12-05 03:35:15', '2025-12-05 03:35:15'),
(42, 17, '3cf645967762e8075cfc005fd6ba77d35c6ef32b2f53be20603cc1a231ecec38_17_1765055833', '2026-01-06 05:17:13', '2025-12-07 05:17:13', '2025-12-07 05:17:13'),
(43, 18, '34ec20325d4411816705b9d48e6dff49949cd126398f501a103ec0a2af6b1b2b_18_1765057621', '2026-01-06 05:47:01', '2025-12-07 05:47:01', '2025-12-07 05:47:01'),
(44, 19, '45b597c76fa1d7b7505bf0b6168288989c6a3a170a87b95286e79729f1dae254_19_1765057679', '2026-01-06 05:47:59', '2025-12-07 05:47:59', '2025-12-07 05:47:59'),
(60, 29, 'f07864007513f308bb1bed1c6bd109cc298d69ff076f7e6f13cf1939b6b42ef6_29_1765211189', '2026-01-08 00:26:29', '2025-12-09 00:26:29', '2025-12-09 00:26:29'),
(61, 30, '52c1556e44c634162a36a00a74b834a21cc3aa350039227c21e0eb6ff8729dab_30_1765217632', '2026-01-08 02:13:52', '2025-12-09 00:31:49', '2025-12-09 02:13:52'),
(62, 31, '4da304ef9bacea2d291a3a8513e89aa0cfbc2f4718fa5dd8812d07348fc54262_31_1765211739', '2026-01-08 00:35:39', '2025-12-09 00:35:39', '2025-12-09 00:35:39'),
(64, 32, '53e3b20dca00d182990935ad9aadc302544307d0496bdef1b87a8d4e209414ed_32_1765215934', '2026-01-08 01:45:34', '2025-12-09 01:45:34', '2025-12-09 01:45:34'),
(65, 33, '6e7230a762f24a81488ba24a7dd7a2879cb3dc46a40d289b5437143a6f70ebe8_33_1765216016', '2026-01-08 01:46:56', '2025-12-09 01:46:56', '2025-12-09 01:46:56'),
(66, 34, 'bb066f63e8de6bb76684f1581c5c230cfcc450e57e03d889c2196fc2a6167f0e_34_1765217023', '2026-01-08 02:03:43', '2025-12-09 02:03:43', '2025-12-09 02:03:43'),
(67, 35, '6babbd213a87af0543b9a99d026d9933b7d7bdca7e5c44fd09c83e3bd8f88eff_35_1765217427', '2026-01-08 02:10:27', '2025-12-09 02:10:27', '2025-12-09 02:10:27'),
(69, 36, '9500fda77db6afa3cca2ca64df674f3fb17ee32840014f777296060da00167a8_36_1765219391', '2026-01-08 02:43:11', '2025-12-09 02:32:47', '2025-12-09 02:43:11'),
(72, 37, '9d7c937c8f653c3635798a3afd3b814d9f751ef3a213e25b941b5f0a9036118a_37_1765221413', '2026-01-08 03:16:53', '2025-12-09 03:16:53', '2025-12-09 03:16:53');

-- --------------------------------------------------------

--
-- Table structure for table `vw_student_auth`
--

CREATE TABLE `vw_student_auth` (
  `UserID` int(11) DEFAULT NULL,
  `EmailAddress` varchar(255) DEFAULT NULL,
  `UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff','HeadTeacher') DEFAULT NULL,
  `AccountStatus` enum('Active','Inactive','Suspended','PendingVerification') DEFAULT NULL,
  `LastLoginDate` datetime DEFAULT NULL,
  `UserCreatedAt` datetime DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT NULL,
  `ProfileID` int(11) DEFAULT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `MiddleName` varchar(100) DEFAULT NULL,
  `FullName` varchar(302) DEFAULT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedAddress` varbinary(512) DEFAULT NULL,
  `ProfilePictureURL` varchar(2048) DEFAULT NULL,
  `StudentProfileID` int(11) DEFAULT NULL,
  `StudentNumber` varchar(50) DEFAULT NULL,
  `QRCodeID` varchar(255) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Nationality` varchar(100) DEFAULT NULL,
  `StudentStatus` enum('Enrolled','Withdrawn','Graduated','On Leave') DEFAULT NULL,
  `ArchiveDate` date DEFAULT NULL,
  `PasswordHash` varchar(255) DEFAULT NULL,
  `PasswordSetDate` datetime DEFAULT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `MustChange` tinyint(1) DEFAULT NULL,
  `FailedLoginAttempts` int(11) DEFAULT NULL,
  `LockedUntil` datetime DEFAULT NULL,
  `LoginStatus` varchar(12) DEFAULT NULL,
  `Age` bigint(21) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `studentlogindetails`
--
DROP TABLE IF EXISTS `studentlogindetails`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `studentlogindetails`  AS SELECT `u`.`UserID` AS `UserID`, `sp`.`StudentNumber` AS `StudentNumber`, `pp`.`PasswordHash` AS `PasswordHash`, concat(`p`.`FirstName`,' ',`p`.`LastName`) AS `FullName`, `u`.`UserType` AS `UserType`, `u`.`AccountStatus` AS `AccountStatus`, `p`.`ProfileID` AS `ProfileID` FROM (((`studentprofile` `sp` join `profile` `p` on(`sp`.`ProfileID` = `p`.`ProfileID`)) join `user` `u` on(`p`.`UserID` = `u`.`UserID`)) join `passwordpolicy` `pp` on(`u`.`UserID` = `pp`.`UserID`)) WHERE `u`.`UserType` = 'Student' ;

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
-- Indexes for table `archive_search`
--
ALTER TABLE `archive_search`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `gradesubmission`
--
ALTER TABLE `gradesubmission`
  ADD PRIMARY KEY (`SubmissionID`),
  ADD UNIQUE KEY `unique_section_quarter` (`SectionID`,`SchoolYearID`,`Quarter`),
  ADD KEY `idx_section` (`SectionID`),
  ADD KEY `idx_school_year` (`SchoolYearID`),
  ADD KEY `idx_status` (`SubmissionStatus`),
  ADD KEY `idx_submitted_by` (`SubmittedByUserID`),
  ADD KEY `idx_reviewed_by` (`ReviewedByUserID`),
  ADD KEY `idx_submission_date` (`SubmittedDate`);

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
  MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
-- AUTO_INCREMENT for table `archive_search`
--
ALTER TABLE `archive_search`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `AttendanceSummaryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
  MODIFY `RequestID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  MODIFY `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `GradeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1165;

--
-- AUTO_INCREMENT for table `gradelevel`
--
ALTER TABLE `gradelevel`
  MODIFY `GradeLevelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `gradestatus`
--
ALTER TABLE `gradestatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `gradesubmission`
--
ALTER TABLE `gradesubmission`
  MODIFY `SubmissionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `gradesubmissiondeadline`
--
ALTER TABLE `gradesubmissiondeadline`
  MODIFY `DeadlineID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guardian`
--
ALTER TABLE `guardian`
  MODIFY `GuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
  MODIFY `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
  MODIFY `PolicyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `TokenID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
  MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

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
  MODIFY `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `studentprofile`
--
ALTER TABLE `studentprofile`
  MODIFY `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
  MODIFY `TeacherProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `transactionitem`
--
ALTER TABLE `transactionitem`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `transactionstatus`
--
ALTER TABLE `transactionstatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `userrole`
--
ALTER TABLE `userrole`
  MODIFY `UserRoleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `usersettings`
--
ALTER TABLE `usersettings`
  MODIFY `SettingsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `SessionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

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
-- Constraints for table `gradesubmission`
--
ALTER TABLE `gradesubmission`
  ADD CONSTRAINT `fk_gradesubmission_reviewed_by` FOREIGN KEY (`ReviewedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_gradesubmission_schoolyear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_gradesubmission_section` FOREIGN KEY (`SectionID`) REFERENCES `section` (`SectionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_gradesubmission_submitted_by` FOREIGN KEY (`SubmittedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

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
