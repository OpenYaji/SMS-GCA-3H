-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2025 at 04:40 PM
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
-- Database: `db_gymnazo`
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
(1, 26, 6, '2025-11-21', '2025-11-21 17:20:25', NULL, 'Absent', NULL, NULL),
(2, 26, 6, '2025-11-20', '2025-11-21 17:21:07', NULL, 'Present', NULL, NULL),
(6, 26, 6, '2025-11-23', '2025-11-23 19:29:17', NULL, 'Present', NULL, NULL),
(7, 26, 6, '2025-11-18', '2025-11-23 19:30:16', NULL, 'Absent', NULL, NULL);

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
(1, 'RFID', 1),
(2, 'Manual', 1);

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
(6, 14, 5, 6, '', '07:00:00', '07:45:00', 2, 'Room 101'),
(7, 14, 4, 6, '', '07:45:00', '08:45:00', 2, 'Room 101');

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
(1, 1, 'Rosalind Blanda', 0xf34a541f77657ee721de98a615322011),
(2, 2, 'Miss Lillian Hudson', 0xc3f2c2b7dd216f95f7f454b56dcb4cba),
(3, 3, 'Tiana Heller', 0x964434566173025e62c4468691835c84),
(4, 4, 'Thora Jacobson', 0xd9cd751d2e81c7cd620c26bfb2e12fad),
(5, 5, 'Johnson White', 0x59a2f3db276252caac7bf79de44b9e6b),
(6, 6, 'Mrs. Geraldine Mills IV', 0x7f86f308bfa9562adf8e3da781731c8d),
(7, 7, 'Royal Stark', 0xc906aadbac1ad6bf932d40844bc661f6),
(8, 8, 'Prof. Arlo Dickinson', 0x5e73ab258bf9b3888e4b4cad13f845aa),
(9, 9, 'Esmeralda Mohr', 0x376e6e83e3d8880f9a916e9a258e2258),
(10, 10, 'Ezekiel Hermiston', 0x02dde1b6152c2d9165ece52944cccf2e),
(11, 11, 'Chanelle Pacocha', 0x22174b979ce27f20cf7b801c66d90b84),
(12, 12, 'Ethel Altenwerth', 0xfa797de0f02804b62450ab11491080da),
(13, 13, 'Felipe Donnelly DDS', 0xa5941a1c6c5684820ba952e8b97454ca),
(14, 14, 'Dr. Erwin Wolf', 0xca67dd683f7d56a6cd30c250a8af40f2),
(15, 15, 'Brian Trantow', 0x828058a633e0246f7985832f743313de),
(16, 16, 'Dr. Mabel Kuhn Sr.', 0x74595e7830fc52c137c88d960eb1fbf3),
(17, 17, 'Prof. Annabell Casper', 0xeea19902a6a656324c2e8e91d2a9d296),
(18, 18, 'Mrs. Eldridge Schuppe Jr.', 0x1be631f9c305a1eaff9b3b52ec70b667),
(19, 19, 'Dimitri Quitzon', 0x8769c4a7c16c0ccc361a64676d4d3a8f),
(20, 20, 'Zita Ziemann', 0x6ac7a568ad00db7f4257ea06bcf0d007),
(21, 21, 'Miss Tina Bosco', 0x208a4b811bf9f57d772d03b22bb7ab09),
(22, 22, 'Elroy Koelpin', 0x4c9515666e57d03de74abc7fcd6bb8cb),
(23, 23, 'Mallie Marvin', 0x4698be78e616962656f66a7b3d056dbb),
(24, 24, 'Vernice Davis', 0x61e3fa201bc2360b4e4d371c0b062ebc),
(25, 25, 'Sidney Hills', 0x8e466a137f1e7d7ec1a925ec0de1692a),
(26, 26, 'Mable Lesch', 0x364710bb13bf163fe9869156546bcf6b),
(27, 27, 'Mr. Jamie Breitenberg', 0x941fe2dccb80f92714b60eca94070c80),
(28, 28, 'Garland Schmidt', 0x1166a6ba5e2260c5cf8eadce027f6ab6),
(29, 29, 'Winifred Lockman DVM', 0x0dda215041bc7cdde3ac76d7df28ebb0),
(30, 30, 'Robbie Waters Jr.', 0x56b3c4c9b6fab0d0daedb5df18394590),
(31, 31, 'Maximillian Gleichner', 0xb8267607320c8d3e52c329c0811563e5),
(32, 32, 'Augustus Nicolas', 0x4fcc7dbc26af49cc67b8bc1ff5614a67),
(33, 33, 'Prof. Buddy Windler', 0x2747cf052fd619a288069455d45067ef),
(34, 34, 'Prof. Gerhard Wisoky IV', 0x1de534aae715f4adaf3497b78f004426),
(35, 35, 'Prof. Juston Hoppe', 0xc410402c6bc632764447342c9b60e92b),
(36, 36, 'Prof. Amber Stiedemann', 0xeff4005ec087def4a332e279ec0b9426),
(37, 37, 'Prof. Blake Beahan III', 0x98d94eee8fea9e7c371c5668c9ad5d3f),
(38, 38, 'Mrs. Cecilia Prohaska', 0x80e6fbf07e3d7dd825938e605f6c9cce),
(39, 39, 'Korbin Hodkiewicz', 0x0b1b55f752e8bf86120c9cba6fe568c3),
(40, 40, 'Devan Dibbert', 0x80463b4690fad2598d2e2a5b9d1b8e05),
(41, 41, 'Robb Cremin', 0x6d1975554d891426724b99286c9bdc2f),
(42, 42, 'Jake Feil', 0x2d9c8eea922fa6931868c4a9174d25bb),
(43, 43, 'Mr. Forest Gottlieb', 0x2d73c1acb8261982edb7a7ff86407012),
(44, 44, 'Koby Fritsch', 0x6d38c8da803bb81f94dcb940028fd2e8),
(45, 45, 'Dr. Leif Ritchie PhD', 0x12260679603d6832729be48c70f8a4ce),
(46, 46, 'Bobbie Hand', 0x3e43a48d1dd31e8ecd67b1ecc3602207),
(47, 47, 'Sammie Flatley', 0x5d74f667b970c933cdad90f10d768b9b),
(48, 48, 'Helen Stamm Jr.', 0xad4f88f1892f552192ddc2e2abe4148e),
(49, 49, 'Ernest McLaughlin', 0xfe2f3aef3a9398615365643fca590aae),
(50, 50, 'Joanne Labadie', 0x9aabe8abbba7e3af46d6441e0a878c33);

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
(1, 1, 38, 1, '2025-11-10'),
(2, 3, 34, 1, '2025-11-10'),
(3, 6, 16, 1, '2025-11-10'),
(4, 10, 22, 1, '2025-11-10'),
(5, 14, 16, 1, '2025-11-10'),
(6, 15, 38, 1, '2025-11-10'),
(7, 17, 33, 1, '2025-11-10'),
(8, 18, 37, 1, '2025-11-10'),
(9, 21, 38, 1, '2025-11-10'),
(10, 23, 36, 1, '2025-11-10'),
(11, 26, 14, 1, '2025-11-10'),
(12, 28, 31, 1, '2025-11-10'),
(13, 30, 6, 1, '2025-11-10'),
(14, 31, 12, 1, '2025-11-10'),
(15, 33, 17, 1, '2025-11-10'),
(16, 34, 19, 1, '2025-11-10'),
(17, 35, 2, 1, '2025-11-10'),
(18, 38, 31, 1, '2025-11-10'),
(19, 43, 36, 1, '2025-11-10'),
(20, 46, 25, 1, '2025-11-10'),
(21, 47, 29, 1, '2025-11-10'),
(22, 50, 40, 1, '2025-11-10'),
(31, 22, 32, 2, '2025-11-14'),
(32, 24, 32, 2, '2025-11-14');

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
(4, 11, 1, 'First Quarter', 87.00, '', NULL, '2025-11-17 13:41:52', 9),
(5, 11, 1, 'Second Quarter', 90.00, 'Nice', NULL, '2025-11-17 12:38:05', 9),
(6, 11, 1, 'Third Quarter', 96.00, 'Nice', NULL, '2025-11-17 12:38:19', 9),
(7, 11, 1, 'Fourth Quarter', 81.00, 'Nice', NULL, '2025-11-17 12:38:27', 9),
(9, 11, 7, 'First Quarter', 82.00, '', NULL, '2025-11-21 16:24:30', 9),
(10, 11, 2, 'First Quarter', 91.00, 'Good', NULL, '2025-11-17 13:47:41', 9),
(11, 11, 5, 'First Quarter', 89.00, '', NULL, '2025-11-21 16:27:24', 9),
(12, 11, 6, 'First Quarter', 91.00, '', NULL, '2025-11-21 16:25:21', 9),
(13, 11, 3, 'First Quarter', 93.00, '', NULL, '2025-11-21 16:23:13', 9),
(14, 11, 4, 'First Quarter', 81.00, '', NULL, '2025-11-21 16:29:55', 9),
(15, 11, 2, 'Second Quarter', 90.00, '', NULL, '2025-11-21 16:24:21', 9),
(16, 11, 7, 'Second Quarter', 85.00, '', NULL, '2025-11-21 16:24:44', 9),
(17, 11, 5, 'Second Quarter', 88.00, '', NULL, '2025-11-21 16:25:12', 9),
(18, 11, 6, 'Second Quarter', 89.00, '', NULL, '2025-11-21 16:25:48', 9),
(19, 11, 3, 'Second Quarter', 91.00, '', NULL, '2025-11-21 16:25:58', 9),
(20, 11, 4, 'Second Quarter', 90.00, '', NULL, '2025-11-21 16:26:11', 9),
(21, 11, 2, 'Third Quarter', 97.00, '', NULL, '2025-11-21 16:26:30', 9),
(22, 11, 2, 'Fourth Quarter', 91.00, '', NULL, '2025-11-21 16:26:41', 9),
(23, 11, 7, 'Third Quarter', 87.00, '', NULL, '2025-11-21 16:27:01', 9),
(24, 11, 7, 'Fourth Quarter', 83.00, '', NULL, '2025-11-21 16:27:12', 9),
(25, 11, 5, 'Third Quarter', 91.00, '', NULL, '2025-11-21 16:27:43', 9),
(26, 11, 5, 'Fourth Quarter', 91.00, '', NULL, '2025-11-21 16:28:00', 9),
(27, 11, 6, 'Third Quarter', 87.00, '', NULL, '2025-11-21 16:28:19', 9),
(28, 11, 6, 'Fourth Quarter', 92.00, '', NULL, '2025-11-21 16:28:32', 9),
(29, 11, 3, 'Third Quarter', 86.00, '', NULL, '2025-11-21 16:29:09', 9),
(30, 11, 3, 'Fourth Quarter', 83.00, '', NULL, '2025-11-21 16:29:23', 9),
(31, 11, 4, 'Third Quarter', 84.00, '', NULL, '2025-11-21 16:29:45', 9),
(32, 11, 4, 'Fourth Quarter', 85.00, 'Good', NULL, '2025-11-21 16:30:15', 9);

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
(1, 'Sabina Mueller', 0x33144f973fa2f7c526f2e78382c314cd, 0xf98a47537ac7db28590af7cd66b407010df5471df9ce2279cb87e519ba839ca1, 'Engineer', '2983 Borer Hill Apt. 114\nMathewside, WY 96182-7066'),
(2, 'Joshuah Hahn', 0xa19d71003c00d41d3ec4275dc9595b2a, 0x1b175dbf7b059e32c0dc7bea86b876d48186cf0a396ad6f18f80357a134d66a6, 'Doctor', '2852 Torp Bridge Apt. 791\nLake Arvilla, NE 22596'),
(3, 'Dexter Johns', 0x2e3f2c27ba5451eece4ad21b8a452f0a, 0x34c8e38c25e07b2d1865140b59bfeb388186cf0a396ad6f18f80357a134d66a6, 'Doctor', '321 Hansen Cove Suite 156\nNew Abigalestad, VA 83898-0006'),
(4, 'Doyle Eichmann', 0x695629f7bdb36cc7afb52770c5348e07, 0xb6839fabb1499d5b20414bdafe0a51720df5471df9ce2279cb87e519ba839ca1, 'Businessman', '3518 Altenwerth Glens Suite 603\nPort Odessa, GA 17900-9721'),
(5, 'Lorenza Fritsch', 0xdf72b160a1c0d820ac9bc7f238bfee81, 0xb37aae38fcab226cdb6356f859fa6ad6e99360f3ab5cade995d2fe661ca36af1, 'Teacher', '93519 Cruickshank Plain\nLake Stevebury, TN 40114-7367'),
(6, 'Leone Williamson', 0x42399eb64c62ac36d884a0653279f4eb, 0x644ce70ec2a8950d425151686b75559fb1e49c69bb366e8f4498f0a30c9d30d3, 'Engineer', '58757 Idella Lodge Apt. 403\nLake America, PA 35112'),
(7, 'Eloisa Muller', 0x8c7a9773a1f808f1df94520a7d4e9ae9, 0xceb253de591357a2af0d0f4c1cdb1da1138e72e908132fc67ef78a9e7d71dee2, 'Lawyer', '10226 Bernhard Stream\nGutkowskifort, PA 72254'),
(8, 'Adrienne Kub', 0x1e7fbcc43b33dfc605f6655bceb58e60, 0xc0115b54d0b41f1b62732170f1b09f2d8186cf0a396ad6f18f80357a134d66a6, 'Doctor', '88687 Scarlett Viaduct\nPort Glennieside, MT 68227-9077'),
(9, 'Jess Carroll', 0x9ec13f7611e14314ea783c426f41bb94, 0x75a1214e84300b3ad2702d710b493bee8186cf0a396ad6f18f80357a134d66a6, 'Lawyer', '783 Kali Common\nIvafort, DC 35980'),
(10, 'Wilbert Langosh', 0x1ccc6dc7273be092d948b7385473ec75, 0xc05f8905c75f927448da30459938c260e99360f3ab5cade995d2fe661ca36af1, 'Engineer', '89172 Schumm Underpass\nWest Austinmouth, HI 14062'),
(11, 'Randy Gerlach', 0x8acd5d558d00af53e55ef9d7998b1cfb, 0xada72472a3aedef328044c9c91c838de138e72e908132fc67ef78a9e7d71dee2, 'Lawyer', '95700 Ondricka Plains\nEast Lomaville, DC 14042-8768'),
(12, 'Ferne Willms', 0x38f7ab40ec021a04403fec86bbde1d67, 0x8dacad2bce6df16e46f23619d8cd2d798186cf0a396ad6f18f80357a134d66a6, 'Accountant', '5669 Mraz Gardens\nElizaside, AL 17744'),
(13, 'Toy Reichel', 0xc26466e7d0c5a93d49ed996fc2fe8e7a, 0x999f43e851b61ce81964dbb89d77db4aed120d81c04c779b269cd6f6bde3c5ee, 'Nurse', '517 Jamal Mall\nSouth Merl, WA 47785-2591'),
(14, 'Raina Kozey', 0xdad8a3fe7e10972de26e362c9af38724, 0xd62dbe604fd327ba08390a52151ead0bed120d81c04c779b269cd6f6bde3c5ee, 'Nurse', '354 Labadie Center Suite 508\nMurphyhaven, DE 21260-6803'),
(15, 'Erik Lehner', 0x1abea989c3dcd99cfb1551f55b28cd25, 0x25ef61838fea05881339f19639e68921ed120d81c04c779b269cd6f6bde3c5ee, 'Engineer', '5510 Crist Extensions\nNew Alberto, KS 52792-4161'),
(16, 'Tavares Larkin', 0x0cb9860b31dd545eb4b05a6307fdee7e, 0xc0b788358e2a8d6724a2dd554daf0e4f0df5471df9ce2279cb87e519ba839ca1, 'Businessman', '4148 Barton Corner Apt. 313\nLabadieview, SD 60304'),
(17, 'Helena Hodkiewicz', 0xa4cb9adcee7e4505c238efb058be5d27, 0xf746811ff170576efacb84e8ecd15f4b11dd677b09091afbb9b539570a312565, 'Lawyer', '14080 Reichert Ramp Apt. 450\nEast Malachi, GA 18753'),
(18, 'Cesar Quitzon', 0xc7a6634cb717bce72c6c1fae207ee4d4, 0x81630f33c99b5f8c7801580927c9abff138e72e908132fc67ef78a9e7d71dee2, 'Lawyer', '166 Harber Vista\nHesselbury, NE 40150'),
(19, 'Raina Wisoky', 0x4bbdb8b2e41e2d09d0a276a5669bf482, 0x5bda2b2e66c7e651c73a475bf34257208186cf0a396ad6f18f80357a134d66a6, 'Engineer', '5122 Dooley Land Apt. 098\nKevenstad, KY 70285'),
(20, 'Nya Lakin', 0x958525aeba9847a3f8941a73628da799, 0x7e453ccb6f8eeeb987b766dc6287253338f1fb75e9c1236c3259a20810dfa495, 'Doctor', '9011 Farrell Shore Apt. 751\nLenoraland, SD 63321'),
(21, 'Elena Veum', 0x88793a4d41b71b212b4d9e92751debb4, 0xa87de063b36311cdae52cff79b9c74e42d619f3eda7b156da466b15f50415f31, 'Nurse', '67336 Stokes Port Suite 257\nNorth Cruz, MO 07458-5755'),
(22, 'Melvin Lebsack', 0xb66df23e1366881fb1eb264c6879dff5, 0x3692d1778cf7977c7b8b65460b1649450df5471df9ce2279cb87e519ba839ca1, 'Accountant', '62084 Turner Branch Apt. 043\nNorth Lorine, CT 99716'),
(23, 'Murray Deckow', 0x4146bc3d6d32e6997ddc006ff2705129, 0x2ff2bfb997aa1a24458ae7dae7edb901138e72e908132fc67ef78a9e7d71dee2, 'Manager', '593 Burdette Brook\nLake Humberto, NH 38684-9808'),
(24, 'Cristian Heller', 0xf17f2d8b46e7ac690b41f11d19a06cd7, 0xa85f6b1727231b493d27bcc53adea9d7e99360f3ab5cade995d2fe661ca36af1, 'Teacher', '79832 Vito Alley Apt. 052\nNorth Marielleshire, PA 94586-4509'),
(25, 'Ramiro Reilly', 0xdfd792e637e5a378375b87f2fd3ee030, 0x8781fb2b4377fc6a4af4581e2afeba39138e72e908132fc67ef78a9e7d71dee2, 'Businessman', '784 Kerluke Crossing Apt. 998\nPort Loiston, CT 54547-3396'),
(26, 'Lucinda Harvey', 0xb937915811b303b6f1c13e06b2752516, 0x9d0686c95daaab9961aa6ee892acc2a80df5471df9ce2279cb87e519ba839ca1, 'Doctor', '50427 Newton Ridges Apt. 216\nMrazton, NE 67909'),
(27, 'Norbert Dietrich', 0x6f97241eb732981a24c2c43e1724769a, 0xa6788cf8e248b5ff531ad4c721c03729b1e49c69bb366e8f4498f0a30c9d30d3, 'Doctor', '8018 Hermann Inlet Apt. 831\nWilliamsonport, PA 77735'),
(28, 'Francisco Prosacco', 0x2351ab8b978377b6c04d4896840bc636, 0x64a5dd52ea57ac490cfe0ee5727008755332b80a1d1f4fb689ef79412ee2d5d5, 'Lawyer', '658 Hamill Plains Apt. 099\nSchinnerstad, KY 48756'),
(29, 'Caterina Rice', 0x398a97830c7ae8bfeb33de3224d3c813, 0x5ce00381a07ff955fcf13fba096a32f9138e72e908132fc67ef78a9e7d71dee2, 'Doctor', '230 Jamir Trail Suite 237\nNew Vernon, WV 06047'),
(30, 'Hildegard Littel', 0xf47bd8feb85b86db81e60a91fc271b84, 0x65ba29d9caec466268113da60530cbd7b1e49c69bb366e8f4498f0a30c9d30d3, 'Accountant', '88221 Emerald Extensions Apt. 210\nDarwinchester, HI 89955-4031'),
(31, 'Cayla Watsica', 0x07466b5fc2441c318c3d077cdc8b4241, 0xfc038c1d973315048dd945e5e4a2de21138e72e908132fc67ef78a9e7d71dee2, 'Lawyer', '237 Goldner Course\nSouth Skylarfort, OR 70551-8053'),
(32, 'Karley Glover', 0x8ddd476ea8cb63ed2fca1119aaabcde9, 0xb2ae5fd47594f2412e7f527136fc1e76138e72e908132fc67ef78a9e7d71dee2, 'Lawyer', '1738 Elisabeth Brook Apt. 671\nAnabelleberg, MN 43384'),
(33, 'Eli Grant', 0x4192e48171c452a67088b6c17ffbdace, 0x5a9f5cc9d5c4245b8674f2df67e2bcb138f1fb75e9c1236c3259a20810dfa495, 'Engineer', '349 Jan Motorway\nWest Adelbert, AR 78395-2828'),
(34, 'London Lowe', 0xf7635bab43f5dd7d173c8d8529d7cef6, 0x817760e0f59eb56bf6bcbbd4b94d2876ed120d81c04c779b269cd6f6bde3c5ee, 'Doctor', '6657 Hortense Plains\nEast Catherineview, WA 64491'),
(35, 'Chadrick Reinger', 0x82529e2cdb058c8a97b226ecc0efd36e, 0x46633c65dd26c2e29db0ae712df0dc32b1e49c69bb366e8f4498f0a30c9d30d3, 'Businessman', '3458 Kling Shores\nSouth Addison, RI 75518'),
(36, 'Keegan Bartell', 0x9ec80688941478c0800ebbbd59cc051a, 0x80f844fad4705ec008b47a62d89667870df5471df9ce2279cb87e519ba839ca1, 'Engineer', '654 Haleigh Pike Suite 617\nNew Mazie, MT 20075-6185'),
(37, 'Cortney Stokes', 0x7dadc09f964db8a88418b098fb47d9e4, 0x564977e1b0077d1893e6bcdfc2d4384d0df5471df9ce2279cb87e519ba839ca1, 'Manager', '61132 General Circle Apt. 048\nWest Genovevaton, NC 39303'),
(38, 'Carrie Runte', 0xa6dbbfe65c739dbfab16f2a787b5c9f1, 0xee2cf47614c4206f86017b96b58731418186cf0a396ad6f18f80357a134d66a6, 'Doctor', '333 Cristian Inlet\nKrismouth, FL 27113'),
(39, 'Gabrielle Christiansen', 0xdc5b9727937a8e4c04d5d7a9bfec66bb, 0x83a486a86b0293683e25554fff8206ad1e54dfeaed7725af2372f14143e0eb3671d124915a3d44bc17b761186d0eb00e, 'Nurse', '525 Lulu Way Suite 539\nKohlerburgh, WY 37374'),
(40, 'Vivian Bogan', 0x401a86f4fa9b8ab117bd09faab249a8f, 0xf4d69f1fd7ac6078711fa2668efaaebf8186cf0a396ad6f18f80357a134d66a6, 'Engineer', '547 Kovacek Ville Suite 022\nBrandymouth, KY 03113-6368'),
(41, 'Anastasia Durgan', 0x5601b570f0e76c3720da777772962add, 0x7e0d6845a9f2f2227503eb5f920a1deeb1e49c69bb366e8f4498f0a30c9d30d3, 'Nurse', '393 Barrows Meadows\nWest Reyna, GA 91948'),
(42, 'Alysson Durgan', 0xa893fd77a2be3962db1e72e3c1bcfa89, 0x05e026ed212c4b7b60b9f56163c755c60df5471df9ce2279cb87e519ba839ca1, 'Nurse', '14564 Claudine Motorway Apt. 698\nLake Bereniceburgh, VA 04527-3761'),
(43, 'Elsie Schuster', 0x2e303b1f2e2c85e7c8ac9c0982ba3a62, 0x370ef218517e108305f027a0517e6be40df5471df9ce2279cb87e519ba839ca1, 'Nurse', '6180 Reilly Fork\nRippinstad, AL 61395-5648'),
(44, 'Kariane Beahan', 0x66d70f7916d5cecc6bb9d3d71020751f, 0xd7a618b65737319c75dc4b1dee664ed10df5471df9ce2279cb87e519ba839ca1, 'Businessman', '58253 Herman Walk Apt. 138\nSchmittburgh, IL 45320'),
(45, 'Colton Gottlieb', 0xe605b7d74f77a451bd1adc67dc9766fe, 0x65895c178ccb822783eb17a0847e19d6e99360f3ab5cade995d2fe661ca36af1, 'Engineer', '26753 Robert Trail Apt. 731\nPort Loufurt, OK 31717'),
(46, 'Frederic White', 0x14c61b013db3c04c9760f67e22dd2df4, 0xe5bfd67b8ab560796fb1d9172a3b1ffc0df5471df9ce2279cb87e519ba839ca1, 'Businessman', '43128 Aric Springs Apt. 284\nStokestown, MA 28969'),
(47, 'Hollie Carter', 0x16e5ce2d629e2f88584c064c9a15e561, 0x72a0b67f0425d98a3879ff760fea363d138e72e908132fc67ef78a9e7d71dee2, 'Accountant', '679 Myrtle Square\nPort Markusburgh, WA 50500-4694'),
(48, 'Lenna Renner', 0x11f9ca436eaa6bc369d8316cb0e0f61c, 0x0dadfd473173270377f4ae16579891848186cf0a396ad6f18f80357a134d66a6, 'Teacher', '29944 Kreiger Garden Suite 060\nSkileston, NY 50103'),
(49, 'Destinee Eichmann', 0xcbd491cabe27cf20c070b519d80ca283, 0x40962db638f278c02ba18ee5d5136315ef69dc3057a369151b301d2982d06b61, 'Teacher', '933 Lauriane Prairie\nSouth Enoch, OH 82832-2879'),
(50, 'Arne Haag', 0x60f8dfa38482a9fc6e4b903bcafacc5b, 0x605247b6c60027491b5f6a160ab8304d38f1fb75e9c1236c3259a20810dfa495, 'Engineer', '7238 Robert Dam\nHamillville, WV 25061-1271');

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
(1, 1, 58.77, 149.05, 0x7c18758c118efba3321a14bd80e2bd7b, 0xd7c58aa386c316ea7b464b775ce33295, 0x7699795cd020f0e4eaa12b00909f3339),
(2, 2, 68.85, 168.05, 0x7c18758c118efba3321a14bd80e2bd7b, 0xd0b2aad393e17cec326967ddf6a5efca, 0xd7c58aa386c316ea7b464b775ce33295),
(3, 3, 47.83, 170.20, 0xd7c58aa386c316ea7b464b775ce33295, 0xd0b2aad393e17cec326967ddf6a5efca, 0xd7c58aa386c316ea7b464b775ce33295),
(4, 4, 64.43, 166.69, 0x7c18758c118efba3321a14bd80e2bd7b, 0x337ce470653b5d679fb0889718ad9d8c, 0xd7c58aa386c316ea7b464b775ce33295),
(5, 5, 67.05, 144.78, 0xd7c58aa386c316ea7b464b775ce33295, 0xac029d12d88bcd3d7d0e4b291c273d87, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(6, 6, 37.34, 145.30, 0xd7c10be1124f8521b73f23654842ffb5, 0x337ce470653b5d679fb0889718ad9d8c, 0x63c227d37d79890b356936722da1c844),
(7, 7, 61.07, 121.26, 0x47adf6c08a0e15312add40bf4fde79c1, 0x337ce470653b5d679fb0889718ad9d8c, 0xd7c58aa386c316ea7b464b775ce33295),
(8, 8, 52.88, 134.20, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xac029d12d88bcd3d7d0e4b291c273d87, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(9, 9, 54.90, 133.86, 0xd7c10be1124f8521b73f23654842ffb5, 0xac029d12d88bcd3d7d0e4b291c273d87, 0x7699795cd020f0e4eaa12b00909f3339),
(10, 10, 54.46, 137.57, 0x47adf6c08a0e15312add40bf4fde79c1, 0xac029d12d88bcd3d7d0e4b291c273d87, 0x63c227d37d79890b356936722da1c844),
(11, 11, 50.66, 145.93, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xac029d12d88bcd3d7d0e4b291c273d87, 0x7699795cd020f0e4eaa12b00909f3339),
(12, 12, 48.86, 137.29, 0xd7c10be1124f8521b73f23654842ffb5, 0xac029d12d88bcd3d7d0e4b291c273d87, 0xd7c58aa386c316ea7b464b775ce33295),
(13, 13, 66.27, 129.97, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xd7c58aa386c316ea7b464b775ce33295, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(14, 14, 39.16, 153.33, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xd0b2aad393e17cec326967ddf6a5efca, 0x63c227d37d79890b356936722da1c844),
(15, 15, 37.16, 140.83, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xac029d12d88bcd3d7d0e4b291c273d87, 0x7699795cd020f0e4eaa12b00909f3339),
(16, 16, 76.62, 157.87, 0x47adf6c08a0e15312add40bf4fde79c1, 0xd0b2aad393e17cec326967ddf6a5efca, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(17, 17, 56.87, 178.00, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xd0b2aad393e17cec326967ddf6a5efca, 0x63c227d37d79890b356936722da1c844),
(18, 18, 47.29, 139.93, 0xd7c58aa386c316ea7b464b775ce33295, 0xd7c58aa386c316ea7b464b775ce33295, 0x63c227d37d79890b356936722da1c844),
(19, 19, 62.41, 176.59, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xd7c58aa386c316ea7b464b775ce33295, 0x7699795cd020f0e4eaa12b00909f3339),
(20, 20, 53.35, 145.43, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0x337ce470653b5d679fb0889718ad9d8c, 0x7699795cd020f0e4eaa12b00909f3339),
(21, 21, 67.24, 168.98, 0xd7c10be1124f8521b73f23654842ffb5, 0xd0b2aad393e17cec326967ddf6a5efca, 0x7699795cd020f0e4eaa12b00909f3339),
(22, 22, 66.05, 142.78, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xac029d12d88bcd3d7d0e4b291c273d87, 0x7699795cd020f0e4eaa12b00909f3339),
(23, 23, 71.35, 138.99, 0xd7c58aa386c316ea7b464b775ce33295, 0x337ce470653b5d679fb0889718ad9d8c, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(24, 24, 34.17, 157.80, 0x7c18758c118efba3321a14bd80e2bd7b, 0xd7c58aa386c316ea7b464b775ce33295, 0x7699795cd020f0e4eaa12b00909f3339),
(25, 25, 67.20, 152.91, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0x337ce470653b5d679fb0889718ad9d8c, 0x7699795cd020f0e4eaa12b00909f3339),
(26, 26, 49.28, 150.85, 0x7c18758c118efba3321a14bd80e2bd7b, 0x337ce470653b5d679fb0889718ad9d8c, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(27, 27, 41.59, 156.99, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xac029d12d88bcd3d7d0e4b291c273d87, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(28, 28, 49.03, 173.05, 0xd7c58aa386c316ea7b464b775ce33295, 0xd0b2aad393e17cec326967ddf6a5efca, 0x7699795cd020f0e4eaa12b00909f3339),
(29, 29, 47.33, 165.14, 0x47adf6c08a0e15312add40bf4fde79c1, 0xd0b2aad393e17cec326967ddf6a5efca, 0xd7c58aa386c316ea7b464b775ce33295),
(30, 30, 52.87, 143.66, 0xd7c58aa386c316ea7b464b775ce33295, 0xd0b2aad393e17cec326967ddf6a5efca, 0xd7c58aa386c316ea7b464b775ce33295),
(31, 31, 69.96, 128.50, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xd0b2aad393e17cec326967ddf6a5efca, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(32, 32, 70.63, 136.51, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xd7c58aa386c316ea7b464b775ce33295, 0x63c227d37d79890b356936722da1c844),
(33, 33, 68.81, 129.25, 0x47adf6c08a0e15312add40bf4fde79c1, 0xac029d12d88bcd3d7d0e4b291c273d87, 0x63c227d37d79890b356936722da1c844),
(34, 34, 32.30, 168.21, 0x7c18758c118efba3321a14bd80e2bd7b, 0xac029d12d88bcd3d7d0e4b291c273d87, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(35, 35, 63.73, 140.32, 0xd7c10be1124f8521b73f23654842ffb5, 0x337ce470653b5d679fb0889718ad9d8c, 0x7699795cd020f0e4eaa12b00909f3339),
(36, 36, 46.96, 174.70, 0x47adf6c08a0e15312add40bf4fde79c1, 0x337ce470653b5d679fb0889718ad9d8c, 0x7699795cd020f0e4eaa12b00909f3339),
(37, 37, 46.88, 179.95, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0x337ce470653b5d679fb0889718ad9d8c, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(38, 38, 51.68, 156.17, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xac029d12d88bcd3d7d0e4b291c273d87, 0x7699795cd020f0e4eaa12b00909f3339),
(39, 39, 40.01, 149.37, 0x47adf6c08a0e15312add40bf4fde79c1, 0xd0b2aad393e17cec326967ddf6a5efca, 0x7699795cd020f0e4eaa12b00909f3339),
(40, 40, 74.94, 122.65, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xd0b2aad393e17cec326967ddf6a5efca, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(41, 41, 50.27, 139.63, 0xd7c58aa386c316ea7b464b775ce33295, 0xac029d12d88bcd3d7d0e4b291c273d87, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(42, 42, 79.44, 130.61, 0x47adf6c08a0e15312add40bf4fde79c1, 0x337ce470653b5d679fb0889718ad9d8c, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(43, 43, 73.73, 148.91, 0x47adf6c08a0e15312add40bf4fde79c1, 0x337ce470653b5d679fb0889718ad9d8c, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(44, 44, 52.75, 179.18, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0x337ce470653b5d679fb0889718ad9d8c, 0x7699795cd020f0e4eaa12b00909f3339),
(45, 45, 71.10, 131.16, 0xd7c58aa386c316ea7b464b775ce33295, 0xac029d12d88bcd3d7d0e4b291c273d87, 0x63c227d37d79890b356936722da1c844),
(46, 46, 35.60, 150.95, 0xd7c58aa386c316ea7b464b775ce33295, 0xd0b2aad393e17cec326967ddf6a5efca, 0x63c227d37d79890b356936722da1c844),
(47, 47, 67.14, 139.27, 0x47adf6c08a0e15312add40bf4fde79c1, 0xac029d12d88bcd3d7d0e4b291c273d87, 0xdae2976eb1a7811eccbf6d13e3a04a07),
(48, 48, 44.13, 164.73, 0xd7c10be1124f8521b73f23654842ffb5, 0xac029d12d88bcd3d7d0e4b291c273d87, 0x63c227d37d79890b356936722da1c844),
(49, 49, 64.36, 165.35, 0x0b61574ec1cde7656b2d72f7ea8040f5, 0xd0b2aad393e17cec326967ddf6a5efca, 0x7699795cd020f0e4eaa12b00909f3339),
(50, 50, 60.52, 132.94, 0x47adf6c08a0e15312add40bf4fde79c1, 0xd7c58aa386c316ea7b464b775ce33295, 0x63c227d37d79890b356936722da1c844);

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
(9, 9, '$2y$10$obsl08bkFtUw.9X1he2HEOzAHx.HhsVOh8jprCkp4flWXgI3OtzX.', '2025-11-07 23:59:34', NULL, 0, 0, NULL),
(10, 10, '$2y$10$KPcbmSh.QKYCheMD8ZV7Ge6g5BfV./vCzesYN4xcMlxF/nisI8l8.', '2025-11-08 19:19:28', NULL, 0, 0, NULL),
(11, 62, '$2y$10$Rn9IeiBd.S.a8U2/d8U0XOpsBAf0SKkAm3.hWXS5BTGSkHlve5f6m', '2025-11-10 22:24:54', NULL, 0, 0, NULL);

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

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`PermissionID`, `PermissionCode`, `ModuleName`, `Description`) VALUES
(1, 'view_students', 'Students', 'View student information'),
(2, 'manage_grades', 'Grades', 'Input and edit student grades'),
(3, 'view_schedules', 'Schedules', 'View class schedules'),
(4, 'manage_attendance', 'Attendance', 'Mark student attendance'),
(5, 'create_announcements', 'Announcements', 'Create class announcements'),
(6, 'create_schedule', 'Schedules', 'Create a new class schedule'),
(7, 'edit_schedule', 'Schedule', 'Modify an existing class schedule'),
(8, 'view_student_profiles', 'Students', 'View detailed student profiles'),
(9, 'view_grades', 'Grades', 'View student grades'),
(10, 'submit_grades', 'Grades', 'Submit final grades for approval'),
(11, 'view_attendance', 'Attendance', 'View attendance records'),
(12, 'edit_attendance', 'Attendance', 'Edit attendance records'),
(13, 'view_own_schedule', 'Schedules', 'View personal teaching schedule'),
(14, 'edit_own_schedule', 'Schedules', 'Edit personal teaching schedule'),
(15, 'view_classes', 'Classes', 'View assigned classes'),
(16, 'manage_class_content', 'Classes', 'Manage class materials and content'),
(17, 'view_announcements', 'Announcements', 'View school announcements'),
(18, 'edit_own_announcements', 'Announcements', 'Edit own announcements'),
(19, 'delete_own_announcements', 'Announcements', 'Delete own announcements'),
(20, 'view_reports', 'Reports', 'View student reports'),
(21, 'generate_class_reports', 'Reports', 'Generate reports for assigned classes'),
(22, 'view_own_profile', 'Profile', 'View own teacher profile'),
(23, 'edit_own_profile', 'Profile', 'Edit own teacher profile');

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
  `Gender` enum('Male','Female','','') DEFAULT NULL,
  `BirthDate` date DEFAULT NULL,
  `Age` int(100) DEFAULT NULL,
  `Religion` varchar(100) DEFAULT NULL,
  `MotherTounge` varchar(55) DEFAULT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedAddress` varbinary(512) DEFAULT NULL,
  `ProfilePictureURL` varchar(2048) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`ProfileID`, `UserID`, `FirstName`, `LastName`, `MiddleName`, `Gender`, `BirthDate`, `Age`, `Religion`, `MotherTounge`, `EncryptedPhoneNumber`, `EncryptedAddress`, `ProfilePictureURL`) VALUES
(9, 9, 'Allyana', 'Cabiling', 'G', NULL, '2003-01-15', 22, 'Catholic', NULL, 0x2b283633293931322d3334352d37383930, NULL, 'uploads/profile-pictures/profile_9_1762596512.jpeg'),
(10, 10, 'Mark Kengie', 'Aldabon', NULL, NULL, '2004-11-22', 20, 'Catholic', NULL, 0x2b28363329203931322d3334352d36373839, NULL, 'uploads/profile-pictures/profile_10_1762600929.jpeg'),
(12, 12, 'Carolina', 'Mueller', 'Herman', NULL, NULL, NULL, NULL, NULL, 0xd13c06c16fd9a3311f376e4c914189b1, 0xabd8b8938569b60e158bdf10cab4c4de5a98789b46bf17e01a20a6a18a73dd64544aa53ac421544c4f77ec7f0c100423b84e335d4066f41ee28e40771d8eb051, NULL),
(13, 13, 'Laisha', 'Hahn', 'Bayer', NULL, NULL, NULL, NULL, NULL, 0x77ae837e15fa6c23dd05293e54ec02dd, 0x07cf7c4d5b0315f29f66edcf1e59bee145247e6e8e7047dae2bec3b3007d05b0bab197ccc0295f16de2cc3fbbe0c4389b5bd25006d992415af3fe3289d937e4d, NULL),
(14, 14, 'Skylar', 'Johns', 'Armstrong', NULL, NULL, NULL, NULL, NULL, 0xf3084d596fbc6e4beb18702c64acf279, 0x94c9a3700bfc4bbe69919115ee1f396cbc38dc1a429909c75177242f55bfb1ae0061cb752a2364c72c0f8417c917bb08ee8aeaced1abf779bc0b65db31a7242e, NULL),
(15, 15, 'Eileen', 'Eichmann', 'Heathcote', NULL, NULL, NULL, NULL, NULL, 0x4fc40048c92a44ae86e4b3cf8c5d6f28, 0x8248a93bb6ad2c5dda2259ed9d9c39563b08cdd014160ca3f1ce6521cdd6c08c11c7aeffd2660ff85135747e9c4b126f695cd787b4e2ee7822b5d0c24055e969, NULL),
(16, 16, 'Anika', 'Fritsch', 'Davis', NULL, NULL, NULL, NULL, NULL, 0x611118d0602411166a358f4bfce47389, 0xc8313055849a634108b5d947cc9a8ff427889dd650958dc5636eb4aacdab229a7f057a2b38a9b676f6426bc025eb1eb9, NULL),
(17, 17, 'Alberto', 'Williamson', 'Dibbert', NULL, NULL, NULL, NULL, NULL, 0x5956d6ccfd7292e949761c80216bd42b, 0x718b1144f702faffce22f6080edf9ffc4bf6280bad5137546625dc8eb567d1e8cb652a3dfbda1186e6cb5d3ed47ec9b2, NULL),
(18, 18, 'Meagan', 'Muller', 'Pollich', NULL, NULL, NULL, NULL, NULL, 0xa47d8952f83584025922cdc170f29354, 0xbc7d3e5dab0a9fb2ca9d287a02736898aed35d27945fc9023cfdd189eff320ac65934d80204036763516faf4d2d594ca, NULL),
(19, 19, 'Murl', 'Kub', 'Botsford', NULL, NULL, NULL, NULL, NULL, 0x465ad33aa1d32421eadbb50600bbf669, 0x5959702a3298401736a9ba72c76bfad3066ca8eb0a70b7589e53efafbb34ac2637c7514c68f79224e6c6dfc0ac83c94971d124915a3d44bc17b761186d0eb00e, NULL),
(20, 20, 'Fredrick', 'Carroll', 'Bergstrom', NULL, NULL, NULL, NULL, NULL, 0x448cec2365794e25e829e70d40ca7cc6, 0xd32897530d32f34a86e54439a8274eac0915161efb1dcfbaa8411a7e8bb40b837815a5a2c346982c78c03d4becb1627f, NULL),
(21, 21, 'Layla', 'Langosh', 'Johns', NULL, NULL, NULL, NULL, NULL, 0x92ddc9ff2aa2963259191f11afaaa59c, 0xe50a36aeec05e2f41151617c74b57d13b9aea3b824051e0567bfa4154d7fcdadafa2b38319ee98090bbb2b22d684dfc2d4cabdd8020c441e0897c3281f342c06, NULL),
(22, 22, 'Giovani', 'Gerlach', 'Schowalter', NULL, NULL, NULL, NULL, NULL, 0x4a17b4538fb4c84d38e8b1924ef3bb02, 0x3e011dd69478a6a44013ccc147ebd6a7cabe94bf7045f2cccf266f8daa65f9817d7630ada5facb76ab2a13abe1b1534a, NULL),
(23, 23, 'Carlie', 'Willms', 'Lueilwitz', NULL, NULL, NULL, NULL, NULL, 0x7ec2b7ea0c6448302f6623426f59f09e, 0x8246d01f645c841540aa470ba512456059809040128d8f93b53507841e87189add7586e898183d3aeddc7e4af5f5cadc6c1d6d19ace4cacdf96b824549d4c65f, NULL),
(24, 24, 'Tia', 'Reichel', 'Simonis', NULL, NULL, NULL, NULL, NULL, 0x92defcaf7ba7c80e9208a350a7417198, 0x3d42a63f5213ca36abd662ca465c87813d9ddd910e91c0b56b2a8f42b96e97a358f04d3234dbe86eba3a213a8e73b7d071d124915a3d44bc17b761186d0eb00e, NULL),
(25, 25, 'Gage', 'Kozey', 'Harber', NULL, NULL, NULL, NULL, NULL, 0xe65cc63af53917f7f38e311aa47fadd3, 0xa3802a24255e6822dc35221925de82104debac210a36488083942c35c6913a6f0298b5c2fbb2ac53253322483701d8077b8ed7340c7bf5498ff4f73a3a576b23, NULL),
(26, 26, 'Reggie', 'Lehner', 'Hammes', NULL, NULL, NULL, NULL, NULL, 0xb88ec4ed833d40022aa0d7aa51b2b1bc, 0x5d2fd513b697e1059bb1424a03dab1f65a915d6c888c4a74bf31e7e9bab26e5bab41d6afbfedb0c45d0e47fa4f01a31921db2438d96ea533d8231b9a390249a8, NULL),
(27, 27, 'Cedrick', 'Larkin', 'Runolfsson', NULL, NULL, NULL, NULL, NULL, 0x56d8e05aaf6201d9113c7a553a131281, 0xcd202ebaabc94a5b49bfbc85b625030e16be43508edc0e9c58d263eedea777f6178bc2a17b73576818978e6d42187ae0615033009e3fdcc8c3f44579ae07f788, NULL),
(28, 28, 'Reuben', 'Hodkiewicz', 'Collins', NULL, NULL, NULL, NULL, NULL, 0x24056b8cc4d95582aed2ebc7e6fe729f, 0x0f629a1a18a147e8747e608ba20204331af53a598163153ab55685eec10cb2b1a76f84232c7b8dd8260bbd6f9e7cc3baefaf06eddb6fc276af988affe484f01d, NULL),
(29, 29, 'Jarvis', 'Quitzon', 'Schowalter', NULL, NULL, NULL, NULL, NULL, 0x21553469765e2b2fe738bfcee3463dda, 0xbecb2c703648dc56546d8255abeecf9b21102913c90f69c6812fff0eee63781359208743dd4ae4188fb1e44c4401c8a9, NULL),
(30, 30, 'Harvey', 'Wisoky', 'Ankunding', NULL, NULL, NULL, NULL, NULL, 0xfc9888cd8cfe83c33e9df034a0358310, 0x5511811115da5c7ab193d926e29f4711f3d5979be27f0362deac69b07348194b1d00b174456ed7736fbe89e54dbf3dec0c1e316106981d584fb5c9f7bc638b7b, NULL),
(31, 31, 'Sadie', 'Lakin', 'Bruen', NULL, NULL, NULL, NULL, NULL, 0x0687200cd3b4ee7ce0997fbafbb2d90a, 0x1a3ef91dd3f2fe58c17db72fdda52650b10be44c8cd927324b6bc4fdfeb96790afdf67ba235fa62d1216bd12136f4885, NULL),
(32, 32, 'Aimee', 'Veum', 'Baumbach', NULL, NULL, NULL, NULL, NULL, 0x2772c52b75c43843ad51e830ea9d37a3, 0x9d201327a9901c3123ba11ed8edebee0e34876d400dec528b95fbb352b5b3c8857562aae29821909b7dbb20b8b90b5e3, NULL),
(33, 33, 'Alyson', 'Lebsack', 'Leannon', NULL, NULL, NULL, NULL, NULL, 0x53afee22dd4011ee4d352a8467af8eae, 0x42094d3f3bccfcf4d81a5d1bfe905b9de085629bcf5c531e1ac32a35f03713707415e5de8b7f4f6aa4cf29f6667e1f8c, NULL),
(34, 34, 'Ines', 'Deckow', 'Maggio', NULL, NULL, NULL, NULL, NULL, 0x6ced67a5410523c5f818c1a2cb247f48, 0x0f5c88f4740d5f5e4814d3cbeb775ce46c26c4dd12aa75c2f0cbef2e2796595336f80bf8ea70dae8b6f627077a18f0d518137f6aba0ad5cbf62e434943f7e93f, NULL),
(35, 35, 'Carolina', 'Heller', 'Parker', NULL, NULL, NULL, NULL, NULL, 0x0f08fcf38bfe421200ff02f81f44d5e7, 0x24bec35db79a97f0c457975b9f511cd9240b91898974a65f971641a519a0c5a176f1f8603b2a36c6047a2f6d8517b204b77a07110212b24607e8a056f5c6e22d, NULL),
(36, 36, 'Israel', 'Reilly', 'Breitenberg', NULL, NULL, NULL, NULL, NULL, 0x74e6d2ef9c568ebc52e4050dca93b652, 0xb0eb9d1740f3d84070b26b4e6e08fe2479c64b7604beb4771f3147e9d6998ace5b22e16c7c92b19ba7801ee2f28eb231, NULL),
(37, 37, 'Jan Adrienne', 'Sumido', '', NULL, NULL, NULL, NULL, NULL, 0x2b3633203931322d3334352d36373839, 0x3230204461686c6961204176656e75652c20427267792e2046616972766965772c204e6f76616c69636865732c205175657a6f6e2043697479, NULL),
(38, 38, 'Benjamin', 'Dietrich', 'Conroy', NULL, NULL, NULL, NULL, NULL, 0x0eac7b85e5c2dd789731d4fd99b2373b, 0x16f37d3a8b235f6a668b3b77f1264af4cc3730907c13b74878ce9f7770a57279ecf2ae7dc8d74c176de3ab1e3e80be01de2dd034852fbec9dc979fea24fccc00, NULL),
(39, 39, 'Ryan', 'Prosacco', 'Kuphal', NULL, NULL, NULL, NULL, NULL, 0xb717de9e46e14416293e416006314047, 0xaed498b6165ea159e0815513396e1149cb176265b75ef798f9cb7bec63a47dd0a4edbf5b9e3a040ece1bfa3c766f203c52886faebd8621248ed54f5367303e97, NULL),
(40, 40, 'Ruth', 'Rice', 'Abernathy', NULL, NULL, NULL, NULL, NULL, 0xf7e6ddfbfeb6bf5f40f2ede9b240b448, 0xf40e815be362c37b747f7b71c7dd236b6c1614d89bb543af7fd0c88a45ec72251ce9bcced80bbe05a247b20365e61fffadb64e76941049f9b5704b3bcecbe398, NULL),
(41, 41, 'Layla', 'Littel', 'Nader', NULL, NULL, NULL, NULL, NULL, 0xb6e691ec041a3210de7bf6a5b104a061, 0x73e82b538b5a58286b77cacaa115a57f55dfe53a2da46681881d0788365e37f8815ead99dd9b4b2099875b7a0a84d34efdf9e3b3a2f216d2f8fd6291b5075364, NULL),
(42, 42, 'Ettie', 'Watsica', 'Greenfelder', NULL, NULL, NULL, NULL, NULL, 0x98248a31d1e57486e39eb3817be13ab1, 0xcb9ad0a21ceb01926808dde507a26a880c52aa893e493a22b2ec4a78bad529ba078cbf9bff2e3faabecf47338f424afb3b4c054cd82edd70b0196c908070f638, NULL),
(43, 43, 'Eryn', 'Glover', 'Klein', NULL, NULL, NULL, NULL, NULL, 0xa9fb0f3e2fb38481e07f8f44e62af61c, 0xf51f5821241f45e0c158111f4518880697d5c2147c4305e70cce5ea84a8217b5c9a61d8ddaaafa6d087b77c229d7472c54c4e3f0452b0867f9d7558b36a56d29, NULL),
(44, 44, 'Isai', 'Grant', 'Emmerich', NULL, NULL, NULL, NULL, NULL, 0xc51408b481c6f9c26c0ec0d32c5a86ce, 0x321c8f82b5fbfd21726dc33c6938a930085db880897b4b0985aa30deebd0e07b2bee3c29bd4a6010b7f6b9b598fb5cc5, NULL),
(45, 45, 'Clare', 'Lowe', 'Rolfson', NULL, NULL, NULL, NULL, NULL, 0x65a0d7a1b865715c0c3d678aa2dbc47c, 0x3c9d5ca7e765d1cd37643e0ac91adc0494ce6fd2b50c873ea768ce9fb37c84bac7f0bad8f44468aa016a5d5dfed62fd2, NULL),
(46, 46, 'Nathanael', 'Reinger', 'Mann', NULL, NULL, NULL, NULL, NULL, 0xb029610fb42bcece45e2e84af25b7d9a, 0xab16766c69a029a4fae12f15f07bfd7fcbfc467541a7c9d238eba28902ecdf326c4753ad463a7803ed30f330d7bb041c, NULL),
(47, 47, 'Pat', 'Bartell', 'Labadie', NULL, NULL, NULL, NULL, NULL, 0x9473415c624aee5458138c860d5fb6b8, 0x192646cd5544e9720692cd1ee2fc41cd84325da693f59c49366b544c0937c69188dee44f380f867e23a6e9beb70778f8, NULL),
(48, 48, 'Georgianna', 'Stokes', 'Jerde', NULL, NULL, NULL, NULL, NULL, 0x7c5d9c1ef4173c2b803584859d0b0688, 0xa221fd7f986d0ddcd43b3e5b43119e20ca35743c477b2a10035766118adb5cea22e70d3ba08b23ea49553bf0ab8c38da, NULL),
(49, 49, 'Oren', 'Runte', 'Buckridge', NULL, NULL, NULL, NULL, NULL, 0x63eda1e0ca37f476b38428fa486d644b, 0xd2877d9b0dbd8ebc77f8446357927106d573e2d4237830cf195774d52e79d51ab56199035a259146ce38ca3f341225a00bc1c2e0642a22f79d7bdcf244ccfb4e, NULL),
(50, 50, 'Lupe', 'Christiansen', 'Kihn', NULL, NULL, NULL, NULL, NULL, 0x07441940defaee1870fe53b6a77ec4c0, 0x02edef1c8d26689805cecf61c993961f280493f7de8713115860fb98acea4ce3ed613fdbbfe2a81925bb7b9738b8298b71d124915a3d44bc17b761186d0eb00e, NULL),
(51, 51, 'Martine', 'Bogan', 'Olson', NULL, NULL, NULL, NULL, NULL, 0x44ed45c8aca73b3da2d47b0f16120f2b, 0xc717530ba1ac2258a95b28ea8a3e28de29175bb736e992bf16665f953c0db1aa0751735a7a80ba92cdd107fbbc409f51ebee40da2b1c11477c9129e1e5b7d49b, NULL),
(52, 52, 'America', 'Durgan', 'Leffler', NULL, NULL, NULL, NULL, NULL, 0xb82b7749d495f8282764144f1989ea42, 0xc0a964a066b84c6e0d7f91c2f7d3dda2bf388a98559995b917b050a809f2c8053ff41c786493bc350b1e1746c453d308b73d03886cf7c2de498c126d19c813c5, NULL),
(53, 53, 'Priscilla', 'Durgan', 'Hill', NULL, NULL, NULL, NULL, NULL, 0xc06a0b8c5312388c63581226c873ab66, 0x1b309a07a3ce17f5dfa9b79a97daab8ef3546047ca3681a379db31f847fd67d53c9c17774c008c44ecda5a8725a185d6, NULL),
(54, 54, 'Nash', 'Schuster', 'Rath', NULL, NULL, NULL, NULL, NULL, 0x2c484aa90698a2940ba17ce0c96286bc, 0x77be6f2e10c8953b54f6e7cc5e47a010427ce63a9501fd179bafb4503f37f795d3486b1d55f362c6e722d8e0d0b715a5, NULL),
(55, 55, 'Kendall', 'Beahan', 'Renner', NULL, NULL, NULL, NULL, NULL, 0xeb0c7902f88be35a106b3dce7d0a5533, 0xf68379fabaa63b039333888aaa0f26657a8503b6c7f1cf99c8bfa73be0f485f5e06470156de932fbf97a680f9d00baab9b9bfa6628eb56fcd2b8e0368e40c024, NULL),
(56, 56, 'Berenice', 'Gottlieb', 'Rolfson', NULL, NULL, NULL, NULL, NULL, 0x56f17acd089f5c53cff2b7f78fab8917, 0x5d0a19caeeeaea2f93b024b946343ac338a1f25e85d0087528840047152b0c2384cba5989d3b69b8ad9f4201f910b720, NULL),
(57, 57, 'Janick', 'White', 'Bergnaum', NULL, NULL, NULL, NULL, NULL, 0x94b7c8684eb874ee191a39b215806737, 0x63b732560ff354d344bd2f0b27852d2e1a81f684ce48983502d01b029340bc13547c6835d26530b99325c9d32babdcab5afd19951e4aff1f6f2c71fe76dde24b, NULL),
(58, 58, 'Danielle', 'Carter', 'Wisoky', NULL, NULL, NULL, NULL, NULL, 0x1aee277aac66bf8e0bfa6418722b9f71, 0x24321765b2c5863308b502908f7b0ce7cc461056b81d1a077c3d8c900e3192526769b53dc65b4c1b114ed92ac9e72e2f, NULL),
(59, 59, 'Luisa', 'Renner', 'Conroy', NULL, NULL, NULL, NULL, NULL, 0x1ed31ab6fd5f7cd9c6f3355440a7477d, 0x43ad974248912fed039ff832ca47d16e2eba7b015d061d3ad9f369b8d2966c93db1bdd7f6e2dbf93dbf80e1e37359bb4, NULL),
(60, 60, 'Savannah', 'Eichmann', 'Tremblay', NULL, NULL, NULL, NULL, NULL, 0x8b8b03bbe398bffbde073e103e4bd6c6, 0x3715c451feac941450d635851705071d93ff5478995c2147b4c33afd442e08da0e206879d9164ecd72e2b941ad7f12ed57ddfd417272383cb8bb276fb99cc874, NULL),
(61, 61, 'Noelia', 'Haag', 'Gutkowski', NULL, NULL, NULL, NULL, NULL, 0xbb5beb92a29fd2e4290828ce670c00a9, 0x9ae463fca255e4700fb2077ad10711ab5a740cafb6bbeae189a871a7051cfc49d6e15210873ed210e3f2127dc0101b0ec8ce098965c2a3fe972d9ea407aa8916, NULL),
(62, 62, 'Alexandria', 'Garcia', NULL, NULL, NULL, NULL, NULL, NULL, 0x2b28363329203931322d3334352d36373839, 0x39312056696c6c617265616c204176656e75652c20427267792e2047756c6f642c204e6f76616c69636865732c205175657a6f6e20436974792031313137, NULL);

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

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`RoleID`, `RoleName`, `Description`, `IsActive`) VALUES
(1, 'Teacher', 'Regular teaching staff with limited access', 1),
(2, 'Super Teacher', 'All access including submitting schedules', 1),
(3, 'Assistant Teacher', 'Assisting staff with limited access in system.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `rolepermission`
--

CREATE TABLE `rolepermission` (
  `RolePermissionID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `PermissionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rolepermission`
--

INSERT INTO `rolepermission` (`RolePermissionID`, `RoleID`, `PermissionID`) VALUES
(6, 1, 1),
(4, 1, 2),
(5, 1, 3),
(3, 1, 4),
(2, 1, 5);

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
(2, 'Approved'),
(3, 'Cancelled'),
(1, 'Pending');

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
(1, '2025 - 2026', '2025-08-04', '2026-08-03', 0),
(2, '2024-2025', '2024-08-01', '2025-05-31', 1);

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
  `RoomNumber` varchar(50) DEFAULT NULL,
  `MaxCapacity` int(15) DEFAULT NULL,
  `CurrentEnrollment` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`SectionID`, `GradeLevelID`, `SchoolYearID`, `AdviserTeacherID`, `SectionName`, `RoomNumber`, `MaxCapacity`, `CurrentEnrollment`) VALUES
(2, 2, 2, NULL, 'Lily', NULL, 15, 1),
(4, 2, 2, NULL, 'Daisy', NULL, 15, 0),
(5, 2, 2, NULL, 'Sunflower', NULL, 15, 0),
(6, 3, 2, NULL, 'Rose', NULL, 15, 1),
(7, 3, 2, NULL, 'Lily', NULL, 15, 0),
(8, 3, 2, NULL, 'Tulip', NULL, 15, 0),
(9, 3, 2, NULL, 'Daisy', NULL, 15, 0),
(10, 3, 2, NULL, 'Sunflower', NULL, 15, 0),
(11, 1, 2, NULL, 'Rose', NULL, 15, 0),
(12, 1, 2, NULL, 'Lily', NULL, 15, 1),
(13, 1, 2, NULL, 'Tulip', NULL, 15, 0),
(14, 1, 2, 6, 'Daisy', 'Room 101', 15, 1),
(15, 1, 2, 7, 'Sunflower', NULL, 15, 0),
(16, 6, 2, 6, 'Oxygen', 'Room 601', 15, 2),
(17, 6, 2, NULL, 'Hydrogen', NULL, 15, 1),
(18, 6, 2, NULL, 'Carbon', NULL, 15, 0),
(19, 6, 2, NULL, 'Nitrogen', NULL, 15, 1),
(20, 6, 2, NULL, 'Helium', NULL, 15, 0),
(21, 4, 2, NULL, 'Granite', NULL, 15, 0),
(22, 4, 2, NULL, 'Marble', NULL, 15, 1),
(23, 4, 2, NULL, 'Limestone', NULL, 15, 0),
(24, 4, 2, NULL, 'Sandstone', NULL, 15, 0),
(25, 4, 2, NULL, 'Basalt', NULL, 15, 1),
(26, 3, 2, NULL, 'Rizal', NULL, 15, 0),
(27, 3, 2, NULL, 'Bonifacio', NULL, 15, 0),
(28, 3, 2, NULL, 'Mabini', NULL, 15, 0),
(29, 3, 2, 6, 'Del Pilar', 'Room 301', 15, 1),
(30, 3, 2, NULL, 'Luna', NULL, 15, 0),
(31, 2, 2, 6, 'Tarsier', 'Room 201', 15, 2),
(32, 2, 2, NULL, 'Carabao', NULL, 15, 2),
(33, 2, 2, NULL, 'Tamaraw', NULL, 15, 1),
(34, 2, 2, NULL, 'Philippine Eagle', NULL, 15, 1),
(35, 2, 2, 7, 'Pawikan', NULL, 15, 0),
(36, 5, 2, NULL, 'Cumulus', NULL, 15, 2),
(37, 5, 2, 7, 'Stratus', NULL, 15, 1),
(38, 5, 2, NULL, 'Cirrus', NULL, 15, 3),
(39, 5, 2, NULL, 'Nimbus', NULL, 15, 0),
(40, 5, 2, NULL, 'Altostratus', NULL, 15, 1);

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
(1, 1, 1, 'Father', 1, 1, 1, 1),
(2, 2, 2, 'Mother', 1, 1, 1, 1),
(3, 3, 3, 'Mother', 1, 1, 1, 1),
(4, 4, 4, 'Mother', 1, 1, 1, 1),
(5, 5, 5, 'Guardian', 1, 1, 1, 1),
(6, 6, 6, 'Father', 1, 1, 1, 1),
(7, 7, 7, 'Mother', 1, 1, 1, 1),
(8, 8, 8, 'Guardian', 1, 1, 1, 1),
(9, 9, 9, 'Father', 1, 1, 1, 1),
(10, 10, 10, 'Father', 1, 1, 1, 1),
(11, 11, 11, 'Guardian', 1, 1, 1, 1),
(12, 12, 12, 'Guardian', 1, 1, 1, 1),
(13, 13, 13, 'Guardian', 1, 1, 1, 1),
(14, 14, 14, 'Guardian', 1, 1, 1, 1),
(15, 15, 15, 'Father', 1, 1, 1, 1),
(16, 16, 16, 'Mother', 1, 1, 1, 1),
(17, 17, 17, 'Mother', 1, 1, 1, 1),
(18, 18, 18, 'Mother', 1, 1, 1, 1),
(19, 19, 19, 'Guardian', 1, 1, 1, 1),
(20, 20, 20, 'Mother', 1, 1, 1, 1),
(21, 21, 21, 'Father', 1, 1, 1, 1),
(22, 22, 22, 'Guardian', 1, 1, 1, 1),
(23, 23, 23, 'Guardian', 1, 1, 1, 1),
(24, 24, 24, 'Guardian', 1, 1, 1, 1),
(25, 25, 25, 'Guardian', 1, 1, 1, 1),
(26, 26, 26, 'Mother', 1, 1, 1, 1),
(27, 27, 27, 'Father', 1, 1, 1, 1),
(28, 28, 28, 'Guardian', 1, 1, 1, 1),
(29, 29, 29, 'Mother', 1, 1, 1, 1),
(30, 30, 30, 'Guardian', 1, 1, 1, 1),
(31, 31, 31, 'Father', 1, 1, 1, 1),
(32, 32, 32, 'Mother', 1, 1, 1, 1),
(33, 33, 33, 'Father', 1, 1, 1, 1),
(34, 34, 34, 'Father', 1, 1, 1, 1),
(35, 35, 35, 'Father', 1, 1, 1, 1),
(36, 36, 36, 'Father', 1, 1, 1, 1),
(37, 37, 37, 'Father', 1, 1, 1, 1),
(38, 38, 38, 'Mother', 1, 1, 1, 1),
(39, 39, 39, 'Father', 1, 1, 1, 1),
(40, 40, 40, 'Mother', 1, 1, 1, 1),
(41, 41, 41, 'Guardian', 1, 1, 1, 1),
(42, 42, 42, 'Father', 1, 1, 1, 1),
(43, 43, 43, 'Mother', 1, 1, 1, 1),
(44, 44, 44, 'Father', 1, 1, 1, 1),
(45, 45, 45, 'Guardian', 1, 1, 1, 1),
(46, 46, 46, 'Father', 1, 1, 1, 1),
(47, 47, 47, 'Guardian', 1, 1, 1, 1),
(48, 48, 48, 'Guardian', 1, 1, 1, 1),
(49, 49, 49, 'Guardian', 1, 1, 1, 1),
(50, 50, 50, 'Father', 1, 1, 1, 1);

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
(1, 12, 'STU-2025-00001', 'QR-SHTGRV0661314279', '2017-02-05', 'Male', 'Spanish', 'Enrolled', NULL),
(2, 13, 'STU-2025-00002', 'QR-ADIHJB2338005079', '2013-08-12', 'Male', 'Spanish', 'On Leave', NULL),
(3, 14, 'STU-2025-00003', 'QR-JAAOTN9110532669', '2011-04-27', 'Female', 'Japanese', 'On Leave', NULL),
(4, 15, 'STU-2025-00004', 'QR-JDSGWP2227170592', '2009-12-19', 'Male', 'Korean', 'Enrolled', NULL),
(5, 16, 'STU-2025-00005', 'QR-TYOQHC4791597725', '2011-02-18', 'Male', 'Korean', 'Enrolled', NULL),
(6, 17, 'STU-2025-00006', 'QR-ITSISM1819545781', '2008-11-17', 'Female', 'Filipino', 'On Leave', NULL),
(7, 18, 'STU-2025-00007', 'QR-VMMGPR0698210389', '2011-12-31', 'Male', 'Chinese-Filipino', 'Enrolled', NULL),
(8, 19, 'STU-2025-00008', 'QR-HFGMKL2306428341', '2011-10-05', 'Female', 'Chinese-Filipino', 'Enrolled', NULL),
(9, 20, 'STU-2025-00009', 'QR-OHDPRD5068983352', '2020-10-16', 'Female', 'Spanish', 'Enrolled', NULL),
(10, 21, 'STU-2025-00010', 'QR-OKYEOH1625684069', '2008-09-15', 'Female', 'Filipino', 'Enrolled', NULL),
(11, 22, 'STU-2025-00011', 'QR-XRZBQP3240406769', '2014-09-08', 'Male', 'Korean', 'Enrolled', NULL),
(12, 23, 'STU-2025-00012', 'QR-IWLHBD9286093385', '2015-06-02', 'Female', 'Chinese-Filipino', 'Enrolled', NULL),
(13, 24, 'STU-2025-00013', 'QR-JOUPBF5635893618', '2008-10-14', 'Male', 'Filipino', 'Enrolled', NULL),
(14, 25, 'STU-2025-00014', 'QR-GOZFMR7246931141', '2014-11-18', 'Female', 'Korean', 'On Leave', NULL),
(15, 26, 'STU-2025-00015', 'QR-LYFKMS8106048697', '2010-06-04', 'Male', 'American', 'On Leave', NULL),
(16, 27, 'STU-2025-00016', 'QR-EHUSTB0699724648', '2015-11-03', 'Female', 'Spanish', 'Enrolled', NULL),
(17, 28, 'STU-2025-00017', 'QR-WKFBJN0175906888', '2012-05-10', 'Female', 'Spanish', 'Enrolled', NULL),
(18, 29, 'STU-2025-00018', 'QR-YXPLEV2891969347', '2017-06-06', 'Female', 'Filipino', 'On Leave', NULL),
(19, 30, 'STU-2025-00019', 'QR-SVEKXF7710736097', '2018-11-16', 'Male', 'Spanish', 'Enrolled', NULL),
(20, 31, 'STU-2025-00020', 'QR-FMXBOB4999712552', '2020-08-27', 'Male', 'American', 'On Leave', NULL),
(21, 32, 'STU-2025-00021', 'QR-LEVSMT6767718115', '2014-02-08', 'Female', 'Korean', 'On Leave', NULL),
(22, 33, 'STU-2025-00022', 'QR-ZRCYVR0608934193', '2013-04-02', 'Female', 'American', 'On Leave', NULL),
(23, 34, 'STU-2025-00023', 'QR-LBTSVH7851563848', '2015-09-25', 'Female', 'Korean', 'Enrolled', NULL),
(24, 35, 'STU-2025-00024', 'QR-NWMCQU1313005420', '2019-01-04', 'Female', 'Chinese-Filipino', 'Enrolled', NULL),
(25, 36, 'STU-2025-00025', 'QR-FSBHBM3527862063', '2008-07-20', 'Female', 'Japanese', 'Enrolled', NULL),
(26, 37, 'STU-2025-00100', 'QR-RMUNJZ4635138903', '2001-01-15', 'Male', 'American', 'On Leave', NULL),
(27, 38, 'STU-2025-00027', 'QR-SVNFAE0632295277', '2020-10-05', 'Female', 'Chinese-Filipino', 'Enrolled', NULL),
(28, 39, 'STU-2025-00028', 'QR-UDCGUJ2698882888', '2011-07-08', 'Female', 'Japanese', 'On Leave', NULL),
(29, 40, 'STU-2025-00029', 'QR-AFPNHR5083201276', '2018-12-24', 'Male', 'Korean', 'Enrolled', NULL),
(30, 41, 'STU-2025-00030', 'QR-DFONKX8241989772', '2016-04-19', 'Male', 'Spanish', 'On Leave', NULL),
(31, 42, 'STU-2025-00031', 'QR-WYFDOG7618540345', '2016-01-21', 'Female', 'Japanese', 'Enrolled', NULL),
(32, 43, 'STU-2025-00032', 'QR-BZEFAR0400218024', '2015-03-17', 'Male', 'Japanese', 'Enrolled', NULL),
(33, 44, 'STU-2025-00033', 'QR-JAWGPZ4559273506', '2013-08-14', 'Female', 'Korean', 'Enrolled', NULL),
(34, 45, 'STU-2025-00034', 'QR-ONEWFE6085576358', '2017-02-24', 'Female', 'American', 'Enrolled', NULL),
(35, 46, 'STU-2025-00035', 'QR-FBVDIQ1796153661', '2009-11-30', 'Female', 'Japanese', 'Enrolled', NULL),
(36, 47, 'STU-2025-00036', 'QR-IXYALB6957044478', '2018-12-10', 'Male', 'Japanese', 'Enrolled', NULL),
(37, 48, 'STU-2025-00037', 'QR-JLHDTH6887243276', '2020-02-22', 'Female', 'Filipino', 'Enrolled', NULL),
(38, 49, 'STU-2025-00038', 'QR-CFIFCC5922904745', '2013-11-18', 'Female', 'Spanish', 'On Leave', NULL),
(39, 50, 'STU-2025-00039', 'QR-AWSKUC4774214890', '2019-08-04', 'Female', 'Korean', 'Enrolled', NULL),
(40, 51, 'STU-2025-00040', 'QR-ALGYJL9736347337', '2014-04-15', 'Female', 'Japanese', 'Enrolled', NULL),
(41, 52, 'STU-2025-00041', 'QR-JLDGSW6201439030', '2015-09-20', 'Female', 'Korean', 'Enrolled', NULL),
(42, 53, 'STU-2025-00042', 'QR-ACNKMA4827701271', '2012-01-22', 'Male', 'Spanish', 'Enrolled', NULL),
(43, 54, 'STU-2025-00043', 'QR-HZFUGB4459916112', '2018-10-26', 'Female', 'Filipino', 'Enrolled', NULL),
(44, 55, 'STU-2025-00044', 'QR-BXGYFL0896516859', '2019-03-24', 'Male', 'Korean', 'Enrolled', NULL),
(45, 56, 'STU-2025-00045', 'QR-EPWKAP1676862959', '2018-01-17', 'Male', 'Korean', 'Enrolled', NULL),
(46, 57, 'STU-2025-00046', 'QR-TTDULT6276487169', '2009-08-16', 'Male', 'American', 'Enrolled', NULL),
(47, 58, 'STU-2025-00047', 'QR-QNONQO5203128610', '2009-08-22', 'Male', 'American', 'Enrolled', NULL),
(48, 59, 'STU-2025-00048', 'QR-SZSMIL2693562996', '2008-08-03', 'Female', 'Japanese', 'On Leave', NULL),
(49, 60, 'STU-2025-00049', 'QR-FPMJZX0947518484', '2007-11-28', 'Female', 'Korean', 'Enrolled', NULL),
(50, 61, 'STU-2025-00050', 'QR-RFKFJW6827300656', '2013-07-28', 'Male', 'Chinese-Filipino', 'Enrolled', NULL);

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
(1, 'Science', 'SCI-101', 1, 1),
(2, 'Filipino', 'FIL-102', 1, 1),
(3, 'Mathematics', 'MATH-103', 1, 1),
(4, 'Reading', 'READ-104', 1, 1),
(5, 'Language', 'LANG-105', 1, 1),
(6, 'Makabansa/AP', 'AP-106', 1, 1),
(7, 'GMRC/ESP', 'ESP-107', 1, 1),
(8, 'Science', 'SCI-201', 2, 1),
(9, 'Filipino', 'FIL-202', 2, 1),
(10, 'Mathematics', 'MATH-203', 2, 1),
(11, 'Reading', 'READ-204', 2, 1),
(12, 'Language', 'LANG-205', 2, 1),
(13, 'Makabansa', 'AP-206', 2, 1),
(14, 'GMRC/ESP', 'ESP-207', 2, 1);

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
  `EmployeeNumber` varchar(50) NOT NULL,
  `Specialization` varchar(255) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacherprofile`
--

INSERT INTO `teacherprofile` (`TeacherProfileID`, `ProfileID`, `EmployeeNumber`, `Specialization`, `HireDate`) VALUES
(6, 9, 'TEACH-2025-001', 'English', '2003-01-15'),
(7, 10, 'TEACH-2025-002', 'Filipino', '2025-08-01'),
(8, 62, 'TEACH-2025-003', 'English', '2005-01-15');

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
  `TransactionStatus` enum('Paid','Unpaid','Partially Paid','Overdue') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(9, 'markkengiealdabon@gmail.com', 'Teacher', 'Active', NULL, '2025-11-07 23:59:34', '2025-11-24 22:02:11', 0, NULL),
(10, 'aldabon.mark.kengie@gymnazo.edu.ph', 'Teacher', 'Active', NULL, '2025-11-08 19:19:28', '2025-11-08 19:19:28', 0, NULL),
(12, 'carolina.mueller5027@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(13, 'laisha.hahn185@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(14, 'skylar.johns7479@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(15, 'eileen.eichmann6427@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(16, 'anika.fritsch1157@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(17, 'alberto.williamson9838@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(18, 'meagan.muller933@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(19, 'murl.kub8900@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(20, 'fredrick.carroll5469@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(21, 'layla.langosh5576@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(22, 'giovani.gerlach8200@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(23, 'carlie.willms3942@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(24, 'tia.reichel298@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:05', '2025-11-10 20:44:05', 0, NULL),
(25, 'gage.kozey5244@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(26, 'reggie.lehner9601@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(27, 'cedrick.larkin3790@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(28, 'reuben.hodkiewicz1871@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(29, 'jarvis.quitzon8440@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(30, 'harvey.wisoky4557@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(31, 'sadie.lakin3465@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(32, 'aimee.veum325@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(33, 'alyson.lebsack6275@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(34, 'ines.deckow3939@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(35, 'carolina.heller9570@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(36, 'israel.reilly9725@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(37, 'lisette.harvey6102@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(38, 'benjamin.dietrich1119@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(39, 'ryan.prosacco5475@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(40, 'ruth.rice5843@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(41, 'layla.littel8475@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(42, 'ettie.watsica3093@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(43, 'eryn.glover3200@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(44, 'isai.grant595@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(45, 'clare.lowe8513@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(46, 'nathanael.reinger5802@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(47, 'pat.bartell7386@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(48, 'georgianna.stokes3145@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(49, 'oren.runte901@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(50, 'lupe.christiansen97@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(51, 'martine.bogan6767@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(52, 'america.durgan6887@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(53, 'priscilla.durgan8835@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(54, 'nash.schuster5122@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(55, 'kendall.beahan1246@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(56, 'berenice.gottlieb9267@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(57, 'janick.white6811@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(58, 'danielle.carter7806@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(59, 'luisa.renner8066@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(60, 'savannah.eichmann5442@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(61, 'noelia.haag315@student.gymnazo.edu.ph', 'Student', 'Active', NULL, '2025-11-10 20:44:06', '2025-11-10 20:44:06', 0, NULL),
(62, 'garcia.alexandria@gymnazo.edu.ph', 'Teacher', 'Active', NULL, '2025-11-10 22:24:54', '2025-11-10 22:24:54', 0, NULL);

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
(7, 9, 2, '2025-11-07 23:59:34', NULL, NULL),
(8, 10, 2, '2025-11-08 19:19:28', NULL, NULL),
(9, 62, 1, '2025-11-10 22:24:54', NULL, NULL);

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

--
-- Dumping data for table `usersettings`
--

INSERT INTO `usersettings` (`SettingsID`, `UserID`, `Theme`, `AccentColor`, `NotificationPreferences`, `TwoFactorEnabled`) VALUES
(2, 9, 'light', '#22c55e', NULL, 0);

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
  ADD KEY `idx_transaction_student` (`StudentProfileID`);

--
-- Indexes for table `transactionitem`
--
ALTER TABLE `transactionitem`
  ADD PRIMARY KEY (`ItemID`),
  ADD KEY `fk_TransactionItem_Transaction` (`TransactionID`),
  ADD KEY `fk_TransactionItem_ItemType` (`ItemTypeID`);

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

-- ADD NEW Column in section table
ALTER TABLE section
ADD COLUMN ClassShift ENUM ('Morning', 'Afternoon');

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `AttendanceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `attendancemethod`
--
ALTER TABLE `attendancemethod`
  MODIFY `MethodID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `AuditID` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classschedule`
--
ALTER TABLE `classschedule`
  MODIFY `ScheduleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `GradeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `gradelevel`
--
ALTER TABLE `gradelevel`
  MODIFY `GradeLevelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `gradestatus`
--
ALTER TABLE `gradestatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guardian`
--
ALTER TABLE `guardian`
  MODIFY `GuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `itemtype`
--
ALTER TABLE `itemtype`
  MODIFY `ItemTypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicalinfo`
--
ALTER TABLE `medicalinfo`
  MODIFY `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

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
-- AUTO_INCREMENT for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  MODIFY `PolicyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  MODIFY `PaymentMethodID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `PermissionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `requirementtype`
--
ALTER TABLE `requirementtype`
  MODIFY `RequirementTypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `RoleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rolepermission`
--
ALTER TABLE `rolepermission`
  MODIFY `RolePermissionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `schedulestatus`
--
ALTER TABLE `schedulestatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `schoolyear`
--
ALTER TABLE `schoolyear`
  MODIFY `SchoolYearID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `SectionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `securefile`
--
ALTER TABLE `securefile`
  MODIFY `FileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `studentguardian`
--
ALTER TABLE `studentguardian`
  MODIFY `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `studentprofile`
--
ALTER TABLE `studentprofile`
  MODIFY `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `SubjectID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `supportticket`
--
ALTER TABLE `supportticket`
  MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  MODIFY `TeacherProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactionitem`
--
ALTER TABLE `transactionitem`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `userrole`
--
ALTER TABLE `userrole`
  MODIFY `UserRoleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `usersettings`
--
ALTER TABLE `usersettings`
  MODIFY `SettingsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  ADD CONSTRAINT `fk_Grade_Status` FOREIGN KEY (`GradeStatusID`) REFERENCES `gradestatus` (`StatusID`) ON DELETE SET NULL;

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
  ADD CONSTRAINT `fk_Transaction_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`);

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
