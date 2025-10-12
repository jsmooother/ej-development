-- Add project_images and image_pairs columns to projects table
-- Run this in Supabase SQL Editor

ALTER TABLE "projects" 
ADD COLUMN IF NOT EXISTS "project_images" jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS "image_pairs" jsonb DEFAULT '[]'::jsonb;

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'projects' 
AND column_name IN ('project_images', 'image_pairs');

