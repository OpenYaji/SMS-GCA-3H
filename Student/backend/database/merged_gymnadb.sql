-- phpMyAdmin SQL Dump
-- Merged Database Schema
-- Database: `gymnadb`

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Table structure for table `user`
-- Modified to include all user types
-- --------------------------------------------------------

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

-- --------------------------------------------------------
-- Table structure for table `profile`
-- --------------------------------------------------------

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

-- --------------------------------------------------------
-- Table structure for table `studentprofile`
-- --------------------------------------------------------

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

-- --------------------------------------------------------
-- Table structure for table `teacherprofile`
-- --------------------------------------------------------

CREATE TABLE `teacherprofile` (
  `TeacherProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `Specialization` varchar(255) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `adminprofile`
-- --------------------------------------------------------

CREATE TABLE `adminprofile` (
  `AdminProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `registrarprofile`
-- --------------------------------------------------------

CREATE TABLE `registrarprofile` (
  `RegistrarProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `guardprofile`
-- --------------------------------------------------------

CREATE TABLE `guardprofile` (
  `GuardProfileID` int(11) NOT NULL,
  `ProfileID` int(11) NOT NULL,
  `EmployeeNumber` varchar(50) DEFAULT NULL,
  `HireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `guardian`
-- --------------------------------------------------------

CREATE TABLE `guardian` (
  `GuardianID` int(11) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `EncryptedPhoneNumber` varbinary(255) DEFAULT NULL,
  `EncryptedEmailAddress` varbinary(255) DEFAULT NULL,
  `Occupation` varchar(100) DEFAULT NULL,
  `WorkAddress` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `studentguardian`
-- --------------------------------------------------------

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

-- --------------------------------------------------------
-- Table structure for table `passwordpolicy`
-- --------------------------------------------------------

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

-- --------------------------------------------------------
-- Table structure for table `passwordhistory`
-- --------------------------------------------------------

CREATE TABLE `passwordhistory` (
  `HistoryID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `password_reset_tokens`
-- --------------------------------------------------------

CREATE TABLE `password_reset_tokens` (
  `TokenID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `ExpiresAt` datetime NOT NULL,
  `IsUsed` tinyint(1) NOT NULL DEFAULT 0,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `schoolyear`
-- --------------------------------------------------------

CREATE TABLE `schoolyear` (
  `SchoolYearID` int(11) NOT NULL,
  `YearName` varchar(50) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `gradelevel`
-- --------------------------------------------------------

CREATE TABLE `gradelevel` (
  `GradeLevelID` int(11) NOT NULL,
  `LevelName` varchar(50) NOT NULL,
  `SortOrder` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `section`
-- --------------------------------------------------------

CREATE TABLE `section` (
  `SectionID` int(11) NOT NULL,
  `GradeLevelID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `AdviserTeacherID` int(11) DEFAULT NULL,
  `SectionName` varchar(100) NOT NULL,
  `MaxCapacity` int(11) DEFAULT NULL,
  `CurrentEnrollment` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `enrollment`
-- --------------------------------------------------------

CREATE TABLE `enrollment` (
  `EnrollmentID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SectionID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `EnrollmentDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `subject`
-- --------------------------------------------------------

CREATE TABLE `subject` (
  `SubjectID` int(11) NOT NULL,
  `SubjectName` varchar(100) NOT NULL,
  `SubjectCode` varchar(20) NOT NULL,
  `GradeLevelID` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `grade`
-- --------------------------------------------------------

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

-- --------------------------------------------------------
-- Table structure for table `gradestatus`
-- --------------------------------------------------------

CREATE TABLE `gradestatus` (
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `classschedule`
-- --------------------------------------------------------

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
-- Table structure for table `schedulestatus`
-- --------------------------------------------------------

CREATE TABLE `schedulestatus` (
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `attendance`
-- --------------------------------------------------------

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
-- Table structure for table `attendancemethod`
-- --------------------------------------------------------

CREATE TABLE `attendancemethod` (
  `MethodID` int(11) NOT NULL,
  `MethodName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `attendancesummary`
-- --------------------------------------------------------

CREATE TABLE `attendancesummary` (
  `AttendanceSummaryID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `SchoolYearID` int(11) NOT NULL,
  `TotalDaysPresent` int(11) NOT NULL DEFAULT 0,
  `TotalSchoolDays` int(11) NOT NULL DEFAULT 0,
  `AttendancePercentage` decimal(5,2) GENERATED ALWAYS AS (case when `TotalSchoolDays` > 0 then round(`TotalDaysPresent` / `TotalSchoolDays` * 100,2) else 0 end) STORED,
  `LastUpdated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `medicalinfo`
-- --------------------------------------------------------

CREATE TABLE `medicalinfo` (
  `MedicalInfoID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `Weight` decimal(5,2) DEFAULT NULL COMMENT 'In kilograms',
  `Height` decimal(5,2) DEFAULT NULL COMMENT 'In centimeters',
  `EncryptedAllergies` blob DEFAULT NULL,
  `EncryptedMedicalConditions` blob DEFAULT NULL,
  `EncryptedMedications` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `emergencycontact`
-- --------------------------------------------------------

CREATE TABLE `emergencycontact` (
  `EmergencyContactID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `ContactPerson` varchar(255) NOT NULL,
  `EncryptedContactNumber` varbinary(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `transactionstatus`
-- --------------------------------------------------------

CREATE TABLE `transactionstatus` (
  `StatusID` int(11) NOT NULL,
  `StatusName` varchar(50) NOT NULL,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `transaction`
-- --------------------------------------------------------

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

-- --------------------------------------------------------
-- Table structure for table `itemtype`
-- --------------------------------------------------------

CREATE TABLE `itemtype` (
  `ItemTypeID` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `transactionitem`
-- --------------------------------------------------------

CREATE TABLE `transactionitem` (
  `ItemID` int(11) NOT NULL,
  `TransactionID` int(11) NOT NULL,
  `ItemTypeID` int(11) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `paymentmethod`
-- --------------------------------------------------------

CREATE TABLE `paymentmethod` (
  `PaymentMethodID` int(11) NOT NULL,
  `MethodName` varchar(100) NOT NULL,
  `MethodIcon` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `payment`
-- --------------------------------------------------------

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
-- Table structure for table `discounttype`
-- --------------------------------------------------------

CREATE TABLE `discounttype` (
  `DiscountTypeID` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `discount`
-- --------------------------------------------------------

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
-- Table structure for table `applieddiscount`
-- --------------------------------------------------------

CREATE TABLE `applieddiscount` (
  `AppliedDiscountID` int(11) NOT NULL,
  `TransactionID` int(11) NOT NULL,
  `DiscountID` int(11) NOT NULL,
  `DiscountAmount` decimal(10,2) NOT NULL,
  `ApprovedByUserID` int(11) DEFAULT NULL,
  `AppliedDate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `application`
-- Modified to include BannerURL field
-- --------------------------------------------------------

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
-- Table structure for table `requirementtype`
-- --------------------------------------------------------

CREATE TABLE `requirementtype` (
  `RequirementTypeID` int(11) NOT NULL,
  `TypeName` varchar(255) NOT NULL,
  `IsMandatory` tinyint(1) NOT NULL DEFAULT 1,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `securefile`
-- --------------------------------------------------------

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
-- Table structure for table `applicationrequirement`
-- --------------------------------------------------------

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
-- Table structure for table `announcement`
-- Modified to include BannerURL field
-- --------------------------------------------------------

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
-- Table structure for table `supportticket`
-- --------------------------------------------------------

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
-- Table structure for table `ticketmessage`
-- --------------------------------------------------------

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
-- Table structure for table `notificationtype`
-- --------------------------------------------------------

CREATE TABLE `notificationtype` (
  `NotificationTypeID` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL,
  `TemplateContent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `notificationlog`
-- --------------------------------------------------------

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
-- Table structure for table `faq`
-- --------------------------------------------------------

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
-- Table structure for table `academicstandinglevel`
-- --------------------------------------------------------

CREATE TABLE `academicstandinglevel` (
  `StandingLevelID` int(11) NOT NULL,
  `LevelName` varchar(100) NOT NULL,
  `MinAverage` decimal(5,2) DEFAULT NULL,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `participationlevel`
-- --------------------------------------------------------

CREATE TABLE `participationlevel` (
  `ParticipationLevelID` int(11) NOT NULL,
  `LevelName` varchar(100) NOT NULL,
  `SortOrder` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `participationrating`
-- --------------------------------------------------------

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
-- Table structure for table `academicstanding`
-- --------------------------------------------------------

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
-- Table structure for table `role`
-- --------------------------------------------------------

CREATE TABLE `role` (
  `RoleID` int(11) NOT NULL,
  `RoleName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `permission`
-- --------------------------------------------------------

CREATE TABLE `permission` (
  `PermissionID` int(11) NOT NULL,
  `PermissionCode` varchar(100) NOT NULL,
  `ModuleName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `rolepermission`
-- --------------------------------------------------------

CREATE TABLE `rolepermission` (
  `RolePermissionID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `PermissionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `userrole`
-- --------------------------------------------------------

CREATE TABLE `userrole` (
  `UserRoleID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `AssignedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ExpiryDate` datetime DEFAULT NULL,
  `AssignedByUserID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `usersettings`
-- --------------------------------------------------------

CREATE TABLE `usersettings` (
  `SettingsID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Theme` varchar(50) DEFAULT 'default',
  `AccentColor` varchar(20) DEFAULT '#007bff',
  `NotificationPreferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`NotificationPreferences`)),
  `TwoFactorEnabled` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `auditlog`
-- --------------------------------------------------------

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
-- VIEWS
-- --------------------------------------------------------

-- View: studentlogindetails
CREATE OR REPLACE VIEW `studentlogindetails` AS 
SELECT 
  `u`.`UserID` AS `UserID`, 
  `sp`.`StudentNumber` AS `StudentNumber`, 
  `pp`.`PasswordHash` AS `PasswordHash`, 
  concat(`p`.`FirstName`,' ',`p`.`LastName`) AS `FullName`, 
  `u`.`UserType` AS `UserType`, 
  `u`.`AccountStatus` AS `AccountStatus`, 
  `p`.`ProfileID` AS `ProfileID` 
FROM (((`studentprofile` `sp` 
  join `profile` `p` on(`sp`.`ProfileID` = `p`.`ProfileID`)) 
  join `user` `u` on(`p`.`UserID` = `u`.`UserID`)) 
  join `passwordpolicy` `pp` on(`u`.`UserID` = `pp`.`UserID`)) 
WHERE `u`.`UserType` = 'Student';

-- View: vw_student_auth
CREATE OR REPLACE VIEW `vw_student_auth` AS 
SELECT 
  `u`.`UserID` AS `UserID`, 
  `u`.`EmailAddress` AS `EmailAddress`, 
  `u`.`UserType` AS `UserType`, 
  `u`.`AccountStatus` AS `AccountStatus`, 
  `u`.`LastLoginDate` AS `LastLoginDate`, 
  `u`.`CreatedAt` AS `UserCreatedAt`, 
  `u`.`IsDeleted` AS `IsDeleted`, 
  `p`.`ProfileID` AS `ProfileID`, 
  `p`.`FirstName` AS `FirstName`, 
  `p`.`LastName` AS `LastName`, 
  `p`.`MiddleName` AS `MiddleName`, 
  concat_ws(' ',`p`.`FirstName`,`p`.`MiddleName`,`p`.`LastName`) AS `FullName`, 
  `p`.`EncryptedPhoneNumber` AS `EncryptedPhoneNumber`, 
  `p`.`EncryptedAddress` AS `EncryptedAddress`, 
  `p`.`ProfilePictureURL` AS `ProfilePictureURL`, 
  `sp`.`StudentProfileID` AS `StudentProfileID`, 
  `sp`.`StudentNumber` AS `StudentNumber`, 
  `sp`.`QRCodeID` AS `QRCodeID`, 
  `sp`.`DateOfBirth` AS `DateOfBirth`, 
  `sp`.`Gender` AS `Gender`, 
  `sp`.`Nationality` AS `Nationality`, 
  `sp`.`StudentStatus` AS `StudentStatus`, 
  `sp`.`ArchiveDate` AS `ArchiveDate`, 
  `pp`.`PasswordHash` AS `PasswordHash`, 
  `pp`.`PasswordSetDate` AS `PasswordSetDate`, 
  `pp`.`ExpiryDate` AS `ExpiryDate`, 
  `pp`.`MustChange` AS `MustChange`, 
  `pp`.`FailedLoginAttempts` AS `FailedLoginAttempts`, 
  `pp`.`LockedUntil` AS `LockedUntil`, 
  CASE 
    WHEN `pp`.`LockedUntil` is not null AND `pp`.`LockedUntil` > current_timestamp() THEN 'Locked' 
    WHEN `u`.`AccountStatus` = 'Active' AND `sp`.`StudentStatus` = 'Enrolled' THEN 'Can Login' 
    ELSE 'Cannot Login' 
  END AS `LoginStatus`, 
  timestampdiff(YEAR,`sp`.`DateOfBirth`,curdate()) AS `Age` 
FROM (((`user` `u` 
  join `profile` `p` on(`u`.`UserID` = `p`.`UserID`)) 
  join `studentprofile` `sp` on(`p`.`ProfileID` = `sp`.`ProfileID`)) 
  left join `passwordpolicy` `pp` on(`u`.`UserID` = `pp`.`UserID`)) 
WHERE `u`.`UserType` = 'Student' AND `u`.`IsDeleted` = 0;

-- View: student_personal_info
CREATE OR REPLACE VIEW `student_personal_info` AS 
SELECT 
  `u`.`UserID` AS `UserID`, 
  `sp`.`StudentProfileID` AS `StudentProfileID`, 
  `p`.`ProfilePictureURL` AS `ProfilePictureURL`, 
  concat_ws(' ',`p`.`FirstName`,`p`.`MiddleName`,`p`.`LastName`) AS `FullName`, 
  `u`.`EmailAddress` AS `EmailAddress`, 
  cast(`p`.`EncryptedPhoneNumber` as char charset utf8mb4) AS `PhoneNumber`, 
  cast(`p`.`EncryptedAddress` as char charset utf8mb4) AS `Address`, 
  `sp`.`StudentNumber` AS `StudentNumber`, 
  `sp`.`DateOfBirth` AS `DateOfBirth`, 
  timestampdiff(YEAR,`sp`.`DateOfBirth`,curdate()) AS `Age`, 
  `sp`.`Gender` AS `Gender`, 
  `sp`.`Nationality` AS `Nationality`, 
  `sp`.`StudentStatus` AS `StudentStatus`, 
  `sy`.`YearName` AS `SchoolYear`, 
  concat(`gl`.`LevelName`,' - ',`sec`.`SectionName`) AS `GradeAndSection`, 
  concat_ws(' ',`adviser_profile`.`FirstName`,`adviser_profile`.`LastName`) AS `AdviserName`, 
  `mi`.`Weight` AS `Weight`, 
  `mi`.`Height` AS `Height`, 
  cast(`mi`.`EncryptedAllergies` as char charset utf8mb4) AS `Allergies`, 
  cast(`mi`.`EncryptedMedicalConditions` as char charset utf8mb4) AS `MedicalConditions`, 
  `ec`.`ContactPerson` AS `EmergencyContactPerson`, 
  cast(`ec`.`EncryptedContactNumber` as char charset utf8mb4) AS `EmergencyContactNumber`, 
  (select `g`.`FullName` from (`guardian` `g` join `studentguardian` `sg` on(`g`.`GuardianID` = `sg`.`GuardianID`)) 
   where `sg`.`StudentProfileID` = `sp`.`StudentProfileID` and `sg`.`RelationshipType` = 'Father' limit 1) AS `FatherName`, 
  (select `g`.`FullName` from (`guardian` `g` join `studentguardian` `sg` on(`g`.`GuardianID` = `sg`.`GuardianID`)) 
   where `sg`.`StudentProfileID` = `sp`.`StudentProfileID` and `sg`.`RelationshipType` = 'Mother' limit 1) AS `MotherName`, 
  `g_primary`.`FullName` AS `PrimaryGuardianName`, 
  `sg_primary`.`RelationshipType` AS `PrimaryGuardianRelationship`, 
  cast(`g_primary`.`EncryptedPhoneNumber` as char charset utf8mb4) AS `PrimaryGuardianContactNumber`, 
  cast(`g_primary`.`EncryptedEmailAddress` as char charset utf8mb4) AS `PrimaryGuardianEmail` 
FROM ((((((((((((`user` `u` 
  join `profile` `p` on(`u`.`UserID` = `p`.`UserID`)) 
  join `studentprofile` `sp` on(`p`.`ProfileID` = `sp`.`ProfileID`)) 
  left join (select `e_inner`.`EnrollmentID` AS `EnrollmentID`,`e_inner`.`StudentProfileID` AS `StudentProfileID`,
    `e_inner`.`SectionID` AS `SectionID`,`e_inner`.`SchoolYearID` AS `SchoolYearID`,`e_inner`.`EnrollmentDate` AS `EnrollmentDate` 
    from (`enrollment` `e_inner` join (select `enrollment`.`StudentProfileID` AS `StudentProfileID`,max(`enrollment`.`EnrollmentID`) AS `MaxID` 
    from `enrollment` group by `enrollment`.`StudentProfileID`) `latest_e` 
    on(`e_inner`.`StudentProfileID` = `latest_e`.`StudentProfileID` and `e_inner`.`EnrollmentID` = `latest_e`.`MaxID`))) `e` 
  on(`sp`.`StudentProfileID` = `e`.`StudentProfileID`)) 
  left join `schoolyear` `sy` on(`e`.`SchoolYearID` = `sy`.`SchoolYearID`)) 
  left join `section` `sec` on(`e`.`SectionID` = `sec`.`SectionID`)) 
  left join `gradelevel` `gl` on(`sec`.`GradeLevelID` = `gl`.`GradeLevelID`)) 
  left join `teacherprofile` `tp` on(`sec`.`AdviserTeacherID` = `tp`.`TeacherProfileID`)) 
  left join `profile` `adviser_profile` on(`tp`.`ProfileID` = `adviser_profile`.`ProfileID`)) 
  left join `medicalinfo` `mi` on(`sp`.`StudentProfileID` = `mi`.`StudentProfileID`)) 
  left join `emergencycontact` `ec` on(`sp`.`StudentProfileID` = `ec`.`StudentProfileID`)) 
  left join `studentguardian` `sg_primary` on(`sp`.`StudentProfileID` = `sg_primary`.`StudentProfileID` and `sg_primary`.`IsPrimaryContact` = 1)) 
  left join `guardian` `g_primary` on(`sg_primary`.`GuardianID` = `g_primary`.`GuardianID`)) 
WHERE `u`.`IsDeleted` = 0;

-- --------------------------------------------------------
-- PRIMARY KEYS
-- --------------------------------------------------------

ALTER TABLE `user` ADD PRIMARY KEY (`UserID`), ADD UNIQUE KEY `EmailAddress` (`EmailAddress`);
ALTER TABLE `profile` ADD PRIMARY KEY (`ProfileID`), ADD UNIQUE KEY `UserID` (`UserID`);
ALTER TABLE `studentprofile` ADD PRIMARY KEY (`StudentProfileID`), ADD UNIQUE KEY `ProfileID` (`ProfileID`), ADD UNIQUE KEY `StudentNumber` (`StudentNumber`);
ALTER TABLE `teacherprofile` ADD PRIMARY KEY (`TeacherProfileID`), ADD UNIQUE KEY `ProfileID` (`ProfileID`);
ALTER TABLE `adminprofile` ADD PRIMARY KEY (`AdminProfileID`), ADD KEY `profile_admin_fk` (`ProfileID`);
ALTER TABLE `registrarprofile` ADD PRIMARY KEY (`RegistrarProfileID`), ADD KEY `profile_registrar_fk` (`ProfileID`);
ALTER TABLE `guardprofile` ADD PRIMARY KEY (`GuardProfileID`), ADD KEY `profile_guard_fk` (`ProfileID`);
ALTER TABLE `guardian` ADD PRIMARY KEY (`GuardianID`);
ALTER TABLE `studentguardian` ADD PRIMARY KEY (`StudentGuardianID`);
ALTER TABLE `passwordpolicy` ADD PRIMARY KEY (`PolicyID`), ADD UNIQUE KEY `UserID` (`UserID`);
ALTER TABLE `passwordhistory` ADD PRIMARY KEY (`HistoryID`);
ALTER TABLE `password_reset_tokens` ADD PRIMARY KEY (`TokenID`), ADD UNIQUE KEY `Token` (`Token`);
ALTER TABLE `schoolyear` ADD PRIMARY KEY (`SchoolYearID`), ADD UNIQUE KEY `YearName` (`YearName`);
ALTER TABLE `gradelevel` ADD PRIMARY KEY (`GradeLevelID`), ADD UNIQUE KEY `LevelName` (`LevelName`);
ALTER TABLE `section` ADD PRIMARY KEY (`SectionID`);
ALTER TABLE `enrollment` ADD PRIMARY KEY (`EnrollmentID`), ADD UNIQUE KEY `StudentProfileID` (`StudentProfileID`,`SchoolYearID`);
ALTER TABLE `subject` ADD PRIMARY KEY (`SubjectID`), ADD UNIQUE KEY `SubjectCode` (`SubjectCode`);
ALTER TABLE `grade` ADD PRIMARY KEY (`GradeID`), ADD UNIQUE KEY `EnrollmentID` (`EnrollmentID`,`SubjectID`,`Quarter`);
ALTER TABLE `gradestatus` ADD PRIMARY KEY (`StatusID`), ADD UNIQUE KEY `StatusName` (`StatusName`);
ALTER TABLE `classschedule` ADD PRIMARY KEY (`ScheduleID`);
ALTER TABLE `schedulestatus` ADD PRIMARY KEY (`StatusID`), ADD UNIQUE KEY `StatusName` (`StatusName`);
ALTER TABLE `attendance` ADD PRIMARY KEY (`AttendanceID`), ADD UNIQUE KEY `StudentProfileID` (`StudentProfileID`,`ClassScheduleID`,`AttendanceDate`);
ALTER TABLE `attendancemethod` ADD PRIMARY KEY (`MethodID`), ADD UNIQUE KEY `MethodName` (`MethodName`);
ALTER TABLE `attendancesummary` ADD PRIMARY KEY (`AttendanceSummaryID`), ADD UNIQUE KEY `unique_student_year` (`StudentProfileID`,`SchoolYearID`);
ALTER TABLE `medicalinfo` ADD PRIMARY KEY (`MedicalInfoID`), ADD UNIQUE KEY `StudentProfileID` (`StudentProfileID`);
ALTER TABLE `emergencycontact` ADD PRIMARY KEY (`EmergencyContactID`);
ALTER TABLE `transactionstatus` ADD PRIMARY KEY (`StatusID`), ADD UNIQUE KEY `StatusName` (`StatusName`);
ALTER TABLE `transaction` ADD PRIMARY KEY (`TransactionID`);
ALTER TABLE `itemtype` ADD PRIMARY KEY (`ItemTypeID`), ADD UNIQUE KEY `TypeName` (`TypeName`);
ALTER TABLE `transactionitem` ADD PRIMARY KEY (`ItemID`);
ALTER TABLE `paymentmethod` ADD PRIMARY KEY (`PaymentMethodID`), ADD UNIQUE KEY `MethodName` (`MethodName`);
ALTER TABLE `payment` ADD PRIMARY KEY (`PaymentID`), ADD UNIQUE KEY `ReferenceNumber` (`ReferenceNumber`);
ALTER TABLE `discounttype` ADD PRIMARY KEY (`DiscountTypeID`), ADD UNIQUE KEY `TypeName` (`TypeName`);
ALTER TABLE `discount` ADD PRIMARY KEY (`DiscountID`);
ALTER TABLE `applieddiscount` ADD PRIMARY KEY (`AppliedDiscountID`);
ALTER TABLE `application` ADD PRIMARY KEY (`ApplicationID`);
ALTER TABLE `requirementtype` ADD PRIMARY KEY (`RequirementTypeID`), ADD UNIQUE KEY `TypeName` (`TypeName`);
ALTER TABLE `securefile` ADD PRIMARY KEY (`FileID`), ADD UNIQUE KEY `StoredFileName` (`StoredFileName`);
ALTER TABLE `applicationrequirement` ADD PRIMARY KEY (`RequirementID`);
ALTER TABLE `announcement` ADD PRIMARY KEY (`AnnouncementID`);
ALTER TABLE `supportticket` ADD PRIMARY KEY (`TicketID`);
ALTER TABLE `ticketmessage` ADD PRIMARY KEY (`MessageID`);
ALTER TABLE `notificationtype` ADD PRIMARY KEY (`NotificationTypeID`), ADD UNIQUE KEY `TypeName` (`TypeName`);
ALTER TABLE `notificationlog` ADD PRIMARY KEY (`LogID`);
ALTER TABLE `faq` ADD PRIMARY KEY (`FAQID`);
ALTER TABLE `academicstandinglevel` ADD PRIMARY KEY (`StandingLevelID`), ADD UNIQUE KEY `LevelName` (`LevelName`);
ALTER TABLE `participationlevel` ADD PRIMARY KEY (`ParticipationLevelID`), ADD UNIQUE KEY `LevelName` (`LevelName`);
ALTER TABLE `participationrating` ADD PRIMARY KEY (`ParticipationRatingID`), ADD UNIQUE KEY `unique_student_year` (`StudentProfileID`,`SchoolYearID`);
ALTER TABLE `academicstanding` ADD PRIMARY KEY (`StandingID`), ADD UNIQUE KEY `EnrollmentID` (`EnrollmentID`);
ALTER TABLE `role` ADD PRIMARY KEY (`RoleID`), ADD UNIQUE KEY `RoleName` (`RoleName`);
ALTER TABLE `permission` ADD PRIMARY KEY (`PermissionID`), ADD UNIQUE KEY `PermissionCode` (`PermissionCode`);
ALTER TABLE `rolepermission` ADD PRIMARY KEY (`RolePermissionID`), ADD UNIQUE KEY `RoleID` (`RoleID`,`PermissionID`);
ALTER TABLE `userrole` ADD PRIMARY KEY (`UserRoleID`), ADD UNIQUE KEY `UserID` (`UserID`,`RoleID`);
ALTER TABLE `usersettings` ADD PRIMARY KEY (`SettingsID`), ADD UNIQUE KEY `UserID` (`UserID`);
ALTER TABLE `auditlog` ADD PRIMARY KEY (`AuditID`);

-- --------------------------------------------------------
-- AUTO_INCREMENT
-- --------------------------------------------------------

ALTER TABLE `user` MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `profile` MODIFY `ProfileID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `studentprofile` MODIFY `StudentProfileID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `teacherprofile` MODIFY `TeacherProfileID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `adminprofile` MODIFY `AdminProfileID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `registrarprofile` MODIFY `RegistrarProfileID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `guardprofile` MODIFY `GuardProfileID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `guardian` MODIFY `GuardianID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `studentguardian` MODIFY `StudentGuardianID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `passwordpolicy` MODIFY `PolicyID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `passwordhistory` MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `password_reset_tokens` MODIFY `TokenID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `schoolyear` MODIFY `SchoolYearID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `gradelevel` MODIFY `GradeLevelID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `section` MODIFY `SectionID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `enrollment` MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `subject` MODIFY `SubjectID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `grade` MODIFY `GradeID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `gradestatus` MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `classschedule` MODIFY `ScheduleID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `schedulestatus` MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `attendance` MODIFY `AttendanceID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `attendancemethod` MODIFY `MethodID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `attendancesummary` MODIFY `AttendanceSummaryID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `medicalinfo` MODIFY `MedicalInfoID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `emergencycontact` MODIFY `EmergencyContactID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `transactionstatus` MODIFY `StatusID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `transaction` MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `itemtype` MODIFY `ItemTypeID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `transactionitem` MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `paymentmethod` MODIFY `PaymentMethodID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `payment` MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `discounttype` MODIFY `DiscountTypeID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `discount` MODIFY `DiscountID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `applieddiscount` MODIFY `AppliedDiscountID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `application` MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `requirementtype` MODIFY `RequirementTypeID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `securefile` MODIFY `FileID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `applicationrequirement` MODIFY `RequirementID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `announcement` MODIFY `AnnouncementID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `supportticket` MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `ticketmessage` MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `notificationtype` MODIFY `NotificationTypeID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `notificationlog` MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `faq` MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `academicstandinglevel` MODIFY `StandingLevelID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `participationlevel` MODIFY `ParticipationLevelID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `participationrating` MODIFY `ParticipationRatingID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `academicstanding` MODIFY `StandingID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `role` MODIFY `RoleID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `permission` MODIFY `PermissionID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `rolepermission` MODIFY `RolePermissionID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `userrole` MODIFY `UserRoleID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `usersettings` MODIFY `SettingsID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `auditlog` MODIFY `AuditID` bigint(20) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------
-- FOREIGN KEY CONSTRAINTS
-- --------------------------------------------------------

ALTER TABLE `profile` 
  ADD CONSTRAINT `fk_Profile_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `studentprofile` 
  ADD CONSTRAINT `fk_StudentProfile_Profile` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

ALTER TABLE `teacherprofile` 
  ADD CONSTRAINT `fk_TeacherProfile_Profile` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

ALTER TABLE `adminprofile` 
  ADD CONSTRAINT `profile_admin_fk` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

ALTER TABLE `registrarprofile` 
  ADD CONSTRAINT `profile_registrar_fk` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

ALTER TABLE `guardprofile` 
  ADD CONSTRAINT `profile_guard_fk` FOREIGN KEY (`ProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE;

ALTER TABLE `studentguardian` 
  ADD CONSTRAINT `fk_StudentGuardian_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_StudentGuardian_Guardian` FOREIGN KEY (`GuardianID`) REFERENCES `guardian` (`GuardianID`) ON DELETE CASCADE;

ALTER TABLE `passwordpolicy` 
  ADD CONSTRAINT `fk_PasswordPolicy_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `passwordhistory` 
  ADD CONSTRAINT `fk_PasswordHistory_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `password_reset_tokens` 
  ADD CONSTRAINT `fk_PasswordResetToken_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `section` 
  ADD CONSTRAINT `fk_Section_GradeLevel` FOREIGN KEY (`GradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`),
  ADD CONSTRAINT `fk_Section_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Section_TeacherProfile` FOREIGN KEY (`AdviserTeacherID`) REFERENCES `teacherprofile` (`TeacherProfileID`) ON DELETE SET NULL;

ALTER TABLE `enrollment` 
  ADD CONSTRAINT `fk_Enrollment_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Enrollment_Section` FOREIGN KEY (`SectionID`) REFERENCES `section` (`SectionID`),
  ADD CONSTRAINT `fk_Enrollment_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`);

ALTER TABLE `subject` 
  ADD CONSTRAINT `fk_Subject_GradeLevel` FOREIGN KEY (`GradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`);

ALTER TABLE `grade` 
  ADD CONSTRAINT `fk_Grade_Enrollment` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollment` (`EnrollmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Grade_Subject` FOREIGN KEY (`SubjectID`) REFERENCES `subject` (`SubjectID`),
  ADD CONSTRAINT `fk_Grade_Status` FOREIGN KEY (`GradeStatusID`) REFERENCES `gradestatus` (`StatusID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Grade_ModifiedByUser` FOREIGN KEY (`ModifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `classschedule` 
  ADD CONSTRAINT `fk_ClassSchedule_Section` FOREIGN KEY (`SectionID`) REFERENCES `section` (`SectionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ClassSchedule_Subject` FOREIGN KEY (`SubjectID`) REFERENCES `subject` (`SubjectID`),
  ADD CONSTRAINT `fk_ClassSchedule_TeacherProfile` FOREIGN KEY (`TeacherProfileID`) REFERENCES `teacherprofile` (`TeacherProfileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ClassSchedule_Status` FOREIGN KEY (`ScheduleStatusID`) REFERENCES `schedulestatus` (`StatusID`) ON DELETE SET NULL;

ALTER TABLE `attendance` 
  ADD CONSTRAINT `fk_Attendance_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Attendance_ClassSchedule` FOREIGN KEY (`ClassScheduleID`) REFERENCES `classschedule` (`ScheduleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Attendance_Method` FOREIGN KEY (`AttendanceMethodID`) REFERENCES `attendancemethod` (`MethodID`) ON DELETE SET NULL;

ALTER TABLE `attendancesummary` 
  ADD CONSTRAINT `fk_AttendanceSummary_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_AttendanceSummary_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`) ON DELETE CASCADE;

ALTER TABLE `medicalinfo` 
  ADD CONSTRAINT `fk_MedicalInfo_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

ALTER TABLE `emergencycontact` 
  ADD CONSTRAINT `fk_EmergencyContact_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;

ALTER TABLE `transaction` 
  ADD CONSTRAINT `fk_Transaction_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`),
  ADD CONSTRAINT `fk_Transaction_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_transaction_status` FOREIGN KEY (`TransactionStatusID`) REFERENCES `transactionstatus` (`StatusID`);

ALTER TABLE `transactionitem` 
  ADD CONSTRAINT `fk_TransactionItem_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_TransactionItem_ItemType` FOREIGN KEY (`ItemTypeID`) REFERENCES `itemtype` (`ItemTypeID`);

ALTER TABLE `payment` 
  ADD CONSTRAINT `fk_Payment_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`),
  ADD CONSTRAINT `fk_Payment_PaymentMethod` FOREIGN KEY (`PaymentMethodID`) REFERENCES `paymentmethod` (`PaymentMethodID`),
  ADD CONSTRAINT `fk_Payment_SecureFile` FOREIGN KEY (`ProofFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Payment_VerifiedByUser` FOREIGN KEY (`VerifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `discount` 
  ADD CONSTRAINT `fk_Discount_DiscountType` FOREIGN KEY (`DiscountTypeID`) REFERENCES `discounttype` (`DiscountTypeID`);

ALTER TABLE `applieddiscount` 
  ADD CONSTRAINT `fk_AppliedDiscount_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_AppliedDiscount_Discount` FOREIGN KEY (`DiscountID`) REFERENCES `discount` (`DiscountID`),
  ADD CONSTRAINT `fk_AppliedDiscount_ApprovedByUser` FOREIGN KEY (`ApprovedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `application` 
  ADD CONSTRAINT `fk_Application_Profile` FOREIGN KEY (`ApplicantProfileID`) REFERENCES `profile` (`ProfileID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Application_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`),
  ADD CONSTRAINT `fk_Application_GradeLevel` FOREIGN KEY (`ApplyingForGradeLevelID`) REFERENCES `gradelevel` (`GradeLevelID`),
  ADD CONSTRAINT `fk_Application_ReviewedByUser` FOREIGN KEY (`ReviewedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `securefile` 
  ADD CONSTRAINT `fk_SecureFile_User` FOREIGN KEY (`UploadedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `applicationrequirement` 
  ADD CONSTRAINT `fk_ApplicationRequirement_Application` FOREIGN KEY (`ApplicationID`) REFERENCES `application` (`ApplicationID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ApplicationRequirement_RequirementType` FOREIGN KEY (`RequirementTypeID`) REFERENCES `requirementtype` (`RequirementTypeID`),
  ADD CONSTRAINT `fk_ApplicationRequirement_SecureFile` FOREIGN KEY (`SecureFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ApplicationRequirement_VerifiedByUser` FOREIGN KEY (`VerifiedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `announcement` 
  ADD CONSTRAINT `fk_Announcement_User` FOREIGN KEY (`AuthorUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `supportticket` 
  ADD CONSTRAINT `fk_SupportTicket_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_SupportTicket_AssignedToUser` FOREIGN KEY (`AssignedToUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_SupportTicket_ResolvedByUser` FOREIGN KEY (`ResolvedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `ticketmessage` 
  ADD CONSTRAINT `fk_TicketMessage_SupportTicket` FOREIGN KEY (`TicketID`) REFERENCES `supportticket` (`TicketID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_TicketMessage_User` FOREIGN KEY (`SenderUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_TicketMessage_SecureFile` FOREIGN KEY (`AttachmentFileID`) REFERENCES `securefile` (`FileID`) ON DELETE SET NULL;

ALTER TABLE `notificationlog` 
  ADD CONSTRAINT `fk_NotificationLog_User` FOREIGN KEY (`RecipientUserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_NotificationLog_NotificationType` FOREIGN KEY (`NotificationTypeID`) REFERENCES `notificationtype` (`NotificationTypeID`) ON DELETE SET NULL;

ALTER TABLE `participationrating` 
  ADD CONSTRAINT `fk_ParticipationRating_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ParticipationRating_SchoolYear` FOREIGN KEY (`SchoolYearID`) REFERENCES `schoolyear` (`SchoolYearID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ParticipationRating_EvaluatedByUser` FOREIGN KEY (`EvaluatedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `academicstanding` 
  ADD CONSTRAINT `fk_AcademicStanding_Enrollment` FOREIGN KEY (`EnrollmentID`) REFERENCES `enrollment` (`EnrollmentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_AcademicStanding_StandingLevel` FOREIGN KEY (`StandingLevelID`) REFERENCES `academicstandinglevel` (`StandingLevelID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_AcademicStanding_ParticipationLevel` FOREIGN KEY (`ParticipationLevelID`) REFERENCES `participationlevel` (`ParticipationLevelID`) ON DELETE SET NULL;

ALTER TABLE `rolepermission` 
  ADD CONSTRAINT `fk_RolePermission_Role` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_RolePermission_Permission` FOREIGN KEY (`PermissionID`) REFERENCES `permission` (`PermissionID`) ON DELETE CASCADE;

ALTER TABLE `userrole` 
  ADD CONSTRAINT `fk_UserRole_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_UserRole_Role` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_UserRole_AssignedByUser` FOREIGN KEY (`AssignedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

ALTER TABLE `usersettings` 
  ADD CONSTRAINT `fk_UserSettings_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

ALTER TABLE `auditlog` 
  ADD CONSTRAINT `fk_AuditLog_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;