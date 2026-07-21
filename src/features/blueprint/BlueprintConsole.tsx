import React, { useState } from "react";
import { 
  FolderTree, Database, Sliders, AlertCircle, Copy, Check, FileCode,
  BookOpen, ChevronRight, Play, RefreshCw, Terminal, Server, Shield, Briefcase, Calendar, Sparkles
} from "lucide-react";
import { FLUTTER_SCAFFOLD_FILES } from "../../data/flutterScaffoldCode";
import { DATABASE_TABLES, POSTGRESQL_MIGRATION } from "../../data/databaseSchema";
import { BACKEND_FOUNDATION_FILES } from "../../data/backendFoundationCode";
import { DESIGN_SYSTEM_FILES } from "../../data/designSystemCode";
import { NAVIGATION_SHELL_FILES } from "../../data/navigationShellCode";
import { AUTHENTICATION_MODULE_FILES } from "../../data/authenticationModuleCode";
import { PLACEMENT_TRACKER_FILES } from "../../data/placementTrackerCode";
import { CAREER_VAULT_FILES } from "../../data/careerVaultCode";
import { DEADLINE_TRACKER_FILES } from "../../data/deadlineTrackerCode";
import { AI_CAPTURE_FILES } from "../../data/aiCaptureCode";

interface BlueprintConsoleProps {
  isDark: boolean;
}

