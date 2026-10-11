CREATE TABLE `campus_speech_clips` (
	`hash` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`scope` text NOT NULL,
	`classroom_id` text,
	`source_kind` text NOT NULL,
	`source_id` text NOT NULL,
	`revision` integer NOT NULL,
	`part` text NOT NULL,
	`character_id` text NOT NULL,
	`locale` text NOT NULL,
	`model` text NOT NULL,
	`voice` text NOT NULL,
	`status` text NOT NULL,
	`budget_day` text NOT NULL,
	`characters` integer NOT NULL,
	`reserved_micros` integer NOT NULL,
	`bytes` integer DEFAULT 0 NOT NULL,
	`generation_id` text,
	`failure_code` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `campus_speech_budget_day` ON `campus_speech_clips` (`budget_day`);--> statement-breakpoint
CREATE TABLE `campus_speech_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`clip_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campus_speech_request_owner_key` ON `campus_speech_requests` (`owner_id`,`idempotency_key`);