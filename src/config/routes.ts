/**
 * VeyloPrep Route Definitions & Screen Identifiers
 */

export const ROUTES = {
  SPLASH: "splash",
  LOGIN: "login",
  SIGNUP: "signup",
  FORGOT_PASSWORD: "forgot",
  DASHBOARD: "dashboard",
  TRACKER: "tracker",
  VAULT: "vault",
  DEADLINES: "deadlines",
  JOBS: "jobs",
  PROFILE: "profile",
  SETTINGS: "settings",
  RELEASE_CONSOLE: "release_console",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
