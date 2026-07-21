import React, { createContext, useContext, useState } from "react";
import { AppRoute, ROUTES } from "../config/routes";

interface NavigationContextType {
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute) => void;
  goBack: () => void;
  history: AppRoute[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(ROUTES.SPLASH);
  const [history, setHistory] = useState<AppRoute[]>([ROUTES.SPLASH]);

  const navigateTo = (route: AppRoute) => {
    setHistory((prev) => [...prev, route]);
    setCurrentRoute(route);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prevRoute = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentRoute(prevRoute);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentRoute, navigateTo, goBack, history }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
