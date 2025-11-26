
-- Complete setup script for Grade 6 subjects and schedules
-- This script creates subjects and assigns teachers with schedules

-- Step 1: Get necessary IDs
SET @grade6Id = (SELECT GradeLevelID FROM gradelevel WHERE LevelName = 'Grade 6' LIMIT 1);
SET @activeSchoolYearId = (SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1);
SET @sectionId = (SELECT SectionID FROM section 
                  WHERE SectionName = 'St. Peter' 
                  AND GradeLevelID = @grade6Id 
                  AND SchoolYearID = @activeSchoolYearId 
                  LIMIT 1);

-- Display what we found
SELECT 
    CONCAT('Grade 6 ID: ', IFNULL(@grade6Id, 'NOT FOUND')) as Info1,
    CONCAT('Active School Year ID: ', IFNULL(@activeSchoolYearId, 'NOT FOUND')) as Info2,
    CONCAT('Section ID: ', IFNULL(@sectionId, 'NOT FOUND')) as Info3;

-- Step 2: Create subjects for Grade 6 (if they don't exist)
INSERT INTO subject (SubjectName, SubjectCode, GradeLevelID, IsActive) 
VALUES ('ENGLISH', 'ENG6', @grade6Id, 1)
ON DUPLICATE KEY UPDATE IsActive = 1;

INSERT INTO subject (SubjectName, SubjectCode, GradeLevelID, IsActive) 
VALUES ('MATH', 'MTH6', @grade6Id, 1)
ON DUPLICATE KEY UPDATE IsActive = 1;

INSERT INTO subject (SubjectName, SubjectCode, GradeLevelID, IsActive) 
VALUES ('FILIPINO', 'FIL6', @grade6Id, 1)
ON DUPLICATE KEY UPDATE IsActive = 1;

INSERT INTO subject (SubjectName, SubjectCode, GradeLevelID, IsActive) 
VALUES ('SCIENCE', 'SCI6', @grade6Id, 1)
ON DUPLICATE KEY UPDATE IsActive = 1;

INSERT INTO subject (SubjectName, SubjectCode, GradeLevelID, IsActive) 
VALUES ('ARALING PANLIPUNAN', 'AP6', @grade6Id, 1)
ON DUPLICATE KEY UPDATE IsActive = 1;

INSERT INTO subject (SubjectName, SubjectCode, GradeLevelID, IsActive) 
VALUES ('MAPEH', 'MAPEH6', @grade6Id, 1)
ON DUPLICATE KEY UPDATE IsActive = 1;

-- Step 3: Get subject IDs (they should exist now)
SET @englishId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'ENG6' LIMIT 1);
SET @mathId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'MTH6' LIMIT 1);
SET @filipinoId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'FIL6' LIMIT 1);
SET @scienceId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'SCI6' LIMIT 1);
SET @apId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'AP6' LIMIT 1);
SET @mapehId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'MAPEH6' LIMIT 1);

-- Display subjects created
SELECT 
    CONCAT('English ID: ', IFNULL(@englishId, 'NOT FOUND')) as SubjectInfo1,
    CONCAT('Math ID: ', IFNULL(@mathId, 'NOT FOUND')) as SubjectInfo2,
    CONCAT('Filipino ID: ', IFNULL(@filipinoId, 'NOT FOUND')) as SubjectInfo3,
    CONCAT('Science ID: ', IFNULL(@scienceId, 'NOT FOUND')) as SubjectInfo4,
    CONCAT('AP ID: ', IFNULL(@apId, 'NOT FOUND')) as SubjectInfo5,
    CONCAT('MAPEH ID: ', IFNULL(@mapehId, 'NOT FOUND')) as SubjectInfo6;

-- Step 4: Clear existing schedules for this section
DELETE FROM classschedule WHERE SectionID = @sectionId;

-- Step 5: Create class schedules

-- ENGLISH - Teacher 1
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @englishId, 1, 'Monday', '08:00:00', '09:00:00', 'Room 101'),
(@sectionId, @englishId, 1, 'Wednesday', '08:00:00', '09:00:00', 'Room 101'),
(@sectionId, @englishId, 1, 'Friday', '08:00:00', '09:00:00', 'Room 101');

