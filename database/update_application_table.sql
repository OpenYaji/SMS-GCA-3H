-- Add payment tracking columns to application table
ALTER TABLE `application` 
ADD COLUMN `PaymentMode` ENUM('full','quarterly','monthly') DEFAULT NULL AFTER `ApplicationStatus`,
ADD COLUMN `TransactionID` INT(11) DEFAULT NULL AFTER `PaymentMode`,
ADD COLUMN `RegistrarNotes` TEXT DEFAULT NULL AFTER `TransactionID`;

-- Add OutstandingBalance to enrollment table if not exists
ALTER TABLE `enrollment`
ADD COLUMN `OutstandingBalance` DECIMAL(10,2) DEFAULT 0.00 AFTER `EnrollmentDate`;

-- Add foreign key constraint
ALTER TABLE `application`
ADD CONSTRAINT `fk_Application_Transaction` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`) ON DELETE SET NULL;
