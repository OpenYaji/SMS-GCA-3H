
-- Get IDs
SET @grade6Id = (SELECT GradeLevelID FROM gradelevel WHERE LevelName = 'Grade 6' LIMIT 1);
SET @activeSchoolYearId = (SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1);
SET @sectionId = (SELECT SectionID FROM section 
                  WHERE SectionName = 'St. Peter' 
                  AND GradeLevelID = @grade6Id 
                  AND SchoolYearID = @activeSchoolYearId 
                  LIMIT 1);

-- Create subjects if not exist
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

-- Get subject IDs
SET @englishId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'ENG6' LIMIT 1);
SET @mathId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'MTH6' LIMIT 1);
SET @filipinoId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'FIL6' LIMIT 1);
SET @scienceId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'SCI6' LIMIT 1);
SET @apId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'AP6' LIMIT 1);
SET @mapehId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'MAPEH6' LIMIT 1);

-- Clear old schedules
DELETE FROM classschedule WHERE SectionID = @sectionId;

-- Create schedules with teachers
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
-- ENGLISH
(@sectionId, @englishId, 1, 'Monday', '08:00:00', '09:00:00', 'Room 101'),
(@sectionId, @englishId, 1, 'Wednesday', '08:00:00', '09:00:00', 'Room 101'),
(@sectionId, @englishId, 1, 'Friday', '08:00:00', '09:00:00', 'Room 101'),

-- MATH
(@sectionId, @mathId, 2, 'Monday', '09:00:00', '10:00:00', 'Room 102'),
(@sectionId, @mathId, 2, 'Tuesday', '09:00:00', '10:00:00', 'Room 102'),
(@sectionId, @mathId, 2, 'Thursday', '09:00:00', '10:00:00', 'Room 102'),
(@sectionId, @mathId, 4, 'Friday', '09:00:00', '10:00:00', 'Room 102'),

-- FILIPINO
(@sectionId, @filipinoId, 3, 'Tuesday', '10:00:00', '11:00:00', 'Room 103'),
(@sectionId, @filipinoId, 3, 'Wednesday', '10:00:00', '11:00:00', 'Room 103'),
(@sectionId, @filipinoId, 3, 'Thursday', '10:00:00', '11:00:00', 'Room 103'),

-- SCIENCE
(@sectionId, @scienceId, 5, 'Monday', '13:00:00', '14:00:00', 'Science Lab'),
(@sectionId, @scienceId, 5, 'Wednesday', '13:00:00', '14:00:00', 'Science Lab'),
(@sectionId, @scienceId, 5, 'Friday', '13:00:00', '14:00:00', 'Science Lab'),

-- ARALING PANLIPUNAN
(@sectionId, @apId, 6, 'Tuesday', '14:00:00', '15:00:00', 'Room 201'),
(@sectionId, @apId, 6, 'Thursday', '14:00:00', '15:00:00', 'Room 201'),

-- MAPEH
(@sectionId, @mapehId, 6, 'Monday', '15:00:00', '16:00:00', 'Music Room'),
(@sectionId, @mapehId, 6, 'Wednesday', '15:00:00', '16:00:00', 'Room 202'),
(@sectionId, @mapehId, 6, 'Friday', '15:00:00', '17:00:00', 'Gym');

-- Verify
SELECT 
    s.SubjectName,
    CONCAT(p.FirstName, ' ', p.LastName) as Teacher,
    cs.DayOfWeek,
    TIME_FORMAT(cs.StartTime, '%h:%i %p') as StartTime,
    TIME_FORMAT(cs.EndTime, '%h:%i %p') as EndTime,
    cs.RoomNumber
FROM classschedule cs
JOIN subject s ON cs.SubjectID = s.SubjectID
JOIN teacherprofile tp ON cs.TeacherProfileID = tp.TeacherProfileID
JOIN profile p ON tp.ProfileID = p.ProfileID
WHERE cs.SectionID = @sectionId
ORDER BY s.SubjectName, FIELD(cs.DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
