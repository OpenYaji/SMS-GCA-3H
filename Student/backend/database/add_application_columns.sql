
-- Add missing columns to application table
ALTER TABLE `application` 
ADD COLUMN `StudentFirstName` VARCHAR(100) AFTER `PreviousSchool`,
ADD COLUMN `StudentLastName` VARCHAR(100) AFTER `StudentFirstName`,
ADD COLUMN `StudentMiddleName` VARCHAR(100) AFTER `StudentLastName`,
ADD COLUMN `DateOfBirth` DATE AFTER `StudentMiddleName`,
ADD COLUMN `Gender` ENUM('Male', 'Female') AFTER `DateOfBirth`,
ADD COLUMN `Address` VARCHAR(512) AFTER `Gender`,
ADD COLUMN `ContactNumber` VARCHAR(20) AFTER `Address`,
ADD COLUMN `EmailAddress` VARCHAR(255) AFTER `ContactNumber`,
ADD COLUMN `GuardianFirstName` VARCHAR(100) AFTER `EmailAddress`,
ADD COLUMN `GuardianLastName` VARCHAR(100) AFTER `GuardianFirstName`,
ADD COLUMN `GuardianRelationship` VARCHAR(50) AFTER `GuardianLastName`,
ADD COLUMN `GuardianContact` VARCHAR(20) AFTER `GuardianRelationship`,
ADD COLUMN `GuardianEmail` VARCHAR(255) AFTER `GuardianContact`,
ADD COLUMN `TrackingNumber` VARCHAR(50) UNIQUE AFTER `GuardianEmail`,
ADD COLUMN `PrivacyAgreement` TINYINT(1) DEFAULT 0 AFTER `TrackingNumber`;

-- Create index for tracking number
CREATE INDEX `idx_tracking_number` ON `application`(`TrackingNumber`);
