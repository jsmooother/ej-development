import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { siteSettings } from '../src/lib/db/schema';

async function seedDefaultSettings() {
  // Get database URL from environment
  const connectionString = process.env.SUPABASE_DB_POOL_URL || process.env.SUPABASE_DB_URL;
  
  if (!connectionString) {
    console.error('❌ No database connection string found');
    process.exit(1);
  }

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  try {
    console.log('🌱 Seeding default settings...');

    // Default settings
    const defaultSettings = [
      {
        key: 'maxProjects',
        value: '3',
        description: 'Maximum number of projects to show on homepage'
      },
      {
        key: 'maxEditorials', 
        value: '10',
        description: 'Maximum number of editorials to show on homepage'
      },
      {
        key: 'maxInstagram',
        value: '3', 
        description: 'Maximum number of Instagram posts to show on homepage'
      }
    ];

    // Insert or update each setting
    for (const setting of defaultSettings) {
      try {
        await db.insert(siteSettings).values(setting);
        console.log(`✅ Added setting: ${setting.key} = ${setting.value}`);
      } catch (error) {
        // Setting might already exist, that's okay
        console.log(`ℹ️  Setting ${setting.key} already exists, skipping...`);
      }
    }

    console.log('🎉 Default settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedDefaultSettings();
