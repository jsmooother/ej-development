import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

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
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
};