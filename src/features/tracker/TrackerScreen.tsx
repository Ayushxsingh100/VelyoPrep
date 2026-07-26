import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Search, Trash2, ArrowLeft, ExternalLink, HelpCircle,
  ChevronRight, Share2, Archive, MoreHorizontal, Edit, Check,
  X, MapPin, DollarSign, Globe, Link, Clock, Calendar
} from "lucide-react";
import { CompanyLogo } from "../../shared/components";

const getTimelineActiveIndex = (status: string) => {
  const s = status.toLowerCase();
  if (s === "wishlist" || s === "planning") return 0;
  if (s === "applied") return 1;
  if (s.includes("oa") || s.includes("assessment")) return 2;
  if (s === "interview") return 3;
  if (s === "offer") return 4;
  return -1;
};

const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  if (s === "wishlist" || s === "planning") {
    return {
      bg: "bg-zinc-500/[0.05] border-zinc-500/[0.08] text-zinc-500 dark:text-zinc-400",
      label: "Wishlist"
    };
  }
  if (s === "applied") {
    return {
      bg: "bg-blue-500/[0.05] border-blue-500/[0.08] text-blue-500 dark:text-blue-400",
      label: "Applied"
    };
  }
  if (s.includes("oa") || s.includes("assessment")) {
    return {
      bg: "bg-amber-500/[0.05] border-amber-500/[0.08] text-amber-500 dark:text-amber-400",
      label: s.includes("scheduled") ? "OA Scheduled" : s.includes("completed") ? "OA Completed" : "Assessment"
    };
  }
  if (s === "interview") {
    return {
      bg: "bg-indigo-500/[0.05] border-indigo-500/[0.08] text-indigo-500 dark:text-indigo-400",
      label: "Interview"
    };
  }
  if (s === "offer") {
    return {
      bg: "bg-emerald-500/[0.05] border-emerald-500/[0.08] text-emerald-500 dark:text-emerald-400",
      label: "Offer"
    };
  }
  if (s === "rejected" || s.includes("not eligible")) {
    return {
      bg: "bg-red-500/[0.05] border-red-500/[0.08] text-red-500 dark:text-red-400",
      label: s === "rejected" ? "Rejected" : "Not Eligible"
    };
  }
  return {
    bg: "bg-zinc-500/[0.05] border-zinc-500/[0.08] text-zinc-500 dark:text-zinc-400",
    label: status
  };
};

interface TrackerScreenProps {
  applications: any[];
  setApplications: React.Dispatch<React.SetStateAction<any[]>>;
  selectedApp: any;
  setSelectedApp: (app: any) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  handleFastStatusUpdate: (id: string, status: string) => void;
  handleDeleteApplication: (id: string) => void;
  setNewCompany: (v: string) => void;
  setNewRole: (v: string) => void;
  setNewCompensation: (v: string) => void;
  setNewLocation: (v: string) => void;
  setNewSource: (v: string) => void;
  setNewJobUrl: (v: string) => void;
  setNewNotes: (v: string) => void;
  setNewDeadline: (v: string) => void;
  setNewStatus: (v: string) => void;
  setActiveBottomSheet: (sheet: any) => void;
  setEditCompany: (v: string) => void;
  setEditRole: (v: string) => void;
  setEditIsInternship: (v: boolean) => void;
  setEditCompensation: (v: string) => void;
  setEditLocation: (v: string) => void;
  setEditSource: (v: string) => void;
  setEditJobUrl: (v: string) => void;
  setEditAppliedDate: (v: string) => void;
  setEditDeadline: (v: string) => void;
  setEditNotes: (v: string) => void;
  setEditStatus: (v: string) => void;
  simulateDatabaseFailure: boolean;
  isDark: boolean;
  themeCardClass: string;
  themeTextSubtle: string;
  themeInputBg: string;
  themeBorderClass: string;
  showToast: (message: string, type: "success" | "warning" | "error" | "info") => void;
}

