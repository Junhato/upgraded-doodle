CREATE TABLE `patients` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text,
	`middle_name` text DEFAULT '',
	`last_name` text,
	`date_of_birth` text,
	`status` text DEFAULT 'Inquiry',
	`street` text,
	`city` text,
	`state` text,
	`zip_code` text,
	`country` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
