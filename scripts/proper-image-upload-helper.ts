import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

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
PROPER IMAGE UPLOAD HELPER

This script demonstrates how to properly upload images with the new structure:

1. Storage: /images/projects/{project-slug}/{clean-filename}
2. Database: Proper metadata with tags
3. Naming: project-slug-001.jpg, project-slug-002.jpg
4. Tags: [before, after, gallery, hero] managed in database
*/

interface ProperImageUpload {
  projectSlug: string;
  imagePath: string;
  tags: string[];
  caption?: string;
  altText?: string;
}

async function uploadImageProperly(upload: ProperImageUpload): Promise<string | null> {
  try {
    // Generate clean filename
    const fileExt = path.extname(upload.imagePath);
    const timestamp = Date.now();
    const cleanFilename = `${upload.projectSlug}-${timestamp}${fileExt}`;
    const storagePath = `projects/${upload.projectSlug}/${cleanFilename}`;

    // Read file
    const fileBuffer = fs.readFileSync(upload.imagePath);
    
    // Upload to storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(storagePath, fileBuffer, {
        contentType: `image/${fileExt.slice(1)}`,
        upsert: false
      });

    if (error) {
      console.error(`❌ Upload error: ${error.message}`);
      return null;
    }

    // Generate public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);

    console.log(`✅ Uploaded: ${cleanFilename} → ${storagePath}`);
    return urlData.publicUrl;

  } catch (error) {
    console.error(`❌ Upload error: ${error}`);
    return null;
  }
}

async function updateProjectWithImages(projectSlug: string, images: any[]) {
  try {
    // Get project from database
    const projectResult = await db.select().from(projects).where(eq(projects.slug, projectSlug));
    
    if (projectResult.length === 0) {
      console.error(`❌ Project not found: ${projectSlug}`);
      return;
    }

    const project = projectResult[0];

    // Create proper image objects for database
    const projectImages = images.map((img, index) => ({
      id: randomUUID(),
      url: img.url,
      tags: img.tags,
      caption: img.caption || `${projectSlug} image ${index + 1}`,
      altText: img.altText || `${project.title} - ${img.caption || `Image ${index + 1}`}`,
      uploadedAt: new Date().toISOString(),
      fileSize: img.fileSize || null,
      dimensions: img.dimensions || null
    }));

    // Create image pairs (before/after combinations)
    const beforeImages = projectImages.filter(img => img.tags.includes('before'));
    const afterImages = projectImages.filter(img => img.tags.includes('after'));
    
    const imagePairs = [];
    const maxPairs = Math.min(8, Math.min(beforeImages.length, afterImages.length));
    
    for (let i = 0; i < maxPairs; i++) {
      if (beforeImages[i] && afterImages[i]) {
        imagePairs.push({
          id: randomUUID(),
          label: `Before & After ${i + 1}`,
          beforeImageId: beforeImages[i].id,
          afterImageId: afterImages[i].id
        });
      }
    }

    // Set hero image (first after image, or first gallery image, or first image)
    const heroImage = afterImages[0] || 
                     projectImages.find(img => img.tags.includes('hero')) ||
                     projectImages.find(img => img.tags.includes('gallery')) ||
                     projectImages[0];

    // Update project in database
    await db
      .update(projects)
      .set({
        projectImages: projectImages,
        imagePairs: imagePairs,
        heroImagePath: heroImage?.url || null
      })
      .where(eq(projects.id, project.id));

    console.log(`✅ Updated database for ${project.title}:`);
    console.log(`   📊 Images: ${projectImages.length}`);
    console.log(`   🔗 Pairs: ${imagePairs.length}`);
    console.log(`   🖼️  Hero: ${heroImage ? 'Set' : 'None'}`);

    // Show tag distribution
    const tagCounts = projectImages.reduce((acc: any, img: any) => {
      img.tags.forEach((tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});
    console.log(`   📋 Tags: ${JSON.stringify(tagCounts)}`);

  } catch (error) {
    console.error(`❌ Database update error: ${error}`);
  }
}

async function demonstrateProperUpload() {
  console.log('📚 PROPER IMAGE UPLOAD DEMONSTRATION');
  console.log('=====================================\n');

  console.log('🎯 This script shows the proper way to upload images:');
  console.log('1. Clean filenames: project-slug-timestamp.extension');
  console.log('2. Organized storage: /images/projects/{project-slug}/');
  console.log('3. Proper metadata in database');
  console.log('4. Tag-based categorization\n');

  console.log('📝 EXAMPLE USAGE:');
  console.log(`
// Upload images for a project
const images = [
  {
    imagePath: '/path/to/wallin-revival-before-1.jpg',
    tags: ['before'],
    caption: 'Living room before renovation'
  },
  {
    imagePath: '/path/to/wallin-revival-after-1.jpg', 
    tags: ['after', 'gallery'],
    caption: 'Living room after renovation'
  },
  {
    imagePath: '/path/to/wallin-revival-hero.jpg',
    tags: ['hero', 'gallery'],
    caption: 'Hero image of completed project'
  }
];

// Upload each image
for (const img of images) {
  const url = await uploadImageProperly({
    projectSlug: 'wallin-revival',
    imagePath: img.imagePath,
    tags: img.tags,
    caption: img.caption
  });
  
  if (url) {
    img.url = url;
  }
}

// Update database with all images
await updateProjectWithImages('wallin-revival', images);
  `);

  console.log('\n✅ Proper upload structure ready!');
  console.log('🚀 Use this pattern for all future image uploads');
}

demonstrateProperUpload()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