export const TrackerScreen: React.FC<TrackerScreenProps> = ({
  applications,
  setApplications,
  selectedApp,
  setSelectedApp,
  currentScreen,
  setCurrentScreen,
  handleFastStatusUpdate,
  handleDeleteApplication,
  setNewCompany,
  setNewRole,
  setNewCompensation,
  setNewLocation,
  setNewSource,
  setNewJobUrl,
  setNewNotes,
  setNewDeadline,
  setNewStatus,
  setActiveBottomSheet,
  setEditCompany,
  setEditRole,
  setEditIsInternship,
  setEditCompensation,
  setEditLocation,
  setEditSource,
  setEditJobUrl,
  setEditAppliedDate,
  setEditDeadline,
  setEditNotes,
  setEditStatus,
  isDark,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState("All");

  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const filteredApplications = useMemo(() => {
    return applications
      .filter(app => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match = 
            app.company.toLowerCase().includes(q) || 
            app.role.toLowerCase().includes(q) || 
            (app.location || "").toLowerCase().includes(q);
          if (!match) return false;
        }
        if (selectedStatusTab !== "All") {
          const s = app.status.toLowerCase();
          if (selectedStatusTab === "Applied" && s !== "applied") return false;
          if (selectedStatusTab === "Assessment" && !s.includes("oa") && !s.includes("assessment")) return false;
          if (selectedStatusTab === "Interview" && s !== "interview") return false;
          if (selectedStatusTab === "Offer" && s !== "offer") return false;
          if (selectedStatusTab === "Rejected" && s !== "rejected" && s !== "not eligible") return false;
        }
        return true;
      })
      .sort((a, b) => {
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      });
  }, [applications, searchQuery, selectedStatusTab]);

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { y: 6, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 350 } }
  };

  if (currentScreen === "tracker") {
    return (
      <div className="space-y-6 select-none font-sans relative pb-4 text-left">
        <div className="pt-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-zinc-550 dark:text-zinc-500 uppercase block mb-1.5 leading-none">
              Active Pipeline
            </span>
            <h1 className={`text-[34px] font-extrabold tracking-tight leading-[1.1] ${isDark ? 'text-white' : 'text-zinc-950'}`}>
              Applications
            </h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95, opacity: 0.85 }}
            onClick={() => {
              setNewCompany("");
              setNewRole("");
              setNewCompensation("");
              setNewLocation("");
              setNewSource("LinkedIn");
              setNewJobUrl("");
              setNewNotes("");
              setNewDeadline("");
              setNewStatus("Applied");
              setActiveBottomSheet({ type: "add_app" });
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-lg ${
              isDark 
                ? "bg-blue-600 border-blue-500 hover:bg-blue-500 text-white shadow-blue-500/10" 
                : "bg-blue-600 border-blue-650 hover:bg-blue-700 text-white shadow-blue-600/15"
            }`}
          >
            <Plus size={20} strokeWidth={2.5} />
          </motion.button>
        </div>

        <div>
          <div className="relative">
            <Search size={15} className={`absolute left-4.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-550' : 'text-zinc-400'}`} />
            <input
              type="text"
              placeholder="Search company, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-11 pl-11 pr-4 rounded-2xl text-sm font-semibold outline-none border transition-all duration-155 ${
                isDark 
                  ? "bg-[#18181C] border-[#252529] text-zinc-100 placeholder-zinc-500 focus:border-blue-500/40" 
                  : "bg-zinc-100/70 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-blue-500/40"
              }`}
            />
          </div>
        </div>

        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none -mx-4 px-4 pb-2 gap-2 text-left">
          {["All", "Applied", "Assessment", "Interview", "Offer", "Rejected"].map((status) => {
            const isSelected = selectedStatusTab === status;
            const count = status === "All" 
              ? applications.length 
              : status === "Applied"
                ? applications.filter(a => a.status === "Applied").length
                : status === "Assessment"
                  ? applications.filter(a => a.status.toLowerCase().includes("oa") || a.status.toLowerCase().includes("assessment")).length
                  : status === "Interview"
                    ? applications.filter(a => a.status === "Interview").length
                    : status === "Offer"
                      ? applications.filter(a => a.status === "Offer").length
                      : applications.filter(a => a.status === "Rejected" || a.status === "Not Eligible").length;

            let activeStyles = "";
            let inactiveStyles = "";
            let dotColor = "";

            const sLower = status.toLowerCase();
            if (sLower === "all") {
              dotColor = "bg-zinc-400 dark:bg-zinc-550";
              activeStyles = isDark 
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm" 
                : "bg-zinc-950 border-zinc-900 text-white shadow-sm";
              inactiveStyles = isDark 
                ? "bg-[#121214] border-zinc-800 text-zinc-400 hover:text-zinc-200" 
                : "bg-zinc-100/60 border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100";
            } else if (sLower === "applied") {
              dotColor = "bg-blue-500";
              activeStyles = isDark 
                ? "bg-blue-950/50 border-blue-500/40 text-blue-400 shadow-[0_2px_10px_rgba(59,130,246,0.15)]" 
                : "bg-blue-50 border-blue-200 text-blue-700 shadow-sm";
              inactiveStyles = isDark 
                ? "bg-[#121214] border-zinc-800 text-zinc-400 hover:border-blue-500/25 hover:text-blue-400" 
                : "bg-zinc-100/60 border-zinc-200 text-zinc-500 hover:border-blue-200 hover:text-blue-650";
            } else if (sLower.includes("assess") || sLower.includes("oa")) {
              dotColor = "bg-amber-500";
              activeStyles = isDark 
                ? "bg-amber-950/40 border-amber-500/40 text-amber-400 shadow-[0_2px_10px_rgba(245,158,11,0.15)]" 
                : "bg-amber-50 border-amber-200 text-amber-700 shadow-sm";
              inactiveStyles = isDark 
                ? "bg-[#121214] border-zinc-800 text-zinc-400 hover:border-amber-500/25 hover:text-amber-400" 
                : "bg-zinc-100/60 border-zinc-200 text-zinc-500 hover:border-amber-200 hover:text-amber-650";
            } else if (sLower === "interview") {
              dotColor = "bg-indigo-500";
              activeStyles = isDark 
                ? "bg-indigo-950/50 border-indigo-500/40 text-indigo-400 shadow-[0_2px_10px_rgba(99,102,241,0.15)]" 
                : "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm";
              inactiveStyles = isDark 
                ? "bg-[#121214] border-zinc-800 text-zinc-400 hover:border-indigo-500/25 hover:text-indigo-400" 
                : "bg-zinc-100/60 border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-650";
            } else if (sLower === "offer") {
              dotColor = "bg-emerald-500";
              activeStyles = isDark 
                ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-400 shadow-[0_2px_10px_rgba(16,185,129,0.15)]" 
                : "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm";
              inactiveStyles = isDark 
                ? "bg-[#121214] border-zinc-800 text-zinc-400 hover:border-emerald-500/25 hover:text-emerald-400" 
                : "bg-zinc-100/60 border-zinc-200 text-zinc-500 hover:border-emerald-200 hover:text-emerald-650";
            } else if (sLower === "rejected") {
              dotColor = "bg-red-500";
              activeStyles = isDark 
                ? "bg-red-950/40 border-red-500/40 text-red-400 shadow-[0_2px_10px_rgba(239,68,68,0.15)]" 
                : "bg-red-50 border-red-200 text-red-700 shadow-sm";
              inactiveStyles = isDark 
                ? "bg-[#121214] border-zinc-800 text-zinc-400 hover:border-red-500/25 hover:text-red-400" 
                : "bg-zinc-100/60 border-zinc-200 text-zinc-500 hover:border-red-200 hover:text-red-650";
            }

            return (
              <motion.button
                key={status}
                whileHover={{ scale: 1.015, y: -0.5 }}
                whileTap={{ scale: 0.95, opacity: 0.85 }}
                onClick={() => setSelectedStatusTab(status)}
                className={`h-[34px] px-3.5 rounded-full flex items-center justify-between text-xs font-semibold tracking-tight transition-all cursor-pointer border shrink-0 space-x-1.5 ${
                  isSelected ? activeStyles : inactiveStyles
                }`}
              >
                <div className="flex items-center space-x-1.5 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor} ${isSelected ? 'animate-pulse' : 'opacity-80'}`} />
                  <span className="truncate leading-none">{status}</span>
                </div>
                <span className={`text-[9.5px] rounded-md px-1.5 py-0.5 leading-none shrink-0 font-extrabold ml-1.5 ${
                  isSelected
                    ? isDark 
                      ? "bg-white/10 text-white" 
                      : "bg-zinc-950/10 text-zinc-900"
                    : isDark 
                      ? "bg-zinc-800/60 text-zinc-500" 
                      : "bg-zinc-200/50 text-zinc-500"
                }`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {(() => {
          const highestPriorityAppId = (() => {
            if (!filteredApplications.length) return null;
            let highestId = null;
            let maxScore = -1;
            for (const app of filteredApplications) {
              const status = app.status?.toLowerCase() || "";
              let score = 0;
              if (status === "interview") score = 5;
              else if (status.includes("scheduled") || status.includes("oa scheduled")) score = 4;
              else if (status === "offer") score = 3;
              else if (status === "applied") score = 2;
              else if (status.includes("completed") || status.includes("oa completed")) score = 1;
              
              if (score > maxScore) {
                maxScore = score;
                highestId = app.id;
              }
            }
            return maxScore > 0 ? highestId : null;
          })();

          return (
            <motion.div 
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="space-y-3.5 mt-1"
            >
              {filteredApplications.map((app) => {
                const statusStyle = getStatusStyles(app.status);
                const isAppSelected = selectedApp?.id === app.id;
                const compLabel = app.compensation > 1000 ? `$${Math.round(app.compensation/1000)}k` : `$${app.compensation}/mo`;

                let cardBorderClass = isDark ? "border-[#252529] hover:border-zinc-700" : "border-zinc-200/80 hover:border-zinc-300";
                let cardBgClass = isDark ? "bg-[#18181C]" : "bg-white";
                let cardShadowClass = isDark ? "shadow-[0_12px_24px_rgba(0,0,0,0.55)]" : "shadow-[0_4px_12px_rgba(0,0,0,0.02)]";
                let accentGlow = "";

                const s = app.status?.toLowerCase() || "";
                if (s === "wishlist" || s === "planning") {
                  accentGlow = isDark ? "bg-zinc-500" : "bg-zinc-400";
                } else if (s === "applied") {
                  accentGlow = "bg-blue-500";
                } else if (s.includes("scheduled") || s.includes("oa")) {
                  accentGlow = "bg-amber-500";
                } else if (s === "interview") {
                  accentGlow = "bg-indigo-500";
                } else if (s === "offer") {
                  accentGlow = "bg-[#10B981]";
                } else if (s === "rejected") {
                  accentGlow = "bg-red-500";
                } else {
                  accentGlow = "bg-zinc-500";
                }

                return (
                    <motion.div 
                      key={app.id}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.003,
                        y: -0.5,
                        backgroundColor: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.003)"
                      }}
                      whileTap={{ scale: 0.95, opacity: 0.85 }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      onClick={() => {
                        setSelectedApp(app);
                        setCurrentScreen("tracker_detail");
                      }}
                      className={`group p-5 flex items-center justify-between cursor-pointer border rounded-2xl transition-all relative select-none ${cardBorderClass} ${cardShadowClass} ${cardBgClass} ${
                        isAppSelected 
                          ? isDark 
                            ? "ring-1 ring-blue-500/20 bg-blue-950/5" 
                            : "ring-1 ring-blue-500/15 bg-blue-50/15"
                          : ""
                      }`}
                    >
                      <div className={`absolute left-0 top-3.5 bottom-3.5 w-1 ${accentGlow} rounded-r-full transition-all`} />

                      <div className="flex items-center space-x-4 min-w-0 pl-1">
                        <div className="shrink-0 flex items-center justify-center">
                          <CompanyLogo companyName={app.company} isDark={isDark} sizeClasses="w-11 h-11 text-base font-bold" />
                        </div>

                        <div className="min-w-0 flex flex-col justify-center text-left">
                          <div className="flex items-center gap-2 leading-none">
                            <h4 className={`text-sm font-extrabold tracking-tight leading-none ${isDark ? "text-zinc-200" : "text-zinc-850"}`}>
                              {app.company}
                            </h4>
                            <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md shrink-0 ${
                              isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-500"
                            }`}>
                              {app.isInternship ? "Intern" : "FTE"}
                            </span>
                          </div>
                          <p className={`text-[13px] font-semibold tracking-tight mt-1 leading-tight ${isDark ? "text-zinc-300" : "text-zinc-750"}`}>
                            {app.role}
                          </p>
                          <p className={`text-xs font-medium leading-none mt-1.5 ${isDark ? "text-zinc-500" : "text-zinc-405"}`}>
                            {app.location || "Remote"}  •  {compLabel}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 shrink-0 ml-3">
                        <span className={`text-[10px] tracking-wider font-sans font-bold uppercase select-none px-2.5 py-1 rounded-full border leading-none ${
                          s === "wishlist" || s === "planning" ? (isDark ? "bg-zinc-850 border-zinc-750 text-zinc-400" : "bg-zinc-150 border-zinc-200 text-zinc-500") :
                          s === "applied" ? (isDark ? "bg-blue-500/[0.08] border-blue-500/[0.18] text-blue-400" : "bg-blue-50 border-blue-200/60 text-blue-700") :
                          s.includes("oa") || s.includes("assessment") ? (isDark ? "bg-amber-500/[0.08] border-amber-500/[0.18] text-amber-400" : "bg-amber-50 border-amber-200/60 text-amber-700") :
                          s === "interview" ? (isDark ? "bg-indigo-500/[0.08] border-indigo-500/[0.18] text-indigo-400" : "bg-indigo-50 border-indigo-200/60 text-indigo-700") :
                          s === "offer" ? (isDark ? "bg-emerald-500/[0.08] border-emerald-500/[0.18] text-[#10B981] bg-[#04261C]" : "bg-emerald-50 border-emerald-200/60 text-emerald-700") :
                          s === "rejected" ? (isDark ? "bg-red-500/[0.08] border-red-500/[0.18] text-red-400" : "bg-red-50 border-red-200/60 text-red-700") :
                          (isDark ? "bg-zinc-800/40 border-zinc-750 text-zinc-455" : "bg-zinc-100 border-zinc-250 text-zinc-600")
                        }`}>
                          {statusStyle.label}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                          isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-450"
                        }`}>
                          <ChevronRight size={14} className={`${isDark ? 'text-zinc-400' : 'text-zinc-550'}`} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

              {filteredApplications.length === 0 && (
                <div className={`py-12 text-center text-zinc-500 text-xs font-mono p-4 rounded-2xl border ${
                  isDark ? "bg-[#121214] border-zinc-800" : "bg-white border-zinc-200"
                }`}>
                  <HelpCircle size={22} className="mx-auto mb-2 text-zinc-600 animate-pulse" />
                  <span>No active pipeline records matched filters.</span>
                </div>
              )}
            </motion.div>
          );
        })()}
      </div>
    );
  }

  if (currentScreen === "tracker_detail" && selectedApp) {
    const getNormalizedStage = (status: string): "Wishlist" | "Applied" | "Assessment" | "Interview" | "Offer" => {
      const s = status.toLowerCase();
      if (s === "wishlist" || s === "planning") return "Wishlist";
      if (s === "applied") return "Applied";
      if (s.includes("oa") || s.includes("assessment")) return "Assessment";
      if (s.includes("interview") || s.includes("round")) return "Interview";
      if (s.includes("offer")) return "Offer";
      return "Wishlist";
    };

    const normalizedStage = getNormalizedStage(selectedApp.status);
    const activeIndex = getTimelineActiveIndex(selectedApp.status);

    const formattedComp = selectedApp.compensation > 1000 
      ? `$${selectedApp.compensation.toLocaleString()}` 
      : `$${selectedApp.compensation}/mo`;

    const timelineStages: Array<"Wishlist" | "Applied" | "Assessment" | "Interview" | "Offer"> = [
      "Wishlist", "Applied", "Assessment", "Interview", "Offer"
    ];

    const handleTimelineClick = (idx: number) => {
      let statusName = "Wishlist";
      if (idx === 0) statusName = "Wishlist";
      else if (idx === 1) statusName = "Applied";
      else if (idx === 2) statusName = "OA Scheduled";
      else if (idx === 3) statusName = "Interview";
      else if (idx === 4) statusName = "Offer";

      handleFastStatusUpdate(selectedApp.id, statusName);
      
      const updatedLogs = [
        ...(selectedApp.timelineLogs || []),
        `Pipeline stage transitioned to ${statusName} via interactive workspace timeline.`
      ];
      
      const updatedApp = {
        ...selectedApp,
        status: statusName,
        timelineLogs: updatedLogs
      };
      
      setSelectedApp(updatedApp);
      showToast(`Transitioned to ${statusName} stage`, "success");
    };

    const handleShare = () => {
      const payload = `💼 VeyloPrep Record\n🏢 Company: ${selectedApp.company}\n🎯 Role: ${selectedApp.role}\n📍 Location: ${selectedApp.location || "Remote"}\n💵 Salary: ${formattedComp}\n📈 Stage: ${selectedApp.status}\n🔗 Link: ${selectedApp.jobUrl || "None"}`;
      navigator.clipboard.writeText(payload);
      showToast("Metadata copied to clipboard", "success");
      setShowShareModal(true);
    };

    const handleArchive = () => {
      showToast(`Opportunity for ${selectedApp.company} archived.`, "info");
    };

    const getStageAction = (stage: "Wishlist" | "Applied" | "Assessment" | "Interview" | "Offer", company: string) => {
      switch (stage) {
        case "Wishlist":
          return {
            title: "Submit Application",
            desc: `Tailor your technical portfolio and finalize key resumes before the pipeline peaks for ${company}.`,
            tag: "Wishlist Track",
            colorClass: "bg-[#121214] border-zinc-800 text-zinc-400",
            dotClass: "bg-zinc-500"
          };
        case "Applied":
          return {
            title: "Track Response",
            desc: "Application successfully submitted. Monitor communication channels for interview invitations or assessment links.",
            tag: "Under Review",
            colorClass: "bg-[#121214] border-blue-500/20 text-blue-400",
            dotClass: "bg-blue-500"
          };
        case "Assessment":
          return {
            title: "Complete Technical Screenings",
            desc: "Practice algorithmic puzzles, review sample case studies, and finalize the coding assessment.",
            tag: "OA Scheduled",
            colorClass: "bg-[#121214] border-amber-500/20 text-amber-400",
            dotClass: "bg-amber-500"
          };
        case "Interview":
          return {
            title: "Prepare Interview Materials",
            desc: "Review core computer science principles, system design trade-offs, and conduct a practice run.",
            tag: "Interview Scheduled",
            colorClass: "bg-[#121214] border-indigo-500/20 text-indigo-400",
            dotClass: "bg-indigo-500"
          };
        case "Offer":
          return {
            title: "Evaluate Offer Conditions",
            desc: "Outstanding milestone achieved! Review base salary terms, relocation packages, and target start dates.",
            tag: "Offer Received",
            colorClass: "bg-[#121214] border-emerald-500/20 text-emerald-400",
            dotClass: "bg-emerald-500"
          };
      }
    };

    const stageAction = getStageAction(normalizedStage, selectedApp.company);

    const getStageColor = (stage: "Wishlist" | "Applied" | "Assessment" | "Interview" | "Offer") => {
      switch (stage) {
        case "Wishlist": return { fill: "bg-zinc-500", text: "text-zinc-500 dark:text-zinc-400", ring: "ring-zinc-500/10" };
        case "Applied": return { fill: "bg-blue-500", text: "text-blue-500", ring: "ring-blue-500/10" };
        case "Assessment": return { fill: "bg-amber-500", text: "text-amber-500", ring: "ring-amber-500/10" };
        case "Interview": return { fill: "bg-[#6366F1]", text: "text-[#6366F1]", ring: "ring-[#6366F1]/10" };
        case "Offer": return { fill: "bg-emerald-500", text: "text-emerald-500", ring: "ring-emerald-500/10" };
      }
    };

    return (
      <div className="space-y-7 pb-14 select-none font-sans relative text-left">
        <div className="flex items-center justify-between pb-4.5 border-b border-zinc-800">
          <button 
            onClick={() => {
              setSelectedApp(null);
              setCurrentScreen("tracker");
            }}
            className={`h-9 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
              isDark 
                ? "bg-[#18181C] border-[#252529] text-zinc-350 hover:bg-[#202025] hover:text-white" 
                : "bg-zinc-100/80 border-transparent text-zinc-650 hover:bg-zinc-200/50 hover:text-zinc-900"
            }`}
          >
            <ArrowLeft size={14} /> <span>Back</span>
          </button>

          <div className="flex items-center space-x-2 relative">
            <button
              onClick={() => {
                setEditCompany(selectedApp.company);
                setEditRole(selectedApp.role);
                setEditIsInternship(selectedApp.isInternship);
                setEditCompensation(selectedApp.compensation.toString());
                setEditLocation(selectedApp.location);
                setEditSource(selectedApp.source);
                setEditJobUrl(selectedApp.jobUrl || "");
                setEditAppliedDate(selectedApp.appliedDate);
                setEditDeadline(selectedApp.deadline || "");
                setEditNotes(selectedApp.notes || "");
                setEditStatus(selectedApp.status);
                setActiveBottomSheet({ type: "edit_app" });
              }}
              className={`h-9 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                isDark 
                  ? "bg-[#18181C] border-[#252529] text-zinc-200 hover:bg-[#202025] hover:text-white" 
                  : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm"
              }`}
            >
              <Edit size={13} />
              <span>Edit</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                className={`h-9 w-9 rounded-xl border flex items-center justify-center cursor-pointer transition-all active:scale-95 ${
                  isDark 
                    ? "bg-[#18181C] border-[#252529] text-zinc-200 hover:bg-[#202025]" 
                    : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 shadow-sm"
                }`}
              >
                <MoreHorizontal size={14} />
              </button>

              <AnimatePresence>
                {showOverflowMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowOverflowMenu(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                      className={`absolute right-0 mt-1.5 w-36 rounded-xl border p-1.5 z-50 shadow-lg ${
                        isDark 
                          ? "bg-[#121214] border-zinc-800 text-zinc-200" 
                          : "bg-white border-zinc-200 text-zinc-700"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          handleShare();
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-zinc-900 dark:hover:bg-zinc-850 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Share2 size={12} />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          handleArchive();
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-zinc-900 dark:hover:bg-zinc-850 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Archive size={12} />
                        <span>Archive</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          handleDeleteApplication(selectedApp.id);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-500/5 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4.5 pt-3 pb-1">
          <CompanyLogo companyName={selectedApp.company} isDark={isDark} sizeClasses="w-[60px] h-[60px] text-2xl font-bold rounded-2xl" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className={`text-[26px] font-extrabold tracking-tight leading-none truncate ${isDark ? "text-white" : "text-zinc-955"}`}>
                {selectedApp.company}
              </h1>
              <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md shrink-0 ${
                isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-500"
              }`}>
                {selectedApp.isInternship ? "Intern" : "FTE"}
              </span>
            </div>
            <p className={`text-[15px] font-bold tracking-tight leading-none ${isDark ? "text-zinc-300" : "text-zinc-750"} truncate`}>
              {selectedApp.role}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold leading-none pt-0.5">
              <span className="text-zinc-400 dark:text-zinc-505 font-medium">
                {selectedApp.location || "Remote"}
              </span>
              <span className="text-zinc-300 dark:text-zinc-800">•</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-450">
                {formattedComp}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-1">
          <span className={`text-[10px] tracking-wider font-sans font-bold uppercase select-none px-3.5 py-1.5 rounded-full border leading-none ${
            normalizedStage === "Applied" ? (isDark ? "bg-blue-500/[0.08] border-blue-500/[0.18] text-blue-400" : "bg-blue-50 border-blue-200/60 text-blue-700") :
            normalizedStage === "Assessment" ? (isDark ? "bg-amber-500/[0.08] border-amber-500/[0.18] text-amber-400" : "bg-amber-50 border-amber-200/60 text-amber-700") :
            normalizedStage === "Interview" ? (isDark ? "bg-purple-500/[0.08] border-purple-500/[0.18] text-purple-400" : "bg-purple-50 border-purple-200/60 text-purple-700") :
            normalizedStage === "Offer" ? (isDark ? "bg-emerald-500/[0.08] border-emerald-500/[0.18] text-[#10B981] bg-[#04261C]" : "bg-emerald-50 border-emerald-200/60 text-emerald-700") :
            (isDark ? "bg-zinc-800/40 border-zinc-750 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600")
          }`}>
            {normalizedStage}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-[22px] border flex items-start gap-4 ${
            isDark 
              ? "bg-[#18181C] border-[#252529] shadow-[0_16px_36px_rgba(0,0,0,0.6)]" 
              : "bg-white border-zinc-200 shadow-md shadow-zinc-200/40"
          }`}
        >
          <div className="space-y-2 flex-1 pl-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] tracking-wider font-sans font-bold uppercase select-none px-2.5 py-0.5 rounded-full border leading-none ${
                normalizedStage === "Offer" ? "bg-emerald-500/10 border-emerald-500/20 text-[#10B981]" : "bg-zinc-800/40 border-zinc-750 text-zinc-400"
              }`}>
                {stageAction.tag}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${stageAction.dotClass}`} />
              <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase leading-none">NEXT STEP</span>
            </div>
            
            <h3 className={`text-lg font-extrabold tracking-tight leading-snug ${isDark ? "text-white" : "text-zinc-950"}`}>
              {stageAction.title}
            </h3>
            
            <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-650"}`}>
              {stageAction.desc}
            </p>
          </div>
        </motion.div>

        <div className={`p-6 rounded-[22px] border ${
          isDark ? "bg-[#18181C] border-[#252529] shadow-[0_12px_24px_rgba(0,0,0,0.5)]" : "bg-white border-zinc-200 shadow-sm"
        }`}>
          <div className="flex items-center justify-between relative py-3.5 px-1.5">
            <div className="absolute left-[8%] right-[8%] top-[32px] h-[1px] bg-zinc-200 dark:bg-zinc-800 z-0" />

            {timelineStages.map((stage, idx) => {
              const isCurrent = stage === normalizedStage;
              const isDone = activeIndex >= idx;
              const colors = getStageColor(stage);
              
              const getStageAbbrev = (st: string) => {
                if (st === "Assessment") return "Assess";
                return st;
              };

              return (
                <button
                  key={stage}
                  onClick={() => handleTimelineClick(idx)}
                  className="flex flex-col items-center z-10 relative group cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCurrent 
                      ? `${colors.fill} text-white ring-4 ${colors.ring}` 
                      : isDone 
                        ? `${colors.fill} text-white` 
                        : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 text-zinc-400"
                  }`}>
                    {isDone ? (
                      <Check size={14} strokeWidth={3.5} />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-[11px] font-semibold mt-2 transition-colors tracking-tight text-center truncate max-w-[54px] block leading-none ${
                    isCurrent 
                      ? `${colors.text} font-bold` 
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}>
                    {getStageAbbrev(stage)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`p-6 rounded-[22px] border ${
          isDark ? "bg-[#18181C] border-[#252529] shadow-[0_12px_24px_rgba(0,0,0,0.5)]" : "bg-white border-zinc-200 shadow-sm"
        }`}>
          <h4 className="text-xs font-bold text-zinc-505 dark:text-zinc-500 uppercase tracking-wider mb-5">Job Details</h4>
          
          <div className="divide-y divide-zinc-150 dark:divide-zinc-800/60 text-sm">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-550"
                }`}>
                  <MapPin size={13} />
                </div>
                <span className="text-zinc-505 dark:text-zinc-400 font-semibold text-xs tracking-wider uppercase">Location</span>
              </div>
              <span className={`font-semibold text-right truncate pl-4 flex-1 min-w-0 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                {selectedApp.location || "Remote"}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-550"
                }`}>
                  <DollarSign size={13} />
                </div>
                <span className="text-zinc-505 dark:text-zinc-400 font-semibold text-xs tracking-wider uppercase">Salary</span>
              </div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-450 text-right truncate pl-4 flex-1 min-w-0">
                {formattedComp}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-550"
                }`}>
                  <Calendar size={13} />
                </div>
                <span className="text-zinc-505 dark:text-zinc-400 font-semibold text-xs tracking-wider uppercase">Applied Date</span>
              </div>
              <span className={`font-semibold text-right truncate pl-4 flex-1 min-w-0 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                {new Date(selectedApp.appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-550"
                }`}>
                  <Clock size={13} />
                </div>
                <span className="text-zinc-555 dark:text-zinc-400 font-semibold text-xs tracking-wider uppercase">Deadline</span>
              </div>
              <span className={`font-semibold text-right truncate pl-4 flex-1 min-w-0 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                {selectedApp.deadline 
                  ? new Date(selectedApp.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
                  : "None"
                }
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-550"
                }`}>
                  <Globe size={13} />
                </div>
                <span className="text-zinc-505 dark:text-zinc-400 font-semibold text-xs tracking-wider uppercase">Source</span>
              </div>
              <span className={`font-semibold text-right truncate pl-4 flex-1 min-w-0 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                {selectedApp.source || "Direct"}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-550"
                }`}>
                  <Link size={13} />
                </div>
                <span className="text-zinc-555 dark:text-zinc-400 font-semibold text-xs tracking-wider uppercase text-left">External Link</span>
              </div>
              {selectedApp.jobUrl ? (
                <a 
                  href={selectedApp.jobUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="text-blue-500 hover:text-blue-400 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer text-right"
                >
                  <span>Link</span>
                  <ExternalLink size={10} />
                </a>
              ) : (
                <span className="text-zinc-550 text-right font-semibold">None</span>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showShareModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                onClick={() => setShowShareModal(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className={`relative w-full max-w-sm rounded-2xl border p-6 z-10 shadow-2xl ${
                  isDark 
                    ? "bg-[#121214] border-zinc-800 text-white" 
                    : "bg-white border-zinc-200 text-zinc-900"
                }`}
              >
                <button
                  onClick={() => setShowShareModal(false)}
                  className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-250 cursor-pointer"
                >
                  <X size={14} />
                </button>

                <div className="text-center space-y-1 mb-4">
                  <h3 className="text-sm font-bold tracking-tight">Share Opportunity</h3>
                  <p className="text-[11px] text-zinc-500">Metadata successfully formatted</p>
                </div>

                <div className={`p-3 rounded-2xl border text-[11px] font-mono whitespace-pre-wrap leading-relaxed ${
                  isDark ? 'bg-zinc-950/40 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                }`}>
                  {`💼 VeyloPrep Record\n🏢 Company: ${selectedApp.company}\n🎯 Role: ${selectedApp.role}\n📍 Location: ${selectedApp.location || "Remote"}\n💵 Salary: ${formattedComp}\n📈 Stage: ${selectedApp.status}`}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`VeyloPrep Opportunity details copy completed!`);
                      showToast("Copied!", "success");
                      setShowShareModal(false);
                    }}
                    className="flex-1 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Check size={12} />
                    <span>Copy Standard Details</span>
                  </button>
                  
                  <button
                    onClick={() => setShowShareModal(false)}
                    className={`h-8 px-4 rounded-xl border text-xs font-semibold cursor-pointer ${
                      isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
};
