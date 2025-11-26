
-- Add additional columns to the existing application table to store form data
ALTER TABLE `application` 
ADD COLUMN IF NOT EXISTS `StudentFirstName` varchar(100) DEFAULT NULL AFTER `PreviousSchool`,
ADD COLUMN IF NOT EXISTS `StudentLastName` varchar(100) DEFAULT NULL AFTER `StudentFirstName`,
ADD COLUMN IF NOT EXISTS `StudentMiddleName` varchar(100) DEFAULT NULL AFTER `StudentLastName`,
ADD COLUMN IF NOT EXISTS `DateOfBirth` date DEFAULT NULL AFTER `StudentMiddleName`,
ADD COLUMN IF NOT EXISTS `Gender` enum('Male','Female') DEFAULT NULL AFTER `DateOfBirth`,
ADD COLUMN IF NOT EXISTS `Address` varchar(512) DEFAULT NULL AFTER `Gender`,
ADD COLUMN IF NOT EXISTS `ContactNumber` varchar(20) DEFAULT NULL AFTER `Address`,
ADD COLUMN IF NOT EXISTS `EmailAddress` varchar(255) DEFAULT NULL AFTER `ContactNumber`,
ADD COLUMN IF NOT EXISTS `GuardianFirstName` varchar(100) DEFAULT NULL AFTER `EmailAddress`,
ADD COLUMN IF NOT EXISTS `GuardianLastName` varchar(100) DEFAULT NULL AFTER `GuardianFirstName`,
ADD COLUMN IF NOT EXISTS `GuardianRelationship` varchar(100) DEFAULT NULL AFTER `GuardianLastName`,
ADD COLUMN IF NOT EXISTS `GuardianContact` varchar(20) DEFAULT NULL AFTER `GuardianRelationship`,
ADD COLUMN IF NOT EXISTS `GuardianEmail` varchar(255) DEFAULT NULL AFTER `GuardianContact`,
ADD COLUMN IF NOT EXISTS `TrackingNumber` varchar(50) DEFAULT NULL AFTER `GuardianEmail`,
ADD COLUMN IF NOT EXISTS `PrivacyAgreement` tinyint(1) DEFAULT 0 AFTER `TrackingNumber`;

-- Add unique index for tracking number
ALTER TABLE `application` ADD UNIQUE KEY IF NOT EXISTS `idx_tracking_number` (`TrackingNumber`);

-- Insert sample grade levels if not exists
INSERT IGNORE INTO `gradelevel` (`GradeLevelID`, `LevelName`, `SortOrder`) VALUES
(1, 'Pre-Elem', 1),
(2, 'Kinder', 2),
(3, 'Grade 1', 3),
(4, 'Grade 2', 4),
(5, 'Grade 3', 5),
(6, 'Grade 4', 6),
(7, 'Grade 5', 7),
(8, 'Grade 6', 8);

-- Insert active school year if not exists
INSERT IGNORE INTO `schoolyear` (`SchoolYearID`, `YearName`, `StartDate`, `EndDate`, `IsActive`) VALUES
(1, '2024-2025', '2024-06-01', '2025-03-31', 1);

-- Create a temporary profile for applicants who haven't been approved yet
-- This will be used until the application is approved
INSERT IGNORE INTO `user` (`UserID`, `EmailAddress`, `UserType`, `AccountStatus`) 
VALUES (999, 'temp.applicant@system.local', 'Student', 'PendingVerification');

INSERT IGNORE INTO `profile` (`ProfileID`, `UserID`, `FirstName`, `LastName`) 
VALUES (999, 999, 'Temporary', 'Applicant');
