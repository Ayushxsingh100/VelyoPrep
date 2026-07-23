import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Check, ChevronRight, FileText, Briefcase, Calendar, 
  AlertTriangle, Code, MessageSquare, Award, Compass,
  Clock, Settings
} from "lucide-react";
import { CompanyLogo } from "../../shared/components";

const getTaskStyle = (task: any, isChecked: boolean, isDark: boolean) => {
  if (isChecked) {
    return {
      label: "Completed",
      icon: <Check size={10} className={`stroke-[3.5] ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />,
      badgeClass: isDark ? "bg-zinc-850/40 border-zinc-800/30 text-zinc-500" : "bg-zinc-100 border-zinc-200 text-zinc-400"
    };
  }
  const type = (task.type || "").toLowerCase();
  const title = (task.title || "").toLowerCase();

  if (type.includes("interview") || title.includes("interview")) {
    return {
      label: "Interview",
      icon: <MessageSquare size={10} className={isDark ? "text-blue-400" : "text-blue-600"} />,
      badgeClass: isDark ? "bg-blue-500/[0.07] border-blue-500/[0.16] text-blue-400" : "bg-blue-50 border-blue-200/60 text-blue-700"
    };
  }
  if (type.includes("coding test") || title.includes("coding") || title.includes("test")) {
    return {
      label: "Coding",
      icon: <Code size={10} className={isDark ? "text-purple-400" : "text-purple-600"} />,
      badgeClass: isDark ? "bg-purple-500/[0.07] border-purple-500/[0.16] text-purple-400" : "bg-purple-50 border-purple-200/60 text-purple-700"
    };
  }
  if (type.includes("assessment") || title.includes("assessment") || type.includes("oa")) {
    return {
      label: "Assessment",
      icon: <FileText size={10} className={isDark ? "text-amber-400" : "text-amber-600"} />,
      badgeClass: isDark ? "bg-amber-500/[0.07] border-amber-500/[0.16] text-amber-400" : "bg-amber-50 border-amber-200/60 text-amber-700"
    };
  }
  if (type.includes("offer") || title.includes("offer")) {
    return {
      label: "Offer",
      icon: <Award size={10} className={isDark ? "text-emerald-400" : "text-emerald-600"} />,
      badgeClass: isDark ? "bg-emerald-500/[0.07] border-emerald-500/[0.16] text-emerald-400" : "bg-emerald-50 border-emerald-200/60 text-emerald-700"
    };
  }
  if (type.includes("deadline") || title.includes("due") || title.includes("deadline")) {
    return {
      label: "Deadline",
      icon: <Calendar size={10} className={isDark ? "text-orange-400" : "text-orange-600"} />,
      badgeClass: isDark ? "bg-orange-500/[0.07] border-orange-500/[0.16] text-orange-400" : "bg-orange-50 border-orange-200/60 text-orange-700"
    };
  }
  return {
    label: task.type || "Milestone",
    icon: <Compass size={10} className={isDark ? "text-zinc-400" : "text-zinc-500"} />,
    badgeClass: isDark ? "bg-zinc-800/40 border-zinc-700/30 text-zinc-450" : "bg-zinc-100 border-zinc-200 text-zinc-600"
  };
};

interface DashboardScreenProps {
  userName: string;
  applications: any[];
  setApplications: React.Dispatch<React.SetStateAction<any[]>>;
  deadlines: any[];
  setDeadlines: React.Dispatch<React.SetStateAction<any[]>>;
  resumes: any[];
  setResumes: React.Dispatch<React.SetStateAction<any[]>>;
  aiCaptureHistory: any[];
  getProfileCompletion: () => number;
  setCurrentScreen: (screen: string) => void;
  setJobPortalSubTab: (tab: "dashboard" | "portals" | "ai_capture" | "saved") => void;
  setVaultSubTab: (tab: "overview" | "personal" | "links" | "resumes" | "documents") => void;
  isDark: boolean;
  themeCardClass: string;
  themeTextSubtle: string;
  themeInputBg: string;
  themeBorderClass: string;
  showToast: (message: string, type: "success" | "warning" | "error" | "info") => void;
  setActiveBottomSheet: (sheet: { type: string } | null) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.01,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName,
  applications,
  deadlines,
  setDeadlines,
  resumes,
  setCurrentScreen,
  showToast,
  setActiveBottomSheet,
  isDark,
}) => {
  const [simulateFailure, setSimulateFailure] = React.useState(false);
  const [selectedFunnelStage, setSelectedFunnelStage] = React.useState<"Applied" | "OA" | "Interview" | "Offer" | null>(null);

  const firstName = useMemo(() => {
    const rawName = (userName || "").trim();
    if (!rawName || rawName.toLowerCase().includes("placement candidate") || rawName.toLowerCase().includes("candidate")) {
      return "Ayush";
    }
    return rawName.split(/\s+/)[0];
  }, [userName]);

  const systemStatus = useMemo(() => {
    if (simulateFailure) {
      return { error: "Local Sandbox Mode Active." };
    }
    return { error: null };
  }, [simulateFailure]);

  const todayPriority = useMemo(() => {
    const interviewApp = applications.find(a => a.status === "Interview");
    if (interviewApp) {
      return {
        contextLabel: "Interview Scheduled",
        company: interviewApp.company,
        role: interviewApp.role || "Software Engineer",
        time: "Interview tomorrow • 09:30 AM",
        statusType: "Interview",
        action: () => {
          setCurrentScreen("tracker");
          showToast(`Opening prep environment for ${interviewApp.company}`, "info");
        }
      };
    }

    const oaApp = applications.find(a => a.status === "OA Scheduled");
    if (oaApp) {
      return {
        contextLabel: "Assessment Due Today",
        company: oaApp.company,
        role: oaApp.role || "Software Engineer",
        time: oaApp.deadline ? `Complete test by ${oaApp.deadline}` : "Assessment pending",
        statusType: "Assessment",
        action: () => {
          setCurrentScreen("tracker");
          showToast(`Opening practice module for ${oaApp.company}`, "info");
        }
      };
    }

    const offerApp = applications.find(a => a.status === "Offer");
    if (offerApp) {
      return {
        contextLabel: "Offer Pending",
        company: offerApp.company,
        role: offerApp.role || "Software Engineer",
        time: "Review agreement and respond",
        statusType: "Offer",
        action: () => {
          setCurrentScreen("tracker");
        }
      };
    }

    const pendingDeadline = deadlines.find(d => !d.completed);
    if (pendingDeadline) {
      return {
        contextLabel: "Upcoming Deadline",
        company: pendingDeadline.company || "PlacementOS Milestone",
        role: pendingDeadline.title,
        time: pendingDeadline.dueDate ? `Due ${pendingDeadline.dueDate}` : "Today",
        statusType: "Deadline",
        action: () => {
          setCurrentScreen("deadlines");
        }
      };
    }

    return {
      contextLabel: "Placement Journey Started",
      company: "PlacementOS Core",
      role: "Log your first placement item",
      time: "Begin tracking to unlock priority tasks",
      statusType: "Default",
      action: () => {
        setActiveBottomSheet({ type: "add_app" });
      }
    };
  }, [applications, deadlines, setCurrentScreen, showToast, setActiveBottomSheet]);

  const [completingId, setCompletingId] = React.useState<string | null>(null);

  const todayChecklist = useMemo(() => {
    return deadlines
      .filter(d => !d.completed || d.id === completingId)
      .slice(0, 3);
  }, [deadlines, completingId]);

  const handleToggleTask = (id: string) => {
    setDeadlines(prev => prev.map(d => {
      if (d.id === id) {
        const nextState = !d.completed;
        showToast(nextState ? "Task complete." : "Task reopened.", "success");
        return { ...d, completed: nextState, updatedAt: new Date().toISOString() };
      }
      return d;
    }));
  };

  const handleToggleTaskWithDelay = (id: string) => {
    setCompletingId(id);
    setTimeout(() => {
      handleToggleTask(id);
      setCompletingId(null);
    }, 600);
  };

  const lastInteractedItem = useMemo(() => {
    if (resumes && resumes.length > 0) {
      const sortedResumes = [...resumes].sort((a, b) => b.id.localeCompare(a.id));
      const latest = sortedResumes[0];
      return {
        type: "Resume Portfolio",
        title: latest.name,
        subtitle: `v${latest.version} • Ready to tailor`,
        icon: <FileText size={14} className="text-[#3B82F6]" />,
        action: () => {
          setCurrentScreen("vault");
        }
      };
    }

    if (applications && applications.length > 0) {
      const latestApp = applications[applications.length - 1];
      return {
        type: "Active Application",
        title: latestApp.company,
        subtitle: `${latestApp.role} • ${latestApp.status}`,
        icon: <Briefcase size={14} className="text-[#3B82F6]" />,
        action: () => {
          setCurrentScreen("tracker");
        }
      };
    }

    return {
      type: "Knowledge Base",
      title: "Design System & Resume",
      subtitle: "Add your resume to enable tailor engines",
      icon: <Calendar size={14} className="text-[#3B82F6]" />,
      action: () => {
        setCurrentScreen("vault");
      }
    };
  }, [resumes, applications, setCurrentScreen, showToast]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getDayLabel = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });
  };

  const funnelStages = useMemo(() => {
    const countApplied = applications.filter(a => !["Wishlist", "Planning"].includes(a.status)).length;
    const countOA = applications.filter(a => ["OA Scheduled", "OA Completed", "Interview", "Offer"].includes(a.status)).length;
    const countInterview = applications.filter(a => ["Interview", "Offer"].includes(a.status)).length;
    const countOffer = applications.filter(a => a.status === "Offer").length;

    return [
      {
        id: "Applied" as const,
        label: "Applied",
        subtitle: "Active submittals",
        count: countApplied,
        icon: <Briefcase size={13} className="text-blue-400" />,
        iconBg: "bg-blue-500/20",
        iconBorder: "border-blue-500/30",
        textClass: "text-blue-400 font-extrabold",
        glowColor: "rgba(59,130,246,0.15)"
      },
      {
        id: "OA" as const,
        label: "Assessment",
        subtitle: "Technical tests",
        count: countOA,
        icon: <Code size={13} className="text-amber-400" />,
        iconBg: "bg-amber-500/20",
        iconBorder: "border-amber-500/30",
        textClass: "text-amber-400 font-extrabold",
        glowColor: "rgba(245,158,11,0.15)"
      },
      {
        id: "Interview" as const,
        label: "Interview",
        subtitle: "Live discussions",
        count: countInterview,
        icon: <MessageSquare size={13} className="text-purple-400" />,
        iconBg: "bg-purple-500/20",
        iconBorder: "border-purple-500/30",
        textClass: "text-purple-400 font-extrabold",
        glowColor: "rgba(168,85,247,0.15)"
      },
      {
        id: "Offer" as const,
        label: "Offers",
        subtitle: "Final wins",
        count: countOffer,
        icon: <Award size={13} className="text-emerald-400" />,
        iconBg: "bg-emerald-500/20",
        iconBorder: "border-emerald-500/30",
        textClass: "text-emerald-400 font-extrabold",
        glowColor: "rgba(16,185,129,0.15)"
      }
    ];
  }, [applications]);

  const selectedStageApplications = useMemo(() => {
    if (!selectedFunnelStage) return [];
    if (selectedFunnelStage === "Applied") {
      return applications.filter(a => a.status === "Applied");
    }
    if (selectedFunnelStage === "OA") {
      return applications.filter(a => ["OA Scheduled", "OA Completed"].includes(a.status));
    }
    if (selectedFunnelStage === "Interview") {
      return applications.filter(a => a.status === "Interview");
    }
    if (selectedFunnelStage === "Offer") {
      return applications.filter(a => a.status === "Offer");
    }
    return [];
  }, [applications, selectedFunnelStage]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`space-y-6 selection:bg-blue-500/10 font-sans relative ${isDark ? 'text-[#FFFFFF]' : 'text-zinc-950'}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.01)_0%,transparent_65%)] pointer-events-none -z-10" />

      {/* GREETING HEADER */}
      <motion.div variants={itemVariants} className="pt-6 pb-4 flex items-start justify-between relative text-left">
        <div className="flex flex-col space-y-1 pr-12">
          <h1 className={`text-[34px] font-extrabold tracking-tight leading-[1.1] ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {getGreeting()},<br />
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
              {firstName}
            </span> 👋
          </h1>
          <span 
            onClick={() => {
              setSimulateFailure(!simulateFailure);
              showToast(simulateFailure ? "System is back online" : "System simulation: Sandbox Mode", "info");
            }}
            className={`text-sm mt-2 transition-colors cursor-pointer select-none font-semibold ${isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            {getDayLabel()}
          </span>
        </div>
        <button 
          onClick={() => {
            setCurrentScreen("settings");
          }} 
          className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 ${
            isDark 
              ? "bg-gradient-to-b from-[#1A1A1E] to-[#121214] border-[#2D2D32] text-zinc-455 hover:text-white hover:border-zinc-700" 
              : "bg-white border-zinc-200 text-zinc-655 hover:text-zinc-950 shadow-sm"
          }`}
        >
          <Settings size={18} strokeWidth={1.75} />
        </button>
      </motion.div>

      {systemStatus.error ? (
        <motion.div 
          variants={itemVariants}
          className={`p-6 rounded-[24px] border text-center space-y-4 shadow-lg ${
            isDark ? 'bg-[#121214] border-red-500/20' : 'bg-red-50/60 border-red-200'
          }`}
        >
          <div className="w-[34px] h-[34px] rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto animate-pulse">
            <AlertTriangle size={16} />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-red-550 tracking-widest uppercase font-mono">Sandbox Active</h4>
            <p className={`text-xs mt-1.5 leading-relaxed max-w-xs mx-auto font-sans font-semibold ${isDark ? 'text-zinc-400' : 'text-zinc-655'}`}>
              {systemStatus.error} Running offline mode securely.
            </p>
          </div>
          <button 
            onClick={() => {
              setSimulateFailure(false);
              showToast("System connected successfully", "success");
            }}
            className={`px-4.5 h-[34px] rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-[120ms] cursor-pointer active:scale-95 ${
              isDark ? 'bg-white text-black hover:bg-zinc-200 shadow-sm' : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            Connect Layer
          </button>
        </motion.div>
      ) : (
        <>
          {/* TODAY'S PRIORITY CARD */}
          <motion.div variants={itemVariants} className="space-y-3 relative text-left">
            <h2 className="text-[11px] font-semibold text-zinc-555 dark:text-zinc-500 uppercase tracking-wider px-1 leading-none select-none">
              Today's Priority
            </h2>
            <div className="relative group">
              <motion.div 
                whileHover={{ y: -2, scale: 1.003 }}
                whileTap={{ scale: 0.95, opacity: 0.85 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onClick={todayPriority.action}
                className={`relative overflow-hidden p-6 rounded-[22px] border cursor-pointer flex items-center justify-between w-full transition-all duration-200 ${
                  isDark 
                    ? "bg-gradient-to-b from-[#1A1A1E] to-[#121214] border-[#2D2D32] hover:from-[#202025] hover:to-[#151518] shadow-[0_12px_32px_rgba(0,0,0,0.7)]" 
                    : "bg-white border-zinc-250/50 hover:border-zinc-300 hover:bg-zinc-50/30 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.03)]"
                }`}
              >
                {isDark && <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />}
                
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <CompanyLogo companyName={todayPriority.company} isDark={isDark} sizeClasses="w-14 h-14 text-xl font-bold" />
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <h3 className={`text-[16px] font-extrabold tracking-tight leading-snug truncate ${isDark ? 'text-white' : 'text-zinc-955'}`}>
                      {todayPriority.company}
                    </h3>
                    <span className={`text-[13px] font-semibold mt-1 block leading-none truncate tracking-wide ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                      {todayPriority.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 shrink-0 ml-4">
                  <span className={`text-[10px] tracking-wider font-sans font-bold uppercase select-none px-3.5 py-1 rounded-full border leading-none ${
                    todayPriority.statusType === "Interview" ? (isDark ? "bg-blue-500/[0.08] border-blue-500/[0.18] text-blue-400" : "bg-blue-50 border-blue-200/60 text-blue-700") :
                    todayPriority.statusType === "Assessment" ? (isDark ? "bg-amber-500/[0.08] border-amber-500/[0.18] text-amber-400" : "bg-amber-50 border-amber-200/60 text-amber-700") :
                    todayPriority.statusType === "Offer" ? (isDark ? "bg-emerald-500/[0.08] border-emerald-500/[0.18] text-[#10B981] bg-[#04261C]" : "bg-emerald-50 border-emerald-200/60 text-emerald-700") :
                    (isDark ? "bg-zinc-800/40 border-zinc-750 text-zinc-450" : "bg-zinc-100 border-zinc-250 text-zinc-600")
                  }`}>
                    {todayPriority.statusType === "Default" ? "Companion" : todayPriority.statusType}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-300" : "bg-zinc-50 border-zinc-200 text-zinc-455"
                  }`}>
                    <ChevronRight size={14} className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* PLACEMENT JOURNEY PIPELINE */}
          <motion.div variants={itemVariants} className="space-y-3 text-left">
            <div className="flex justify-between items-baseline">
              <h2 className="text-[11px] font-semibold text-zinc-555 dark:text-zinc-400 uppercase tracking-wider px-1 leading-none select-none">
                Placement Journey Pipeline
              </h2>
            </div>
 
            <div className="grid grid-cols-2 gap-3.5">
              {funnelStages.map((stage) => {
                const isSelected = selectedFunnelStage === stage.id;
                return (
                  <motion.div
                     key={stage.id}
                     whileHover={{ y: -1.5, scale: 1.003 }}
                     whileTap={{ scale: 0.95, opacity: 0.85 }}
                     transition={{ duration: 0.15, ease: "easeOut" }}
                     onClick={() => {
                       setSelectedFunnelStage(selectedFunnelStage === stage.id ? null : stage.id);
                       showToast(`Filtering funnel by ${stage.label} stage`, "info");
                     }}
                     className={`relative p-5 rounded-[22px] border cursor-pointer select-none transition-all duration-200 ${
                       isSelected
                         ? (isDark ? "bg-[#1A1A1F] border-blue-500/50 hover:bg-[#202025] shadow-[0_12px_24px_rgba(0,0,0,0.4)]" : "bg-blue-50/80 border-blue-300 shadow-sm")
                         : (isDark 
                             ? "bg-gradient-to-b from-[#1A1A1E] to-[#121214] border-[#2D2D32] hover:from-[#202025] hover:to-[#151518] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)]" 
                             : "bg-white border-zinc-200/50 hover:border-zinc-350/85 hover:bg-zinc-50/30 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.03)]")
                       }`}
                  >
                    {isDark && <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />}
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${stage.iconBg} border ${stage.iconBorder} flex items-center justify-center shrink-0`}>
                        {stage.icon}
                      </div>
                      <span className={`text-[19px] font-extrabold tracking-normal ${stage.textClass} font-sans`}>
                        {stage.count.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <h4 className={`text-[15px] font-bold leading-none tracking-wide ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                          {stage.label}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-semibold block mt-1.5 leading-none">{stage.subtitle}</span>
                      </div>
                      <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center border shrink-0 ${
                        isDark ? "border-[#3E3E42] bg-[#242428] text-zinc-300" : "border-zinc-200 bg-zinc-50 text-zinc-400"
                      }`}>
                        <ChevronRight 
                          size={12} 
                          className={`transition-transform duration-180 ${
                            isSelected ? "rotate-90 text-blue-500" : ""
                          }`} 
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedFunnelStage && (
                <motion.div
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className={`rounded-2xl border p-5 space-y-3.5 mt-3 shadow-inner ${
                    isDark ? "bg-[#121214] border-zinc-800" : "bg-zinc-50 border-zinc-200/80"
                  }`}>
                    <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <h3 className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-650'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                        Active in {funnelStages.find(s => s.id === selectedFunnelStage)?.label} ({selectedStageApplications.length})
                      </h3>
                      <button 
                        onClick={() => setSelectedFunnelStage(null)}
                        className={`text-xs font-bold transition-colors cursor-pointer ${isDark ? 'text-zinc-550 hover:text-zinc-350' : 'text-zinc-500 hover:text-zinc-700'}`}
                      >
                        Clear filter
                      </button>
                    </div>

                    {selectedStageApplications.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-2 text-center select-none font-semibold">
                        No applications in this stage currently
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {selectedStageApplications.map((app) => (
                          <div 
                            key={app.id}
                            onClick={() => {
                              setCurrentScreen("tracker");
                              showToast(`Viewing details for ${app.company}`, "info");
                            }}
                            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-180 cursor-pointer group ${
                              isDark 
                                ? "bg-zinc-900 hover:bg-zinc-850 border-zinc-800" 
                                : "bg-white hover:bg-zinc-50 border-zinc-200"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden text-xs font-bold shrink-0 ${
                                isDark ? "border-zinc-800 bg-zinc-950 text-zinc-300" : "border-zinc-200 bg-zinc-100 text-zinc-700"
                              }`}>
                                {app.company.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h4 className={`text-sm font-bold leading-none truncate ${
                                  isDark ? "text-zinc-200 group-hover:text-white" : "text-zinc-800 group-hover:text-zinc-950"
                                }`}>
                                  {app.company}
                                </h4>
                                <p className="text-xs text-zinc-500 truncate mt-1.5 leading-none font-semibold">
                                  {app.role || "Software Engineer"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                                isDark ? "text-zinc-400 bg-zinc-800/40 border-zinc-800" : "text-zinc-650 bg-zinc-100 border-zinc-200"
                              }`}>
                                {app.status}
                              </span>
                              <ChevronRight size={12} className="text-zinc-550 group-hover:translate-x-0.5 group-hover:text-zinc-300 transition-all duration-180" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* TODAY'S CHECKLIST */}
          <motion.div variants={itemVariants} className="space-y-3 text-left">
            <h2 className="text-[11px] font-semibold text-zinc-555 dark:text-zinc-500 uppercase tracking-wider px-1 leading-none select-none">
              Today's Checklist
            </h2>

            <div className={`relative p-6 rounded-[22px] border divide-y transition-all duration-200 ${
              isDark 
                ? "bg-gradient-to-b from-[#1A1A1E] to-[#121214] border-[#2D2D32] divide-[#2D2D32]/[0.4] shadow-[0_12px_32px_rgba(0,0,0,0.7)]" 
                : "bg-white border-zinc-200/80 divide-zinc-100 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.03)]"
            }`}>
              
              {todayChecklist.length === 0 ? (
                <motion.div 
                  whileHover={{ scale: 1.002 }}
                  whileTap={{ scale: 0.96, opacity: 0.85 }}
                  onClick={() => showToast("All checklists up to date", "success")}
                  className="flex items-center justify-between py-1 cursor-pointer w-full text-left"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Double green ring success indicator */}
                    <div className="w-13 h-13 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-sm shadow-emerald-500/30">
                        <Check size={16} strokeWidth={3.5} />
                      </div>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-[15px] font-extrabold tracking-tight truncate ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                        All checklists completed
                      </h4>
                      <p className={`text-xs font-semibold truncate mt-1 leading-none ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
                        Your schedule is clear for today
                      </p>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-300" : "bg-zinc-50 border-zinc-200 text-zinc-400"
                  }`}>
                    <ChevronRight size={14} className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'}`} />
                  </div>
                </motion.div>
              ) : (
                todayChecklist.map((task) => {
                  const isChecked = task.id === completingId;
                  const taskStyle = getTaskStyle(task, isChecked, isDark);

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: isChecked ? 0.4 : 1, y: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      key={task.id} 
                      className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 transition-all duration-180 group text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button 
                          onClick={() => handleToggleTaskWithDelay(task.id)}
                          disabled={completingId !== null}
                          className={`w-[22px] h-[22px] rounded-[6px] border flex items-center justify-center transition-all duration-[150ms] shrink-0 cursor-pointer ${
                            isChecked 
                              ? "border-emerald-500/30 bg-emerald-500/[0.08]" 
                              : isDark 
                                ? "border-zinc-800 hover:border-zinc-655 bg-zinc-900 hover:bg-zinc-800/30"
                                : "border-zinc-300 hover:border-zinc-450 bg-zinc-50 hover:bg-zinc-100/50"
                          }`}
                        >
                          <Check 
                            size={12} 
                            className={`text-emerald-500 transition-all duration-[150ms] ${
                              isChecked ? "scale-100 opacity-100" : "scale-50 opacity-0"
                            }`} 
                          />
                        </button>

                        <div className="flex flex-col min-w-0 flex-1">
                          <span className={`text-[13.5px] relative transition-all duration-180 truncate block w-full tracking-wide font-bold leading-snug ${
                            isChecked 
                              ? "text-zinc-555 font-semibold line-through" 
                              : isDark ? "text-zinc-100 font-bold" : "text-zinc-950 font-bold"
                          }`}>
                            {task.title}
                            {isChecked && (
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.22, ease: "easeOut" }}
                                className="absolute left-0 top-[50%] h-[1px] bg-zinc-600"
                              />
                            )}
                          </span>
                          {!isChecked && (
                            <div className="mt-1.5">
                              <span className={`text-[9px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full border select-none font-bold font-sans tracking-wider uppercase ${taskStyle.badgeClass}`}>
                                {taskStyle.icon}
                                <span>{taskStyle.label}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {!isChecked && task.dueDate && (
                        <div className="flex items-center gap-2 pl-3 select-none text-right shrink-0">
                          <Clock size={10.5} className="text-zinc-550 group-hover:text-zinc-450 transition-colors duration-150" />
                          <span className="text-[9px] font-bold text-zinc-500 group-hover:text-zinc-350 transition-colors duration-150 tracking-wider font-sans">
                            {task.dueDate}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* CONTINUE WHERE YOU LEFT OFF */}
          <motion.div variants={itemVariants} className="space-y-3 text-left">
            <h2 className="text-[11px] font-semibold text-zinc-555 dark:text-zinc-500 uppercase tracking-wider px-1 leading-none select-none">
              Continue Where You Left Off
            </h2>

            <motion.div 
              whileHover={{ y: -1.5, scale: 1.003 }}
              whileTap={{ scale: 0.95, opacity: 0.85 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={lastInteractedItem.action}
              className={`relative overflow-hidden p-6 rounded-[22px] border cursor-pointer flex items-center justify-between group transition-all duration-200 ${
                isDark 
                  ? "bg-gradient-to-b from-[#1A1A1E] to-[#121214] border-[#2D2D32] hover:from-[#202025] hover:to-[#151518] shadow-[0_12px_32px_rgba(0,0,0,0.7)]" 
                  : "bg-white border-zinc-200/50 hover:border-zinc-350/80 hover:bg-zinc-50/30 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.03)]"
              }`}
            >
              {isDark && <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={`w-10.5 h-10.5 rounded-xl flex items-center justify-center shrink-0 border ${
                  isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-400" : "bg-zinc-50 border-zinc-250/85"
                }`}>
                  {lastInteractedItem.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-zinc-505 dark:text-zinc-400 font-sans uppercase block leading-none mb-1.5">{lastInteractedItem.type}</span>
                  <h4 className={`text-[14.5px] font-extrabold tracking-tight truncate ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                    {lastInteractedItem.title}
                  </h4>
                  <p className={`text-xs font-semibold truncate mt-1 leading-none ${isDark ? 'text-zinc-350' : 'text-zinc-600'}`}>{lastInteractedItem.subtitle}</p>
                </div>
              </div>

              <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 border ${
                isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-400"
              }`}>
                <ChevronRight size={13} className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'}`} />
              </div>
            </motion.div>
          </motion.div>

          {/* PRIMARY CTA */}
          <motion.div variants={itemVariants} className="pt-2">
            <motion.button
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveBottomSheet({ type: "add_app" });
                showToast("Logging new placement item", "info");
              }}
              className={`w-full h-13 rounded-[16px] flex items-center justify-center gap-2 text-sm font-bold tracking-wider transition-all cursor-pointer shadow-lg active:scale-98 ${
                isDark 
                  ? "bg-white hover:bg-zinc-100 text-black shadow-md shadow-white/5" 
                  : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-md shadow-zinc-950/10"
              }`}
            >
              <Plus size={16} className="stroke-[3.5]" />
              <span>Add Application</span>
            </motion.button>
          </motion.div>
        </>
      )}

    </motion.div>
  );
};
