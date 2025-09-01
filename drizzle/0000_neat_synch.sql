CREATE TABLE `Account` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`type` text,
	`provider` text,
	`providerAccountId` text,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text
);
--> statement-breakpoint
CREATE TABLE `Comment` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text,
	`postId` text,
	`userId` text,
	`parentId` text,
	`createdAt` integer DEFAULT '"2025-09-01T06:59:05.617Z"',
	`updatedAt` integer DEFAULT '"2025-09-01T06:59:05.617Z"'
);
--> statement-breakpoint
CREATE TABLE `Post` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`content` text,
	`userId` text,
	`topicId` text,
	`createdAt` integer DEFAULT '"2025-09-01T06:59:05.617Z"',
	`updatedAt` integer DEFAULT '"2025-09-01T06:59:05.617Z"'
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`sessionToken` text,
	`userId` text,
	`expires` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Session_sessionToken_unique` ON `Session` (`sessionToken`);--> statement-breakpoint
CREATE TABLE `Topic` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text,
	`description` text,
	`createdAt` integer DEFAULT '"2025-09-01T06:59:05.617Z"',
	`updatedAt` integer DEFAULT '"2025-09-01T06:59:05.617Z"'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Topic_slug_unique` ON `Topic` (`slug`);--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` integer,
	`image` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);--> statement-breakpoint
CREATE TABLE `VerificationToken` (
	`identifier` text,
	`token` text,
	`expires` integer,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `VerificationToken_token_unique` ON `VerificationToken` (`token`);