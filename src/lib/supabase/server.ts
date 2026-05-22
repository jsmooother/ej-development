import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { getSupabasePublishableKey, getSupabaseSecretKey, hasSupabaseClientConfig } from "@/lib/supabase/keys";

export const createSupabaseServerClient = () => {
  const publishableKey = getSupabasePublishableKey();
  if (!hasSupabaseClientConfig()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for auth features.",
    );
  }
  const cookieStore = cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL!, publishableKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string) {
        cookieStore.delete(name);
      },
    },
  });
};

export const createSupabaseServerComponentClient = createSupabaseServerClient;

export const createSupabaseAdminClient = () => {
  const secretKey = getSupabaseSecretKey();
  if (!hasSupabaseClientConfig()) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }
  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not configured. Set it in your .env file to use admin features.");
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: {
      persistSession: false,
    },
  });
};
