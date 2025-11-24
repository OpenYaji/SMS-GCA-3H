
-- This script assigns the existing teachers to Grade 6 subjects with schedules
-- Teachers can handle multiple subjects based on their specialization

-- Get necessary IDs
SET @grade6Id = (SELECT GradeLevelID FROM gradelevel WHERE LevelName = 'Grade 6' LIMIT 1);
SET @activeSchoolYearId = (SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1);
SET @sectionId = (SELECT SectionID FROM section 
                  WHERE SectionName = 'St. Peter' 
                  AND GradeLevelID = @grade6Id 
                  AND SchoolYearID = @activeSchoolYearId 
                  LIMIT 1);

-- Get subject IDs
SET @englishId = (SELECT SubjectID FROM subject WHERE SubjectName = 'ENGLISH' AND GradeLevelID = @grade6Id LIMIT 1);
SET @mathId = (SELECT SubjectID FROM subject WHERE SubjectName = 'MATH' AND GradeLevelID = @grade6Id LIMIT 1);
SET @filipinoId = (SELECT SubjectID FROM subject WHERE SubjectName = 'FILIPINO' AND GradeLevelID = @grade6Id LIMIT 1);
SET @scienceId = (SELECT SubjectID FROM subject WHERE SubjectName = 'SCIENCE' AND GradeLevelID = @grade6Id LIMIT 1);
SET @apId = (SELECT SubjectID FROM subject WHERE SubjectName = 'ARALING PANLIPUNAN' AND GradeLevelID = @grade6Id LIMIT 1);
SET @mapehId = (SELECT SubjectID FROM subject WHERE SubjectName = 'MAPEH' AND GradeLevelID = @grade6Id LIMIT 1);

-- Teacher IDs from your database (TeacherProfileID 1-6)
-- We'll assign subjects based on their specializations:
-- Teacher 1 (Primary Education) - ENGLISH
-- Teacher 2 (Primary Education) - MATH  
-- Teacher 3 (Elementary Education) - FILIPINO
-- Teacher 4 (Mathematics) - Also helps with MATH
-- Teacher 5 (Science and Math) - SCIENCE
-- Teacher 6 (Upper Elementary) - MAPEH & ARALING PANLIPUNAN

-- Clear existing schedules for this section (if any)
DELETE FROM classschedule WHERE SectionID = @sectionId;

-- ENGLISH - Teacher 1 (Primary Education)
-- Monday, Wednesday, Friday - 8:00 AM to 9:00 AM
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @englishId, 1, 'Monday', '08:00:00', '09:00:00', 'Room 101'),
(@sectionId, @englishId, 1, 'Wednesday', '08:00:00', '09:00:00', 'Room 101'),
(@sectionId, @englishId, 1, 'Friday', '08:00:00', '09:00:00', 'Room 101');

-- MATH - Teacher 2 (Primary Education) - Main Math Teacher
-- Monday, Tuesday, Thursday - 9:00 AM to 10:00 AM
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @mathId, 2, 'Monday', '09:00:00', '10:00:00', 'Room 102'),
(@sectionId, @mathId, 2, 'Tuesday', '09:00:00', '10:00:00', 'Room 102'),
(@sectionId, @mathId, 2, 'Thursday', '09:00:00', '10:00:00', 'Room 102');

-- MATH (Additional) - Teacher 4 (Mathematics Specialist) - Friday session
-- Friday - 9:00 AM to 10:00 AM
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @mathId, 4, 'Friday', '09:00:00', '10:00:00', 'Room 102');

-- FILIPINO - Teacher 3 (Elementary Education)
-- Tuesday, Wednesday, Thursday - 10:00 AM to 11:00 AM
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @filipinoId, 3, 'Tuesday', '10:00:00', '11:00:00', 'Room 103'),
(@sectionId, @filipinoId, 3, 'Wednesday', '10:00:00', '11:00:00', 'Room 103'),
(@sectionId, @filipinoId, 3, 'Thursday', '10:00:00', '11:00:00', 'Room 103');

-- SCIENCE - Teacher 5 (Science and Math)
-- Monday, Wednesday, Friday - 1:00 PM to 2:00 PM
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @scienceId, 5, 'Monday', '13:00:00', '14:00:00', 'Science Lab'),
(@sectionId, @scienceId, 5, 'Wednesday', '13:00:00', '14:00:00', 'Science Lab'),
(@sectionId, @scienceId, 5, 'Friday', '13:00:00', '14:00:00', 'Science Lab');

-- ARALING PANLIPUNAN - Teacher 6 (Upper Elementary)
-- Tuesday, Thursday - 2:00 PM to 3:00 PM
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @apId, 6, 'Tuesday', '14:00:00', '15:00:00', 'Room 201'),
(@sectionId, @apId, 6, 'Thursday', '14:00:00', '15:00:00', 'Room 201');

-- MAPEH - Teacher 6 (Upper Elementary) - Handles PE, Arts, Music, Health
-- Monday - Music & Arts - 3:00 PM to 4:00 PM
-- Wednesday - Health Education - 3:00 PM to 4:00 PM  
-- Friday - Physical Education - 3:00 PM to 5:00 PM (2 hours)
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @mapehId, 6, 'Monday', '15:00:00', '16:00:00', 'Music Room'),
(@sectionId, @mapehId, 6, 'Wednesday', '15:00:00', '16:00:00', 'Room 202'),
(@sectionId, @mapehId, 6, 'Friday', '15:00:00', '17:00:00', 'Gym');

-- Display the results
SELECT 
    '✅ Class schedules created successfully!' as Status,
    COUNT(*) as TotalSchedules
FROM classschedule 
WHERE SectionID = @sectionId;

-- Show detailed schedule with teacher names
SELECT 
    s.SubjectName as Subject,
    CONCAT(p.FirstName, ' ', p.LastName) as Teacher,
    tp.Specialization,
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

-- Summary by teacher
SELECT 
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
