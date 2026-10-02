CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(64),
	"country" varchar(128),
	"interested_in" varchar(64),
	"message" text,
	"source" varchar(128),
	"created_at" timestamp DEFAULT now() NOT NULL
);
