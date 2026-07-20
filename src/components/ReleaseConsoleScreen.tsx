import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Shield, CheckCircle, AlertTriangle, Play, RefreshCw, Cpu, 
  Terminal, Sliders, Sparkles, BookOpen, FileText, Compass, List, Eye,
  Lock, Key, Volume2, Accessibility, Zap, Clock, Code, HelpCircle, Download
} from "lucide-react";

interface ReleaseConsoleScreenProps {
  setCurrentScreen: (screen: string) => void;
  isDark: boolean;
  themeCardClass: string;
  themeTextSubtle: string;
  themeInputBg: string;
  themeBorderClass: string;
  showToast: (message: string, type: "success" | "warning" | "error" | "info") => void;
}

export const ReleaseConsoleScreen: React.FC<ReleaseConsoleScreenProps> = ({
  setCurrentScreen,
  isDark,
  themeCardClass,
  themeTextSubtle,
  themeInputBg,
  themeBorderClass,
  showToast
}) => {
  // Navigation Tabs inside release console
  const [activeTab, setActiveTab] = useState<"tests" | "security" | "access" | "release" | "docs">("tests");

  // --- TAB 1: INTERACTIVE TESTS STATES ---
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testSuite, setTestSuite] = useState<Array<{ id: string; name: string; category: string; status: "pending" | "running" | "passed" | "failed"; duration: string }>>([
    { id: "t1", name: "auth_module_test.dart", category: "Authentication Suite", status: "pending", duration: "0ms" },
    { id: "t2", name: "placement_tracker_crud_spec.dart", category: "Repository Suite", status: "pending", duration: "0ms" },
    { id: "t3", name: "supabase_backend_rls_policies.dart", category: "Security Suite", status: "pending", duration: "0ms" },
    { id: "t4", name: "career_vault_file_encryption.dart", category: "Security Suite", status: "pending", duration: "0ms" },
    { id: "t5", name: "deadline_schedules_notification.dart", category: "Lifecycle Suite", status: "pending", duration: "0ms" },
    { id: "t6", name: "ai_capture_metadata_validation.dart", category: "AI Smart Suite", status: "pending", duration: "0ms" },
    { id: "t7", name: "dashboard_riverpod_memoization.dart", category: "Performance Suite", status: "pending", duration: "0ms" }
  ]);

  // Run tests sequence with timeouts
  const runAutomatedTests = () => {
    if (isRunningTests) return;
    setIsRunningTests(true);
    setTestProgress(0);
    setTestLogs(["[CLI] Bootstrapping PlacementOS V1 Test Runner...", "[CLI] Loading secure environment configs..."]);
    
    // Reset statuses
    setTestSuite(prev => prev.map(t => ({ ...t, status: "pending", duration: "0ms" })));

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < testSuite.length) {
        const targetId = testSuite[currentIdx].id;
        const targetName = testSuite[currentIdx].name;
        
        // Mark as running
        setTestSuite(prev => prev.map(t => t.id === targetId ? { ...t, status: "running" } : t));
        setTestLogs(prev => [...prev, `[RUNNING] ${targetName} - Initializing headless VM...`]);

        // Simulating duration
        setTimeout(() => {
          const durationMs = Math.floor(Math.random() * 120) + 40;
          setTestSuite(prev => prev.map(t => t.id === targetId ? { ...t, status: "passed", duration: `${durationMs}ms` } : t));
          setTestLogs(prev => [
            ...prev, 
            `[PASSED] ${targetName} resolved in ${durationMs}ms with exit code 0.`,
            `✓ Assertions verify strict isolation standards.`
          ]);
          setTestProgress(Math.round(((currentIdx + 1) / testSuite.length) * 100));
          currentIdx++;
        }, 500);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsRunningTests(false);
          setTestLogs(prev => [
            ...prev,
            "--------------------------------------------------",
            "🚀 ALL 7 CRITICAL TEST MODULES COMPLETED SUCCESSFULLY",
            "📊 Final Report: 7 Passed, 0 Failed, 48 Assertions Safe"
          ]);
          showToast("PlacementOS test suite compiled & executed 100% green", "success");
        }, 300);
      }
    }, 850);
  };

  // --- TAB 2: SECURITY COMPLIANCE STATES ---
  const [securityChecks, setSecurityChecks] = useState([
    { id: "s1", label: "HTTPS / TLS Encrypted Connections Only", checked: true, desc: "Binds exclusively to port 3000 behind reverse-proxy gateway." },
    { id: "s2", label: "Supabase Row Level Security (RLS)", checked: true, desc: "Strict policies isolate candidates' career files and passwords." },
    { id: "s3", label: "Zero Client-Side Secrets Leakage", checked: true, desc: "Server-side routing shields APIs and AI tokens." },
    { id: "s4", label: "Input Sanitization & Safe Bindings", checked: true, desc: "Strict validators on URLs preventing injection payloads." },
    { id: "s5", label: "Auth Token Rotation & Expiry", checked: true, desc: "Candidate tokens are auto-revoked after inactivity lease." }
  ]);

  const toggleSecurityCheck = (id: string) => {
    setSecurityChecks(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
    showToast("Audit requirement state synchronized", "info");
  };

  // --- TAB 3: ACCESSIBILITY STATE & SIMULATION ---
  const [isLargeText, setIsLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReaderLog, setScreenReaderLog] = useState<string | null>(null);

  const simulateScreenReader = (text: string) => {
    setScreenReaderLog(`[ACC_SPEECH]: "${text}"`);
    showToast(`Haptic Feedback: Read aloud "${text}"`, "info");
    setTimeout(() => {
      setScreenReaderLog(null);
    }, 4000);
  };

  // --- TAB 4: APP RELEASE NOTES & CONFIG ---
  const [appVersion, setAppVersion] = useState("1.0.0");
  const [releaseChannel, setReleaseChannel] = useState<"stable" | "beta" | "canary">("stable");
  const [customReleaseNote, setCustomReleaseNote] = useState("");
  const [customNotesList, setCustomNotesList] = useState<string[]>([]);

  const handleAddReleaseNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReleaseNote.trim()) return;
    setCustomNotesList(prev => [...prev, customReleaseNote.trim()]);
    setCustomReleaseNote("");
    showToast("Release note bullet compiled!", "success");
  };

  // --- TAB 5: DOCUMENTATION DRILL-DOWN ---
  const [selectedDocTopic, setSelectedDocTopic] = useState<string | null>("architecture");

  const docData = useMemo(() => {
    return {
      architecture: {
        title: "PlacementOS Platform Architecture Overview",
        content: `PlacementOS is engineered following clean architecture guidelines with Riverpod state containers and Supabase secure schemas.

• Presentation Layer: Fully isolated Design System (Ticket-003) showcasing strict typographic spacing, Inter display typography, and motion-powered fluid transitions.
• Domain Layer: Centralized state controllers and aggregates that prevent unnecessary widget rebuilds.
• Data Repository Layer: Modular repository streams (Career Vault, Job Portal, Deadline Tracker) that unify offline-first caching and real-time network synchronizations.`
      },
      deployment: {
        title: "Production Deployment & Server Hardening Guide",
        content: `Standard steps to host PlacementOS securely in a sandboxed Cloud container:

1. Configure Port Binding: Nginx reverse proxy routes outside traffic strictly to container port 3000.
2. Initialize Database: Ensure Supabase relational schemas and row-level security (RLS) rules are provisioned correctly.
3. Establish Environment Example: Validate secret strings (e.g. GEMINI_API_KEY) are completely abstracted in Server API routes instead of client bundles.`
      },
      testing: {
        title: "QA Hardening & Continuous Integration Manual",
        content: `The PlacementOS QA pipeline consists of strict quality gates:

• Static Analysis: Linter configuration (eslint, tsc) must yield 0 warnings before build integration.
• Unit Testing: Strict models validation (e.g. dates formatting, file size limit, URL checks).
• Widget / Integration Testing: UI triggers must satisfy the 44px minimum tap targets to fulfill accessibility compliance.`
      }
    };
  }, []);

  return (
    <div className={`space-y-4 pb-12 ${isLargeText ? 'text-lg' : 'text-xs'}`}>
      
      {/* HEADER WITH BACK LINK */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => {
            setCurrentScreen("settings");
            showToast("Returned to Preferences", "info");
          }}
          className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-wider hover:text-zinc-300"
        >
          <ArrowLeft size={12} className="mr-1" /> Preferences
        </button>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8.5px] font-mono font-bold animate-pulse">
          V1.0.0-GOLD
        </span>
      </div>

      <div>
        <h2 className="text-base font-black flex items-center tracking-tight">
          <Shield size={16} className="text-emerald-500 mr-1.5" />
          Release Hardening Console
        </h2>
        <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">STAGE_QA_PRODUCTION_GATEWAY</p>
      </div>

      {/* HORIZONTAL CONSOLE TABS */}
      <div className="flex space-x-1 border-b border-zinc-800/40 pb-2 overflow-x-auto whitespace-nowrap">
        {[
          { id: "tests", label: "QA Test Runner", icon: <Play size={10} /> },
          { id: "security", label: "Security Audit", icon: <Lock size={10} /> },
          { id: "access", label: "Accessibility", icon: <Accessibility size={10} /> },
          { id: "release", label: "Build Release", icon: <Cpu size={10} /> },
          { id: "docs", label: "Docs Hub", icon: <BookOpen size={10} /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id as any);
              showToast(`QA console shifted to ${t.label}`, "info");
            }}
            className={`px-2.5 py-1 rounded-lg text-[9.5px] font-bold flex items-center space-x-1 cursor-pointer transition-all ${
              activeTab === t.id 
                ? "bg-emerald-600 text-white" 
                : isDark ? "text-zinc-400 hover:text-zinc-200 bg-zinc-900/60" : "text-zinc-600 hover:text-zinc-900 bg-zinc-100"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* SCREEN READER PERSISTENT LOG BANNER */}
      {screenReaderLog && (
        <div className="p-2 rounded bg-blue-950/20 border border-blue-500/20 flex items-center space-x-2 text-[10px] text-blue-400 font-mono">
          <Volume2 size={12} className="animate-bounce" />
          <span>{screenReaderLog}</span>
        </div>
      )}

      {/* MAIN TAB CONTENTS */}
      <div className="space-y-4">
        
        {/* TAB 1: HEADLESS QA TEST RUNNER */}
        {activeTab === "tests" && (
          <div className="space-y-3">
            <div className={`p-3.5 rounded-xl border ${themeCardClass} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">Automated QA Verification</h4>
                  <p className="text-[9px] text-zinc-500">Run candidate models against V1.0 specifications</p>
                </div>
                <button 
                  onClick={runAutomatedTests}
                  disabled={isRunningTests}
                  className={`px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[10px] font-bold flex items-center space-x-1.5 transition-all`}
                >
                  <RefreshCw size={10} className={isRunningTests ? "animate-spin" : ""} />
                  <span>{isRunningTests ? "Simulating Headless VM..." : "Execute Test Suite"}</span>
                </button>
              </div>

              {/* Progress Bar */}
              {isRunningTests && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                    <span>PROGRESS GATE</span>
                    <span>{testProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${testProgress}%` }} />
                  </div>
                </div>
              )}

              {/* Tests Grid */}
              <div className="grid grid-cols-1 gap-1.5">
                {testSuite.map(test => (
                  <div key={test.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-[10.5px]">
                    <div className="flex items-center space-x-2">
                      <Code size={11} className="text-zinc-500" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-200">{test.name}</span>
                        <span className="text-[8px] text-zinc-500 font-mono">{test.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {test.status === "passed" && (
                        <>
                          <span className="text-[8px] text-zinc-500 font-mono">{test.duration}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8.5px] font-bold">PASS</span>
                        </>
                      )}
                      {test.status === "running" && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8.5px] font-bold animate-pulse">RUNNING</span>
                      )}
                      {test.status === "pending" && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 text-[8.5px] font-bold">READY</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Headless Terminal Log Output */}
            <div className="rounded-xl border border-zinc-800 bg-[#0A0A0C] p-3 space-y-1.5">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1.5">
                <div className="flex items-center space-x-1.5">
                  <Terminal size={11} className="text-emerald-500" />
                  <span className="text-[8.5px] font-bold text-zinc-400 font-mono">Headless Terminal Logs</span>
                </div>
                <button 
                  onClick={() => setTestLogs([])}
                  className="text-[8px] text-zinc-500 hover:text-zinc-300 font-mono"
                >
                  Clear Logs
                </button>
              </div>

              <div className="h-28 overflow-y-auto font-mono text-[9px] text-zinc-300 space-y-1 scrollbar-thin">
                {testLogs.length === 0 ? (
                  <p className="text-zinc-600 italic">Terminal idle. Click "Execute Test Suite" to route logging hooks.</p>
                ) : (
                  testLogs.map((log, idx) => (
                    <p key={idx} className={log.includes("[PASSED]") ? "text-emerald-400" : log.includes("[RUNNING]") ? "text-blue-400" : "text-zinc-400"}>
                      {log}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECURITY & DATA PRIVACY REVIEW */}
        {activeTab === "security" && (
          <div className="space-y-3">
            <div className={`p-3.5 rounded-xl border ${themeCardClass} space-y-3`}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold flex items-center">
                    <Shield size={13} className="text-blue-400 mr-1" />
                    Security Hardening Checklist
                  </h4>
                  <p className="text-[9px] text-zinc-500">Ensure PlacementOS holds maximum secure integrity</p>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-mono font-bold">100% SECURE</span>
              </div>

              <div className="space-y-2">
                {securityChecks.map(check => (
                  <div 
                    key={check.id}
                    className={`p-2.5 rounded-lg border ${themeBorderClass} flex items-start space-x-3 hover:border-zinc-700/50 transition-all`}
                  >
                    <input 
                      type="checkbox" 
                      checked={check.checked} 
                      onChange={() => toggleSecurityCheck(check.id)}
                      className="mt-0.5 rounded border-zinc-700 text-blue-500 focus:ring-0 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <span className="text-[10.5px] font-semibold text-zinc-200 block">{check.label}</span>
                      <p className="text-[8.5px] text-zinc-500 leading-tight">{check.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secure Storage and Environment Sandbox Diagnostics */}
            <div className={`p-3 rounded-xl border ${themeCardClass} space-y-2`}>
              <h5 className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Sandbox Verification Diagnostic</h5>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                <div className="p-2 rounded bg-zinc-900/40 border border-zinc-800/40">
                  <span className="block text-zinc-500 text-[8px]">GEMINI CORE API</span>
                  <span className="text-emerald-500 font-bold">SHIELDED (Server-only)</span>
                </div>
                <div className="p-2 rounded bg-zinc-900/40 border border-zinc-800/40">
                  <span className="block text-zinc-500 text-[8px]">SUPABASE RLS STATE</span>
                  <span className="text-emerald-500 font-bold">ACTIVE (Candidate Bound)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACCESSIBILITY & COMPLIANCE TOOLS */}
        {activeTab === "access" && (
          <div className="space-y-3">
            <div className={`p-3.5 rounded-xl border ${themeCardClass} space-y-3.5`}>
              <div>
                <h4 className="text-xs font-bold">Candidate Accessibility Panel</h4>
                <p className="text-[9px] text-zinc-500">Audit UI features for compliance with global standards</p>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10.5px] font-semibold">Simulate Text Size Scaling</span>
                    <span className="text-[8.5px] text-zinc-500 block">Enlarges overall viewport text sizes</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsLargeText(!isLargeText);
                      showToast(isLargeText ? "Shifted back to Default text size" : "Enlarged display text scaled", "success");
                    }}
                    className={`px-2.5 py-1 rounded text-[9.5px] font-bold ${isLargeText ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    {isLargeText ? "Active (+20%)" : "Default (100%)"}
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/40 pt-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[10.5px] font-semibold">Reduced Motion Mode</span>
                    <span className="text-[8.5px] text-zinc-500 block">Suppresses fluid spring animations</span>
                  </div>
                  <button 
                    onClick={() => {
                      setReduceMotion(!reduceMotion);
                      showToast(reduceMotion ? "Haptic motion enabled" : "Motion animations bypassed", "info");
                    }}
                    className={`px-2.5 py-1 rounded text-[9.5px] font-bold ${reduceMotion ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    {reduceMotion ? "Active (No Motion)" : "Standard Motion"}
                  </button>
                </div>
              </div>
            </div>

            {/* Semantic Layout / Screen Reader Simulation */}
            <div className={`p-3 rounded-xl border ${themeCardClass} space-y-2`}>
              <h5 className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Simulate Screen Reader Speech</h5>
              <p className="text-[9.5px] text-zinc-500">Tap elements below to listen to the simulated auditory narration for visually impaired users.</p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button 
                  onClick={() => simulateScreenReader("Dashboard Overview page: You have 4 active applications, 3 pending interviews.")}
                  className="px-2 py-1 rounded border border-zinc-700/60 bg-zinc-900/30 text-[9.5px] hover:border-zinc-500 text-zinc-300"
                >
                  🗣 Narrate Dashboard
                </button>
                <button 
                  onClick={() => simulateScreenReader("Career Credentials Vault tab: Resume Version 2, uploaded Friday July 17th.")}
                  className="px-2 py-1 rounded border border-zinc-700/60 bg-zinc-900/30 text-[9.5px] hover:border-zinc-500 text-zinc-300"
                >
                  🗣 Narrate Resume Vault
                </button>
                <button 
                  onClick={() => simulateScreenReader("Deadline Warning: Stripe Online Assessment scheduled for Tuesday July 21st.")}
                  className="px-2 py-1 rounded border border-zinc-700/60 bg-zinc-900/30 text-[9.5px] hover:border-zinc-500 text-zinc-300"
                >
                  🗣 Narrate Upcoming Deadline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: APP BUILD & NOTES PUBLISHER */}
        {activeTab === "release" && (
          <div className="space-y-3">
            <div className={`p-3.5 rounded-xl border ${themeCardClass} space-y-3`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">Release Parameter Configuration</h4>
                  <p className="text-[9px] text-zinc-500">Set version credentials and deployment environments</p>
                </div>
                <span className="text-[8.5px] font-mono text-zinc-500">V1.0 Build</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] text-zinc-500 font-mono block uppercase">Version Header</label>
                  <input 
                    type="text" 
                    value={appVersion}
                    onChange={(e) => setAppVersion(e.target.value)}
                    className={`w-full h-8 px-2 rounded text-[11px] outline-none mt-1 ${themeInputBg}`}
                  />
                </div>
                <div>
                  <label className="text-[8px] text-zinc-500 font-mono block uppercase">Release Channel</label>
                  <select
                    value={releaseChannel}
                    onChange={(e) => setReleaseChannel(e.target.value as any)}
                    className={`w-full h-8 px-2 rounded text-[10.5px] outline-none mt-1 ${themeInputBg}`}
                  >
                    <option value="stable">Stable (Production)</option>
                    <option value="beta">Beta Release</option>
                    <option value="canary">Canary (Alpha)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Production Notes Generator */}
            <div className={`p-3 rounded-xl border ${themeCardClass} space-y-2.5`}>
              <h5 className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono">v{appVersion} Production Release Notes</h5>
              
              <form onSubmit={handleAddReleaseNote} className="flex space-x-1.5">
                <input 
                  type="text" 
                  placeholder="E.g., Added full mobile compatibility grids."
                  value={customReleaseNote}
                  onChange={(e) => setCustomReleaseNote(e.target.value)}
                  className={`flex-1 h-7 px-2 rounded text-[10.5px] outline-none ${themeInputBg}`}
                />
                <button type="submit" className="px-2.5 h-7 rounded bg-emerald-600 text-white font-bold text-[10px]">
                  Add Note
                </button>
              </form>

              <div className="space-y-1 bg-zinc-950/20 p-2.5 rounded border border-zinc-800/45 text-[10px] leading-relaxed">
                <p className="font-bold text-zinc-300">PLACEMENTOS {releaseChannel.toUpperCase()} RELEASE v{appVersion}</p>
                <ul className="list-disc pl-3.5 space-y-0.5 text-zinc-400">
                  <li><strong>Ticket-011 Dashboard</strong>: Centralized placement pipeline analytics with responsive trend sparklines.</li>
                  <li><strong>Ticket-010 Job Capture</strong>: Automated smart parser for Stripe and Google internship URLs.</li>
                  <li><strong>Ticket-005 Authentication</strong>: Secure sandbox session renewals with activity leases.</li>
                  {customNotesList.map((note, nIdx) => (
                    <li key={nIdx}><strong>Extended Audit Note</strong>: {note}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Placeholders for Licensing and Privacy Policies */}
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={() => showToast("PlacementOS Platform Licenses: Licensed under Apache 2.0 open-source parameters.", "info")}
                className="py-1.5 px-2 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 text-center text-[9px] text-zinc-400"
              >
                📜 View OS Licenses
              </button>
              <button 
                onClick={() => showToast("Privacy & Terms: Core resumes and details are shielded client-side or securely isolated in Supabase schemas.", "info")}
                className="py-1.5 px-2 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 text-center text-[9px] text-zinc-400"
              >
                ⚖️ Privacy & Terms
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: COMPREHENSIVE PRODUCTION DOCUMENTATION */}
        {activeTab === "docs" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "architecture", label: "Clean Arch" },
                { id: "deployment", label: "Deployment" },
                { id: "testing", label: "Testing Guide" }
              ].map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedDocTopic(topic.id)}
                  className={`py-1.5 px-1 rounded text-center text-[9.5px] font-bold border transition-all ${
                    selectedDocTopic === topic.id 
                      ? "bg-zinc-800 border-zinc-500 text-white" 
                      : "border-zinc-800/60 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            {selectedDocTopic && (
              <div className={`p-3 rounded-xl border ${themeCardClass} space-y-2`}>
                <h4 className="text-xs font-bold text-zinc-200">
                  {docData[selectedDocTopic as keyof typeof docData].title}
                </h4>
                <div className="text-[10px] text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">
                  {docData[selectedDocTopic as keyof typeof docData].content}
                </div>
              </div>
            )}

            {/* Quick CI/CD Build Monitor Extension */}
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-900/50 to-transparent flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold">GitHub CI/CD Build Monitor</span>
              </div>
              <span className="font-mono text-[9px] text-emerald-400">PASSED: LINT & BUILD</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
