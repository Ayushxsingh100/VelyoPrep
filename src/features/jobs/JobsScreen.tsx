import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowUpRight, Plus, Trash2 } from "lucide-react";

const BRAND_THEMES: Record<string, { bg: string; text: string; gradient: string }> = {
  linkedin: { bg: "bg-blue-500/10 dark:bg-blue-400/10", text: "text-blue-600 dark:text-blue-400", gradient: "from-blue-500/20 to-indigo-500/10" },
  wellfound: { bg: "bg-rose-500/10 dark:bg-rose-400/10", text: "text-rose-600 dark:text-rose-400", gradient: "from-rose-500/20 to-red-500/10" },
  indeed: { bg: "bg-indigo-500/10 dark:bg-indigo-400/10", text: "text-indigo-600 dark:text-indigo-400", gradient: "from-indigo-500/20 to-blue-500/10" },
  glassdoor: { bg: "bg-emerald-500/10 dark:bg-emerald-400/10", text: "text-emerald-600 dark:text-emerald-400", gradient: "from-emerald-500/20 to-teal-500/10" },
  internshala: { bg: "bg-cyan-500/10 dark:bg-cyan-400/10", text: "text-cyan-600 dark:text-cyan-400", gradient: "from-cyan-500/20 to-sky-500/10" },
  naukri: { bg: "bg-violet-500/10 dark:bg-violet-400/10", text: "text-violet-600 dark:text-violet-400", gradient: "from-violet-500/20 to-purple-500/10" },
  hirect: { bg: "bg-teal-500/10 dark:bg-teal-400/10", text: "text-teal-600 dark:text-teal-400", gradient: "from-teal-500/20 to-emerald-500/10" },
  ycombinator: { bg: "bg-orange-500/10 dark:bg-orange-400/10", text: "text-orange-600 dark:text-orange-400", gradient: "from-orange-500/20 to-amber-500/10" },
  google: { bg: "bg-red-500/10 dark:bg-red-400/10", text: "text-red-600 dark:text-red-400", gradient: "from-red-500/20 to-rose-500/10" },
  microsoft: { bg: "bg-sky-500/10 dark:bg-sky-400/10", text: "text-sky-600 dark:text-sky-400", gradient: "from-sky-500/20 to-blue-500/10" },
  amazon: { bg: "bg-amber-500/10 dark:bg-amber-400/10", text: "text-amber-600 dark:text-amber-400", gradient: "from-amber-500/20 to-orange-500/10" },
  apple: { bg: "bg-zinc-500/10 dark:bg-zinc-400/10", text: "text-zinc-700 dark:text-zinc-300", gradient: "from-zinc-500/20 to-zinc-400/10" },
  meta: { bg: "bg-blue-600/10 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", gradient: "from-blue-600/20 to-indigo-600/10" },
  adobe: { bg: "bg-rose-600/10 dark:bg-rose-500/10", text: "text-rose-700 dark:text-rose-400", gradient: "from-rose-600/20 to-red-600/10" },
  atlassian: { bg: "bg-indigo-600/10 dark:bg-indigo-500/10", text: "text-indigo-700 dark:text-indigo-400", gradient: "from-indigo-600/20 to-violet-600/10" },
  uber: { bg: "bg-zinc-800/10 dark:bg-zinc-200/10", text: "text-zinc-850 dark:text-zinc-205", gradient: "from-zinc-800/20 to-zinc-700/10" }
};

