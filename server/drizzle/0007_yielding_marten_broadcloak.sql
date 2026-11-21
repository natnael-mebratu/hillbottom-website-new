ALTER TABLE "pricing_plans" ADD COLUMN "units_left" integer;--> statement-breakpoint
ALTER TABLE "site_media" ADD COLUMN "price_calc_promo_active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "site_media" ADD COLUMN "price_calc_promo_text" text DEFAULT '' NOT NULL;