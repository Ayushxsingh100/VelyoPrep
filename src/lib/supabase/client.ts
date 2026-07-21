import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "../../config/env";

/**
 * Centralized Supabase Client Singleton
 * Initialized once using environment configuration.
 */

const supabaseUrl = ENV.supabaseUrl || "https://placeholder-project.supabase.co";
const supabaseAnonKey = ENV.supabaseAnonKey || "placeholder-anon-key";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