const LogoIcon: React.FC<{ id: string; className?: string }> = ({ id, className = "w-5 h-5" }) => {
  switch (id) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case "wellfound":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      );
    case "indeed":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <circle cx="5" cy="5" r="2.5" />
          <path d="M3 10h4v11H3zM10 10h4v1.5c1-1.2 2.5-2 4.5-2 3.5 0 5.5 2.5 5.5 6.5V21h-4v-6c0-2.5-1-3.5-2.5-3.5S14 12.5 14 15v6h-4V10z"/>
        </svg>
      );
    case "glassdoor":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16M4 12a8 8 0 0 1 16 0M4 12a8 8 0 0 0 16 0"/>
        </svg>
      );
    case "internshala":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
        </svg>
      );
    case "naukri":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <path d="M9 17V7l6 10V7"/>
        </svg>
      );
    case "hirect":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21a9 9 0 1 0-9-9c0 1.48.36 2.89 1 4.14L3 21l4.86-1c1.25.64 2.66 1 4.14 1z"/>
          <path d="M9 9h6M9 13h6"/>
        </svg>
      );
    case "ycombinator":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 11.5L8.5 5h2.5l2.25 4.5L15.5 5h2.5L14.5 11.5V19h-2.5v-7.5z"/>
        </svg>
      );
    case "google":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.76-8.24-8.385s3.7-8.385 8.24-8.385c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.575 1.5 15.655 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z"/>
        </svg>
      );
    case "microsoft":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <rect x="1" y="1" width="10" height="10" />
          <rect x="13" y="1" width="10" height="10" />
          <rect x="1" y="13" width="10" height="10" />
          <rect x="13" y="13" width="10" height="10" />
        </svg>
      );
    case "amazon":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 15 0"/>
          <path d="M3 15c4 2 10 2 14 0l4 4"/>
        </svg>
      );
    case "apple":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.01 2.16-.52 2.82-1.33z"/>
        </svg>
      );
    case "meta":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17a5 5 0 1 1 0-10c3 0 7 10 10 10a5 5 0 1 0 0-10c-3 0-7 10-10 10z"/>
        </svg>
      );
    case "adobe":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M14.5 2H22v15.5L14.5 2zm-5 0H2v15.5L9.5 2zM12 9.5L18.3 22H14.8l-2.8-5.7H9.2l2.8 5.7H5.7L12 9.5z"/>
        </svg>
      );
    case "atlassian":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16M12 4L4 20h8l2-4h4l2 4"/>
        </svg>
      );
    case "uber":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
        </svg>
      );
  }
};

interface JobsScreenProps {
  applications: any[];
  setApplications: React.Dispatch<React.SetStateAction<any[]>>;
  deadlines: any[];
  setDeadlines: React.Dispatch<React.SetStateAction<any[]>>;
  savedOpportunities: any[];
  setSavedOpportunities: React.Dispatch<React.SetStateAction<any[]>>;
  recentlyVisitedPortals: string[];
  setRecentlyVisitedPortals: React.Dispatch<React.SetStateAction<string[]>>;
  jobSearchQuery: string;
  setJobSearchQuery: (v: string) => void;
  jobPortalFilter: string;
  setJobPortalFilter: (v: string) => void;
  jobCategoryFilter: string;
  setJobCategoryFilter: (v: string) => void;
  jobBookmarkFilter: string;
  setJobBookmarkFilter: (v: string) => void;
  jobAppliedFilter: string;
  setJobAppliedFilter: (v: string) => void;
  jobSortOption: string;
  setJobSortOption: (v: string) => void;
  selectedOpportunityId: string | null;
  setSelectedOpportunityId: (v: string | null) => void;
  activeJobCategoryTab: string;
  setActiveJobCategoryTab: (v: string) => void;
  formJobCompany: string;
  setFormJobCompany: (v: string) => void;
  formJobRole: string;
  setFormJobRole: (v: string) => void;
  formJobPortal: string;
  setFormJobPortal: (v: string) => void;
  formJobUrl: string;
  setFormJobUrl: (v: string) => void;
  formJobLocation: string;
  setFormJobLocation: (v: string) => void;
  formJobDeadline: string;
  setFormJobDeadline: (v: string) => void;
  formJobNotes: string;
  setFormJobNotes: (v: string) => void;
  formJobCategory: string;
  setFormJobCategory: (v: string) => void;
  formJobBookmarked: boolean;
  setFormJobBookmarked: (v: boolean) => void;
  isLoadingJobs: boolean;
  setIsLoadingJobs: (v: boolean) => void;
  jobPortalSubTab: "dashboard" | "portals" | "ai_capture" | "saved";
  setJobPortalSubTab: React.Dispatch<React.SetStateAction<"dashboard" | "portals" | "ai_capture" | "saved">>;
  aiCaptureUrl: string;
  setAiCaptureUrl: (v: string) => void;
  aiCaptureOutcome: "success" | "invalid_url" | "unsupported" | "network_fail" | "timeout" | "malformed";
  setAiCaptureOutcome: (v: "success" | "invalid_url" | "unsupported" | "network_fail" | "timeout" | "malformed") => void;
  isAiCapturing: boolean;
  setIsAiCapturing: (v: boolean) => void;
  aiCaptureStep: "idle" | "fetching" | "processing" | "extracting" | "preparing" | "review" | "done";
  setAiCaptureStep: (v: "idle" | "fetching" | "processing" | "extracting" | "preparing" | "review" | "done") => void;
  aiCaptureError: string | null;
  setAiCaptureError: (v: string | null) => void;
  reviewCompany: string;
  setReviewCompany: (v: string) => void;
  reviewRole: string;
  setReviewRole: (v: string) => void;
  reviewEmploymentType: string;
  setReviewEmploymentType: (v: string) => void;
  reviewLocation: string;
  setReviewLocation: (v: string) => void;
  reviewSalary: string;
  setReviewSalary: (v: string) => void;
  reviewDeadline: string;
  setReviewDeadline: (v: string) => void;
  reviewExperience: string;
  setReviewExperience: (v: string) => void;
  reviewEligibility: string;
  setReviewEligibility: (v: string) => void;
  reviewRequiredSkills: string[];
  setReviewRequiredSkills: React.Dispatch<React.SetStateAction<string[]>>;
  reviewPreferredSkills: string[];
  setReviewPreferredSkills: React.Dispatch<React.SetStateAction<string[]>>;
  reviewSummary: string;
  setReviewSummary: (v: string) => void;
  reviewPortal: string;
  setReviewPortal: (v: string) => void;
  reviewUrl: string;
  setReviewUrl: (v: string) => void;
  reviewCreateDeadline: boolean;
  setReviewCreateDeadline: (v: boolean) => void;
  newRequiredSkillInput: string;
  setNewRequiredSkillInput: (v: string) => void;
  newPreferredSkillInput: string;
  setNewPreferredSkillInput: (v: string) => void;
  reviewConfidence: Record<string, number>;
  setReviewConfidence: (v: Record<string, number>) => void;
  aiCaptureHistory: any[];
  setAiCaptureHistory: React.Dispatch<React.SetStateAction<any[]>>;
  simulateNetworkFailure: boolean;
  setSimulateNetworkFailure: (v: boolean) => void;
  isDark: boolean;
  themeCardClass: string;
  themeInputBg: string;
  themeBorderClass: string;
  showToast: (message: string, type: "success" | "warning" | "error" | "info") => void;
}

