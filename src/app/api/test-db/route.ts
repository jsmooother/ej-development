import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    checks: [] as Array<{ name: string; status: "✅ PASS" | "❌ FAIL"; details: string }>,
  };

  // 1. Check environment variables
  try {
    results.checks.push({
      name: "Environment Variables",
      status: "✅ PASS",
      details: JSON.stringify({
        NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing",
        SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY ? "✓ Set" : "✗ Missing",
        SUPABASE_DB_URL: env.SUPABASE_DB_URL ? "✓ Set" : "✗ Missing",
      }, null, 2),
    });
  } catch (error) {
    results.checks.push({
      name: "Environment Variables",
      status: "❌ FAIL",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // 2. Test Drizzle ORM connection
  try {
    const db = getDb();
    const result = await db.execute("SELECT NOW() as current_time");
    results.checks.push({
      name: "Drizzle ORM Connection",
      status: "✅ PASS",
      details: `Connected successfully. Server time: ${JSON.stringify(result)}`,
    });
  } catch (error) {
    results.checks.push({
      name: "Drizzle ORM Connection",
      status: "❌ FAIL",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // 3. Test Supabase Admin Client
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    
    if (error) throw error;
    
    results.checks.push({
      name: "Supabase Admin Client",
      status: "✅ PASS",
      details: `Admin client working. Found ${data?.users?.length || 0} users (limited to 1 for test)`,
    });
  } catch (error) {
    results.checks.push({
      name: "Supabase Admin Client",
      status: "❌ FAIL",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // 4. Test database schema - check if tables exist
  try {
    const db = getDb();
    const tablesQuery = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    results.checks.push({
      name: "Database Schema",
      status: "✅ PASS",
      details: `Tables found: ${JSON.stringify(tablesQuery, null, 2)}`,
    });
  } catch (error) {
    results.checks.push({
      name: "Database Schema",
      status: "❌ FAIL",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // 5. Test basic CRUD on a table
  try {
    const db = getDb();
    // Try to count records in listings table
    const { sql } = await import("drizzle-orm");
    const { listings } = await import("@/lib/db");
    
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(listings);
    
    results.checks.push({
      name: "Database CRUD Test",
      status: "✅ PASS",
      details: `Listings table accessible. Found ${count} listings.`,
    });
  } catch (error) {
    results.checks.push({
      name: "Database CRUD Test",
      status: "❌ FAIL",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }

  const allPassed = results.checks.every((check) => check.status === "✅ PASS");

  return NextResponse.json(
    {
      ...results,
      summary: allPassed ? "✅ All database connections are working!" : "❌ Some checks failed",
    },
    { status: allPassed ? 200 : 500 }
  );
}

