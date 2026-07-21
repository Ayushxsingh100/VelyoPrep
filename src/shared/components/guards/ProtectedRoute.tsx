import React from "react";
import { useAuth } from "../../../providers/auth.provider";
import { AppRoute, ROUTES } from "../../../config/routes";
import { ROUTE_REGISTRY } from "../../../app/router";
import { AppLoader } from "../loaders/AppLoader";

export interface ProtectedRouteProps {
  currentRoute: AppRoute;
  onNavigate: (targetRoute: AppRoute) => void;
  children: React.ReactNode;
}

export function ProtectedRoute({ currentRoute, onNavigate, children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const routeMeta = ROUTE_REGISTRY[currentRoute] || { isProtected: false, title: "" };

  React.useEffect(() => {
    if (isLoading) return;

    // 1. Unauthenticated user attempting to access a protected route
    if (routeMeta.isProtected && !isAuthenticated) {
      onNavigate(ROUTES.LOGIN);
      return;
    }

    // 2. Authenticated user attempting to access Auth routes (Login / Register)
    if (!routeMeta.isProtected && isAuthenticated && (currentRoute === ROUTES.LOGIN || currentRoute === ROUTES.SIGNUP)) {
      onNavigate(ROUTES.DASHBOARD);
      return;
    }
  }, [isLoading, isAuthenticated, currentRoute, routeMeta.isProtected, onNavigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 space-y-3">
        <AppLoader size="lg" text="Verifying security session..." />
      </div>
    );
  }

  return <>{children}</>;
}
