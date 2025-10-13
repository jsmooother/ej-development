import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDeepStorage() {
  console.log('🔍 Checking deep storage structure...\n');

  const projectFolders = [
    'wallin-revival',
    'grand-celeste', 
    'no1-o-stermalm',
    'classic-pearl',
    'the-nest'
  ];

  for (const folder of projectFolders) {
    console.log(`📂 Checking folder: ${folder}`);
    
    try {
      // Check if before folder exists and has images
      const { data: beforeFiles, error: beforeError } = await supabase.storage
        .from('images')
        .list(`${folder}/before`, { limit: 100 });

      if (!beforeError && beforeFiles && beforeFiles.length > 0) {
        console.log(`   📁 before: ${beforeFiles.length} files`);
        beforeFiles.slice(0, 3).forEach(file => {
          console.log(`      📄 ${file.name}`);
        });
        if (beforeFiles.length > 3) {
          console.log(`      ... and ${beforeFiles.length - 3} more`);
        }
      } else {
        console.log(`   📁 before: No files found`);
      }

      // Check if after folder exists and has images
      const { data: afterFiles, error: afterError } = await supabase.storage
        .from('images')
        .list(`${folder}/after`, { limit: 100 });

      if (!afterError && afterFiles && afterFiles.length > 0) {
        console.log(`   📁 after: ${afterFiles.length} files`);
        afterFiles.slice(0, 3).forEach(file => {
          console.log(`      📄 ${file.name}`);
        });
        if (afterFiles.length > 3) {
          console.log(`      ... and ${afterFiles.length - 3} more`);
        }
      } else {
        console.log(`   📁 after: No files found`);
      }

      // Check if there are any other subfolders
      const { data: allFiles, error: allError } = await supabase.storage
        .from('images')
        .list(folder, { limit: 1000 });

      if (!allError && allFiles) {
        const subfolders = allFiles.filter(file => !file.name.includes('.'));
        if (subfolders.length > 0) {
          console.log(`   📁 Other subfolders:`);
          subfolders.forEach(subfolder => {
            console.log(`      📁 ${subfolder.name}`);
          });
        }

        const imageFiles = allFiles.filter(file => 
          file.name.includes('.') && 
          (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || 
           file.name.endsWith('.png') || file.name.endsWith('.webp'))
        );
        
        if (imageFiles.length > 0) {
          console.log(`   📄 Direct image files: ${imageFiles.length}`);
          imageFiles.slice(0, 3).forEach(file => {
            console.log(`      📄 ${file.name}`);
          });
        }
      }

    } catch (error) {
      console.log(`   ❌ Error checking folder: ${error}`);
    }
    
    console.log('');
  }
}

checkDeepStorage()
  .then(() => {
    console.log('✅ Deep storage check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
