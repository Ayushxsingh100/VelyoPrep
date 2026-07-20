import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Search, Trash2, ArrowLeft, ExternalLink, HelpCircle,
  ChevronRight, Share2, Archive, MoreHorizontal, Edit, Check,
  X, Copy
} from "lucide-react";

// Normalized company logo badge matching Workspace styling, optimized for dark and light
const getCompanyLogo = (companyName: string, isDark: boolean, sizeClasses = "w-[22px] h-[22px] text-[9px]") => {
  const firstLetter = companyName.charAt(0).toUpperCase();
  const lower = companyName.toLowerCase();

  let bgClass = isDark ? "bg-[#18181B] border-white/[0.04] text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600";
  let logoContent = <span className="font-semibold tracking-tight">{firstLetter}</span>;

  if (lower.includes("stripe")) {
    bgClass = isDark ? "bg-[#635BFF]/10 border-[#635BFF]/15 text-[#7970FF]" : "bg-[#635BFF]/5 border-[#635BFF]/12 text-[#635BFF]";
  } else if (lower.includes("google")) {
    bgClass = isDark ? "bg-[#4285F4]/10 border-[#4285F4]/15 text-[#4285F4]" : "bg-[#4285F4]/5 border-[#4285F4]/12 text-[#4285F4]";
    logoContent = (
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="currentColor" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
      </svg>
    );
  } else if (lower.includes("apple")) {
    bgClass = isDark ? "bg-zinc-800 border-white/5 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-800";
    logoContent = (
      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
      </svg>
    );
  } else if (lower.includes("netflix")) {
    bgClass = isDark ? "bg-[#E50914]/10 border-[#E50914]/15 text-[#E50914]" : "bg-[#E50914]/5 border-[#E50914]/12 text-[#E50914]";
  } else if (lower.includes("meta") || lower.includes("facebook")) {
    bgClass = isDark ? "bg-[#0668E1]/10 border-[#0668E1]/15 text-[#3B82F6]" : "bg-[#0668E1]/5 border-[#0668E1]/12 text-[#0668E1]";
  }

  return (
    <div className={`${sizeClasses} rounded-full border ${bgClass} flex items-center justify-center shrink-0`}>
      {logoContent}
    </div>
  );
};

// Next Important Action utility to answer: "Where are my applications and what should I do next?"
const getUpcomingAction = (app: any) => {
  const status = app.status;
  if (status === "Applied") {
    return "Awaiting review or OA";
  }
  if (status === "OA Scheduled") {
    if (app.deadline) {
      return `Complete OA by ${new Date(app.deadline).toLocaleDateString(undefined, {month: "short", day: "numeric"})}`;
    }
    return "Complete online assessment";
  }
  if (status === "OA Completed") {
    return "Awaiting interview invite";
  }
  if (status === "Interview") {
    return "Prepare for active rounds";
  }
  if (status === "Offer") {
    return "Review offer terms";
  }
  if (status === "Wishlist" || status === "Planning") {
    return "Submit when applications open";
  }
  if (status === "Rejected") {
    return "Process closed";
  }
  return "No immediate action pending";
};

// Map application status to active index on timeline (0 = Wishlist, 1 = Applied, 2 = OA, 3 = Interview, 4 = Offer)
const getTimelineActiveIndex = (status: string) => {
  const s = status.toLowerCase();
  if (s === "wishlist" || s === "planning") return 0;
  if (s === "applied") return 1;
  if (s.includes("oa") || s.includes("assessment")) return 2;
  if (s === "interview") return 3;
  if (s === "offer") return 4;
  return -1; // e.g. Rejected / Closed
};

