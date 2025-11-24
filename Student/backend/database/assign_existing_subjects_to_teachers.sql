
-- This script assigns teachers to the EXISTING Grade 6 subjects
-- Based on the actual subject codes in your database

-- Get necessary IDs
SET @grade6Id = (SELECT GradeLevelID FROM gradelevel WHERE LevelName = 'Grade 6' LIMIT 1);
SET @activeSchoolYearId = (SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1);
SET @sectionId = (SELECT SectionID FROM section 
                  WHERE SectionName = 'St. Peter' 
                  AND GradeLevelID = @grade6Id 
                  AND SchoolYearID = @activeSchoolYearId 
                  LIMIT 1);

-- Get subject IDs based on actual codes from your database
SET @artId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'ART-6' LIMIT 1);
SET @engId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'ENG-6' LIMIT 1);
SET @filId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'FIL-6' LIMIT 1);
SET @gmrcId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'GMRC-6' LIMIT 1);
SET @hltId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'HLT-6' LIMIT 1);
SET @makId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'MAK-6' LIMIT 1);
SET @mathId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'MATH-6' LIMIT 1);
SET @musId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'MUS-6' LIMIT 1);
SET @peId = (SELECT SubjectID FROM subject WHERE SubjectCode = 'PE-6' LIMIT 1);

-- Clear existing schedules
DELETE FROM classschedule WHERE SectionID = @sectionId;

-- Create class schedules with teacher assignments

-- ENGLISH - Teacher 1
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @engId, 1, 'Monday', '08:00:00', '09:00:00', 'Room 101'),
(@sectionId, @engId, 1, 'Wednesday', '08:00:00', '09:00:00', 'Room 101'),
(@sectionId, @engId, 1, 'Friday', '08:00:00', '09:00:00', 'Room 101');

-- FILIPINO - Teacher 3
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @filId, 3, 'Tuesday', '08:00:00', '09:00:00', 'Room 102'),
(@sectionId, @filId, 3, 'Thursday', '08:00:00', '09:00:00', 'Room 102'),
(@sectionId, @filId, 3, 'Friday', '09:00:00', '10:00:00', 'Room 102');

-- MATHEMATICS - Teacher 2 and Teacher 4
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @mathId, 2, 'Monday', '09:00:00', '10:00:00', 'Room 103'),
(@sectionId, @mathId, 2, 'Tuesday', '09:00:00', '10:00:00', 'Room 103'),
(@sectionId, @mathId, 4, 'Wednesday', '09:00:00', '10:00:00', 'Room 103'),
(@sectionId, @mathId, 4, 'Thursday', '09:00:00', '10:00:00', 'Room 103');

-- MAKABANSA (Araling Panlipunan) - Teacher 6
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @makId, 6, 'Tuesday', '10:00:00', '11:00:00', 'Room 201'),
(@sectionId, @makId, 6, 'Thursday', '10:00:00', '11:00:00', 'Room 201');

-- GMRC (Edukasyon sa Pagpapakatao) - Teacher 6
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @gmrcId, 6, 'Wednesday', '10:00:00', '11:00:00', 'Room 201'),
(@sectionId, @gmrcId, 6, 'Friday', '10:00:00', '11:00:00', 'Room 201');

-- MUSIC - Teacher 6
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @musId, 6, 'Monday', '13:00:00', '14:00:00', 'Music Room'),
(@sectionId, @musId, 6, 'Wednesday', '13:00:00', '14:00:00', 'Music Room');

-- ARTS - Teacher 6
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @artId, 6, 'Tuesday', '13:00:00', '14:00:00', 'Art Room'),
(@sectionId, @artId, 6, 'Thursday', '13:00:00', '14:00:00', 'Art Room');

-- PHYSICAL EDUCATION - Teacher 6
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @peId, 6, 'Monday', '14:00:00', '15:30:00', 'Gym'),
(@sectionId, @peId, 6, 'Friday', '14:00:00', '15:30:00', 'Gym');

-- HEALTH - Teacher 5
INSERT INTO classschedule (SectionID, SubjectID, TeacherProfileID, DayOfWeek, StartTime, EndTime, RoomNumber)
VALUES 
(@sectionId, @hltId, 5, 'Wednesday', '14:00:00', '15:00:00', 'Room 202'),
(@sectionId, @hltId, 5, 'Thursday', '14:00:00', '15:00:00', 'Room 202');

-- Display results
SELECT 
    '✅ Teachers assigned successfully!' as Status,
    COUNT(*) as TotalSchedules
FROM classschedule 
WHERE SectionID = @sectionId;

-- Show detailed schedule
SELECT 
    s.SubjectName,
    CONCAT(p.FirstName, ' ', p.LastName) as Teacher,
    cs.DayOfWeek,
    TIME_FORMAT(cs.StartTime, '%h:%i %p') as Start,
    TIME_FORMAT(cs.EndTime, '%h:%i %p') as End,
    cs.RoomNumber
FROM classschedule cs
JOIN subject s ON cs.SubjectID = s.SubjectID
JOIN teacherprofile tp ON cs.TeacherProfileID = tp.TeacherProfileID
JOIN profile p ON tp.ProfileID = p.ProfileID
WHERE cs.SectionID = @sectionId
ORDER BY s.SubjectName, FIELD(cs.DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
