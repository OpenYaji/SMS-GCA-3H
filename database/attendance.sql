-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 04:52 AM
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
-- Database: `aa`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `AttendanceID` int(11) NOT NULL,
  `StudentProfileID` int(11) NOT NULL,
  `ClassScheduleID` int(11) NOT NULL,
  `AttendanceDate` date NOT NULL,
  `CheckInTime` datetime DEFAULT NULL,
  `CheckOutTime` datetime DEFAULT NULL,
  `AttendanceStatus` enum('Present','Late','Absent','Excused') NOT NULL,
  `AttendanceMethodID` int(11) DEFAULT NULL,
  `Notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`AttendanceID`),
  ADD UNIQUE KEY `StudentProfileID` (`StudentProfileID`,`ClassScheduleID`,`AttendanceDate`),
  ADD KEY `fk_Attendance_ClassSchedule` (`ClassScheduleID`),
  ADD KEY `fk_Attendance_Method` (`AttendanceMethodID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `AttendanceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_Attendance_ClassSchedule` FOREIGN KEY (`ClassScheduleID`) REFERENCES `classschedule` (`ScheduleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Attendance_Method` FOREIGN KEY (`AttendanceMethodID`) REFERENCES `attendancemethod` (`MethodID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_Attendance_StudentProfile` FOREIGN KEY (`StudentProfileID`) REFERENCES `studentprofile` (`StudentProfileID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
