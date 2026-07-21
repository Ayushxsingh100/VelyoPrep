import React, { createContext, useContext, useState } from "react";

export type ThemeMode = "dark" | "light" | "system";

interface ThemeContextType {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  selectedTheme: ThemeMode;
  setSelectedTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>("dark");

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, selectedTheme, setSelectedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
