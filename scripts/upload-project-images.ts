import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { getDatabaseConnectionString, getSupabaseSecretKey } from '../src/lib/supabase/keys';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = getSupabaseSecretKey();
const dbUrl = getDatabaseConnectionString();

if (!supabaseUrl || !supabaseKey || !dbUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, or database URL');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const usePool = dbUrl.includes('pooler.supabase') || dbUrl.includes('pgbouncer=true');
const client = postgres(dbUrl, { ssl: 'require', max: 1, ...(usePool ? { prepare: false } : {}) });
const db = drizzle(client);

// Mapping of folder names to project slugs in database
const PROJECT_MAPPING: Record<string, string> = {
  'Project - Classic Pearl': 'classic-pearl',
  'Project - Grand Celeste': 'grand-celeste',
  'Project - No1 Östermalm': 'no1-o-stermalm', // Note: database slug has hyphen between o and stermalm
  'Project - The Nest': 'the-nest',
  'Project - Wallin Revival': 'wallin-revival'
};

async function uploadImageToStorage(
  projectSlug: string,
  localPath: string,
  tags: string[]
): Promise<string | null> {
  try {
    // Generate clean filename
    const fileExt = path.extname(localPath).toLowerCase();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanFilename = `${projectSlug}-${timestamp}-${randomSuffix}${fileExt}`;
    const storagePath = `projects/${projectSlug}/${cleanFilename}`;

    // Read file
    const fileBuffer = fs.readFileSync(localPath);
    
    // Fix MIME type for jpg files
    let mimeType = fileExt.slice(1);
    if (mimeType === 'jpg') {
      mimeType = 'jpeg';
    }
    
    // Upload to storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(storagePath, fileBuffer, {
        contentType: `image/${mimeType}`,
        upsert: false
      });

    if (error) {
      console.error(`❌ Upload error for ${path.basename(localPath)}: ${error.message}`);
      return null;
    }

    // Generate public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);

    return urlData.publicUrl;

  } catch (error) {
    console.error(`❌ Upload error for ${path.basename(localPath)}: ${error}`);
    return null;
  }
}

async function processProjectFolder(folderPath: string, projectSlug: string) {
  console.log(`\n📁 Processing: ${path.basename(folderPath)}`);
  console.log(`   🔗 Project slug: ${projectSlug}`);
  
  // Check if project exists in database
  const projectResult = await db.select().from(projects).where(eq(projects.slug, projectSlug));
  
  if (projectResult.length === 0) {
    console.error(`   ❌ Project not found in database: ${projectSlug}`);
    return;
  }
  
  const project = projectResult[0];
  console.log(`   ✅ Found project: ${project.title}`);
  
  // Look for Before and After folders
  const beforeFolder = path.join(folderPath, 'Before');
  const afterFolder = path.join(folderPath, 'After');
  
  const beforeExists = fs.existsSync(beforeFolder);
  const afterExists = fs.existsSync(afterFolder);
  
  console.log(`   📂 Before folder: ${beforeExists ? '✅ Found' : '❌ Not found'}`);
  console.log(`   📂 After folder: ${afterExists ? '✅ Found' : '❌ Not found'}`);
  
  if (!beforeExists && !afterExists) {
    console.error(`   ❌ No Before or After folders found`);
    return;
  }
  
  const uploadedImages: any[] = [];
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  // Process Before images
  if (beforeExists) {
    const beforeFiles = fs.readdirSync(beforeFolder).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedExtensions.includes(ext);
    });
    
    console.log(`   📤 Uploading ${beforeFiles.length} before images...`);
    
    for (const file of beforeFiles) {
      const filePath = path.join(beforeFolder, file);
      const url = await uploadImageToStorage(projectSlug, filePath, ['before']);
      
      if (url) {
        uploadedImages.push({
          id: randomUUID(),
          url: url,
          tags: ['before'],
          caption: `Before - ${path.parse(file).name}`,
          altText: `${project.title} - Before renovation`,
          uploadedAt: new Date().toISOString()
        });
        console.log(`      ✅ ${file}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Process After images
  if (afterExists) {
    const afterFiles = fs.readdirSync(afterFolder).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedExtensions.includes(ext);
    });
    
    console.log(`   📤 Uploading ${afterFiles.length} after images...`);
    
    for (const file of afterFiles) {
      const filePath = path.join(afterFolder, file);
      const url = await uploadImageToStorage(projectSlug, filePath, ['after', 'gallery']);
      
      if (url) {
        uploadedImages.push({
          id: randomUUID(),
          url: url,
          tags: ['after', 'gallery'],
          caption: `After - ${path.parse(file).name}`,
          altText: `${project.title} - After renovation`,
          uploadedAt: new Date().toISOString()
        });
        console.log(`      ✅ ${file}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Create image pairs (before/after combinations)
  const beforeImages = uploadedImages.filter(img => img.tags.includes('before'));
  const afterImages = uploadedImages.filter(img => img.tags.includes('after'));
  
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
  
  // Set hero image (first after image, or first image)
  const heroImage = afterImages[0] || uploadedImages[0];
  
  // Update project in database
  await db
    .update(projects)
    .set({
      projectImages: uploadedImages,
      imagePairs: imagePairs,
      heroImagePath: heroImage?.url || null,
      isPublished: true // Auto-publish when images are uploaded
    })
    .where(eq(projects.id, project.id));
  
  console.log(`   ✅ Database updated:`);
  console.log(`      📊 Total images: ${uploadedImages.length}`);
  console.log(`      🔗 Pairs created: ${imagePairs.length}`);
  console.log(`      🖼️  Hero image: ${heroImage ? 'Set' : 'None'}`);
  console.log(`      📋 Before: ${beforeImages.length}, After: ${afterImages.length}`);
}

async function uploadAllProjectImages() {
  console.log('📤 UPLOAD PROJECT IMAGES');
  console.log('========================\n');

  const basePath = '/Users/jesper/Desktop/project-folder';
  
  console.log(`🎯 Base folder: ${basePath}\n`);
  console.log(`📋 Project mappings:`);
  for (const [folderName, slug] of Object.entries(PROJECT_MAPPING)) {
    console.log(`   ${folderName} → ${slug}`);
  }
  
  try {
    // Process each project folder
    for (const [folderName, projectSlug] of Object.entries(PROJECT_MAPPING)) {
      const folderPath = path.join(basePath, folderName);
      
      if (!fs.existsSync(folderPath)) {
        console.log(`\n⚠️  Folder not found: ${folderName}`);
        continue;
      }
      
      await processProjectFolder(folderPath, projectSlug);
    }
    
    console.log('\n🎉 All project images uploaded successfully!');
    console.log('🚀 Check your admin interface to see the results');
    
  } catch (error) {
    console.error('\n❌ Error during upload:', error);
  }
}

uploadAllProjectImages()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
