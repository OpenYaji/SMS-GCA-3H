
-- Add missing columns to application table
ALTER TABLE `application` 
ADD COLUMN IF NOT EXISTS `StudentFirstName` VARCHAR(100) AFTER `PreviousSchool`,
ADD COLUMN IF NOT EXISTS `StudentLastName` VARCHAR(100) AFTER `StudentFirstName`,
ADD COLUMN IF NOT EXISTS `StudentMiddleName` VARCHAR(100) AFTER `StudentLastName`,
ADD COLUMN IF NOT EXISTS `DateOfBirth` DATE AFTER `StudentMiddleName`,
ADD COLUMN IF NOT EXISTS `Gender` ENUM('Male', 'Female') AFTER `DateOfBirth`,
ADD COLUMN IF NOT EXISTS `Address` VARCHAR(512) AFTER `Gender`,
ADD COLUMN IF NOT EXISTS `ContactNumber` VARCHAR(20) AFTER `Address`,
ADD COLUMN IF NOT EXISTS `EmailAddress` VARCHAR(255) AFTER `ContactNumber`,
ADD COLUMN IF NOT EXISTS `GuardianFirstName` VARCHAR(100) AFTER `EmailAddress`,
ADD COLUMN IF NOT EXISTS `GuardianLastName` VARCHAR(100) AFTER `GuardianFirstName`,
ADD COLUMN IF NOT EXISTS `GuardianRelationship` VARCHAR(50) AFTER `GuardianLastName`,
ADD COLUMN IF NOT EXISTS `GuardianContact` VARCHAR(20) AFTER `GuardianRelationship`,
ADD COLUMN IF NOT EXISTS `GuardianEmail` VARCHAR(255) AFTER `GuardianContact`,
ADD COLUMN IF NOT EXISTS `TrackingNumber` VARCHAR(50) UNIQUE AFTER `GuardianEmail`,
ADD COLUMN IF NOT EXISTS `PrivacyAgreement` TINYINT(1) DEFAULT 0 AFTER `TrackingNumber`;

-- Create index for tracking number
CREATE INDEX IF NOT EXISTS `idx_tracking_number` ON `application`(`TrackingNumber`);
