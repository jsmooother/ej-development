import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { sql } from "drizzle-orm";

/**
 * Lightweight health check that runs a DB query to keep Supabase free tier active.
 * Supabase pauses projects after 7 days of inactivity. Ping this route at least
 * every 5–6 days (e.g. via cron-job.org or GitHub Actions).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
