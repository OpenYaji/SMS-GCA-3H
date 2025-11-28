
-- Remove existing columns if they exist (cleanup from previous attempts)
ALTER TABLE `application` 
DROP COLUMN IF EXISTS `DownPayment`,
DROP COLUMN IF EXISTS `OutstandingBalance`,
DROP COLUMN IF EXISTS `TotalFee`;

-- Remove foreign key if exists
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'application'
    AND CONSTRAINT_NAME = 'fk_Application_Transaction'
);

SET @sql = IF(@fk_exists > 0,
    'ALTER TABLE `application` DROP FOREIGN KEY `fk_Application_Transaction`',
    'SELECT ''Foreign key does not exist'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Now ensure we have the correct columns
-- PaymentMode should already exist from your previous attempt
-- TransactionID should already exist
-- RegistrarNotes should already exist

-- Just add the foreign key constraint
ALTER TABLE `application`
ADD CONSTRAINT `fk_Application_Transaction` 
FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) 
ON DELETE SET NULL;

-- Add OutstandingBalance to enrollment if not exists
ALTER TABLE `enrollment`
ADD COLUMN IF NOT EXISTS `OutstandingBalance` DECIMAL(10,2) DEFAULT 0.00 AFTER `EnrollmentDate`;

SELECT 'Cleanup and migration completed' AS Status;
