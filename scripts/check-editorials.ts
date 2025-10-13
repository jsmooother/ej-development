import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { posts } from '../src/lib/db/schema';

config({ path: '.env.local' });

const client = postgres(process.env.SUPABASE_DB_URL!);
const db = drizzle(client);

async function checkEditorials() {
  console.log('📊 Checking Editorials');
  console.log('=====================\n');

  const editorials = await db.select().from(posts);

  console.log(`Total editorials: ${editorials.length}\n`);

  editorials.forEach((editorial, i) => {
    console.log(`${i + 1}. ${editorial.title}`);
    console.log(`   Slug: ${editorial.slug}`);
    console.log(`   Published: ${editorial.isPublished}`);
    console.log(`   Cover Image: ${editorial.coverImagePath || '❌ MISSING'}`);
    console.log(`   Excerpt: ${editorial.excerpt ? '✅' : '❌ Missing'}`);
    console.log('');
  });

  const published = editorials.filter(e => e.isPublished);
  const withImages = editorials.filter(e => e.coverImagePath);
  
  console.log('📈 Summary:');
  console.log(`   Total: ${editorials.length}`);
  console.log(`   Published: ${published.length}`);
  console.log(`   With Images: ${withImages.length}`);
  console.log(`   Missing Images: ${editorials.length - withImages.length}`);
}

checkEditorials()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
