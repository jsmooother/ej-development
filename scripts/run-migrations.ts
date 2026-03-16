#!/usr/bin/env tsx
/**
 * Run Drizzle SQL migrations against the database.
 * Uses DIRECT_URL or SUPABASE_DB_URL from .env.local
 */
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const dbUrl = process.env.DIRECT_URL ?? process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error("Missing DIRECT_URL or SUPABASE_DB_URL");
  process.exit(1);
}

const migrationsDir = path.resolve(process.cwd(), "drizzle");
const files = fs.readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql") && !f.startsWith("._") && !f.includes(" 2."))
  .sort();

async function main() {
  const postgres = (await import("postgres")).default;
  const sql = postgres(dbUrl, { ssl: "require", max: 1 });

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    console.log(`Running ${file}...`);
    try {
      await sql.unsafe(content);
      console.log(`  ✓ ${file}`);
    } catch (e) {
      console.error(`  ✗ ${file}:`, (e as Error).message);
      await sql.end();
      process.exit(1);
    }
  }

  await sql.end();
  console.log("\nAll migrations complete.");
}

main();
