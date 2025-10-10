-- Add isComingSoon flag to projects table
ALTER TABLE "projects" ADD COLUMN "is_coming_soon" boolean NOT NULL DEFAULT false;
