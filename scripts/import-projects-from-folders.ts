#!/usr/bin/env tsx
/**
 * Import Projects from Local Folders
 * 
 * This script:
 * 1. Reads project folders from /project-images/
 * 2. Uploads all images to Supabase Storage
 * 3. Creates/updates projects in the database with image URLs
 * 
 * Folder structure:
 * /project-images/
 *   ├── villa-serenidad/
 *   │   ├── hero.jpg (or hero.png, hero.webp)
 *   │   ├── before-1.jpg
 *   │   ├── before-2.jpg
 *   │   ├── after-1.jpg
 *   │   ├── gallery-1.jpg
 *   │   └── project.json (optional metadata)
 *   └── finca-moderna/
 *       └── ...
 * 
 * Usage:
 *   npm run import-projects
 *   or
 *   tsx scripts/import-projects-from-folders.ts
 */

import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { createDbClient } from '@/lib/db/index';
import { projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Configuration
const PROJECT_IMAGES_DIR = path.join(process.cwd(), 'project-images');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const STORAGE_BUCKET = 'project-images';

interface ProjectMetadata {
  title: string;
  slug: string;
  summary: string;
  content?: string;
  year?: number;
  facts?: Record<string, any>;
  isPublished?: boolean;
  isHero?: boolean;
  isComingSoon?: boolean;
}

async function uploadFileToSupabase(
  filePath: string,
  destinationPath: string
): Promise<string> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  // Read file
  const fileBuffer = await fs.readFile(filePath);
  const file = new File([fileBuffer], path.basename(filePath));
  
  // Upload to Supabase
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(destinationPath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload ${filePath}: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(destinationPath);

  return publicUrl;
}

async function processProjectFolder(folderName: string): Promise<void> {
  const folderPath = path.join(PROJECT_IMAGES_DIR, folderName);
  const files = await fs.readdir(folderPath);
  
  console.log(`\n📂 Processing: ${folderName}`);
  console.log(`   Found ${files.length} files`);

  // Look for project.json metadata
  let metadata: ProjectMetadata | null = null;
  const metadataPath = path.join(folderPath, 'project.json');
  
  try {
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    metadata = JSON.parse(metadataContent);
    console.log(`   ✓ Found project.json`);
  } catch {
    // Use folder name as slug if no metadata
    metadata = {
      title: folderName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      slug: folderName,
      summary: `Luxury property project - ${folderName}`,
    };
    console.log(`   ⚠ No project.json, using defaults`);
  }

  // Upload images and collect URLs
  let heroImageUrl = '';
  const galleryImages: string[] = [];
  const beforeImages: string[] = [];
  const afterImages: string[] = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isDirectory() || file === 'project.json') continue;
    
    // Check if it's an image
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) continue;

    const fileName = file.toLowerCase();
    const destinationPath = `${folderName}/${file}`;
    
    console.log(`   📤 Uploading: ${file}`);
    const publicUrl = await uploadFileToSupabase(filePath, destinationPath);
    
    // Categorize based on filename
    if (fileName.startsWith('hero')) {
      heroImageUrl = publicUrl;
      console.log(`      → Set as hero image`);
    } else if (fileName.startsWith('before')) {
      beforeImages.push(publicUrl);
      console.log(`      → Added to before images`);
    } else if (fileName.startsWith('after')) {
      afterImages.push(publicUrl);
      console.log(`      → Added to after images`);
    } else if (fileName.startsWith('gallery')) {
      galleryImages.push(publicUrl);
      console.log(`      → Added to gallery`);
    } else {
      // Default to gallery
      galleryImages.push(publicUrl);
      console.log(`      → Added to gallery`);
    }
  }

  // Create or update project in database
  const db = createDbClient();
  
  // Check if project exists
  const existingProject = await db.select()
    .from(projects)
    .where(eq(projects.slug, metadata.slug))
    .limit(1);

  const projectData = {
    slug: metadata.slug,
    title: metadata.title,
    summary: metadata.summary,
    content: metadata.content || '',
    year: metadata.year || new Date().getFullYear(),
    facts: metadata.facts || {},
    heroImagePath: heroImageUrl,
    isPublished: metadata.isPublished ?? true,
    isHero: metadata.isHero ?? false,
    isComingSoon: metadata.isComingSoon ?? false,
    updatedAt: new Date(),
  };

  if (existingProject.length > 0) {
    // Update existing project
    await db.update(projects)
      .set(projectData)
      .where(eq(projects.slug, metadata.slug));
    console.log(`   ✅ Updated project: ${metadata.title}`);
  } else {
    // Create new project
    await db.insert(projects).values({
      ...projectData,
      publishedAt: projectData.isPublished ? new Date() : null,
    });
    console.log(`   ✅ Created project: ${metadata.title}`);
  }

  console.log(`   📊 Stats:`);
  console.log(`      Hero image: ${heroImageUrl ? '✓' : '✗'}`);
  console.log(`      Gallery: ${galleryImages.length} images`);
  console.log(`      Before: ${beforeImages.length} images`);
  console.log(`      After: ${afterImages.length} images`);
  
  // TODO: Store gallery, before, after images in project_images table
  // This can be added when we implement the gallery feature
}

async function main() {
  console.log('🚀 Starting Project Import...\n');
  
  // Check if project-images directory exists
  try {
    await fs.access(PROJECT_IMAGES_DIR);
  } catch {
    console.error(`❌ Directory not found: ${PROJECT_IMAGES_DIR}`);
    console.log('\n📝 Please create the directory and add your project folders:');
    console.log('   mkdir -p project-images/your-project-name');
    console.log('   # Add images: hero.jpg, before-1.jpg, gallery-1.jpg, etc.');
    process.exit(1);
  }

  // Get all project folders
  const entries = await fs.readdir(PROJECT_IMAGES_DIR, { withFileTypes: true });
  const projectFolders = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  if (projectFolders.length === 0) {
    console.log('⚠ No project folders found in /project-images/');
    console.log('\n📝 Create folders like:');
    console.log('   project-images/villa-serenidad/');
    console.log('   project-images/finca-moderna/');
    process.exit(0);
  }

  console.log(`Found ${projectFolders.length} project folder(s):\n`);
  projectFolders.forEach(f => console.log(`  - ${f}`));

  // Process each folder
  for (const folder of projectFolders) {
    try {
      await processProjectFolder(folder);
    } catch (error) {
      console.error(`\n❌ Error processing ${folder}:`, error);
    }
  }

  console.log('\n✅ Import complete!\n');
  process.exit(0);
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

