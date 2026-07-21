import React, { useState } from "react";
import MobileEmulator from "./features/emulator/MobileEmulator";
import { AppProviders } from "./app/providers";

export default function App() {
  const [isDark] = useState<boolean>(true);
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light" | "system">("dark");

  return (
    <AppProviders>
      {/* Full-screen background matching the app's dark theme */}
      <div className="min-h-screen bg-[#09090B] flex items-start justify-center md:items-center md:py-0">
        {/*
          On mobile: fills the full viewport, no chrome.
          On desktop (md+): centered card, max-width 390px, min-height 100vh so it
          looks like the mobile UI floating in the dark field.
        */}
        <div className="w-full h-screen md:max-w-[390px] md:h-screen md:shadow-2xl flex flex-col overflow-hidden">
          <MobileEmulator
            isDark={isDark}
            setIsDark={() => {}}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
          />
        </div>
      </div>
    </AppProviders>
  );
}
