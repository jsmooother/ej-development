/**
 * Simple database reset without environment dependencies
 * Run with: npx tsx scripts/simple-reset.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Direct database connection (you'll need to provide your connection string)
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('❌ Please set DATABASE_URL or POSTGRES_URL environment variable');
  console.log('You can find this in your Supabase project settings > Database > Connection string');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function resetDatabase() {
  console.log('🔄 Resetting database...');
  
  try {
    // Delete in correct order (respecting foreign key constraints)
    console.log('🗑️ Deleting project images...');
    await client`DELETE FROM project_images`;
    
    console.log('🗑️ Deleting projects...');
    await client`DELETE FROM projects`;
    
    console.log('🗑️ Deleting posts...');
    await client`DELETE FROM posts`;
    
    console.log('🗑️ Deleting listings...');
    await client`DELETE FROM listings`;
    
    console.log('🗑️ Deleting listing documents...');
    await client`DELETE FROM listing_documents`;
    
    console.log('');
    console.log('🎉 Database reset complete!');
    console.log('');
    console.log('✅ What was cleaned:');
    console.log('- All projects and project images');
    console.log('- All posts (editorials)');
    console.log('- All listings and listing documents');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Your database is now clean and ready for new projects');
    console.log('2. Create new projects with the new image system');
    console.log('3. Toggle state issues should be resolved');
    console.log('4. Images will be stored in Supabase Storage with compression');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await client.end();
  }
}

resetDatabase();
