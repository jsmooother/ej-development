import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listStorageFiles() {
  console.log('🔍 Listing all files in Supabase Storage...\n');

  try {
    // List all files in the images bucket
    const { data: files, error } = await supabase.storage
      .from('images')
      .list('', { 
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('❌ Error listing storage files:', error);
      return;
    }

    console.log(`📁 Found ${files.length} files in storage:\n`);

    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file.name}`);
      console.log(`   Size: ${file.metadata?.size || 'Unknown'} bytes`);
      console.log(`   Type: ${file.metadata?.mimetype || 'Unknown'}`);
      console.log(`   Created: ${file.created_at}`);
      console.log('');
    });

    // Also try to get public URLs for these files
    console.log('🔗 Public URLs for these files:\n');
    for (const file of files) {
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(file.name);
      
      console.log(`${file.name}:`);
      console.log(`   URL: ${data.publicUrl}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

listStorageFiles()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
