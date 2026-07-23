import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "dark" | "light" | "system";

interface ThemeContextType {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  selectedTheme: ThemeMode;
  setSelectedTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read initial theme preference
  const [selectedTheme, setSelectedThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme_preference");
      if (saved === "dark" || saved === "light" || saved === "system") {
        return saved;
      }
    }
    return "dark"; // Default to dark mode
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (selectedTheme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return true;
    }
    return selectedTheme === "dark";
  });

  const setSelectedTheme = (theme: ThemeMode) => {
    setSelectedThemeState(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme_preference", theme);
    }
  };

  // Sync isDark when selectedTheme or system preference changes
  useEffect(() => {
    if (selectedTheme === "system") {
      if (typeof window !== "undefined") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => {
          setIsDark(e.matches);
        };
        
        // Listen for OS color scheme shifts
        mediaQuery.addEventListener("change", handler);
        return () => {
          mediaQuery.removeEventListener("change", handler);
        };
      }
    } else {
      setIsDark(selectedTheme === "dark");
    }
  }, [selectedTheme]);

  // Sync Tailwind .dark class on html element
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDark]);

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
