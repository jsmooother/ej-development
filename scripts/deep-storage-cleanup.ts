/**
 * Deep Storage Cleanup - Check Every Possible Location
 * Run with: npx tsx scripts/deep-storage-cleanup.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function deepStorageCleanup() {
  console.log('🧹 Deep Storage Cleanup - Check Every Possible Location');
  console.log('======================================================\n');

  try {
    let totalFiles = 0;
    let totalSize = 0;
    let filesToDelete: string[] = [];
    let sizeToDelete = 0;
    
    // Check all possible locations where files might be hiding
    const locationsToCheck = [
      '', // Root
      'temp', 'tmp', 'cache', 'trash', 'deleted', 'old', 'backup',
      'uploads', 'processing', 'staging', '.temp', '.tmp', '.cache',
      'all-images', 'duplicates', 'unused', 'test', 'draft',
      'projects', 'projects/temp', 'projects/cache', 'projects/old',
      'editorials', 'editorials/temp', 'editorials/cache',
      'public', 'private', 'shared', 'common'
    ];
    
    console.log('🔍 Checking all possible file locations...\n');
    
    for (const location of locationsToCheck) {
      try {
        const { data: files, error } = await supabase.storage
          .from('images')
          .list(location, { limit: 1000 });
        
        if (error) {
          // Location doesn't exist or can't be accessed
          continue;
        }
        
        if (!files || files.length === 0) {
          continue;
        }
        
        let locationSize = 0;
        let locationFiles = 0;
        let locationTempFiles = 0;
        let locationTrashFiles = 0;
        
        console.log(`📁 ${location || 'root'}:`);
        
        for (const file of files) {
          const size = file.metadata?.size || 0;
          locationSize += size;
          locationFiles++;
          totalSize += size;
          totalFiles++;
          
          const fileName = file.name.toLowerCase();
          const filePath = location ? `${location}/${file.name}` : file.name;
          
          // Check for temp/trash files
          if (fileName.includes('temp') || fileName.includes('tmp') || fileName.includes('cache')) {
            locationTempFiles++;
            filesToDelete.push(filePath);
            sizeToDelete += size;
            console.log(`   🗑️  TEMP: ${file.name} (${(size / 1024 / 1024).toFixed(2)}MB)`);
          } else if (fileName.includes('trash') || fileName.includes('deleted') || fileName.includes('old') || fileName.includes('backup')) {
            locationTrashFiles++;
            filesToDelete.push(filePath);
            sizeToDelete += size;
            console.log(`   🗑️  TRASH: ${file.name} (${(size / 1024 / 1024).toFixed(2)}MB)`);
          } else if (fileName.startsWith('.')) {
            // Hidden files
            filesToDelete.push(filePath);
            sizeToDelete += size;
            console.log(`   👻 HIDDEN: ${file.name} (${(size / 1024 / 1024).toFixed(2)}MB)`);
          } else if (fileName.includes('duplicate') || fileName.includes('copy') || fileName.includes('_copy')) {
            filesToDelete.push(filePath);
            sizeToDelete += size;
            console.log(`   🔄 DUPLICATE: ${file.name} (${(size / 1024 / 1024).toFixed(2)}MB)`);
          } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(fileName)) {
            // UUID-based filenames (likely temp/duplicate)
            filesToDelete.push(filePath);
            sizeToDelete += size;
            console.log(`   🆔 UUID FILE: ${file.name} (${(size / 1024 / 1024).toFixed(2)}MB)`);
          }
        }
        
        const locationSizeMB = (locationSize / 1024 / 1024).toFixed(2);
        console.log(`   📊 Total: ${locationFiles} files, ${locationSizeMB} MB`);
        
        if (locationTempFiles > 0) {
          console.log(`   🗑️  Temp files: ${locationTempFiles}`);
        }
        if (locationTrashFiles > 0) {
          console.log(`   🗑️  Trash files: ${locationTrashFiles}`);
        }
        
        console.log('');
        
      } catch (error) {
        // Location doesn't exist, ignore
      }
    }
    
    // Summary
    console.log('📈 Deep Storage Analysis Summary:');
    console.log('=================================');
    console.log(`Total files found: ${totalFiles}`);
    console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB (${(totalSize / 1024 / 1024 / 1024).toFixed(3)} GB)`);
    console.log(`Files to delete: ${filesToDelete.length}`);
    console.log(`Size to delete: ${(sizeToDelete / 1024 / 1024).toFixed(2)} MB`);
    
    if (filesToDelete.length > 0) {
      console.log('\n🗑️  Files to be deleted:');
      filesToDelete.slice(0, 10).forEach(file => {
        console.log(`   - ${file}`);
      });
      if (filesToDelete.length > 10) {
        console.log(`   ... and ${filesToDelete.length - 10} more files`);
      }
      
      console.log('\n🧹 Proceeding with cleanup...');
      
      // Delete files in batches
      const batchSize = 100;
      let deletedCount = 0;
      let deletedSize = 0;
      
      for (let i = 0; i < filesToDelete.length; i += batchSize) {
        const batch = filesToDelete.slice(i, i + batchSize);
        
        try {
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove(batch);
          
          if (deleteError) {
            console.log(`   ❌ Error deleting batch ${Math.floor(i / batchSize) + 1}: ${deleteError.message}`);
          } else {
            deletedCount += batch.length;
            console.log(`   ✅ Deleted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} files`);
          }
        } catch (error) {
          console.log(`   ❌ Error deleting batch ${Math.floor(i / batchSize) + 1}: ${error}`);
        }
      }
      
      console.log(`\n🎉 Cleanup Complete!`);
      console.log(`   Files deleted: ${deletedCount}`);
      console.log(`   Size freed: ${(sizeToDelete / 1024 / 1024).toFixed(2)} MB`);
      
    } else {
      console.log('\n✅ No temp, trash, or duplicate files found - storage is already clean!');
    }
    
    // Final check
    console.log('\n🔍 Final storage check...');
    let finalFiles = 0;
    let finalSize = 0;
    
    for (const location of ['', 'projects']) {
      try {
        const { data: files, error } = await supabase.storage
          .from('images')
          .list(location, { limit: 1000 });
        
        if (!error && files) {
          files.forEach(file => {
            finalSize += file.metadata?.size || 0;
            finalFiles++;
          });
        }
      } catch (error) {
        // Ignore
      }
    }
    
    console.log(`📊 Final storage usage: ${finalFiles} files, ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
    
    if (finalSize < 400 * 1024 * 1024) {
      console.log('✅ Storage is now clean and within expected limits!');
    } else {
      console.log('⚠️  Storage usage is still higher than expected.');
    }
    
  } catch (error) {
    console.error('❌ Error during deep cleanup:', error);
  }
}

deepStorageCleanup()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
