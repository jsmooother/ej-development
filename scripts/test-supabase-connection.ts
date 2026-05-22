#!/usr/bin/env tsx
/**
 * Standalone Supabase connection test (bypasses Next.js env validation).
 * Run: npx tsx scripts/test-supabase-connection.ts
 */
import * as dotenv from "dotenv";
import path from "path";
import { getDatabaseConnectionString, getSupabasePublishableKey, getSupabaseSecretKey } from "../src/lib/supabase/keys";

// Load .env then .env.local (local overrides, like Next.js)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = getSupabasePublishableKey();
  const secretKey = getSupabaseSecretKey();
  const dbUrl = getDatabaseConnectionString();

  console.log("\n=== Supabase connection test ===\n");

  // 1. Env check
  console.log("1. Environment variables:");
  console.log("   NEXT_PUBLIC_SUPABASE_URL:", url ? `✓ Set (${url.replace(/https?:\/\//, "").slice(0, 30)}...)` : "✗ Missing");
  console.log("   Publishable key:", publishableKey ? "✓ Set" : "✗ Missing");
  console.log("   Secret key:", secretKey ? "✓ Set" : "✗ Missing");
  console.log("   DB URL (SUPABASE_DB_URL/DIRECT_URL/POOL):", dbUrl ? "✓ Set" : "✗ Missing");
  if (dbUrl) {
    const host = dbUrl.match(/@([^:]+):/)?.[1] ?? "?";
    console.log("   DB host:", host);
  }

  if (!url || !publishableKey || !secretKey || !dbUrl) {
    console.log("\n❌ Missing required env vars. Add them to .env or .env.local");
    process.exit(1);
  }

  // 2. Supabase REST client
  console.log("\n2. Supabase REST client (auth):");
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, secretKey);
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) throw error;
    console.log("   ✅ Connected. Users (sample):", data?.users?.length ?? 0);
  } catch (e) {
    console.log("   ❌ Failed:", (e as Error).message);
  }

  // 3. Postgres (Drizzle/raw)
  console.log("\n3. Postgres connection:");
  try {
    const postgres = (await import("postgres")).default;
    const sql = postgres(dbUrl, { ssl: "require", max: 1, connect_timeout: 10 });
    const result = await sql`SELECT NOW() as now, current_database() as db`;
    console.log("   ✅ Connected. DB:", result[0].db, "| Server time:", result[0].now);
    await sql.end();
  } catch (e) {
    console.log("   ❌ Failed:", (e as Error).message);
    console.log("\n   Tip: Get connection strings from Supabase Dashboard → Project Settings → Database.");
    console.log("   New projects use db.[PROJECT_REF].supabase.co (not db.supabase.co).");
  }

  // 4. Schema check
  console.log("\n4. Database schema (tables):");
  try {
    const postgres = (await import("postgres")).default;
    const sql = postgres(dbUrl, { ssl: "require", max: 1, connect_timeout: 10 });
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `;
    if (tables.length === 0) {
      console.log("   ⚠ No tables yet. Run migrations: npm run db:push");
    } else {
      console.log("   ✅ Tables:", tables.map((r) => r.table_name).join(", "));
    }
    await sql.end();
  } catch (e) {
    console.log("   ❌ Failed:", (e as Error).message);
  }

  console.log("\n=== Done ===\n");
}

main();
