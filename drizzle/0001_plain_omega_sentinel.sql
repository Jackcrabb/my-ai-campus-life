CREATE TABLE `campus_worksheets` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`grade` integer NOT NULL,
	`subject_id` text NOT NULL,
	`title` text NOT NULL,
	`files` text NOT NULL,
	`created_at` text NOT NULL
);
