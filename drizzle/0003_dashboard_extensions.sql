DO $$
BEGIN
    CREATE TYPE "project_image_variant" AS ENUM ('hero', 'before', 'after', 'detail');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "project_images"
ADD COLUMN IF NOT EXISTS "variant" "project_image_variant" NOT NULL DEFAULT 'detail';

ALTER TABLE "projects"
ADD COLUMN IF NOT EXISTS "location" text,
ADD COLUMN IF NOT EXISTS "before_image_path" text,
ADD COLUMN IF NOT EXISTS "after_image_path" text;

ALTER TABLE "posts"
ADD COLUMN IF NOT EXISTS "secondary_image_path" text;
