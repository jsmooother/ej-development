import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { hasSupabaseClientConfig } from "@/lib/supabase/keys";
import { sql } from "drizzle-orm";

/**
 * Lightweight health check that keeps Supabase free tier active.
 * Supabase pauses projects after 7 days of inactivity. Any API or DB activity
 * resets the timer — we try both so a broken direct DB URL does not stop pings.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const at = new Date().toISOString();
  const checks: { db?: boolean; rest?: boolean } = {};

  try {
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    checks.db = true;
  } catch {
    checks.db = false;
  }

  if (hasSupabaseClientConfig()) {
    try {
      const supabase = createSupabaseAdminClient();
      const { error } = await supabase.from("site_settings").select("id").limit(1);
      if (error) throw error;
      checks.rest = true;
    } catch {
      checks.rest = false;
    }
  }

  const ok = checks.db === true || checks.rest === true;
  return NextResponse.json({ ok, checks, at }, { status: ok ? 200 : 500 });
}
