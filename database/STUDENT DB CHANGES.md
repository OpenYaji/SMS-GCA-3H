may bago akong ginawang table for document request 


-- Table to store document requests from the React page
CREATE TABLE `document_request` (
  `RequestID` int(11) NOT NULL AUTO_INCREMENT,
  `StudentProfileID` int(11) NOT NULL,
  `DocumentType` enum('form137','grades','goodMoral','enrollment','completion','honorable') NOT NULL,
  `Purpose` varchar(255) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `DeliveryMethod` enum('pickup','mail') NOT NULL DEFAULT 'pickup',
  `AdditionalNotes` text DEFAULT NULL,
  `RequestStatus` enum('Pending','Processing','Ready','Completed','Rejected') NOT NULL DEFAULT 'Pending',
  `DateRequested` datetime NOT NULL DEFAULT current_timestamp(),
  `DateCompleted` datetime DEFAULT NULL,
  `ProcessedByUserID` int(11) DEFAULT NULL,
  PRIMARY KEY (`RequestID`),
  KEY `fk_DocumentRequest_Student` (`StudentProfileID`),
  KEY `fk_DocumentRequest_Processor` (`ProcessedByUserID`),
  CONSTRAINT `fk_DocumentRequest_Processor` FOREIGN KEY (`ProcessedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `fk_DocumentRequest_Student` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



nag add ako ng authorized_escort table


CREATE TABLE `authorized_escort` (
  `EscortID` int(11) NOT NULL AUTO_INCREMENT,
  `StudentProfileID` int(11) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `RelationshipToStudent` varchar(100) NOT NULL, -- Stores "Mother" or the Custom Input (e.g. "Driver")
  `ContactNumber` varchar(20) NOT NULL,
  `Address` varchar(512) DEFAULT NULL,           -- Added to match your form
  `AdditionalNotes` text DEFAULT NULL,           -- Added to match your form
  `EscortStatus` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending', -- Matches your UI badges
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,      -- Soft delete flag
  `DateAdded` datetime NOT NULL DEFAULT current_timestamp(),
  `ApprovedByUserID` int(11) DEFAULT NULL,       -- To track who approved the escort
  PRIMARY KEY (`EscortID`),
  KEY `fk_AuthorizedEscort_Student` (`StudentProfileID`),
  KEY `fk_AuthorizedEscort_Approver` (`ApprovedByUserID`),
  CONSTRAINT `fk_AuthorizedEscort_Student` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE,
  CONSTRAINT `fk_AuthorizedEscort_Approver` FOREIGN KEY (`ApprovedByUserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;