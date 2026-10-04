CREATE TABLE `collection` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`card` text NOT NULL,
	`lang` text NOT NULL,
	`variant` text NOT NULL,
	`condition` text NOT NULL,
	`quantity` integer NOT NULL,
	`cost` real NOT NULL,
	`metadata` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `snapshots` (
	`card` text NOT NULL,
	`lang` text NOT NULL,
	`variant` text NOT NULL,
	`day` text NOT NULL,
	`price` real NOT NULL,
	`updated` text NOT NULL,
	PRIMARY KEY(`card`, `lang`, `variant`, `day`)
);
