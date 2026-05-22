-- Database Schema for Calendly Clone

CREATE DATABASE IF NOT EXISTS `calendly_db`;
USE `calendly_db`;

-- 1. event_types table
CREATE TABLE IF NOT EXISTS `event_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `duration` INT NOT NULL, -- duration in minutes
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. availability table
CREATE TABLE IF NOT EXISTS `availability` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `day_of_week` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `timezone` VARCHAR(100) NOT NULL DEFAULT 'UTC',
  UNIQUE KEY `unique_day` (`day_of_week`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. meetings table
CREATE TABLE IF NOT EXISTS `meetings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_type_id` INT NOT NULL,
  `invitee_name` VARCHAR(255) NOT NULL,
  `invitee_email` VARCHAR(255) NOT NULL,
  `meeting_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `status` ENUM('scheduled', 'cancelled') DEFAULT 'scheduled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_type_id`) REFERENCES `event_types`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
