-- Seed Sample Data for Calendly Clone

USE `railway`;

-- Insert Event Types
INSERT INTO `event_types` (`title`, `slug`, `description`, `duration`) VALUES
('15 Minute Coffee Chat', '15-min-coffee', 'A quick, casual catch-up over coffee (virtual or in-person). Perfect for networking or a brief check-in.', 15),
('30 Minute Product Demo', '30-min-demo', 'A detailed walk-through of our platform, features, and how it can help solve your team\'s pain points. Includes Q&A.', 30),
('60 Minute Technical Interview', '60-min-interview', 'Deep dive technical assessment covering system design, coding, and problem-solving skills.', 60);

-- Insert Default Weekly Availability (Monday to Friday, 9:00 AM - 5:00 PM)
INSERT INTO `availability` (`day_of_week`, `start_time`, `end_time`, `timezone`) VALUES
('Monday', '09:00:00', '17:00:00', 'America/New_York'),
('Tuesday', '09:00:00', '17:00:00', 'America/New_York'),
('Wednesday', '09:00:00', '17:00:00', 'America/New_York'),
('Thursday', '09:00:00', '17:00:00', 'America/New_York'),
('Friday', '09:00:00', '17:00:00', 'America/New_York'),
('Saturday', '10:00:00', '14:00:00', 'America/New_York');

-- Insert Sample Meetings (using event type 1 - 15 Minute Coffee Chat and event type 2 - 30 Minute Product Demo)
-- (Note: Dates are set in future/near dates for display. Let's insert a couple of records.)
INSERT INTO `meetings` (`event_type_id`, `invitee_name`, `invitee_email`, `meeting_date`, `start_time`, `end_time`, `status`) VALUES
(1, 'Alice Smith', 'alice@example.com', CURDATE() + INTERVAL 1 DAY, '10:00:00', '10:15:00', 'scheduled'),
(2, 'Bob Johnson', 'bob@example.com', CURDATE() + INTERVAL 1 DAY, '11:00:00', '11:30:00', 'scheduled'),
(1, 'Charlie Brown', 'charlie@example.com', CURDATE() - INTERVAL 2 DAY, '14:00:00', '14:15:00', 'scheduled'),
(3, 'Diana Prince', 'diana@example.com', CURDATE() + INTERVAL 3 DAY, '15:00:00', '16:00:00', 'scheduled');
