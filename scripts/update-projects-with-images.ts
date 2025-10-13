/**
 * Update existing projects with image data
 * Usage: npx tsx scripts/update-projects-with-images.ts
 * 
 * This script updates the existing projects in the database with the image data
 * that was uploaded to Supabase Storage during the import process.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Database connection
const connectionString = process.env.DATABASE_URL || 
  'postgresql://postgres.bwddpoellslqtuyrioau:fiRter-2cecki-duqsuk@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = postgres(connectionString);
const db = drizzle(client);

// Supabase Storage
const supabase = createClient(
  'https://bwddpoellslqtuyrioau.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZGRwb2VsbHNscXR1eXJpb2F1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg1OTEwMSwiZXhwIjoyMDc1NDM1MTAxfQ.E-KPRHvJnULzP9zHh48Y-WssAeL7Pr4Xy1xR0nF4Stk'
);

/**
 * Get correct MIME type for image files
 */
function getImageMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.gif': 'image/gif',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

/**
 * Upload image to Supabase Storage with compression
 */
async function uploadImage(filePath: string, projectName: string, type: 'before' | 'after'): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${type}/${randomUUID()}-${path.basename(filePath)}`;
    const contentType = getImageMimeType(filePath);

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: false
      });

    if (error) {
      console.error(`Error uploading ${filePath}:`, error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return null;
  }
}

/**
 * Clean RTF text content
 */
function cleanRTFText(text: string): string {
  return text
    .replace(/\\[a-z]+\d*\s?/g, '') // Remove RTF commands
    .replace(/[{}]/g, '') // Remove braces
    .replace(/\\'/g, "'") // Fix escaped quotes
    .replace(/\\"/g, '"') // Fix escaped quotes
    .replace(/\\\*/g, '*') // Fix escaped asterisks
    .replace(/\\\s/g, ' ') // Fix escaped spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\.SFNS-Regular;\.SFNS-RegularItalic;\s*;;;\s*\*;;;\s*/g, '') // Remove font formatting
    .trim();
}

/**
 * Parse RTF file and extract project information
 */
function parseRTFFile(filePath: string): { summary?: string; content?: string } | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const cleanContent = cleanRTFText(content);

    return {
      summary: cleanContent.substring(0, 200) + (cleanContent.length > 200 ? '...' : ''),
      content: cleanContent,
    };
  } catch (error) {
    console.error(`Error parsing RTF file ${filePath}:`, error);
    return null;
  }
}

/**
 * Process a single project
 */
async function processProject(projectId: string, projectFolder: string, aboutFile: string) {
  const projectName = path.basename(projectFolder).replace('Project - ', '');
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  console.log(`\n📂 Processing: ${projectName}`);
  console.log('─'.repeat(60));

  // Parse project info from RTF file
  const projectInfo = parseRTFFile(aboutFile);
  if (!projectInfo) {
    console.log(`⚠️  Could not parse project info, skipping text update`);
  } else {
    console.log(`📝 Cleaned text content`);
  }

  // Process Before images
  const beforeFolder = path.join(projectFolder, 'Before');
  const beforeImages: any[] = [];
  
  if (fs.existsSync(beforeFolder)) {
    const beforeFiles = fs.readdirSync(beforeFolder)
      .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
      .sort();

    console.log(`📸 Processing ${beforeFiles.length} before images...`);
    
    for (let i = 0; i < beforeFiles.length; i++) {
      const file = beforeFiles[i];
      const filePath = path.join(beforeFolder, file);
      process.stdout.write(`   ${i + 1}/${beforeFiles.length} ${file}... `);
      
      const url = await uploadImage(filePath, slug, 'before');
      if (url) {
        const imageId = randomUUID();
        beforeImages.push({
          id: imageId,
          url,
          tags: ['before'],
          caption: path.parse(file).name,
        });
        console.log('✅');
      } else {
        console.log('❌');
      }
    }
  }

  // Process After images
  const afterFolder = path.join(projectFolder, 'After');
  const afterImages: any[] = [];
  
  if (fs.existsSync(afterFolder)) {
    const afterFiles = fs.readdirSync(afterFolder)
      .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
      .sort();

    console.log(`📸 Processing ${afterFiles.length} after images...`);
    
    for (let i = 0; i < afterFiles.length; i++) {
      const file = afterFiles[i];
      const filePath = path.join(afterFolder, file);
      process.stdout.write(`   ${i + 1}/${afterFiles.length} ${file}... `);
      
      const url = await uploadImage(filePath, slug, 'after');
      if (url) {
        const imageId = randomUUID();
        afterImages.push({
          id: imageId,
          url,
          tags: ['after'],
          caption: path.parse(file).name,
        });
        console.log('✅');
      } else {
        console.log('❌');
      }
    }
  }

  // Create before/after pairs (match by index)
  const imagePairs: any[] = [];
  const pairCount = Math.min(beforeImages.length, afterImages.length);
  
  for (let i = 0; i < pairCount; i++) {
    imagePairs.push({
      id: randomUUID(),
      label: `Before & After ${i + 1}`,
      beforeImageId: beforeImages[i].id,
      afterImageId: afterImages[i].id,
    });
  }

  console.log(`✨ Created ${imagePairs.length} before/after pairs`);

  // Combine all images
  const allImages = [...beforeImages, ...afterImages];

  // Update project in database
  try {
    const updateData: any = {
      projectImages: allImages,
      imagePairs,
      updatedAt: new Date(),
    };

    // Add text updates if available
    if (projectInfo) {
      if (projectInfo.summary) updateData.summary = projectInfo.summary;
      if (projectInfo.content) updateData.content = projectInfo.content;
    }

    const [updatedProject] = await db.update(projects)
      .set(updateData)
      .where(eq(projects.id, projectId))
      .returning();

    console.log(`\n✅ Project updated successfully!`);
    console.log(`   ID: ${updatedProject.id}`);
    console.log(`   Images: ${allImages.length} (${beforeImages.length} before, ${afterImages.length} after)`);
    console.log(`   Pairs: ${imagePairs.length}`);
    console.log(`   Admin URL: http://localhost:3000/admin/projects/${updatedProject.id}`);

    return updatedProject;
  } catch (error) {
    console.error(`❌ Error updating project in database:`, error);
    return null;
  }
}

