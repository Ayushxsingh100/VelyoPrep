import React, { useState } from "react";
import MobileEmulator from "./features/emulator/MobileEmulator";
import { AppProviders } from "./app/providers";

export default function App() {
  const [isDark] = useState<boolean>(true);
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light" | "system">("dark");

  return (
    <AppProviders>
      {/* Responsive mobile-first viewport wrapper */}
      <div className="w-full h-dvh bg-[#09090B] flex flex-col overflow-hidden relative font-sans antialiased text-zinc-100">
        <MobileEmulator
          isDark={isDark}
          setIsDark={() => {}}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
        />
      </div>
    </AppProviders>
  );
}
