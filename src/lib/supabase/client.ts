import type { Database } from "@/types/database";
import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export function createClient() {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error("Supabase is not configured. Add the project URL and publishable key.");
  }
  return createBrowserClient<Database>(env.url, env.publishableKey);
}