-- MATH - Teacher 2 (Main sessions)
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @mathId, 2, 'Monday', '09:00:00', '10:00:00', 'Room 102'),
(@sectionId, @mathId, 2, 'Tuesday', '09:00:00', '10:00:00', 'Room 102'),
(@sectionId, @mathId, 2, 'Thursday', '09:00:00', '10:00:00', 'Room 102');

-- MATH - Teacher 4 (Additional session)
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @mathId, 4, 'Friday', '09:00:00', '10:00:00', 'Room 102');

-- FILIPINO - Teacher 3
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @filipinoId, 3, 'Tuesday', '10:00:00', '11:00:00', 'Room 103'),
(@sectionId, @filipinoId, 3, 'Wednesday', '10:00:00', '11:00:00', 'Room 103'),
(@sectionId, @filipinoId, 3, 'Thursday', '10:00:00', '11:00:00', 'Room 103');

-- SCIENCE - Teacher 5
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @scienceId, 5, 'Monday', '13:00:00', '14:00:00', 'Science Lab'),
(@sectionId, @scienceId, 5, 'Wednesday', '13:00:00', '14:00:00', 'Science Lab'),
(@sectionId, @scienceId, 5, 'Friday', '13:00:00', '14:00:00', 'Science Lab');

-- ARALING PANLIPUNAN - Teacher 6
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @apId, 6, 'Tuesday', '14:00:00', '15:00:00', 'Room 201'),
(@sectionId, @apId, 6, 'Thursday', '14:00:00', '15:00:00', 'Room 201');

-- MAPEH - Teacher 6
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @mapehId, 6, 'Monday', '15:00:00', '16:00:00', 'Music Room'),
(@sectionId, @mapehId, 6, 'Wednesday', '15:00:00', '16:00:00', 'Room 202'),
(@sectionId, @mapehId, 6, 'Friday', '15:00:00', '17:00:00', 'Gym');

-- Step 6: Display results
SELECT '✅ SETUP COMPLETE!' as Status;

-- Show created subjects
SELECT 
    'Subjects Created' as Category,
    SubjectName,
    SubjectCode,
    IsActive
FROM subject
WHERE GradeLevelID = @grade6Id
ORDER BY SubjectName;

-- Show schedules created
SELECT 
    'Class Schedules Created' as Category,
    s.SubjectName as Subject,
    CONCAT(p.FirstName, ' ', p.LastName) as Teacher,
    cs.DayOfWeek as Day,
    TIME_FORMAT(cs.StartTime, '%h:%i %p') as StartTime,
    TIME_FORMAT(cs.EndTime, '%h:%i %p') as EndTime,
    cs.RoomNumber as Room
FROM classschedule cs
JOIN subject s ON cs.SubjectID = s.SubjectID
JOIN teacherprofile tp ON cs.TeacherProfileID = tp.TeacherProfileID
JOIN profile p ON tp.ProfileID = p.ProfileID
WHERE cs.SectionID = @sectionId
ORDER BY 
    FIELD(cs.DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
    cs.StartTime,
    s.SubjectName;

-- Teacher workload summary
SELECT 
    'Teacher Workload Summary' as Category,
    CONCAT(p.FirstName, ' ', p.LastName) as Teacher,
    tp.Specialization,
    COUNT(DISTINCT cs.SubjectID) as SubjectsHandled,
    COUNT(*) as TotalSessions,
    GROUP_CONCAT(DISTINCT s.SubjectName ORDER BY s.SubjectName SEPARATOR ', ') as Subjects
FROM classschedule cs
JOIN subject s ON cs.SubjectID = s.SubjectID
JOIN teacherprofile tp ON cs.TeacherProfileID = tp.TeacherProfileID
JOIN profile p ON tp.ProfileID = p.ProfileID
WHERE cs.SectionID = @sectionId
GROUP BY tp.TeacherProfileID, p.FirstName, p.LastName, tp.Specialization
ORDER BY Teacher;
