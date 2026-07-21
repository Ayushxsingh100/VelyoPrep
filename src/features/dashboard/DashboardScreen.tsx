import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Check, ChevronRight, FileText, Briefcase, Calendar, 
  AlertTriangle, Code, MessageSquare, Award, Compass,
  Clock
} from "lucide-react";

const getCompanyLogo = (companyName: string, isDark: boolean) => {
  const firstLetter = companyName.charAt(0).toUpperCase();
  const lower = companyName.toLowerCase();

  let bgClass = isDark ? "bg-[#18181C] border-white/[0.04] text-zinc-300" : "bg-zinc-100 border-zinc-200/85 text-zinc-700";
  let logoContent = <span className="font-semibold text-[15px] tracking-tight">{firstLetter}</span>;

  if (lower.includes("stripe")) {
    bgClass = "bg-[#635BFF]/10 border-[#635BFF]/20 text-[#635BFF]";
  } else if (lower.includes("google")) {
    bgClass = isDark ? "bg-zinc-950 border-white/5" : "bg-zinc-100 border-zinc-200";
    logoContent = (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    );
  } else if (lower.includes("apple")) {
    bgClass = isDark ? "bg-zinc-100/10 border-white/10 text-white" : "bg-zinc-100 border-zinc-200 text-zinc-900";
    logoContent = (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
      </svg>
    );
  } else if (lower.includes("netflix")) {
    bgClass = "bg-[#E50914]/10 border-[#E50914]/20 text-[#E50914]";
  } else if (lower.includes("meta") || lower.includes("facebook")) {
    bgClass = "bg-[#0668E1]/10 border-[#0668E1]/20 text-[#0668E1]";
  }

  return (
    <div className={`w-10 h-10 rounded-full border ${bgClass} flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-180`}>
      {logoContent}
    </div>
  );
};

