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
  TrendingUp,
  ArrowLeft,
  Edit2,
  MoreHorizontal
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
  const documentService = React.useMemo(() => new DocumentService(), []);
  const resumeFileInputRef = useRef<HTMLInputElement | null>(null);

  const [showResumeManager, setShowResumeManager] = useState(false);
  const [renamingResumeId, setRenamingResumeId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");

  const [showCertManager, setShowCertManager] = useState(false);
  const [renamingCertId, setRenamingCertId] = useState<string | null>(null);
  const [renameCertInput, setRenameCertInput] = useState("");

  const [replacingResumeId, setReplacingResumeId] = useState<string | null>(null);
  const [replacingCertId, setReplacingCertId] = useState<string | null>(null);
  const [activeResumeMenuId, setActiveResumeMenuId] = useState<string | null>(null);
  const [activeCertMenuId, setActiveCertMenuId] = useState<string | null>(null);

  const handleSetActiveResume = async (id: string) => {
    if (!auth.user) return;
    showToast("Updating default resume...", "info");
    const res = await resumeService.setActiveResume(auth.user.id, id);
    if (res.error) {
      showToast(res.error, "error");
      return;
    }
    const mapped = res.resumes.map((r) => ({
      id: r.id,
      name: r.name,
      version: r.version || "v1.0",
      storagePath: r.storage_path,
      isDefault: Boolean(r.is_active),
      createdAt: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      updatedAt: r.updated_at ? r.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
      fileSizeKb: r.file_size_kb || 450,
    }));
    setResumes(mapped);
    showToast("Default resume updated successfully", "success");
  };

  const handleRenameResumeSubmit = async (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) {
      showToast("Resume name cannot be empty.", "warning");
      return;
    }
    showToast("Renaming resume...", "info");
    const res = await resumeService.renameResume(id, trimmed);
    if (res.error) {
      showToast(res.error, "error");
      return;
    }
    setResumes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name: trimmed } : r))
    );
    setRenamingResumeId(null);
    setRenameInput("");
    showToast("Resume renamed successfully", "success");
  };

  const handleDeleteResume = async (id: string, storagePath: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      showToast("Deleting resume...", "info");
      const res = await resumeService.deleteResume(id, storagePath);
      if (res.error) {
        showToast(res.error, "error");
        return;
      }
      setResumes((prev) => prev.filter((r) => r.id !== id));
      showToast("Resume deleted successfully", "success");
    }
  };

  const handleRenameCertSubmit = async (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) {
      showToast("Certificate name cannot be empty.", "warning");
      return;
    }
    showToast("Renaming certificate...", "info");
    const res = await documentService.renameDocument(id, trimmed);
    if (res.error) {
      showToast(res.error, "error");
      return;
    }
    setVaultDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name: trimmed } : d))
    );
    setRenamingCertId(null);
    setRenameCertInput("");
    showToast("Certificate renamed successfully", "success");
  };

  const handleDeleteCert = async (id: string, storagePath: string) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      showToast("Deleting certificate...", "info");
      const res = await documentService.deleteDocument(id, storagePath);
      if (res.error) {
        showToast(res.error, "error");
        return;
      }
      setVaultDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast("Certificate deleted successfully", "success");
    }
  };

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
      if (replacingResumeId) {
        const oldResume = resumes.find(r => r.id === replacingResumeId);
        if (oldResume) {
          await resumeService.deleteResume(oldResume.id, oldResume.storagePath);
          setResumes((prev) => prev.filter((r) => r.id !== oldResume.id));
        }
        setReplacingResumeId(null);
        showToast(`Replaced document with ${res.resume.name}`, "success");
      } else {
        showToast(`Uploaded ${res.resume.name} successfully`, "success");
      }

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
      if (replacingCertId) {
        const oldCert = vaultDocuments.find(d => d.id === replacingCertId);
        if (oldCert) {
          await documentService.deleteDocument(oldCert.id, oldCert.storagePath);
          setVaultDocuments((prev) => prev.filter((d) => d.id !== oldCert.id));
        }
        setReplacingCertId(null);
        showToast(`Replaced certificate with ${res.document.name}`, "success");
      } else {
        showToast("Certificate uploaded successfully", "success");
      }

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
      {/* Root-level hidden file inputs to ensure they remain mounted for ref clicks */}
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

      <AnimatePresence mode="wait">
        {showCertManager ? (
          <motion.div
            key="cert-manager-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 text-left relative min-h-[500px]"
          >
            {/* Apple-style Large Header */}
            <div className="flex flex-col items-start px-1 space-y-2 mt-2">
              <button 
                type="button"
                onClick={() => {
                  setShowCertManager(false);
                  setActiveCertMenuId(null);
                }}
                className={`text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                  isDark ? "text-zinc-455 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <ArrowLeft size={13} />
                <span>Career Vault</span>
              </button>
              <div className="flex flex-col text-left">
                <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
                  Certificates
                </h1>
                <p className={`text-[11.5px] tracking-tight font-medium mt-1 leading-tight ${isDark ? "text-zinc-500" : "text-zinc-450"}`}>
                  Verify and present your verified academic credentials.
                </p>
              </div>
            </div>

            {/* List of certificates */}
            <div className="space-y-4.5 mt-5">
              {vaultDocuments.filter(d => d.category?.toLowerCase() === "certificate").length === 0 ? (
                <div className={`py-16 px-6 text-center border border-dashed rounded-[20px] ${isDark ? "bg-[#18181B]/10 border-zinc-800/80" : "bg-zinc-50 border-zinc-250 shadow-xs"}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? "bg-zinc-900 text-zinc-500" : "bg-zinc-200/50 text-zinc-400"}`}>
                    <Award size={24} />
                  </div>
                  <h4 className={`text-sm font-bold ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>No Certificates Found</h4>
                  <p className={`text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-455"} mt-1.5 max-w-[200px] mx-auto leading-relaxed`}>
                    Archive your credentials and verified academic sync files here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {vaultDocuments
                    .filter(d => d.category?.toLowerCase() === "certificate")
                    .map((c) => {
                      const isRenaming = renamingCertId === c.id;

                      return (
                        <div 
                          key={c.id} 
                          className={`p-5 rounded-[20px] border relative transition-all duration-200 ${
                            isDark 
                              ? "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]" 
                              : "bg-white border-zinc-200/60 hover:bg-zinc-50/50 shadow-xs"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                                isDark 
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                  : "bg-emerald-50 border-emerald-100 text-emerald-600"
                              }`}>
                                <Award size={22} />
                              </div>
                              <div className="text-left min-w-0">
                                {isRenaming ? (
                                  <div className="flex items-center space-x-2 mt-0.5">
                                    <input
                                      type="text"
                                      value={renameCertInput}
                                      onChange={(e) => setRenameCertInput(e.target.value)}
                                      className={`h-8 px-2.5 rounded-lg text-xs outline-none border transition-all ${
                                        isDark 
                                          ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500" 
                                          : "bg-zinc-50 border-zinc-250 text-zinc-900 focus:border-blue-600"
                                      }`}
                                      autoFocus
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRenameCertSubmit(c.id, renameCertInput)}
                                      className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-550 text-white text-[10px] font-bold cursor-pointer"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setRenamingCertId(null)}
                                      className={`h-8 px-2 rounded-lg text-[10px] font-bold cursor-pointer ${isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-800"}`}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[14px] font-bold leading-tight truncate max-w-[160px] ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                                      {c.name}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-extrabold tracking-wider uppercase border shrink-0 ${
                                      isDark 
                                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                                        : "bg-indigo-50 text-indigo-700 border-indigo-100"
                                    }`}>
                                      Verified
                                    </span>
                                  </div>
                                )}
                                <span className={`text-[10px] font-mono leading-tight block mt-1 ${isDark ? "text-zinc-550" : "text-zinc-400"}`}>
                                  {c.fileSizeKb ? `${c.fileSizeKb} KB` : "500 KB"} • {c.createdAt || "Just now"} • Certificate
                                </span>
                              </div>
                            </div>

                            {/* Dropdown Menu Trigger */}
                            <div className="relative shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveCertMenuId(activeCertMenuId === c.id ? null : c.id);
                                }}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                                  isDark ? "bg-[#1E1E22] border-zinc-800 text-zinc-400 hover:text-white" : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                                }`}
                              >
                                <MoreHorizontal size={14} />
                              </button>

                              {/* Dropdown Content */}
                              <AnimatePresence>
                                {activeCertMenuId === c.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-40 cursor-default" 
                                      onClick={() => setActiveCertMenuId(null)}
                                    />
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                      transition={{ duration: 0.12 }}
                                      className={`absolute right-0 mt-1 w-44 rounded-xl border z-50 shadow-lg ${
                                        isDark 
                                          ? "bg-[#1C1C1E] border-zinc-800 text-zinc-250" 
                                          : "bg-white border-zinc-200 text-zinc-800"
                                      } py-1 overflow-hidden`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveCertMenuId(null);
                                          handleViewDocument(c);
                                        }}
                                        className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center space-x-2 ${
                                          isDark ? "hover:bg-zinc-800/60 text-zinc-300" : "hover:bg-zinc-105 text-zinc-700"
                                        }`}
                                      >
                                        <ExternalLink size={12} />
                                        <span>Open Certificate</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveCertMenuId(null);
                                          setRenamingCertId(c.id);
                                          setRenameCertInput(c.name);
                                        }}
                                        className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center space-x-2 ${
                                          isDark ? "hover:bg-zinc-800/60 text-zinc-300" : "hover:bg-zinc-105 text-zinc-700"
                                        }`}
                                      >
                                        <Edit2 size={12} />
                                        <span>Rename File</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveCertMenuId(null);
                                          setReplacingCertId(c.id);
                                          certFileInputRef.current?.click();
                                        }}
                                        className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center space-x-2 ${
                                          isDark ? "hover:bg-zinc-800/60 text-zinc-300" : "hover:bg-zinc-105 text-zinc-700"
                                        }`}
                                      >
                                        <Upload size={12} />
                                        <span>Replace File</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveCertMenuId(null);
                                          handleViewDocument(c);
                                        }}
                                        className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center space-x-2 ${
                                          isDark ? "hover:bg-zinc-800/60 text-zinc-300" : "hover:bg-zinc-105 text-zinc-700"
                                        }`}
                                      >
                                        <Upload size={12} className="rotate-180" />
                                        <span>Download PDF</span>
                                      </button>
                                      <div className={`h-[0.5px] ${isDark ? "bg-zinc-800" : "bg-zinc-150"}`} />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveCertMenuId(null);
                                          handleDeleteCert(c.id, c.storagePath);
                                        }}
                                        className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center space-x-2 text-red-500 ${
                                          isDark ? "hover:bg-red-950/20" : "hover:bg-red-50"
                                        }`}
                                      >
                                        <Trash2 size={12} />
                                        <span>Delete Certificate</span>
                                      </button>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Premium Floating Upload FAB */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => certFileInputRef.current?.click()}
              className="fixed bottom-24 right-6 w-13 h-13 rounded-full bg-blue-650 hover:bg-blue-600 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 z-40 border border-blue-500/30 cursor-pointer"
            >
              <Plus size={22} />
            </motion.button>
          </motion.div>
        ) : showResumeManager ? (
          <motion.div
            key="resume-manager-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 text-left relative min-h-[500px]"
          >
            {/* Apple-style Large Header */}
            <div className="flex flex-col items-start px-1 space-y-2 mt-2">
              <button 
                type="button"
                onClick={() => {
                  setShowResumeManager(false);
                  setActiveResumeMenuId(null);
                }}
                className={`text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                  isDark ? "text-zinc-455 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <ArrowLeft size={13} />
                <span>Career Vault</span>
              </button>
              <div className="flex flex-col text-left">
                <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
                  Resumes
                </h1>
                <p className={`text-[11.5px] tracking-tight font-medium mt-1 leading-tight ${isDark ? "text-zinc-500" : "text-zinc-450"}`}>
                  Manage your active credentials for applicant sync systems.
                </p>
              </div>
            </div>

            {/* List of resumes */}
            <div className="space-y-4.5 mt-5">
              {resumes.length === 0 ? (
                <div className={`py-16 px-6 text-center border border-dashed rounded-[20px] ${isDark ? "bg-[#18181B]/10 border-zinc-800/80" : "bg-zinc-50 border-zinc-250 shadow-xs"}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? "bg-zinc-900 text-zinc-500" : "bg-zinc-200/50 text-zinc-400"}`}>
                    <FileText size={24} />
                  </div>
                  <h4 className={`text-sm font-bold ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>No Resumes Found</h4>
                  <p className={`text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-455"} mt-1.5 max-w-[200px] mx-auto leading-relaxed`}>
                    Upload your active resume versions to start syncing with recruiter portals.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {resumes.map((r) => {
                    const isDefault = r.isDefault;
                    const isRenaming = renamingResumeId === r.id;

                    return (
                      <div 
                        key={r.id} 
                        className={`p-5 rounded-[20px] border relative transition-all duration-200 ${
                          isDark 
                            ? "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]" 
                            : "bg-white border-zinc-200/60 hover:bg-zinc-50/50 shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                              isDark 
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                                : "bg-blue-50 border-blue-100 text-blue-600"
                            }`}>
                              <FileText size={22} />
                            </div>
                            <div className="text-left min-w-0">
                              {isRenaming ? (
                                <div className="flex items-center space-x-2 mt-0.5">
                                  <input
                                    type="text"
                                    value={renameInput}
                                    onChange={(e) => setRenameInput(e.target.value)}
                                    className={`h-8 px-2.5 rounded-lg text-xs outline-none border transition-all ${
                                      isDark 
                                        ? "bg-zinc-900 border-zinc-800 text-white focus:border-blue-500" 
                                        : "bg-zinc-50 border-zinc-250 text-zinc-900 focus:border-blue-600"
                                    }`}
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRenameResumeSubmit(r.id, renameInput)}
                                    className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-550 text-white text-[10px] font-bold cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setRenamingResumeId(null)}
                                    className={`h-8 px-2 rounded-lg text-[10px] font-bold cursor-pointer ${isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-800"}`}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className={`text-[14px] font-bold leading-tight truncate max-w-[150px] ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                                    {r.name}
                                  </span>
                                  {isDefault && (
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[8px] font-extrabold tracking-wider uppercase border border-emerald-500/20 shrink-0">
                                      Default
                                    </span>
                                  )}
                                </div>
                              )}
                              <span className={`text-[10px] font-mono leading-tight block mt-1 ${isDark ? "text-zinc-555" : "text-zinc-400"}`}>
                                {r.fileSizeKb ? `${r.fileSizeKb} KB` : "450 KB"} • {r.createdAt || "Just now"} • Resume
                              </span>
                            </div>
                          </div>

                          {/* Dropdown Menu Trigger */}
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                  setActiveResumeMenuId(activeResumeMenuId === r.id ? null : r.id);
                              }}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                                isDark ? "bg-[#1E1E22] border-zinc-800 text-zinc-400 hover:text-white" : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                              }`}
                            >
                              <MoreHorizontal size={14} />
                            </button>

                            {/* Dropdown Content */}
                            <AnimatePresence>
                              {activeResumeMenuId === r.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40 cursor-default" 
                                    onClick={() => setActiveResumeMenuId(null)}
                                  />
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.12 }}
                                    className={`absolute right-0 mt-1 w-44 rounded-xl border z-50 shadow-lg ${
                                      isDark 
                                        ? "bg-[#1C1C1E] border-zinc-800 text-zinc-250" 
                                        : "bg-white border-zinc-200 text-zinc-800"
                                    } py-1 overflow-hidden`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveResumeMenuId(null);
                                        handleViewResume(r.storagePath, r.name);
                                      }}
                                      className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center space-x-2 ${
                                        isDark ? "hover:bg-zinc-800/60 text-zinc-300" : "hover:bg-zinc-105 text-zinc-700"
                                      }`}
                                    >
                                      <ExternalLink size={12} />
                                      <span>Open Resume</span>
                                    </button>
                                    {!isDefault && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveResumeMenuId(null);
                                          handleSetActiveResume(r.id);
                                        }}
                                        className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center space-x-2 ${
                                          isDark ? "hover:bg-zinc-800/60 text-zinc-300" : "hover:bg-zinc-105 text-zinc-700"
                                        }`}
                                      >
                                        <Check size={12} />
                                        <span>Mark as Default</span>
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveResumeMenuId(null);
                                        setRenamingResumeId(r.id);
                                        setRenameInput(r.name);
                                      }}
                                      className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center space-x-2 ${
                                        isDark ? "hover:bg-zinc-800/60 text-zinc-300" : "hover:bg-zinc-105 text-zinc-700"
                                      }`}
                                    >
                                      <Edit2 size={12} />
                                      <span>Rename File</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveResumeMenuId(null);
                                        setReplacingResumeId(r.id);
                                        resumeFileInputRef.current?.click();
                                      }}
                                      className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center space-x-2 ${
                                        isDark ? "hover:bg-zinc-800/60 text-zinc-300" : "hover:bg-zinc-105 text-zinc-700"
                                      }`}
                                    >
                                      <Upload size={12} />
                                      <span>Replace File</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveResumeMenuId(null);
                                        handleViewResume(r.storagePath, r.name);
                                      }}
                                      className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center space-x-2 ${
                                        isDark ? "hover:bg-zinc-800/60 text-zinc-300" : "hover:bg-zinc-105 text-zinc-700"
                                      }`}
                                    >
                                      <Upload size={12} className="rotate-180" />
                                      <span>Download PDF</span>
                                    </button>
                                    <div className={`h-[0.5px] ${isDark ? "bg-zinc-800" : "bg-zinc-150"}`} />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveResumeMenuId(null);
                                        handleDeleteResume(r.id, r.storagePath);
                                      }}
                                      className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center space-x-2 text-red-500 ${
                                        isDark ? "hover:bg-red-950/20" : "hover:bg-red-50"
                                      }`}
                                    >
                                      <Trash2 size={12} />
                                      <span>Delete Resume</span>
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Premium Floating Upload FAB */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => resumeFileInputRef.current?.click()}
              className="fixed bottom-24 right-6 w-13 h-13 rounded-full bg-blue-650 hover:bg-blue-600 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 z-40 border border-blue-500/30 cursor-pointer"
            >
              <Plus size={22} />
            </motion.button>
          </motion.div>
        ) : isEditing ? (
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
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setShowResumeManager(true);
                        }}
                        className={`px-3 py-1.5 ${isDark ? "bg-[#1C1C1E] border border-zinc-805 text-zinc-300 hover:text-white" : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"} text-[10px] font-bold rounded-lg transition-colors cursor-pointer`}
                      >
                        Manage Resumes
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
            className="space-y-6"
          >
            {/* ── PAGE HEADER ── */}
            <div className="pt-3 flex items-center justify-between text-left">
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

            {/* ── HERO PROFILE CARD ── */}
            <div className={`rounded-[26px] border relative overflow-hidden ${
              isDark
                ? "bg-[#0C0C0E] border-zinc-800/70 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
                : "bg-white border-zinc-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            }`}>
              {/* subtle top gradient stripe */}
              <div className={`absolute inset-x-0 top-0 h-[2px] rounded-t-[26px] ${isDark ? "bg-gradient-to-r from-blue-600/60 via-indigo-500/40 to-transparent" : "bg-gradient-to-r from-blue-400/40 via-indigo-300/30 to-transparent"}`} />

              <div className="px-6 pt-7 pb-6">
                {/* Avatar + Name row */}
                <div className="flex items-center gap-5">
                  <div className="relative group shrink-0">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarFileSelect}
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-[88px] h-[88px] rounded-full overflow-hidden flex items-center justify-center border-2 cursor-pointer relative transition-transform active:scale-95 ${
                        isDark ? "bg-gradient-to-br from-blue-900/40 to-indigo-900/30 border-blue-500/35 text-blue-300" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/80 text-blue-600"
                      }`}
                      title="Tap to change photo"
                    >
                      {auth.avatarSignedUrl ? (
                        <img src={auth.avatarSignedUrl} alt={profileName} className="w-full h-full object-cover" />
                      ) : (
                        <span className={`text-[32px] font-extrabold ${isDark ? "text-blue-300" : "text-blue-500"}`}>{getInitials(profileName || "User").charAt(0)}</span>
                      )}
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                        <Camera size={20} className="text-white" />
                      </div>
                    </div>
                    {/* online indicator dot */}
                    <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0C0C0E] dark:border-[#0C0C0E] shadow" />
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <h3 className={`text-[24px] font-extrabold tracking-tight leading-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                      {profileName || "Placement Candidate"}
                    </h3>
                    <div className={`flex items-center gap-1.5 mt-1 text-[13px] font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      <GraduationCap size={13} className="shrink-0 opacity-70" />
                      <span className="truncate">{profileCollege || "University / College"}</span>
                    </div>
                    {profileBranch && (
                      <span className={`mt-1.5 inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
                      }`}>{profileBranch}</span>
                    )}
                  </div>
                </div>

                {/* ── STAT TILES ── */}
                {(profileDegree || profileCgpa || profileGradYear) && (
                  <div className={`mt-6 pt-5 border-t ${isDark ? "border-zinc-800/50" : "border-zinc-100"} grid grid-cols-3 gap-2.5`}>
                    {/* Degree */}
                    <div className={`rounded-2xl border p-4 flex flex-col items-center justify-between gap-3 ${
                      isDark ? "bg-[#101014] border-[#222228] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" : "bg-zinc-50 border-zinc-150"
                    }`} style={{ minHeight: 126 }}>
                      <span className={`text-[9px] font-bold uppercase tracking-widest leading-none ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Degree</span>
                      <span className={`text-[15px] font-extrabold leading-tight text-center ${isDark ? "text-zinc-100" : "text-zinc-800"}`} style={{ wordBreak: "break-word" }}>
                        {profileDegree || "—"}
                      </span>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isDark ? "bg-blue-500/12 text-blue-400" : "bg-blue-50 text-blue-600"
                      }`}>
                        <GraduationCap size={15} />
                      </div>
                    </div>

                    {/* CGPA */}
                    <div className={`rounded-2xl border p-4 flex flex-col items-center justify-between gap-3 ${
                      isDark ? "bg-[#101014] border-[#222228] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" : "bg-zinc-50 border-zinc-150"
                    }`} style={{ minHeight: 126 }}>
                      <span className={`text-[9px] font-bold uppercase tracking-widest leading-none ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>CGPA</span>
                      <span className="text-[22px] font-black leading-none text-[#0A84FF] dark:text-[#3B82F6]">
                        {profileCgpa || "—"}
                      </span>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isDark ? "bg-blue-500/12 text-blue-400" : "bg-blue-50 text-blue-600"
                      }`}>
                        <TrendingUp size={15} />
                      </div>
                    </div>

                    {/* Grad Year */}
                    <div className={`rounded-2xl border p-4 flex flex-col items-center justify-between gap-3 ${
                      isDark ? "bg-[#101014] border-[#222228] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" : "bg-zinc-50 border-zinc-150"
                    }`} style={{ minHeight: 126 }}>
                      <span className={`text-[9px] font-bold uppercase tracking-widest leading-none ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Grad</span>
                      <span className={`text-[18px] font-black leading-none ${isDark ? "text-zinc-100" : "text-zinc-800"}`}>
                        {profileGradYear || "—"}
                      </span>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isDark ? "bg-blue-500/12 text-blue-400" : "bg-blue-50 text-blue-600"
                      }`}>
                        <Calendar size={15} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── PROFILE COMPLETION ── */}
            <div className="space-y-2.5 text-left">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Profile Completion</span>
                <span className={`text-[11px] font-extrabold ${isDark ? "text-blue-400" : "text-[#007AFF]"}`}>{completion}%</span>
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

            {/* ── QUICK DOCUMENTS ── */}
            <div className="space-y-3 text-left">
              <span className={`text-[10.5px] font-bold uppercase tracking-widest leading-none block px-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Quick Documents
              </span>
              
              <div className={`rounded-[24px] border overflow-hidden divide-y ${isDark ? "bg-[#0C0C0E] border-zinc-800/70 divide-zinc-800/50 shadow-[0_4px_20px_rgba(0,0,0,0.30)]" : "bg-white border-zinc-200/80 divide-zinc-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"}`}>
                {/* 1. Resume */}
                <div 
                  onClick={() => {
                    setShowResumeManager(true);
                  }}
                  className={`min-h-[72px] px-5 py-4 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 ${isDark ? "hover:bg-white/[0.025] active:bg-white/[0.05]" : "hover:bg-zinc-50/80 active:bg-zinc-100/60"}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-blue-500/12 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
                    }`}>
                      <FileText size={21} />
                    </div>
                    <div className="text-left min-w-0">
                      <span className={`text-[14px] font-bold block leading-tight ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>Resume</span>
                      <span className={`text-[12px] font-medium block truncate max-w-[160px] mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        {resumes.find(r => r.isDefault)?.name || resumes[0]?.name || "Manage your resumes"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {resumes.length > 0 ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-emerald-500/12 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                        {resumes.length} {resumes.length === 1 ? "File" : "Files"}
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 block" />
                        Upload
                      </span>
                    )}
                    <ChevronRight size={15} className={isDark ? "text-zinc-700" : "text-zinc-300"} />
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
                  className={`min-h-[72px] px-5 py-4 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 ${isDark ? "hover:bg-white/[0.025] active:bg-white/[0.05]" : "hover:bg-zinc-50/80 active:bg-zinc-100/60"}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-indigo-500/12 border-indigo-500/20 text-indigo-400" : "bg-indigo-50 border-indigo-100 text-indigo-600"
                    }`}>
                      <FileText size={21} />
                    </div>
                    <div className="text-left min-w-0">
                      <span className={`text-[14px] font-bold block leading-tight ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>Cover Letter</span>
                      <span className={`text-[12px] font-medium block truncate max-w-[160px] mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        {vaultDocuments.find(d => d.category?.toLowerCase() === "cover letter")?.name || "Standard cover letter"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {vaultDocuments.find(d => d.category?.toLowerCase() === "cover letter") ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-emerald-500/12 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                        Available
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 block" />
                        Upload
                      </span>
                    )}
                    <ChevronRight size={15} className={isDark ? "text-zinc-700" : "text-zinc-300"} />
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
                  className={`min-h-[72px] px-5 py-4 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 ${isDark ? "hover:bg-white/[0.025] active:bg-white/[0.05]" : "hover:bg-zinc-50/80 active:bg-zinc-100/60"}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-amber-500/12 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-100 text-amber-600"
                    }`}>
                      <Briefcase size={21} />
                    </div>
                    <div className="text-left min-w-0">
                      <span className={`text-[14px] font-bold block leading-tight ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>Portfolio</span>
                      <span className={`text-[12px] font-medium block truncate max-w-[160px] mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        {linkPortfolio || "Portfolio link or file"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {(vaultDocuments.find(d => d.category?.toLowerCase() === "portfolio") || linkPortfolio) ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-emerald-500/12 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                        Available
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 block" />
                        Upload
                      </span>
                    )}
                    <ChevronRight size={15} className={isDark ? "text-zinc-700" : "text-zinc-300"} />
                  </div>
                </div>

                {/* 4. Certificates */}
                <div 
                  onClick={() => {
                    setShowCertManager(true);
                  }}
                  className={`min-h-[72px] px-5 py-4 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 ${isDark ? "hover:bg-white/[0.025] active:bg-white/[0.05]" : "hover:bg-zinc-50/80 active:bg-zinc-100/60"}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-emerald-500/12 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                    }`}>
                      <Award size={21} />
                    </div>
                    <div className="text-left min-w-0">
                      <span className={`text-[14px] font-bold block leading-tight ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>Certificates</span>
                      <span className={`text-[12px] font-medium block truncate max-w-[160px] mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        Your verified certificates
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {vaultDocuments.filter(d => d.category?.toLowerCase() === "certificate").length > 0 ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-emerald-500/12 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                        {vaultDocuments.filter(d => d.category?.toLowerCase() === "certificate").length} Verified
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 block" />
                        0 Added
                      </span>
                    )}
                    <ChevronRight size={15} className={isDark ? "text-zinc-700" : "text-zinc-300"} />
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

            {/* ── PROFESSIONAL LINKS ── */}
            <div className="space-y-3 text-left">
              <span className={`text-[10.5px] font-bold uppercase tracking-widest leading-none block px-0.5 font-sans ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Professional Links
              </span>
              <div className={`rounded-[24px] border overflow-hidden divide-y ${isDark ? "bg-[#0C0C0E] border-zinc-800/70 divide-zinc-800/50 shadow-[0_4px_20px_rgba(0,0,0,0.30)]" : "bg-white border-zinc-200/80 divide-zinc-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"}`}>
                {/* LinkedIn */}
                <div 
                  onClick={() => {
                    if (linkLinkedin) {
                      window.open(linkLinkedin, "_blank", "noopener,noreferrer");
                    } else {
                      showToast("No LinkedIn profile linked yet.", "warning");
                    }
                  }}
                  className={`min-h-[68px] px-5 py-4 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 ${isDark ? "hover:bg-white/[0.025] active:bg-white/[0.05]" : "hover:bg-zinc-50/80 active:bg-zinc-100/60"}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-[#0077B5]/12 border-[#0077B5]/20 text-[#33a0ff]" : "bg-[#0077B5]/10 border-[#0077B5]/20 text-[#0077B5]"
                    }`}>
                      <Linkedin size={21} />
                    </div>
                    <span className={`text-[14px] font-bold block leading-tight ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>LinkedIn</span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {linkLinkedin ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-emerald-500/12 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                        Linked
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 block" />
                        Not linked
                      </span>
                    )}
                    <ChevronRight size={15} className={isDark ? "text-zinc-700" : "text-zinc-300"} />
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
                  className={`min-h-[68px] px-5 py-4 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 ${isDark ? "hover:bg-white/[0.025] active:bg-white/[0.05]" : "hover:bg-zinc-50/80 active:bg-zinc-100/60"}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-zinc-800/40 border-zinc-700/40 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-700"
                    }`}>
                      <Github size={21} />
                    </div>
                    <span className={`text-[14px] font-bold block leading-tight ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>GitHub</span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {linkGithub ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-emerald-500/12 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                        Linked
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 block" />
                        Not linked
                      </span>
                    )}
                    <ChevronRight size={15} className={isDark ? "text-zinc-700" : "text-zinc-300"} />
                  </div>
                </div>

                {/* Portfolio Website */}
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
                  className={`min-h-[68px] px-5 py-4 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 ${isDark ? "hover:bg-white/[0.025] active:bg-white/[0.05]" : "hover:bg-zinc-50/80 active:bg-zinc-100/60"}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 border ${
                      isDark ? "bg-cyan-500/12 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-100 text-cyan-600"
                    }`}>
                      <Globe size={21} />
                    </div>
                    <span className={`text-[14px] font-bold block leading-tight ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>Portfolio Website</span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {(linkPersonalWebsite || linkPortfolio) ? (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-emerald-500/12 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                        Linked
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 block" />
                        Not linked
                      </span>
                    )}
                    <ChevronRight size={15} className={isDark ? "text-zinc-700" : "text-zinc-300"} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── COPYABLE LINKS VAULT ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-0.5">
                <span className={`text-[10.5px] font-bold font-sans uppercase tracking-widest leading-none block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
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

            {/* ── PERSONAL INFORMATION ── */}
            <div className="space-y-3 text-left">
              <span className={`text-[10.5px] font-bold uppercase tracking-widest leading-none block px-0.5 font-sans ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Personal Information
              </span>
              <div className={`rounded-[24px] border overflow-hidden divide-y ${isDark ? "bg-[#0C0C0E] border-zinc-800/70 divide-zinc-800/50 shadow-[0_4px_20px_rgba(0,0,0,0.30)]" : "bg-white border-zinc-200/80 divide-zinc-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"}`}>
                {/* Email */}
                <div className={`min-h-[64px] px-5 py-4 flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 ${
                      isDark ? "bg-rose-500/12 text-rose-400" : "bg-rose-50 border border-rose-100 text-rose-500"
                    }`}>
                      <Mail size={18} />
                    </div>
                    <span className={`text-[14px] font-bold block ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>Email</span>
                  </div>
                  <span className={`text-[12.5px] font-medium text-right truncate max-w-[165px] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {profileEmail || "No email"}
                  </span>
                </div>

                {/* Phone */}
                <div className={`min-h-[64px] px-5 py-4 flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 ${
                      isDark ? "bg-emerald-500/12 text-emerald-400" : "bg-emerald-50 border border-emerald-100 text-emerald-500"
                    }`}>
                      <Phone size={18} />
                    </div>
                    <span className={`text-[14px] font-bold block ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>Phone</span>
                  </div>
                  <span className={`text-[12.5px] font-medium text-right ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {profilePhone || "No phone"}
                  </span>
                </div>

                {/* Location */}
                <div className={`min-h-[64px] px-5 py-4 flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 ${
                      isDark ? "bg-blue-500/12 text-blue-400" : "bg-blue-50 border border-blue-100 text-blue-500"
                    }`}>
                      <MapPin size={18} />
                    </div>
                    <span className={`text-[14px] font-bold block ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>Location</span>
                  </div>
                  <span className={`text-[12.5px] font-medium text-right truncate max-w-[165px] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {profileAddress || "No location"}
                  </span>
                </div>
              </div>
            </div>

            {/* ── EDIT PROFILE CTA ── */}
            <div className="pb-2">
              <button
                onClick={handleOpenEdit}
                className={`w-full py-4 rounded-[22px] font-extrabold text-[14px] cursor-pointer transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg ${
                  isDark
                    ? "bg-[#0A84FF] hover:bg-[#007AFF] text-white shadow-blue-500/15"
                    : "bg-[#007AFF] hover:bg-[#0066D6] text-white shadow-blue-400/20"
                }`}
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
