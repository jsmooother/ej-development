import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { posts } from './src/lib/db/schema';

config({ path: '.env.local' });

const client = postgres(process.env.SUPABASE_DB_URL!);
const db = drizzle(client);

async function checkEditorials() {
  const editorials = await db.select().from(posts);
  
  console.log('📊 Editorials:', editorials.length);
  console.log('');
  
  editorials.forEach((e: any, i: number) => {
    console.log(`${i + 1}. ${e.title}`);
    console.log(`   Published: ${e.isPublished}`);
    console.log(`   Image: ${e.coverImagePath || '❌ MISSING'}`);
    console.log('');
  });
  
  await client.end();
}

checkEditorials();
