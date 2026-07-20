import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Moon, Sun, Smartphone, Bell, Lock, Shield, FileText, Info, 
  ChevronRight, LogOut, Sliders, Check, HelpCircle, 
  Code, ShieldCheck, Network, Database
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
  sessionExpiryTime: number | null;
  setSessionExpiryTime: React.Dispatch<React.SetStateAction<number | null>>;
  simulateNetworkFailure: boolean;
  setSimulateNetworkFailure: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
  showToast: (msg: string, type: "success" | "warning" | "error" | "info") => void;
  
  // UI themes
  themeCardClass: string;
  themeTextSubtle: string;
  themeInputBg: string;
  themeBorderClass: string;
  setActiveDialog: (dialog: string | null) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentScreen,
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
  themeCardClass,
  themeTextSubtle,
  themeInputBg,
  themeBorderClass,
  setActiveDialog
}) => {
  // Settings switches
  const [pushNotifications, setPushNotifications] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  // Developer Mode (hidden)
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

  // List row component with unified Poppins typography and soft spacing
  interface SettingRowProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onClick?: () => void;
    iconBgClass: string;
  }

  const SettingRow: React.FC<SettingRowProps> = ({ icon, title, subtitle, rightElement, onClick, iconBgClass }) => {
    const content = (
      <div className={`flex items-center justify-between py-3 px-1 transition-all duration-150 rounded-xl ${isDark ? "hover:bg-zinc-800/30" : "hover:bg-zinc-100/50"}`}>
        <div className="flex items-center space-x-3 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
            {icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-[12.5px] font-medium leading-tight ${isDark ? "text-zinc-100" : "text-zinc-800"}`}>
              {title}
            </span>
            {subtitle && (
              <span className={`text-[10px] leading-tight truncate mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          {rightElement !== undefined ? rightElement : <ChevronRight size={13} className={isDark ? "text-zinc-500" : "text-zinc-400"} />}
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

  return (
    <div className="space-y-5 font-sans">
      {/* Title */}
      <div className="text-left px-1">
        <h2 className={`text-2xl font-bold tracking-tight ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>Settings</h2>
        <p className={`text-[10.5px] mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Manage account details, security and configurations.</p>
      </div>

      {/* 1. Account Section */}
      <div className="space-y-1 text-left">
        <span className={`text-[9.5px] font-semibold uppercase tracking-widest px-1 block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Account</span>
        <div className={`p-3 rounded-[24px] border ${themeBorderClass} ${themeCardClass} shadow-xs`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${isDark ? "bg-zinc-800 text-zinc-100 border-zinc-700/50" : "bg-zinc-100 text-zinc-700 border-zinc-200/40"}`}>
                {userName ? userName.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-[13.5px] font-semibold leading-tight ${isDark ? "text-zinc-100" : "text-zinc-800"}`}>
                  {userName}
                </span>
                <span className={`text-[10.5px] leading-tight truncate mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {userEmail}
                </span>
              </div>
            </div>
            <span className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md border ${isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>
              Active Student
            </span>
          </div>
        </div>
      </div>

      {/* 2. Display & Appearance Segment Control (Clean, native, simplified design) */}
      <div className="space-y-1 text-left">
        <span className={`text-[9.5px] font-semibold uppercase tracking-widest px-1 block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Appearance</span>
        <div className={`p-3 rounded-[24px] border ${themeBorderClass} ${themeCardClass} shadow-xs space-y-3`}>
          <div className="flex items-center space-x-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-50 text-blue-600"}`}>
              {selectedTheme === "dark" ? <Moon size={14} /> : selectedTheme === "light" ? <Sun size={14} /> : <Smartphone size={14} />}
            </div>
            <div className="flex flex-col">
              <span className={`text-[12.5px] font-medium leading-tight ${isDark ? "text-zinc-100" : "text-zinc-800"}`}>
                Aesthetic Persona
              </span>
              <span className={`text-[9.5px] leading-tight mt-0.5 ${isDark ? "text-zinc-450" : "text-zinc-500"}`}>
                Choose interface appearance
              </span>
            </div>
          </div>

          <div className={`grid grid-cols-3 gap-1 p-0.5 rounded-xl ${isDark ? "bg-zinc-900/60" : "bg-zinc-100/60"}`}>
            {[
              { id: "dark", label: "Obsidian", icon: <Moon size={11} /> },
              { id: "light", label: "Paper", icon: <Sun size={11} /> },
              { id: "system", label: "Adaptive", icon: <Smartphone size={11} /> }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTheme(t.id as any);
                  if (t.id === "dark") setIsDark(true);
                  else if (t.id === "light") setIsDark(false);
                  showToast(`Theme changed to ${t.label}`, "info");
                }}
                className={`h-7.5 rounded-lg text-[10px] font-medium flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  selectedTheme === t.id 
                    ? (isDark ? "bg-zinc-850 text-zinc-100 shadow-sm border border-zinc-750" : "bg-white text-zinc-900 shadow-sm") 
                    : (isDark ? "text-zinc-450 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900")
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Security & Access Section */}
      <div className="space-y-1 text-left">
        <span className={`text-[9.5px] font-semibold uppercase tracking-widest px-1 block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Security & Access</span>
        <div className={`p-3 rounded-[24px] border ${themeBorderClass} ${themeCardClass} divide-y ${isDark ? "divide-zinc-800/60" : "divide-zinc-100/80"} shadow-xs space-y-1`}>
          
          {/* Notifications Toggle */}
          <SettingRow
            icon={<Bell size={14} />}
            title="Push Notifications"
            subtitle="Enabled for placement updates"
            iconBgClass={isDark ? "bg-rose-500/20 text-rose-300" : "bg-rose-50 text-rose-600"}
            rightElement={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePushNotifications();
                }}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                  pushNotifications ? "bg-emerald-500" : (isDark ? "bg-zinc-800" : "bg-zinc-200")
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                    pushNotifications ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            }
          />

          {/* Privacy & Security Toggle */}
          <SettingRow
            icon={<Lock size={14} />}
            title="Secure Screen Lock"
            subtitle="Requires authentication on boot"
            iconBgClass={isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-50 text-emerald-600"}
            rightElement={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBiometricLock();
                }}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                  biometricLock ? "bg-emerald-500" : (isDark ? "bg-zinc-800" : "bg-zinc-200")
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                    biometricLock ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            }
          />

          {/* Documents Access */}
          <SettingRow
            icon={<FileText size={14} />}
            title="Vault Documents"
            subtitle="Transcripts, resumes & credentials"
            iconBgClass={isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-50 text-blue-600"}
            onClick={() => {
              setCurrentScreen("vault");
              showToast("Opened career documents vault", "info");
            }}
          />

          {/* Data Sharing toggle */}
          <SettingRow
            icon={<ShieldCheck size={14} />}
            title="Share Usage Analytics"
            subtitle="Send reports to optimize career listings"
            iconBgClass={isDark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-50 text-indigo-600"}
            rightElement={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDataSharing();
                }}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                  dataSharing ? "bg-emerald-500" : (isDark ? "bg-zinc-800" : "bg-zinc-200")
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                    dataSharing ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            }
          />
        </div>
      </div>

      {/* 4. About Section */}
      <div className="space-y-1 text-left">
        <span className={`text-[9.5px] font-semibold uppercase tracking-widest px-1 block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>About</span>
        <div className={`p-3 rounded-[24px] border ${themeBorderClass} ${themeCardClass} divide-y ${isDark ? "divide-zinc-800/60" : "divide-zinc-100/80"} shadow-xs space-y-1`}>
          
          {/* Version trigger for dev mode */}
          <SettingRow
            icon={<Info size={14} />}
            title="App Version"
            subtitle="Build 1.0.42 (Stable Release)"
            iconBgClass={isDark ? "bg-zinc-500/20 text-zinc-300" : "bg-zinc-50 text-zinc-600"}
            rightElement={
              <span className={`text-[10.5px] font-mono font-semibold ${isDark ? "text-zinc-200" : "text-zinc-600"}`}>
                v1.0
              </span>
            }
            onClick={handleVersionClick}
          />

          <SettingRow
            icon={<HelpCircle size={14} />}
            title="Terms of Service"
            subtitle="Usage policy and academic honesty guidelines"
            iconBgClass={isDark ? "bg-amber-500/20 text-amber-300" : "bg-amber-50 text-amber-600"}
            onClick={() => showToast("Academic Honesty Charter V1.0 is active.", "info")}
          />
        </div>
      </div>

      {/* 5. Destructive Logout Option */}
      <div className="pt-2 px-1">
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full h-10 rounded-[18px] border flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer text-xs font-semibold ${
            isDark 
              ? "bg-red-500/5 border-red-500/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/20" 
              : "bg-red-50/20 border-red-100 text-red-650 hover:bg-red-100/30 hover:border-red-200"
          }`}
        >
          <LogOut size={13} />
          <span>Log Out</span>
        </button>
      </div>

      {/* 6. Hidden Developer Settings (Only visible when DevMode is unlocked) */}
      <AnimatePresence>
        {devModeUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="space-y-2 pt-2 text-left"
          >
            <div className="flex items-center space-x-1.5 px-1">
              <Code size={13} className={isDark ? "text-zinc-400" : "text-zinc-500"} />
              <span className={`text-[9.5px] font-semibold uppercase tracking-widest block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Developer Menu</span>
            </div>
            
            <div className={`p-4 rounded-[24px] border border-amber-500/20 ${isDark ? "bg-amber-500/[0.015]" : "bg-amber-500/[0.02]"} space-y-4 shadow-sm`}>
              <div className={`flex items-start space-x-2 ${isDark ? "text-amber-400/95" : "text-amber-600"}`}>
                <Info size={14} className="mt-0.5 flex-shrink-0" />
                <p className="text-[10px] leading-relaxed">
                  <strong>Sandbox Controls Enabled.</strong> Simulate backend database, gateway network states, and custom UI.
                </p>
              </div>

              {/* Gateway Outage Toggle */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                simulateNetworkFailure 
                  ? "bg-red-500/10 border-red-500/20 text-red-500" 
                  : isDark 
                    ? "bg-zinc-950/60 border-zinc-800 text-zinc-300" 
                    : "bg-zinc-50 border-zinc-200/80 text-zinc-700"
              }`}>
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Gateway Outage</span>
                  <span className="text-[8.5px] opacity-80 mt-0.5 leading-tight">Block all active API & network sync routines</span>
                </div>
                <button
                  onClick={() => {
                    setSimulateNetworkFailure(!simulateNetworkFailure);
                    showToast(
                      !simulateNetworkFailure ? "Network outage simulation active" : "Network services restored",
                      !simulateNetworkFailure ? "warning" : "success"
                    );
                  }}
                  className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                    simulateNetworkFailure ? "bg-red-500" : (isDark ? "bg-zinc-800" : "bg-zinc-300")
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 transform ${
                      simulateNetworkFailure ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Session countdown if available */}
              {sessionExpiryTime !== null && (
                <div className={`p-2.5 rounded-xl border flex flex-col space-y-2 ${isDark ? "bg-zinc-950/60 border-zinc-800" : "bg-white border-zinc-200"}`}>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500 font-mono">
                    <span>SECURITY LEASE COUNTDOWN:</span>
                    <span className={sessionExpiryTime < 30 ? "text-red-500 animate-pulse font-bold" : ""}>
                      {Math.floor(sessionExpiryTime / 60)}m {sessionExpiryTime % 60}s
                    </span>
                  </div>
                  <div className="h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${sessionExpiryTime < 30 ? "bg-red-500" : "bg-zinc-500"}`}
                      style={{ width: `${(sessionExpiryTime / 300) * 100}%` }}
                    />
                  </div>
                  
                  {/* Session Control Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSessionExpiryTime(300);
                        showToast("Session lease renewed successfully", "success");
                      }}
                      className={`h-7 rounded-lg border ${themeBorderClass} text-[9px] font-bold hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 cursor-pointer`}
                    >
                      Renew Lease (300s)
                    </button>
                    <button
                      onClick={() => {
                        setSessionExpiryTime(0);
                        showToast("Session expired", "warning");
                      }}
                      className={`h-7 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 text-[9px] font-bold cursor-pointer`}
                    >
                      Force Expire Session
                    </button>
                  </div>
                </div>
              )}

              {/* Visual Showcase and Release Console triggers */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setCurrentScreen("release_console");
                    showToast("Loaded Release Console", "success");
                  }}
                  className={`h-8 rounded-lg border border-zinc-500/20 text-[9px] font-semibold flex items-center justify-center space-x-1 hover:bg-zinc-850 dark:hover:bg-zinc-800/40 cursor-pointer`}
                >
                  <Database size={11} />
                  <span>Release Console</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentScreen("design_system_showcase");
                    showToast("Loaded Design System Showcase", "success");
                  }}
                  className={`h-8 rounded-lg border border-zinc-500/20 text-[9px] font-semibold flex items-center justify-center space-x-1 hover:bg-zinc-850 dark:hover:bg-zinc-800/40 cursor-pointer`}
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

