CREATE TABLE `campus_assignment_items` (
	`id` text PRIMARY KEY NOT NULL,
	`assignment_id` text NOT NULL,
	`question_id` text NOT NULL,
	`revision` integer NOT NULL,
	FOREIGN KEY (`assignment_id`) REFERENCES `campus_assignments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `campus_questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campus_assignment_question` ON `campus_assignment_items` (`assignment_id`,`question_id`);--> statement-breakpoint
CREATE TABLE `campus_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`classroom_id` text NOT NULL,
	`title` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`classroom_id`) REFERENCES `campus_classrooms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `campus_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`assignment_id` text NOT NULL,
	`question_id` text NOT NULL,
	`revision` integer NOT NULL,
	`option_id` text NOT NULL,
	`attempt_number` integer NOT NULL,
	`correct` integer NOT NULL,
	`score` integer NOT NULL,
	`idempotency_key` text NOT NULL,
	`created_at` text NOT NULL,
	`evidence` text,
	`decision_index` integer,
	FOREIGN KEY (`student_id`) REFERENCES `campus_students`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assignment_id`) REFERENCES `campus_assignments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campus_attempt_idempotency` ON `campus_attempts` (`student_id`,`idempotency_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `campus_attempt_sequence` ON `campus_attempts` (`student_id`,`assignment_id`,`question_id`,`attempt_number`);--> statement-breakpoint
CREATE TABLE `campus_classrooms` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`school_year` text NOT NULL,
	`grade` integer NOT NULL,
	`section` text NOT NULL,
	`join_code` text NOT NULL,
	`active_assignment_id` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campus_classrooms_join_code_unique` ON `campus_classrooms` (`join_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `campus_class_owner_year_section` ON `campus_classrooms` (`owner_id`,`school_year`,`grade`,`section`);--> statement-breakpoint
CREATE TABLE `campus_question_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` text NOT NULL,
	`revision` integer NOT NULL,
	`content` text NOT NULL,
	`answer` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `campus_questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campus_revision_question_number` ON `campus_question_revisions` (`question_id`,`revision`);--> statement-breakpoint
CREATE TABLE `campus_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`source_id` text,
	`grade` integer NOT NULL,
	`subject_id` text NOT NULL,
	`room_id` text NOT NULL,
	`category` text NOT NULL,
	`current_revision` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campus_question_owner_source` ON `campus_questions` (`owner_id`,`source_id`);--> statement-breakpoint
CREATE TABLE `campus_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`reset_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `campus_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `campus_students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `campus_student_progress` (
	`student_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`version` integer NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `campus_students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `campus_students` (
	`id` text PRIMARY KEY NOT NULL,
	`classroom_id` text NOT NULL,
	`student_number` text NOT NULL,
	`name` text NOT NULL,
	`recovery_hash` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`classroom_id`) REFERENCES `campus_classrooms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campus_student_class_number` ON `campus_students` (`classroom_id`,`student_number`);--> statement-breakpoint
CREATE TABLE `campus_teacher_unlocks` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
