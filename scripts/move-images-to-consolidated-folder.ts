import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function moveImagesToConsolidatedFolder() {
  console.log('📁 Moving images to consolidated all-images/ folder...\n');

  const projectFolders = [
    'wallin-revival',
    'grand-celeste', 
    'no1-o-stermalm',
    'classic-pearl',
    'the-nest'
  ];

  let totalMoved = 0;

  for (const projectFolder of projectFolders) {
    console.log(`📂 Processing: ${projectFolder}`);
    
    try {
      // Move before images
      const { data: beforeFiles } = await supabase.storage
        .from('images')
        .list(`${projectFolder}/before`, { limit: 1000 });

      if (beforeFiles && beforeFiles.length > 0) {
        console.log(`   📄 Moving ${beforeFiles.length} before images...`);
        
        for (const file of beforeFiles) {
          const newFilename = `${projectFolder}-before-${file.name}`;
          
          try {
            // Download the file
            const { data: fileData, error: downloadError } = await supabase.storage
              .from('images')
              .download(`${projectFolder}/before/${file.name}`);

            if (downloadError) {
              console.log(`      ❌ Download error for ${file.name}: ${downloadError.message}`);
              continue;
            }

            // Upload to new location
            const { error: uploadError } = await supabase.storage
              .from('images')
              .upload(`all-images/${newFilename}`, fileData, {
                contentType: file.metadata?.mimetype || 'image/jpeg',
                upsert: true
              });

            if (uploadError) {
              console.log(`      ❌ Upload error for ${newFilename}: ${uploadError.message}`);
              continue;
            }

            console.log(`      ✅ Moved: ${file.name} → ${newFilename}`);
            totalMoved++;

          } catch (error) {
            console.log(`      ❌ Error moving ${file.name}: ${error}`);
          }
        }
      }

      // Move after images
      const { data: afterFiles } = await supabase.storage
        .from('images')
        .list(`${projectFolder}/after`, { limit: 1000 });

      if (afterFiles && afterFiles.length > 0) {
        console.log(`   📄 Moving ${afterFiles.length} after images...`);
        
        for (const file of afterFiles) {
          const newFilename = `${projectFolder}-after-${file.name}`;
          
          try {
            // Download the file
            const { data: fileData, error: downloadError } = await supabase.storage
              .from('images')
              .download(`${projectFolder}/after/${file.name}`);

            if (downloadError) {
              console.log(`      ❌ Download error for ${file.name}: ${downloadError.message}`);
              continue;
            }

            // Upload to new location
            const { error: uploadError } = await supabase.storage
              .from('images')
              .upload(`all-images/${newFilename}`, fileData, {
                contentType: file.metadata?.mimetype || 'image/jpeg',
                upsert: true
              });

            if (uploadError) {
              console.log(`      ❌ Upload error for ${newFilename}: ${uploadError.message}`);
              continue;
            }

            console.log(`      ✅ Moved: ${file.name} → ${newFilename}`);
            totalMoved++;

          } catch (error) {
            console.log(`      ❌ Error moving ${file.name}: ${error}`);
          }
        }
      }

      console.log(`   ✅ Completed moving images for ${projectFolder}\n`);

    } catch (error) {
      console.log(`   ❌ Error processing ${projectFolder}: ${error}\n`);
    }
  }

  console.log(`🎉 Image consolidation completed!`);
  console.log(`📊 Total images moved: ${totalMoved}`);
  console.log(`📁 All images now in: all-images/ folder`);
  console.log(`\n📝 Next steps:`);
  console.log(`1. Verify images are accessible at new URLs`);
  console.log(`2. Test frontend to ensure images display correctly`);
  console.log(`3. Delete old project folders from storage (optional cleanup)`);
}

moveImagesToConsolidatedFolder()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
