
-- Make StudentProfileID nullable in transaction table
ALTER TABLE `transaction` 
MODIFY COLUMN `StudentProfileID` INT(11) DEFAULT NULL;

-- Add PaymentMode, TransactionID, and RegistrarNotes to application table if not exists
ALTER TABLE `application`
ADD COLUMN IF NOT EXISTS `PaymentMode` ENUM('full','quarterly','monthly') DEFAULT NULL AFTER `ApplicationStatus`,
ADD COLUMN IF NOT EXISTS `TransactionID` INT(11) DEFAULT NULL AFTER `PaymentMode`,
ADD COLUMN IF NOT EXISTS `RegistrarNotes` TEXT DEFAULT NULL AFTER `TransactionID`;

-- Add OutstandingBalance to enrollment table if not exists  
ALTER TABLE `enrollment`
ADD COLUMN IF NOT EXISTS `OutstandingBalance` DECIMAL(10,2) DEFAULT 0.00 AFTER `EnrollmentDate`;

-- Add foreign key if not exists
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'application'
    AND CONSTRAINT_NAME = 'fk_Application_Transaction'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `application` ADD CONSTRAINT `fk_Application_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE SET NULL',
    'SELECT ''Foreign key already exists'''
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Transaction table fixed - StudentProfileID now allows NULL' AS Status;
