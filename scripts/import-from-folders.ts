/**
 * Import Projects from Folder Structure
 * Usage: npx tsx scripts/import-from-folders.ts <path-to-projects-folder>
 * 
 * This script automatically imports projects from a folder structure with:
 * - Text files with project info
 * - Before/after images in subfolders
 * - Automatic image upload to Supabase Storage
 * - Automatic compression
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
 * Parse info file (supports .txt, .json, .md)
 */
function parseInfoFile(filePath: string): ProjectInfo | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filePath).toLowerCase();

    // JSON format
    if (ext === '.json') {
      return JSON.parse(content);
    }

    // Text/Markdown format - parse key-value pairs
    const lines = content.split('\n');
    const info: ProjectInfo = { title: '', facts: {} };
    let contentSection = false;
    let contentLines: string[] = [];

    for (const line of lines) {
      if (line.trim().toLowerCase() === 'content:') {
        contentSection = true;
        continue;
      }

      if (contentSection) {
        contentLines.push(line);
        continue;
      }

      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();

        if (key.toLowerCase() === 'title') info.title = value;
        else if (key.toLowerCase() === 'year') info.year = parseInt(value);
        else if (key.toLowerCase() === 'summary') info.summary = value;
        else {
          // Add to facts
          info.facts = info.facts || {};
          info.facts[key] = isNaN(Number(value)) ? value : Number(value);
        }
      }
    }

    if (contentLines.length > 0) {
      info.content = contentLines.join('\n').trim();
    }

    return info.title ? info : null;
  } catch (error) {
    console.error(`Error parsing info file ${filePath}:`, error);
    return null;
  }
}

/**
 * Upload image to Supabase Storage
 */
