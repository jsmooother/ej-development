import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjectFolders() {
  console.log('🔍 Checking contents of project folders in storage...\n');

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
      // List files in this project folder
      const { data: files, error } = await supabase.storage
        .from('images')
        .list(folder, { 
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        continue;
      }

      if (!files || files.length === 0) {
        console.log(`   📁 Empty folder`);
        continue;
      }

      console.log(`   📄 ${files.length} files found:`);
      
      // Group by subfolder (before/after/gallery)
      const subfolders: { [key: string]: string[] } = {};
      
      files.forEach(file => {
        // Extract subfolder from path
        const pathParts = file.name.split('/');
        const subfolder = pathParts[0] || 'root';
        
        if (!subfolders[subfolder]) {
          subfolders[subfolder] = [];
        }
        subfolders[subfolder].push(file.name);
      });

      Object.entries(subfolders).forEach(([subfolder, fileList]) => {
        console.log(`      📁 ${subfolder}: ${fileList.length} files`);
        // Show first few files as examples
        fileList.slice(0, 3).forEach(file => {
          console.log(`         📄 ${file}`);
        });
        if (fileList.length > 3) {
          console.log(`         ... and ${fileList.length - 3} more files`);
        }
      });

      // Generate some example public URLs
      console.log(`   🔗 Example URLs:`);
      files.slice(0, 2).forEach(file => {
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(`${folder}/${file.name}`);
        console.log(`      ${file.name}: ${data.publicUrl}`);
      });

    } catch (error) {
      console.log(`   ❌ Error checking folder: ${error}`);
    }
    
    console.log('');
  }
}

checkProjectFolders()
  .then(() => {
    console.log('✅ Folder check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
