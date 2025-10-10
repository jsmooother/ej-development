DO $$ 
BEGIN
    -- Drop existing table if it exists
    DROP TABLE IF EXISTS "site_settings";

    -- Create site_settings table
    CREATE TABLE "site_settings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "key_name" text NOT NULL UNIQUE,
        "value" jsonb NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
    );

    -- Insert default content limits
    INSERT INTO "site_settings" ("key_name", "value") 
    VALUES (
        'content_limits',
        '{
            "frontpage": {
                "projects": 3,
                "editorials": 10,
                "instagram": 3
            }
        }'::jsonb
    );

    RAISE NOTICE 'Successfully created site_settings table and inserted default values';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;
END $$;