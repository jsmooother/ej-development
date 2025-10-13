import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';

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

async function checkStorageImages() {
  console.log('🔍 Checking Supabase Storage for images...\n');

  try {
    // List all files in the images bucket
    const { data: files, error } = await supabase.storage
      .from('images')
      .list('', { 
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('❌ Error listing storage files:', error);
      return;
    }

    console.log(`📁 Found ${files.length} files in storage:\n`);

    // Group files by project folder
    const projectFolders: { [key: string]: string[] } = {};
    
    files.forEach(file => {
      // Extract project folder from path
      const pathParts = file.name.split('/');
      if (pathParts.length > 1) {
        const projectFolder = pathParts[0];
        if (!projectFolders[projectFolder]) {
          projectFolders[projectFolder] = [];
        }
        projectFolders[projectFolder].push(file.name);
      }
    });

    // Display files by project
    Object.entries(projectFolders).forEach(([project, fileList]) => {
      console.log(`📂 ${project}: ${fileList.length} files`);
      fileList.forEach(file => {
        console.log(`   📄 ${file}`);
      });
      console.log('');
    });

    // Now check what projects we have in database
    console.log('🗄️ Checking database projects...\n');
    const dbProjects = await db.select().from(projects);
    
    for (const project of dbProjects) {
      console.log(`📋 ${project.title} (${project.slug})`);
      
      // Check if storage folder exists for this project
      const hasStorageFolder = Object.keys(projectFolders).some(folder => 
        folder.includes(project.slug) || folder.includes(project.title.toLowerCase().replace(/\s+/g, '-'))
      );
      
      console.log(`   Storage folder exists: ${hasStorageFolder ? '✅' : '❌'}`);
      
      if (project.projectImages && Array.isArray(project.projectImages)) {
        console.log(`   Database images: ${project.projectImages.length}`);
        
        // Check how many have valid URLs
        const validUrls = project.projectImages.filter((img: any) => 
          img.url && img.url.includes('supabase.co/storage')
        );
        console.log(`   Valid URLs: ${validUrls.length}/${project.projectImages.length}`);
        
        // Check how many URLs actually exist in storage
        let existingInStorage = 0;
        for (const img of project.projectImages) {
          if (img.url && img.url.includes('supabase.co/storage')) {
            // Extract file path from URL
            const url = new URL(img.url);
            const filePath = url.pathname.split('/storage/v1/object/public/images/')[1];
            if (filePath && files.some(f => f.name === filePath)) {
              existingInStorage++;
            }
          }
        }
        console.log(`   Exist in storage: ${existingInStorage}/${project.projectImages.length}`);
      } else {
        console.log(`   Database images: None`);
      }
      
      console.log('');
    }

    return { files, projectFolders, dbProjects };

  } catch (error) {
    console.error('❌ Error checking storage:', error);
    return null;
  }
}

checkStorageImages()
  .then((result) => {
    if (result) {
      console.log('✅ Storage check completed!');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
