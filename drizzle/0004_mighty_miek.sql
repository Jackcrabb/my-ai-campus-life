ALTER TABLE `campus_speech_clips` ADD `audition_only` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `campus_speech_clips` ADD `reviewed_by` text;--> statement-breakpoint
ALTER TABLE `campus_speech_clips` ADD `reviewed_at` text;