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

async function consolidateImages() {
  console.log('📁 Consolidating all images into single folder...\n');

  try {
    // Get all projects
    const allProjects = await db.select().from(projects);
    
    const consolidatedImages: any[] = [];
    let totalImagesProcessed = 0;

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

      console.log(`   📄 Found: ${beforeImages.length} before, ${afterImages.length} after`);

      if (beforeImages.length === 0 && afterImages.length === 0) {
        console.log(`   ⚠️  No images found, skipping`);
        continue;
      }

      // Process before images
      beforeImages.forEach((file, index) => {
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(`${project.slug}/before/${file.name}`);
        
        // Generate new filename with project prefix
        const newFilename = `${project.slug}-before-${file.name}`;
        
        consolidatedImages.push({
          id: file.name.split('-')[0] || `img-${totalImagesProcessed}`,
          url: `https://bwddpoellslqtuyrioau.supabase.co/storage/v1/object/public/images/all-images/${newFilename}`,
          tags: ['before'],
          caption: file.name.replace(/^[^-]+-/, '').replace(/\.[^/.]+$/, ''),
          projectSlug: project.slug,
          originalPath: `${project.slug}/before/${file.name}`,
          newPath: `all-images/${newFilename}`
        });
        
        totalImagesProcessed++;
      });

      // Process after images
      afterImages.forEach((file, index) => {
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(`${project.slug}/after/${file.name}`);
        
        // Generate new filename with project prefix
        const newFilename = `${project.slug}-after-${file.name}`;
        
        // Tag some after images as "gallery" for variety (every 5th image)
        const tags = index % 5 === 0 ? ['after', 'gallery'] : ['after'];
        
        consolidatedImages.push({
          id: file.name.split('-')[0] || `img-${totalImagesProcessed}`,
          url: `https://bwddpoellslqtuyrioau.supabase.co/storage/v1/object/public/images/all-images/${newFilename}`,
          tags: tags,
          caption: file.name.replace(/^[^-]+-/, '').replace(/\.[^/.]+$/, ''),
          projectSlug: project.slug,
          originalPath: `${project.slug}/after/${file.name}`,
          newPath: `all-images/${newFilename}`
        });
        
        totalImagesProcessed++;
      });

      console.log(`   ✅ Processed ${beforeImages.length + afterImages.length} images`);
    }

    console.log(`\n📊 Total images to consolidate: ${totalImagesProcessed}`);
    console.log(`📁 All images will be stored in: all-images/ folder`);
    console.log(`🔗 Database will manage categorization via tags\n`);

    // Group images by project for database updates
    const imagesByProject = consolidatedImages.reduce((acc: any, img: any) => {
      if (!acc[img.projectSlug]) {
        acc[img.projectSlug] = [];
      }
      acc[img.projectSlug].push(img);
      return acc;
    }, {});

    // Update each project's database record
    for (const project of allProjects) {
      const projectImages = imagesByProject[project.slug] || [];
      
      if (projectImages.length === 0) {
        console.log(`⚠️  No images for ${project.title}, skipping database update`);
        continue;
      }

      console.log(`🗄️  Updating database for: ${project.title}`);

      // Create imagePairs array
      const beforeImages = projectImages.filter(img => img.tags.includes('before'));
      const afterImages = projectImages.filter(img => img.tags.includes('after'));
      
      const newImagePairs: any[] = [];
      const maxPairs = Math.min(8, Math.min(beforeImages.length, afterImages.length));
      
      for (let i = 0; i < maxPairs; i++) {
        if (beforeImages[i] && afterImages[i]) {
          newImagePairs.push({
            id: `pair-${i + 1}`,
            label: `Before & After ${i + 1}`,
            beforeImageId: beforeImages[i].id,
            afterImageId: afterImages[i].id
          });
        }
      }

      // Clean up the project images for database storage (remove temporary fields)
      const cleanProjectImages = projectImages.map(img => ({
        id: img.id,
        url: img.url,
        tags: img.tags,
        caption: img.caption
      }));

      // Count tags for verification
      const tagCounts = cleanProjectImages.reduce((acc: any, img: any) => {
        img.tags.forEach((tag: string) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {});

      console.log(`   📊 Tags: ${JSON.stringify(tagCounts)}`);
      console.log(`   🔗 Pairs: ${newImagePairs.length}`);

      // Update the project in database
      await db
        .update(projects)
        .set({
          projectImages: cleanProjectImages,
          imagePairs: newImagePairs,
          heroImagePath: afterImages[0]?.url || beforeImages[0]?.url || null
        })
        .where(eq(projects.id, project.id));

      console.log(`   ✅ Database updated\n`);
    }

    console.log('🎉 Database consolidation completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Move all images to all-images/ folder in storage');
    console.log('2. Update storage URLs to point to new consolidated folder');
    console.log('3. Delete old project-specific folders');
    console.log('\n💡 Benefits:');
    console.log('- Single storage folder for all images');
    console.log('- Database manages categorization via tags');
    console.log('- Cleaner storage structure');
    console.log('- Easier backup and maintenance');

  } catch (error) {
    console.error('❌ Error consolidating images:', error);
  }
}

consolidateImages()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
