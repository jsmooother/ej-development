import * as fs from "fs";
import * as path from "path";
import postgres from "postgres";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const migrationUrl = process.env.DIRECT_URL ?? process.env.SUPABASE_DB_URL;

if (!migrationUrl) {
  console.error("❌ Missing DIRECT_URL or SUPABASE_DB_URL environment variable");
  process.exit(1);
}

async function applyMigrations() {
  console.log("🚀 Starting database migration...\n");

  const sql = postgres(migrationUrl!, {
    ssl: "require",
    max: 1,
  });

  try {
    // Read migration files
    const migrationsDir = path.join(process.cwd(), "drizzle");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    console.log(`📁 Found ${migrationFiles.length} migration files:\n`);

    for (const file of migrationFiles) {
      console.log(`📄 Applying: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

      try {
        await sql.unsafe(migrationSQL);
        console.log(`✅ Successfully applied: ${file}\n`);
      } catch (error) {
        // Check if error is because table already exists
        if (error instanceof Error && error.message.includes("already exists")) {
          console.log(`⚠️  Skipped (already exists): ${file}\n`);
        } else {
          throw error;
        }
      }
    }

    // Verify tables were created
    console.log("🔍 Verifying database schema...\n");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log("📊 Tables in database:");
    tables.forEach((table: any) => {
      console.log(`   ✓ ${table.table_name}`);
    });

    console.log(`\n✅ Migration completed successfully! Created ${tables.length} tables.`);
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyMigrations();
