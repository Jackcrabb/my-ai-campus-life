/* Legacy Sites sessions keep a NULL credential_id.
   Independent sessions require an active credential bound to the same owner. */
CREATE TABLE `campus_teacher_credentials` (
    `id` text PRIMARY KEY NOT NULL,
    `owner_id` text NOT NULL,
    `label` text NOT NULL,
    `code_hash` text NOT NULL,
    `created_at` text NOT NULL,
    `revoked_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campus_teacher_credentials_code_hash_unique` ON `campus_teacher_credentials` (`code_hash`);
--> statement-breakpoint
ALTER TABLE `campus_teacher_unlocks` ADD COLUMN `credential_id` text REFERENCES `campus_teacher_credentials`(`id`);
