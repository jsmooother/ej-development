import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { comingSoonProjects } from '../src/lib/db/schema';

async function seedComingSoon() {
  // Get database URL from environment
  const connectionString = process.env.SUPABASE_DB_POOL_URL || process.env.SUPABASE_DB_URL;
  
  if (!connectionString) {
    console.error('❌ No database connection string found');
    process.exit(1);
  }

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  try {
    console.log('🌱 Seeding coming soon project...');

    // Default coming soon project
    const defaultProject = {
      title: 'Casa Serrana',
      description: 'Our flagship 700 sqm villa in Sierra Blanca is in final detailing. Photography, floorplans, and the full brochure will publish shortly. Until then, consider this a reserved column awaiting its debut imagery.',
      highlights: [
        'Double-height great room opening to an 18m infinity pool.',
        'Primary suite with private solarium and Mediterranean views.',
        'Wellness wing featuring spa, gym, and plunge court.'
      ],
      isActive: true
    };

    // Insert the coming soon project
    await db.insert(comingSoonProjects).values(defaultProject);
    console.log('✅ Added coming soon project: Casa Serrana');
    console.log('🎉 Coming soon project seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding coming soon project:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedComingSoon();