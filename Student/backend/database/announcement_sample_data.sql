
-- First, ensure we have a user to be the author (Admin user)
-- Insert sample admin user if not exists
INSERT INTO `user` (`UserID`, `EmailAddress`, `UserType`, `AccountStatus`, `CreatedAt`) 
VALUES (1, 'admin@gymazo.edu', 'Admin', 'Active', NOW())
ON DUPLICATE KEY UPDATE `UserID` = 1;

INSERT INTO `profile` (`ProfileID`, `UserID`, `FirstName`, `LastName`, `MiddleName`) 
VALUES (1, 1, 'John', 'Administrator', 'M.')
ON DUPLICATE KEY UPDATE `ProfileID` = 1;

INSERT INTO `passwordpolicy` (`PolicyID`, `UserID`, `PasswordHash`, `PasswordSetDate`) 
VALUES (1, 1, '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890', NOW())
ON DUPLICATE KEY UPDATE `PolicyID` = 1;

-- Insert sample announcements
INSERT INTO `announcement` (`AnnouncementID`, `AuthorUserID`, `Title`, `Content`, `Summary`, `Category`, `BannerURL`, `PublishDate`, `ExpiryDate`, `TargetAudience`, `IsPinned`, `IsActive`) VALUES
(1, 1, 'Parent-Teacher Association (PTA) General Assembly', 
'<p>We cordially invite you to our first Parent-Teacher Association (PTA) General Assembly on <strong>Saturday, November 8, 2025, at 9:00 AM</strong> in the school gymnasium.</p><p>Our agenda will include the introduction of new faculty, presentation of the school calendar, and planning for our upcoming Family Day. Your presence and participation are highly valued as we work together for our children''s success. We look forward to seeing you there!</p><p><strong>Agenda:</strong></p><ul><li>Introduction of new faculty members</li><li>Presentation of school year calendar</li><li>Discussion of upcoming Family Day event</li><li>Open forum and Q&A session</li><li>Election of new PTA officers</li></ul><p>Light refreshments will be served. Please RSVP by November 5, 2025.</p>', 
'All parents and guardians are invited to the first PTA General Assembly for the school year to discuss upcoming activities and programs.', 
'Events', 
'https://placehold.co/800x400/b9b196/5B3E31?text=PTA+Assembly', 
'2025-10-15 08:00:00', 
'2025-11-08 23:59:59', 
'Parents', 
1, 
1),

(2, 1, 'NO CLASSES: October 24, 2025', 
'<p>In our continuous effort to enhance our teaching methods, all faculty members will be participating in an in-service professional development day.</p><p>As such, there will be <strong>no classes for all grade levels on Friday, October 24, 2025</strong>. Regular classes will resume on Monday, October 27. Please guide your children in doing their homework during this time. Thank you for your understanding.</p><p><strong>Professional Development Topics:</strong></p><ul><li>Innovative Teaching Strategies</li><li>Technology Integration in the Classroom</li><li>Student Engagement Techniques</li><li>Assessment and Evaluation Methods</li></ul>', 
'Please be advised that there will be no classes on Friday, October 24, 2025, to allow our teachers to attend a professional development seminar.', 
'General', 
'https://placehold.co/800x400/b9b196/5B3E31?text=No+Classes', 
'2025-10-18 07:00:00', 
'2025-10-24 23:59:59', 
'All Users', 
0, 
1),

(3, 1, 'Annual Family Fun Day!', 
'<p>It''s that time of the year again! Join us for a day of fun, food, and laughter at our Annual Family Fun Day on <strong>Saturday, November 22, 2025</strong>, from 8:00 AM to 4:00 PM at the school grounds.</p><p>Get ready for exciting games, inflatable castles, food booths, and special performances from our students. It''s a perfect day to bond with family and the school community. See you there!</p><p><strong>Event Highlights:</strong></p><ul><li>Inflatable castles and bouncy houses</li><li>Game booths with amazing prizes</li><li>Food festival featuring local delicacies</li><li>Student talent show at 2:00 PM</li><li>Raffle draw with grand prizes</li><li>Face painting and balloon art</li></ul><p><strong>Entrance:</strong> Free for all students and their families</p>', 
'Mark your calendars! Our much-awaited Family Fun Day is happening this November with exciting new games and activities.', 
'Events', 
'https://placehold.co/800x400/b9b196/5B3E31?text=Family+Fun+Day', 
'2025-10-17 06:00:00', 
'2025-11-22 23:59:59', 
'All Users', 
0, 
1),

