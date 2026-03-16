import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export const createSupabaseBrowserClient = () => {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !url.startsWith("http")) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for auth features.");
  }
  return createBrowserClient(url, key);
};
