import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { projects } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

config({ path: '.env.local' });

const dbUrl = process.env.SUPABASE_DB_URL!;
const client = postgres(dbUrl);
const db = drizzle(client);

/*
BEST PRACTICE FOR SWEDISH CHARACTERS IN URLs:

Å → aa
Ä → ae  
Ö → oe

Examples:
- "Östermalm" → "oestermalm"
- "Malmö" → "malmoe"
- "Västerås" → "vaesteraas"

This follows standard transliteration practices for Nordic languages
and ensures URLs are SEO-friendly and compatible across all systems.
*/

async function fixSlug() {
  console.log('🔧 Fixing slug for No1 Östermalm');
  console.log('================================\n');

  // Find the project
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, 'no1-o-stermalm'));

  if (!project) {
    console.error('❌ Project not found with slug: no1-o-stermalm');
    return;
  }

  console.log(`Found project: ${project.title}`);
  console.log(`Current slug: ${project.slug}`);
  console.log(`New slug: no1-oestermalm\n`);

  // Update to proper transliteration
  await db
    .update(projects)
    .set({
      slug: 'no1-oestermalm'
    })
    .where(eq(projects.id, project.id));

  console.log('✅ Slug updated successfully!');
  console.log('\n📋 Best Practice Reference:');
  console.log('   Å → aa (Västerås → vaesteraas)');
  console.log('   Ä → ae (Hägersten → haegersten)');
  console.log('   Ö → oe (Östermalm → oestermalm)');
}

fixSlug()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
