CREATE TABLE IF NOT EXISTS "coming_soon_projects" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" text NOT NULL,
    "description" text NOT NULL,
    "highlights" text[] NOT NULL,
    "is_active" boolean NOT NULL DEFAULT false,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
