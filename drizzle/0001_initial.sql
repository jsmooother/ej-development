CREATE TYPE "listing_status" AS ENUM ('coming_soon', 'for_sale', 'sold');

CREATE TYPE "profile_role" AS ENUM ('admin', 'editor');

CREATE TYPE "listing_document_type" AS ENUM ('floorplan', 'brochure', 'document');

CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "brand_name" text NOT NULL,
  "primary_instagram_username" text NOT NULL,
  "instagram_access_token" text,
  "contact_email" text,
  "contact_phone" text,
  "address" text,
  "hero_video_url" text,
  "mapbox_token" text,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "listings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "subtitle" text,
  "description" text,
  "facts" jsonb,
  "location" jsonb,
  "status" listing_status NOT NULL DEFAULT 'for_sale',
  "hero_image_path" text,
  "hero_video_url" text,
  "brochure_pdf_path" text,
  "is_published" boolean NOT NULL DEFAULT true,
  "published_at" timestamptz,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "listings_slug_idx" ON "listings" ("slug");
CREATE INDEX IF NOT EXISTS "listings_status_idx" ON "listings" ("status");

CREATE TABLE IF NOT EXISTS "listing_images" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "listing_id" uuid NOT NULL,
  "image_path" text NOT NULL,
  "alt_text" text,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamptz DEFAULT now(),
  CONSTRAINT "listing_images_listing_id_fkey"
    FOREIGN KEY ("listing_id") REFERENCES "listings" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "listing_images_listing_idx" ON "listing_images" ("listing_id");

CREATE TABLE IF NOT EXISTS "listing_documents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "listing_id" uuid NOT NULL,
  "label" text NOT NULL,
  "document_path" text NOT NULL,
  "document_type" listing_document_type NOT NULL DEFAULT 'floorplan',
  "sort_order" integer DEFAULT 0,
  "created_at" timestamptz DEFAULT now(),
  CONSTRAINT "listing_documents_listing_id_fkey"
    FOREIGN KEY ("listing_id") REFERENCES "listings" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "listing_documents_listing_idx" ON "listing_documents" ("listing_id");

CREATE TABLE IF NOT EXISTS "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "summary" text,
  "content" text,
  "year" integer,
  "facts" jsonb,
  "hero_image_path" text,
  "is_published" boolean NOT NULL DEFAULT true,
  "published_at" timestamptz,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "projects_slug_idx" ON "projects" ("slug");
CREATE INDEX IF NOT EXISTS "projects_year_idx" ON "projects" ("year");

CREATE TABLE IF NOT EXISTS "project_images" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" uuid NOT NULL,
  "image_path" text NOT NULL,
  "alt_text" text,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamptz DEFAULT now(),
  CONSTRAINT "project_images_project_id_fkey"
    FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "project_images_project_idx" ON "project_images" ("project_id");

CREATE TABLE IF NOT EXISTS "posts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "excerpt" text,
  "content" text,
  "cover_image_path" text,
  "tags" text[],
  "is_published" boolean NOT NULL DEFAULT true,
  "published_at" timestamptz,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" ("slug");
CREATE INDEX IF NOT EXISTS "posts_published_idx" ON "posts" ("is_published");

CREATE TABLE IF NOT EXISTS "enquiries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text,
  "message" text NOT NULL,
  "context" jsonb,
  "source" text NOT NULL DEFAULT 'contact',
  "created_at" timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "enquiries_created_idx" ON "enquiries" ("created_at");

CREATE TABLE IF NOT EXISTS "instagram_cache" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "fetched_at" timestamptz DEFAULT now(),
  "payload" jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS "profiles" (
  "user_id" uuid PRIMARY KEY,
  "role" profile_role NOT NULL DEFAULT 'editor',
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
