/**
 * Analyze Image Sizes and Optimization Opportunities
 * Run with: npx tsx scripts/analyze-image-sizes.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeImageSizes() {
  console.log('📊 Analyzing Image Sizes and Optimization Opportunities');
  console.log('======================================================\n');

  try {
    const projectFolders = ['classic-pearl', 'grand-celeste', 'no1-o-stermalm', 'the-nest', 'wallin-revival'];
    
    let totalFiles = 0;
    let totalSize = 0;
    let largeFiles = 0;
    let largeFilesSize = 0;
    let mediumFiles = 0;
    let mediumFilesSize = 0;
    let smallFiles = 0;
    let smallFilesSize = 0;
    
    const sizeCategories = {
      small: { count: 0, size: 0, threshold: 500 * 1024 }, // < 500KB
      medium: { count: 0, size: 0, threshold: 2 * 1024 * 1024 }, // 500KB - 2MB
      large: { count: 0, size: 0, threshold: 5 * 1024 * 1024 }, // 2MB - 5MB
      veryLarge: { count: 0, size: 0, threshold: Infinity } // > 5MB
    };
    
    console.log('📁 Analyzing each project folder:\n');
    
    for (const projectFolder of projectFolders) {
      console.log(`🔍 ${projectFolder}:`);
      
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
      
      let folderSize = 0;
      let folderLargeFiles = 0;
      let folderLargeFilesSize = 0;
      
      // Categorize files by size
      projectFiles.forEach(file => {
        const size = file.metadata?.size || 0;
        folderSize += size;
        totalSize += size;
        totalFiles++;
        
        if (size < sizeCategories.small.threshold) {
          sizeCategories.small.count++;
          sizeCategories.small.size += size;
        } else if (size < sizeCategories.medium.threshold) {
          sizeCategories.medium.count++;
          sizeCategories.medium.size += size;
        } else if (size < sizeCategories.large.threshold) {
          sizeCategories.large.count++;
          sizeCategories.large.size += size;
        } else {
          sizeCategories.veryLarge.count++;
          sizeCategories.veryLarge.size += size;
        }
        
        // Track large files (> 2MB)
        if (size > 2 * 1024 * 1024) {
          largeFiles++;
          largeFilesSize += size;
          folderLargeFiles++;
          folderLargeFilesSize += size;
        }
      });
      
      const folderSizeMB = (folderSize / (1024 * 1024)).toFixed(2);
      const folderLargeFilesMB = (folderLargeFilesSize / (1024 * 1024)).toFixed(2);
      
      console.log(`   📊 Total: ${projectFiles.length} files, ${folderSizeMB} MB`);
      console.log(`   📊 Large files (>2MB): ${folderLargeFiles} files, ${folderLargeFilesMB} MB`);
      
      // Show largest files in this folder
      const largestFiles = projectFiles
        .sort((a, b) => (b.metadata?.size || 0) - (a.metadata?.size || 0))
        .slice(0, 3);
      
      if (largestFiles.length > 0) {
        console.log(`   🔍 Largest files:`);
        largestFiles.forEach(file => {
          const fileSizeMB = ((file.metadata?.size || 0) / (1024 * 1024)).toFixed(2);
          console.log(`      - ${file.name} (${fileSizeMB} MB)`);
        });
      }
      
      console.log('');
    }
    
    // Overall analysis
    console.log('📈 Overall Analysis:');
    console.log('====================');
    console.log(`Total files: ${totalFiles}`);
    console.log(`Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB (${(totalSize / (1024 * 1024 * 1024)).toFixed(3)} GB)`);
    console.log(`Large files (>2MB): ${largeFiles} files, ${(largeFilesSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Large files percentage: ${((largeFiles / totalFiles) * 100).toFixed(1)}% of files, ${((largeFilesSize / totalSize) * 100).toFixed(1)}% of size`);
    
    console.log('\n📊 Size Distribution:');
    console.log('=====================');
    
    Object.entries(sizeCategories).forEach(([category, data]) => {
      const count = data.count;
      const size = data.size;
      const sizeMB = (size / (1024 * 1024)).toFixed(2);
      const countPercent = ((count / totalFiles) * 100).toFixed(1);
      const sizePercent = ((size / totalSize) * 100).toFixed(1);
      
      let threshold = '';
      if (category === 'small') threshold = '< 500KB';
      else if (category === 'medium') threshold = '500KB - 2MB';
      else if (category === 'large') threshold = '2MB - 5MB';
      else threshold = '> 5MB';
      
      console.log(`${category.padEnd(10)}: ${count.toString().padStart(3)} files (${countPercent}%) | ${sizeMB.padStart(8)} MB (${sizePercent}%) | ${threshold}`);
    });
    
    console.log('\n💡 Optimization Recommendations:');
    console.log('=================================');
    
    if (sizeCategories.veryLarge.count > 0) {
      console.log(`🔴 CRITICAL: ${sizeCategories.veryLarge.count} files are > 5MB (${(sizeCategories.veryLarge.size / (1024 * 1024)).toFixed(2)} MB total)`);
      console.log('   → These should be compressed to < 2MB for web use');
    }
    
    if (sizeCategories.large.count > 0) {
      console.log(`🟡 WARNING: ${sizeCategories.large.count} files are 2-5MB (${(sizeCategories.large.size / (1024 * 1024)).toFixed(2)} MB total)`);
      console.log('   → Consider compressing these to < 1MB for better performance');
    }
    
    if (sizeCategories.medium.count > 0) {
      console.log(`🟢 GOOD: ${sizeCategories.medium.count} files are 500KB-2MB (${(sizeCategories.medium.size / (1024 * 1024)).toFixed(2)} MB total)`);
      console.log('   → These are acceptable for web use');
    }
    
    if (sizeCategories.small.count > 0) {
      console.log(`✅ EXCELLENT: ${sizeCategories.small.count} files are < 500KB (${(sizeCategories.small.size / (1024 * 1024)).toFixed(2)} MB total)`);
      console.log('   → These are well optimized');
    }
    
    // Calculate potential savings
    const potentialSavings = sizeCategories.veryLarge.size + (sizeCategories.large.size * 0.5);
    const potentialSavingsMB = (potentialSavings / (1024 * 1024)).toFixed(2);
    const newTotalSize = totalSize - potentialSavings;
    const newTotalSizeMB = (newTotalSize / (1024 * 1024)).toFixed(2);
    
    console.log('\n💰 Potential Storage Savings:');
    console.log('=============================');
    console.log(`Current total: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Potential savings: ${potentialSavingsMB} MB`);
    console.log(`After optimization: ${newTotalSizeMB} MB`);
    console.log(`Savings percentage: ${((potentialSavings / totalSize) * 100).toFixed(1)}%`);
    
    if (newTotalSize < 400 * 1024 * 1024) {
      console.log('✅ After optimization, storage would be within expected range (< 400MB)');
    } else {
      console.log('⚠️  Even after optimization, storage would still be > 400MB');
    }
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}

analyzeImageSizes()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
