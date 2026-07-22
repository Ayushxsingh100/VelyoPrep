import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowUpRight, Plus, Trash2, MoreHorizontal, Edit } from "lucide-react";

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

  const [portals, setPortals] = useState<{ id: string; name: string; url: string; desc: string }[]>(() => {
    try {
      const saved = localStorage.getItem("jobhub_portals_v4");
      if (saved) return JSON.parse(saved);
    } catch {}
    try {
      const savedCustom = localStorage.getItem("jobhub_custom_portals_v3");
      const customs = savedCustom ? JSON.parse(savedCustom) : [];
      return [...DEFAULT_WEBSITES, ...customs];
    } catch {
      return DEFAULT_WEBSITES;
    }
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [portalToDelete, setPortalToDelete] = useState<{ id: string; name: string } | null>(null);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editPortalItem, setEditPortalItem] = useState<{ id: string; name: string; url: string; desc: string } | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    localStorage.setItem("jobhub_portals_v4", JSON.stringify(portals));
  }, [portals]);

  useEffect(() => {
    if (editPortalItem) {
      setEditName(editPortalItem.name);
      setEditUrl(editPortalItem.url);
      setEditDesc(editPortalItem.desc);
    }
  }, [editPortalItem]);

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

    setPortals(prev => [...prev, newPortal]);
    showToast(`Added ${newName} to portals`, "success");

    setNewName("");
    setNewUrl("");
    setNewDesc("");
    setIsAdding(false);
  };

  const confirmDeletePortal = () => {
    if (!portalToDelete) return;
    setPortals(prev => prev.filter(item => item.id !== portalToDelete.id));
    showToast(`Deleted ${portalToDelete.name} portal`, "info");
    setPortalToDelete(null);
  };

  const launchPortal = (url: string, name: string) => {
    showToast(`Launching ${name}`, "success");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filteredWebsites = portals.filter(portal => {
    const q = searchVal.trim().toLowerCase();
    if (!q) return true;
    return portal.name.toLowerCase().includes(q) || portal.desc.toLowerCase().includes(q);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-4 font-sans text-left"
    >
      <div className="pt-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-zinc-555 dark:text-zinc-500 uppercase block mb-1.5 leading-none">
            Explore Directory
          </span>
          <h1 className={`text-[34px] font-extrabold tracking-tight leading-[1.1] ${isDark ? "text-white" : "text-zinc-950"}`}>
            Job Hub
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95, opacity: 0.85 }}
          onClick={() => setIsAdding(!isAdding)}
          title={isAdding ? "Close Panel" : "Add Custom Portal"}
          aria-label={isAdding ? "Close Panel" : "Add Custom Portal"}
          className={`relative overflow-hidden w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-all duration-200 border shadow-lg active:scale-95 ${
            isAdding
              ? isDark
                ? "bg-[#18181C] border-[#252529] text-red-400"
                : "bg-white border-zinc-200 text-red-600 hover:bg-zinc-50"
              : "bg-blue-600 border-blue-500 hover:bg-blue-550 text-white shadow-sm"
          }`}
        >
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
            className="overflow-hidden"
          >
            <form onSubmit={handleAddWebsite} className={`p-6 rounded-[22px] border space-y-4 ${
              isDark ? "bg-[#18181C] border-[#252529]" : "bg-white border-zinc-200 shadow-sm"
            }`}>
              <h2 className={`text-base font-extrabold tracking-tight text-left ${isDark ? "text-zinc-100" : "text-zinc-850"}`}>
                Add Custom Website Link
              </h2>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-505 uppercase block">Portal Name</label>
                <input
                  type="text"
                  placeholder="e.g. RemoteOK, My Job Board"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all duration-150 placeholder-zinc-500 ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                      : "bg-[#FAFAFA] border-zinc-200 text-zinc-900 focus:border-blue-500"
                  }`}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-550 uppercase block">Website URL</label>
                <input
                  type="text"
                  placeholder="e.g. remoteok.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all duration-150 placeholder-zinc-500 ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                      : "bg-[#FAFAFA] border-zinc-200 text-zinc-900 focus:border-blue-500"
                  }`}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-zinc-555 uppercase block">Short Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Curated tech & remote channels."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all duration-150 placeholder-zinc-500 ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                      : "bg-[#FAFAFA] border-[#E4E4E7] text-zinc-900 focus:border-blue-500"
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-550 active:scale-98 text-white font-bold text-sm tracking-wider transition-colors shadow-md shadow-blue-600/10 cursor-pointer"
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
        className={`relative flex items-center h-12 px-4 rounded-[16px] border transition-all duration-200 ${
          isSearchFocused
            ? isDark
              ? "border-blue-500 ring-1 ring-blue-500/25 bg-[#18181C]"
              : "border-blue-500 ring-1 ring-blue-500/10 bg-white"
            : isDark
            ? "bg-[#18181C] border-[#252529] text-white"
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
          className={`flex-1 min-w-0 h-full bg-transparent outline-none text-sm px-3.5 font-semibold placeholder-zinc-500 ${
            isDark ? "text-white" : "text-zinc-900"
          }`}
        />
        {searchVal && (
          <button
            onClick={() => setSearchVal("")}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              isDark ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700" : "bg-zinc-100 text-zinc-555 hover:bg-zinc-200"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <span className={`text-xs font-bold uppercase tracking-wider block leading-none ${
            isDark ? "text-zinc-500" : "text-zinc-500"
          }`}>
            {searchVal ? `Matches (${filteredWebsites.length})` : "Portals Available"}
          </span>
          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border leading-none tracking-wide uppercase font-sans ${
            isDark ? "bg-zinc-800/40 border-zinc-750 text-zinc-400" : "bg-zinc-100 border-zinc-205 text-zinc-650"
          }`}>
            {filteredWebsites.length} Active Channels
          </span>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-3.5">
          {portals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`py-14 text-center rounded-[22px] border border-dashed ${
                isDark ? "border-zinc-855 bg-[#18181C]/30" : "border-zinc-200 bg-white"
              }`}
            >
              <div className="max-w-xs mx-auto space-y-4">
                <div className="space-y-2">
                  <span className="text-zinc-500 font-bold text-xs tracking-wider uppercase block leading-none">No Portals Remaining</span>
                  <p className="text-[12.5px] leading-relaxed text-zinc-450">
                    Your directory is completely empty. Press the add portal button to register a new job board link.
                  </p>
                </div>
                <button
                  onClick={() => setIsAdding(true)}
                  className="mx-auto px-5 h-9 rounded-xl bg-blue-600 hover:bg-blue-550 text-white text-xs font-bold transition-all active:scale-95 shadow-sm shadow-blue-500/10 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Portal</span>
                </button>
              </div>
            </motion.div>
          ) : filteredWebsites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`py-12 text-center rounded-[22px] border border-dashed ${
                isDark ? "border-zinc-855 bg-[#18181C]/30" : "border-zinc-205 bg-white"
              }`}
            >
              <p className={`text-xs font-bold ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
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
                    whileHover={{ y: -2, scale: 1.003 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    onClick={() => launchPortal(portal.url, portal.name)}
                    className={`relative p-5 rounded-[22px] border transition-all duration-200 cursor-pointer group ${
                      isDark
                        ? "bg-[#18181C] border-[#252529] hover:bg-[#1E1E24]/60 hover:border-[#2D2D32] text-white"
                        : "bg-white border-zinc-200/80 hover:bg-zinc-50/50 hover:border-zinc-300 shadow-sm text-zinc-950"
                    }`}
                  >
                    <div className={`absolute left-0 top-4 bottom-4 w-[3px] bg-gradient-to-b ${theme.gradient} rounded-r-full`} />

                    <div className="flex items-center justify-between min-w-0">
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.text} transition-transform duration-300 group-hover:scale-105`}>
                          {isCustom ? (
                            <span className="text-base font-extrabold uppercase">
                              {portal.name.charAt(0)}
                            </span>
                          ) : (
                            <LogoIcon id={portal.id} className="w-6 h-6" />
                          )}
                        </div>

                        <div className="min-w-0 text-left space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-[15px] font-extrabold tracking-tight leading-none ${
                              isDark ? "text-white" : "text-zinc-950"
                            }`}>
                              {portal.name}
                            </h3>
                            {isCustom && (
                              <span className="text-[9px] font-bold uppercase bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-sans tracking-wide">
                                Custom
                              </span>
                            )}
                          </div>
                          <p className={`text-[13px] font-bold leading-relaxed truncate pr-2 ${
                            isDark ? "text-zinc-400" : "text-zinc-650"
                          }`}>
                            {portal.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === portal.id ? null : portal.id);
                            }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                              isDark 
                                ? "bg-[#242428] border-[#3E3E42] text-zinc-400 hover:bg-[#2F2F34] hover:text-white" 
                                : "bg-zinc-50 border-zinc-200 text-zinc-550 hover:bg-zinc-100 hover:text-zinc-900"
                            }`}
                          >
                            <MoreHorizontal size={15} />
                          </button>

                          <AnimatePresence>
                            {activeMenuId === portal.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(null);
                                  }}
                                />
                                <motion.div
                                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                  transition={{ duration: 0.1 }}
                                  className={`absolute right-0 mt-1.5 w-32 rounded-xl border p-1 z-50 shadow-lg ${
                                    isDark 
                                      ? "bg-[#18181C] border-zinc-800 text-zinc-200" 
                                      : "bg-white border-zinc-200 text-zinc-700"
                                  }`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      launchPortal(portal.url, portal.name);
                                    }}
                                    className="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg hover:bg-zinc-900 dark:hover:bg-zinc-850 transition-colors flex items-center gap-2 cursor-pointer"
                                  >
                                    <ArrowUpRight size={12} />
                                    <span>Open</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setEditPortalItem(portal);
                                    }}
                                    className="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg hover:bg-zinc-900 dark:hover:bg-zinc-850 transition-colors flex items-center gap-2 cursor-pointer"
                                  >
                                    <Edit size={12} />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setPortalToDelete({ id: portal.id, name: portal.name });
                                    }}
                                    className="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-500/5 transition-colors flex items-center gap-2 cursor-pointer"
                                  >
                                    <Trash2 size={12} />
                                    <span>Delete</span>
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                          isDark 
                            ? "bg-[#242428] border-[#3E3E42] text-zinc-300 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500" 
                            : "bg-zinc-50 border-zinc-200 text-zinc-650 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500"
                        }`}>
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                whileHover={{ y: -2, scale: 1.003 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsAdding(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`p-5 rounded-[22px] border border-dashed transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                  isDark 
                    ? "bg-[#18181C]/40 border-zinc-805 hover:border-zinc-700 text-white" 
                    : "bg-zinc-50/50 border-zinc-250 hover:bg-zinc-100/50 hover:border-zinc-300 text-zinc-900"
                }`}
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-550"
                  }`}>
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 text-left space-y-1">
                    <h4 className="text-[13.5px] font-extrabold tracking-tight leading-none">
                      Can't find a portal? Add your own.
                    </h4>
                    <p className={`text-xs font-semibold leading-relaxed truncate pr-2 ${
                      isDark ? "text-zinc-450" : "text-zinc-550"
                    }`}>
                      Register custom job boards or careers pages in your dashboard.
                    </p>
                  </div>
                </div>
                <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                  isDark ? "bg-[#242428] border-[#3E3E42] text-zinc-400" : "bg-white border-zinc-200 text-zinc-550"
                }`}>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {portalToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setPortalToDelete(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-sm rounded-[22px] border p-6 z-10 shadow-2xl ${
                isDark 
                  ? "bg-[#18181C] border-[#252529] text-white" 
                  : "bg-white border-zinc-200 text-zinc-900"
              }`}
            >
              <h3 className="text-base font-extrabold tracking-tight text-center mb-2">Delete Portal?</h3>
              <p className={`text-xs text-center leading-relaxed mb-5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                Are you sure you want to remove <span className="font-bold">{portalToDelete.name}</span>? This will hide it from your directory.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setPortalToDelete(null)}
                  className={`flex-1 h-9 rounded-xl border text-xs font-semibold cursor-pointer ${
                    isDark ? 'border-zinc-850 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePortal}
                  className="flex-1 h-9 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editPortalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setEditPortalItem(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-sm rounded-[22px] border p-6 z-10 shadow-2xl ${
                isDark 
                  ? "bg-[#18181C] border-[#252529] text-white" 
                  : "bg-white border-zinc-200 text-zinc-900"
              }`}
            >
              <h3 className="text-base font-extrabold tracking-tight text-left mb-4">Edit Portal</h3>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  let formattedUrl = editUrl.trim();
                  if (!/^https?:\/\//i.test(formattedUrl)) {
                    formattedUrl = `https://${formattedUrl}`;
                  }
                  setPortals(prev => prev.map(p => p.id === editPortalItem.id ? {
                    ...p,
                    name: editName.trim(),
                    url: formattedUrl,
                    desc: editDesc.trim()
                  } : p));
                  showToast("Portal updated successfully", "success");
                  setEditPortalItem(null);
                }}
                className="space-y-4 text-left"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-550 uppercase block">Portal Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all placeholder-zinc-500 ${
                      isDark ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-550 uppercase block">Website URL</label>
                  <input
                    type="text"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all placeholder-zinc-500 ${
                      isDark ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-zinc-555 uppercase block">Description</label>
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className={`w-full h-12 px-3.5 rounded-xl text-sm font-semibold outline-none border transition-all placeholder-zinc-500 ${
                      isDark ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500"
                    }`}
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditPortalItem(null)}
                    className={`flex-1 h-10 rounded-xl border text-xs font-semibold cursor-pointer ${
                      isDark ? 'border-zinc-850 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-550 text-white text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
