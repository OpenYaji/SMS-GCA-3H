ALTER TABLE `transaction` 
ADD COLUMN `PaymentMode` ENUM('full', 'quarterly', 'monthly') DEFAULT 'full' 
AFTER `TransactionStatusID`;
