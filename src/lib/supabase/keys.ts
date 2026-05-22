/** Publishable (client) key — prefers new name, falls back to legacy anon key. */
export function getSupabasePublishableKey(): string | undefined {
  const value =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return value?.trim() || undefined;
}

/** Secret (server) key — prefers new name, falls back to legacy service_role key. */
export function getSupabaseSecretKey(): string | undefined {
  const value = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  return value?.trim() || undefined;
}

/** First non-empty connection string from preferred keys (matches app runtime order). */
export function getDatabaseConnectionString(): string | undefined {
  for (const key of ["SUPABASE_DB_POOL_URL", "SUPABASE_DB_URL", "DIRECT_URL"] as const) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function hasSupabaseClientConfig(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSupabasePublishableKey();
  return Boolean(url && key && url.startsWith("http"));
}
