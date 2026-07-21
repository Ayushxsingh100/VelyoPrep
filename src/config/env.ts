/**
 * VeyloPrep Strongly-Typed Environment Configuration
 */

export type EnvironmentMode = "development" | "staging" | "production";

export interface AppEnvironment {
  mode: EnvironmentMode;
  isDev: boolean;
  isStaging: boolean;
  isProd: boolean;
  geminiApiKey: string;
  appUrl: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

function getEnvVariable(key: string, defaultValue: string = ""): string {
  const metaEnv = (import.meta as any).env;
  if (typeof import.meta !== "undefined" && metaEnv) {
    return (metaEnv[key] as string) || defaultValue;
  }
  return defaultValue;
}

const currentMode: EnvironmentMode =
  (getEnvVariable("MODE") as EnvironmentMode) || "development";

export const ENV: AppEnvironment = {
  mode: currentMode,
  isDev: currentMode === "development",
  isStaging: currentMode === "staging",
  isProd: currentMode === "production",
  geminiApiKey: getEnvVariable("VITE_GEMINI_API_KEY") || getEnvVariable("GEMINI_API_KEY"),
  appUrl: getEnvVariable("VITE_APP_URL") || getEnvVariable("APP_URL") || "http://localhost:3000",
  supabaseUrl: getEnvVariable("VITE_SUPABASE_URL") || "https://placeholder-project.supabase.co",
  supabaseAnonKey: getEnvVariable("VITE_SUPABASE_ANON_KEY") || "placeholder-anon-key",
};
