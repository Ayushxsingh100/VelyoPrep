import React from "react";
import { ThemeProvider } from "../providers/theme.provider";
import { AuthProvider } from "../providers/auth.provider";
import { NavigationProvider } from "../providers/navigation.provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationProvider>{children}</NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
