-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2025 at 05:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gca`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('super_admin','admin','staff') DEFAULT 'staff',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `full_name`, `email`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin@gca.edu.ph', 'super_admin', 1, NULL, '2025-10-07 08:04:38', '2025-10-07 08:04:38');

-- --------------------------------------------------------

--
-- Table structure for table `admission_applications`
--

CREATE TABLE `admission_applications` (
  `id` int(11) NOT NULL,
  `tracking_number` varchar(50) NOT NULL,
  `enrollee_type` enum('returnee','new','transferee') NOT NULL,
  `student_first_name` varchar(100) NOT NULL,
  `student_last_name` varchar(100) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `address` text NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `email_address` varchar(100) DEFAULT NULL,
  `guardian_first_name` varchar(100) NOT NULL,
  `guardian_last_name` varchar(100) NOT NULL,
  `relationship` varchar(50) NOT NULL,
  `guardian_contact` varchar(20) NOT NULL,
  `guardian_email` varchar(100) DEFAULT NULL,
  `grade_level` varchar(50) NOT NULL,
  `previous_school` varchar(200) DEFAULT NULL,
  `privacy_agreement` tinyint(1) DEFAULT 0,
  `application_status` enum('pending','under_review','approved','rejected','enrolled') DEFAULT 'pending',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admission_applications`
--

INSERT INTO `admission_applications` (`id`, `tracking_number`, `enrollee_type`, `student_first_name`, `student_last_name`, `birthdate`, `gender`, `address`, `contact_number`, `email_address`, `guardian_first_name`, `guardian_last_name`, `relationship`, `guardian_contact`, `guardian_email`, `grade_level`, `previous_school`, `privacy_agreement`, `application_status`, `submitted_at`, `updated_at`) VALUES
(1, 'GCA-2025-9474', 'new', 'Hello', 'haha', '2019-08-07', 'male', 'hahaha 321# agaga, ph', '09551355073', 'johnreybisnarcalipes@gmail.com', 'haha', 'hahaha', 'mother', '09551355073', 'johnreybisnarcalipes@gmail.com', 'grade2', 'haha', 1, 'pending', '2025-10-07 08:05:52', '2025-10-07 08:05:52'),
(2, 'GCA-2025-3111', 'returnee', 'Lebron', 'James', '2019-02-21', 'male', 'LA Lakers', '09123456789', 'lebwrongjames@gmail.com', 'Bronny', 'James Sr.', 'grandfather', '09123456789', 'ginajames@gmail.com', 'grade1', 'USC', 1, 'pending', '2025-10-07 08:54:41', '2025-10-07 08:54:41'),
(3, 'GCA-2025-5349', 'new', 'Russekk', 'Veloria', '2017-02-22', 'male', '58 A Zorra St., Brgy. Paltok, Quezon City', '09479793692', 'veloriarussell@gmail.com', 'Mark Lander', 'James', 'Father', '09123456789', 'ginajames@gmail.com', 'grade5', 'USC', 1, 'pending', '2025-10-07 10:05:27', '2025-10-07 10:05:27'),
(4, 'GCA-2025-8806', 'returnee', 'haha', 'haha', '2017-10-10', 'male', 'haha', '09123456789', 'hah@gmail.com', 'haha', 'haha', 'mother', '09123456789', 'johnr@gmail.com', 'pre-elem', 'haha', 1, 'pending', '2025-10-08 05:56:12', '2025-10-08 05:56:12'),
(5, 'GCA-2025-4467', 'new', 'Haha', 'Trump', '2019-10-10', 'male', '1', '09123456789', 'ha@gmail.com', 'haha', 'haha', 'haha', '09123456789', 'john@gmail.com', 'grade3', 'hha', 1, 'pending', '2025-10-08 07:04:48', '2025-10-08 07:04:48'),
(6, 'GCA-2025-3992', 'returnee', 'John', 'Rey', '2019-10-10', 'male', '21 haha', '09123456789', 'john@gmail.com', 'John', 'Ret', 'mother', '09123456789', 'john@gmail.com', 'grade1', 'QCU', 1, 'pending', '2025-10-08 08:47:35', '2025-10-08 08:47:35'),
(7, 'GCA-2025-7716', 'new', 'Lebron', 'James', '2019-10-10', 'female', 'LA Lakers', '09123456789', 'james@gmail.com', 'Lebron', 'James Sr.', 'father', '09123456789', 'john@gmail.com', 'pre-elem', '', 1, 'pending', '2025-10-10 05:21:49', '2025-10-10 05:21:49'),
(8, 'GCA-2025-3859', 'new', 'dsad', 'asdsada', '2018-10-10', 'male', 'lala', '09123456789', 'j@gmail.com', 'lebron', 'james', 'father', '09123456789', 'j@gmail.com', 'grade1', '', 1, 'pending', '2025-10-10 09:51:14', '2025-10-10 09:51:14');

-- --------------------------------------------------------

--
-- Table structure for table `admission_documents`
--

CREATE TABLE `admission_documents` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `document_type` varchar(100) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `application_logs`
--

CREATE TABLE `application_logs` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `details` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2025-10-05 20:32:37'),
(2, 'test', '$2y$10$U3Qh4lMs3b6qla16wwm.Reo9kVnktZ6gLbbbETTfp/jBu/yiwgHAK', '2025-10-05 20:38:30'),
(3, 'test2', '$2y$10$4Sr96n1t/BEpQE7BwYLYau8cGR0fbbhyzvKKRIZZpenN2zlltob.q', '2025-10-06 12:43:05'),
(4, 't', '$2y$10$K7Paw8EnfkTFlW3wh82AIuTS7FzArClzecrJ7VAMZ3Nl3mRJrCFKm', '2025-10-06 12:46:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `admission_applications`
--
ALTER TABLE `admission_applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracking_number` (`tracking_number`),
  ADD KEY `idx_tracking_number` (`tracking_number`),
  ADD KEY `idx_status` (`application_status`),
  ADD KEY `idx_submitted_at` (`submitted_at`);

--
-- Indexes for table `admission_documents`
--
ALTER TABLE `admission_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_application_id` (`application_id`);

--
-- Indexes for table `application_logs`
--
ALTER TABLE `application_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_application_id` (`application_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admission_applications`
--
ALTER TABLE `admission_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `admission_documents`
--
ALTER TABLE `admission_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `application_logs`
--
ALTER TABLE `application_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admission_documents`
--
ALTER TABLE `admission_documents`
  ADD CONSTRAINT `admission_documents_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `application_logs`
--
ALTER TABLE `application_logs`
  ADD CONSTRAINT `application_logs_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