const DEFAULT_WEBSITES = [
  { id: "linkedin", name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/", desc: "Global professional network for corporate & tech careers." },
  { id: "wellfound", name: "Wellfound", url: "https://wellfound.com/jobs", desc: "Startups & tech disruptor career matching." },
  { id: "indeed", name: "Indeed", url: "https://www.indeed.com/", desc: "Comprehensive aggregate search for active listings." },
  { id: "glassdoor", name: "Glassdoor", url: "https://www.glassdoor.com/Job/index.htm", desc: "Job listings accompanied by honest corporate reviews." },
  { id: "internshala", name: "Internshala", url: "https://internshala.com/", desc: "Leading student internship and entry level roles." },
  { id: "naukri", name: "Naukri", url: "https://www.naukri.com/", desc: "Primary corporate recruitment and placement network." },
  { id: "hirect", name: "Hirect", url: "https://www.hirect.in/", desc: "Direct chat channels with verified startup hiring teams." },
  { id: "ycombinator", name: "Y Combinator", url: "https://www.workatastartup.com/", desc: "Apply directly to fast-scaling funded YC startups." },
  { id: "google", name: "Google Careers", url: "https://careers.google.com/", desc: "Software engineering, infrastructure and design roles." },
  { id: "microsoft", name: "Microsoft", url: "https://careers.microsoft.com/", desc: "Enterprise cloud, platform tools and hardware careers." },
  { id: "amazon", name: "Amazon Jobs", url: "https://amazon.jobs/", desc: "Global fulfillment networks, AWS architecture & retail." },
  { id: "apple", name: "Apple Careers", url: "https://www.apple.com/careers/", desc: "Consumer hardware, core macOS/iOS software & design." },
  { id: "meta", name: "Meta Careers", url: "https://www.metacareers.com/", desc: "High throughput social products & deep AI framework teams." },
  { id: "adobe", name: "Adobe Careers", url: "https://careers.adobe.com/", desc: "Creative tools, layout frameworks, and document systems." },
  { id: "atlassian", name: "Atlassian", url: "https://careers.atlassian.com/", desc: "Workforce collaboration and developer tooling systems." },
  { id: "uber", name: "Uber Careers", url: "https://careers.uber.com/", desc: "Real-time routing, distributed systems and dispatch scale." }
];

export const JobsScreen: React.FC<JobsScreenProps> = (props) => {
  const { isDark, showToast } = props;
  
  const [searchVal, setSearchVal] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [customPortals, setCustomPortals] = useState<{ id: string; name: string; url: string; desc: string }[]>(() => {
    try {
      const saved = localStorage.getItem("jobhub_custom_portals_v3");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    localStorage.setItem("jobhub_custom_portals_v3", JSON.stringify(customPortals));
  }, [customPortals]);

  const combinedPortals = [...DEFAULT_WEBSITES, ...customPortals];

  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      showToast("Please enter a portal name", "warning");
      return;
    }
    if (!newUrl.trim()) {
      showToast("Please enter a website URL", "warning");
      return;
    }

    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const uniqueId = `custom_${Date.now()}`;
    const newPortal = {
      id: uniqueId,
      name: newName.trim(),
      url: formattedUrl,
      desc: newDesc.trim() || "User added custom directory link."
    };

    setCustomPortals(prev => [...prev, newPortal]);
    showToast(`Added ${newName} to portals`, "success");

    setNewName("");
    setNewUrl("");
    setNewDesc("");
    setIsAdding(false);
  };

  const handleDeletePortal = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomPortals(prev => prev.filter(item => item.id !== id));
    showToast(`Deleted ${name} portal`, "info");
  };

  const launchPortal = (url: string, name: string) => {
    showToast(`Launching ${name}`, "success");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filteredWebsites = combinedPortals.filter(portal => {
    const q = searchVal.trim().toLowerCase();
    if (!q) return true;
    return portal.name.toLowerCase().includes(q) || portal.desc.toLowerCase().includes(q);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-7 pb-10 font-sans text-left"
    >
      <div className="pt-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-450 uppercase font-mono leading-none block mb-1">
            Explore Directory
          </span>
          <h1 className={`text-[28px] font-extrabold tracking-tight leading-none ${isDark ? "text-white" : "text-zinc-950"}`}>
            Job Hub
          </h1>
        </div>

        <motion.button
          whileHover={{ 
            scale: 1.05
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          title={isAdding ? "Close Panel" : "Add Custom Portal"}
          aria-label={isAdding ? "Close Panel" : "Add Custom Portal"}
          className={`relative overflow-hidden w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 border shadow-sm active:scale-95 ${
            isAdding
              ? isDark
                ? "bg-[#121214] border-zinc-800 text-red-400 hover:text-red-350"
                : "bg-white border-zinc-200 text-red-600 hover:text-red-700 hover:bg-zinc-50"
              : "bg-blue-600 border-blue-500 hover:bg-blue-550 text-white shadow-sm"
          }`}
        >
          {!isAdding && (
            <motion.span
              animate={{ x: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
          )}
          
          <motion.div
            animate={{ rotate: isAdding ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10 flex items-center justify-center"
          >
            <Plus className="w-5.5 h-5.5" />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className={`overflow-hidden border rounded-2xl p-6 space-y-5.5 ${
              isDark ? "bg-[#121214] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            <h2 className={`text-base font-extrabold tracking-tight text-left ${isDark ? "text-zinc-100" : "text-zinc-850"}`}>
              Add Custom Website Link
            </h2>

            <form onSubmit={handleAddWebsite} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono block">Portal Name</label>
                <input
                  type="text"
                  placeholder="e.g. RemoteOK, My Job Board"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all duration-150 ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-semibold"
                      : "bg-[#FAFAFA] border-zinc-200 text-zinc-900 focus:border-blue-500 font-semibold"
                  }`}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono block">Website URL</label>
                <input
                  type="text"
                  placeholder="e.g. remoteok.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all duration-150 ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-semibold"
                      : "bg-[#FAFAFA] border-[#E4E4E7] text-zinc-900 focus:border-blue-500 font-semibold"
                  }`}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono block">Short Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Curated tech & remote channels."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all duration-150 ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-semibold"
                      : "bg-[#FAFAFA] border-[#E4E4E7] text-zinc-900 focus:border-blue-500 font-semibold"
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-550 active:scale-98 text-white font-bold text-sm tracking-wider transition-colors shadow-md shadow-blue-600/10 cursor-pointer animate-none"
              >
                Add Portal to Hub
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ scale: isSearchFocused ? 1.002 : 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={`relative flex items-center h-14 px-5 rounded-2xl border transition-all duration-200 ${
          isSearchFocused
            ? isDark
              ? "border-blue-500 ring-1 ring-blue-500/25 bg-[#121214]"
              : "border-blue-500 ring-1 ring-blue-500/10 bg-white"
            : isDark
            ? "bg-[#121214] border-zinc-800 text-white"
            : "bg-white border-zinc-200 text-zinc-900 shadow-sm"
        }`}
      >
        <Search className={`w-5 h-5 shrink-0 transition-colors ${isSearchFocused ? "text-blue-500" : isDark ? "text-zinc-400" : "text-zinc-550"}`} />
        <input
          type="text"
          placeholder="Search corporate & startup portals..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className={`flex-1 min-w-0 h-full bg-transparent outline-none text-sm px-3.5 font-semibold placeholder-zinc-550 ${
            isDark ? "text-white" : "text-zinc-900"
          }`}
        />
        {searchVal && (
          <button
            onClick={() => setSearchVal("")}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              isDark ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700" : "bg-zinc-100 text-zinc-550 hover:bg-zinc-200"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <span className={`text-xs font-bold uppercase tracking-widest block leading-none ${
            isDark ? "text-zinc-400" : "text-zinc-550"
          }`}>
            {searchVal ? `Matches (${filteredWebsites.length})` : "Portals Available"}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isDark ? "bg-zinc-800/80 text-zinc-300" : "bg-zinc-100 text-zinc-600"
          }`}>
            {filteredWebsites.length} Active Channels
          </span>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-3.5">
          {filteredWebsites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-12 text-center rounded-2xl border border-dashed ${
                isDark ? "border-zinc-800 bg-[#121214]" : "border-zinc-200 bg-white"
              }`}
            >
              <p className={`text-xs font-bold ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                No matching portals found. Try typing another keyword or create a custom one!
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredWebsites.map((portal) => {
                const isCustom = portal.id.startsWith("custom_");
                
                const customColorIndex = portal.name.length % 5;
                const customGradients = [
                  { bg: "bg-purple-500/10", text: "text-purple-500", gradient: "from-purple-500/20 to-pink-500/10" },
                  { bg: "bg-blue-500/10", text: "text-blue-500", gradient: "from-blue-500/20 to-cyan-500/10" },
                  { bg: "bg-teal-500/10", text: "text-teal-500", gradient: "from-teal-500/20 to-emerald-500/10" },
                  { bg: "bg-amber-500/10", text: "text-amber-500", gradient: "from-amber-500/20 to-orange-500/10" },
                  { bg: "bg-rose-500/10", text: "text-rose-500", gradient: "from-rose-500/20 to-pink-500/10" }
                ];

                const theme = isCustom 
                  ? customGradients[customColorIndex] 
                  : (BRAND_THEMES[portal.id] || { bg: "bg-zinc-500/10", text: "text-zinc-500", gradient: "from-zinc-500/10 to-zinc-400/10" });

                return (
                  <motion.div
                    key={portal.id}
                    layoutId={`portal-row-${portal.id}`}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    whileHover={{ y: -2, scale: 1.005 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    onClick={() => launchPortal(portal.url, portal.name)}
                    className={`relative overflow-hidden p-6 rounded-[20px] border transition-all duration-200 cursor-pointer group ${
                      isDark
                        ? "bg-[#121214] border-zinc-800/90 hover:bg-[#18181b] hover:border-zinc-700 text-white"
                        : "bg-white border-zinc-200/80 hover:bg-zinc-50/50 hover:border-zinc-300 shadow-[0_2px_8px_rgba(0,0,0,0.015)] text-zinc-950"
                    }`}
                  >
                    <div className={`absolute left-0 top-4.5 bottom-4.5 w-1 bg-gradient-to-b ${theme.gradient} rounded-r-full`} />

                    <div className="flex items-center justify-between min-w-0">
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.text} transition-transform duration-300 group-hover:scale-105`}>
                          {isCustom ? (
                            <span className="text-base font-extrabold uppercase">
                              {portal.name.charAt(0)}
                            </span>
                          ) : (
                            <LogoIcon id={portal.id} className="w-6.5 h-6.5" />
                          )}
                        </div>

                        <div className="min-w-0 text-left space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-[15px] font-extrabold tracking-tight leading-tight ${
                              isDark ? "text-white" : "text-zinc-900"
                            }`}>
                              {portal.name}
                            </h3>
                            {isCustom && (
                              <span className="text-[9.5px] font-bold uppercase bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded font-sans tracking-wide">
                                Custom
                              </span>
                            )}
                          </div>
                          <p className={`text-[13px] font-bold leading-relaxed truncate pr-2 ${
                            isDark ? "text-zinc-350" : "text-zinc-650"
                          }`}>
                            {portal.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {isCustom && (
                          <button
                            onClick={(e) => handleDeletePortal(portal.id, portal.name, e)}
                            className={`w-9.5 h-9.5 rounded-full flex items-center justify-center border transition-all hover:bg-red-500/10 hover:text-red-500 ${
                              isDark 
                                ? "bg-zinc-800 border-zinc-700 text-zinc-400" 
                                : "bg-zinc-50 border-zinc-200 text-zinc-500"
                            }`}
                            title="Delete custom website"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        <div className={`w-9.5 h-9.5 rounded-full flex items-center justify-center border transition-all duration-200 ${
                          isDark 
                            ? "bg-zinc-800 border-zinc-700 text-zinc-300 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500" 
                            : "bg-zinc-50 border-zinc-200 text-zinc-600 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500"
                        }`}>
                          <ArrowUpRight className="w-4.5 h-4.5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
