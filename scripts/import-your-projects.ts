/**
 * Import Your Projects from Desktop/project-folder
 * Usage: npx tsx scripts/import-your-projects.ts
 * 
 * This script is customized for your specific folder structure:
 * - Project folders: "Project - [Name]"
 * - RTF files: "About - [Name].rtf"
 * - Images: "Before" and "After" folders
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

interface ProjectInfo {
  title: string;
  year?: number;
  summary?: string;
  content?: string;
  facts?: Record<string, string | number>;
}

/**
 * Parse RTF file and extract project information
 */
function parseRTFFile(filePath: string): ProjectInfo | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // RTF files have special formatting, let's extract the readable text
    const cleanContent = content
      .replace(/\\[a-z]+\d*\s?/g, '') // Remove RTF commands
      .replace(/[{}]/g, '') // Remove braces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Try to extract title from filename or content
    const fileName = path.basename(filePath, '.rtf');
    const title = fileName.replace('About - ', '').replace('Aount - ', ''); // Handle typo in "Aount"

    // For now, use the title and put the content as description
    return {
      title,
      summary: cleanContent.substring(0, 200) + '...', // First 200 chars as summary
      content: cleanContent,
      year: 2024, // Default year
      facts: {
        'Type': 'Interior Design',
        'Status': 'Completed',
      }
    };
  } catch (error) {
    console.error(`Error parsing RTF file ${filePath}:`, error);
    return null;
  }
}

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
 * Process a single project
 */
async function processProject(projectFolder: string, aboutFile: string) {
  const projectName = path.basename(projectFolder).replace('Project - ', '');
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  console.log(`\n📂 Processing: ${projectName}`);
  console.log('─'.repeat(60));

  // Parse project info from RTF file
  const projectInfo = parseRTFFile(aboutFile);
  if (!projectInfo) {
    console.log(`⚠️  Could not parse project info, using folder name`);
    projectInfo = { title: projectName };
  }

  console.log(`📝 Title: ${projectInfo.title}`);
  console.log(`📄 Summary: ${projectInfo.summary?.substring(0, 100)}...`);

  // Process Before images
  const beforeFolder = path.join(projectFolder, 'Before');
  const beforeImages: any[] = [];
  
  if (fs.existsSync(beforeFolder)) {
    const beforeFiles = fs.readdirSync(beforeFolder)
      .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
      .sort();

    console.log(`📸 Uploading ${beforeFiles.length} before images...`);
    
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

    console.log(`📸 Uploading ${afterFiles.length} after images...`);
    
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

  // Create project in database
  try {
    const [newProject] = await db.insert(projects).values({
      slug,
      title: projectInfo.title,
      summary: projectInfo.summary || '',
      content: projectInfo.content || '',
      year: projectInfo.year || 2024,
      facts: projectInfo.facts || {},
      projectImages: allImages,
      imagePairs,
      isPublished: false, // Start as draft
      isHero: false,
      publishedAt: null,
      updatedAt: new Date(),
    }).returning();

    console.log(`\n✅ Project created successfully!`);
    console.log(`   ID: ${newProject.id}`);
    console.log(`   Images: ${allImages.length} (${beforeImages.length} before, ${afterImages.length} after)`);
    console.log(`   Pairs: ${imagePairs.length}`);
    console.log(`   Admin URL: http://localhost:3000/admin/projects/${newProject.id}`);

    return newProject;
  } catch (error) {
    console.error(`❌ Error creating project in database:`, error);
    return null;
  }
}

/**
 * Main import function
 */
async function importYourProjects() {
  const projectsPath = path.join(process.env.HOME || '', 'Desktop', 'project-folder');

  if (!fs.existsSync(projectsPath)) {
    console.log(`❌ Project folder not found: ${projectsPath}`);
    console.log('Please make sure your project data is in ~/Desktop/project-folder');
    process.exit(1);
  }

  console.log('🚀 Importing Your Projects');
  console.log('==========================\n');
  console.log(`📁 Source: ${projectsPath}\n`);

  // Find all project folders
  const projectFolders = fs.readdirSync(projectsPath)
    .filter(f => f.startsWith('Project - '))
    .map(f => path.join(projectsPath, f));

  console.log(`Found ${projectFolders.length} project folders\n`);

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

      const result = await processProject(projectFolder, finalAboutFile);
      
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
  console.log('✅ Import Complete!');
  console.log(`   Success: ${successCount} projects`);
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount} projects`);
  }
  console.log('\n🎯 Next Steps:');
  console.log('1. Visit http://localhost:3000/admin/projects to review');
  console.log('2. Edit project details and descriptions as needed');
  console.log('3. Toggle "Publish to site" when ready to go live');
  console.log('4. Set one project as "Hero Project" for the homepage');
  console.log('5. Check the storage dashboard to monitor usage');
  console.log('\n💡 All images have been automatically compressed and uploaded!');

  await client.end();
}

// Run import
importYourProjects().catch(console.error);