/**
 * Main update function
 */
async function updateProjectsWithImages() {
  const projectsPath = path.join(process.env.HOME || '', 'Desktop', 'project-folder');

  if (!fs.existsSync(projectsPath)) {
    console.log(`❌ Project folder not found: ${projectsPath}`);
    console.log('Please make sure your project data is in ~/Desktop/project-folder');
    process.exit(1);
  }

  console.log('🔄 Updating Projects with Images');
  console.log('================================\n');
  console.log(`📁 Source: ${projectsPath}\n`);

  // Get existing projects from database
  const existingProjects = await db.select().from(projects);
  console.log(`Found ${existingProjects.length} existing projects in database\n`);

  // Find all project folders
  const projectFolders = fs.readdirSync(projectsPath)
    .filter(f => f.startsWith('Project - '))
    .map(f => path.join(projectsPath, f));

  let successCount = 0;
  let errorCount = 0;

  for (const projectFolder of projectFolders) {
    try {
      const projectName = path.basename(projectFolder).replace('Project - ', '');
      const aboutFile = path.join(projectsPath, `About - ${projectName}.rtf`);
      
      // Handle the typo in "Aount - Etoile.rtf"
      const aboutFileAlt = path.join(projectsPath, `Aount - ${projectName}.rtf`);
      const finalAboutFile = fs.existsSync(aboutFile) ? aboutFile : aboutFileAlt;
      
      if (!fs.existsSync(finalAboutFile)) {
        console.log(`⚠️  No about file found for ${projectName}, skipping...`);
        continue;
      }

      // Find matching project in database
      const existingProject = existingProjects.find(p => 
        p.slug === projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      );

      if (!existingProject) {
        console.log(`⚠️  No matching project found in database for ${projectName}, skipping...`);
        continue;
      }

      const result = await processProject(existingProject.id, projectFolder, finalAboutFile);
      
      if (result) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${path.basename(projectFolder)}:`, error);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Update Complete!');
  console.log(`   Success: ${successCount} projects`);
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount} projects`);
  }
  console.log('\n🎯 Next Steps:');
  console.log('1. Visit http://localhost:3000/admin/projects to review');
  console.log('2. Images should now be visible in the admin interface');
  console.log('3. Text formatting should be clean and readable');
  console.log('4. Toggle "Publish to site" when ready to go live');
  console.log('5. Set one project as "Hero Project" for the homepage');

  await client.end();
}

// Import eq for database queries
import { eq } from 'drizzle-orm';

// Run update
updateProjectsWithImages().catch(console.error);