const getTaskStyle = (task: any, isChecked: boolean, isDark: boolean) => {
  if (isChecked) {
    return {
      label: "Completed",
      icon: <Check size={11} className={`stroke-[3] ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />,
      glowClass: isDark ? "text-zinc-500" : "text-zinc-400"
    };
  }
  const type = (task.type || "").toLowerCase();
  const title = (task.title || "").toLowerCase();

  if (type.includes("interview") || title.includes("interview")) {
    return {
      label: "Interview",
      icon: <MessageSquare size={11} className={isDark ? "text-blue-400" : "text-blue-600"} />,
      glowClass: isDark ? "text-blue-400 drop-shadow-[0_0_4px_rgba(96,165,250,0.5)]" : "text-blue-600 font-semibold"
    };
  }
  if (type.includes("coding test") || title.includes("coding") || title.includes("test")) {
    return {
      label: "Coding",
      icon: <Code size={11} className={isDark ? "text-purple-400" : "text-purple-600"} />,
      glowClass: isDark ? "text-purple-400 drop-shadow-[0_0_4px_rgba(192,132,252,0.5)]" : "text-purple-600 font-semibold"
    };
  }
  if (type.includes("assessment") || title.includes("assessment") || type.includes("oa")) {
    return {
      label: "Assessment",
      icon: <FileText size={11} className={isDark ? "text-amber-400" : "text-amber-600"} />,
      glowClass: isDark ? "text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" : "text-amber-700 font-semibold"
    };
  }
  if (type.includes("offer") || title.includes("offer")) {
    return {
      label: "Offer",
      icon: <Award size={11} className={isDark ? "text-emerald-400" : "text-emerald-600"} />,
      glowClass: isDark ? "text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]" : "text-emerald-600 font-semibold"
    };
  }
  if (type.includes("deadline") || title.includes("due") || title.includes("deadline")) {
    return {
      label: "Deadline",
      icon: <Calendar size={11} className={isDark ? "text-orange-400" : "text-orange-600"} />,
      glowClass: isDark ? "text-orange-400 drop-shadow-[0_0_4px_rgba(251,146,60,0.5)]" : "text-orange-600 font-semibold"
    };
  }
  return {
    label: task.type || "Milestone",
    icon: <Compass size={11} className={isDark ? "text-zinc-400" : "text-zinc-500"} />,
    glowClass: isDark ? "text-zinc-400 drop-shadow-[0_0_3px_rgba(255,255,255,0.15)]" : "text-zinc-500 font-semibold"
  };
};

interface DashboardScreenProps {
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
          showToast(`Opened Resume Vault for ${latest.name}`, "info");
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
          showToast(`Resuming details for ${latestApp.company}`, "info");
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
    if (hour < 12) return "Good morning, Ayush";
    if (hour < 17) return "Good afternoon, Ayush";
    return "Good evening, Ayush";
  };

  const getDayLabel = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
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
        icon: <Briefcase size={12} className="text-blue-400/70" />,
        iconBg: "bg-blue-500/[0.03]",
        iconBorder: "border-blue-500/[0.10]",
        textClass: "text-blue-400/70",
        glowColor: "rgba(59,130,246,0.15)"
      },
      {
        id: "OA" as const,
        label: "Assessment",
        subtitle: "Technical tests",
        count: countOA,
        icon: <Code size={12} className="text-amber-400/70" />,
        iconBg: "bg-amber-500/[0.03]",
        iconBorder: "border-amber-500/[0.10]",
        textClass: "text-amber-400/70",
        glowColor: "rgba(245,158,11,0.15)"
      },
      {
        id: "Interview" as const,
        label: "Interview",
        subtitle: "Live discussions",
        count: countInterview,
        icon: <MessageSquare size={12} className="text-purple-400/70" />,
        iconBg: "bg-purple-500/[0.03]",
        iconBorder: "border-purple-500/[0.10]",
        textClass: "text-purple-400/70",
        glowColor: "rgba(168,85,247,0.15)"
      },
      {
        id: "Offer" as const,
        label: "Offers",
        subtitle: "Final wins",
        count: countOffer,
        icon: <Award size={12} className="text-emerald-400/70" />,
        iconBg: "bg-emerald-500/[0.03]",
        iconBorder: "border-emerald-500/[0.10]",
        textClass: "text-emerald-400/70",
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
      className={`space-y-4 pb-6 selection:bg-blue-500/10 font-sans max-w-lg mx-auto px-2.5 relative ${isDark ? 'text-[#FFFFFF]' : 'text-zinc-950'}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.01)_0%,transparent_65%)] pointer-events-none -z-10" />

      {/* GREETING HEADER */}
      <motion.div variants={itemVariants} className="pt-2 flex flex-col space-y-1">
        <h1 className={`text-[18px] font-semibold tracking-wide leading-snug ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
          {getGreeting()}
        </h1>
        <p 
          onClick={() => {
            setSimulateFailure(!simulateFailure);
            showToast(simulateFailure ? "System is back online" : "System simulation: Sandbox Mode", "info");
          }}
          className={`text-[10px] transition-colors cursor-pointer select-none font-normal tracking-widest uppercase leading-none mt-1 ${isDark ? 'text-zinc-500 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          {getDayLabel()}
        </p>
      </motion.div>

      {systemStatus.error ? (
        <motion.div 
          variants={itemVariants}
          className={`p-4 rounded-[18px] border text-center space-y-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
            isDark ? 'bg-[#111113] border-red-500/15' : 'bg-red-50/60 border-red-200'
          }`}
        >
          <div className="w-[28px] h-[28px] rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto animate-pulse">
            <AlertTriangle size={13} />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-red-500 tracking-widest uppercase">Sandbox Active</h4>
            <p className={`text-[11px] mt-0.5 leading-relaxed max-w-xs mx-auto font-sans ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {systemStatus.error} Running offline mode securely.
            </p>
          </div>
          <button 
            onClick={() => {
              setSimulateFailure(false);
              showToast("System connected successfully", "success");
            }}
            className={`px-3 h-[28px] rounded-full text-[10px] font-semibold tracking-widest uppercase transition-all duration-[120ms] cursor-pointer ${
              isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            Connect Layer
          </button>
        </motion.div>
      ) : (
        <>
          {/* TODAY'S PRIORITY CARD */}
          <motion.div variants={itemVariants} className="space-y-2 relative">
            <h2 className={`text-[10px] font-medium uppercase tracking-widest select-none pl-1 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Today's priority
            </h2>
            <div className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/[0.03] to-indigo-500/[0.03] rounded-[18px] blur-sm opacity-60 group-hover:opacity-100 transition duration-300 pointer-events-none" />
              
              <motion.div 
                whileHover={{ y: -2, scale: 1.005 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onClick={todayPriority.action}
                className={`relative overflow-hidden p-4 rounded-[18px] border cursor-pointer flex items-center justify-between w-full ${
                  isDark 
                    ? "bg-[#111113] border-white/[0.015] shadow-[0_8px_30px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.015)]" 
                    : "bg-white border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                }`}
              >
                {isDark && <div className="absolute top-0 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/[0.05] to-transparent pointer-events-none" />}
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.005)_0%,transparent_75%)] pointer-events-none -z-10" />

                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {getCompanyLogo(todayPriority.company, isDark)}
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <h3 className={`text-[14px] font-semibold tracking-normal leading-snug truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                      {todayPriority.company}
                    </h3>
                    <span className={`text-[11.5px] font-normal mt-0.5 block leading-none truncate tracking-wide ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {todayPriority.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-4">
                  <span className={`text-[9.5px] tracking-widest font-mono font-bold uppercase select-none ${
                    todayPriority.statusType === "Interview" ? (isDark ? "text-blue-400 drop-shadow-[0_0_4px_rgba(96,165,250,0.55)]" : "text-blue-600") :
                    todayPriority.statusType === "Assessment" ? (isDark ? "text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.55)]" : "text-amber-600") :
                    todayPriority.statusType === "Offer" ? (isDark ? "text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.55)]" : "text-emerald-600") :
                    (isDark ? "text-zinc-400" : "text-zinc-500")
                  }`}>
                    {todayPriority.statusType === "Default" ? "Companion" : todayPriority.statusType}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-all duration-180 border ${
                    isDark ? "bg-white/[0.015] border-white/[0.015]" : "bg-zinc-50 border-zinc-200"
                  }`}>
                    <ChevronRight size={11} className={`${isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-600'} transition-colors`} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* PLACEMENT JOURNEY PIPELINE */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex justify-between items-baseline px-1">
              <h2 className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest select-none">
                Placement Journey Pipeline
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {funnelStages.map((stage) => {
                const isSelected = selectedFunnelStage === stage.id;
                return (
                  <motion.div
                     key={stage.id}
                     whileHover={{ y: -1.5, scale: 1.005 }}
                     whileTap={{ scale: 0.98 }}
                     transition={{ duration: 0.18, ease: "easeOut" }}
                     onClick={() => {
                       setSelectedFunnelStage(selectedFunnelStage === stage.id ? null : stage.id);
                       showToast(`Filtering funnel by ${stage.label} stage`, "info");
                     }}
                     className={`relative p-3.5 rounded-[16px] border cursor-pointer select-none ${
                       isSelected
                         ? (isDark ? "bg-[#18181b] border-blue-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.6)]" : "bg-blue-50/50 border-blue-200 shadow-[0_4px_16px_rgba(59,130,246,0.06)]")
                         : (isDark ? "bg-[#111113] border-white/[0.015] hover:border-white/[0.03] shadow-[0_4px_24px_rgba(0,0,0,0.5)]" : "bg-white border-zinc-200/80 hover:border-zinc-350 shadow-[0_4px_20px_rgba(0,0,0,0.02)]")
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-1.5 rounded-[10px] ${stage.iconBg} border ${stage.iconBorder} flex items-center justify-center shrink-0`}>
                        {stage.icon}
                      </div>
                      <span className={`text-[16px] font-semibold tracking-normal ${stage.textClass}`}>
                        {stage.count}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div>
                        <h4 className={`text-[11px] font-semibold leading-none tracking-wide ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                          {stage.label}
                        </h4>
                      </div>
                      <ChevronRight 
                        size={11} 
                        className={`text-zinc-600 transition-transform duration-180 ${
                          isSelected ? "rotate-90 text-blue-400/80" : ""
                        }`} 
                      />
                    </div>
                    
                    {isSelected && (
                      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,${stage.glowColor}_0%,transparent_100%)] opacity-[0.02] pointer-events-none rounded-[16px]`} />
                    )}
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
                  <div className={`rounded-[16px] border p-3.5 space-y-2 mt-1 shadow-inner ${
                    isDark ? "bg-[#141416] border-white/[0.015]" : "bg-zinc-50 border-zinc-200/80"
                  }`}>
                    <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-white/[0.03]' : 'border-zinc-200'}`}>
                      <h3 className={`text-[9.5px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-pulse shrink-0" />
                        Active in {funnelStages.find(s => s.id === selectedFunnelStage)?.label} ({selectedStageApplications.length})
                      </h3>
                      <button 
                        onClick={() => setSelectedFunnelStage(null)}
                        className={`text-[9px] font-medium transition-colors cursor-pointer ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-450 hover:text-zinc-700'}`}
                      >
                        Clear filter
                      </button>
                    </div>

                    {selectedStageApplications.length === 0 ? (
                      <p className="text-[10px] text-zinc-500 py-2.5 text-center select-none font-normal">
                        No applications in this stage currently
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {selectedStageApplications.map((app) => (
                          <div 
                            key={app.id}
                            onClick={() => {
                              setCurrentScreen("tracker");
                              showToast(`Viewing details for ${app.company}`, "info");
                            }}
                            className={`flex items-center justify-between p-2 rounded-[10px] border transition-all duration-180 cursor-pointer group ${
                              isDark 
                                ? "bg-white/[0.005] hover:bg-white/[0.02] border-white/[0.005] hover:border-white/[0.02]" 
                                : "bg-zinc-100/45 hover:bg-zinc-100/80 border-transparent hover:border-zinc-200"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center overflow-hidden text-[9px] font-semibold shrink-0 ${
                                isDark ? "border-white/5 bg-zinc-900 text-zinc-300" : "border-zinc-200 bg-zinc-200/80 text-zinc-700"
                              }`}>
                                {app.company.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h4 className={`text-[11.5px] font-semibold leading-none truncate transition-colors ${
                                  isDark ? "text-zinc-200 group-hover:text-white" : "text-zinc-800 group-hover:text-zinc-950"
                                }`}>
                                  {app.company}
                                </h4>
                                <p className="text-[9px] text-zinc-500 truncate mt-1 leading-none font-normal">
                                  {app.role || "Software Engineer"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[8.5px] font-medium px-2 py-0.5 rounded-md border ${
                                isDark ? "text-zinc-400 bg-zinc-800/40 border-white/[0.03]" : "text-zinc-600 bg-zinc-100 border-zinc-200"
                              }`}>
                                {app.status}
                              </span>
                              <ChevronRight size={10} className="text-zinc-400 group-hover:translate-x-0.5 group-hover:text-zinc-600 transition-all duration-180" />
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
          <motion.div variants={itemVariants} className="space-y-2">
            <h2 className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest select-none pl-1">
              Today's checklist
            </h2>

            <div className={`p-4 rounded-[18px] border divide-y shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${
              isDark 
                ? "bg-[#111113] border-white/[0.015] divide-zinc-800/[0.25] shadow-[0_8px_30px_rgba(0,0,0,0.5)]" 
                : "bg-white border-zinc-200/80 divide-zinc-100"
            }`}>
              {todayChecklist.length === 0 ? (
                <div className="text-[12px] font-normal text-zinc-500 py-5 text-center select-none flex flex-col items-center justify-center space-y-0.5 font-sans">
                  <span className="text-zinc-400 font-medium text-[12px] tracking-wide">All checklists completed</span>
                  <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Your schedule is clear</span>
                </div>
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
                      className="flex items-center justify-between py-3 first:pt-1 last:pb-1 transition-all duration-180 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <button 
                          onClick={() => handleToggleTaskWithDelay(task.id)}
                          disabled={completingId !== null}
                          className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center transition-all duration-[150ms] shrink-0 cursor-pointer ${
                            isChecked 
                              ? "border-emerald-500/30 bg-emerald-500/[0.08]" 
                              : isDark 
                                ? "border-zinc-800 hover:border-zinc-600 bg-zinc-950 hover:bg-zinc-900/30"
                                : "border-zinc-300 hover:border-zinc-400 bg-zinc-50 hover:bg-zinc-100/50"
                          }`}
                        >
                          <Check 
                            size={10} 
                            className={`text-emerald-500 transition-all duration-[150ms] ${
                              isChecked ? "scale-100 opacity-100" : "scale-50 opacity-0"
                            }`} 
                          />
                        </button>

                        <div className="flex flex-col min-w-0">
                          <span className={`text-[12.5px] relative transition-all duration-180 truncate max-w-[240px] tracking-wide font-sans leading-snug ${
                            isChecked 
                              ? "text-zinc-500 font-normal line-through" 
                              : isDark ? "text-zinc-100 font-medium" : "text-zinc-800 font-medium"
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
                            <span className={`text-[9.5px] flex items-center gap-1.5 mt-1 font-mono tracking-widest uppercase select-none font-medium ${taskStyle.glowClass}`}>
                              {taskStyle.icon}
                              <span>{taskStyle.label}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {!isChecked && task.dueDate && (
                        <div className="flex items-center gap-1.5 pl-3 select-none text-right shrink-0">
                          <Clock size={7.5} className="text-zinc-600 group-hover:text-zinc-400 transition-colors duration-150" />
                          <span className="text-[7px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors duration-150 tracking-wide font-sans">
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
          <motion.div variants={itemVariants} className="space-y-2">
            <h2 className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest select-none pl-1">
              Continue where you left off
            </h2>

            <motion.div 
              whileHover={{ y: -1.5, scale: 1.005 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={lastInteractedItem.action}
              className={`relative overflow-hidden p-3 rounded-[18px] border cursor-pointer flex items-center justify-between group ${
                isDark 
                  ? "bg-[#111113] border-white/[0.015] shadow-[0_8px_30px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.015)]" 
                  : "bg-white border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isDark ? "bg-zinc-900 border-white/[0.015]" : "bg-zinc-50 border-zinc-200"
                }`}>
                  {lastInteractedItem.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className={`text-[12.5px] font-semibold tracking-wide truncate font-sans ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
                    {lastInteractedItem.title}
                  </h4>
                </div>
              </div>

              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-all duration-180 border ${
                isDark ? "bg-white/[0.015] border-white/[0.015]" : "bg-zinc-50 border-zinc-200"
              }`}>
                <ChevronRight size={11} className={`${isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-600'} transition-colors`} />
              </div>
            </motion.div>
          </motion.div>

          {/* PRIMARY CTA */}
          <motion.div variants={itemVariants} className="pt-1">
            <motion.button
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                setActiveBottomSheet({ type: "add_app" });
                showToast("Logging new placement item", "info");
              }}
              className={`w-full h-11 rounded-[18px] flex items-center justify-center gap-1.5 text-[11.5px] font-semibold tracking-wider transition-all cursor-pointer shadow-lg ${
                isDark 
                  ? "bg-white hover:bg-zinc-100 text-black shadow-white/[0.02]" 
                  : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-950/10"
              }`}
            >
              <Plus size={14} className="stroke-[3.5]" />
              <span>Add Application</span>
            </motion.button>
          </motion.div>
        </>
      )}

    </motion.div>
  );
};
