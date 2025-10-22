/**
 * Comprehensive Storage Check - Including Temp Files and Trash
 * Run with: npx tsx scripts/check-all-storage-including-temp.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllStorageIncludingTemp() {
  console.log('🔍 Comprehensive Storage Check - Including Temp Files and Trash');
  console.log('================================================================\n');

  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error(`❌ Error listing buckets: ${bucketsError.message}`);
      return;
    }
    
    console.log(`📁 Found ${buckets?.length || 0} buckets:\n`);
    
    let totalFiles = 0;
    let totalSize = 0;
    let tempFiles = 0;
    let tempSize = 0;
    let trashFiles = 0;
    let trashSize = 0;
    
    for (const bucket of buckets || []) {
      console.log(`🪣 Bucket: ${bucket.name}`);
      console.log(`   Public: ${bucket.public ? 'Yes' : 'No'}`);
      console.log(`   Created: ${bucket.created_at}`);
      
      try {
        // Check root level
        const { data: rootFiles, error: rootError } = await supabase.storage
          .from(bucket.name)
          .list('', { limit: 1000 });
        
        if (rootError) {
          console.log(`   ❌ Error listing root: ${rootError.message}`);
          continue;
        }
        
        if (!rootFiles || rootFiles.length === 0) {
          console.log(`   📁 No files at root level`);
          continue;
        }
        
        let bucketSize = 0;
        let bucketFiles = 0;
        
        // Analyze root files
        for (const file of rootFiles) {
          const size = file.metadata?.size || 0;
          bucketSize += size;
          bucketFiles++;
          totalSize += size;
          totalFiles++;
          
          // Check for temp/trash files
          const fileName = file.name.toLowerCase();
          if (fileName.includes('temp') || fileName.includes('tmp') || fileName.includes('cache')) {
            tempFiles++;
            tempSize += size;
            console.log(`   🗑️  TEMP FILE: ${file.name} (${(size / 1024 / 1024).toFixed(2)}MB)`);
          }
          if (fileName.includes('trash') || fileName.includes('deleted') || fileName.includes('old')) {
            trashFiles++;
            trashSize += size;
            console.log(`   🗑️  TRASH FILE: ${file.name} (${(size / 1024 / 1024).toFixed(2)}MB)`);
          }
        }
        
        console.log(`   📊 Root level: ${bucketFiles} files, ${(bucketSize / 1024 / 1024).toFixed(2)} MB`);
        
        // Check common temp/trash folders
        const tempFolders = [
          'temp', 'tmp', 'cache', 'trash', 'deleted', 'old', 'backup', 
          'uploads', 'processing', 'staging', '.temp', '.tmp', '.cache',
          'all-images', 'duplicates', 'unused'
        ];
        
        for (const tempFolder of tempFolders) {
          try {
            const { data: tempFiles, error: tempError } = await supabase.storage
              .from(bucket.name)
              .list(tempFolder, { limit: 1000 });
            
            if (!tempError && tempFiles && tempFiles.length > 0) {
              let folderSize = 0;
              let folderFiles = 0;
              
              tempFiles.forEach(file => {
                const size = file.metadata?.size || 0;
                folderSize += size;
                folderFiles++;
                totalSize += size;
                totalFiles++;
              });
              
              const folderSizeMB = (folderSize / 1024 / 1024).toFixed(2);
              console.log(`   🗑️  ${tempFolder}/: ${folderFiles} files, ${folderSizeMB} MB`);
              
              if (tempFolder.includes('temp') || tempFolder.includes('tmp') || tempFolder.includes('cache')) {
                tempFiles += folderFiles;
                tempSize += folderSize;
              }
              if (tempFolder.includes('trash') || tempFolder.includes('deleted') || tempFolder.includes('old')) {
                trashFiles += folderFiles;
                trashSize += folderSize;
              }
            }
          } catch (error) {
            // Folder doesn't exist, ignore
          }
        }
        
        // Check for hidden files (starting with .)
        try {
          const { data: hiddenFiles, error: hiddenError } = await supabase.storage
            .from(bucket.name)
            .list('.', { limit: 1000 });
          
          if (!hiddenError && hiddenFiles && hiddenFiles.length > 0) {
            let hiddenSize = 0;
            let hiddenCount = 0;
            
            hiddenFiles.forEach(file => {
              if (file.name.startsWith('.')) {
                const size = file.metadata?.size || 0;
                hiddenSize += size;
                hiddenCount++;
                totalSize += size;
                totalFiles++;
                console.log(`   👻 HIDDEN FILE: ${file.name} (${(size / 1024 / 1024).toFixed(2)}MB)`);
              }
            });
            
            if (hiddenCount > 0) {
              const hiddenSizeMB = (hiddenSize / 1024 / 1024).toFixed(2);
              console.log(`   👻 Hidden files: ${hiddenCount} files, ${hiddenSizeMB} MB`);
            }
          }
        } catch (error) {
          // No hidden files or error accessing
        }
        
        // Check for files with suspicious names (UUIDs, timestamps, etc.)
        const suspiciousFiles = rootFiles.filter(file => {
          const name = file.name;
          // Check for UUID patterns, long timestamps, or random strings
          return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(name) ||
                 /^\d{13,}/.test(name) || // Long timestamps
                 /^[a-z0-9]{20,}/i.test(name); // Long random strings
        });
        
        if (suspiciousFiles.length > 0) {
          console.log(`   ⚠️  Suspicious files (${suspiciousFiles.length}):`);
          suspiciousFiles.slice(0, 5).forEach(file => {
            const size = (file.metadata?.size || 0) / 1024 / 1024;
            console.log(`      - ${file.name} (${size.toFixed(2)}MB)`);
          });
          if (suspiciousFiles.length > 5) {
            console.log(`      ... and ${suspiciousFiles.length - 5} more`);
          }
        }
        
      } catch (error) {
        console.log(`   ❌ Error analyzing bucket ${bucket.name}: ${error}`);
      }
      
      console.log('');
    }
    
    // Summary
    console.log('📈 Comprehensive Storage Summary:');
    console.log('=================================');
    console.log(`Total buckets: ${buckets?.length || 0}`);
    console.log(`Total files: ${totalFiles}`);
    console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB (${(totalSize / 1024 / 1024 / 1024).toFixed(3)} GB)`);
    console.log(`Free tier usage: ${((totalSize / (1024 * 1024 * 1024)) * 100).toFixed(1)}% of 1GB`);
    
    if (tempFiles > 0) {
      console.log(`\n🗑️  TEMP FILES FOUND:`);
      console.log(`   Files: ${tempFiles}`);
      console.log(`   Size: ${(tempSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   ⚠️  These should be cleaned up!`);
    }
    
    if (trashFiles > 0) {
      console.log(`\n🗑️  TRASH FILES FOUND:`);
      console.log(`   Files: ${trashFiles}`);
      console.log(`   Size: ${(trashSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   ⚠️  These should be cleaned up!`);
    }
    
    if (tempFiles === 0 && trashFiles === 0) {
      console.log(`\n✅ No temp or trash files found - storage is clean!`);
    }
    
    // Check if we're still over the expected limit
    if (totalSize > 400 * 1024 * 1024) {
      console.log(`\n⚠️  WARNING: Storage usage (${(totalSize / 1024 / 1024).toFixed(2)}MB) is still higher than expected (400MB)`);
      console.log(`   This suggests there may be more files or the dashboard is showing different data.`);
    } else {
      console.log(`\n✅ Storage usage (${(totalSize / 1024 / 1024).toFixed(2)}MB) is within expected range (< 400MB)`);
    }
    
  } catch (error) {
    console.error('❌ Error during comprehensive check:', error);
  }
}

checkAllStorageIncludingTemp()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
