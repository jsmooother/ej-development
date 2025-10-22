/**
 * Investigate the actual folder structure in storage
 * Run with: npx tsx scripts/investigate-folder-structure.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function investigateFolderStructure() {
  console.log('🔍 Investigating Folder Structure in Storage');
  console.log('============================================\n');

  try {
    // First, let's see what's at the root level
    console.log('1. Root level files/folders:');
    const { data: rootFiles, error: rootError } = await supabase.storage
      .from('images')
      .list('', { limit: 100 });
    
    if (rootError) {
      console.error(`❌ Error: ${rootError.message}`);
      return;
    }
    
    if (!rootFiles || rootFiles.length === 0) {
      console.log('📁 No files at root level');
      return;
    }
    
    console.log(`Found ${rootFiles.length} items at root level:`);
    rootFiles.forEach(file => {
      console.log(`  - ${file.name} (${file.metadata?.size || 0} bytes)`);
    });
    console.log('');
    
    // Now let's check if these are actually folders by trying to list their contents
    for (const item of rootFiles) {
      console.log(`2. Checking if "${item.name}" is a folder:`);
      
      try {
        const { data: folderContents, error: folderError } = await supabase.storage
          .from('images')
          .list(item.name, { limit: 100 });
        
        if (folderError) {
          console.log(`   ❌ Error listing contents: ${folderError.message}`);
          console.log(`   → This is likely a file, not a folder`);
        } else if (!folderContents || folderContents.length === 0) {
          console.log(`   📁 Empty folder`);
        } else {
          console.log(`   📁 Folder with ${folderContents.length} items:`);
          
          let folderSize = 0;
          let actualFiles = 0;
          
          folderContents.forEach(file => {
            const size = file.metadata?.size || 0;
            folderSize += size;
            if (size > 0) actualFiles++;
            
            console.log(`      - ${file.name} (${size} bytes)`);
          });
          
          const folderSizeMB = (folderSize / (1024 * 1024)).toFixed(2);
          console.log(`   📊 Folder total size: ${folderSizeMB} MB`);
          console.log(`   📊 Files with actual size: ${actualFiles}/${folderContents.length}`);
          
          // If this folder has real files, let's check if there are subfolders
          if (actualFiles > 0) {
            console.log(`   🔍 Checking for subfolders...`);
            
            for (const subItem of folderContents) {
              try {
                const { data: subContents, error: subError } = await supabase.storage
                  .from('images')
                  .list(`${item.name}/${subItem.name}`, { limit: 10 });
                
                if (!subError && subContents && subContents.length > 0) {
                  console.log(`      📁 Subfolder: ${item.name}/${subItem.name}/ (${subContents.length} items)`);
                  
                  let subSize = 0;
                  subContents.forEach(file => {
                    subSize += file.metadata?.size || 0;
                  });
                  
                  const subSizeMB = (subSize / (1024 * 1024)).toFixed(2);
                  console.log(`         Size: ${subSizeMB} MB`);
                }
              } catch (error) {
                // Not a folder, ignore
              }
            }
          }
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error}`);
      }
      
      console.log('');
    }
    
    // Let's also try to get a more comprehensive view by checking common paths
    console.log('3. Checking common storage paths:');
    const commonPaths = [
      'projects',
      'projects/classic-pearl',
      'projects/grand-celeste', 
      'projects/no1-o-stermalm',
      'projects/the-nest',
      'projects/wallin-revival',
      'uploads',
      'editorials'
    ];
    
    for (const path of commonPaths) {
      try {
        const { data: pathContents, error: pathError } = await supabase.storage
          .from('images')
          .list(path, { limit: 100 });
        
        if (pathError) {
          console.log(`   ❌ ${path}: ${pathError.message}`);
        } else if (!pathContents || pathContents.length === 0) {
          console.log(`   📁 ${path}: Empty`);
        } else {
          let pathSize = 0;
          let pathFiles = 0;
          
          pathContents.forEach(file => {
            const size = file.metadata?.size || 0;
            pathSize += size;
            if (size > 0) pathFiles++;
          });
          
          const pathSizeMB = (pathSize / (1024 * 1024)).toFixed(2);
          console.log(`   📁 ${path}: ${pathContents.length} items, ${pathSizeMB} MB (${pathFiles} files with size)`);
          
          // Show first few files
          if (pathFiles > 0) {
            const filesWithSize = pathContents.filter(f => (f.metadata?.size || 0) > 0);
            filesWithSize.slice(0, 3).forEach(file => {
              const sizeMB = ((file.metadata?.size || 0) / (1024 * 1024)).toFixed(2);
              console.log(`      - ${file.name} (${sizeMB} MB)`);
            });
          }
        }
      } catch (error) {
        console.log(`   ❌ ${path}: Error - ${error}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

investigateFolderStructure()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
