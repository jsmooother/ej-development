import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  connection?: ReturnType<typeof postgres>;
};

const pooledConnectionString = env.SUPABASE_DB_POOL_URL ?? env.SUPABASE_DB_URL ?? env.DIRECT_URL;

if (!pooledConnectionString) {
  throw new Error(
    "Missing database configuration. Provide SUPABASE_DB_POOL_URL (preferred), SUPABASE_DB_URL, or DIRECT_URL.",
  );
}

const directConnectionString =
  env.DIRECT_URL ?? env.SUPABASE_DB_URL ?? env.SUPABASE_DB_POOL_URL;

const looksLikePooledUrl = (value?: string | null) =>
  Boolean(value && /pgbouncer=true|pooler\.supabase/i.test(value));

const createSupabaseConnection = (connectionString: string, { forcePooling = false }: { forcePooling?: boolean }) => {
  const usePool =
    forcePooling ||
    connectionString === env.SUPABASE_DB_POOL_URL ||
    looksLikePooledUrl(connectionString);

  return postgres(connectionString, {
    ssl: "require",
    max: usePool ? 10 : 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ...(usePool ? { prepare: false } : {}),
  });
};

const getOrCreateConnection = () => {
  if (!globalForDb.connection) {
    const shouldPool = pooledConnectionString === env.SUPABASE_DB_POOL_URL || looksLikePooledUrl(pooledConnectionString);
    globalForDb.connection = createSupabaseConnection(pooledConnectionString, { forcePooling: shouldPool });
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
export const createDbClient = () =>
  drizzle(
    createSupabaseConnection(directConnectionString, {
      forcePooling:
        (directConnectionString === env.SUPABASE_DB_POOL_URL || looksLikePooledUrl(directConnectionString)) &&
        !env.DIRECT_URL,
    }),
    { schema },
  );

export type Database = ReturnType<typeof getDb>;
export * from "./schema";
