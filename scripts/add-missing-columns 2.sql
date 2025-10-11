-- Add missing columns to projects table
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "is_coming_soon" boolean NOT NULL DEFAULT false;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "is_hero" boolean NOT NULL DEFAULT false;
