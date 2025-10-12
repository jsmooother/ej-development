-- Add project_images and image_pairs columns to projects table
ALTER TABLE "projects" ADD COLUMN "project_images" jsonb;
ALTER TABLE "projects" ADD COLUMN "image_pairs" jsonb;

