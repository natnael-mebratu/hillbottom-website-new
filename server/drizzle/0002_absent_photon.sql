CREATE TABLE "sister_companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"summary" text,
	"logo_url" text,
	"website_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "current_stage" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "next_milestone" varchar(255);--> statement-breakpoint
ALTER TABLE "site_media" ADD COLUMN "promo_video_url" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_media" ADD COLUMN "promo_gift_title" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_media" ADD COLUMN "promo_gift_body" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_media" ADD COLUMN "promo_partner_url" text DEFAULT '' NOT NULL;