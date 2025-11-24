-- Create password_reset_tokens table
-- This table stores password reset tokens for the forgot password functionality

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `TokenID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `ExpiresAt` datetime NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `Used` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`TokenID`),
  UNIQUE KEY `Token` (`Token`),
  KEY `UserID` (`UserID`),
  KEY `ExpiresAt` (`ExpiresAt`),
  KEY `Used` (`Used`),
  CONSTRAINT `fk_password_reset_user` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add index for faster token lookups
CREATE INDEX idx_token_lookup ON password_reset_tokens(Token, ExpiresAt, Used);

-- Clean up expired tokens (optional, can be run periodically)
-- DELETE FROM password_reset_tokens WHERE ExpiresAt < NOW();
