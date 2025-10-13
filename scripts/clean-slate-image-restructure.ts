import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const dbUrl = process.env.SUPABASE_DB_URL!;

if (!supabaseUrl || !supabaseKey || !dbUrl) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const client = postgres(dbUrl);
const db = drizzle(client);

/*
PROPER IMAGE STRUCTURE DESIGN:

Storage Structure:
├── images/
│   ├── projects/
│   │   ├── wallin-revival/
│   │   │   ├── IMG_001.jpg
│   │   │   ├── IMG_002.jpg
│   │   │   └── ...
│   │   ├── grand-celeste/
│   │   │   ├── IMG_001.jpg
│   │   │   └── ...
│   │   └── ...
│   └── editorials/
│       ├── editorial-001.jpg
│       ├── editorial-002.jpg
│       └── ...

Database Structure:
- projectImages: Array of objects with proper metadata
- Each image has: id, url, tags[], caption, altText, uploadedAt, fileSize, dimensions
- Tags: ['before', 'after', 'gallery', 'hero', 'thumbnail']
- imagePairs: References to image IDs, not URLs

Best Practices:
1. Clean, descriptive filenames (no UUIDs in filenames)
2. Organized by project folders
3. Database manages categorization via tags
4. Proper metadata stored in database
5. No duplicates
6. Consistent naming convention
*/

async function cleanSlateRestructure() {
  console.log('🧹 CLEAN SLATE IMAGE RESTRUCTURE');
  console.log('=====================================\n');

  console.log('📋 PROPOSED STRUCTURE:');
  console.log('Storage: /images/projects/{project-slug}/{clean-filename}');
  console.log('Database: Proper metadata with tags for categorization');
  console.log('Naming: project-slug-sequential-number.extension');
  console.log('Tags: [before, after, gallery, hero] as needed\n');

  try {
    // Step 1: Clear all existing image data from database
    console.log('🗄️  Step 1: Clearing existing image data from database...');
    
    const allProjects = await db.select().from(projects);
    
    for (const project of allProjects) {
      await db
        .update(projects)
        .set({
          projectImages: [],
          imagePairs: [],
          heroImagePath: null
        })
        .where(eq(projects.id, project.id));
      
      console.log(`   ✅ Cleared: ${project.title}`);
    }

    // Step 2: Delete all existing images from storage
    console.log('\n🗑️  Step 2: Deleting all existing images from storage...');
    
    const { data: allFiles, error: listError } = await supabase.storage
      .from('images')
      .list('', { limit: 1000 });

    if (listError) {
      console.error('❌ Error listing files:', listError);
      return;
    }

    // Delete all files
    for (const file of allFiles || []) {
      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove([file.name]);
      
      if (deleteError) {
        console.log(`   ⚠️  Could not delete ${file.name}: ${deleteError.message}`);
      } else {
        console.log(`   ✅ Deleted: ${file.name}`);
      }
    }

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. ✅ Database cleared of image references');
    console.log('2. ✅ Storage cleaned of all images');
    console.log('3. 📝 Ready for proper image upload with new structure');
    console.log('\n📋 UPLOAD GUIDELINES:');
    console.log('- Use clean filenames: project-slug-001.jpg, project-slug-002.jpg');
    console.log('- Organize in folders: /images/projects/{project-slug}/');
    console.log('- Tag images properly in admin interface');
    console.log('- Let database manage categorization via tags');
    console.log('- No UUIDs in filenames, just sequential numbers');

  } catch (error) {
    console.error('❌ Error during clean slate:', error);
  }
}

cleanSlateRestructure()
  .then(() => {
    console.log('\n✅ Clean slate completed!');
    console.log('🚀 Ready for proper image upload structure!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
