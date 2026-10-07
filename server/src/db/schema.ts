import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", [
  "completed",
  "ongoing",
  "under_construction",
  "upcoming",
]);

export const progressEntryTypeEnum = pgEnum("progress_entry_type", [
  "dream",
  "actual",
]);

export const adminRoleEnum = pgEnum("admin_role", ["admin", "editor"]);

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: adminRoleEnum("role").notNull().default("editor"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  status: projectStatusEnum("status").notNull().default("upcoming"),
  location: varchar("location", { length: 255 }),
  summary: text("summary"),
  heroImageUrl: text("hero_image_url"),
  // Baseline info uploaded once at project start: unit types, sizes,
  // availability, floor plan links — free-form so it can vary per project
  // without schema churn.
  unitTypes: jsonb("unit_types").notNull().default([]),
  floorPlans: jsonb("floor_plans").notNull().default([]),
  // Nullable, no default: null means "never set by an admin" and is
  // overlay-skipped by _build/data.mjs's mergeLiveProject so an untouched
  // row can never silently clobber a project's curated editorial pct with
  // a false "0% complete". Only an explicit admin-set 0 means 0.
  completionPercent: integer("completion_percent"),
  // Drives the construction.html per-project status cards on the static
  // site — a short human label, not a structured milestone record (that's
  // what progressUpdates is for).
  currentStage: varchar("current_stage", { length: 255 }),
  nextMilestone: varchar("next_milestone", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const progressUpdates = pgTable("progress_updates", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  type: progressEntryTypeEnum("type").notNull(),
  mediaUrl: text("media_url").notNull(),
  caption: text("caption"),
  milestoneLabel: varchar("milestone_label", { length: 255 }),
  completionPercent: integer("completion_percent"),
  postedAt: timestamp("posted_at").notNull().defaultNow(),
});

export const pricingPlans = pgTable("pricing_plans", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  unitType: varchar("unit_type", { length: 255 }).notNull(),
  price: numeric("price", { precision: 14, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 8 }).notNull().default("ETB"),
  installmentPlan: jsonb("installment_plan").notNull().default([]),
  discountRules: jsonb("discount_rules").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImageUrl: text("cover_image_url"),
  author: varchar("author", { length: 255 }),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const marketingPosts = pgTable("marketing_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body"),
  mediaUrl: text("media_url"),
  campaignTag: varchar("campaign_tag", { length: 255 }),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  country: varchar("country", { length: 128 }),
  interestedIn: varchar("interested_in", { length: 64 }),
  message: text("message"),
  source: varchar("source", { length: 128 }),
  // Campaign attribution the site's inquiry form already captures
  // client-side (assets/js/hb.js submitInquiry) — persisted so a lead's
  // originating campaign survives past the session that created it.
  utmSource: varchar("utm_source", { length: 128 }),
  utmMedium: varchar("utm_medium", { length: 128 }),
  utmCampaign: varchar("utm_campaign", { length: 128 }),
  landingPage: text("landing_page"),
  referrer: text("referrer"),
  // Set once this lead is pushed to Odoo as a crm.lead (see
  // src/integrations/odoo.ts) — lets us avoid double-creating it on retry
  // and gives a direct link from our record to the CRM opportunity.
  odooLeadId: integer("odoo_lead_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Singleton row (id always 1) holding site-wide admin-managed media config —
// replaces the old localStorage-based adminStorage.ts fallback.
export const siteMedia = pgTable("site_media", {
  id: integer("id").primaryKey().default(1),
  heroVideoUrl: text("hero_video_url").notNull().default(""),
  featuredProjectVideoUrl: text("featured_project_video_url")
    .notNull()
    .default(""),
  virtualTourProvider: varchar("virtual_tour_provider", { length: 32 })
    .notNull()
    .default("iframe"),
  virtualTourUrl: text("virtual_tour_url").notNull().default(""),
  virtualTourTitle: varchar("virtual_tour_title", { length: 255 })
    .notNull()
    .default(""),
  // Billboard-QR promo landing page (promo.html) — video + giveaway copy,
  // editable without touching _build/pages/promo.mjs by hand.
  promoVideoUrl: text("promo_video_url").notNull().default(""),
  promoGiftTitle: varchar("promo_gift_title", { length: 255 }).notNull().default(""),
  promoGiftBody: text("promo_gift_body").notNull().default(""),
  promoPartnerUrl: text("promo_partner_url").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Sister/affiliate companies shown on their own page — logo, blurb, link out.
export const sisterCompanies = pgTable("sister_companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  summary: text("summary"),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
