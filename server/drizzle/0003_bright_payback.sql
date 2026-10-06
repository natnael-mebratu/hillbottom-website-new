ALTER TABLE "leads" ADD COLUMN "utm_source" varchar(128);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "utm_medium" varchar(128);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "utm_campaign" varchar(128);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "landing_page" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "referrer" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "odoo_lead_id" integer;