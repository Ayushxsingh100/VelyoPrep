import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  ChevronRight, 
  Linkedin, 
  Github, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Briefcase, 
  Copy,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Link2,
  Camera,
  Upload,
  Calendar,
  GraduationCap,
  TrendingUp
} from "lucide-react";
import { useAuth } from "../../providers/auth.provider";
import { ResumeService } from "../../services/resume.service";
import { DocumentService } from "../../services/document.service";

interface VaultScreenProps {
  vaultSubTab: "overview" | "personal" | "links" | "resumes" | "documents";
  setVaultSubTab: React.Dispatch<React.SetStateAction<"overview" | "personal" | "links" | "resumes" | "documents">>;
  
  profileName: string;
  setProfileName: (v: string) => void;
  profileEmail: string;
  setProfileEmail: (v: string) => void;
  profilePhone: string;
  setProfilePhone: (v: string) => void;
  profileCollege: string;
  setProfileCollege: (v: string) => void;
  profileDegree: string;
  setProfileDegree: (v: string) => void;
  profileBranch: string;
  setProfileBranch: (v: string) => void;
  profileGradYear: string;
  setProfileGradYear: (v: string) => void;
  profileCgpa: string;
  setProfileCgpa: (v: string) => void;
  profileDob: string;
  setProfileDob: (v: string) => void;
  profileAddress: string;
  setProfileAddress: (v: string) => void;
  profilePreferredRoles: string;
  setProfilePreferredRoles: (v: string) => void;
  profileSkills: string;
  setProfileSkills: (v: string) => void;

  linkLinkedin: string;
  setLinkLinkedin: (v: string) => void;
  linkGithub: string;
  setLinkGithub: (v: string) => void;
  linkPortfolio: string;
  setLinkPortfolio: (v: string) => void;
  linkLeetcode: string;
  setLinkLeetcode: (v: string) => void;
  linkCodeforces: string;
  setLinkCodeforces: (v: string) => void;
  linkCodechef: string;
  setLinkCodechef: (v: string) => void;
  linkHackerRank: string;
  setLinkHackerRank: (v: string) => void;
  linkPersonalWebsite: string;
  setLinkPersonalWebsite: (v: string) => void;

  resumes: any[];
  setResumes: React.Dispatch<React.SetStateAction<any[]>>;
  vaultUploading: boolean;
  setVaultUploading: (v: boolean) => void;
  vaultUploadProgress: number;
  setVaultUploadProgress: (v: number) => void;

  vaultDocuments: any[];
  setVaultDocuments: React.Dispatch<React.SetStateAction<any[]>>;

  simulateVaultFailure: boolean;
  setSimulateVaultFailure: (v: boolean) => void;
  offlineQueue: any[];
  setOfflineQueue: React.Dispatch<React.SetStateAction<any[]>>;

  getProfileCompletion: () => number;

  isDark: boolean;
  themeCardClass: string;
  themeTextSubtle: string;
  themeInputBg: string;
  themeBorderClass: string;
  showToast: (message: string, type: "success" | "warning" | "error" | "info") => void;
}

