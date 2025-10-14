#!/usr/bin/env tsx

/**
 * Relink Project Images Script
 * 
 * This script relinks existing images from Supabase storage to projects in the database.
 * It's used when images exist in storage but are not connected to the project records.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

import { getDb } from '../src/lib/db/index';
import { projects } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function relinkProjectImages(projectSlug: string, storageFolder?: string) {
  const folderToUse = storageFolder || projectSlug;
  console.log(`\n🔗 Relinking images for: ${projectSlug}`);
  
  const db = getDb();
  
  // Get project from database
  const projectResult = await db.select().from(projects).where(eq(projects.slug, projectSlug)).limit(1);
  
  if (!projectResult || projectResult.length === 0) {
    console.error(`❌ Project ${projectSlug} not found in database`);
    return;
  }
  
  const project = projectResult[0];
  console.log(`   Project ID: ${project.id}`);
  console.log(`   Storage folder: ${folderToUse}`);
  
  // List files from Supabase storage
  const storagePath = `projects/${folderToUse}`;
  const { data: files, error } = await supabase.storage
    .from('images')
    .list(storagePath, {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' }
    });
  
  if (error) {
    console.error(`❌ Error fetching storage files:`, error);
    return;
  }
  
  if (!files || files.length === 0) {
    console.log(`   ⚠️  No files found in storage at ${storagePath}`);
    return;
  }
  
  console.log(`   📸 Found ${files.length} images in storage`);
  
  // Create project images array with proper structure
  const projectImages: Array<{
    id: string;
    url: string;
    tags: string[];
    caption?: string;
  }> = [];
  
  const beforeImages: string[] = [];
  const afterImages: string[] = [];
  
  for (const file of files) {
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(`${storagePath}/${file.name}`);
    
    const imageUrl = publicUrlData.publicUrl;
    const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine tags based on filename or position
    // Files are sorted alphabetically, so first half are "before", second half are "after"
    const fileIndex = files.indexOf(file);
    const midpoint = Math.floor(files.length / 2);
    
    let tags: string[] = [];
    if (fileIndex < midpoint) {
      tags = ['before'];
      beforeImages.push(imageId);
    } else {
      tags = ['after', 'gallery'];
      afterImages.push(imageId);
    }
    
    projectImages.push({
      id: imageId,
      url: imageUrl,
      tags,
      caption: ''
    });
  }
  
  // Create image pairs (max 8 pairs)
  const imagePairs: Array<{
    id: string;
    label: string;
    beforeImageId?: string;
    afterImageId?: string;
  }> = [];
  
  const pairCount = Math.min(beforeImages.length, afterImages.length, 8);
  
  for (let i = 0; i < pairCount; i++) {
    imagePairs.push({
      id: `pair-${i + 1}`,
      label: `Pair ${i + 1}`,
      beforeImageId: beforeImages[i],
      afterImageId: afterImages[i]
    });
  }
  
  console.log(`   🎨 Created ${projectImages.length} image entries`);
  console.log(`   🔗 Created ${imagePairs.length} before/after pairs`);
  
  // Update project in database
  const updateResult = await db
    .update(projects)
    .set({
      projectImages,
      imagePairs,
      updatedAt: new Date()
    })
    .where(eq(projects.id, project.id))
    .returning();
  
  if (updateResult && updateResult.length > 0) {
    console.log(`   ✅ Successfully linked ${projectImages.length} images to ${projectSlug}`);
    console.log(`   ✅ Created ${imagePairs.length} before/after pairs`);
  } else {
    console.error(`   ❌ Failed to update project`);
  }
}

async function main() {
  console.log('🔗 Project Images Relinking Script\n');
  console.log('=' .repeat(60));
  
  const projectsToRelink = [
    { slug: 'no1-oestermalm', storageFolder: 'no1-o-stermalm' },
    { slug: 'wallin-revival', storageFolder: 'wallin-revival' },
    { slug: 'the-nest', storageFolder: 'the-nest' }
  ];
  
  for (const project of projectsToRelink) {
    await relinkProjectImages(project.slug, project.storageFolder);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Relinking complete!\n');
  
  // Verify results
  console.log('📊 Verification:');
  const db = getDb();
  for (const project of projectsToRelink) {
    const result = await db.select({
      title: projects.title,
      imagesCount: projects.projectImages,
      pairsCount: projects.imagePairs
    }).from(projects).where(eq(projects.slug, project.slug)).limit(1);
    
    if (result && result.length > 0) {
      const imgCount = result[0].imagesCount?.length || 0;
      const pairCount = result[0].pairsCount?.length || 0;
      console.log(`   ${result[0].title}: ${imgCount} images, ${pairCount} pairs`);
    }
  }
  
  console.log('\n✅ All images relinked successfully!\n');
}

main().catch(console.error);