(4, 1, 'Book Fair Week is Coming!', 
'<p>Let''s open a world of adventure through reading! The annual Scholastic Book Fair will be held at the school library from <strong>November 3 to November 7, 2025</strong>.</p><p>A wide selection of affordable and educational books will be available for purchase. This is a wonderful opportunity to help your child build their own little library at home.</p><p><strong>Book Fair Schedule:</strong></p><ul><li>Monday to Thursday: 8:00 AM - 4:00 PM</li><li>Friday: 8:00 AM - 6:00 PM (Extended hours)</li></ul><p><strong>Special Offers:</strong></p><ul><li>Buy 3, Get 1 Free on selected titles</li><li>20% discount for purchases above ₱1,000</li><li>Free bookmark with every purchase</li></ul><p>Various payment methods accepted including cash, cards, and GCash.</p>', 
'Encourage the love for reading! Our school library will be hosting a Book Fair with a wide variety of fun and educational books.', 
'Academic', 
'https://placehold.co/800x400/b9b196/5B3E31?text=Book+Fair', 
'2025-10-12 08:00:00', 
'2025-11-07 23:59:59', 
'Students', 
0, 
1),

(5, 1, 'First Quarter Report Card Distribution', 
'<p>The distribution of the First Quarter report cards will be on <strong>Friday, October 31, 2025, from 8:00 AM to 12:00 PM</strong>. Parents are requested to come to their child''s respective classroom to receive the report card and have a brief conference with the adviser.</p><p><strong>Schedule by Grade Level:</strong></p><ul><li>Grades 1-2: 8:00 AM - 9:30 AM</li><li>Grades 3-4: 9:30 AM - 11:00 AM</li><li>Grades 5-6: 11:00 AM - 12:00 PM</li></ul><p><strong>Please bring:</strong></p><ul><li>Valid ID for identification</li><li>Previous report card (if applicable)</li></ul><p>If you cannot attend on the scheduled date, please coordinate with your child''s adviser for an alternative arrangement.</p>', 
'Report cards for the first quarter will be distributed to parents and guardians next week.', 
'Academic', 
'https://placehold.co/800x400/b9b196/5B3E31?text=Report+Cards', 
'2025-10-10 07:00:00', 
'2025-10-31 23:59:59', 
'Parents', 
0, 
1),

(6, 1, 'School Picture Day', 
'<p>Get ready for your closeup! Our annual School Picture Day will be held on <strong>November 4-5, 2025</strong>. Please ensure students are in their complete and proper school uniform. Order forms will be sent home with the students next week.</p><p><strong>Schedule:</strong></p><ul><li>November 4: Kindergarten to Grade 3</li><li>November 5: Grade 4 to Grade 6</li></ul><p><strong>Photo Packages Available:</strong></p><ul><li>Basic Package: 1 8x10, 2 5x7, 8 wallet size - ₱500</li><li>Standard Package: 2 8x10, 4 5x7, 16 wallet size - ₱850</li><li>Deluxe Package: 3 8x10, 6 5x7, 24 wallet size + Digital copy - ₱1,200</li></ul><p><strong>Important Reminders:</strong></p><ul><li>Complete uniform required</li><li>Proper grooming (neat hair, clean face)</li><li>No accessories except prescribed school ID</li></ul>', 
'Smile! School picture day is scheduled for the first week of November. Please come in your best uniform.', 
'Events', 
'https://placehold.co/800x400/b9b196/5B3E31?text=Picture+Day', 
'2025-10-09 07:00:00', 
'2025-11-05 23:59:59', 
'Students', 
0, 
1),

