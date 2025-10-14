import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const dbUrl = process.env.SUPABASE_DB_URL!;

const supabase = createClient(supabaseUrl, supabaseKey);
const client = postgres(dbUrl);
const db = drizzle(client);

async function cleanupByTimestamp() {
  console.log('🧹 CLEANUP DUPLICATE FILES BY TIMESTAMP');
  console.log('=======================================\n');
  
  // Get all projects and their image URLs from database
  const allProjects = await db.select().from(projects);
  
  const usedUrls = new Set<string>();
  
  for (const project of allProjects) {
    console.log(`📁 ${project.title} (${project.slug})`);
    
    // Extract all image URLs from projectImages
    const images = (project.projectImages || []) as any[];
    images.forEach((img: any) => {
      if (img.url) {
        usedUrls.add(img.url);
      }
    });
    
    console.log(`   Database has ${images.length} image URLs`);
  }
  
  console.log(`\n📊 Total URLs in database: ${usedUrls.size}\n`);
  
  // Now list all files in storage and delete those not in the database
  const projectSlugs = ['classic-pearl', 'grand-celeste', 'no1-o-stermalm', 'the-nest', 'wallin-revival'];
  
  let totalDeleted = 0;
  
  for (const slug of projectSlugs) {
    console.log(`\n🔍 Checking projects/${slug}/`);
    
    const { data: files, error } = await supabase.storage
      .from('images')
      .list(`projects/${slug}`, { limit: 1000 });
    
    if (error || !files) {
      console.error(`   ❌ Error: ${error?.message}`);
      continue;
    }
    
    const actualFiles = files.filter(f => f.name !== '.emptyFolderPlaceholder');
    console.log(`   Found ${actualFiles.length} files in storage`);
    
    const filesToDelete: string[] = [];
    
    for (const file of actualFiles) {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/images/projects/${slug}/${file.name}`;
      
      if (!usedUrls.has(publicUrl)) {
        filesToDelete.push(`projects/${slug}/${file.name}`);
      }
    }
    
    if (filesToDelete.length > 0) {
      console.log(`   🗑️  Deleting ${filesToDelete.length} unused files...`);
      
      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove(filesToDelete);
      
      if (deleteError) {
        console.error(`   ❌ Error deleting: ${deleteError.message}`);
      } else {
        console.log(`   ✅ Deleted ${filesToDelete.length} files`);
        totalDeleted += filesToDelete.length;
      }
    } else {
      console.log(`   ✅ No unused files found`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n✅ Cleanup complete!`);
  console.log(`📊 Total unused files deleted: ${totalDeleted}`);
  
  // Final verification
  console.log('\n🔍 Final verification...\n');
  
  for (const slug of projectSlugs) {
    const { data: files } = await supabase.storage
      .from('images')
      .list(`projects/${slug}`, { limit: 1000 });
    
    const fileCount = files?.filter(f => f.name !== '.emptyFolderPlaceholder').length || 0;
    console.log(`   projects/${slug}/: ${fileCount} files`);
  }
}

cleanupByTimestamp()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
