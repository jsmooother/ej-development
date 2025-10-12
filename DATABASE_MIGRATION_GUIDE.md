# Database Migration Guide - Add Project Image Columns

## Issue
The new image management system requires two new columns in the `projects` table:
- `project_images` - JSONB array storing all project images with tags
- `image_pairs` - JSONB array storing before/after image pairs

## Solution

### Option 1: Supabase SQL Editor (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Copy and paste this SQL:**
   ```sql
   ALTER TABLE "projects" 
   ADD COLUMN IF NOT EXISTS "project_images" jsonb DEFAULT '[]'::jsonb,
   ADD COLUMN IF NOT EXISTS "image_pairs" jsonb DEFAULT '[]'::jsonb;
   ```

4. **Run the query**
   - Click "Run" or press Cmd+Enter
   - You should see "Success. No rows returned"

5. **Verify the columns were added:**
   ```sql
   SELECT column_name, data_type, column_default
   FROM information_schema.columns
   WHERE table_name = 'projects' 
   AND column_name IN ('project_images', 'image_pairs');
   ```
   
   You should see both columns listed.

### Option 2: Using psql Command Line

If you have the Supabase connection string:

```bash
psql "your-supabase-connection-string" -f scripts/add-project-image-columns.sql
```

### Option 3: Use Supabase Client

Run this TypeScript script:

```typescript
// scripts/apply-image-columns-migration.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      ALTER TABLE "projects" 
      ADD COLUMN IF NOT EXISTS "project_images" jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS "image_pairs" jsonb DEFAULT '[]'::jsonb;
    `
  });
  
  if (error) {
    console.error('Migration failed:', error);
  } else {
    console.log('✅ Migration successful!', data);
  }
}

migrate();
```

## After Migration

Once the columns are added:

1. **Restart your dev server** (if running)
2. **Test the project edit page** - Facts and images should now save properly
3. **Deploy to Vercel** - The production database will also need this migration

## How Project Facts Are Displayed

Project facts are displayed on the frontend in these locations:

### 1. Project List Page (`/projects`)
- Shows `sqm` (square meters) as badge on top-left
- Shows `bedrooms` as badge on bottom-right ("rum" in Swedish)

### 2. Project Detail Page (`/projects/[slug]`)
- Shows `sqm`, `bedrooms`, `bathrooms` as quick stats with icons
- Located in the hero section below the title

### Example Facts Structure:
```json
{
  "Location": "Marbella",
  "Size (m²)": 450,
  "Bedrooms": 5,
  "Bathrooms": 4,
  "Pool": "Yes",
  "Sea Views": "Yes"
}
```

The frontend looks for these specific keys:
- `sqm` or `Size (m²)` - Square meters
- `bedrooms` or `Bedrooms` - Number of bedrooms  
- `bathrooms` or `Bathrooms` - Number of bathrooms

Any other facts you add will be stored but may not display automatically (you can add frontend code to display them later).

## Troubleshooting

If you get "column already exists" error:
- The migration already ran successfully, you're good to go!

If you get permission errors:
- Make sure you're using the Service Role Key, not the anon key
- Or run the SQL directly in Supabase SQL Editor (has full permissions)

