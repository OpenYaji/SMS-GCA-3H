
-- Table for storing admission applications (temporary storage before profile creation)
CREATE TABLE IF NOT EXISTS `admission_applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tracking_number` varchar(50) NOT NULL UNIQUE,
  `enrollee_type` enum('returnee','new','transferee') NOT NULL,
  `student_first_name` varchar(100) NOT NULL,
  `student_last_name` varchar(100) NOT NULL,
  `student_middle_name` varchar(100) DEFAULT NULL,
  `birthdate` date NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `address` varchar(512) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `email_address` varchar(255) DEFAULT NULL,
  `guardian_first_name` varchar(100) NOT NULL,
  `guardian_last_name` varchar(100) NOT NULL,
  `relationship` varchar(100) NOT NULL,
  `guardian_contact` varchar(20) NOT NULL,
  `guardian_email` varchar(255) DEFAULT NULL,
  `grade_level` varchar(50) NOT NULL,
  `previous_school` varchar(255) DEFAULT NULL,
  `privacy_agreement` tinyint(1) NOT NULL DEFAULT 1,
  `application_status` enum('pending','approved','rejected','processing') NOT NULL DEFAULT 'pending',
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tracking_number` (`tracking_number`),
  KEY `idx_status` (`application_status`),
  KEY `idx_submitted` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table for storing uploaded documents
CREATE TABLE IF NOT EXISTS `admission_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `application_id` int(11) NOT NULL,
  `document_type` varchar(100) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(1024) NOT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_admission_docs_application` (`application_id`),
  CONSTRAINT `fk_admission_docs_application` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert sample grade levels if not exists
INSERT IGNORE INTO `gradelevel` (`GradeLevelID`, `LevelName`, `SortOrder`) VALUES
(1, 'Pre-Elem', 1),
(2, 'Kinder', 2),
(3, 'Grade 1', 3),
(4, 'Grade 2', 4),
(5, 'Grade 3', 5),
(6, 'Grade 4', 6),
(7, 'Grade 5', 7),
(8, 'Grade 6', 8);

-- Insert active school year if not exists
INSERT IGNORE INTO `schoolyear` (`SchoolYearID`, `YearName`, `StartDate`, `EndDate`, `IsActive`) VALUES
(1, '2024-2025', '2024-06-01', '2025-03-31', 1);
