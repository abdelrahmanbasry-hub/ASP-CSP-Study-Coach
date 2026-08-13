CREATE TABLE `learner_progress` (
	`user_id` text PRIMARY KEY NOT NULL,
	`state_json` text NOT NULL,
	`schema_version` integer DEFAULT 1 NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
