
-- Add missing columns to the application table
ALTER TABLE `application` 
ADD COLUMN `StudentFirstName` VARCHAR(100) NULL AFTER `PreviousSchool`,
ADD COLUMN `StudentLastName` VARCHAR(100) NULL AFTER `StudentFirstName`,
ADD COLUMN `StudentMiddleName` VARCHAR(100) NULL AFTER `StudentLastName`,
ADD COLUMN `DateOfBirth` DATE NULL AFTER `StudentMiddleName`,
ADD COLUMN `Gender` ENUM('Male', 'Female') NULL AFTER `DateOfBirth`,
ADD COLUMN `Address` VARCHAR(512) NULL AFTER `Gender`,
ADD COLUMN `ContactNumber` VARCHAR(20) NULL AFTER `Address`,
ADD COLUMN `EmailAddress` VARCHAR(255) NULL AFTER `ContactNumber`,
ADD COLUMN `GuardianFirstName` VARCHAR(100) NULL AFTER `EmailAddress`,
ADD COLUMN `GuardianLastName` VARCHAR(100) NULL AFTER `GuardianFirstName`,
ADD COLUMN `GuardianRelationship` VARCHAR(50) NULL AFTER `GuardianLastName`,
ADD COLUMN `GuardianContact` VARCHAR(20) NULL AFTER `GuardianRelationship`,
ADD COLUMN `GuardianEmail` VARCHAR(255) NULL AFTER `GuardianContact`,
ADD COLUMN `TrackingNumber` VARCHAR(50) NULL UNIQUE AFTER `GuardianEmail`,
ADD COLUMN `PrivacyAgreement` TINYINT(1) DEFAULT 0 AFTER `TrackingNumber`;

-- Add index for tracking number if it doesn't exist
ALTER TABLE `application` ADD INDEX `idx_tracking_number` (`TrackingNumber`);
