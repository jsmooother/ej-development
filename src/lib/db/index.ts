import { performance } from "node:perf_hooks";
import { sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/lib/env";

import * as schema from "./schema";

type ConnectionMetadata = {
  host: string;
  port: number | null;
  database: string | null;
  usesPgbouncer: boolean;
  usesDirectConnection: boolean;
  shouldUseSsl: boolean;
};

const resolveConnectionString = () => env.DIRECT_URL ?? env.SUPABASE_DB_URL;

const parseConnectionMetadata = (connectionString: string): ConnectionMetadata => {
  try {
    const url = new URL(connectionString);
    const host = url.hostname;
    const port = url.port ? Number(url.port) : null;
    const database = url.pathname.replace(/^\//, "") || null;
    const sslMode = url.searchParams.get("sslmode");
    const shouldUseSsl = sslMode === "disable" ? false : !["localhost", "127.0.0.1"].includes(host);
    const usesPgbouncer = url.searchParams.get("pgbouncer") === "true";

    return {
      host,
      port,
      database,
      usesPgbouncer,
      usesDirectConnection: Boolean(env.DIRECT_URL),
      shouldUseSsl,
    } satisfies ConnectionMetadata;
  } catch {
    return {
      host: "unknown",
      port: null,
      database: null,
      usesPgbouncer: false,
      usesDirectConnection: Boolean(env.DIRECT_URL),
      shouldUseSsl: true,
    } satisfies ConnectionMetadata;
  }
};

const connectionString = resolveConnectionString();
const connectionMetadata = parseConnectionMetadata(connectionString);

const globalForDb = globalThis as unknown as {
  connection?: ReturnType<typeof postgres>;
  db?: PostgresJsDatabase<typeof schema>;
};

const createConnection = () =>
  postgres(connectionString, {
    ssl: connectionMetadata.shouldUseSsl ? "require" : false,
    max: connectionMetadata.usesPgbouncer ? 1 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: connectionMetadata.usesPgbouncer ? false : true,
  });

const getOrCreateConnection = () => {
  if (!globalForDb.connection) {
    globalForDb.connection = createConnection();
  }
  return globalForDb.connection;
};

// For use in Next.js server components
export const getDb = () => {
  if (!globalForDb.db) {
    globalForDb.db = drizzle(getOrCreateConnection(), { schema });
  }
  return globalForDb.db;
};

export type Database = PostgresJsDatabase<typeof schema>;

export type DatabaseClient = {
  db: Database;
  dispose: () => Promise<void>;
};

// For use in scripts and API routes where explicit connection control is needed
export const createDbClient = (): DatabaseClient => {
  const connection = createConnection();
  const db = drizzle(connection, { schema });
  return {
    db,
    dispose: async () => {
      await connection.end({ timeout: 5 });
    },
  };
};

export const databaseConnectionInfo = {
  host: connectionMetadata.host,
  port: connectionMetadata.port,
  database: connectionMetadata.database,
  usesPgbouncer: connectionMetadata.usesPgbouncer,
  usesDirectConnection: connectionMetadata.usesDirectConnection,
  usesSsl: connectionMetadata.shouldUseSsl,
} as const;

export type DatabaseConnectionInfo = typeof databaseConnectionInfo;

export type DatabaseHealth =
  | {
      ok: true;
      latencyMs: number;
      checkedAt: string;
      info: DatabaseConnectionInfo;
    }
  | {
      ok: false;
      error: string;
      details?: string;
      checkedAt: string;
      info: DatabaseConnectionInfo;
    };

export const checkDatabaseHealth = async (): Promise<DatabaseHealth> => {
  const start = performance.now();
  try {
    await getDb().execute(sql`select 1`);
    const latencyMs = Number((performance.now() - start).toFixed(2));
    return {
      ok: true,
      latencyMs,
      checkedAt: new Date().toISOString(),
      info: databaseConnectionInfo,
    } satisfies DatabaseHealth;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : undefined;
    return {
      ok: false,
      error: message,
      details: code,
      checkedAt: new Date().toISOString(),
      info: databaseConnectionInfo,
    } satisfies DatabaseHealth;
  }
};

export * from "./schema";
export * from "./types";