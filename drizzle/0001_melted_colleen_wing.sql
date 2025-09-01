CREATE TABLE `snippet` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`code` text NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Account` (
	`id` text,
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Account`("id", "userId", "type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state") SELECT "id", "userId", "type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state" FROM `Account`;--> statement-breakpoint
DROP TABLE `Account`;--> statement-breakpoint
ALTER TABLE `__new_Account` RENAME TO `Account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_Comment` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`postId` text NOT NULL,
	`userId` text NOT NULL,
	`parentId` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parentId`) REFERENCES `Comment`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Comment`("id", "content", "postId", "userId", "parentId", "createdAt", "updatedAt") SELECT "id", "content", "postId", "userId", "parentId", "createdAt", "updatedAt" FROM `Comment`;--> statement-breakpoint
DROP TABLE `Comment`;--> statement-breakpoint
ALTER TABLE `__new_Comment` RENAME TO `Comment`;--> statement-breakpoint
CREATE TABLE `__new_Post` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`userId` text NOT NULL,
	`topicId` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topicId`) REFERENCES `Topic`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Post`("id", "title", "content", "userId", "topicId", "createdAt", "updatedAt") SELECT "id", "title", "content", "userId", "topicId", "createdAt", "updatedAt" FROM `Post`;--> statement-breakpoint
DROP TABLE `Post`;--> statement-breakpoint
ALTER TABLE `__new_Post` RENAME TO `Post`;--> statement-breakpoint
CREATE TABLE `__new_Session` (
	`sessionToken` text NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Session`("sessionToken", "userId", "expires") SELECT "sessionToken", "userId", "expires" FROM `Session`;--> statement-breakpoint
DROP TABLE `Session`;--> statement-breakpoint
ALTER TABLE `__new_Session` RENAME TO `Session`;--> statement-breakpoint
CREATE UNIQUE INDEX `Session_sessionToken_unique` ON `Session` (`sessionToken`);--> statement-breakpoint
DROP INDEX "Session_sessionToken_unique";--> statement-breakpoint
DROP INDEX "Topic_slug_unique";--> statement-breakpoint
DROP INDEX "User_email_unique";--> statement-breakpoint
DROP INDEX "VerificationToken_token_unique";--> statement-breakpoint
ALTER TABLE `Topic` ALTER COLUMN "slug" TO "slug" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `Topic_slug_unique` ON `Topic` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `VerificationToken_token_unique` ON `VerificationToken` (`token`);--> statement-breakpoint
ALTER TABLE `Topic` ALTER COLUMN "description" TO "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE `Topic` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `Topic` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `User` ALTER COLUMN "email" TO "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE `VerificationToken` ALTER COLUMN "identifier" TO "identifier" text NOT NULL;--> statement-breakpoint
ALTER TABLE `VerificationToken` ALTER COLUMN "token" TO "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE `VerificationToken` ALTER COLUMN "expires" TO "expires" integer NOT NULL;