(7, 1, 'Enrollment for School Year 2025-2026 Now Open!', 
'<p>We are now accepting enrollments for the upcoming School Year 2025-2026! Secure your child''s slot by enrolling early.</p><p><strong>Enrollment Period:</strong> October 15, 2025 - January 15, 2026</p><p><strong>Requirements for New Students:</strong></p><ul><li>Birth Certificate (PSA)</li><li>Report Card (Form 138)</li><li>Certificate of Good Moral Character</li><li>2x2 ID Pictures (4 copies)</li><li>Medical Certificate</li></ul><p><strong>Requirements for Old Students:</strong></p><li>Report Card from previous school year</li><li>2x2 ID Pictures (2 copies)</li></ul><p><strong>Early Bird Discount:</strong> 10% discount for enrollments paid in full before December 1, 2025!</p><p>For inquiries, please contact our Registrar''s Office at (02) 8123-4567 or email registrar@gymazo.edu</p>', 
'Start planning ahead! Enrollment for the next school year is now open with early bird discounts available.', 
'Academic', 
'https://placehold.co/800x400/b9b196/5B3E31?text=Enrollment+Open', 
'2025-10-05 08:00:00', 
'2026-01-15 23:59:59', 
'All Users', 
0, 
1),

(8, 1, 'Christmas Program 2025: Save the Date!', 
'<p>The most wonderful time of the year is coming! Our annual Christmas Program is scheduled for <strong>December 18, 2025, at 2:00 PM</strong> at the school auditorium.</p><p><strong>Program Highlights:</strong></p><ul><li>Christmas carol performances by each grade level</li><li>Nativity play by Grade 6 students</li><li>Dance presentations</li><li>Visit from Santa Claus</li><li>Gift giving and surprises</li></ul><p>Parents and guardians are warmly invited to attend. More details will follow as we get closer to the date. Let''s celebrate the season of giving together!</p><p><strong>Important Notes:</strong></p><ul><li>Students should wear their Christmas attire</li><li>Limited seating - first come, first served</li><li>Doors open at 1:30 PM</li></ul>', 
'Mark your calendars for our annual Christmas Program! A day full of performances, joy, and holiday cheer awaits.', 
'Events', 
'https://placehold.co/800x400/b9b196/5B3E31?text=Christmas+Program', 
'2025-10-01 08:00:00', 
'2025-12-18 23:59:59', 
'All Users', 
0, 
1),

(9, 1, 'Science Fair Competition: Call for Participants', 
'<p>Calling all young scientists! Our annual Science Fair Competition will be held on <strong>November 15, 2025</strong>. This is your chance to showcase your creativity and scientific knowledge!</p><p><strong>Categories:</strong></p><ul><li>Life Science</li><li>Physical Science</li><li>Earth and Space Science</li><li>Engineering and Technology</li></ul><p><strong>Prizes:</strong></p><ul><li>1st Place: Trophy + ₱3,000 + Medal</li><li>2nd Place: Trophy + ₱2,000 + Medal</li><li>3rd Place: Trophy + ₱1,000 + Medal</li></ul><p><strong>Registration:</strong> Submit your project proposal to the Science Department by October 25, 2025.</p><p>For guidelines and more information, please visit the Science Department office or download the registration form from our website.</p>', 
'Show your scientific prowess! Join our annual Science Fair Competition and win exciting prizes.', 
'Academic', 
'https://placehold.co/800x400/b9b196/5B3E31?text=Science+Fair', 
'2025-10-08 08:00:00', 
'2025-11-15 23:59:59', 
'Students', 
0, 
1),

(10, 1, 'Updated School Clinic Operating Hours', 
'<p>Please be informed that the school clinic will be operating on new hours starting <strong>November 1, 2025</strong>:</p><p><strong>New Operating Hours:</strong></p><ul><li>Monday to Friday: 7:30 AM - 4:30 PM</li><li>Saturday: 8:00 AM - 12:00 PM (Emergency only)</li><li>Sunday: Closed</li></ul><p><strong>Services Available:</strong></p><ul><li>First aid and emergency treatment</li><li>Medical consultation</li><li>Medicine dispensing</li><li>Health education and counseling</li><li>Annual medical check-ups</li></ul><p>Our school nurse, Nurse Maria Santos, RN, is available during clinic hours. For emergencies outside clinic hours, please call (02) 8123-4568.</p>', 
'Important update: The school clinic will have new operating hours starting next month. Please take note for your reference.', 
'General', 
'https://placehold.co/800x400/b9b196/5B3E31?text=Clinic+Hours', 
'2025-10-20 08:00:00', 
NULL, 
'All Users', 
0, 
1);
