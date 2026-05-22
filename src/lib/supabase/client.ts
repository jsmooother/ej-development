import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { getSupabasePublishableKey } from "@/lib/supabase/keys";

export const createSupabaseBrowserClient = () => {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSupabasePublishableKey();
  if (!url || !key || !url.startsWith("http")) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for auth features.",
    );
  }
  return createBrowserClient(url, key);
};
