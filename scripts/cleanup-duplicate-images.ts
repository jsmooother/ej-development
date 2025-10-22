/**
 * Cleanup Duplicate Images in Supabase Storage
 * Run with: npx tsx scripts/cleanup-duplicate-images.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicateImages() {
  console.log('🧹 Cleaning Up Duplicate Images in Storage');
  console.log('==========================================\n');

  try {
    // Step 1: Remove the all-images folder (contains duplicates with UUID filenames)
    console.log('1. Removing duplicate images from all-images/ folder...');
    
    const { data: allImagesFiles, error: allImagesError } = await supabase.storage
      .from('images')
      .list('all-images', { limit: 1000 });
    
    if (allImagesError) {
      console.log(`   ❌ Error listing all-images: ${allImagesError.message}`);
    } else if (!allImagesFiles || allImagesFiles.length === 0) {
      console.log('   📁 No files in all-images/ folder');
    } else {
      console.log(`   📁 Found ${allImagesFiles.length} files in all-images/ folder`);
      
      // Calculate total size before deletion
      let totalSize = 0;
      allImagesFiles.forEach(file => {
        totalSize += file.metadata?.size || 0;
      });
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      console.log(`   📊 Total size to be freed: ${totalSizeMB} MB`);
      
      // Delete all files in all-images folder
      const filePaths = allImagesFiles.map(file => `all-images/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove(filePaths);
      
      if (deleteError) {
        console.log(`   ❌ Error deleting files: ${deleteError.message}`);
      } else {
        console.log(`   ✅ Successfully deleted ${allImagesFiles.length} duplicate files`);
        console.log(`   💾 Freed up ${totalSizeMB} MB of storage`);
      }
    }
    
    console.log('');
    
    // Step 2: Clean up empty folder placeholders
    console.log('2. Cleaning up empty folder placeholders...');
    
    const { data: rootFiles, error: rootError } = await supabase.storage
      .from('images')
      .list('', { limit: 100 });
    
    if (rootError) {
      console.log(`   ❌ Error listing root files: ${rootError.message}`);
    } else if (rootFiles) {
      const emptyFolders = rootFiles.filter(file => 
        file.metadata?.size === 0 && 
        !file.name.includes('.') && // No file extension = likely a folder
        file.name !== 'projects' // Keep the projects folder
      );
      
      if (emptyFolders.length > 0) {
        console.log(`   📁 Found ${emptyFolders.length} empty folder placeholders`);
        
        const { error: deleteEmptyError } = await supabase.storage
          .from('images')
          .remove(emptyFolders.map(f => f.name));
        
        if (deleteEmptyError) {
          console.log(`   ❌ Error deleting empty folders: ${deleteEmptyError.message}`);
        } else {
          console.log(`   ✅ Cleaned up ${emptyFolders.length} empty folder placeholders`);
        }
      } else {
        console.log('   📁 No empty folder placeholders found');
      }
    }
    
    console.log('');
    
    // Step 3: Check for duplicate files within projects folders
    console.log('3. Checking for duplicates within projects folders...');
    
    const projectFolders = ['classic-pearl', 'grand-celeste', 'no1-o-stermalm', 'the-nest', 'wallin-revival'];
    let totalDuplicatesFound = 0;
    let totalSizeFreed = 0;
    
    for (const projectFolder of projectFolders) {
      console.log(`   Checking projects/${projectFolder}/...`);
      
      const { data: projectFiles, error: projectError } = await supabase.storage
        .from('images')
        .list(`projects/${projectFolder}`, { limit: 1000 });
      
      if (projectError) {
        console.log(`     ❌ Error: ${projectError.message}`);
        continue;
      }
      
      if (!projectFiles || projectFiles.length === 0) {
        console.log(`     📁 No files found`);
        continue;
      }
      
      // Group files by base name (without timestamp and random suffix)
      const fileGroups: Record<string, any[]> = {};
      
      projectFiles.forEach(file => {
        // Extract base name by removing timestamp-random pattern
        const baseName = file.name.replace(/^\d+-[a-z0-9]+-/, '').replace(/^[^/]+\//, '');
        if (!fileGroups[baseName]) {
          fileGroups[baseName] = [];
        }
        fileGroups[baseName].push(file);
      });
      
      // Find duplicates
      const duplicates = Object.entries(fileGroups).filter(([_, files]) => files.length > 1);
      
      if (duplicates.length > 0) {
        console.log(`     🔍 Found ${duplicates.length} duplicate groups`);
        
        for (const [baseName, files] of duplicates) {
          // Keep the first file (oldest), delete the rest
          const filesToDelete = files.slice(1);
          const filesToKeep = files[0];
          
          console.log(`       - ${baseName}: keeping ${filesToKeep.name}, deleting ${filesToDelete.length} duplicates`);
          
          let groupSize = 0;
          filesToDelete.forEach(file => {
            groupSize += file.metadata?.size || 0;
          });
          
          const groupSizeMB = (groupSize / (1024 * 1024)).toFixed(2);
          console.log(`         💾 Will free: ${groupSizeMB} MB`);
          
          // Delete duplicate files
          const duplicatePaths = filesToDelete.map(file => `projects/${projectFolder}/${file.name}`);
          const { error: deleteDuplicatesError } = await supabase.storage
            .from('images')
            .remove(duplicatePaths);
          
          if (deleteDuplicatesError) {
            console.log(`         ❌ Error deleting duplicates: ${deleteDuplicatesError.message}`);
          } else {
            console.log(`         ✅ Deleted ${filesToDelete.length} duplicates`);
            totalDuplicatesFound += filesToDelete.length;
            totalSizeFreed += groupSize;
          }
        }
      } else {
        console.log(`     ✅ No duplicates found`);
      }
    }
    
    console.log('');
    
    // Step 4: Final summary
    console.log('4. Cleanup Summary:');
    console.log('===================');
    console.log(`Total duplicate files removed: ${totalDuplicatesFound}`);
    console.log(`Total storage freed: ${(totalSizeFreed / (1024 * 1024)).toFixed(2)} MB`);
    
    // Step 5: Show current storage usage
    console.log('\n5. Current Storage Usage:');
    console.log('=========================');
    
    let currentTotalSize = 0;
    let currentTotalFiles = 0;
    
    for (const projectFolder of projectFolders) {
      const { data: projectFiles, error: projectError } = await supabase.storage
        .from('images')
        .list(`projects/${projectFolder}`, { limit: 1000 });
      
      if (!projectError && projectFiles) {
        let folderSize = 0;
        projectFiles.forEach(file => {
          folderSize += file.metadata?.size || 0;
        });
        
        const folderSizeMB = (folderSize / (1024 * 1024)).toFixed(2);
        console.log(`   ${projectFolder}: ${projectFiles.length} files, ${folderSizeMB} MB`);
        
        currentTotalSize += folderSize;
        currentTotalFiles += projectFiles.length;
      }
    }
    
    const currentTotalSizeMB = (currentTotalSize / (1024 * 1024)).toFixed(2);
    const currentTotalSizeGB = (currentTotalSize / (1024 * 1024 * 1024)).toFixed(3);
    
    console.log(`\n📊 Total: ${currentTotalFiles} files, ${currentTotalSizeMB} MB (${currentTotalSizeGB} GB)`);
    console.log(`📊 Free tier usage: ${((currentTotalSize / (1024 * 1024 * 1024)) * 100).toFixed(1)}% of 1GB`);
    
    if (currentTotalSize < 400 * 1024 * 1024) { // Less than 400MB
      console.log('✅ Storage usage is now within expected range (< 400MB)');
    } else {
      console.log('⚠️  Storage usage is still higher than expected (> 400MB)');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupDuplicateImages()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
