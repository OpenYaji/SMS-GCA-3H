-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2025 at 06:04 PM
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
-- Database: `db_latest_gca`
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

--
-- Dumping data for table `academicstandinglevel`
--

INSERT INTO `academicstandinglevel` (`StandingLevelID`, `LevelName`, `MinAverage`, `SortOrder`) VALUES
(1, 'Outstanding', 95.00, 1),
(2, 'Very Satisfactory', 90.00, 2),
(3, 'Satisfactory', 85.00, 3);

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

--
-- Dumping data for table `announcement`
--

INSERT INTO `announcement` (`AnnouncementID`, `AuthorUserID`, `Title`, `Content`, `Summary`, `Category`, `BannerURL`, `PublishDate`, `ExpiryDate`, `TargetAudience`, `IsPinned`, `IsActive`) VALUES
(1, 1001, 'Welcome to School Year 2025-2026!', 'We warmly welcome all students, parents, and staff to the new school year 2025-2026. May this year be filled with learning, growth, and achievements! Our theme for this year is \"Excellence in Education, Character in Action.\"\n\nWe have exciting programs lined up including:\n- Enhanced MATATAG Curriculum implementation\n- New computer laboratory facilities\n- Extracurricular activities and clubs\n- Parent-teacher collaboration programs\n\nLet us work together to make this the best school year yet!', 'Welcome message for SY 2025-2026', 'General', NULL, '2025-06-01 08:00:00', '2026-05-31 23:59:59', 'All Users', 1, 1),
(2, 1001, 'First Quarter Grades Released', 'The grades for the First Quarter have been released. Parents and students can now view academic performance through the student portal.\n\nTo access your grades:\n1. Log in to the student portal\n2. Navigate to the Grades section\n3. Select \"Current School Year\"\n\nIf you have any questions about the grades, please contact your class adviser or visit the Registrar\'s Office during office hours (8:00 AM - 5:00 PM, Monday to Friday).', 'Q1 grades now available in the portal', 'Academic', NULL, '2025-09-15 14:00:00', '2025-10-15 23:59:59', 'All Users', 1, 1),
(3, 1001, 'Payment Deadline Reminder', 'This is a reminder that the payment deadline for the second installment is November 30, 2025.\n\nPayment Options:\n- Cash payment at the Finance Office\n- Bank Transfer (BDO, BPI, Metrobank)\n- GCash (09XX-XXX-XXXX)\n- PayMaya\n\nPlease settle your accounts on time to avoid late fees of 5% per month. For payment concerns or arrangements, please contact the Finance Office at finance@gca.edu.ph or call (02) 8XXX-XXXX.', 'Payment deadline: Nov 30, 2025', 'General', NULL, '2025-11-15 09:00:00', '2025-11-30 23:59:59', 'Parents', 1, 1),
(4, 1001, 'Christmas Break Schedule', 'Please be informed of our Christmas Break schedule:\n\nLast day of classes: December 20, 2025\nChristmas Vacation: December 21, 2025 - January 5, 2026\nClasses Resume: January 6, 2026\n\nThe school will be closed during the Christmas break. Emergency concerns may be directed to the school hotline.\n\nWishing everyone a Merry Christmas and a Happy New Year!', 'Christmas break: Dec 21 - Jan 5', 'General', NULL, '2025-12-01 08:00:00', '2026-01-05 23:59:59', 'All Users', 0, 1),
(5, 1001, 'Parent-Teacher Conference - Second Quarter', 'The Second Quarter Parent-Teacher Conference is scheduled for November 23, 2025 (Saturday) from 8:00 AM to 5:00 PM.\n\nPlease coordinate with your child\'s adviser to schedule a meeting slot. This is a great opportunity to:\n- Discuss your child\'s academic progress\n- Address any concerns\n- Partner for your child\'s success\n\nAttendance is highly encouraged. See you there!', 'PTC on Nov 23, 2025', 'Events', NULL, '2025-11-10 08:00:00', '2025-11-23 23:59:59', 'Parents', 0, 1);

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
(1, 2001, 7, 3, 'New', 'Pending', '2025-04-15 10:00:00', '2025-04-20 14:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(2, 2002, 7, 3, 'New', '', '2025-04-18 11:30:00', '2025-04-22 15:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(3, 2003, 7, 4, 'Old', '', '2025-04-10 09:00:00', '2025-04-15 10:00:00', 'Gymnazo Christian Academy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(4, 2004, 7, 4, 'Old', '', '2025-04-12 14:00:00', '2025-04-17 11:00:00', 'Gymnazo Christian Academy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(5, 2005, 7, 5, 'Old', 'For Review', '2025-04-08 10:30:00', '2025-04-13 14:30:00', 'Gymnazo Christian Academy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(6, 2006, 7, 5, 'Old', 'For Review', '2025-04-09 13:00:00', '2025-04-14 09:30:00', 'Gymnazo Christian Academy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(7, 2007, 7, 6, 'Old', 'Enrolled', '2025-04-05 11:00:00', '2025-04-10 16:00:00', 'Gymnazo Christian Academy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(8, 2008, 7, 6, 'Old', 'Enrolled', '2025-04-06 15:30:00', '2025-04-11 10:30:00', 'Gymnazo Christian Academy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(9, 2009, 7, 7, 'Old', 'Approved', '2025-04-03 09:30:00', '2025-04-08 13:00:00', 'Gymnazo Christian Academy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(10, 2010, 7, 7, 'Old', 'Approved', '2025-04-04 14:00:00', '2025-04-09 11:00:00', 'Gymnazo Christian Academy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(11, 2011, 7, 8, 'Old', 'Approved', '2025-04-01 08:00:00', '2025-04-05 10:00:00', 'Gymnazo Christian Academy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(12, 2012, 7, 8, 'Old', 'Approved', '2025-04-02 12:00:00', '2025-04-07 15:00:00', 'Gymnazo Christian Academy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1001),
(16, NULL, 7, 6, 'New', 'Approved', '2025-11-22 18:45:13', NULL, '', 'Haaa', 'Haa', 'Ahaha', '2018-11-11', 'Male', '21, AHAHA, HAHA, HAHAHA ,HA', '09123456789', 'johnreybisnarcalipes@gmail.com', 'Aaaaaa', 'Aa', 'father', '09123456789', 'johnreybisnarcalipes@gmail.com', 'GCA-2025-51186', 1, NULL),
(17, NULL, 7, 3, 'New', 'For Review', '2025-11-22 19:52:58', NULL, '', 'Jan', 'Cali', 'Rei', '2018-10-08', 'Male', 'Haha street , hahahah', '09123456789', 'johnreypj143@gmail.com', 'Haha', 'hahaha', 'Mother', '09551355073', 'johnreypj143@gmail.com', 'GCA-2025-23171', 1, NULL),
(18, NULL, 7, 3, 'New', 'For Review', '2025-11-24 00:33:35', NULL, '', 'John', 'Fuentes', 'heaven', '2018-08-11', 'Male', '21 qc, bgc, nova sm haha', '09123456789', 'johnreybisnarcalipes@gmail.com', 'Mark', 'Fuentes', 'Mother', '09123456789', 'oliveros.sergeedward.pelitro@gmail.com', 'GCA-2025-58394', 1, NULL),
(20, NULL, 7, 3, 'New', 'Enrolled', '2025-11-24 00:33:35', NULL, '', 'ewqsa', 'Fuentes', 'heaven', '2018-08-11', 'Male', '21 qc, bgc, nova sm haha', '09123456789', 'johnreybisnarcalipes@gmail.com', 'Mark', 'Fuentes', 'Mother', '09123456789', 'oliveros.sergeedward.pelitro@gmail.com', 'GCA-2025-58395', 1, NULL),
(21, NULL, 7, 3, 'Old', 'For Review', '2025-11-27 01:24:38', NULL, '', 'erqw', 'ewqewq', 'ewqsd', '2017-11-19', 'Male', 'dasjdiwqjiwqdpwq', '09564230159', 'tranilla.heavengibson.ybanez@gmail.com', 'ewqjeiwq', 'jiewqji', 'mother', '09876543212', 'tranilla.heavengibson.ybanez@gmail.com', 'GCA-2025-52803', 1, NULL);

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
(1, 1, 7, 45, 50, '2025-11-22 18:25:25'),
(2, 2, 7, 48, 50, '2025-11-22 18:25:25'),
(3, 3, 7, 47, 50, '2025-11-22 18:25:25'),
(4, 4, 7, 50, 50, '2025-11-22 18:25:25'),
(5, 5, 7, 46, 50, '2025-11-22 18:25:25'),
(6, 6, 7, 49, 50, '2025-11-22 18:25:25'),
(7, 7, 7, 48, 50, '2025-11-22 18:25:25'),
(8, 8, 7, 50, 50, '2025-11-22 18:25:25'),
(9, 9, 7, 47, 50, '2025-11-22 18:25:25'),
(10, 10, 7, 50, 50, '2025-11-22 18:25:25'),
(11, 11, 7, 49, 50, '2025-11-22 18:25:25'),
(12, 12, 7, 48, 50, '2025-11-22 18:25:25'),
(13, 13, 7, 0, 0, '2025-11-27 03:36:30');

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

--
-- Dumping data for table `classschedule`
--

INSERT INTO `classschedule` (`ScheduleID`, `SectionID`, `SubjectID`, `TeacherProfileID`, `DayOfWeek`, `StartTime`, `EndTime`, `ScheduleStatusID`, `RoomNumber`) VALUES
(43, 6, 47, 1, 'Monday', '08:00:00', '09:00:00', NULL, 'Room 101'),
(44, 6, 47, 1, 'Wednesday', '08:00:00', '09:00:00', NULL, 'Room 101'),
(45, 6, 47, 1, 'Friday', '08:00:00', '09:00:00', NULL, 'Room 101'),
(46, 6, 46, 3, 'Tuesday', '08:00:00', '09:00:00', NULL, 'Room 102'),
(47, 6, 46, 3, 'Thursday', '08:00:00', '09:00:00', NULL, 'Room 102'),
(48, 6, 46, 3, 'Friday', '09:00:00', '10:00:00', NULL, 'Room 102'),
(49, 6, 48, 2, 'Monday', '09:00:00', '10:00:00', NULL, 'Room 103'),
(50, 6, 48, 2, 'Tuesday', '09:00:00', '10:00:00', NULL, 'Room 103'),
(51, 6, 48, 4, 'Wednesday', '09:00:00', '10:00:00', NULL, 'Room 103'),
(52, 6, 48, 4, 'Thursday', '09:00:00', '10:00:00', NULL, 'Room 103'),
(53, 6, 49, 6, 'Tuesday', '10:00:00', '11:00:00', NULL, 'Room 201'),
(54, 6, 49, 6, 'Thursday', '10:00:00', '11:00:00', NULL, 'Room 201'),
(55, 6, 50, 6, 'Wednesday', '10:00:00', '11:00:00', NULL, 'Room 201'),
(56, 6, 50, 6, 'Friday', '10:00:00', '11:00:00', NULL, 'Room 201'),
(57, 6, 51, 6, 'Monday', '13:00:00', '14:00:00', NULL, 'Music Room'),
(58, 6, 51, 6, 'Wednesday', '13:00:00', '14:00:00', NULL, 'Music Room'),
(59, 6, 52, 6, 'Tuesday', '13:00:00', '14:00:00', NULL, 'Art Room'),
(60, 6, 52, 6, 'Thursday', '13:00:00', '14:00:00', NULL, 'Art Room'),
(61, 6, 53, 6, 'Monday', '14:00:00', '15:30:00', NULL, 'Gym'),
(62, 6, 53, 6, 'Friday', '14:00:00', '15:30:00', NULL, 'Gym'),
(63, 6, 54, 5, 'Wednesday', '14:00:00', '15:00:00', NULL, 'Room 202'),
(64, 6, 54, 5, 'Thursday', '14:00:00', '15:00:00', NULL, 'Room 202');

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

--
-- Dumping data for table `discounttype`
--

INSERT INTO `discounttype` (`DiscountTypeID`, `TypeName`, `IsActive`) VALUES
(1, 'Sibling Discount', 1),
(2, 'Early Payment', 1),
(3, 'Scholarship', 1);

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
(1, 1, 'Roberto Martinez Santos', 0x3039313731323334353637),
(2, 2, 'Antonio Reyes Garcia', 0x3039313831323334353638),
(3, 3, 'Jose Cruz Lopez', 0x3039313931323334353639),
(4, 4, 'Rafael Gonzales Ramos', 0x3039323031323334353730),
(5, 5, 'Luis Torres Mendoza', 0x3039323131323334353731),
(6, 6, 'Miguel Santos Dela Cruz', 0x3039323231323334353732),
(7, 7, 'Jose Villanueva Navarro', 0x3039323331323334353733),
(8, 8, 'Daniel Bautista Castro', 0x3039323431323334353734),
(9, 9, 'Emmanuel Fernandez Rosales', 0x3039323531323334353735),
(10, 10, 'Carlos Aguirre Pascual', 0x3039323631323334353736),
(11, 11, 'James Santiago Morales', 0x3039323731323334353737),
(12, 12, 'Ricardo Castillo Rivera', 0x3039323831323334353738),
(13, 13, 'Mark Fuentes', 0x3039313233343536373839);

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
(1, 1, 1, 7, '2025-06-01'),
(2, 2, 1, 7, '2025-06-01'),
(3, 3, 2, 7, '2025-06-01'),
(4, 4, 2, 7, '2025-06-01'),
(5, 5, 3, 7, '2025-06-01'),
(6, 6, 3, 7, '2025-06-01'),
(7, 7, 4, 7, '2025-06-01'),
(8, 8, 4, 7, '2025-06-01'),
(9, 9, 5, 7, '2025-06-01'),
(10, 10, 5, 7, '2025-06-01'),
(11, 11, 6, 7, '2025-06-01'),
(12, 12, 6, 7, '2025-06-01'),
(101, 11, 101, 2, '2020-06-01'),
(102, 11, 102, 3, '2021-06-01'),
(103, 11, 103, 4, '2022-06-01'),
(104, 11, 104, 5, '2023-06-01'),
(105, 11, 105, 6, '2024-06-01'),
(112, 13, 5, 7, '2025-11-27');

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
(1001, 101, 1, 'First Quarter', 88.00, 'Good performance', NULL, '2020-08-30 14:00:00', 1001),
(1002, 101, 2, 'First Quarter', 85.00, 'Good performance', NULL, '2020-08-30 14:00:00', 1001),
(1003, 101, 3, 'First Quarter', 90.00, 'Excellent', NULL, '2020-08-30 14:00:00', 1001),
(1004, 101, 4, 'First Quarter', 87.00, 'Good performance', NULL, '2020-08-30 14:00:00', 1001),
(1005, 101, 5, 'First Quarter', 92.00, 'Excellent', NULL, '2020-08-30 14:00:00', 1001),
(1006, 101, 6, 'First Quarter', 89.00, 'Good performance', NULL, '2020-08-30 14:00:00', 1001),
(1007, 101, 7, 'First Quarter', 91.00, 'Excellent', NULL, '2020-08-30 14:00:00', 1001),
(1008, 101, 8, 'First Quarter', 86.00, 'Good performance', NULL, '2020-08-30 14:00:00', 1001),
(1009, 101, 9, 'First Quarter', 88.00, 'Good performance', NULL, '2020-08-30 14:00:00', 1001),
(1010, 101, 1, 'Second Quarter', 89.00, 'Improved', NULL, '2020-11-15 14:00:00', 1001),
(1011, 101, 2, 'Second Quarter', 87.00, 'Good progress', NULL, '2020-11-15 14:00:00', 1001),
(1012, 101, 3, 'Second Quarter', 91.00, 'Excellent', NULL, '2020-11-15 14:00:00', 1001),
(1013, 101, 4, 'Second Quarter', 88.00, 'Good performance', NULL, '2020-11-15 14:00:00', 1001),
(1014, 101, 5, 'Second Quarter', 93.00, 'Outstanding', NULL, '2020-11-15 14:00:00', 1001),
(1015, 101, 6, 'Second Quarter', 90.00, 'Excellent', NULL, '2020-11-15 14:00:00', 1001),
(1016, 101, 7, 'Second Quarter', 92.00, 'Excellent', NULL, '2020-11-15 14:00:00', 1001),
(1017, 101, 8, 'Second Quarter', 87.00, 'Good performance', NULL, '2020-11-15 14:00:00', 1001),
(1018, 101, 9, 'Second Quarter', 89.00, 'Good performance', NULL, '2020-11-15 14:00:00', 1001),
(1019, 101, 1, 'Third Quarter', 90.00, 'Consistent improvement', NULL, '2021-01-30 14:00:00', 1001),
(1020, 101, 2, 'Third Quarter', 88.00, 'Good progress', NULL, '2021-01-30 14:00:00', 1001),
(1021, 101, 3, 'Third Quarter', 92.00, 'Outstanding', NULL, '2021-01-30 14:00:00', 1001),
(1022, 101, 4, 'Third Quarter', 89.00, 'Good performance', NULL, '2021-01-30 14:00:00', 1001),
(1023, 101, 5, 'Third Quarter', 94.00, 'Outstanding', NULL, '2021-01-30 14:00:00', 1001),
(1024, 101, 6, 'Third Quarter', 91.00, 'Excellent', NULL, '2021-01-30 14:00:00', 1001),
(1025, 101, 7, 'Third Quarter', 93.00, 'Outstanding', NULL, '2021-01-30 14:00:00', 1001),
(1026, 101, 8, 'Third Quarter', 88.00, 'Good performance', NULL, '2021-01-30 14:00:00', 1001),
(1027, 101, 9, 'Third Quarter', 90.00, 'Excellent', NULL, '2021-01-30 14:00:00', 1001),
(1028, 101, 1, 'Fourth Quarter', 91.00, 'Excellent year-end', NULL, '2021-03-25 14:00:00', 1001),
(1029, 101, 2, 'Fourth Quarter', 89.00, 'Strong finish', NULL, '2021-03-25 14:00:00', 1001),
(1030, 101, 3, 'Fourth Quarter', 93.00, 'Outstanding', NULL, '2021-03-25 14:00:00', 1001),
(1031, 101, 4, 'Fourth Quarter', 90.00, 'Excellent', NULL, '2021-03-25 14:00:00', 1001),
(1032, 101, 5, 'Fourth Quarter', 95.00, 'Outstanding', NULL, '2021-03-25 14:00:00', 1001),
(1033, 101, 6, 'Fourth Quarter', 92.00, 'Excellent', NULL, '2021-03-25 14:00:00', 1001),
(1034, 101, 7, 'Fourth Quarter', 94.00, 'Outstanding', NULL, '2021-03-25 14:00:00', 1001),
(1035, 101, 8, 'Fourth Quarter', 89.00, 'Good performance', NULL, '2021-03-25 14:00:00', 1001),
(1036, 101, 9, 'Fourth Quarter', 91.00, 'Excellent', NULL, '2021-03-25 14:00:00', 1001),
(6001, 1, 1, 'First Quarter', 85.00, 'Good start', NULL, '2025-08-30 14:00:00', 1001),
(6002, 1, 2, 'First Quarter', 83.00, 'Needs improvement', NULL, '2025-08-30 14:00:00', 1001),
(6003, 1, 3, 'First Quarter', 88.00, 'Good in Math', NULL, '2025-08-30 14:00:00', 1001),
(6004, 1, 4, 'First Quarter', 86.00, 'Good', NULL, '2025-08-30 14:00:00', 1001),
(6005, 1, 5, 'First Quarter', 90.00, 'Excellent values', NULL, '2025-08-30 14:00:00', 1001),
(6006, 1, 6, 'First Quarter', 87.00, 'Musical talent', NULL, '2025-08-30 14:00:00', 1001),
(6007, 1, 7, 'First Quarter', 89.00, 'Creative', NULL, '2025-08-30 14:00:00', 1001),
(6008, 1, 8, 'First Quarter', 84.00, 'Active', NULL, '2025-08-30 14:00:00', 1001),
(6009, 1, 9, 'First Quarter', 86.00, 'Good', NULL, '2025-08-30 14:00:00', 1001),
(6019, 3, 10, 'First Quarter', 87.00, 'Good', NULL, '2025-08-30 14:00:00', 1002),
(6020, 3, 11, 'First Quarter', 85.00, 'Satisfactory', NULL, '2025-08-30 14:00:00', 1002),
(6021, 3, 12, 'First Quarter', 89.00, 'Good in Math', NULL, '2025-08-30 14:00:00', 1002),
(6022, 3, 13, 'First Quarter', 88.00, 'Good', NULL, '2025-08-30 14:00:00', 1002),
(6023, 3, 14, 'First Quarter', 91.00, 'Excellent', NULL, '2025-08-30 14:00:00', 1002),
(6024, 3, 15, 'First Quarter', 90.00, 'Excellent', NULL, '2025-08-30 14:00:00', 1002),
(6025, 3, 16, 'First Quarter', 88.00, 'Good', NULL, '2025-08-30 14:00:00', 1002),
(6026, 3, 17, 'First Quarter', 86.00, 'Active', NULL, '2025-08-30 14:00:00', 1002),
(6027, 3, 18, 'First Quarter', 87.00, 'Good', NULL, '2025-08-30 14:00:00', 1002),
(6028, 4, 10, 'First Quarter', 93.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1002),
(6029, 4, 11, 'First Quarter', 92.00, 'Excellent', NULL, '2025-08-30 14:00:00', 1002),
(6030, 4, 12, 'First Quarter', 91.00, 'Excellent', NULL, '2025-08-30 14:00:00', 1002),
(6031, 4, 13, 'First Quarter', 94.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1002),
(6032, 4, 14, 'First Quarter', 96.00, 'Exemplary', NULL, '2025-08-30 14:00:00', 1002),
(6033, 4, 15, 'First Quarter', 93.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1002),
(6034, 4, 16, 'First Quarter', 95.00, 'Very creative', NULL, '2025-08-30 14:00:00', 1002),
(6035, 4, 17, 'First Quarter', 92.00, 'Excellent', NULL, '2025-08-30 14:00:00', 1002),
(6036, 4, 18, 'First Quarter', 93.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1002),
(6091, 11, 46, 'First Quarter', 93.00, 'Consistent excellence', NULL, '2025-08-30 14:00:00', 1006),
(6092, 11, 47, 'First Quarter', 91.00, 'Strong performance', NULL, '2025-08-30 14:00:00', 1006),
(6093, 11, 48, 'First Quarter', 95.00, 'Outstanding in Math', NULL, '2025-08-30 14:00:00', 1006),
(6094, 11, 49, 'First Quarter', 92.00, 'Excellent', NULL, '2025-08-30 14:00:00', 1006),
(6095, 11, 50, 'First Quarter', 97.00, 'Exemplary values', NULL, '2025-08-30 14:00:00', 1006),
(6096, 11, 51, 'First Quarter', 94.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1006),
(6097, 11, 52, 'First Quarter', 96.00, 'Very creative', NULL, '2025-08-30 14:00:00', 1006),
(6098, 11, 53, 'First Quarter', 91.00, 'Excellent', NULL, '2025-08-30 14:00:00', 1006),
(6099, 11, 54, 'First Quarter', 93.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1006),
(6100, 12, 46, 'First Quarter', 94.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1006),
(6101, 12, 47, 'First Quarter', 92.00, 'Excellent', NULL, '2025-08-30 14:00:00', 1006),
(6102, 12, 48, 'First Quarter', 91.00, 'Excellent', NULL, '2025-08-30 14:00:00', 1006),
(6103, 12, 49, 'First Quarter', 95.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1006),
(6104, 12, 50, 'First Quarter', 96.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1006),
(6105, 12, 51, 'First Quarter', 93.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1006),
(6106, 12, 52, 'First Quarter', 95.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1006),
(6107, 12, 53, 'First Quarter', 92.00, 'Excellent', NULL, '2025-08-30 14:00:00', 1006),
(6108, 12, 54, 'First Quarter', 94.00, 'Outstanding', NULL, '2025-08-30 14:00:00', 1006);

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
(1, 'Draft'),
(3, 'Final'),
(4, 'Revised'),
(2, 'Submitted');

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
(1, 'Roberto Martinez Santos', NULL, NULL, 'Engineer', 'Makati City'),
(2, 'Maria Clara Santos Martinez', NULL, NULL, 'Teacher', 'Quezon City'),
(3, 'Antonio Reyes Garcia', NULL, NULL, 'Business Owner', 'Caloocan City'),
(4, 'Elena Garcia Reyes', NULL, NULL, 'Accountant', 'Quezon City'),
(5, 'Jose Cruz Lopez', NULL, NULL, 'Nurse', 'Manila'),
(6, 'Carmen Lopez Cruz', NULL, NULL, 'Sales Manager', 'Makati City'),
(7, 'Rafael Gonzales Ramos', NULL, NULL, 'IT Manager', 'Ortigas, Pasig City'),
(8, 'Ana Ramos Gonzales', NULL, NULL, 'Pharmacist', 'Quezon City'),
(9, 'Luis Torres Mendoza', NULL, NULL, 'Architect', 'BGC, Taguig City'),
(10, 'Maria Mendoza Torres', NULL, NULL, 'Interior Designer', 'Makati City'),
(11, 'Miguel Santos Dela Cruz', NULL, NULL, 'Doctor', 'Veterans Memorial Medical Center, QC'),
(12, 'Jennifer Dela Cruz Santos', NULL, NULL, 'Lawyer', 'Makati City'),
(13, 'Jose Villanueva Navarro', NULL, NULL, 'Bank Manager', 'Makati City'),
(14, 'Rosa Navarro Villanueva', NULL, NULL, 'HR Director', 'Ortigas, Pasig City'),
(15, 'Daniel Bautista Castro', NULL, NULL, 'Software Developer', 'BGC, Taguig City'),
(16, 'Grace Castro Bautista', NULL, NULL, 'Marketing Manager', 'Makati City'),
(17, 'Emmanuel Fernandez Rosales', NULL, NULL, 'Civil Engineer', 'Quezon City'),
(18, 'Patricia Rosales Fernandez', NULL, NULL, 'Dentist', 'Novaliches, QC'),
(19, 'Carlos Aguirre Pascual', NULL, NULL, 'Businessman', 'Quezon City'),
(20, 'Marie Pascual Aguirre', NULL, NULL, 'Professor', 'University of the Philippines'),
(21, 'James Santiago Morales', NULL, NULL, 'Government Employee', 'Quezon City Hall'),
(22, 'Luisa Morales Santiago', NULL, NULL, 'Nurse', 'East Avenue Medical Center'),
(23, 'Ricardo Castillo Rivera', NULL, NULL, 'Pilot', 'NAIA, Pasay City'),
(24, 'Nicole Rivera Castillo', NULL, NULL, 'Flight Attendant', 'NAIA, Pasay City'),
(25, 'Mark Fuentes', 0x3039313233343536373839, 0x6f6c697665726f732e73657267656564776172642e70656c6974726f40676d61696c2e636f6d, NULL, NULL);

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
(1, 1, 25.50, 120.00, 0x4e6f6e65, 0x4e6f6e65, 0x4e6f6e65),
(2, 2, 24.80, 118.50, 0x5065616e757473, 0x4e6f6e65, 0x4e6f6e65),
(3, 3, 28.30, 125.00, 0x4e6f6e65, 0x417374686d61, 0x56656e746f6c696e20696e68616c6572206173206e6565646564),
(4, 4, 27.60, 124.00, 0x4e6f6e65, 0x4e6f6e65, 0x4e6f6e65),
(5, 5, 30.20, 130.00, 0x44757374, 0x416c6c6572676963207268696e69746973, 0x416e746968697374616d696e65),
(6, 6, 29.50, 128.50, 0x4e6f6e65, 0x4e6f6e65, 0x4e6f6e65),
(7, 7, 32.80, 135.00, 0x4e6f6e65, 0x4e6f6e65, 0x4e6f6e65),
(8, 8, 31.40, 133.00, 0x5368656c6c66697368, 0x4e6f6e65, 0x4e6f6e65),
(9, 9, 35.60, 140.00, 0x4e6f6e65, 0x4e6f6e65, 0x4e6f6e65),
(10, 10, 34.20, 138.50, 0x4e6f6e65, 0x4e6f6e65, 0x4e6f6e65),
(11, 11, 38.50, 145.00, 0x4e6f6e65, 0x4e6f6e65, 0x4e6f6e65),
(12, 12, 37.80, 143.50, 0x50656e6963696c6c696e, 0x4e6f6e65, 0x4e6f6e65),
(13, 13, NULL, NULL, NULL, NULL, NULL);

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

--
-- Dumping data for table `notificationlog`
--

INSERT INTO `notificationlog` (`LogID`, `RecipientUserID`, `NotificationTypeID`, `Title`, `Message`, `SentAt`, `IsRead`, `NotificationStatus`, `ErrorMessage`, `RetryCount`) VALUES
(1, 2012, 1, 'Released na ung new grades, ang ganda mo po', 'HAHAHAHHAHAHAHAHAHAHAHAHAHA', '2025-11-24 15:02:39', 0, '', 'haha', 0),
(100, 2012, 1, 'hahahaahahaha', 'hahahahahaha', '2025-11-24 15:03:31', 0, 'Sent', 'hahahaha', 0);

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

--
-- Dumping data for table `participationlevel`
--

INSERT INTO `participationlevel` (`ParticipationLevelID`, `LevelName`, `SortOrder`) VALUES
(1, 'Very Active', 1),
(2, 'Active', 2),
(3, 'Moderately Active', 3);

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
(1, 1, 7, 4, 'Good participation', 1001, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(2, 2, 7, 5, 'Very active', 1001, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(3, 3, 7, 4, 'Active participant', 1002, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(4, 4, 7, 5, 'Excellent participation', 1002, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(5, 5, 7, 4, 'Good', 1003, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(6, 6, 7, 5, 'Outstanding', 1003, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(7, 7, 7, 4, 'Very good', 1004, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(8, 8, 7, 5, 'Excellent', 1004, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(9, 9, 7, 4, 'Active', 1005, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(10, 10, 7, 5, 'Very active', 1005, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(11, 11, 7, 5, 'Consistently excellent', 1006, '2025-08-30 14:00:00', '2025-11-22 18:25:25'),
(12, 12, 7, 5, 'Outstanding', 1006, '2025-08-30 14:00:00', '2025-11-22 18:25:25');

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
(1001, 1001, '$2y$10$teacherpasswordhash', '2025-05-15 09:00:00', NULL, 0, 0, NULL),
(1002, 1002, '$2y$10$teacherpasswordhash', '2025-05-15 09:00:00', NULL, 0, 0, NULL),
(1003, 1003, '$2y$10$teacherpasswordhash', '2025-05-15 09:00:00', NULL, 0, 0, NULL),
(1004, 1004, '$2y$10$teacherpasswordhash', '2025-05-15 09:00:00', NULL, 0, 0, NULL),
(1005, 1005, '$2y$10$teacherpasswordhash', '2025-05-15 09:00:00', NULL, 0, 0, NULL),
(1006, 1006, '$2y$10$teacherpasswordhash', '2025-05-15 09:00:00', NULL, 0, 0, NULL),
(1234, 1234, '$2y$10$pjeCa7zaZxapgqe7ZSMJ0OosrKF3yYtaXdh0exXoORlgbaA.6k29u', '2025-11-27 01:39:20', NULL, 0, 0, NULL),
(2001, 2001, '$2y$10$studentpasswordhash', '2025-05-20 10:00:00', NULL, 1, 0, NULL),
(2002, 2002, '$2y$10$studentpasswordhash', '2025-05-20 10:00:00', NULL, 1, 0, NULL),
(2003, 2003, '$2y$10$studentpasswordhash', '2024-05-20 10:00:00', NULL, 1, 0, NULL),
(2004, 2004, '$2y$10$studentpasswordhash', '2024-05-20 10:00:00', NULL, 1, 0, NULL),
(2005, 2005, '$2y$10$studentpasswordhash', '2023-05-20 10:00:00', NULL, 1, 0, NULL),
(2006, 2006, '$2y$10$studentpasswordhash', '2023-05-20 10:00:00', NULL, 1, 0, NULL),
(2007, 2007, '$2y$10$studentpasswordhash', '2022-05-20 10:00:00', NULL, 1, 0, NULL),
(2008, 2008, '$2y$10$studentpasswordhash', '2022-05-20 10:00:00', NULL, 1, 0, NULL),
(2009, 2009, '$2y$10$studentpasswordhash', '2021-05-20 10:00:00', NULL, 1, 0, NULL),
(2010, 2010, '$2y$10$studentpasswordhash', '2021-05-20 10:00:00', NULL, 1, 0, NULL),
(2011, 2011, '$2y$10$studentpasswordhash', '2020-05-20 10:00:00', NULL, 1, 0, NULL),
(2012, 2012, '$2y$10$pjeCa7zaZxapgqe7ZSMJ0OosrKF3yYtaXdh0exXoORlgbaA.6k29u', '2020-05-20 10:00:00', NULL, 1, 0, NULL),
(2013, 2016, '$2y$10$pjeCa7zaZxapgqe7ZSMJ0OosrKF3yYtaXdh0exXoORlgbaA.6k29u', '2025-11-27 03:36:30', NULL, 1, 0, NULL),
(2014, 2017, '$2y$10$sWI57cDXGUYscbTamYDzoO8r94ADBY1bt/y0c8F3eD.1QPyFbzG8m', '2025-11-27 19:01:53', NULL, 0, 0, NULL);

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
(1, 1, 1, 20000.00, '2025-06-05 10:30:00', 'CASH-20250605-001', NULL, 'Verified', NULL, NULL, NULL),
(2, 2, 2, 35000.00, '2025-06-03 14:15:00', 'BT-20250603-001', NULL, 'Verified', NULL, NULL, NULL),
(3, 3, 3, 15000.00, '2025-06-07 11:20:00', 'GCASH-20250607-001', NULL, 'Verified', NULL, NULL, NULL),
(4, 4, 2, 37000.00, '2025-06-02 09:45:00', 'BT-20250602-001', NULL, 'Verified', NULL, NULL, NULL),
(5, 5, 1, 39000.00, '2025-06-04 13:00:00', 'CASH-20250604-001', NULL, 'Verified', NULL, NULL, NULL),
(6, 6, 3, 25000.00, '2025-06-06 10:00:00', 'GCASH-20250606-001', NULL, 'Verified', NULL, NULL, NULL),
(7, 7, 4, 30000.00, '2025-06-08 15:30:00', 'PAYMAYA-20250608-001', NULL, 'Verified', NULL, NULL, NULL),
(8, 8, 2, 41000.00, '2025-06-01 08:00:00', 'BT-20250601-001', NULL, 'Verified', NULL, NULL, NULL),
(9, 9, 1, 43000.00, '2025-06-05 16:00:00', 'CASH-20250605-002', NULL, 'Verified', NULL, NULL, NULL),
(10, 10, 3, 20000.00, '2025-06-09 12:00:00', 'GCASH-20250609-001', NULL, 'Verified', NULL, NULL, NULL),
(11, 11, 2, 45000.00, '2025-06-01 09:00:00', 'BT-20250601-002', NULL, 'Verified', NULL, NULL, NULL),
(12, 12, 1, 20000.00, '2025-06-10 11:00:00', 'CASH-20250610-001', NULL, 'Verified', NULL, NULL, NULL),
(13, 12, 2, 15000.00, '2025-07-15 10:30:00', 'BT-20250715-001', NULL, 'Verified', NULL, NULL, NULL);

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
(1001, 1001, 'Maria', 'Santos', 'Reyes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1002, 1002, 'Jose', 'Dela Cruz', 'Manuel', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1003, 1003, 'Anna', 'Reyes', 'Garcia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1004, 1004, 'Robert', 'Gonzales', 'Cruz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1005, 1005, 'Carmen', 'Lopez', 'Ramos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1006, 1006, 'Daniel', 'Torres', 'Mendoza', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1234, 1234, 'Registrar', 'User', 'w', NULL, NULL, NULL, NULL, NULL, 0x009562101456, 0x0123, NULL),
(2001, 2001, 'John Carlo', 'Martinez', 'Santos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2002, 2002, 'Sofia Mae', 'Reyes', 'Garcia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2003, 2003, 'Miguel Angelo', 'Cruz', 'Lopez', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2004, 2004, 'Isabella Rose', 'Gonzales', 'Ramos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2005, 2005, 'Gabriel Luis', 'Torres', 'Mendoza', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2006, 2006, 'Mia Angelica', 'Santos', 'Dela Cruz', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2007, 2007, 'Rafael Jose', 'Villanueva', 'Navarro', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2008, 2008, 'Sophia Grace', 'Bautista', 'Castro', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2009, 2009, 'Lucas Emmanuel', 'Fernandez', 'Rosales', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2010, 2010, 'Chloe Marie', 'Aguirre', 'Pascual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2011, 2011, 'Oliver James', 'Santiago', 'Morales', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2012, 2012, 'Emma Nicole', 'Castillo', 'Rivera', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2013, 2016, 'ewqsa', 'Fuentes', 'heaven', NULL, NULL, NULL, NULL, NULL, 0x3039313233343536373839, 0x32312071632c206267632c206e6f766120736d2068616861, NULL),
(2014, 2017, 'Mark Kengie', 'Aldabon', NULL, NULL, '2004-11-22', 21, 'Catholic', NULL, 0x2b28363329203931322d3334352d36373839, NULL, NULL);

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
(1234, 1234, 'R-123', NULL);

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

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`RoleID`, `RoleName`, `Description`, `IsActive`) VALUES
(1, 'Super Admin', 'Full access', 1),
(2, 'Registrar', 'Student records', 1),
(3, 'Finance Officer', 'Payments', 1),
(4, 'Teacher', 'Grades', 1),
(5, 'Student', 'Portal access', 1),
(6, 'Head Teacher', 'Access to all features', 1);

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
(5, 3, 7, NULL, 'Grade 1 Morning', 15, 3, 1),
(6, 3, 7, NULL, 'Grade 1 Afternoon', 15, 0, 1),
(7, 4, 7, NULL, 'Grade 2 Morning', 15, 0, 1),
(8, 4, 7, NULL, 'Grade 2 Afternoon', 15, 2, 1),
(9, 5, 7, NULL, 'Grade 3 Morning', 15, 0, 1),
(10, 5, 7, NULL, 'Grade 3 Afternoon', 15, 0, 1),
(11, 6, 7, NULL, 'Grade 4 Morning', 15, 0, 1),
(12, 6, 7, NULL, 'Grade 4 Afternoon', 15, 2, 1),
(13, 7, 7, NULL, 'Grade 5 Morning', 15, 0, 1),
(14, 7, 7, NULL, 'Grade 5 Afternoon', 15, 0, 1),
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
(1, 1, 1, 'Father', 1, 1, 1, 1),
(2, 1, 2, 'Mother', 0, 1, 1, 2),
(3, 2, 3, 'Father', 1, 1, 1, 1),
(4, 2, 4, 'Mother', 0, 1, 1, 2),
(5, 3, 5, 'Father', 1, 1, 1, 1),
(6, 3, 6, 'Mother', 0, 1, 1, 2),
(7, 4, 7, 'Father', 1, 1, 1, 1),
(8, 4, 8, 'Mother', 0, 1, 1, 2),
(9, 5, 9, 'Father', 1, 1, 1, 1),
(10, 5, 10, 'Mother', 0, 1, 1, 2),
(11, 6, 11, 'Father', 1, 1, 1, 1),
(12, 6, 12, 'Mother', 0, 1, 1, 2),
(13, 7, 13, 'Father', 1, 1, 1, 1),
(14, 7, 14, 'Mother', 0, 1, 1, 2),
(15, 8, 15, 'Father', 1, 1, 1, 1),
(16, 8, 16, 'Mother', 0, 1, 1, 2),
(17, 9, 17, 'Father', 1, 1, 1, 1),
(18, 9, 18, 'Mother', 0, 1, 1, 2),
(19, 10, 19, 'Father', 1, 1, 1, 1),
(20, 10, 20, 'Mother', 0, 1, 1, 2),
(21, 11, 21, 'Father', 1, 1, 1, 1),
(22, 11, 22, 'Mother', 0, 1, 1, 2),
(23, 12, 23, 'Father', 1, 1, 1, 1),
(24, 12, 24, 'Mother', 0, 1, 1, 2),
(25, 13, 25, 'Mother', 1, 1, 1, 0);

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
,`UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff','Head Teacher')
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
(1, 2001, 'GCA-2025-001', NULL, '2018-03-15', 'Male', NULL, 'Enrolled', NULL),
(2, 2002, 'GCA-2025-002', NULL, '2018-07-22', 'Female', NULL, 'Enrolled', NULL),
(3, 2003, 'GCA-2024-003', NULL, '2017-05-10', 'Male', NULL, 'Enrolled', NULL),
(4, 2004, 'GCA-2024-004', NULL, '2017-09-18', 'Female', NULL, 'Enrolled', NULL),
(5, 2005, 'GCA-2023-005', NULL, '2016-02-14', 'Male', NULL, 'Enrolled', NULL),
(6, 2006, 'GCA-2023-006', NULL, '2016-11-30', 'Female', NULL, 'Enrolled', NULL),
(7, 2007, 'GCA-2022-007', NULL, '2015-06-08', 'Male', NULL, 'Enrolled', NULL),
(8, 2008, 'GCA-2022-008', NULL, '2015-12-25', 'Female', NULL, 'Enrolled', NULL),
(9, 2009, 'GCA-2021-009', NULL, '2014-04-20', 'Male', NULL, 'Enrolled', NULL),
(10, 2010, 'GCA-2021-010', NULL, '2014-08-12', 'Female', NULL, 'Enrolled', NULL),
(11, 2011, 'GCA-2020-011', NULL, '2013-01-15', 'Male', NULL, 'Enrolled', NULL),
(12, 2012, 'GCA-2020-012', NULL, '2013-10-05', 'Female', NULL, 'Enrolled', NULL),
(13, 2013, 'GCA-2025-00003', 'QR-GCA-2025-00003', '2018-08-11', 'Male', 'Filipino', 'Enrolled', NULL);

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

--
-- Dumping data for table `supportticket`
--

INSERT INTO `supportticket` (`TicketID`, `UserID`, `Subject`, `TicketStatus`, `TicketPriority`, `CreatedAt`, `ResolvedAt`, `AssignedToUserID`, `ResolvedByUserID`) VALUES
(1, 2012, 'Billing Question', 'Open', 'Medium', '2025-11-24 00:58:36', NULL, NULL, NULL);

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
(1, 1001, 'EMP-2025-001', 'Primary Education', '2025-05-15'),
(2, 1002, 'EMP-2025-002', 'Primary Education', '2025-05-15'),
(3, 1003, 'EMP-2025-003', 'Elementary Education', '2025-05-15'),
(4, 1004, 'EMP-2025-004', 'Mathematics', '2025-05-15'),
(5, 1005, 'EMP-2025-005', 'Science and Math', '2025-05-15'),
(6, 1006, 'EMP-2025-006', 'Upper Elementary', '2025-05-15'),
(7, 2014, 'TEACH-2025-001', 'Science', '2004-11-22');

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
(1, 1, 2012, 'nagbayad na aq pero di pa updated ung status', NULL, '2025-11-24 00:58:36', 0);

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
(1, 1, 7, '2025-06-01', '2025-06-30', 35000.00, 20000.00, 2),
(2, 2, 7, '2025-06-01', '2025-06-30', 35000.00, 35000.00, 3),
(3, 3, 7, '2025-06-01', '2025-06-30', 37000.00, 15000.00, 2),
(4, 4, 7, '2025-06-01', '2025-06-30', 37000.00, 37000.00, 3),
(5, 5, 7, '2025-06-01', '2025-06-30', 39000.00, 39000.00, 3),
(6, 6, 7, '2025-06-01', '2025-06-30', 39000.00, 25000.00, 2),
(7, 7, 7, '2025-06-01', '2025-06-30', 41000.00, 30000.00, 2),
(8, 8, 7, '2025-06-01', '2025-06-30', 41000.00, 41000.00, 3),
(9, 9, 7, '2025-06-01', '2025-06-30', 43000.00, 43000.00, 3),
(10, 10, 7, '2025-06-01', '2025-06-30', 43000.00, 20000.00, 2),
(11, 11, 7, '2025-06-01', '2025-06-30', 45000.00, 45000.00, 3),
(12, 12, 7, '2025-06-01', '2025-06-30', 45000.00, 35000.00, 2);

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
(1, 1, 1, 'Grade 1 Tuition Fee', 25000.00, 1),
(2, 1, 2, 'Miscellaneous Fee', 5000.00, 1),
(3, 1, 3, 'Books and Materials', 3000.00, 1),
(4, 1, 4, 'Computer Lab Fee', 1000.00, 1),
(5, 1, 5, 'Development Fee', 1000.00, 1),
(6, 2, 1, 'Grade 1 Tuition Fee', 25000.00, 1),
(7, 2, 2, 'Miscellaneous Fee', 5000.00, 1),
(8, 2, 3, 'Books and Materials', 3000.00, 1),
(9, 2, 4, 'Computer Lab Fee', 1000.00, 1),
(10, 2, 5, 'Development Fee', 1000.00, 1),
(11, 3, 1, 'Grade 2 Tuition Fee', 26000.00, 1),
(12, 3, 2, 'Miscellaneous Fee', 5500.00, 1),
(13, 3, 3, 'Books and Materials', 3500.00, 1),
(14, 3, 4, 'Computer Lab Fee', 1000.00, 1),
(15, 3, 5, 'Development Fee', 1000.00, 1),
(16, 4, 1, 'Grade 2 Tuition Fee', 26000.00, 1),
(17, 4, 2, 'Miscellaneous Fee', 5500.00, 1),
(18, 4, 3, 'Books and Materials', 3500.00, 1),
(19, 4, 4, 'Computer Lab Fee', 1000.00, 1),
(20, 4, 5, 'Development Fee', 1000.00, 1),
(21, 5, 1, 'Grade 3 Tuition Fee', 27000.00, 1),
(22, 5, 2, 'Miscellaneous Fee', 6000.00, 1),
(23, 5, 3, 'Books and Materials', 4000.00, 1),
(24, 5, 4, 'Computer Lab Fee', 1000.00, 1),
(25, 5, 5, 'Development Fee', 1000.00, 1),
(26, 6, 1, 'Grade 3 Tuition Fee', 27000.00, 1),
(27, 6, 2, 'Miscellaneous Fee', 6000.00, 1),
(28, 6, 3, 'Books and Materials', 4000.00, 1),
(29, 6, 4, 'Computer Lab Fee', 1000.00, 1),
(30, 6, 5, 'Development Fee', 1000.00, 1),
(31, 7, 1, 'Grade 4 Tuition Fee', 28000.00, 1),
(32, 7, 2, 'Miscellaneous Fee', 6500.00, 1),
(33, 7, 3, 'Books and Materials', 4500.00, 1),
(34, 7, 4, 'Computer Lab Fee', 1000.00, 1),
(35, 7, 5, 'Development Fee', 1000.00, 1),
(36, 8, 1, 'Grade 4 Tuition Fee', 28000.00, 1),
(37, 8, 2, 'Miscellaneous Fee', 6500.00, 1),
(38, 8, 3, 'Books and Materials', 4500.00, 1),
(39, 8, 4, 'Computer Lab Fee', 1000.00, 1),
(40, 8, 5, 'Development Fee', 1000.00, 1),
(41, 9, 1, 'Grade 5 Tuition Fee', 29000.00, 1),
(42, 9, 2, 'Miscellaneous Fee', 7000.00, 1),
(43, 9, 3, 'Books and Materials', 5000.00, 1),
(44, 9, 4, 'Computer Lab Fee', 1000.00, 1),
(45, 9, 5, 'Development Fee', 1000.00, 1),
(46, 10, 1, 'Grade 5 Tuition Fee', 29000.00, 1),
(47, 10, 2, 'Miscellaneous Fee', 7000.00, 1),
(48, 10, 3, 'Books and Materials', 5000.00, 1),
(49, 10, 4, 'Computer Lab Fee', 1000.00, 1),
(50, 10, 5, 'Development Fee', 1000.00, 1),
(51, 11, 1, 'Grade 6 Tuition Fee', 30000.00, 1),
(52, 11, 2, 'Miscellaneous Fee', 7500.00, 1),
(53, 11, 3, 'Books and Materials', 5500.00, 1),
(54, 11, 4, 'Computer Lab Fee', 1000.00, 1),
(55, 11, 5, 'Development Fee', 1000.00, 1),
(56, 12, 1, 'Grade 6 Tuition Fee', 30000.00, 1),
(57, 12, 2, 'Miscellaneous Fee', 7500.00, 1),
(58, 12, 3, 'Books and Materials', 5500.00, 1),
(59, 12, 4, 'Computer Lab Fee', 1000.00, 1),
(60, 12, 5, 'Development Fee', 1000.00, 1);

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
  `UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff','Head Teacher') NOT NULL,
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
(1001, 'maria.santos@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-05-01 08:00:00', '2025-11-22 18:25:25', 0, NULL),
(1002, 'jose.delacruz@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-05-01 08:00:00', '2025-11-22 18:25:25', 0, NULL),
(1003, 'anna.reyes@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-05-01 08:00:00', '2025-11-22 18:25:25', 0, NULL),
(1004, 'robert.gonzales@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-05-01 08:00:00', '2025-11-22 18:25:25', 0, NULL),
(1005, 'carmen.lopez@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-05-01 08:00:00', '2025-11-22 18:25:25', 0, NULL),
(1006, 'daniel.torres@gca.edu.ph', 'Teacher', 'Active', NULL, '2025-05-01 08:00:00', '2025-11-22 18:25:25', 0, NULL),
(1234, 'registrar@gmail.com', 'Registrar', 'Active', NULL, '2025-11-27 01:36:47', '2025-11-27 01:36:47', 0, NULL),
(2001, 'john.martinez@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2002, 'sofia.reyes@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2003, 'miguel.cruz@student.gca.edu.ph', 'Student', 'Active', NULL, '2024-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2004, 'isabella.gonzales@student.gca.edu.ph', 'Student', 'Active', NULL, '2024-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2005, 'gabriel.torres@student.gca.edu.ph', 'Student', 'Active', NULL, '2023-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2006, 'mia.santos@student.gca.edu.ph', 'Student', 'Active', NULL, '2023-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2007, 'rafael.villanueva@student.gca.edu.ph', 'Student', 'Active', NULL, '2022-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2008, 'sophia.bautista@student.gca.edu.ph', 'Student', 'Active', NULL, '2022-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2009, 'lucas.fernandez@student.gca.edu.ph', 'Student', 'Active', NULL, '2021-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2010, 'chloe.aguirre@student.gca.edu.ph', 'Student', 'Active', NULL, '2021-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2011, 'oliver.santiago@student.gca.edu.ph', 'Student', 'Active', NULL, '2020-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2012, 'emma.castillo@student.gca.edu.ph', 'Student', 'Active', NULL, '2020-05-20 10:00:00', '2025-11-22 18:25:25', 0, NULL),
(2016, 'ewqsa.fuentes@student.gca.edu.ph', 'Student', 'Active', NULL, '2025-11-27 03:36:30', '2025-11-27 03:36:30', 0, NULL),
(2017, 'markkengiealdabon@gmail.com', 'Head Teacher', 'Active', NULL, '2025-11-27 19:01:53', '2025-11-28 00:08:16', 0, NULL);

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
(1, 2017, 4, '2025-11-27 19:01:53', NULL, 9);

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
,`UserType` enum('Admin','Teacher','Student','Parent','Registrar','Guard','Staff','Head Teacher')
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
  MODIFY `StandingLevelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `adminprofile`
--
ALTER TABLE `adminprofile`
  MODIFY `AdminProfileID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `AnnouncementID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
  MODIFY `AttendanceSummaryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `ScheduleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `discount`
--
ALTER TABLE `discount`
  MODIFY `DiscountID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discounttype`
--
ALTER TABLE `discounttype`
  MODIFY `DiscountTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `document_request`
--
ALTER TABLE `document_request`
  MODIFY `RequestID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergencycontact`
--
ALTER TABLE `emergencycontact`
  MODIFY `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `GradeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6109;

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
-- AUTO_INCREMENT for table `guardian`
--
ALTER TABLE `guardian`
  MODIFY `GuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
  MODIFY `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `notificationlog`
--
ALTER TABLE `notificationlog`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `notificationtype`
--
ALTER TABLE `notificationtype`
  MODIFY `NotificationTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `participationlevel`
--
ALTER TABLE `participationlevel`
  MODIFY `ParticipationLevelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `participationrating`
--
ALTER TABLE `participationrating`
  MODIFY `ParticipationRatingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `passwordhistory`
--
ALTER TABLE `passwordhistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passwordpolicy`
--
ALTER TABLE `passwordpolicy`
  MODIFY `PolicyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2015;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `TokenID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2015;

--
-- AUTO_INCREMENT for table `registrarprofile`
--
ALTER TABLE `registrarprofile`
  MODIFY `RegistrarProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1235;

--
-- AUTO_INCREMENT for table `requirementtype`
--
ALTER TABLE `requirementtype`
  MODIFY `RequirementTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `RoleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `studentprofile`
--
ALTER TABLE `studentprofile`
  MODIFY `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `SubjectID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `supportticket`
--
ALTER TABLE `supportticket`
  MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teacherprofile`
--
ALTER TABLE `teacherprofile`
  MODIFY `TeacherProfileID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ticketmessage`
--
ALTER TABLE `ticketmessage`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transactionitem`
--
ALTER TABLE `transactionitem`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `transactionstatus`
--
ALTER TABLE `transactionstatus`
  MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2018;

--
-- AUTO_INCREMENT for table `userrole`
--
ALTER TABLE `userrole`
  MODIFY `UserRoleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
