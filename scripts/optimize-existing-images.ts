/**
 * Optimize Existing Images in Supabase Storage
 * Run with: npx tsx scripts/optimize-existing-images.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Image optimization settings
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB max
const MAX_WIDTH = 1920; // Max width for web images
const MAX_HEIGHT = 1080; // Max height for web images
const QUALITY = 85; // JPEG quality

async function optimizeExistingImages() {
  console.log('🖼️  Optimizing Existing Images in Storage');
  console.log('==========================================\n');

  try {
    const projectFolders = ['classic-pearl', 'grand-celeste', 'no1-o-stermalm', 'the-nest', 'wallin-revival'];
    
    let totalFilesProcessed = 0;
    let totalFilesOptimized = 0;
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let totalSavings = 0;
    
    for (const projectFolder of projectFolders) {
      console.log(`🔍 Processing ${projectFolder}...`);
      
      const { data: projectFiles, error: projectError } = await supabase.storage
        .from('images')
        .list(`projects/${projectFolder}`, { limit: 1000 });
      
      if (projectError) {
        console.log(`   ❌ Error: ${projectError.message}`);
        continue;
      }
      
      if (!projectFiles || projectFiles.length === 0) {
        console.log(`   📁 No files found`);
        continue;
      }
      
      // Filter files that need optimization (> 1MB)
      const filesToOptimize = projectFiles.filter(file => 
        (file.metadata?.size || 0) > 1024 * 1024 // > 1MB
      );
      
      if (filesToOptimize.length === 0) {
        console.log(`   ✅ No files need optimization`);
        continue;
      }
      
      console.log(`   📊 Found ${filesToOptimize.length} files to optimize (out of ${projectFiles.length} total)`);
      
      let folderOriginalSize = 0;
      let folderOptimizedSize = 0;
      let folderSavings = 0;
      let folderOptimized = 0;
      
      for (const file of filesToOptimize) {
        const filePath = `projects/${projectFolder}/${file.name}`;
        const originalSize = file.metadata?.size || 0;
        folderOriginalSize += originalSize;
        
        try {
          console.log(`   🔄 Optimizing ${file.name} (${(originalSize / 1024 / 1024).toFixed(2)}MB)...`);
          
          // Download the file
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('images')
            .download(filePath);
          
          if (downloadError) {
            console.log(`     ❌ Download error: ${downloadError.message}`);
            continue;
          }
          
          // Convert to buffer
          const buffer = Buffer.from(await fileData.arrayBuffer());
          
          // Optimize with Sharp
          const image = sharp(buffer);
          const metadata = await image.metadata();
          
          // Get original dimensions
          const originalWidth = metadata.width || 0;
          const originalHeight = metadata.height || 0;
          
          // Calculate new dimensions (maintain aspect ratio)
          let newWidth = originalWidth;
          let newHeight = originalHeight;
          
          if (originalWidth > MAX_WIDTH || originalHeight > MAX_HEIGHT) {
            const aspectRatio = originalWidth / originalHeight;
            if (originalWidth > originalHeight) {
              newWidth = MAX_WIDTH;
              newHeight = Math.round(MAX_WIDTH / aspectRatio);
            } else {
              newHeight = MAX_HEIGHT;
              newWidth = Math.round(MAX_HEIGHT * aspectRatio);
            }
          }
          
          // Optimize image
          const optimizedBuffer = await image
            .resize(newWidth, newHeight, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ 
              quality: QUALITY,
              progressive: true,
              mozjpeg: true
            })
            .toBuffer();
          
          const optimizedSize = optimizedBuffer.length;
          const savings = originalSize - optimizedSize;
          const savingsPercent = Math.round((savings / originalSize) * 100);
          
          // Only replace if we achieved significant savings (> 10%)
          if (savingsPercent > 10) {
            // Generate new filename with .jpg extension
            const newFileName = file.name.replace(/\.[^/.]+$/, '.jpg');
            const newFilePath = `projects/${projectFolder}/${newFileName}`;
            
            // Upload optimized version
            const { error: uploadError } = await supabase.storage
              .from('images')
              .upload(newFilePath, optimizedBuffer, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
                upsert: true // Replace existing file
              });
            
            if (uploadError) {
              console.log(`     ❌ Upload error: ${uploadError.message}`);
              continue;
            }
            
            // Delete original file if it's different from the new one
            if (file.name !== newFileName) {
              const { error: deleteError } = await supabase.storage
                .from('images')
                .remove([filePath]);
              
              if (deleteError) {
                console.log(`     ⚠️  Warning: Could not delete original file: ${deleteError.message}`);
              }
            }
            
            console.log(`     ✅ Optimized: ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}`);
            console.log(`     💾 Size: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(optimizedSize / 1024 / 1024).toFixed(2)}MB (${savingsPercent}% savings)`);
            
            folderOptimizedSize += optimizedSize;
            folderSavings += savings;
            folderOptimized++;
            totalFilesOptimized++;
          } else {
            console.log(`     ⏭️  Skipped: Only ${savingsPercent}% savings (not significant)`);
            folderOptimizedSize += originalSize; // Keep original size
          }
          
          totalFilesProcessed++;
          totalOriginalSize += originalSize;
          totalOptimizedSize += folderOptimizedSize;
          totalSavings += folderSavings;
          
        } catch (error) {
          console.log(`     ❌ Optimization error: ${error}`);
          folderOptimizedSize += originalSize; // Keep original size
          totalOptimizedSize += originalSize;
        }
      }
      
      const folderSavingsMB = (folderSavings / 1024 / 1024).toFixed(2);
      const folderSavingsPercent = folderOriginalSize > 0 ? Math.round((folderSavings / folderOriginalSize) * 100) : 0;
      
      console.log(`   📊 ${projectFolder} summary:`);
      console.log(`      Files optimized: ${folderOptimized}/${filesToOptimize.length}`);
      console.log(`      Storage saved: ${folderSavingsMB}MB (${folderSavingsPercent}%)`);
      console.log('');
    }
    
    // Final summary
    console.log('📈 Optimization Summary:');
    console.log('========================');
    console.log(`Total files processed: ${totalFilesProcessed}`);
    console.log(`Total files optimized: ${totalFilesOptimized}`);
    console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Total storage saved: ${(totalSavings / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Overall savings: ${totalOriginalSize > 0 ? Math.round((totalSavings / totalOriginalSize) * 100) : 0}%`);
    
    const newTotalSize = totalOriginalSize - totalSavings;
    const newTotalSizeMB = (newTotalSize / 1024 / 1024).toFixed(2);
    
    console.log(`\n📊 New total storage usage: ${newTotalSizeMB}MB`);
    
    if (newTotalSize < 400 * 1024 * 1024) {
      console.log('✅ Storage usage is now within expected range (< 400MB)');
    } else {
      console.log('⚠️  Storage usage is still higher than expected (> 400MB)');
    }
    
  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

optimizeExistingImages()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
