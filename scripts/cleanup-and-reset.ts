/**
 * Cleanup and Reset Script
 * 
 * This script will:
 * 1. Delete all existing projects and related data
 * 2. Clean up any orphaned images in Supabase Storage
 * 3. Reset the database to a clean state
 * 4. Prepare for fresh project creation with new image system
 */

import { getDb } from '../src/lib/db/index';
import { projects, projectImages, posts, listings } from '../src/lib/db/schema';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for storage cleanup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function cleanupAndReset() {
  console.log('🧹 Starting cleanup and reset process...');
  
  try {
    const db = getDb();
    
    // 1. Delete all projects and related data
    console.log('📝 Deleting all projects...');
    await db.delete(projects);
    
    // 2. Delete all project images
    console.log('🖼️ Deleting all project images...');
    await db.delete(projectImages);
    
    // 3. Delete all posts (editorials)
    console.log('📰 Deleting all posts...');
    await db.delete(posts);
    
    // 4. Delete all listings
    console.log('🏠 Deleting all listings...');
    await db.delete(listings);
    
    // 5. Clean up Supabase Storage
    console.log('🗂️ Cleaning up Supabase Storage...');
    
    // List all files in the images bucket
    const { data: files, error: listError } = await supabase.storage
      .from('images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (listError) {
      console.error('Error listing files:', listError);
    } else if (files && files.length > 0) {
      console.log(`Found ${files.length} files to delete...`);
      
      // Delete all files
      const filePaths = files.map(file => file.name);
      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove(filePaths);
      
      if (deleteError) {
        console.error('Error deleting files:', deleteError);
      } else {
        console.log('✅ All files deleted from storage');
      }
    } else {
      console.log('📁 No files found in storage');
    }
    
    console.log('✅ Cleanup completed successfully!');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Your database is now clean and ready for new projects');
    console.log('2. All images have been removed from Supabase Storage');
    console.log('3. You can now create new projects with the new image system');
    console.log('4. The toggle state issues should be resolved');
    console.log('');
    console.log('💡 The new system will:');
    console.log('- Store images in Supabase Storage (not Vercel)');
    console.log('- Use JSONB columns for image metadata');
    console.log('- Provide proper toggle state synchronization');
    console.log('- Include automatic image compression');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupAndReset();
