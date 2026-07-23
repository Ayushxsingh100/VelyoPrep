import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Moon, Sun, Smartphone, Bell, Lock, FileText, Info, 
  ChevronRight, LogOut, Sliders, HelpCircle, 
  Code, ShieldCheck, Database
} from "lucide-react";

interface SettingsScreenProps {
  currentScreen: string;
  setCurrentScreen: (val: string) => void;
  selectedTheme: "dark" | "light" | "system";
  setSelectedTheme: (theme: "dark" | "light" | "system") => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  userName: string;
  userEmail: string;
  sessionExpiryTime?: number | null;
  setSessionExpiryTime?: React.Dispatch<React.SetStateAction<number | null>>;
  simulateNetworkFailure: boolean;
  setSimulateNetworkFailure: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
  showToast: (msg: string, type: "success" | "warning" | "error" | "info") => void;
  themeCardClass: string;
  themeTextSubtle: string;
  themeInputBg: string;
  themeBorderClass: string;
  setActiveDialog: (dialog: string | null) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  setCurrentScreen,
  selectedTheme,
  setSelectedTheme,
  isDark,
  setIsDark,
  userName,
  userEmail,
  sessionExpiryTime,
  setSessionExpiryTime,
  simulateNetworkFailure,
  setSimulateNetworkFailure,
  handleLogout,
  showToast,
}) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  const [devClickCount, setDevClickCount] = useState(0);
  const [devModeUnlocked, setDevModeUnlocked] = useState(false);

  const handleVersionClick = () => {
    if (devModeUnlocked) {
      showToast("Developer options are already active.", "info");
      return;
    }
    const nextCount = devClickCount + 1;
    setDevClickCount(nextCount);
    if (nextCount >= 5) {
      setDevModeUnlocked(true);
      showToast("Developer Mode enabled! System console unlocked.", "success");
    } else if (nextCount >= 2) {
      showToast(`Tap ${5 - nextCount} more times to unlock Developer Mode.`, "info");
    }
  };

  const togglePushNotifications = () => {
    const next = !pushNotifications;
    setPushNotifications(next);
    showToast(next ? "Push notifications enabled" : "Push notifications muted", "success");
  };

  const toggleBiometricLock = () => {
    const next = !biometricLock;
    setBiometricLock(next);
    showToast(next ? "Biometric screen lock enabled" : "Biometric screen lock disabled", "info");
  };

  const toggleDataSharing = () => {
    const next = !dataSharing;
    setDataSharing(next);
    showToast(next ? "Usage analytics sharing enabled" : "Analytics sharing disabled", "warning");
  };

  // Custom iOS Toggle Switch
  const iOSSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange();
        }}
        className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer focus:outline-none flex items-center relative ${
          checked 
            ? "bg-[#34C759]" 
            : isDark ? "bg-[#2C2C2E]" : "bg-zinc-200"
        }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
          className="w-5 h-5 rounded-full bg-white shadow-sm absolute"
          style={{ left: checked ? "calc(100% - 22px)" : "2px" }}
        />
      </button>
    );
  };

  interface SettingRowProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onClick?: () => void;
    iconColorClass: string;
  }

  const SettingRow: React.FC<SettingRowProps> = ({ icon, title, subtitle, rightElement, onClick, iconColorClass }) => {
    const content = (
      <div className={`flex items-center justify-between py-3 px-4 min-h-[64px] transition-all duration-150 cursor-pointer text-left ${
        isDark ? "hover:bg-white/[0.02] active:bg-white/[0.04]" : "hover:bg-zinc-50 active:bg-zinc-100/50"
      }`}>
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-transparent ${iconColorClass}`}>
            {icon}
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className={`text-[13.5px] font-semibold tracking-tight leading-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              {title}
            </span>
            {subtitle && (
              <span className={`text-[11px] tracking-tight leading-tight mt-0.5 truncate ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 pl-3">
          {rightElement !== undefined ? rightElement : <ChevronRight size={14} className={isDark ? "text-zinc-650" : "text-zinc-350"} />}
        </div>
      </div>
    );

    if (onClick) {
      return (
        <button type="button" onClick={onClick} className="w-full text-left focus:outline-none block cursor-pointer">
          {content}
        </button>
      );
    }
    return content;
  };

  const cardStyle = isDark 
    ? "bg-white/[0.04] border-white/[0.08] shadow-xs rounded-[20px]" 
    : "bg-white border-zinc-200/60 shadow-xs rounded-[20px]";

  const sectionLabelStyle = `text-[10px] font-bold uppercase tracking-widest px-1 block ${isDark ? "text-zinc-500" : "text-zinc-450"} font-mono`;

  return (
    <div className="space-y-4.5 pb-28 font-sans text-left">
      {/* ── HEADER ── */}
      <div className="pt-2 flex flex-col items-start text-left">
        <span className="text-[10px] font-bold tracking-widest text-zinc-550 dark:text-zinc-450 block leading-none uppercase font-mono mb-1.5">
          App Configurations
        </span>
        <h1 className={`text-[25px] font-extrabold tracking-tight leading-none ${isDark ? "text-white" : "text-zinc-950"}`}>
          Settings
        </h1>
      </div>

      {/* ── ACCOUNT CARD ── */}
      <div className="space-y-2">
        <span className={sectionLabelStyle}>Account</span>
        <div className={`border ${cardStyle} overflow-hidden`}>
          <div className="flex items-center justify-between py-2.5 px-4 min-h-[84px]">
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-[15px] shrink-0 border ${
                isDark 
                  ? "bg-zinc-800/80 text-zinc-100 border-zinc-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" 
                  : "bg-zinc-100 text-zinc-700 border-zinc-200"
              }`}>
                {userName ? userName.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className={`text-[15.5px] font-bold tracking-tight leading-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                  {userName}
                </span>
                <span className={`text-[11.5px] tracking-tight leading-tight mt-0.5 truncate ${isDark ? "text-zinc-450" : "text-zinc-500"}`}>
                  {userEmail}
                </span>
              </div>
            </div>
            <span className={`text-[8.5px] font-extrabold tracking-widest uppercase px-2 py-1 rounded-md border shrink-0 ${
              isDark 
                ? "bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20" 
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}>
              Active Student
            </span>
          </div>
        </div>
      </div>

      {/* ── APPEARANCE ── */}
      <div className="space-y-2">
        <span className={sectionLabelStyle}>Appearance</span>
        <div className={`border p-3.5 ${cardStyle} space-y-3`}>
          <div className="flex items-center space-x-3 text-left">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
            }`}>
              {selectedTheme === "dark" ? <Moon size={14} /> : selectedTheme === "light" ? <Sun size={14} /> : <Smartphone size={14} />}
            </div>
            <div className="flex flex-col text-left">
              <span className={`text-[13px] font-bold leading-tight ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                Aesthetic Persona
              </span>
              <span className={`text-[10.5px] leading-tight font-semibold mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Choose interface appearance
              </span>
            </div>
          </div>

          <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl relative ${isDark ? "bg-[#121214]" : "bg-zinc-100"}`}>
            {[
              { id: "dark", label: "Obsidian", icon: <Moon size={12} /> },
              { id: "light", label: "Paper", icon: <Sun size={12} /> },
              { id: "system", label: "Adaptive", icon: <Smartphone size={12} /> }
            ].map(t => {
              const isActive = selectedTheme === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    setSelectedTheme(t.id as any);
                    showToast(`Theme changed to ${t.label}`, "info");
                  }}
                  className="h-8 rounded-lg text-[10.5px] font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer relative z-10 focus:outline-none"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeThemeSelector"
                      className={`absolute inset-0 rounded-lg shadow-sm border -z-10 ${
                        isDark 
                          ? "bg-[#1C1C1E] border-white/[0.06] shadow-black/50" 
                          : "bg-white border-zinc-200/50 shadow-zinc-200/20"
                      }`}
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className={isActive ? (isDark ? "text-zinc-100" : "text-zinc-950") : (isDark ? "text-zinc-500" : "text-zinc-450")}>
                    {t.icon}
                  </span>
                  <span className={`font-semibold tracking-tight ${isActive ? (isDark ? "text-zinc-100" : "text-zinc-950") : (isDark ? "text-zinc-500" : "text-zinc-450")}`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECURITY & ACCESS ── */}
      <div className="space-y-2">
        <span className={sectionLabelStyle}>Security & Access</span>
        <div className={`border overflow-hidden divide-y ${isDark ? "divide-zinc-800/40" : "divide-zinc-100"} ${cardStyle}`}>
          <SettingRow
            icon={<Bell size={14} />}
            title="Push Notifications"
            subtitle="Enabled for placement updates"
            iconColorClass={isDark ? "bg-rose-500/10 text-rose-455 border-rose-500/10" : "bg-rose-50 text-rose-600"}
            rightElement={
              <iOSSwitch
                checked={pushNotifications}
                onChange={togglePushNotifications}
              />
            }
          />

          <SettingRow
            icon={<Lock size={14} />}
            title="Secure Screen Lock"
            subtitle="Requires authentication on boot"
            iconColorClass={isDark ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/10" : "bg-emerald-50 text-emerald-600"}
            rightElement={
              <iOSSwitch
                checked={biometricLock}
                onChange={toggleBiometricLock}
              />
            }
          />

          <SettingRow
            icon={<FileText size={14} />}
            title="Vault Documents"
            subtitle="Transcripts, resumes & credentials"
            iconColorClass={isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/10" : "bg-blue-50 text-blue-600"}
            onClick={() => {
              setCurrentScreen("vault");
              showToast("Opened career documents vault", "info");
            }}
          />

          <SettingRow
            icon={<ShieldCheck size={14} />}
            title="Share Usage Analytics"
            subtitle="Send reports to optimize listings"
            iconColorClass={isDark ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/10" : "bg-indigo-50 text-indigo-600"}
            rightElement={
              <iOSSwitch
                checked={dataSharing}
                onChange={toggleDataSharing}
              />
            }
          />
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div className="space-y-2">
        <span className={sectionLabelStyle}>About</span>
        <div className={`border overflow-hidden divide-y ${isDark ? "divide-zinc-800/40" : "divide-zinc-100"} ${cardStyle}`}>
          <SettingRow
            icon={<Info size={14} />}
            title="App Version"
            subtitle="Build 1.0.42 (Stable Release)"
            iconColorClass={isDark ? "bg-zinc-500/10 text-zinc-400 border-zinc-800" : "bg-zinc-50 text-zinc-650"}
            rightElement={
              <span className={`text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-[6px] border ${
                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600"
              }`}>
                v1.0
              </span>
            }
            onClick={handleVersionClick}
          />

          <SettingRow
            icon={<HelpCircle size={14} />}
            title="Terms of Service"
            subtitle="Usage policy and honest guidelines"
            iconColorClass={isDark ? "bg-amber-500/10 text-amber-450 border-amber-500/10" : "bg-amber-50 text-amber-600"}
            onClick={() => showToast("Academic Honesty Charter V1.0 is active.", "info")}
          />
        </div>
      </div>

      {/* ── LOG OUT ── */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full h-11.5 rounded-[20px] border flex items-center justify-center space-x-2 transition-all duration-150 cursor-pointer text-xs font-bold active:scale-98 ${
            isDark 
              ? "bg-red-500/5 border-red-500/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/20" 
              : "bg-[#FF3B30]/5 border-[#FF3B30]/10 text-[#FF3B30] hover:bg-[#FF3B30]/10 hover:border-[#FF3B30]/20"
          }`}
        >
          <LogOut size={13} />
          <span>Log Out</span>
        </button>
      </div>

      {/* ── DEVELOPER MENU ── */}
      <AnimatePresence>
        {devModeUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="space-y-2 pt-2 text-left"
          >
            <div className="flex items-center space-x-1.5 px-1">
              <Code size={13} className={isDark ? "text-zinc-500" : "text-zinc-400"} />
              <span className={sectionLabelStyle}>Developer Menu</span>
            </div>
            
            <div className={`rounded-[20px] border overflow-hidden p-5 space-y-4 ${
              isDark 
                ? "bg-[#18181A]/40 border-amber-500/20 shadow-xs text-zinc-355" 
                : "bg-amber-50/15 border-amber-500/10 shadow-xs text-zinc-700"
            }`}>
              <div className={`flex items-start space-x-2 text-[11.5px] leading-relaxed ${isDark ? "text-amber-400/90" : "text-amber-700"}`}>
                <Info size={14} className="mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Sandbox Controls Enabled.</strong> Simulate backend database, gateway network states, and custom UI.
                </p>
              </div>

              {/* Sandbox toggles */}
              <div className={`rounded-xl border p-3 flex items-center justify-between ${
                simulateNetworkFailure 
                  ? "bg-red-500/5 border-red-500/20 text-red-400" 
                  : isDark 
                    ? "bg-zinc-900/60 border-zinc-800 text-zinc-300" 
                    : "bg-zinc-50 border-zinc-200 text-zinc-750"
              }`}>
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Gateway Outage</span>
                  <span className="text-[9px] opacity-75 mt-0.5 leading-tight">Block all active API & network sync routines</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSimulateNetworkFailure(!simulateNetworkFailure);
                    showToast(
                      !simulateNetworkFailure ? "Network outage simulation active" : "Network services restored",
                      !simulateNetworkFailure ? "warning" : "success"
                    );
                  }}
                  className={`w-9.5 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex-shrink-0 flex items-center relative ${
                    simulateNetworkFailure ? "bg-red-500" : (isDark ? "bg-zinc-800" : "bg-zinc-200")
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-5 h-5 rounded-full bg-white shadow-sm absolute"
                    style={{ left: simulateNetworkFailure ? "calc(100% - 22px)" : "2px" }}
                  />
                </button>
              </div>

              {sessionExpiryTime !== null && (
                <div className={`p-3.5 rounded-xl border flex flex-col space-y-2.5 ${isDark ? "bg-zinc-900/40 border-zinc-850" : "bg-white border-zinc-200"}`}>
                  <div className="flex items-center justify-between text-[9.5px] font-bold text-zinc-550 font-mono">
                    <span>SECURITY LEASE COUNTDOWN:</span>
                    <span className={sessionExpiryTime < 30 ? "text-red-550 animate-pulse font-bold" : ""}>
                      {Math.floor(sessionExpiryTime / 60)}m {sessionExpiryTime % 60}s
                    </span>
                  </div>
                  <div className={`h-1 rounded-full overflow-hidden ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}>
                    <div 
                      className={`h-full transition-all duration-1000 ${sessionExpiryTime < 30 ? "bg-red-500" : "bg-zinc-500"}`}
                      style={{ width: `${(sessionExpiryTime / 300) * 100}%` }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSessionExpiryTime(300);
                        showToast("Session lease renewed successfully", "success");
                      }}
                      className={`h-8 rounded-lg border text-[9px] font-bold cursor-pointer transition-all flex items-center justify-center ${
                        isDark 
                          ? "bg-zinc-800 border-zinc-700/50 text-zinc-300 hover:bg-zinc-700" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      Renew (300s)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSessionExpiryTime(0);
                        showToast("Session expired", "warning");
                      }}
                      className="h-8 rounded-lg border border-red-550/20 hover:bg-red-500/10 text-red-500 text-[9px] font-bold cursor-pointer transition-all flex items-center justify-center"
                    >
                      Force Expire
                    </button>
                  </div>
                </div>
              )}
 
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentScreen("release_console");
                    showToast("Loaded Release Console", "success");
                  }}
                  className={`h-8.5 rounded-lg border text-[9.5px] font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    isDark 
                      ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750" 
                      : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                  }`}
                >
                  <Database size={11} />
                  <span>Release Console</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentScreen("design_system_showcase");
                    showToast("Loaded Design System Showcase", "success");
                  }}
                  className={`h-8.5 rounded-lg border text-[9.5px] font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    isDark 
                      ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750" 
                      : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                  }`}
                >
                  <Sliders size={11} />
                  <span>Design Showcase</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
