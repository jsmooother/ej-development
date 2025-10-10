-- Add missing columns to projects table
DO $$ 
BEGIN
    -- Add is_coming_soon if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'is_coming_soon') THEN
        ALTER TABLE "projects" ADD COLUMN "is_coming_soon" boolean NOT NULL DEFAULT false;
    END IF;

    -- Add is_hero if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'is_hero') THEN
        ALTER TABLE "projects" ADD COLUMN "is_hero" boolean NOT NULL DEFAULT false;
    END IF;
END $$;
