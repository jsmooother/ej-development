/**
 * Simple database reset script
 * Run with: npx tsx scripts/reset-database.ts
 */

import { getDb } from '../src/lib/db/index';
import { projects, projectImages, posts, listings } from '../src/lib/db/schema';

async function resetDatabase() {
  console.log('🔄 Resetting database...');
  
  try {
    const db = getDb();
    
    // Delete in correct order (respecting foreign key constraints)
    await db.delete(projectImages);
    console.log('✅ Deleted project images');
    
    await db.delete(projects);
    console.log('✅ Deleted projects');
    
    await db.delete(posts);
    console.log('✅ Deleted posts');
    
    await db.delete(listings);
    console.log('✅ Deleted listings');
    
    console.log('');
    console.log('🎉 Database reset complete!');
    console.log('You can now create fresh projects with the new image system.');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }
}

resetDatabase();
