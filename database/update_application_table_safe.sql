
-- Drop old columns if they exist (from previous migration attempt)
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

-- Check and add PaymentMode column
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'application' 
    AND COLUMN_NAME = 'PaymentMode'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `application` ADD COLUMN `PaymentMode` ENUM(''full'',''quarterly'',''monthly'') DEFAULT NULL AFTER `ApplicationStatus`',
    'SELECT ''PaymentMode column already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add TransactionID column
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'application' 
    AND COLUMN_NAME = 'TransactionID'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `application` ADD COLUMN `TransactionID` INT(11) DEFAULT NULL AFTER `PaymentMode`',
    'SELECT ''TransactionID column already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add RegistrarNotes column
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'application' 
    AND COLUMN_NAME = 'RegistrarNotes'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `application` ADD COLUMN `RegistrarNotes` TEXT DEFAULT NULL AFTER `TransactionID`',
    'SELECT ''RegistrarNotes column already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add OutstandingBalance to enrollment table
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'enrollment' 
    AND COLUMN_NAME = 'OutstandingBalance'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE `enrollment` ADD COLUMN `OutstandingBalance` DECIMAL(10,2) DEFAULT 0.00 AFTER `EnrollmentDate`',
    'SELECT ''OutstandingBalance column already exists in enrollment'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add foreign key constraint if not exists
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'application'
    AND CONSTRAINT_NAME = 'fk_Application_Transaction'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `application` ADD CONSTRAINT `fk_Application_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE SET NULL',
    'SELECT ''Foreign key fk_Application_Transaction already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET SQL_MODE=@OLD_SQL_MODE;

-- Show final structure
SELECT 'Migration completed successfully' AS Status;
