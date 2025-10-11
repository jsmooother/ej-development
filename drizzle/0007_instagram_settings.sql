-- Create Instagram settings table
CREATE TABLE IF NOT EXISTS "instagram_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text,
	"access_token" text,
	"refresh_token" text,
	"token_expires_at" timestamp with time zone,
	"user_id" text,
	"is_connected" boolean DEFAULT false NOT NULL,
	"auto_sync" boolean DEFAULT true NOT NULL,
	"sync_interval" integer DEFAULT 24 NOT NULL,
	"last_sync" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

