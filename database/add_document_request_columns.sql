
-- Add missing columns to document_request table if they don't exist
ALTER TABLE document_request 
ADD COLUMN IF NOT EXISTS ScheduledPickupDate DATE NULL,
ADD COLUMN IF NOT EXISTS ScheduledPickupTime VARCHAR(20) NULL,
ADD COLUMN IF NOT EXISTS RejectionReason TEXT NULL,
ADD COLUMN IF NOT EXISTS ProcessedBy INT NULL;
