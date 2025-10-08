import { cache } from "react";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  connection?: ReturnType<typeof postgres>;
};

const createConnection = () =>
  postgres(env.SUPABASE_DB_URL, {
    ssl: "require",
    max: 1,
  });

const getOrCreateConnection = () => {
  if (!globalForDb.connection) {
    globalForDb.connection = createConnection();
  }
  return globalForDb.connection;
};

export const getDb = cache(() => drizzle(getOrCreateConnection(), { schema }));

export const createDbClient = () => drizzle(createConnection(), { schema });

export type Database = ReturnType<typeof getDb>;
export * from "./schema";
export * from "./types";
