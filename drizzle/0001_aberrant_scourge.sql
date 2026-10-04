CREATE TABLE `price_cache` (
	`key` text PRIMARY KEY NOT NULL,
	`fetched` text NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_collection_owner` ON `collection` (`owner`);