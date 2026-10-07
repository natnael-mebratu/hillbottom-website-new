ALTER TABLE "projects" ALTER COLUMN "completion_percent" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "completion_percent" DROP NOT NULL;