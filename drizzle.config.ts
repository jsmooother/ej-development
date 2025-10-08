import * as dotenv from "dotenv";
dotenv.config();

import type { Config } from "drizzle-kit";

// Prefer DIRECT_URL for migrations (bypasses PgBouncer). Fallback to SUPABASE_DB_URL if needed.
const migrationUrl = process.env.DIRECT_URL ?? process.env.SUPABASE_DB_URL;

if (!migrationUrl) {
  throw new Error(
    "Missing DIRECT_URL (preferred) or SUPABASE_DB_URL environment variable for Drizzle configuration.",
  );
}

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: migrationUrl,
  },
} satisfies Config;