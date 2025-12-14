
-- Add missing columns to document_request table
ALTER TABLE `document_request` 
ADD COLUMN `ScheduledPickupDate` DATE NULL AFTER `DateCompleted`,
ADD COLUMN `ScheduledPickupTime` VARCHAR(20) NULL AFTER `ScheduledPickupDate`,
ADD COLUMN `RejectionReason` TEXT NULL AFTER `ScheduledPickupTime`,
ADD COLUMN `ProcessedBy` INT NULL AFTER `RejectionReason`;
