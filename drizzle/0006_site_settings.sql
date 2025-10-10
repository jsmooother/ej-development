-- Create site_settings table
CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" text NOT NULL UNIQUE,
  "value" jsonb NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- Insert default content limits
INSERT INTO "site_settings" ("key", "value") 
VALUES (
  'content_limits',
  '{
    "frontpage": {
      "projects": 3,
      "editorials": 10,
      "instagram": 3
    }
  }'::jsonb
) ON CONFLICT ("key") DO UPDATE 
SET "value" = EXCLUDED.value,
    "updated_at" = now();
