import React, { useState, useEffect } from "react";
import MobileEmulator from "./features/emulator/MobileEmulator";
import { AppProviders } from "./app/providers";
import { useTheme } from "./providers/theme.provider";
import { useRegisterSW } from "virtual:pwa-register/react";
import { WifiOff, RefreshCw, Sparkles, X, Smartphone, Share, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function OfflineOverlay({ isDark }: { isDark: boolean }) {
  const [isChecking, setIsChecking] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      // Fetch with cache-busting to test actual server availability
      await fetch("https://autocomplete.clearbit.com/v1/companies/suggest?query=a", {
        mode: "no-cors",
        cache: "no-store"
      });
      // If fetch succeeds, reload the page to restore all states
      window.location.reload();
    } catch (e) {
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 2000);
    } finally {
      setTimeout(() => setIsChecking(false), 800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-6 text-center select-none"
    >
      <motion.div
        initial={{ scale: 0.93, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`w-full max-w-sm rounded-3xl border p-7 text-left space-y-6 ${
          isDark 
            ? "bg-[#121214] border-zinc-800 shadow-[0_24px_50px_rgba(0,0,0,0.6)]" 
            : "bg-white border-zinc-200 shadow-[0_24px_50px_rgba(0,0,0,0.15)]"
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
            <WifiOff size={22} className="animate-pulse" />
          </div>
          <div>
            <h3 className={`text-lg font-bold leading-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Connection Interrupted</h3>
            <p className="text-xs text-zinc-500 font-semibold">Workspace is running offline</p>
          </div>
        </div>

        <p className={`text-xs leading-relaxed font-medium ${isDark ? "text-zinc-400" : "text-zinc-650"}`}>
          Secure database connection is temporarily unavailable. Your offline workspace is safe and you can still view existing placement trackers. Live features will resume once reconnected.
        </p>

        <div className="flex flex-col space-y-2.5 pt-1">
          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full h-12 rounded-xl bg-blue-650 hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/10"
          >
            <RefreshCw size={13} className={isChecking ? "animate-spin" : ""} />
            {isChecking ? "Pinging secure node..." : "Check Status"}
          </button>
          
          <AnimatePresence>
            {showStatus && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[10px] font-bold text-red-400 text-center font-mono uppercase"
              >
                ⚠ Servers unreachable. Check network.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function UpdatePrompt({ isDark, needRefresh, updateServiceWorker }: { isDark: boolean; needRefresh: boolean; updateServiceWorker: (reloadPage?: boolean) => void }) {
  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", damping: 20, stiffness: 150 }}
          className="absolute top-6 left-4 right-4 z-[99] flex justify-center pointer-events-none"
        >
          <div
            className={`w-full max-w-sm rounded-2xl border p-4 flex items-center justify-between pointer-events-auto ${
              isDark
                ? "bg-[#18181A]/90 border-white/[0.08] shadow-[0_12px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
                : "bg-white/95 border-zinc-200 shadow-[0_12px_30px_rgba(0,0,0,0.1)] backdrop-blur-md"
            }`}
          >
            <div className="flex items-start space-x-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 mt-0.5 animate-pulse">
                <Sparkles size={16} />
              </div>
              <div className="space-y-0.5">
                <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>System Update Available</h4>
                <p className="text-[10.5px] text-zinc-400 font-medium leading-relaxed">Upgrade to the latest secure version of VeyloPrep.</p>
              </div>
            </div>
            
            <button
              onClick={() => updateServiceWorker(true)}
              className="h-9 px-3.5 rounded-lg bg-blue-650 hover:bg-blue-600 text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-sm ml-3"
            >
              Update
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IOSInstallBanner({ isDark }: { isDark: boolean }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const hasDismissed = localStorage.getItem("ios_install_dismissed");

    if (isIOS && !isStandalone && !hasDismissed) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("ios_install_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6 text-center select-none"
        >
          <motion.div
            initial={{ scale: 0.93, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.93, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`w-full max-w-sm rounded-3xl border p-7 text-left space-y-6 ${
              isDark 
                ? "bg-[#121214] border-zinc-800 shadow-[0_24px_50px_rgba(0,0,0,0.6)] text-white" 
                : "bg-white border-zinc-200 shadow-[0_24px_50px_rgba(0,0,0,0.15)] text-zinc-900"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                <Smartphone size={22} className="animate-pulse" />
              </div>
              <div>
                <h3 className={`text-lg font-bold leading-tight ${isDark ? "text-white" : "text-zinc-950"}`}>Install VeyloPrep</h3>
                <p className="text-xs text-zinc-500 font-semibold">Enable full-screen workspace & offline tools</p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              VeyloPrep is designed as an installable Progressive Web App. Follow these steps to place it on your Home Screen for safe-area layout support, secure background sync, and offline tracking.
            </p>

            <div className="space-y-4.5 border-t border-b border-zinc-800/10 dark:border-white/[0.04] py-5">
              <div className="flex items-start space-x-3.5">
                <div className="w-6 h-6 rounded-lg bg-zinc-800/10 dark:bg-white/[0.06] border border-zinc-800/20 dark:border-white/[0.08] flex items-center justify-center text-blue-500 shrink-0 font-bold text-xs mt-0.5">1</div>
                <div className="text-xs leading-relaxed">
                  <span className={`font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Tap Safari's Share button</span>
                  <span className={`block text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-450"} mt-0.5 flex items-center gap-1.5`}>
                    Look for <Share size={12} className="inline text-blue-500" /> in your navigation toolbar.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-6 h-6 rounded-lg bg-zinc-800/10 dark:bg-white/[0.06] border border-zinc-800/20 dark:border-white/[0.08] flex items-center justify-center text-blue-500 shrink-0 font-bold text-xs mt-0.5">2</div>
                <div className="text-xs leading-relaxed">
                  <span className={`font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Select 'Add to Home Screen'</span>
                  <span className={`block text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-450"} mt-0.5 flex items-center gap-1.5`}>
                    Scroll down Safari's action sheet list to find <PlusSquare size={12} className="inline text-blue-500" />.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-6 h-6 rounded-lg bg-zinc-800/10 dark:bg-white/[0.06] border border-zinc-800/20 dark:border-white/[0.08] flex items-center justify-center text-blue-500 shrink-0 font-bold text-xs mt-0.5">3</div>
                <div className="text-xs leading-relaxed">
                  <span className={`font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Launch VeyloPrep PWA</span>
                  <span className={`block text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-450"} mt-0.5`}>
                    Open it from your screen workspace.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 pt-1 text-center">
              <button
                onClick={handleDismiss}
                className="text-zinc-500 hover:text-zinc-400 text-xs font-semibold py-1.5 transition-colors cursor-pointer"
              >
                Use in Browser anyway
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InnerApp() {
  const { isDark, setIsDark, selectedTheme, setSelectedTheme } = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className={`w-full h-dvh ${isDark ? "bg-[#09090B] text-zinc-100" : "bg-[#F4F4F5] text-zinc-900"} flex justify-center items-center overflow-hidden relative font-sans antialiased`}>
      <div className="w-full h-full lg:max-w-[430px] flex flex-col relative overflow-hidden">
        <MobileEmulator
          isDark={isDark}
          setIsDark={setIsDark}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
        />
      </div>
      
      <UpdatePrompt
        isDark={isDark}
        needRefresh={needRefresh}
        updateServiceWorker={updateServiceWorker}
      />

      <IOSInstallBanner isDark={isDark} />

      <AnimatePresence>
        {!isOnline && <OfflineOverlay isDark={isDark} />}
      </AnimatePresence>
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