// Premium, cleaned status styling config with reduced color saturation for elegant minimalism
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
  
  // Modal setters
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

  // Edit setters
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

  // Environment and themes
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
  simulateDatabaseFailure,
  isDark,
  themeCardClass,
  themeTextSubtle,
  themeInputBg,
  themeBorderClass,
  showToast
}) => {
  // Local state for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState("All");

  // New States for Detail Redesign
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [notesSaveStatus, setNotesSaveStatus] = useState<"Saved" | "Saving..." | "Syncing">("Saved");
  const [showShareModal, setShowShareModal] = useState(false);
  const notesSaveTimeoutRef = useRef<any>(null);

  // Pre-populated clean mock attachments matching applications list
  const [appAttachments, setAppAttachments] = useState<Record<string, Array<{name: string; size: string; type: string}>>>({
    "1": [
      { name: "Stripe_SWE_Intern_Resume_v2.pdf", size: "142 KB", type: "pdf" },
      { name: "Stripe_Cover_Letter_Tailored.pdf", size: "94 KB", type: "pdf" }
    ],
    "2": [
      { name: "CoreOS_Kernel_Resume_Cupertino.pdf", size: "158 KB", type: "pdf" },
      { name: "Stanford_Internal_Referral_Form.pdf", size: "210 KB", type: "pdf" },
      { name: "POSIX_Memory_Reference.pdf", size: "4.1 MB", type: "pdf" }
    ],
    "3": [
      { name: "Google_APM_Product_Portfolio.pdf", size: "3.4 MB", type: "pdf" },
      { name: "APM_Google_University_Match.pdf", size: "125 KB", type: "pdf" }
    ],
    "4": [
      { name: "Linear_Systems_Intern_Resume.pdf", size: "118 KB", type: "pdf" },
      { name: "Dynamic_Canvas_Prototypes.url", size: "1 KB", type: "link" }
    ],
    "5": [
      { name: "UI_Engineer_Standard_Resume.pdf", size: "140 KB", type: "pdf" }
    ]
  });

  const [simulatedFiles] = useState([
    "Official_University_Transcript.pdf",
    "PlacementOS_Certified_Profile.pdf",
    "System_Design_Case_Studies.pdf",
    "Recommendation_Letter_Dean.pdf",
    "Technical_Project_Portfolio.pdf"
  ]);

  // Filter listings
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

  // Frame transition variants
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

  // Render main tracker screen
  if (currentScreen === "tracker") {
    return (
      <div className="space-y-3.5 select-none font-sans relative pb-4">
        {/* ① APPLE LEVEL LUXURY HEADER ROW */}
        <div className="flex items-center justify-between pt-1 px-1">
          <h1 className={`text-[18px] font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-zinc-950'}`}>
            Applications
          </h1>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isDark 
                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100" 
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
            }`}
          >
            <Plus size={12} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* ② SUBTLE IOS-STYLE SEARCH */}
        <div className="px-0.5">
          <div className="relative">
            <Search size={10} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <input
              type="text"
              placeholder="Search company, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-[26px] pl-7 pr-3 rounded-[10px] text-[9.5px] font-medium outline-none border transition-all duration-150 ${
                isDark 
                  ? "bg-[#111113] border-white/[0.02] text-zinc-100 placeholder-zinc-500 focus:bg-[#09090a] focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/5" 
                  : "bg-zinc-100/80 border-zinc-200/40 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/5"
              }`}
            />
          </div>
        </div>

        {/* ③ STATUS NAVIGATION GRID (NO SCROLLBAR) */}
        <div className="px-0.5 grid grid-cols-3 gap-2 py-0.5">
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
              dotColor = "bg-zinc-400 dark:bg-zinc-500";
              activeStyles = isDark 
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.2)]" 
                : "bg-zinc-950 border-zinc-900 text-white shadow-[0_2px_6px_rgba(0,0,0,0.08)]";
              inactiveStyles = isDark 
                ? "bg-[#111113]/40 border-white/[0.01] text-zinc-400 hover:text-zinc-200 hover:bg-[#151518]" 
                : "bg-zinc-100/60 border-zinc-200/30 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100";
            } else if (sLower === "applied") {
              dotColor = "bg-blue-500";
              activeStyles = isDark 
                ? "bg-blue-950/50 border-blue-500/40 text-blue-400 shadow-[0_2px_10px_rgba(59,130,246,0.15)]" 
                : "bg-blue-50 border-blue-200 text-blue-700 shadow-[0_2px_8px_rgba(59,130,246,0.08)]";
              inactiveStyles = isDark 
                ? "bg-[#111113]/40 border-white/[0.01] text-zinc-400 hover:border-blue-500/25 hover:text-blue-400" 
                : "bg-zinc-100/60 border-zinc-200/30 text-zinc-500 hover:border-blue-200 hover:text-blue-600";
            } else if (sLower.includes("assess") || sLower.includes("oa")) {
              dotColor = "bg-amber-500";
              activeStyles = isDark 
                ? "bg-amber-950/40 border-amber-500/40 text-amber-400 shadow-[0_2px_10px_rgba(245,158,11,0.15)]" 
                : "bg-amber-50 border-amber-200 text-amber-700 shadow-[0_2px_8px_rgba(245,158,11,0.08)]";
              inactiveStyles = isDark 
                ? "bg-[#111113]/40 border-white/[0.01] text-zinc-400 hover:border-amber-500/25 hover:text-amber-400" 
                : "bg-zinc-100/60 border-zinc-200/30 text-zinc-500 hover:border-amber-200 hover:text-amber-600";
            } else if (sLower === "interview") {
              dotColor = "bg-indigo-500";
              activeStyles = isDark 
                ? "bg-indigo-950/50 border-indigo-500/40 text-indigo-400 shadow-[0_2px_10px_rgba(99,102,241,0.15)]" 
                : "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-[0_2px_8px_rgba(99,102,241,0.08)]";
              inactiveStyles = isDark 
                ? "bg-[#111113]/40 border-white/[0.01] text-zinc-400 hover:border-indigo-500/25 hover:text-indigo-400" 
                : "bg-zinc-100/60 border-zinc-200/30 text-zinc-500 hover:border-indigo-200 hover:text-indigo-600";
            } else if (sLower === "offer") {
              dotColor = "bg-emerald-500";
              activeStyles = isDark 
                ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-400 shadow-[0_2px_10px_rgba(16,185,129,0.15)]" 
                : "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-[0_2px_8px_rgba(16,185,129,0.08)]";
              inactiveStyles = isDark 
                ? "bg-[#111113]/40 border-white/[0.01] text-zinc-400 hover:border-emerald-500/25 hover:text-emerald-400" 
                : "bg-zinc-100/60 border-zinc-200/30 text-zinc-500 hover:border-emerald-200 hover:text-emerald-600";
            } else if (sLower === "rejected") {
              dotColor = "bg-red-500";
              activeStyles = isDark 
                ? "bg-red-950/40 border-red-500/40 text-red-400 shadow-[0_2px_10px_rgba(239,68,68,0.15)]" 
                : "bg-red-50 border-red-200 text-red-700 shadow-[0_2px_8px_rgba(239,68,68,0.08)]";
              inactiveStyles = isDark 
                ? "bg-[#111113]/40 border-white/[0.01] text-zinc-400 hover:border-red-500/25 hover:text-red-400" 
                : "bg-zinc-100/60 border-zinc-200/30 text-zinc-500 hover:border-red-200 hover:text-red-600";
            }

            return (
              <motion.button
                key={status}
                whileHover={{ scale: 1.015, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStatusTab(status)}
                className={`h-[30px] rounded-[8px] flex items-center justify-between px-2.5 text-[9.5px] font-bold tracking-tight transition-all cursor-pointer border ${
                  isSelected ? activeStyles : inactiveStyles
                }`}
              >
                <div className="flex items-center space-x-1.5 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor} ${isSelected ? 'animate-pulse' : 'opacity-80'}`} />
                  <span className="truncate leading-none">{status}</span>
                </div>
                <span className={`text-[8px] rounded-[5px] px-1.5 py-0.5 leading-none shrink-0 font-extrabold ${
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

        {/* ④ DYNAMIC APPLICATION LIST CONTAINER */}
        {(() => {
          // Find single highest priority application
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
              className="space-y-1.5 px-0.5"
            >
              {filteredApplications.map((app, idx) => {
                const statusStyle = getStatusStyles(app.status);
                const isAppSelected = selectedApp?.id === app.id;
                const isHighestPriority = highestPriorityAppId === app.id;
                const compLabel = app.compensation > 1000 ? `$${Math.round(app.compensation/1000)}k` : `$${app.compensation}/mo`;
                const upcomingAction = getUpcomingAction(app);

                let cardBorderClass = "";
                let cardBgClass = "";
                let cardShadowClass = "";
                let accentGlow = "";

                const s = app.status?.toLowerCase() || "";
                if (s === "wishlist" || s === "planning") {
                  cardBorderClass = isDark ? "border-zinc-500/10 hover:border-zinc-500/20" : "border-zinc-300/30 hover:border-zinc-300/60";
                  cardBgClass = isDark ? "bg-[#0b0b0c]" : "bg-zinc-50/[0.2]";
                  cardShadowClass = "shadow-[0_1px_3px_rgba(0,0,0,0.01)]";
                  accentGlow = isDark ? "bg-zinc-500/40" : "bg-zinc-400";
                } else if (s === "applied") {
                  cardBorderClass = isDark ? "border-blue-500/15 hover:border-blue-500/30" : "border-blue-200/50 hover:border-blue-300/80";
                  cardBgClass = isDark ? "bg-[#0a0c10]" : "bg-blue-50/[0.15]";
                  cardShadowClass = isDark ? "shadow-[0_2px_10px_-4px_rgba(59,130,246,0.12)]" : "shadow-[0_2px_10px_-4px_rgba(59,130,246,0.06)]";
                  accentGlow = "bg-blue-500";
                } else if (s.includes("scheduled") || s.includes("oa")) {
                  cardBorderClass = isDark ? "border-amber-500/15 hover:border-amber-500/30" : "border-amber-200/50 hover:border-amber-300/80";
                  cardBgClass = isDark ? "bg-[#0e0c09]" : "bg-amber-50/[0.15]";
                  cardShadowClass = isDark ? "shadow-[0_2px_10px_-4px_rgba(245,158,11,0.12)]" : "shadow-[0_2px_10px_-4px_rgba(245,158,11,0.06)]";
                  accentGlow = "bg-amber-500";
                } else if (s === "interview") {
                  cardBorderClass = isDark ? "border-indigo-500/20 hover:border-indigo-500/35" : "border-indigo-200/60 hover:border-indigo-300/90";
                  cardBgClass = isDark ? "bg-[#0c0a10]" : "bg-indigo-50/[0.15]";
                  cardShadowClass = isDark ? "shadow-[0_2px_12px_-4px_rgba(99,102,241,0.15)]" : "shadow-[0_2px_12px_-4px_rgba(99,102,241,0.08)]";
                  accentGlow = "bg-indigo-500";
                } else if (s === "offer") {
                  cardBorderClass = isDark ? "border-emerald-500/20 hover:border-emerald-500/35" : "border-emerald-200/60 hover:border-emerald-300/90";
                  cardBgClass = isDark ? "bg-[#090e0b]" : "bg-emerald-50/[0.15]";
                  cardShadowClass = isDark ? "shadow-[0_2px_12px_-4px_rgba(16,185,129,0.15)]" : "shadow-[0_2px_12px_-4px_rgba(16,185,129,0.08)]";
                  accentGlow = "bg-emerald-500";
                } else if (s === "rejected") {
                  cardBorderClass = isDark ? "border-red-500/10 hover:border-red-500/25" : "border-red-200/30 hover:border-red-300/60";
                  cardBgClass = isDark ? "bg-[#0c0909]" : "bg-red-50/[0.04]";
                  cardShadowClass = "shadow-[0_1px_3px_rgba(0,0,0,0.01)]";
                  accentGlow = "bg-red-500/50";
                } else {
                  cardBorderClass = isDark ? "border-white/[0.03] hover:border-white/[0.06]" : "border-zinc-200/30 hover:border-zinc-200/60";
                  cardBgClass = isDark ? "bg-[#0a0a0b]" : "bg-white";
                  cardShadowClass = "shadow-[0_1px_2px_rgba(0,0,0,0.02)]";
                  accentGlow = "bg-zinc-500";
                }

                return (
                  <motion.div 
                    key={app.id}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.003,
                      y: -0.2,
                      backgroundColor: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.003)"
                    }}
                    whileTap={{ scale: 0.995, y: 0 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                    onClick={() => {
                      setSelectedApp(app);
                      setCurrentScreen("tracker_detail");
                    }}
                    className={`group py-2.5 px-3.5 flex items-center justify-between cursor-pointer border rounded-[10px] transition-all relative select-none ${cardBorderClass} ${cardShadowClass} ${cardBgClass} ${
                      isAppSelected 
                        ? isDark 
                          ? "ring-1 ring-blue-500/20 bg-blue-950/5" 
                          : "ring-1 ring-blue-500/15 bg-blue-50/15"
                        : ""
                    }`}
                  >
                    {/* Status accent stripe on the left */}
                    <div className={`absolute left-0 top-2 bottom-2 w-[2.5px] ${accentGlow} rounded-r transition-all`} />

                    {/* Left side: Logo & Text details */}
                    <div className="flex items-center space-x-3 min-w-0 pl-1">
                      <div className="shrink-0 flex items-center justify-center">
                        {getCompanyLogo(app.company, isDark, "w-[21px] h-[21px] text-[8.5px] font-bold rounded-full")}
                      </div>

                      <div className="min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 leading-none">
                          <h4 className={`text-[11px] font-bold tracking-tight leading-none ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                            {app.company}
                          </h4>
                          <span className={`text-[5.5px] uppercase font-bold tracking-wider px-1 py-0.2 rounded shrink-0 ${
                            isDark ? "bg-zinc-850 text-zinc-400" : "bg-zinc-100 text-zinc-500"
                          }`}>
                            {app.isInternship ? "Intern" : "FTE"}
                          </span>
                        </div>
                        {/* Role Title */}
                        <p className={`text-[10px] font-semibold tracking-tight mt-[3px] leading-tight ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                          {app.role}
                        </p>
                        {/* Location and Salary subtle metadata */}
                        <p className={`text-[8.5px] font-normal leading-none mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                          {app.location || "Remote"}  •  {compLabel}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Clean, text-only status (no pill background/border) + Chevron */}
                    <div className="flex items-center space-x-2 shrink-0 ml-3">
                      <span className={`text-[8.5px] font-extrabold tracking-widest uppercase leading-none ${
                        s === "wishlist" || s === "planning" ? (isDark ? "text-zinc-500" : "text-zinc-400") :
                        s === "applied" ? "text-blue-500 dark:text-blue-400" :
                        s.includes("oa") || s.includes("assessment") ? "text-amber-500 dark:text-amber-400" :
                        s === "interview" ? "text-indigo-500 dark:text-indigo-400" :
                        s === "offer" ? "text-emerald-500 dark:text-emerald-400" :
                        s === "rejected" ? "text-red-500 dark:text-red-400" :
                        isDark ? "text-zinc-400" : "text-zinc-500"
                      }`}>
                        {statusStyle.label}
                      </span>
                      <ChevronRight size={11} className={isDark ? "text-zinc-700 group-hover:text-zinc-400" : "text-zinc-400 group-hover:text-zinc-600"} />
                    </div>
                  </motion.div>
                );
              })}

              {filteredApplications.length === 0 && (
                <div className={`py-12 text-center text-zinc-500 text-xs font-mono p-4 rounded-[6px] border ${
                  isDark ? "bg-[#111113] border-white/[0.012]" : "bg-white border-zinc-200"
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

  // ⑥ RENDER DETAILS SCREEN OVERHAUL
  if (currentScreen === "tracker_detail" && selectedApp) {
    // Normalization logic for 5 core pipeline stages
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

    // Format compensation
    const formattedComp = selectedApp.compensation > 1000 
      ? `$${selectedApp.compensation.toLocaleString()}` 
      : `$${selectedApp.compensation}/mo`;

    // Interactive timeline stages
    const timelineStages: Array<"Wishlist" | "Applied" | "Assessment" | "Interview" | "Offer"> = [
      "Wishlist", "Applied", "Assessment", "Interview", "Offer"
    ];

    // Helper to map timeline click to status val
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

    // Auto-save notes handler
    const handleLocalNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      const updatedApp = { ...selectedApp, notes: val };
      setSelectedApp(updatedApp);
      setApplications(applications.map(app => app.id === selectedApp.id ? updatedApp : app));

      setNotesSaveStatus("Saving...");
      if (notesSaveTimeoutRef.current) clearTimeout(notesSaveTimeoutRef.current);
      notesSaveTimeoutRef.current = setTimeout(() => {
        setNotesSaveStatus("Saved");
      }, 500);
    };

    // Copy & generate Share payload
    const handleShare = () => {
      const payload = `💼 PlacementOS Record\n🏢 Company: ${selectedApp.company}\n🎯 Role: ${selectedApp.role}\n📍 Location: ${selectedApp.location || "Remote"}\n💵 Salary: ${formattedComp}\n📈 Stage: ${selectedApp.status}\n🔗 Link: ${selectedApp.jobUrl || "None"}`;
      navigator.clipboard.writeText(payload);
      showToast("Metadata copied to clipboard", "success");
      setShowShareModal(true);
    };

    // Simulated archive
    const handleArchive = () => {
      showToast(`Opportunity for ${selectedApp.company} archived.`, "info");
    };

    // Next Action Card Content based on stage
    const getStageAction = (stage: "Wishlist" | "Applied" | "Assessment" | "Interview" | "Offer", company: string) => {
      switch (stage) {
        case "Wishlist":
          return {
            title: "Submit Application",
            desc: `Tailor your technical portfolio and finalize key resumes before the pipeline peaks for ${company}.`,
            tag: "Wishlist Track",
            colorClass: "bg-zinc-500/[0.04] border-zinc-500/15 text-zinc-600 dark:text-zinc-400",
            dotClass: "bg-zinc-400"
          };
        case "Applied":
          return {
            title: "Track Response",
            desc: "Application successfully submitted. Monitor communication channels for interview invitations or assessment links.",
            tag: "Under Review",
            colorClass: "bg-blue-500/[0.04] border-blue-500/15 text-blue-600 dark:text-blue-400",
            dotClass: "bg-blue-500"
          };
        case "Assessment":
          return {
            title: "Complete Technical Screenings",
            desc: "Practice algorithmic puzzles, review sample case studies, and finalize the coding assessment.",
            tag: "OA Scheduled",
            colorClass: "bg-orange-500/[0.04] border-orange-500/15 text-orange-600 dark:text-orange-400",
            dotClass: "bg-orange-500"
          };
        case "Interview":
          return {
            title: "Prepare Interview Materials",
            desc: "Review core computer science principles, system design trade-offs, and conduct a practice run.",
            tag: "Interview Scheduled",
            colorClass: "bg-purple-500/[0.04] border-purple-500/15 text-purple-600 dark:text-purple-400",
            dotClass: "bg-purple-500"
          };
        case "Offer":
          return {
            title: "Evaluate Offer Conditions",
            desc: "Outstanding milestone achieved! Review base salary terms, relocation packages, and target start dates.",
            tag: "Offer Received",
            colorClass: "bg-emerald-500/[0.04] border-emerald-500/15 text-emerald-600 dark:text-emerald-400",
            dotClass: "bg-emerald-500"
          };
      }
    };

    const stageAction = getStageAction(normalizedStage, selectedApp.company);

    const getStageColor = (stage: "Wishlist" | "Applied" | "Assessment" | "Interview" | "Offer") => {
      switch (stage) {
        case "Wishlist": return { fill: "bg-zinc-500", text: "text-zinc-500 dark:text-zinc-400", ring: "ring-zinc-500/10" };
        case "Applied": return { fill: "bg-blue-500", text: "text-blue-500", ring: "ring-blue-500/10" };
        case "Assessment": return { fill: "bg-orange-500", text: "text-orange-500", ring: "ring-orange-500/10" };
        case "Interview": return { fill: "bg-purple-500", text: "text-purple-500", ring: "ring-purple-500/10" };
        case "Offer": return { fill: "bg-emerald-500", text: "text-emerald-500", ring: "ring-emerald-500/10" };
      }
    };

    return (
      <div className="space-y-4 pb-12 select-none font-sans relative">
        {/* Navigation & Actions Topbar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-500/[0.04]">
          <button 
            onClick={() => {
              setSelectedApp(null);
              setCurrentScreen("tracker");
            }}
            className="flex items-center text-[12px] font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer transition-colors"
          >
            <ArrowLeft size={13} className="mr-1.5" /> Back
          </button>

          {/* Premium Minimal Actions */}
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
              className={`h-7 px-3 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                isDark 
                  ? "border-[#FFFFFF08] text-zinc-300 hover:bg-zinc-900 hover:text-white" 
                  : "border-zinc-200/50 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-xs"
              }`}
            >
              <Edit size={11} />
              <span>Edit</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                className={`h-7 w-7 rounded-lg border flex items-center justify-center cursor-pointer transition-all active:scale-95 ${
                  isDark 
                    ? "border-[#FFFFFF08] text-zinc-300 hover:bg-zinc-900" 
                    : "border-zinc-200/50 text-zinc-600 hover:bg-zinc-50 shadow-xs"
                }`}
              >
                <MoreHorizontal size={12} />
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
                      className={`absolute right-0 mt-1.5 w-36 rounded-xl border p-1 z-50 shadow-sm ${
                        isDark 
                          ? "bg-[#0B0B0C] border-[#FFFFFF08] text-zinc-200" 
                          : "bg-white border-zinc-200/50 text-zinc-700"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          handleShare();
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Share2 size={12} />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          handleArchive();
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Archive size={12} />
                        <span>Archive</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowOverflowMenu(false);
                          handleDeleteApplication(selectedApp.id);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg text-red-500 hover:bg-red-500/5 transition-colors flex items-center gap-2 cursor-pointer"
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

        {/* Header Hero Section */}
        <div className="flex items-start space-x-3.5 pt-1">
          {getCompanyLogo(selectedApp.company, isDark, "w-11 h-11 text-base font-semibold mt-0.5")}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div>
              <h1 className={`text-lg font-bold tracking-tight leading-tight truncate ${isDark ? "text-white" : "text-zinc-950"}`}>
                {selectedApp.company}
              </h1>
              <p className={`text-[13px] font-semibold tracking-tight leading-tight mt-0.5 ${isDark ? "text-zinc-300" : "text-zinc-700"} truncate`}>
                {selectedApp.role}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                {selectedApp.location || "Remote"}
              </span>
              <span className="text-zinc-300 dark:text-zinc-800">•</span>
              {/* Salary in subtle green accent */}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formattedComp}
              </span>
            </div>

            <div className="pt-0.5">
              {/* Colored Status Badge */}
              <span className={`text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border ${
                normalizedStage === "Applied"
                  ? "bg-blue-500/[0.04] text-blue-500 border-blue-500/10"
                  : normalizedStage === "Assessment"
                    ? "bg-orange-500/[0.04] text-orange-500 border-orange-500/10"
                    : normalizedStage === "Interview"
                      ? "bg-purple-500/[0.04] text-purple-500 border-purple-500/10"
                      : normalizedStage === "Offer"
                        ? "bg-emerald-500/[0.04] text-emerald-500 border-emerald-500/10"
                        : "bg-zinc-500/[0.04] text-zinc-500 border-zinc-500/10"
              }`}>
                {normalizedStage}
              </span>
            </div>
          </div>
        </div>

        {/* Next Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-start gap-3 ${stageAction.colorClass}`}
        >
          <div className="space-y-1 flex-1 pl-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider">{stageAction.tag}</span>
              <span className={`w-1 h-1 rounded-full ${stageAction.dotClass}`} />
              <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-mono font-medium">NEXT STEP</span>
            </div>
            
            <h3 className={`text-[12.5px] font-semibold tracking-tight leading-snug ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              {stageAction.title}
            </h3>
            
            <p className={`text-[11px] leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              {stageAction.desc}
            </p>
          </div>
        </motion.div>

        {/* Clean Progress Timeline */}
        <div className={`p-4 rounded-xl border ${
          isDark ? "bg-[#0B0B0C] border-[#FFFFFF08]" : "bg-white border-zinc-200/50 shadow-sm"
        }`}>
          <div className="flex items-center justify-between relative py-2 px-1">
            {/* Horizontal timeline track line - perfectly centered vertically */}
            <div className="absolute left-[8%] right-[8%] top-[24px] h-[1px] bg-zinc-200 dark:bg-zinc-800/80 z-0" />

            {/* Stages nodes */}
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
                  <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all ${
                    isCurrent 
                      ? `${colors.fill} text-white ring-4 ${colors.ring}` 
                      : isDone 
                        ? `${colors.fill} text-white` 
                        : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400"
                  }`}>
                    {isDone ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <span className="text-[10px] font-semibold">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-[8.5px] font-semibold mt-1.5 transition-colors tracking-tight text-center truncate max-w-[48px] block leading-none ${
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

        {/* Simple Fully-Aligned Details List */}
        <div className={`p-4 rounded-xl border ${
          isDark ? "bg-[#0B0B0C] border-[#FFFFFF08]" : "bg-white border-zinc-200/50 shadow-sm"
        }`}>
          <h4 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-mono">Job Details</h4>
          
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40 text-[11px]">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-mono tracking-wider uppercase">Location</span>
              <span className={`font-semibold text-right ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                {selectedApp.location || "Remote"}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-mono tracking-wider uppercase">Salary</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-right">
                {formattedComp}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-mono tracking-wider uppercase">Applied Date</span>
              <span className={`font-semibold text-right ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                {new Date(selectedApp.appliedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-mono tracking-wider uppercase">Deadline</span>
              <span className={`font-semibold text-right ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                {selectedApp.deadline 
                  ? new Date(selectedApp.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
                  : "None"
                }
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-mono tracking-wider uppercase">Source</span>
              <span className={`font-semibold text-right ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                {selectedApp.source || "Direct"}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2.5">
              <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-mono tracking-wider uppercase">External Link</span>
              {selectedApp.jobUrl ? (
                <a 
                  href={selectedApp.jobUrl} 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="text-blue-500 hover:text-blue-400 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer text-right"
                >
                  <span>Link</span>
                  <ExternalLink size={10} />
                </a>
              ) : (
                <span className="text-zinc-400 text-right font-semibold">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Share Sheets Popup Overlay */}
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
                className={`relative w-full max-w-sm rounded-[24px] border p-6 z-10 shadow-2xl ${
                  isDark 
                    ? "bg-[#121214] border-zinc-800 text-white" 
                    : "bg-white border-zinc-200 text-zinc-900"
                }`}
              >
                <button
                  onClick={() => setShowShareModal(false)}
                  className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-200"
                >
                  <X size={14} />
                </button>

                <div className="text-center space-y-1 mb-4">
                  <h3 className="text-sm font-bold tracking-tight">Share Opportunity</h3>
                  <p className="text-[11px] text-zinc-500">Metadata successfully formatted</p>
                </div>

                <div className={`p-3 rounded-2xl border text-[10px] font-mono whitespace-pre-wrap leading-relaxed ${
                  isDark ? 'bg-zinc-950/40 border-white/[0.02] text-zinc-300' : 'bg-zinc-50 border-zinc-200/40 text-zinc-700'
                }`}>
                  {`💼 PlacementOS Record\n🏢 Company: ${selectedApp.company}\n🎯 Role: ${selectedApp.role}\n📍 Location: ${selectedApp.location || "Remote"}\n💵 Salary: ${formattedComp}\n📈 Stage: ${selectedApp.status}`}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`PlacementOS Opportunity details copy completed!`);
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