async function uploadImage(filePath: string, folder: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `${folder}/${uuidv4()}-${path.basename(filePath)}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, fileBuffer, {
        contentType: `image/${path.extname(filePath).substring(1)}`,
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
 * Process a project folder
 */
async function processProjectFolder(folderPath: string, folderName: string) {
  console.log(`\n📂 Processing: ${folderName}`);
  console.log('─'.repeat(50));

  // Find info file
  const infoFiles = ['info.txt', 'project.txt', 'info.json', 'info.md', 'README.md'];
  let projectInfo: ProjectInfo | null = null;

  for (const infoFile of infoFiles) {
    const infoPath = path.join(folderPath, infoFile);
    if (fs.existsSync(infoPath)) {
      projectInfo = parseInfoFile(infoPath);
      if (projectInfo) {
        console.log(`✅ Found project info in ${infoFile}`);
        break;
      }
    }
  }

  if (!projectInfo || !projectInfo.title) {
    console.log(`⚠️  No valid project info found, using folder name as title`);
    projectInfo = { title: folderName.replace(/-/g, ' ').replace(/_/g, ' ') };
  }

  // Generate slug from folder name
  const slug = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Find before/after folders
  const beforeFolder = path.join(folderPath, 'before');
  const afterFolder = path.join(folderPath, 'after');
  const galleryFolder = path.join(folderPath, 'gallery');

  const projectImages: any[] = [];
  const imagePairs: any[] = [];

  // Upload before images
  if (fs.existsSync(beforeFolder)) {
    const beforeImages = fs.readdirSync(beforeFolder)
      .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
      .sort();

    console.log(`📸 Found ${beforeImages.length} before images`);

    for (const imageName of beforeImages) {
      const imagePath = path.join(beforeFolder, imageName);
      console.log(`   Uploading ${imageName}...`);
      const url = await uploadImage(imagePath, 'projects');
      
      if (url) {
        const imageId = uuidv4();
        projectImages.push({
          id: imageId,
          url,
          tags: ['before'],
          caption: path.parse(imageName).name,
        });
      }
    }
  }

  // Upload after images
  if (fs.existsSync(afterFolder)) {
    const afterImages = fs.readdirSync(afterFolder)
      .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
      .sort();

    console.log(`📸 Found ${afterImages.length} after images`);

    for (const imageName of afterImages) {
      const imagePath = path.join(afterFolder, imageName);
      console.log(`   Uploading ${imageName}...`);
      const url = await uploadImage(imagePath, 'projects');
      
      if (url) {
        const imageId = uuidv4();
        projectImages.push({
          id: imageId,
          url,
          tags: ['after'],
          caption: path.parse(imageName).name,
        });
      }
    }
  }

  // Create pairs if we have matching before/after images
  const beforeImages = projectImages.filter(img => img.tags.includes('before'));
  const afterImages = projectImages.filter(img => img.tags.includes('after'));
  
  const pairCount = Math.min(beforeImages.length, afterImages.length);
  for (let i = 0; i < pairCount; i++) {
    imagePairs.push({
      id: uuidv4(),
      label: beforeImages[i].caption || `Pair ${i + 1}`,
      beforeImageId: beforeImages[i].id,
      afterImageId: afterImages[i].id,
    });
  }

  console.log(`✨ Created ${imagePairs.length} before/after pairs`);

  // Upload gallery images
  if (fs.existsSync(galleryFolder)) {
    const galleryImages = fs.readdirSync(galleryFolder)
      .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));

    console.log(`📸 Found ${galleryImages.length} gallery images`);

    for (const imageName of galleryImages) {
      const imagePath = path.join(galleryFolder, imageName);
      console.log(`   Uploading ${imageName}...`);
      const url = await uploadImage(imagePath, 'projects');
      
      if (url) {
        projectImages.push({
          id: uuidv4(),
          url,
          tags: ['gallery'],
          caption: path.parse(imageName).name,
        });
      }
    }
  }

  // Create project in database
  try {
    const [newProject] = await db.insert(projects).values({
      slug,
      title: projectInfo.title,
      summary: projectInfo.summary || '',
      content: projectInfo.content || '',
      year: projectInfo.year,
      facts: projectInfo.facts || {},
      projectImages,
      imagePairs,
      isPublished: false, // Draft by default
      isHero: false,
      publishedAt: null,
      updatedAt: new Date(),
    }).returning();

    console.log(`✅ Project created successfully!`);
    console.log(`   ID: ${newProject.id}`);
    console.log(`   Images: ${projectImages.length}`);
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
async function importFromFolders() {
  const projectsPath = process.argv[2];

  if (!projectsPath) {
    console.log('❌ Please provide the path to your projects folder');
    console.log('Usage: npx tsx scripts/import-from-folders.ts <path-to-projects>');
    console.log('Example: npx tsx scripts/import-from-folders.ts ~/Desktop/my-projects');
    process.exit(1);
  }

  if (!fs.existsSync(projectsPath)) {
    console.log(`❌ Folder not found: ${projectsPath}`);
    process.exit(1);
  }

  console.log('🚀 Project Import from Folders');
  console.log('==============================\n');
  console.log(`📁 Source: ${projectsPath}\n`);

  const folders = fs.readdirSync(projectsPath)
    .filter(f => fs.statSync(path.join(projectsPath, f)).isDirectory())
    .filter(f => !f.startsWith('.'));

  console.log(`Found ${folders.length} project folders\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const folder of folders) {
    try {
      const folderPath = path.join(projectsPath, folder);
      const result = await processProjectFolder(folderPath, folder);
      
      if (result) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${folder}:`, error);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Import Complete!');
  console.log(`   Success: ${successCount} projects`);
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount} projects`);
  }
  console.log('\n🎯 Next Steps:');
  console.log('1. Visit http://localhost:3000/admin/projects to review');
  console.log('2. Edit any project details as needed');
  console.log('3. Toggle "Publish to site" when ready');
  console.log('4. Set one project as "Hero Project"');

  await client.end();
}

// Run import
importFromFolders().catch(console.error);
