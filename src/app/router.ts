import { AppRoute, ROUTES } from "../config/routes";

export interface RouteMeta {
  title: string;
  isProtected: boolean;
}

export const ROUTE_REGISTRY: Record<AppRoute, RouteMeta> = {
  [ROUTES.SPLASH]: { title: "Splash Screen", isProtected: false },
  [ROUTES.LOGIN]: { title: "Authentication - Login", isProtected: false },
  [ROUTES.SIGNUP]: { title: "Authentication - Register", isProtected: false },
  [ROUTES.FORGOT_PASSWORD]: { title: "Reset Password", isProtected: false },
  [ROUTES.DASHBOARD]: { title: "Executive Dashboard", isProtected: true },
  [ROUTES.TRACKER]: { title: "Placement Tracker OS", isProtected: true },
  [ROUTES.VAULT]: { title: "Career Document Vault", isProtected: true },
  [ROUTES.DEADLINES]: { title: "Smart Deadline Tracker", isProtected: true },
  [ROUTES.JOBS]: { title: "Placement & Job Portal", isProtected: true },
  [ROUTES.PROFILE]: { title: "Candidate Profile", isProtected: true },
  [ROUTES.SETTINGS]: { title: "System Settings", isProtected: true },
  [ROUTES.RELEASE_CONSOLE]: { title: "Production Release Console", isProtected: true },
};
