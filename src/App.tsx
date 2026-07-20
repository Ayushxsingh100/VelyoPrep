import React, { useState } from "react";
import {
  Sparkles, Layers, Terminal, Shield, RefreshCw, Server, Check,
  HelpCircle, ChevronRight, Github, ExternalLink, Code
} from "lucide-react";
import MobileEmulator from "./components/MobileEmulator";
import BlueprintConsole from "./components/BlueprintConsole";
import { VeyloPrepLogo } from "./components/VeyloPrepLogo";

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light" | "system">("dark");
  const [isReloading, setIsReloading] = useState<boolean>(false);
  // hello
  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 800);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${isDark ? "bg-[#09090B] text-zinc-100" : "bg-[#FAFAFA] text-zinc-900"
      }`}>
      {/* Global Top Navigation Bar */}
      <header className={`h-14 border-b px-6 flex items-center justify-between transition-colors duration-200 ${isDark ? "bg-[#09090B] border-zinc-800" : "bg-white border-zinc-200"
        }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md ${isDark ? "bg-[#18181B] text-white border border-zinc-800" : "bg-white text-zinc-950 border border-zinc-200"
            }`}>
            <VeyloPrepLogo className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight">VeyloPrep</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">S1_PHASE-2_PROD</span>
            </div>
            <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} font-medium leading-none block mt-0.5`}>Foundation & Scaffold Workbench</span>
          </div>
        </div>

        {/* System Meta details (Anti-Telemetry visual rule: keeps indicators literal, clean, and elegant) */}
        <div className="hidden md:flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <Server size={11} className="text-emerald-500" />
            <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>Database:</span>
            <span className="font-semibold text-[11px]">Supabase PostgreSQL</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Shield size={11} className="text-blue-500" />
            <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>Auth:</span>
            <span className="font-semibold text-[11px]">Google & Email</span>
          </div>
          <div className="flex items-center space-x-1.5 border-l border-zinc-800/40 pl-4">
            <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>Active Session:</span>
            <span className="font-semibold text-[11px] text-blue-400">singhxayush100@gmail.com</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleReload}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition-all cursor-pointer ${isDark ? 'border-zinc-800' : 'border-zinc-200'
              }`}
          >
            <RefreshCw size={12} className={`${isReloading ? 'animate-spin text-blue-500' : isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />
          </button>
        </div>
      </header>

      {/* Main Split Interface Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* Left Side: Interactive PlacementOS Mobile Simulator Container */}
        <section className={`w-full lg:w-[410px] flex-shrink-0 flex flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r transition-colors duration-200 ${isDark ? "bg-[#09090B]/30 border-zinc-800" : "bg-zinc-50 border-zinc-200"
          }`}>
          {/* Section Indicator */}
          <div className="text-center mb-5">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Interactive Device Emulator</h4>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'} mt-1`}>Test design system tokens, auth flows, & shell routes.</p>
          </div>

          <MobileEmulator
            isDark={isDark}
            setIsDark={setIsDark}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
          />
        </section>

        {/* Right Side: Engineering Blueprint & Source Code Console */}
        <section className={`flex-1 flex flex-col overflow-hidden ${isDark ? 'bg-[#09090B]' : 'bg-white'
          }`}>
          <BlueprintConsole isDark={isDark} />
        </section>

      </main>

      {/* Unified Status Footer */}
      <footer className={`h-8 border-t px-6 flex items-center justify-between text-[11px] font-mono transition-colors duration-200 ${isDark ? "bg-[#0E0E10] border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-500"
        }`}>
        <div className="flex items-center space-x-1.5">
          <Terminal size={10} />
          <span>Sprint 1 Complete: Scaffold compiles cleanly. ready for feature deployment.</span>
        </div>
        <div className="flex items-center space-x-3.5">
          <span>Target: Flutter Web & Android / Supabase PG</span>
          <span className="text-emerald-500 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" /> SYSTEM READY</span>
        </div>
      </footer>
    </div>
  );
}
