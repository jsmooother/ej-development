import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';

config({ path: '.env.local' });

const dbUrl = process.env.SUPABASE_DB_URL!;
const client = postgres(dbUrl);
const db = drizzle(client);

async function checkProjects() {
  console.log('📋 Projects in Database:');
  console.log('========================\n');

  const allProjects = await db.select().from(projects);

  for (const project of allProjects) {
    console.log(`Project: ${project.title}`);
    console.log(`  Slug: ${project.slug}`);
    console.log(`  ID: ${project.id}`);
    console.log(`  Published: ${project.isPublished}`);
    console.log(`  Images: ${(project.projectImages as any[])?.length || 0}`);
    console.log(`  Pairs: ${(project.imagePairs as any[])?.length || 0}`);
    console.log('');
  }

  console.log(`Total projects: ${allProjects.length}`);
}

checkProjects()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