export const VaultScreen: React.FC<VaultScreenProps> = ({
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  profilePhone,
  setProfilePhone,
  profileCollege,
  setProfileCollege,
  profileDegree,
  setProfileDegree,
  profileBranch,
  setProfileBranch,
  profileGradYear,
  setProfileGradYear,
  profileCgpa,
  setProfileCgpa,
  profileDob,
  setProfileDob,
  profileAddress,
  setProfileAddress,
  profilePreferredRoles,
  setProfilePreferredRoles,
  profileSkills,
  setProfileSkills,
  linkLinkedin,
  setLinkLinkedin,
  linkGithub,
  setLinkGithub,
  linkPortfolio,
  setLinkPortfolio,
  linkLeetcode,
  setLinkLeetcode,
  linkCodeforces,
  setLinkCodeforces,
  linkCodechef,
  setLinkCodechef,
  linkHackerRank,
  setLinkHackerRank,
  linkPersonalWebsite,
  setLinkPersonalWebsite,
  resumes,
  setResumes,
  vaultDocuments,
  setVaultDocuments,
  simulateVaultFailure,
  setSimulateVaultFailure,
  offlineQueue,
  setOfflineQueue,
  getProfileCompletion,
  isDark,
  showToast
}) => {
  const auth = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast("Uploading avatar to storage...", "info");
    const res = await auth.uploadAvatar(file);
    if (res.error) {
      showToast(res.error, "error");
    } else {
      showToast("Avatar uploaded & saved to database", "success");
    }
  };

  const resumeService = React.useMemo(() => new ResumeService(), []);
  const resumeFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!auth.user) {
      showToast("Authentication required to upload resume.", "error");
      return;
    }

    showToast(`Uploading ${file.name} to Storage Vault...`, "info");
    const res = await resumeService.uploadResume(auth.user.id, file);
    if (res.error) {
      showToast(res.error, "error");
      return;
    }

    if (res.resume) {
      const newResumeItem = {
        id: res.resume.id,
        name: res.resume.name,
        version: res.resume.version || "v1.0",
        storagePath: res.resume.storage_path,
        isDefault: Boolean(res.resume.is_active),
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        fileSizeKb: res.resume.file_size_kb || 450,
      };

      setResumes((prev) => [newResumeItem, ...prev]);
      showToast(`Uploaded ${res.resume.name} successfully`, "success");
    }
  };

  const handleViewResume = async (storagePath: string, name: string) => {
    if (!storagePath) {
      showToast("Storage path not available.", "warning");
      return;
    }
    showToast(`Generating secure link for ${name}...`, "info");
    const res = await resumeService.getSignedUrl(storagePath);
    if (res.error || !res.url) {
      showToast(res.error || "Failed to generate download link.", "error");
      return;
    }
    window.open(res.url, "_blank", "noopener,noreferrer");
  };

  const documentService = React.useMemo(() => new DocumentService(), []);
  
  const coverLetterFileInputRef = useRef<HTMLInputElement | null>(null);
  const portfolioFileInputRef = useRef<HTMLInputElement | null>(null);
  const certFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCoverLetterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!auth.user) {
      showToast("Authentication required", "error");
      return;
    }
    showToast(`Uploading Cover Letter: ${file.name}...`, "info");
    const res = await documentService.uploadDocument(auth.user.id, file, "Cover Letter");
    if (res.error) {
      showToast(res.error, "error");
    } else if (res.document) {
      const newDocItem = {
        id: res.document.id,
        name: res.document.name,
        category: "Cover Letter",
        storagePath: res.document.storage_path,
        fileSizeKb: res.document.file_size_kb || 500,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0]
      };
      setVaultDocuments((prev) => [newDocItem, ...prev]);
      showToast("Cover Letter uploaded successfully", "success");
    }
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!auth.user) {
      showToast("Authentication required", "error");
      return;
    }
    showToast(`Uploading Portfolio: ${file.name}...`, "info");
    const res = await documentService.uploadDocument(auth.user.id, file, "Portfolio");
    if (res.error) {
      showToast(res.error, "error");
    } else if (res.document) {
      const newDocItem = {
        id: res.document.id,
        name: res.document.name,
        category: "Portfolio",
        storagePath: res.document.storage_path,
        fileSizeKb: res.document.file_size_kb || 500,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0]
      };
      setVaultDocuments((prev) => [newDocItem, ...prev]);
      if (res.document.storage_path) {
        setLinkPortfolio(res.document.name);
      }
      showToast("Portfolio uploaded successfully", "success");
    }
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!auth.user) {
      showToast("Authentication required", "error");
      return;
    }
    showToast(`Uploading Certificate: ${file.name}...`, "info");
    const res = await documentService.uploadDocument(auth.user.id, file, "Certificate");
    if (res.error) {
      showToast(res.error, "error");
    } else if (res.document) {
      const newDocItem = {
        id: res.document.id,
        name: res.document.name,
        category: "Certificate",
        storagePath: res.document.storage_path,
        fileSizeKb: res.document.file_size_kb || 500,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0]
      };
      setVaultDocuments((prev) => [newDocItem, ...prev]);
      showToast("Certificate uploaded successfully", "success");
    }
  };

  const handleViewDocument = async (doc: any) => {
    if (!doc?.storagePath) {
      showToast(`Opening: ${doc?.name || "Document"}`, "info");
      return;
    }
    showToast(`Generating secure link for ${doc.name}...`, "info");
    const res = await documentService.getSignedUrl(doc.storagePath);
    if (res.error || !res.url) {
      showToast(res.error || "Failed to generate document download link.", "error");
      return;
    }
    window.open(res.url, "_blank", "noopener,noreferrer");
  };

  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState(profileName);
  const [editCollege, setEditCollege] = useState(profileCollege);
  const [editDegree, setEditDegree] = useState(profileDegree);
  const [editBranch, setEditBranch] = useState(profileBranch);
  const [editGradYear, setEditGradYear] = useState(profileGradYear);
  const [editCgpa, setEditCgpa] = useState(profileCgpa);
  const [editDob, setEditDob] = useState(profileDob);
  const [editLocation, setEditLocation] = useState(profileAddress);
  const [editEmail, setEditEmail] = useState(profileEmail);
  const [editPhone, setEditPhone] = useState(profilePhone);
  const [editPreferredRoles, setEditPreferredRoles] = useState(profilePreferredRoles);
  const [editSkills, setEditSkills] = useState(profileSkills);

  const [editLinkedin, setEditLinkedin] = useState(linkLinkedin);
  const [editGithub, setEditGithub] = useState(linkGithub);
  const [editPortfolio, setEditPortfolio] = useState(linkPortfolio);
  const [editPersonalWebsite, setEditPersonalWebsite] = useState(linkPersonalWebsite);
  const [editLeetcode, setEditLeetcode] = useState(linkLeetcode);
  const [editCodeforces, setEditCodeforces] = useState(linkCodeforces);
  const [editCodechef, setEditCodechef] = useState(linkCodechef);
  const [editHackerRank, setEditHackerRank] = useState(linkHackerRank);

  const completion = getProfileCompletion();

  const [customLinks, setCustomLinks] = useState<{ id: string; label: string; url: string }[]>(() => {
    try {
      const saved = localStorage.getItem("vault_custom_links");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const handleAddCustomLink = () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) {
      showToast("Please enter both a label and URL", "warning");
      return;
    }
    let finalUrl = newLinkUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }
    const newItem = {
      id: `custom_${Date.now()}`,
      label: newLinkLabel.trim(),
      url: finalUrl
    };
    const updated = [...customLinks, newItem];
    setCustomLinks(updated);
    localStorage.setItem("vault_custom_links", JSON.stringify(updated));
    setNewLinkLabel("");
    setNewLinkUrl("");
    setShowAddForm(false);
    showToast("Custom link saved!", "success");
  };

  const handleDeleteCustomLink = (id: string, label: string) => {
    const updated = customLinks.filter(item => item.id !== id);
    setCustomLinks(updated);
    localStorage.setItem("vault_custom_links", JSON.stringify(updated));
    showToast(`Deleted "${label}"`, "info");
  };

  const handleCopy = (url: string, id: string, label: string) => {
    try {
      navigator.clipboard.writeText(url);
      setCopiedLinkId(id);
      showToast(`Copied ${label} to clipboard!`, "success");
      setTimeout(() => {
        setCopiedLinkId(null);
      }, 1500);
    } catch {
      showToast("Clipboard copy failed", "error");
    }
  };

  const activeLinksList = [
    { label: "LinkedIn", url: linkLinkedin },
    { label: "GitHub", url: linkGithub },
    { label: "Portfolio", url: linkPortfolio || linkPersonalWebsite },
    { label: "LeetCode", url: linkLeetcode },
    { label: "Codeforces", url: linkCodeforces },
    { label: "CodeChef", url: linkCodechef },
    { label: "HackerRank", url: linkHackerRank },
  ].filter(item => !!item.url);

  const cardClass = isDark 
    ? "bg-[#121214] border border-zinc-800 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.25)]" 
    : "bg-white border border-zinc-205 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)]";

  const sectionHeaderClass = `text-[10px] font-bold ${isDark ? "text-zinc-500" : "text-zinc-450"} uppercase tracking-widest px-1 leading-none mb-2.5 block font-sans`;

  const inputClass = isDark 
    ? "w-full h-12 px-3.5 rounded-xl text-sm outline-none border border-zinc-800 bg-zinc-900 text-zinc-100 placeholder-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-semibold text-left" 
    : "w-full h-12 px-3.5 rounded-xl text-sm outline-none border border-zinc-250 bg-[#FAFAFA] text-zinc-900 placeholder-zinc-400 focus:border-blue-500 transition-all font-semibold text-left";

  const labelClass = `text-xs font-bold ${isDark ? "text-zinc-400" : "text-zinc-500"} uppercase block mb-1.5 tracking-wider`;

  const handleOpenEdit = () => {
    setEditName(profileName);
    setEditCollege(profileCollege);
    setEditDegree(profileDegree);
    setEditBranch(profileBranch);
    setEditGradYear(profileGradYear);
    setEditCgpa(profileCgpa);
    setEditDob(profileDob);
    setEditLocation(profileAddress);
    setEditEmail(profileEmail);
    setEditPhone(profilePhone);
    setEditPreferredRoles(profilePreferredRoles);
    setEditSkills(profileSkills);

    setEditLinkedin(linkLinkedin);
    setEditGithub(linkGithub);
    setEditPortfolio(linkPortfolio);
    setEditPersonalWebsite(linkPersonalWebsite);
    setEditLeetcode(editLeetcode);
    setEditCodeforces(editCodeforces);
    setEditCodechef(editCodechef);
    setEditHackerRank(editHackerRank);

    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    setProfileName(editName);
    setProfileCollege(editCollege);
    setProfileDegree(editDegree);
    setProfileBranch(editBranch);
    setProfileGradYear(editGradYear);
    setProfileCgpa(editCgpa);
    setProfileDob(editDob);
    setProfileAddress(editLocation);
    setProfileEmail(editEmail);
    setProfilePhone(editPhone);
    setProfilePreferredRoles(editPreferredRoles);
    setProfileSkills(editSkills);

    setLinkLinkedin(editLinkedin);
    setLinkGithub(editGithub);
    setLinkPortfolio(editPortfolio);
    setLinkPersonalWebsite(editPersonalWebsite);
    setLinkLeetcode(editLeetcode);
    setLinkCodeforces(editCodeforces);
    setLinkCodechef(editCodechef);
    setLinkHackerRank(editHackerRank);

    const res = await auth.updateProfile({
      full_name: editName,
      university: editCollege,
      degree: editDegree,
      graduation_year: editGradYear,
      cgpa: editCgpa,
      target_role: editPreferredRoles,
      phone: editPhone,
      linkedin_url: editLinkedin,
      github_url: editGithub,
      portfolio_url: editPortfolio,
      skills: editSkills ? editSkills.split(",").map((s) => s.trim()) : [],
    });

    if (res.error) {
      showToast(res.error, "error");
      return;
    }

    if (simulateVaultFailure) {
      const offlineItem = { type: "profile", date: new Date().toISOString() };
      setOfflineQueue(prev => [...prev, offlineItem]);
      showToast("Supabase secure storage offline. Profile queued locally!", "warning");
    } else {
      showToast("Career profile synchronized with database", "success");
    }
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="font-sans select-none relative pb-6 pt-2">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-5.5"
          >
            <div className={`flex items-center justify-between pb-2 border-b-[0.5px] ${isDark ? "border-zinc-800/40" : "border-zinc-200/50"}`}>
              <button 
                onClick={() => setIsEditing(false)}
                className={`text-xs font-semibold ${isDark ? "text-zinc-450 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-800"} transition-colors`}
              >
                Cancel
              </button>
              <span className={`text-[13px] font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
                Edit Profile {completion > 0 && <span className="text-[10px] font-medium text-emerald-500">({completion}% complete)</span>}
              </span>
              <button 
                onClick={handleSaveEdit}
                className={`text-xs font-bold ${isDark ? "text-[#0A84FF] hover:text-blue-400" : "text-[#007AFF] hover:text-blue-700"} transition-colors`}
              >
                Done
              </button>
            </div>

            <div className="space-y-4 pb-8 scrollbar-none">
              <div className="space-y-1">
                <span className={sectionHeaderClass}>Profile Details</span>
                <div className={`${cardClass} py-2.5 px-3.5 space-y-2.5`}>
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Ayush Singh"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>University / College</label>
                    <input
                      type="text"
                      value={editCollege}
                      onChange={(e) => setEditCollege(e.target.value)}
                      placeholder="National Institute of Technology"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelClass}>Degree</label>
                      <input
                        type="text"
                        value={editDegree}
                        onChange={(e) => setEditDegree(e.target.value)}
                        placeholder="B.Tech"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>CGPA</label>
                      <input
                        type="text"
                        value={editCgpa}
                        onChange={(e) => setEditCgpa(e.target.value)}
                        placeholder="9.24"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelClass}>Branch / Major</label>
                      <input
                        type="text"
                        value={editBranch}
                        onChange={(e) => setEditBranch(e.target.value)}
                        placeholder="Computer Science"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Graduation Year</label>
                      <input
                        type="text"
                        value={editGradYear}
                        onChange={(e) => setEditGradYear(e.target.value)}
                        placeholder="2027"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className={sectionHeaderClass}>Contact Details</span>
                <div className={`${cardClass} py-2.5 px-3.5 space-y-2.5`}>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="singhxayush100@gmail.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="Mumbai, India"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className={sectionHeaderClass}>Professional Links</span>
                <div className={`${cardClass} py-2.5 px-3.5 space-y-2.5`}>
                  <div>
                    <label className={labelClass}>LinkedIn URL</label>
                    <input
                      type="text"
                      value={editLinkedin}
                      onChange={(e) => setEditLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>GitHub Profile</label>
                    <input
                      type="text"
                      value={editGithub}
                      onChange={(e) => setEditGithub(e.target.value)}
                      placeholder="https://github.com/username"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Portfolio Website</label>
                    <input
                      type="text"
                      value={editPortfolio}
                      onChange={(e) => setEditPortfolio(e.target.value)}
                      placeholder="https://portfolio.com"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className={sectionHeaderClass}>Coding Profiles</span>
                <div className={`${cardClass} py-2.5 px-3.5 space-y-2.5`}>
                  <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelClass}>LeetCode URL</label>
                      <input
                        type="text"
                        value={editLeetcode}
                        onChange={(e) => setEditLeetcode(e.target.value)}
                        placeholder="https://leetcode.com/username"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Codeforces URL</label>
                      <input
                        type="text"
                        value={editCodeforces}
                        onChange={(e) => setEditCodeforces(e.target.value)}
                        placeholder="https://codeforces.com/profile/username"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelClass}>CodeChef URL</label>
                      <input
                        type="text"
                        value={editCodechef}
                        onChange={(e) => setEditCodechef(e.target.value)}
                        placeholder="https://codechef.com/users/username"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>HackerRank URL</label>
                      <input
                        type="text"
                        value={editHackerRank}
                        onChange={(e) => setEditHackerRank(e.target.value)}
                        placeholder="https://hackerrank.com/username"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className={sectionHeaderClass}>Quick Document Updates</span>
                <div className={`${cardClass} py-2.5 px-3.5`}>
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <span className={`text-xs font-bold block ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Resume File</span>
                      <span className={`text-[9.5px] ${isDark ? "text-zinc-450" : "text-zinc-500"} truncate block max-w-[150px] mt-0.5`}>
                        {resumes[0]?.name || "Not uploaded"}
                      </span>
                    </div>
                    <input
                      type="file"
                      ref={resumeFileInputRef}
                      onChange={handleResumeFileUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2">
                      {resumes[0]?.storagePath && (
                        <button
                          onClick={() => handleViewResume(resumes[0].storagePath, resumes[0].name)}
                          className={`px-2.5 py-1.5 ${isDark ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"} text-[10px] font-bold rounded-full transition-colors cursor-pointer`}
                        >
                          View
                        </button>
                      )}
                      <button
                        onClick={() => resumeFileInputRef.current?.click()}
                        className={`px-2.5 py-1.5 ${isDark ? "bg-blue-500/10 hover:bg-blue-500/15 text-[#0A84FF]" : "bg-blue-50 hover:bg-blue-100 text-[#007AFF]"} text-[10px] font-bold rounded-full transition-colors cursor-pointer flex items-center space-x-1`}
                      >
                        <Upload size={10} />
                        <span>Upload PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className={sectionHeaderClass}>Troubleshooting & Sandbox</span>
                <div className={`py-2.5 px-3.5 rounded-2xl border border-dashed ${isDark ? "bg-[#1E1E22]/30 border-zinc-800" : "bg-zinc-50/50 border-zinc-200"} space-y-2`}>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className={`font-bold block text-[10px] ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Simulate Sync Failure</span>
                      <span className="text-[8.5px] text-zinc-500 block">Queue writes locally instead of remote db</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={simulateVaultFailure}
                      onChange={(e) => {
                        setSimulateVaultFailure(e.target.checked);
                        showToast(e.target.checked ? "Sync failure mode turned ON" : "Sync failure mode turned OFF", "warning");
                      }}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-zinc-300 dark:border-zinc-700 bg-transparent cursor-pointer"
                    />
                  </div>

                  {offlineQueue.length > 0 && (
                    <button
                      onClick={() => {
                        if (simulateVaultFailure) {
                          showToast("Cannot sync while failure simulation is active", "error");
                          return;
                        }
                        setOfflineQueue([]);
                        showToast("Synchronized and cleared offline queue", "success");
                      }}
                      className="w-full py-1.5 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold text-[10px] rounded-lg transition-all cursor-pointer"
                    >
                      Flush {offlineQueue.length} Pending Local Logs
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-7"
          >
            <input
              type="file"
              ref={resumeFileInputRef}
              onChange={handleResumeFileUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <input
              type="file"
              ref={coverLetterFileInputRef}
              onChange={handleCoverLetterUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <input
              type="file"
              ref={portfolioFileInputRef}
              onChange={handlePortfolioUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <input
              type="file"
              ref={certFileInputRef}
              onChange={handleCertUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />

            <div className="pt-4.5 flex items-center justify-between text-left">
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold tracking-widest text-blue-500 dark:text-blue-400 block leading-none uppercase font-sans mb-2">
                  DIGITAL WALLET
                </span>
                <h1 className={`text-[34px] font-extrabold tracking-tight leading-none ${isDark ? "text-white" : "text-zinc-950"}`}>
                  Career Vault
                </h1>
              </div>
              <button
                onClick={handleOpenEdit}
                className={`px-3.5 py-1.5 rounded-full border text-[11.5px] font-extrabold transition-all active:scale-95 shadow-xs cursor-pointer ${
                  isDark 
                    ? "bg-[#242428] border-[#3E3E42] text-zinc-300 hover:text-white" 
                    : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                Edit Profile
              </button>
            </div>

            <div className={`p-6 rounded-[22px] border relative ${
              isDark ? "bg-[#0C0C0E]/95 border-zinc-800/80" : "bg-white border-zinc-200 shadow-xs"
            }`}>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileSelect}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-20 h-20 min-w-[80px] min-h-[80px] rounded-full overflow-hidden flex items-center justify-center shrink-0 border-2 cursor-pointer relative ${
                      isDark ? "bg-blue-950/20 border-blue-500/40 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
                    }`}
                    title="Click to upload avatar"
                  >
                    {auth.avatarSignedUrl ? (
                      <img src={auth.avatarSignedUrl} alt={profileName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[28px] font-extrabold text-blue-455 dark:text-blue-400">{getInitials(profileName || "User").charAt(0)}</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera size={18} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="min-w-0 text-left">
                  <h3 className={`text-[22px] font-bold tracking-tight leading-tight truncate ${isDark ? "text-white" : "text-zinc-900"}`}>
                    {profileName || "Placement Candidate"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-zinc-500 mt-1.5 text-sm font-medium">
                    <MapPin size={14} className="text-zinc-500 shrink-0" />
                    <span className="truncate max-w-[200px]">{profileCollege || "University / College"}</span>
                  </div>
                </div>
              </div>

              {(profileDegree || profileCgpa || profileGradYear) && (
                <div className={`mt-6 pt-6 border-t ${isDark ? "border-zinc-805/30" : "border-zinc-150"} grid grid-cols-3 gap-3 text-center`}>
                  <div className={`p-4 rounded-xl border flex flex-col justify-between items-center h-[116px] ${
                    isDark ? "bg-[#111115] border-[#222226]" : "bg-zinc-50 border-zinc-200"
                  }`}>
                    <span className={`text-[9.5px] font-bold ${isDark ? "text-zinc-550" : "text-zinc-400"} uppercase tracking-wider block leading-none`}>DEGREE</span>
                    <span className={`text-[13.5px] font-bold block leading-none truncate max-w-[70px] ${isDark ? "text-white" : "text-zinc-750"}`}>
                      {profileDegree || "B.Tech"}
                    </span>
                    <div className="w-7.5 h-7.5 rounded-full flex items-center justify-center border border-blue-500/10 bg-blue-500/5 text-blue-500 dark:text-blue-450">
                      <GraduationCap size={14} />
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border flex flex-col justify-between items-center h-[116px] ${
                    isDark ? "bg-[#111115] border-[#222226]" : "bg-zinc-50 border-zinc-200"
                  }`}>
                    <span className={`text-[9.5px] font-bold ${isDark ? "text-zinc-550" : "text-zinc-400"} uppercase tracking-wider block leading-none`}>CGPA</span>
                    <span className="text-[13.5px] font-extrabold block leading-none text-[#0A84FF] dark:text-[#3B82F6]">
                      {profileCgpa || "N/A"}
                    </span>
                    <div className="w-7.5 h-7.5 rounded-full flex items-center justify-center border border-blue-500/10 bg-blue-500/5 text-blue-500 dark:text-blue-450">
                      <TrendingUp size={14} />
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border flex flex-col justify-between items-center h-[116px] ${
                    isDark ? "bg-[#111115] border-[#222226]" : "bg-zinc-50 border-zinc-200"
                  }`}>
                    <span className={`text-[9.5px] font-bold ${isDark ? "text-zinc-550" : "text-zinc-400"} uppercase tracking-wider block leading-none`}>GRAD YEAR</span>
                    <span className={`text-[13.5px] font-bold block leading-none truncate max-w-[70px] ${isDark ? "text-white" : "text-zinc-750"}`}>
                      {profileGradYear || "2027"}
                    </span>
                    <div className="w-7.5 h-7.5 rounded-full flex items-center justify-center border border-blue-500/10 bg-blue-500/5 text-blue-500 dark:text-blue-450">
                      <Calendar size={14} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Progress Completion Bar */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between text-xs font-bold px-0.5">
                <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>Profile Completion</span>
                <span className="text-blue-550 dark:text-blue-400 font-extrabold">{completion}% Complete</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? "bg-zinc-850" : "bg-zinc-150"}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-3.5 text-left">
              <span className="text-[10.5px] font-bold text-zinc-500 tracking-widest leading-none block uppercase font-sans">
                QUICK DOCUMENTS
              </span>
              
              <div className={`rounded-[22px] border divide-y divide-zinc-800/40 p-1.5 ${
                isDark ? "bg-[#0C0C0E]/95 border-zinc-800/80" : "bg-white border-zinc-200 shadow-xs"
              }`}>
                {/* 1. Resume */}
                <div 
                  onClick={() => {
                    const res = resumes.find(r => r.isDefault) || resumes[0];
                    if (res) {
                      handleViewResume(res.storagePath, res.name);
                    } else {
                      resumeFileInputRef.current?.click();
                    }
                  }}
                  className="p-4 flex items-center justify-between transition-all duration-150 cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-650"
                    }`}>
                      <FileText size={20} />
                    </div>
                    <div className="text-left min-w-0 space-y-0.5">
                      <span className="text-sm font-bold text-white block leading-none font-sans">Resume</span>
                      <span className="text-xs text-zinc-500 block truncate max-w-[170px] font-sans font-medium">
                        Your latest resume
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 shrink-0">
                    {resumes[0] ? (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-emerald-500/10 border-emerald-500/25 text-emerald-450 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Available</span>
                      </span>
                    ) : (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-[#19191C] border-[#252529] text-zinc-400 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-550" />
                        <span>Not uploaded</span>
                      </span>
                    )}
                    <ChevronRight size={14} className="text-zinc-650" />
                  </div>
                </div>

                {/* 2. Cover Letter */}
                <div 
                  onClick={() => {
                    const cl = vaultDocuments.find(d => d.category?.toLowerCase() === "cover letter");
                    if (cl) {
                      handleViewDocument(cl);
                    } else {
                      coverLetterFileInputRef.current?.click();
                    }
                  }}
                  className="p-4 flex items-center justify-between transition-all duration-150 cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-[#818CF8]/10 border-[#818CF8]/20 text-[#818CF8]" : "bg-purple-50 border-purple-100 text-purple-650"
                    }`}>
                      <FileText size={20} />
                    </div>
                    <div className="text-left min-w-0 space-y-0.5">
                      <span className="text-sm font-bold text-white block leading-none font-sans">Cover Letter</span>
                      <span className="text-xs text-zinc-500 block truncate max-w-[170px] font-sans font-medium">
                        Standard Cover Letter
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 shrink-0">
                    {vaultDocuments.find(d => d.category?.toLowerCase() === "cover letter") ? (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-emerald-500/10 border-emerald-500/25 text-emerald-450 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Available</span>
                      </span>
                    ) : (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-[#19191C] border-[#252529] text-zinc-400 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-550" />
                        <span>Not uploaded</span>
                      </span>
                    )}
                    <ChevronRight size={14} className="text-zinc-650" />
                  </div>
                </div>

                {/* 3. Portfolio */}
                <div 
                  onClick={() => {
                    const port = vaultDocuments.find(d => d.category?.toLowerCase() === "portfolio");
                    if (port) {
                      handleViewDocument(port);
                    } else if (linkPortfolio) {
                      window.open(linkPortfolio, "_blank", "noopener,noreferrer");
                    } else {
                      portfolioFileInputRef.current?.click();
                    }
                  }}
                  className="p-4 flex items-center justify-between transition-all duration-150 cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-100 text-amber-650"
                    }`}>
                      <Briefcase size={20} />
                    </div>
                    <div className="text-left min-w-0 space-y-0.5">
                      <span className="text-sm font-bold text-white block leading-none font-sans">Portfolio</span>
                      <span className="text-xs text-zinc-500 block truncate max-w-[170px] font-sans font-medium">
                        {linkPortfolio || "https://portfolio.dev"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 shrink-0">
                    {vaultDocuments.find(d => d.category?.toLowerCase() === "portfolio") || linkPortfolio ? (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-emerald-500/10 border-emerald-500/25 text-emerald-455 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Available</span>
                      </span>
                    ) : (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-[#19191C] border-[#252529] text-zinc-400 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-550" />
                        <span>Not uploaded</span>
                      </span>
                    )}
                    <ChevronRight size={14} className="text-zinc-650" />
                  </div>
                </div>

                {/* 4. Certificates */}
                <div 
                  onClick={() => {
                    const c = vaultDocuments.find(d => d.category?.toLowerCase() === "certificate");
                    if (c) {
                      handleViewDocument(c);
                    } else {
                      certFileInputRef.current?.click();
                    }
                  }}
                  className="p-4 flex items-center justify-between transition-all duration-150 cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-650"
                    }`}>
                      <Award size={20} />
                    </div>
                    <div className="text-left min-w-0 space-y-0.5">
                      <span className="text-sm font-bold text-white block leading-none font-sans">Certificates</span>
                      <span className="text-xs text-zinc-500 block truncate max-w-[170px] font-sans font-medium">
                        Your verified certificates
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 shrink-0">
                    {vaultDocuments.filter(d => d.category?.toLowerCase() === "certificate").length > 0 ? (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-emerald-500/10 border-emerald-500/25 text-emerald-450 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{vaultDocuments.filter(d => d.category?.toLowerCase() === "certificate").length} Verified</span>
                      </span>
                    ) : (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-[#19191C] border-[#252529] text-zinc-400 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                        <span>0 Verified</span>
                      </span>
                    )}
                    <ChevronRight size={14} className="text-zinc-650" />
                  </div>
                </div>
              </div>
            </div>

            {(linkLeetcode || linkCodeforces || linkCodechef || linkHackerRank) && (
              <div className="space-y-3.5">
                <span className={sectionHeaderClass}>Coding Profiles</span>
                <div className="grid grid-cols-1 min-[340px]:grid-cols-2 gap-4">
                  {linkLeetcode && (
                    <div 
                      onClick={() => window.open(linkLeetcode, "_blank", "noopener,noreferrer")}
                      className={`flex items-center space-x-2.5 py-3 px-3.5 rounded-2xl cursor-pointer group ${isDark ? "hover:bg-white/[0.03] active:bg-white/[0.06] bg-[#1C1C1E] border-white/[0.04]" : "hover:bg-zinc-100/40 active:bg-zinc-100/80 bg-white border-zinc-150/50 shadow-[0_1px_2.5px_rgba(0,0,0,0.01)]"} border transition-all duration-150`}
                    >
                      <div className={`w-7 h-7 rounded-[5px] flex items-center justify-center font-sans text-[10px] font-bold shrink-0 transition-transform duration-200 group-hover:scale-105 ${isDark ? "bg-amber-500/15 text-amber-400" : "bg-amber-500/10 text-amber-500"}`}>
                        LC
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-xs font-bold block leading-none truncate ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>LeetCode</span>
                        <span className={`text-[10px] ${isDark ? "text-zinc-450" : "text-zinc-500"} font-sans truncate block mt-1`}>
                          {linkLeetcode.replace(/\/$/, "").split("/").pop() || "Profile"}
                        </span>
                      </div>
                      <ChevronRight size={12} className={`transition-colors shrink-0 ${isDark ? "text-zinc-650 group-hover:text-blue-400" : "text-zinc-300 group-hover:text-blue-600"}`} />
                    </div>
                  )}

                  {linkCodeforces && (
                    <div 
                      onClick={() => window.open(linkCodeforces, "_blank", "noopener,noreferrer")}
                      className={`flex items-center space-x-2.5 py-3 px-3.5 rounded-2xl cursor-pointer group ${isDark ? "hover:bg-white/[0.03] active:bg-white/[0.06] bg-[#1C1C1E] border-white/[0.04]" : "hover:bg-zinc-100/40 active:bg-zinc-100/80 bg-white border-zinc-150/50 shadow-[0_1px_2.5px_rgba(0,0,0,0.01)]"} border transition-all duration-150`}
                    >
                      <div className={`w-7 h-7 rounded-[5px] flex items-center justify-center font-sans text-[10px] font-bold shrink-0 transition-transform duration-200 group-hover:scale-105 ${isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-500/10 text-blue-500"}`}>
                        CF
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-xs font-bold block leading-none truncate ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Codeforces</span>
                        <span className={`text-[10px] ${isDark ? "text-zinc-450" : "text-zinc-500"} font-sans truncate block mt-1`}>
                          {linkCodeforces.replace(/\/$/, "").split("/").pop() || "Profile"}
                        </span>
                      </div>
                      <ChevronRight size={12} className={`transition-colors shrink-0 ${isDark ? "text-zinc-650 group-hover:text-blue-400" : "text-zinc-300 group-hover:text-blue-600"}`} />
                    </div>
                  )}

                  {linkCodechef && (
                    <div 
                      onClick={() => window.open(linkCodechef, "_blank", "noopener,noreferrer")}
                      className={`flex items-center space-x-2.5 py-3 px-3.5 rounded-2xl cursor-pointer group ${isDark ? "hover:bg-white/[0.03] active:bg-white/[0.06] bg-[#1C1C1E] border-white/[0.04]" : "hover:bg-zinc-100/40 active:bg-zinc-100/80 bg-white border-zinc-150/50 shadow-[0_1px_2.5px_rgba(0,0,0,0.01)]"} border transition-all duration-150`}
                    >
                      <div className={`w-7 h-7 rounded-[5px] flex items-center justify-center font-mono text-[10px] font-bold shrink-0 transition-transform duration-200 group-hover:scale-105 ${isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-500/10 text-emerald-500"}`}>
                        CC
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-xs font-bold block leading-none truncate ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>CodeChef</span>
                        <span className={`text-[10px] ${isDark ? "text-zinc-450" : "text-zinc-500"} font-mono truncate block mt-1`}>
                          {linkCodechef.replace(/\/$/, "").split("/").pop() || "Profile"}
                        </span>
                      </div>
                      <ChevronRight size={12} className={`transition-colors shrink-0 ${isDark ? "text-zinc-655 group-hover:text-blue-400" : "text-zinc-300 group-hover:text-blue-600"}`} />
                    </div>
                  )}

                  {linkHackerRank && (
                    <div 
                      onClick={() => window.open(linkHackerRank, "_blank", "noopener,noreferrer")}
                      className={`flex items-center space-x-2.5 py-3 px-3.5 rounded-2xl cursor-pointer group ${isDark ? "hover:bg-white/[0.03] active:bg-white/[0.06] bg-[#1C1C1E] border-white/[0.04]" : "hover:bg-zinc-100/40 active:bg-zinc-100/80 bg-white border-zinc-150/50 shadow-[0_1px_2.5px_rgba(0,0,0,0.01)]"} border transition-all duration-150`}
                    >
                      <div className={`w-7 h-7 rounded-[5px] flex items-center justify-center font-mono text-[10px] font-bold shrink-0 transition-transform duration-200 group-hover:scale-105 ${isDark ? "bg-green-500/15 text-green-400" : "bg-green-500/10 text-green-500"}`}>
                        HR
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-xs font-bold block leading-none truncate ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>HackerRank</span>
                        <span className={`text-[10px] ${isDark ? "text-zinc-450" : "text-zinc-500"} font-mono truncate block mt-1`}>
                          {linkHackerRank.replace(/\/$/, "").split("/").pop() || "Profile"}
                        </span>
                      </div>
                      <ChevronRight size={12} className={`transition-colors shrink-0 ${isDark ? "text-zinc-650 group-hover:text-blue-400" : "text-zinc-300 group-hover:text-blue-600"}`} />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3.5 text-left">
              <span className="text-[10.5px] font-bold text-zinc-500 tracking-widest leading-none block uppercase font-mono">
                Professional Links
              </span>
              <div className={`rounded-[22px] border divide-y divide-zinc-800/40 p-1.5 ${
                isDark ? "bg-[#0C0C0E]/95 border-zinc-800/80" : "bg-white border-zinc-200 shadow-xs"
              }`}>
                {/* LinkedIn */}
                <div 
                  onClick={() => {
                    if (linkLinkedin) {
                      window.open(linkLinkedin, "_blank", "noopener,noreferrer");
                    } else {
                      showToast("No LinkedIn profile linked yet.", "warning");
                    }
                  }}
                  className="p-4 flex items-center justify-between transition-all duration-150 cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-[#0077B5]/10 border-[#0077B5]/20 text-[#33a0ff]" : "bg-[#0077B5]/10 border-[#0077B5]/20 text-[#0077B5]"
                    }`}>
                      <Linkedin size={20} />
                    </div>
                    <span className="text-sm font-bold text-white block leading-none font-sans">LinkedIn</span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {linkLinkedin ? (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-emerald-500/10 border-emerald-500/25 text-emerald-450 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Linked</span>
                      </span>
                    ) : (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-[#19191C] border-[#252529] text-zinc-400 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-550" />
                        <span>Not linked</span>
                      </span>
                    )}
                    <ChevronRight size={14} className="text-zinc-650" />
                  </div>
                </div>

                {/* GitHub */}
                <div 
                  onClick={() => {
                    if (linkGithub) {
                      window.open(linkGithub, "_blank", "noopener,noreferrer");
                    } else {
                      showToast("No GitHub profile linked yet.", "warning");
                    }
                  }}
                  className="p-4 flex items-center justify-between transition-all duration-150 cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-zinc-800/30 border-zinc-700/30 text-zinc-300" : "bg-zinc-600/10 border-zinc-600/20 text-zinc-700"
                    }`}>
                      <Github size={20} />
                    </div>
                    <span className="text-sm font-bold text-white block leading-none font-sans">GitHub</span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {linkGithub ? (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-emerald-500/10 border-emerald-500/25 text-emerald-455 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Linked</span>
                      </span>
                    ) : (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-[#19191C] border-[#252529] text-zinc-400 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-555" />
                        <span>Not linked</span>
                      </span>
                    )}
                    <ChevronRight size={14} className="text-zinc-650" />
                  </div>
                </div>

                {/* Portfolio */}
                <div 
                  onClick={() => {
                    if (linkPersonalWebsite) {
                      window.open(linkPersonalWebsite, "_blank", "noopener,noreferrer");
                    } else if (linkPortfolio) {
                      window.open(linkPortfolio, "_blank", "noopener,noreferrer");
                    } else {
                      showToast("No portfolio website linked yet.", "warning");
                    }
                  }}
                  className="p-4 flex items-center justify-between transition-all duration-150 cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-600"
                    }`}>
                      <Globe size={20} />
                    </div>
                    <span className="text-sm font-bold text-white block leading-none font-sans">Portfolio Website</span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {(linkPersonalWebsite || linkPortfolio) ? (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-emerald-500/10 border-emerald-500/25 text-emerald-455 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Linked</span>
                      </span>
                    ) : (
                      <span className="px-3.5 h-6.5 flex items-center gap-1.5 rounded-full border text-[10.5px] font-bold tracking-wide uppercase leading-none bg-[#19191C] border-[#252529] text-zinc-400 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-555" />
                        <span>Not linked</span>
                      </span>
                    )}
                    <ChevronRight size={14} className="text-zinc-650" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1.5">
                <span className="text-[10.5px] font-bold text-zinc-500 tracking-widest leading-none block uppercase font-mono">
                  Copyable Links Vault
                </span>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`text-[9.5px] font-bold flex items-center space-x-1 ${isDark ? "text-blue-400 hover:text-blue-350" : "text-[#007AFF] hover:text-blue-700"} transition-colors cursor-pointer`}
                >
                  <Plus size={10} />
                  <span>{showAddForm ? "Close" : "Add Link"}</span>
                </button>
              </div>

              {showAddForm && (
                <div className={`${cardClass} p-4.5 space-y-3 rounded-[22px]`}>
                  <div className="space-y-1">
                    <label className={labelClass}>Link Label / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. My Portfolio Website, Project Demo"
                      value={newLinkLabel}
                      onChange={(e) => setNewLinkLabel(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>URL</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="e.g. github.com/username/project"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className={inputClass}
                      />
                      <button
                        onClick={handleAddCustomLink}
                        className={`px-4 py-2 rounded-xl text-[11px] font-bold shrink-0 ${isDark ? "bg-[#0A84FF] hover:bg-[#007AFF] text-white" : "bg-[#007AFF] hover:bg-[#0066D6] text-white"} transition-colors cursor-pointer`}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeLinksList.length === 0 && customLinks.length === 0 ? (
                <div className={`${cardClass} py-6 px-4 text-center rounded-[22px]`}>
                  <Link2 size={18} className={`mx-auto mb-1.5 ${isDark ? "text-zinc-700" : "text-zinc-300"}`} />
                  <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"} font-medium`}>
                    No links saved yet. Edit profile or add a custom link above!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeLinksList.map((item) => {
                    const id = `std_${item.label.toLowerCase()}`;
                    const isCopied = copiedLinkId === id;
                    return (
                      <div
                        key={id}
                        className={`p-4.5 rounded-[22px] border flex items-center justify-between transition-all duration-150 ${
                          isDark ? "bg-[#0C0C0E]/95 border-zinc-805/80" : "bg-white border-zinc-200 shadow-xs"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-4 text-left">
                          <span className="text-sm font-bold text-white block leading-none font-sans">{item.label}</span>
                          <span className="text-xs text-zinc-500 block truncate mt-1.5 font-medium font-sans">
                            {item.url}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => handleCopy(item.url, id, item.label)}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                              isCopied
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450"
                                : isDark
                                ? "bg-[#242428] border-[#3E3E42] text-zinc-400 hover:text-white"
                                : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                            } cursor-pointer`}
                            title={`Copy ${item.label} URL`}
                          >
                            {isCopied ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                          <button
                            onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                              isDark
                                ? "bg-[#242428] border-[#3E3E42] text-zinc-400 hover:text-white"
                                : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                            } cursor-pointer`}
                            title="Visit Link"
                          >
                            <ExternalLink size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {customLinks.map((item) => {
                    const isCopied = copiedLinkId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`p-4.5 rounded-[22px] border flex items-center justify-between transition-all duration-150 ${
                          isDark ? "bg-[#0C0C0E]/95 border-zinc-805/80" : "bg-white border-zinc-200 shadow-xs"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-4 text-left">
                          <span className="text-sm font-bold text-white block leading-none font-sans">{item.label}</span>
                          <span className="text-xs text-zinc-500 block truncate mt-1.5 font-medium font-sans">
                            {item.url}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => handleCopy(item.url, item.id, item.label)}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                              isCopied
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450"
                                : isDark
                                ? "bg-[#242428] border-[#3E3E42] text-zinc-400 hover:text-white"
                                : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                            } cursor-pointer`}
                            title="Copy URL"
                          >
                            {isCopied ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                          <button
                            onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                              isDark
                                ? "bg-[#242428] border-[#3E3E42] text-zinc-400 hover:text-white"
                                : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                            } cursor-pointer`}
                            title="Visit URL"
                          >
                            <ExternalLink size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomLink(item.id, item.label)}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                              isDark
                                ? "bg-red-950/20 border-red-900/30 text-red-400 hover:bg-red-900/30"
                                : "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                            } cursor-pointer`}
                            title="Delete Link"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3.5 text-left">
              <span className="text-[10.5px] font-bold text-zinc-500 tracking-widest leading-none block uppercase font-mono">
                Personal Information
              </span>
              <div className={`rounded-[22px] border divide-y divide-zinc-800/40 p-1.5 ${
                isDark ? "bg-[#0C0C0E]/95 border-zinc-800/80" : "bg-white border-zinc-200 shadow-xs"
              }`}>
                {/* Email */}
                <div className="p-4 flex items-center justify-between min-h-[56px]">
                  <div className="flex items-center min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 border border-rose-100 text-rose-500"
                    }`}>
                      <Mail size={16} />
                    </div>
                    <span className="text-sm font-semibold text-white block leading-none font-sans ml-3">Email</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-400 truncate max-w-[180px] text-right font-sans">
                    {profileEmail || "No email"}
                  </span>
                </div>

                {/* Phone */}
                <div className="p-4 flex items-center justify-between min-h-[56px]">
                  <div className="flex items-center min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 border border-emerald-100 text-emerald-500"
                    }`}>
                      <Phone size={16} />
                    </div>
                    <span className="text-sm font-semibold text-white block leading-none font-sans ml-3">Phone</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-400 text-right font-sans">
                    {profilePhone || "No phone"}
                  </span>
                </div>

                {/* Location */}
                <div className="p-4 flex items-center justify-between min-h-[56px]">
                  <div className="flex items-center min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isDark ? "bg-blue-500/10 text-blue-450" : "bg-blue-50 border border-blue-100 text-blue-500"
                    }`}>
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-semibold text-white block leading-none font-sans ml-3">Location</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-400 text-right truncate max-w-[180px] font-sans">
                    {profileAddress || "No location"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleOpenEdit}
                className="w-full h-13.5 rounded-[22px] bg-[#0A84FF] hover:bg-[#007AFF] text-white font-extrabold text-[13.5px] shadow-lg shadow-blue-500/10 cursor-pointer transition-all active:scale-[0.97] flex items-center justify-center space-x-1.5 mt-2"
              >
                <span>Edit Profile</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
