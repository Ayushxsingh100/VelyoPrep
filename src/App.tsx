import React from "react";
import MobileEmulator from "./features/emulator/MobileEmulator";
import { AppProviders } from "./app/providers";
import { useTheme } from "./providers/theme.provider";

function InnerApp() {
  const { isDark, setIsDark, selectedTheme, setSelectedTheme } = useTheme();

  return (
    <div className={`w-full h-dvh ${isDark ? "bg-[#09090B] text-zinc-100" : "bg-[#F4F4F5] text-zinc-900"} flex flex-col overflow-hidden relative font-sans antialiased`}>
      <MobileEmulator
        isDark={isDark}
        setIsDark={setIsDark}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <InnerApp />
    </AppProviders>
  );
}
