

CREATE DATABASE IF NOT EXISTS `railway`;
USE `railway`;


CREATE TABLE IF NOT EXISTS `event_types` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL,
	`slug` VARCHAR(255) NOT NULL UNIQUE,
	`description` TEXT,
	`duration` INT NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) 

-- Availability (matches `availability` used in seed.sql)
CREATE TABLE IF NOT EXISTS `availability` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`day_of_week` VARCHAR(20) NOT NULL,
	`start_time` TIME NOT NULL,
	`end_time` TIME NOT NULL,
	`timezone` VARCHAR(100) NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) 

-- Meetings (matches `meetings` used in seed.sql)
CREATE TABLE IF NOT EXISTS `meetings` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`event_type_id` INT NOT NULL,
	`invitee_name` VARCHAR(255) NOT NULL,
	`invitee_email` VARCHAR(255) NOT NULL,
	`meeting_date` DATE NOT NULL,
	`start_time` TIME NOT NULL,
	`end_time` TIME NOT NULL,
	`status` VARCHAR(50) NOT NULL DEFAULT 'scheduled',
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`),
	CONSTRAINT `fk_meetings_event_type` FOREIGN KEY (`event_type_id`) REFERENCES `event_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);