export default function BlueprintConsole({ isDark }: BlueprintConsoleProps) {
  const [activeTab, setActiveTab] = useState<string>("deadline_tracker");
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [selectedBackendFileIndex, setSelectedBackendFileIndex] = useState<number>(0);
  const [selectedDesignSystemFileIndex, setSelectedDesignSystemFileIndex] = useState<number>(0);
  const [selectedNavFileIndex, setSelectedNavFileIndex] = useState<number>(0);
  const [selectedAuthFileIndex, setSelectedAuthFileIndex] = useState<number>(0);
  const [selectedTrackerFileIndex, setSelectedTrackerFileIndex] = useState<number>(0);
  const [selectedVaultFileIndex, setSelectedVaultFileIndex] = useState<number>(0);
  const [selectedDeadlineFileIndex, setSelectedDeadlineFileIndex] = useState<number>(0);
  const [selectedAICaptureFileIndex, setSelectedAICaptureFileIndex] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [testResult, setTestResult] = useState<{ status: "idle" | "success" | "failure"; message: string; payload?: any }>({
    status: "idle",
    message: "Press 'Simulate Repository Run' to verify monadic error-handling state."
  });
  const [isSimulatingError, setIsSimulatingError] = useState<boolean>(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const simulateRepositoryCall = (forceError: boolean) => {
    setIsSimulatingError(true);
    setTestResult({ status: "idle", message: "Connecting to Supabase Database Cluster..." });
    
    setTimeout(() => {
      if (forceError) {
        setTestResult({
          status: "failure",
          message: "Result.failure(AuthFailure('Invalid email or password credentials.'))"
        });
      } else {
        setTestResult({
          status: "success",
          message: "Result.success(PlacementUser(id: 'usr_9124', email: 'singhxayush100@gmail.com', fullName: 'Ayush Singh'))",
          payload: { id: "usr_9124", email: "singhxayush100@gmail.com", fullName: "Ayush Singh", preference: "Software Engineer" }
        });
      }
      setIsSimulatingError(false);
    }, 1000);
  };

  const themeCardBg = isDark ? "bg-[#121214] border-zinc-800" : "bg-white border-zinc-200";
  const themeBorderClass = isDark ? "border-zinc-800" : "border-zinc-200";
  const themeTextSubtle = isDark ? "text-zinc-400" : "text-zinc-500";
  const themeTextMuted = isDark ? "text-zinc-500" : "text-zinc-400";
  const themeCodeBg = isDark ? "bg-[#1E1E22] border-zinc-800 text-zinc-100" : "bg-zinc-50 border-zinc-200 text-zinc-900";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className={`h-[52px] border-b ${themeBorderClass} px-6 flex items-center space-x-1 overflow-x-auto scrollbar-none`}>
        {[
          { id: "ai_capture", icon: <Sparkles size={14} className="text-purple-500 animate-pulse" />, label: "AI Smart Capture (T-010)" },
          { id: "deadline_tracker", icon: <Calendar size={14} className="text-blue-500 animate-pulse" />, label: "Deadline Tracker (T-008)" },
          { id: "career_vault", icon: <Briefcase size={14} className="text-blue-500" />, label: "Career Vault (T-007)" },
          { id: "placement_tracker", icon: <Briefcase size={14} className="text-amber-500" />, label: "Placement Tracker" },
          { id: "auth_module", icon: <Shield size={14} className="text-blue-400" />, label: "Authentication Module" },
          { id: "navigation_shell", icon: <FolderTree size={14} className="text-emerald-500" />, label: "App Shell & Navigation" },
          { id: "design_system_dart", icon: <Sliders size={14} className="text-purple-500" />, label: "Design System UI" },
          { id: "supabase_backend", icon: <Server size={14} className="text-blue-500" />, label: "Supabase Backend" },
          { id: "architecture", icon: <BookOpen size={14} />, label: "Architecture Core" },
          { id: "scaffold", icon: <FolderTree size={14} />, label: "Scaffold Files" },
          { id: "database", icon: <Database size={14} />, label: "Database Normalization" },
          { id: "design_tokens", icon: <Sliders size={14} />, label: "Design System Tokens" },
          { id: "error_handling", icon: <AlertCircle size={14} />, label: "Robust Error Simulator" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === tab.id 
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                : isDark ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {tab.icon}
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {activeTab === "ai_capture" && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-5 rounded-2xl border ${themeCardBg} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles size={120} className="text-purple-500 animate-pulse" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold font-mono">TICKET-010</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold font-mono">AI SMART JOB CAPTURE</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">GROQ + GEMINI INTEGRATION LAYER</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-3">AI Smart Job Capture & Extraction (Ticket-010)</h2>
              <p className={`text-xs ${themeTextSubtle} mt-2 max-w-3xl leading-relaxed`}>
                This tab implements **Ticket-010 — AI Smart Job Capture**. It features an exchangeable provider pattern (Groq/Gemini), automated sanitation filters, confidence telemetry highlighting, and transactional commits into both the Placement Tracker pipeline and the Deadline Scheduler.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">COGNITIVE EXTRACTOR MODULE CODES</h3>
                <div className="space-y-1.5">
                  {AI_CAPTURE_FILES.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAICaptureFileIndex(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                        selectedAICaptureFileIndex === idx
                          ? "bg-purple-500/5 border-purple-500 shadow-sm"
                          : isDark ? "bg-[#121214] border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedAICaptureFileIndex === idx ? "bg-purple-500 text-white" : isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
                        <FileCode size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate leading-tight">{file.name}</span>
                          <span className="text-[9px] font-mono font-medium text-purple-500 font-bold">DART</span>
                        </div>
                        <p className={`text-[10px] ${themeTextSubtle} truncate mt-0.5`}>{file.path}</p>
                        <p className={`text-[10px] ${themeTextMuted} mt-1.5 leading-tight`}>{file.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className={`p-4 rounded-xl border ${themeCardBg} flex items-center justify-between`}>
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-1.5 rounded bg-purple-500/10 text-purple-400">
                      <FileCode size={13} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold font-mono block truncate">{AI_CAPTURE_FILES[selectedAICaptureFileIndex].name}</span>
                      <span className={`text-[9px] font-mono block truncate ${themeTextSubtle}`}>{AI_CAPTURE_FILES[selectedAICaptureFileIndex].path}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(AI_CAPTURE_FILES[selectedAICaptureFileIndex].content, AI_CAPTURE_FILES[selectedAICaptureFileIndex].name)}
                    className={`h-8 px-3 rounded-lg border ${themeBorderClass} text-[10px] font-semibold flex items-center space-x-1.5 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition-all`}
                  >
                    {copiedText === AI_CAPTURE_FILES[selectedAICaptureFileIndex].name ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>

                <div className={`rounded-xl border ${themeCodeBg} overflow-hidden font-mono text-[11px] leading-relaxed shadow-sm`}>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-inherit bg-zinc-950/20 text-xs">
                    <span className="text-[10px] text-zinc-500">PRODUCTION-READY SECURE SCOPE</span>
                    <span className="text-[10px] text-purple-400 font-bold uppercase font-mono">DART V3</span>
                  </div>
                  <pre className="p-4 overflow-x-auto max-h-[500px] whitespace-pre text-left">
                    {AI_CAPTURE_FILES[selectedAICaptureFileIndex].content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "deadline_tracker" && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-5 rounded-2xl border ${themeCardBg} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Calendar size={120} className="text-blue-500" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold font-mono">TICKET-008</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold font-mono">DEADLINE TRACKER & REMINDERS</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">REPOSITORY + NOTIFICATION ENGINE</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-3">Deadline Tracker & Reminder System (Ticket-008)</h2>
              <p className={`text-xs ${themeTextSubtle} mt-2 max-w-3xl leading-relaxed`}>
                This tab implements **Ticket-008 — Deadline Tracker & Reminder System**. It features a comprehensive, durable scheduler, calendar visualizations, a robust notification engine, and bidirectional references to the Placement Tracker entries.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">SCHEDULER ARCHITECTURE CODES</h3>
                <div className="space-y-1.5">
                  {DEADLINE_TRACKER_FILES.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDeadlineFileIndex(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                        selectedDeadlineFileIndex === idx
                          ? "bg-blue-500/5 border-blue-500 shadow-sm"
                          : isDark ? "bg-[#121214] border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedDeadlineFileIndex === idx ? "bg-blue-500 text-white" : isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
                        <FileCode size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate leading-tight">{file.name}</span>
                          <span className="text-[9px] font-mono font-medium text-blue-500">DART</span>
                        </div>
                        <p className={`text-[10px] ${themeTextSubtle} truncate mt-0.5`}>{file.path}</p>
                        <p className={`text-[10px] ${themeTextMuted} mt-1.5 leading-tight`}>{file.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className={`p-4 rounded-xl border ${themeCardBg} flex items-center justify-between`}>
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-500">
                      <FileCode size={13} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold font-mono block truncate">{DEADLINE_TRACKER_FILES[selectedDeadlineFileIndex].name}</span>
                      <span className={`text-[9px] font-mono block truncate ${themeTextSubtle}`}>{DEADLINE_TRACKER_FILES[selectedDeadlineFileIndex].path}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(DEADLINE_TRACKER_FILES[selectedDeadlineFileIndex].content, DEADLINE_TRACKER_FILES[selectedDeadlineFileIndex].name)}
                    className={`h-8 px-3 rounded-lg border ${themeBorderClass} text-[10px] font-semibold flex items-center space-x-1.5 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition-all`}
                  >
                    {copiedText === DEADLINE_TRACKER_FILES[selectedDeadlineFileIndex].name ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>

                <div className={`rounded-xl border ${themeCodeBg} overflow-hidden font-mono text-[11px] leading-relaxed shadow-sm`}>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-inherit bg-zinc-950/20 text-xs">
                    <span className="text-[10px] text-zinc-500">PRODUCTION-READY FLUTTER CODE</span>
                    <span className="text-[10px] text-blue-500 font-bold uppercase font-mono">DART V3</span>
                  </div>
                  <pre className="p-4 overflow-x-auto max-h-[500px] whitespace-pre text-left">
                    {DEADLINE_TRACKER_FILES[selectedDeadlineFileIndex].content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "career_vault" && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-5 rounded-2xl border ${themeCardBg} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FolderTree size={120} className="text-blue-500" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold font-mono">TICKET-007</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold font-mono">CAREER VAULT MODULE</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">SUPABASE STORAGE + REPOSITORY</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-3">Career Vault (Digital Career Identity)</h2>
              <p className={`text-xs ${themeTextSubtle} mt-2 max-w-3xl leading-relaxed`}>
                This tab implements **Ticket-007 — Career Vault (Digital Career Identity)**. It is a secure professional profile editor, dynamic resume manager (with support for multiple versions and marking defaults), and a document repository integrated with Supabase Storage and PostgreSQL metadata indexing.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">VAULT ARCHITECTURE CODES</h3>
                <div className="space-y-1.5">
                  {CAREER_VAULT_FILES.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVaultFileIndex(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                        selectedVaultFileIndex === idx
                          ? "bg-blue-500/5 border-blue-500 shadow-sm"
                          : isDark ? "bg-[#121214] border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedVaultFileIndex === idx ? "bg-blue-500 text-white" : isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
                        <FileCode size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate leading-tight">{file.name}</span>
                          <span className="text-[9px] font-mono font-medium text-blue-500">DART</span>
                        </div>
                        <p className={`text-[10px] ${themeTextSubtle} truncate mt-0.5`}>{file.path}</p>
                        <p className={`text-[10px] ${themeTextMuted} mt-1.5 leading-tight`}>{file.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className={`p-4 rounded-xl border ${themeCardBg} flex items-center justify-between`}>
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-500">
                      <FileCode size={13} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold font-mono block truncate">{CAREER_VAULT_FILES[selectedVaultFileIndex].name}</span>
                      <span className={`text-[9px] font-mono block truncate ${themeTextSubtle}`}>{CAREER_VAULT_FILES[selectedVaultFileIndex].path}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(CAREER_VAULT_FILES[selectedVaultFileIndex].content, CAREER_VAULT_FILES[selectedVaultFileIndex].name)}
                    className={`h-8 px-3 rounded-lg border ${themeBorderClass} text-[10px] font-semibold flex items-center space-x-1.5 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition-all`}
                  >
                    {copiedText === CAREER_VAULT_FILES[selectedVaultFileIndex].name ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>

                <div className={`rounded-xl border ${themeCodeBg} overflow-hidden font-mono text-[11px] leading-relaxed shadow-sm`}>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-inherit bg-zinc-950/20 text-xs">
                    <span className="text-[10px] text-zinc-500">PRODUCTION-READY FLUTTER CODE</span>
                    <span className="text-[10px] text-blue-500 font-bold uppercase font-mono">DART V3</span>
                  </div>
                  <pre className="p-4 overflow-x-auto max-h-[500px] whitespace-pre text-left">
                    {CAREER_VAULT_FILES[selectedVaultFileIndex].content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "placement_tracker" && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-5 rounded-2xl border ${themeCardBg} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Briefcase size={120} className="text-amber-500" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold font-mono">TICKET-006</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold font-mono">CORE MVP FEATURE</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">RIVERPOD + REPOSITORY</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-3">Placement Tracker (Core MVP Feature)</h2>
              <p className={`text-xs ${themeTextSubtle} mt-2 max-w-3xl leading-relaxed`}>
                This tab implements **Ticket-006 — Placement Tracker (Core MVP Feature)**. It is the flagship command center of the application, featuring full repository models, custom status workflows with specific colors/badges, interactive add/edit form bindings, a detailed application review panel with real-time historical activity log timelines, search indexes, and rigorous sorting algorithms.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">TRACKER ARCHITECTURE CODES</h3>
                <div className="space-y-1.5">
                  {PLACEMENT_TRACKER_FILES.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTrackerFileIndex(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                        selectedTrackerFileIndex === idx
                          ? "bg-amber-500/5 border-amber-500 shadow-sm"
                          : isDark ? "bg-[#121214] border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedTrackerFileIndex === idx ? "bg-amber-500 text-white" : isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
                        <FileCode size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate leading-tight">{file.name}</span>
                          <span className="text-[9px] font-mono font-medium text-amber-500">DART</span>
                        </div>
                        <p className={`text-[10px] ${themeTextSubtle} truncate mt-0.5`}>{file.path}</p>
                        <p className={`text-[10px] ${themeTextMuted} mt-1.5 leading-tight`}>{file.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className={`p-4 rounded-xl border ${themeCardBg} flex items-center justify-between`}>
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-1.5 rounded bg-amber-500/10 text-amber-500">
                      <FileCode size={13} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold font-mono block truncate">{PLACEMENT_TRACKER_FILES[selectedTrackerFileIndex].name}</span>
                      <span className={`text-[9px] font-mono block truncate ${themeTextSubtle}`}>{PLACEMENT_TRACKER_FILES[selectedTrackerFileIndex].path}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(PLACEMENT_TRACKER_FILES[selectedTrackerFileIndex].content, PLACEMENT_TRACKER_FILES[selectedTrackerFileIndex].name)}
                    className={`h-8 px-3 rounded-lg border ${themeBorderClass} text-[10px] font-semibold flex items-center space-x-1.5 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition-all`}
                  >
                    {copiedText === PLACEMENT_TRACKER_FILES[selectedTrackerFileIndex].name ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>

                <div className={`rounded-xl border ${themeCodeBg} overflow-hidden font-mono text-[11px] leading-relaxed shadow-sm`}>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-inherit bg-zinc-950/20 text-xs">
                    <span className="text-[10px] text-zinc-500">PRODUCTION-READY FLUTTER CODE</span>
                    <span className="text-[10px] text-amber-500 font-bold uppercase font-mono">DART V3</span>
                  </div>
                  <pre className="p-4 overflow-x-auto max-h-[500px] whitespace-pre text-left">
                    {PLACEMENT_TRACKER_FILES[selectedTrackerFileIndex].content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "auth_module" && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-5 rounded-2xl border ${themeCardBg} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Shield size={120} className="text-blue-500 animate-pulse" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold font-mono">TICKET-005</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold font-mono">AUTH MODULE</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold font-mono">SUPABASE + RIVERPOD</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-3">PlacementOS Authentication Module</h2>
              <p className={`text-xs ${themeTextSubtle} mt-2 max-w-3xl leading-relaxed`}>
                This tab implements **Ticket-005: Authentication Module (UI & Session Management)**. It incorporates production-ready login/registration/recovery views with robust text field validators, a password strength calculator, real-time Google OAuth widgets, persistent login listeners, and a sealed-monad exception pipeline connecting with the Supabase back-end.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">AUTHENTICATION CODEFILES</h3>
                <div className="space-y-1.5">
                  {AUTHENTICATION_MODULE_FILES.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAuthFileIndex(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                        selectedAuthFileIndex === idx
                          ? "bg-blue-500/5 border-blue-500 shadow-sm"
                          : isDark ? "bg-[#121214] border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedAuthFileIndex === idx ? "bg-blue-500 text-white" : isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
                        <FileCode size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate leading-tight">{file.name}</span>
                          <span className="text-[9px] font-mono font-medium text-blue-400">DART</span>
                        </div>
                        <p className={`text-[10px] ${themeTextSubtle} truncate mt-0.5`}>{file.path}</p>
                        <p className={`text-[10px] ${themeTextMuted} mt-1.5 leading-tight`}>{file.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className={`p-4 rounded-xl border ${themeCardBg} flex items-center justify-between`}>
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
                      <FileCode size={13} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold font-mono block truncate">{AUTHENTICATION_MODULE_FILES[selectedAuthFileIndex].name}</span>
                      <span className={`text-[9px] font-mono block truncate ${themeTextSubtle}`}>{AUTHENTICATION_MODULE_FILES[selectedAuthFileIndex].path}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(AUTHENTICATION_MODULE_FILES[selectedAuthFileIndex].content, AUTHENTICATION_MODULE_FILES[selectedAuthFileIndex].name)}
                    className={`h-8 px-3 rounded-lg border ${themeBorderClass} text-[10px] font-semibold flex items-center space-x-1.5 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition-all`}
                  >
                    {copiedText === AUTHENTICATION_MODULE_FILES[selectedAuthFileIndex].name ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>

                <div className={`rounded-xl border ${themeCodeBg} overflow-hidden font-mono text-[11px] leading-relaxed shadow-sm`}>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-inherit bg-zinc-950/20 text-xs">
                    <span className="text-[10px] text-zinc-500">PRODUCTION-READY AUTH CODE</span>
                    <span className="text-[10px] text-blue-400 font-bold uppercase font-mono">DART V3</span>
                  </div>
                  <pre className="p-4 overflow-x-auto max-h-[500px] whitespace-pre text-left">
                    {AUTHENTICATION_MODULE_FILES[selectedAuthFileIndex].content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "navigation_shell" && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-5 rounded-2xl border ${themeCardBg} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FolderTree size={120} className="text-emerald-500 animate-pulse" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold font-mono">TICKET-004</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold font-mono">APPLICATION SHELL</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-bold font-mono">GOROUTER READY</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-3">PlacementOS App Shell & Navigation</h2>
              <p className={`text-xs ${themeTextSubtle} mt-2 max-w-3xl leading-relaxed`}>
                This panel implements **Ticket-004: Application Shell & Navigation Framework** as defined in the official Project Bible. It provides GoRouter nested ShellRoutes, Route Observers, adaptive BottomNav, Navigation Rail, and Sidebar components, global AppBar, authentication guard placeholders, and high-performance layout wrappers.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">NAVIGATION & SHELL</h3>
                <div className="space-y-1.5">
                  {NAVIGATION_SHELL_FILES.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedNavFileIndex(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                        selectedNavFileIndex === idx
                          ? "bg-emerald-500/5 border-emerald-500 shadow-sm"
                          : isDark ? "bg-[#121214] border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedNavFileIndex === idx ? "bg-emerald-500 text-white" : isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
                        <FileCode size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate leading-tight">{file.name}</span>
                          <span className="text-[9px] font-mono font-medium text-emerald-400">DART</span>
                        </div>
                        <p className={`text-[10px] ${themeTextSubtle} truncate mt-0.5`}>{file.path}</p>
                        <p className={`text-[10px] ${themeTextMuted} mt-1.5 leading-tight`}>{file.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className={`p-4 rounded-xl border ${themeCardBg} flex items-center justify-between`}>
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                      <FileCode size={13} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold font-mono block truncate">{NAVIGATION_SHELL_FILES[selectedNavFileIndex].name}</span>
                      <span className={`text-[9px] font-mono block truncate ${themeTextSubtle}`}>{NAVIGATION_SHELL_FILES[selectedNavFileIndex].path}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(NAVIGATION_SHELL_FILES[selectedNavFileIndex].content, NAVIGATION_SHELL_FILES[selectedNavFileIndex].name)}
                    className={`h-8 px-3 rounded-lg border ${themeBorderClass} text-[10px] font-semibold flex items-center space-x-1.5 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition-all`}
                  >
                    {copiedText === NAVIGATION_SHELL_FILES[selectedNavFileIndex].name ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>

                <div className={`rounded-xl border ${themeCodeBg} overflow-hidden font-mono text-[11px] leading-relaxed shadow-sm`}>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-inherit bg-zinc-950/20 text-xs">
                    <span className="text-[10px] text-zinc-500">PRODUCTION-READY NAVIGATION CODE</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono">DART V3</span>
                  </div>
                  <pre className="p-4 overflow-x-auto max-h-[500px] whitespace-pre text-left">
                    {NAVIGATION_SHELL_FILES[selectedNavFileIndex].content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "design_system_dart" && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-5 rounded-2xl border ${themeCardBg} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sliders size={120} className="text-purple-500 animate-pulse" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-bold font-mono">TICKET-003</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold font-mono">DESIGN SYSTEM FOUNDATION</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold font-mono">MATERIAL 3 READY</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-3">PlacementOS Core Design System</h2>
              <p className={`text-xs ${themeTextSubtle} mt-2 max-w-3xl leading-relaxed`}>
                This panel implements **Ticket-003: Design System Implementation** as defined in the official Project Bible. It provides strongly-typed design tokens for spacing, radii, strokes, durations, curves, responsive layouts, Material 3 dynamic light/dark palettes, semantic states (Hover, Focus, Pressed, Disabled), and shared components (PrimaryButton, MetricCard, PasswordField).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">DESIGN SYSTEM CODES</h3>
                <div className="space-y-1.5">
                  {DESIGN_SYSTEM_FILES.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDesignSystemFileIndex(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                        selectedDesignSystemFileIndex === idx
                          ? "bg-purple-500/5 border-purple-500 shadow-sm"
                          : isDark ? "bg-[#121214] border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedDesignSystemFileIndex === idx ? "bg-purple-500 text-white" : isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
                        <FileCode size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate leading-tight">{file.name}</span>
                          <span className="text-[9px] font-mono font-medium text-purple-400">DART</span>
                        </div>
                        <p className={`text-[10px] ${themeTextSubtle} truncate mt-0.5`}>{file.path}</p>
                        <p className={`text-[10px] ${themeTextMuted} mt-1.5 leading-tight`}>{file.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className={`p-4 rounded-xl border ${themeCardBg} flex items-center justify-between`}>
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-1.5 rounded bg-purple-500/10 text-purple-400">
                      <FileCode size={13} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold font-mono block truncate">{DESIGN_SYSTEM_FILES[selectedDesignSystemFileIndex].name}</span>
                      <span className={`text-[9px] font-mono block truncate ${themeTextSubtle}`}>{DESIGN_SYSTEM_FILES[selectedDesignSystemFileIndex].path}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(DESIGN_SYSTEM_FILES[selectedDesignSystemFileIndex].content, DESIGN_SYSTEM_FILES[selectedDesignSystemFileIndex].name)}
                    className={`h-8 px-3 rounded-lg border ${themeBorderClass} text-[10px] font-semibold flex items-center space-x-1.5 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition-all`}
                  >
                    {copiedText === DESIGN_SYSTEM_FILES[selectedDesignSystemFileIndex].name ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>

                <div className={`rounded-xl border ${themeCodeBg} overflow-hidden font-mono text-[11px] leading-relaxed shadow-sm`}>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-inherit bg-zinc-950/20 text-xs">
                    <span className="text-[10px] text-zinc-500">PRODUCTION-READY BLUEPRINT</span>
                    <span className="text-[10px] text-purple-400 font-bold uppercase font-mono">DART V3</span>
                  </div>
                  <pre className="p-4 overflow-x-auto max-h-[500px] whitespace-pre text-left">
                    {DESIGN_SYSTEM_FILES[selectedDesignSystemFileIndex].content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "supabase_backend" && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border ${themeCardBg} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Server size={120} className="text-blue-500 animate-pulse" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold font-mono">TICKET-002</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold font-mono">BACKEND INFRASTRUCTURE</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-bold font-mono">100% SPEC COMPLIANT</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-3">Supabase Backend Foundation Spec</h2>
              <p className={`text-xs ${themeTextSubtle} mt-2 max-w-3xl leading-relaxed`}>
                This panel implements **Ticket-002: Supabase Backend Foundation** according to the Project Bible standards. It includes complete PostgreSQL schema normalization, high-density search indexing, strict Row-Level Security (RLS) owners-only policies, isolated DTO models with serialization, Riverpod dependency injection, and a robust monadic exception simulator that handles all Supabase/Auth exceptions securely.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-dashed border-zinc-800">
                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <span className="text-[10px] text-blue-400 font-bold font-mono uppercase tracking-wider">Authentication</span>
                  <div className="text-xs font-bold mt-1">Google & Email</div>
                  <div className={`text-[10px] ${themeTextSubtle} mt-0.5`}>Persistent, State Listeners, Token Refreshes</div>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                  <span className="text-[10px] text-indigo-400 font-bold font-mono uppercase tracking-wider">Relational Tables</span>
                  <div className="text-xs font-bold mt-1">7 Core Normalizations</div>
                  <div className={`text-[10px] ${themeTextSubtle} mt-0.5`}>UUID Keys, Cascades, High-Density Indexes</div>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                  <span className="text-[10px] text-purple-400 font-bold font-mono uppercase tracking-wider">Row Level Security</span>
                  <div className="text-xs font-bold mt-1">Strict Isolation</div>
                  <div className={`text-[10px] ${themeTextSubtle} mt-0.5`}>UID Mapped Select/Insert/Update/Delete Policies</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <span className="text-[10px] text-emerald-400 font-bold font-mono uppercase tracking-wider">Storage Buckets</span>
                  <div className="text-xs font-bold mt-1">resumes & profiles</div>
                  <div className={`text-[10px] ${themeTextSubtle} mt-0.5`}>Authenticated Folders & Owner Policies</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px]">
              <div className="lg:col-span-4 border border-zinc-800 rounded-2xl overflow-y-auto bg-black p-2.5 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono px-3 py-2 block border-b border-zinc-800/80 mb-2">
                  INFRASTRUCTURE FILES
                </span>
                {BACKEND_FOUNDATION_FILES.map((file, idx) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedBackendFileIndex(idx)}
                    className={`w-full text-left px-3 py-3 rounded-xl text-xs font-mono transition-all flex flex-col justify-between border cursor-pointer ${
                      selectedBackendFileIndex === idx 
                        ? "bg-blue-600/10 text-blue-400 border-blue-600/30 font-semibold shadow-sm" 
                        : isDark 
                          ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent" 
                          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FileCode size={13} className={selectedBackendFileIndex === idx ? "text-blue-400 animate-pulse" : "text-zinc-500"} />
                      <span className="truncate text-xs font-bold">{file.name}</span>
                    </div>
                    <span className={`text-[10px] ${themeTextSubtle} block mt-1 leading-normal font-sans ml-5`}>
                      {file.description}
                    </span>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-8 flex flex-col border border-zinc-800 rounded-2xl overflow-hidden bg-[#0C0C0E]">
                <div className="h-12 bg-[#121214] border-b border-zinc-800 px-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-bold uppercase">
                      {BACKEND_FOUNDATION_FILES[selectedBackendFileIndex].language}
                    </span>
                    <span className="text-zinc-400 truncate font-semibold">
                      {BACKEND_FOUNDATION_FILES[selectedBackendFileIndex].path}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(
                      BACKEND_FOUNDATION_FILES[selectedBackendFileIndex].content,
                      BACKEND_FOUNDATION_FILES[selectedBackendFileIndex].name
                    )}
                    className="px-3 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold flex items-center space-x-1.5 transition-all cursor-pointer text-xs"
                  >
                    {copiedText === BACKEND_FOUNDATION_FILES[selectedBackendFileIndex].name ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-4 text-[11px] font-mono leading-relaxed text-zinc-300 bg-black">
                  <pre>{BACKEND_FOUNDATION_FILES[selectedBackendFileIndex].content}</pre>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${themeCardBg} space-y-3`}>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">Security & RLS Rule Assertions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold">Row-Level Security (RLS) Enforced</span>
                  </div>
                  <p className={`text-xs ${themeTextSubtle} leading-relaxed`}>
                    Every database entity checks <code>auth.uid() = user_id</code> at the gateway level. Unauthenticated callers and cross-account queries are rejected before executing query compilation on PostgreSQL.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-bold">Monadic Failure Exception Map</span>
                  </div>
                  <p className={`text-xs ${themeTextSubtle} leading-relaxed`}>
                    All network operations map raw <code>supabase.AuthException</code> or database timeouts into clean <code>Failure</code> instances to enforce zero-leak UI state managers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "architecture" && (
          <div className="space-y-6 max-w-4xl">
            <div className={`p-5 rounded-2xl border ${themeCardBg} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BookOpen size={120} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold font-mono">SPRINT-1 SCOPE</span>
              <h2 className="text-xl font-bold tracking-tight mt-2.5">Feature-First Clean Architecture</h2>
              <p className={`text-xs ${themeTextSubtle} mt-2 leading-relaxed`}>
                This blueprint sets up a startup-grade modular hierarchy for **VeyloPrep**. 
                Clean Architecture isolates domain logic from state controllers, databases, UI frameworks, and storage adapters, ensuring maximum testability and seamless future integrations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-dashed border-zinc-800">
                <div>
                  <h4 className="text-xs font-bold flex items-center text-blue-500"><FolderTree size={12} className="mr-1.5" /> 1. Self-Contained Features</h4>
                  <p className={`text-[11px] ${themeTextSubtle} mt-1 leading-tight font-mono`}>Features (e.g. auth_portal, placement_tracker) group code by business modules, not technology types.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold flex items-center text-indigo-500"><Database size={12} className="mr-1.5" /> 2. Repository Contracts</h4>
                  <p className={`text-[11px] ${themeTextSubtle} mt-1 leading-tight font-mono`}>Domain layer defines abstract models and repos, which the data adapter implements elsewhere.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold flex items-center text-purple-500"><Sliders size={12} className="mr-1.5" /> 3. Immutable Tokens</h4>
                  <p className={`text-[11px] ${themeTextSubtle} mt-1 leading-tight font-mono`}>No raw values. Colors, paddings, elevations, and curves are imported as constants.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">Directory Architecture Guidelines</h3>
              <div className={`p-4 rounded-xl border ${themeCardBg} font-mono text-xs space-y-3.5`}>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500">lib/core/</span>
                  <span className={`${themeTextSubtle}`}>Global utilities, themes, routing, failures, and design tokens used app-wide.</span>
                </div>
                <div className="flex items-start space-x-2 border-t border-zinc-800/50 pt-2.5">
                  <span className="text-indigo-500">lib/services/</span>
                  <span className={`${themeTextSubtle}`}>Unified managers interfacing with third-party servers (Supabase, Auth, Storage).</span>
                </div>
                <div className="flex items-start space-x-2 border-t border-zinc-800/50 pt-2.5">
                  <span className="text-purple-500">lib/shared/</span>
                  <span className={`${themeTextSubtle}`}>Reusable layout shells, custom form inputs, animated buttons, and UI elements.</span>
                </div>
                <div className="flex items-start space-x-2 border-t border-zinc-800/50 pt-2.5">
                  <span className="text-emerald-500">lib/features/</span>
                  <span className={`${themeTextSubtle}`}>Isolated modules grouped by capabilities. Each module houses nested <code>data/</code>, <code>domain/</code>, and <code>presentation/</code> directories.</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${themeCardBg} space-y-2`}>
              <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider font-mono">SOLID & Performance Mandates</h4>
              <ul className={`text-xs ${themeTextSubtle} list-disc pl-5 space-y-1.5`}>
                <li><strong>Single Responsibility Principle:</strong> Keep individual widgets and controllers under 200 lines of code.</li>
                <li><strong>No Inline Layout Settings:</strong> All sizes and colors must reference AppSpacing, AppRadius, and AppTheme.</li>
                <li><strong>Const Constructors:</strong> Always declare constant constructors on static UI trees to minimize Flutter rendering overhead.</li>
                <li><strong>No Raw UI Business Logic:</strong> Screen widgets should remain purely declarative presentation code. Business logic must live in Riverpod state controllers.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "scaffold" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
            <div className="lg:col-span-4 border border-zinc-800 rounded-xl overflow-y-auto bg-black p-2 space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono p-2 block border-b border-zinc-800 mb-2">FLUTTER PROJECT SCAFFOLD</span>
              {FLUTTER_SCAFFOLD_FILES.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    selectedFileIndex === idx 
                      ? "bg-blue-600/10 text-blue-400 border border-blue-600/30 font-semibold" 
                      : isDark ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode size={13} className={selectedFileIndex === idx ? "text-blue-400" : "text-zinc-500"} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <ChevronRight size={12} className="text-zinc-600 flex-shrink-0" />
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 flex flex-col border border-zinc-800 rounded-xl overflow-hidden bg-[#0C0C0E]">
              <div className="h-10 bg-[#121214] border-b border-zinc-800 px-4 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">{FLUTTER_SCAFFOLD_FILES[selectedFileIndex].path}</span>
                <button
                  onClick={() => handleCopy(
                    FLUTTER_SCAFFOLD_FILES[selectedFileIndex].content,
                    FLUTTER_SCAFFOLD_FILES[selectedFileIndex].name
                  )}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  {copiedText === FLUTTER_SCAFFOLD_FILES[selectedFileIndex].name ? (
                    <>
                      <Check size={11} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 text-[11px] font-mono leading-relaxed text-zinc-300 bg-black">
                <pre>{FLUTTER_SCAFFOLD_FILES[selectedFileIndex].content}</pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "database" && (
          <div className="space-y-6 max-w-4xl">
            <div className={`p-5 rounded-xl border ${themeCardBg}`}>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold font-mono">SUPABASE & POSTGRESQL</span>
              <h3 className="text-lg font-bold tracking-tight mt-2">Production Relational Schema</h3>
              <p className={`text-xs ${themeTextSubtle} mt-1.5 leading-relaxed`}>
                This schema supports advanced college-level internship operations. It features strict **Row-Level Security (RLS)** rules, high-density indices for rapid search, and database-level updated_at triggers.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">ERD Entity Normalization Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DATABASE_TABLES.map(table => (
                  <div key={table.name} className={`p-4 rounded-xl border ${themeCardBg} space-y-2.5`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-indigo-400 font-mono">public.{table.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">TABLE</span>
                    </div>
                    <p className={`text-[11px] ${themeTextSubtle}`}>{table.description}</p>
                    
                    <div className="border-t border-zinc-800 pt-2 space-y-1.5 text-[10px] font-mono">
                      {table.columns.map(col => (
                        <div key={col.name} className="flex items-start justify-between">
                          <span className="text-blue-400 font-bold">{col.name}</span>
                          <span className="text-zinc-500 italic max-w-[150px] truncate" title={col.description}>{col.type} — {col.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">Production Migration Script</h4>
                <button
                  onClick={() => handleCopy(POSTGRESQL_MIGRATION, "sql_migration")}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  {copiedText === "sql_migration" ? (
                    <>
                      <Check size={11} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied SQL!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Copy SQL Migration</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-black text-[11px] font-mono max-h-[250px] overflow-y-auto leading-relaxed text-zinc-400">
                <pre>{POSTGRESQL_MIGRATION}</pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "design_tokens" && (
          <div className="space-y-6 max-w-4xl">
            <div className={`p-4 rounded-xl border ${themeCardBg} space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Design Tokens & Constants Reference</h3>
                <span className="text-xs text-zinc-500 font-mono">SCALE_4PT</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Spacing Scale (AppSpacing)</h4>
                  <div className="space-y-1.5">
                    {[
                      { key: "AppSpacing.xxs", val: "4.0", desc: "Micro padding (Text to icon)" },
                      { key: "AppSpacing.xs", val: "8.0", desc: "Tag/badge inner margins" },
                      { key: "AppSpacing.sm", val: "12.0", desc: "Elements in cards" },
                      { key: "AppSpacing.md", val: "16.0", desc: "Standard screen layout margins" },
                      { key: "AppSpacing.lg", val: "20.0", desc: "Prominent page titles" }
                    ].map(tok => (
                      <div key={tok.key} className="flex items-center justify-between text-xs border-b border-zinc-800/40 pb-1.5">
                        <span className="font-mono text-blue-400 font-semibold">{tok.key}</span>
                        <div className="text-right">
                          <span className="font-mono font-bold">{tok.val} dp</span>
                          <span className={`text-[10px] ${themeTextSubtle} block`}>{tok.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Border Radius (AppRadius)</h4>
                  <div className="space-y-1.5">
                    {[
                      { key: "AppRadius.xs", val: "2.0", desc: "Micro indicators / badges" },
                      { key: "AppRadius.sm", val: "4.0", desc: "Checkboxes / inline buttons" },
                      { key: "AppRadius.md", val: "8.0", desc: "Standard buttons / text fields" },
                      { key: "AppRadius.lg", val: "12.0", desc: "Content cards / search bars" },
                      { key: "AppRadius.xl", val: "16.0", desc: "Modals / popovers" }
                    ].map(tok => (
                      <div key={tok.key} className="flex items-center justify-between text-xs border-b border-zinc-800/40 pb-1.5">
                        <span className="font-mono text-purple-400 font-semibold">{tok.key}</span>
                        <div className="text-right">
                          <span className="font-mono font-bold">{tok.val} px</span>
                          <span className={`text-[10px] ${themeTextSubtle} block`}>{tok.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${themeCardBg} space-y-3`}>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">Palette Mappings</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: "Background (Obsidian)", hex: "#09090B", color: "bg-[#09090B] text-white border-zinc-800" },
                  { name: "Surface Canvas", hex: "#121214", color: "bg-[#121214] text-white border-zinc-800" },
                  { name: "Surface Elevated", hex: "#1E1E22", color: "bg-[#1E1E22] text-white border-zinc-800" },
                  { name: "Primary Accent", hex: "#2563EB", color: "bg-[#2563EB] text-white" },
                  { name: "Success Emerald", hex: "#10B981", color: "bg-[#10B981] text-white" },
                  { name: "Warning Amber", hex: "#F59E0B", color: "bg-[#F59E0B] text-white" },
                  { name: "Error Crimson", hex: "#EF4444", color: "bg-[#EF4444] text-white" },
                  { name: "Border Outline", hex: "#27272A", color: "bg-zinc-800 text-zinc-400" }
                ].map(c => (
                  <div key={c.name} className={`p-3 rounded-lg border text-xs flex flex-col justify-between h-20 ${c.color}`}>
                    <span className="font-semibold text-[10px] leading-tight">{c.name}</span>
                    <span className="font-mono font-bold text-[10px]">{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "error_handling" && (
          <div className="space-y-6 max-w-4xl">
            <div className={`p-5 rounded-xl border ${themeCardBg} space-y-4`}>
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold font-mono">SEALED RESULT MONAD</span>
              <h3 className="text-lg font-bold tracking-tight">Interactive Monadic Exception Simulator</h3>
              <p className={`text-xs ${themeTextSubtle} leading-relaxed`}>
                Instead of throwing untracked runtime failures that trigger app crashes, VeyloPrep enforces a type-safe <code>Result&lt;Success, Failure&gt;</code> monad pattern in all Data Repositories. Try simulating database round-trips below:
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  disabled={isSimulatingError}
                  onClick={() => simulateRepositoryCall(false)}
                  className="px-4 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Play size={12} />
                  <span>Simulate Success Run</span>
                </button>
                <button
                  disabled={isSimulatingError}
                  onClick={() => simulateRepositoryCall(true)}
                  className="px-4 h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Play size={12} />
                  <span>Simulate Failure Case</span>
                </button>
              </div>

              <div className="border border-zinc-800 rounded-lg overflow-hidden bg-black text-[11px] font-mono">
                <div className="h-8 bg-[#121214] border-b border-zinc-800 px-3 flex items-center justify-between text-zinc-500">
                  <div className="flex items-center space-x-1.5">
                    <Terminal size={12} />
                    <span>dart_repository_debugger.log</span>
                  </div>
                  {isSimulatingError && <RefreshCw size={11} className="animate-spin text-blue-500" />}
                </div>

                <div className="p-4 space-y-2 min-h-[90px]">
                  <span className="text-zinc-500 block">SYSTEM_INIT: Ready for connection tests...</span>
                  <p className={`font-semibold leading-relaxed ${
                    testResult.status === "success" 
                      ? "text-emerald-400" 
                      : testResult.status === "failure" 
                        ? "text-red-400" 
                        : "text-zinc-400"
                  }`}>
                    {testResult.message}
                  </p>
                  
                  {testResult.payload && (
                    <pre className="text-zinc-500 text-[10px] bg-[#0E0E10] p-2 rounded border border-zinc-900 mt-2">
                      {JSON.stringify(testResult.payload, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${themeCardBg} space-y-2`}>
                <h5 className="text-xs font-bold text-red-500 uppercase tracking-wider font-mono">Failure Monad Code Structure</h5>
                <p className={`text-[11px] ${themeTextSubtle} leading-relaxed`}>
                  The repository class catches raw database errors and maps them to concrete Failure states, guaranteeing no unhandled try/catch failures leak to UI controllers.
                </p>
                <div className="bg-black/40 p-2.5 rounded border border-zinc-800/50 text-[10px] font-mono text-zinc-400">
                  <code>
                    return ref.watch(authRepoProvider)<br/>
                    &nbsp;&nbsp;.signIn(email, password)<br/>
                    &nbsp;&nbsp;.fold(<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;onSuccess: (user) =&gt; navigateToDash(),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;onFailure: (fail) =&gt; showToast(fail.message),<br/>
                    &nbsp;&nbsp;);
                  </code>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${themeCardBg} space-y-2`}>
                <h5 className="text-xs font-bold text-yellow-500 uppercase tracking-wider font-mono">Concrete Failure Subclasses</h5>
                <ul className="space-y-1 text-xs font-mono">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>ServerFailure — Gateway timeouts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    <span>DatabaseFailure — RLS rule violations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>AuthFailure — Credentials rejected</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>ValidationFailure — Form input errors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
