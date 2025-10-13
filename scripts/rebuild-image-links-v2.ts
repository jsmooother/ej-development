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

async function rebuildImageLinks() {
  console.log('🔧 Rebuilding image links with proper tagging...\n');

  try {
    // Get all projects
    const allProjects = await db.select().from(projects);
    
    for (const project of allProjects) {
      console.log(`📁 Processing: ${project.title} (${project.slug})`);
      
      // Get all images from storage for this project
      const { data: beforeFiles } = await supabase.storage
        .from('images')
        .list(`${project.slug}/before`, { limit: 1000 });

      const { data: afterFiles } = await supabase.storage
        .from('images')
        .list(`${project.slug}/after`, { limit: 1000 });

      const beforeImages = beforeFiles || [];
      const afterImages = afterFiles || [];

      console.log(`   📄 Found in storage: ${beforeImages.length} before, ${afterImages.length} after`);

      if (beforeImages.length === 0 && afterImages.length === 0) {
        console.log(`   ⚠️  No images found in storage, skipping`);
        continue;
      }

      // Create new projectImages array with proper tagging
      const newProjectImages: any[] = [];
      
      // Process before images - tag them as "before"
      beforeImages.forEach((file, index) => {
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(`${project.slug}/before/${file.name}`);
        
        newProjectImages.push({
          id: file.name.split('-')[0] || `img-${index}`,
          url: data.publicUrl,
          tags: ['before'], // Tag determines category, not folder structure
          caption: file.name.replace(/^[^-]+-/, '').replace(/\.[^/.]+$/, '') // Remove UUID prefix and extension
        });
      });

      // Process after images - tag them as "after" and some as "gallery"
      afterImages.forEach((file, index) => {
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(`${project.slug}/after/${file.name}`);
        
        // Tag some after images as "gallery" for variety (every 5th image)
        const tags = index % 5 === 0 ? ['after', 'gallery'] : ['after'];
        
        newProjectImages.push({
          id: file.name.split('-')[0] || `img-${index + beforeImages.length}`,
          url: data.publicUrl,
          tags: tags, // Tag determines category, not folder structure
          caption: file.name.replace(/^[^-]+-/, '').replace(/\.[^/.]+$/, '') // Remove UUID prefix and extension
        });
      });

      console.log(`   🔗 Created ${newProjectImages.length} new image links`);

      // Create new imagePairs array (limit to 8 pairs)
      const newImagePairs: any[] = [];
      const beforeImagesWithIds = newProjectImages.filter(img => img.tags.includes('before'));
      const afterImagesWithIds = newProjectImages.filter(img => img.tags.includes('after'));
      
      const maxPairs = Math.min(8, Math.min(beforeImagesWithIds.length, afterImagesWithIds.length));
      
      for (let i = 0; i < maxPairs; i++) {
        if (beforeImagesWithIds[i] && afterImagesWithIds[i]) {
          newImagePairs.push({
            id: `pair-${i + 1}`,
            label: `Before & After ${i + 1}`,
            beforeImageId: beforeImagesWithIds[i].id,
            afterImageId: afterImagesWithIds[i].id
          });
        }
      }

      console.log(`   🔗 Created ${newImagePairs.length} image pairs`);

      // Count tags for verification
      const tagCounts = newProjectImages.reduce((acc: any, img: any) => {
        img.tags.forEach((tag: string) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {});

      console.log(`   📊 Tag distribution:`, tagCounts);

      // Update the project in database
      await db
        .update(projects)
        .set({
          projectImages: newProjectImages,
          imagePairs: newImagePairs,
          // Set hero image to first after image if available
          heroImagePath: afterImagesWithIds[0]?.url || beforeImagesWithIds[0]?.url || null
        })
        .where(eq(projects.id, project.id));

      console.log(`   ✅ Updated database for ${project.title}`);
      console.log('');
    }

    console.log('🎉 All image links rebuilt successfully with proper tagging!');

  } catch (error) {
    console.error('❌ Error rebuilding image links:', error);
  }
}

rebuildImageLinks()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
