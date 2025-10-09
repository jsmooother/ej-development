import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const DB_URL = process.env.SUPABASE_DB_URL;

if (!DB_URL) {
  console.error('❌ SUPABASE_DB_URL not found in environment');
  process.exit(1);
}

const sql = postgres(DB_URL, {
  ssl: 'require',
  prepare: false,
  max: 1,
});

async function cleanupDuplicates() {
  try {
    console.log('🧹 Cleaning up duplicate data...\n');
    
    // Remove duplicate editorials (ones with local image paths)
    console.log('Removing duplicate editorials with local image paths...');
    const deletedPosts = await sql`
      DELETE FROM posts 
      WHERE cover_image_path LIKE 'post-images/%'
      RETURNING id, title;
    `;
    console.log(`✅ Removed ${deletedPosts.length} duplicate editorials:`);
    deletedPosts.forEach(post => console.log(`   - ${post.title}`));
    
    // Remove duplicate projects (ones with local image paths)
    console.log('\nRemoving duplicate projects with local image paths...');
    const deletedProjects = await sql`
      DELETE FROM projects 
      WHERE hero_image_path LIKE 'project-images/%'
      RETURNING id, title;
    `;
    console.log(`✅ Removed ${deletedProjects.length} duplicate projects:`);
    deletedProjects.forEach(project => console.log(`   - ${project.title}`));
    
    // Show remaining data
    console.log('\n📊 Remaining data:');
    const [projectCount] = await sql`SELECT COUNT(*)::int as count FROM projects;`;
    const [postCount] = await sql`SELECT COUNT(*)::int as count FROM posts;`;
    console.log(`   Projects: ${projectCount.count}`);
    console.log(`   Editorials: ${postCount.count}`);
    
    console.log('\n✨ Cleanup complete!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

cleanupDuplicates();

