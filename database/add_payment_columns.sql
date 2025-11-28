ALTER TABLE `application` 
ADD COLUMN `PaymentMode` ENUM('full','quarterly','monthly') DEFAULT NULL AFTER `ApplicationStatus`,
ADD COLUMN `DownPayment` DECIMAL(10,2) DEFAULT 0.00 AFTER `PaymentMode`,
ADD COLUMN `OutstandingBalance` DECIMAL(10,2) DEFAULT 0.00 AFTER `DownPayment`,
ADD COLUMN `TotalFee` DECIMAL(10,2) DEFAULT 0.00 AFTER `OutstandingBalance`,
ADD COLUMN `RegistrarNotes` TEXT DEFAULT NULL AFTER `TotalFee`;

-- Add OutstandingBalance to enrollment table
ALTER TABLE `enrollment`
ADD COLUMN `OutstandingBalance` DECIMAL(10,2) DEFAULT 0.00 AFTER `EnrollmentDate`;
