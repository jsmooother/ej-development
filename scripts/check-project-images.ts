import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';

config({ path: '.env.local' });

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  throw new Error('SUPABASE_DB_URL not found in environment');
}

const client = postgres(dbUrl);
const db = drizzle(client);

async function checkProjectImages() {
  console.log('🔍 Checking project images in database...\n');

  try {
    const allProjects = await db.select().from(projects);
    
    console.log(`Found ${allProjects.length} projects in database:\n`);
    
    for (const project of allProjects) {
      console.log(`📁 Project: ${project.title}`);
      console.log(`   ID: ${project.id}`);
      console.log(`   Slug: ${project.slug}`);
      console.log(`   Published: ${project.isPublished}`);
      console.log(`   Hero Image: ${project.heroImagePath || 'None'}`);
      
      // Check projectImages
      if (project.projectImages && Array.isArray(project.projectImages)) {
        console.log(`   Project Images: ${project.projectImages.length}`);
        
        // Count by tags
        const tagCounts = project.projectImages.reduce((acc: any, img: any) => {
          if (img.tags && Array.isArray(img.tags)) {
            img.tags.forEach((tag: string) => {
              acc[tag] = (acc[tag] || 0) + 1;
            });
          }
          return acc;
        }, {});
        
        console.log(`   Tag counts:`, tagCounts);
        
        // Check for missing URLs
        const missingUrls = project.projectImages.filter((img: any) => !img.url || img.url === '');
        if (missingUrls.length > 0) {
          console.log(`   ⚠️  Missing URLs: ${missingUrls.length} images`);
          missingUrls.forEach((img: any, index: number) => {
            console.log(`      ${index + 1}. ID: ${img.id}, URL: "${img.url}"`);
          });
        }
      } else {
        console.log(`   Project Images: None or invalid format`);
      }
      
      // Check imagePairs
      if (project.imagePairs && Array.isArray(project.imagePairs)) {
        console.log(`   Image Pairs: ${project.imagePairs.length}`);
        project.imagePairs.forEach((pair: any, index: number) => {
          console.log(`      ${index + 1}. ${pair.label} (Before: ${pair.beforeImageId}, After: ${pair.afterImageId})`);
        });
      } else {
        console.log(`   Image Pairs: None or invalid format`);
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error checking projects:', error);
  }
}

checkProjectImages()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
