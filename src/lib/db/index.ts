import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  connection?: ReturnType<typeof postgres>;
};

const createConnection = () => {
  if (!env.SUPABASE_DB_URL) {
    throw new Error("SUPABASE_DB_URL is not configured. Set it in your .env file to use database features.");
  }
  return postgres(env.SUPABASE_DB_URL, {
    ssl: "require",
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });
};

const getOrCreateConnection = () => {
  if (!globalForDb.connection) {
    globalForDb.connection = createConnection();
  }
  return globalForDb.connection;
};

// For use in Next.js server components
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
export const getDb = () => {
  if (!db) {
    db = drizzle(getOrCreateConnection(), { schema });
  }
  return db;
};

// For use in scripts and API routes
export const createDbClient = () => drizzle(createConnection(), { schema });

export type Database = ReturnType<typeof getDb>;
export * from "./schema";
