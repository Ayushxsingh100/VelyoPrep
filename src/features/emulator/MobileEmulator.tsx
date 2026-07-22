import React, { useState } from "react";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { ReleaseConsoleScreen } from "../release_console/ReleaseConsoleScreen";
import { TrackerScreen } from "../tracker/TrackerScreen";
import { VaultScreen } from "../vault/VaultScreen";
import { DeadlinesScreen } from "../deadlines/DeadlinesScreen";
import { JobsScreen } from "../jobs/JobsScreen";
import { SettingsScreen } from "../settings/SettingsScreen";
import { 
  Lock, Mail, Smartphone, Plus, CheckCircle, 
  Trash2, X, Calendar, AlertTriangle, Search, Sparkles,
  Sliders, ArrowLeft, Briefcase, User, 
  RefreshCw, Eye, EyeOff, Home, BarChart2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VeyloPrepLogo } from "../../shared/components/logo/VeyloPrepLogo";
import { SplashScreen } from "../splash/SplashScreen";
import { useAuth } from "../../providers/auth.provider";
import { JobService } from "../../services/job.service";
import { DeadlineService } from "../../services/deadline.service";
import { ResumeService } from "../../services/resume.service";
import { DocumentService } from "../../services/document.service";
import { ApplicationService } from "../../services/application.service";
import { NoteService } from "../../services/note.service";

interface MobileEmulatorProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  selectedTheme: "dark" | "light" | "system";
  setSelectedTheme: (theme: "dark" | "light" | "system") => void;
}

export default function MobileEmulator({
  isDark,
  setIsDark,
  selectedTheme,
  setSelectedTheme,
}: MobileEmulatorProps) {
  const auth = useAuth();
  const [currentScreen, setCurrentScreen] = useState<string>("splash");
  const isAuthenticated = auth.isAuthenticated;
  const userName = auth.profile?.full_name || auth.userProfile?.name || "Placement Candidate";
  const userEmail = auth.user?.email || auth.userProfile?.email || "candidate@veyloprep.com";

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirmPass, setRegConfirmPass] = useState("");
  const [regAcceptedTerms, setRegAcceptedTerms] = useState(false);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [simulateNetworkFailure, setSimulateNetworkFailure] = useState(false);

  const [activeSnackbar, setActiveSnackbar] = useState<{ message: string; type: "success" | "warning" | "error" | "info" } | null>(null);
  const [activeBottomSheet, setActiveBottomSheet] = useState<any | null>(null);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const [applications, setApplications] = useState<any[]>([]);

  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newIsInternship, setNewIsInternship] = useState(true);
  const [newCompensation, setNewCompensation] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newSource, setNewSource] = useState("LinkedIn");
  const [newJobUrl, setNewJobUrl] = useState("");
  const [newAppliedDate, setNewAppliedDate] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newStatus, setNewStatus] = useState("Applied");

  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editIsInternship, setEditIsInternship] = useState(true);
  const [editCompensation, setEditCompensation] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSource, setEditSource] = useState("LinkedIn");
  const [editJobUrl, setEditJobUrl] = useState("");
  const [editAppliedDate, setEditAppliedDate] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("Applied");

  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [recentlyDeletedApp, setRecentlyDeletedApp] = useState<{ app: any; index: number } | null>(null);
  const [simulateDatabaseFailure, setSimulateDatabaseFailure] = useState(false);

  const [showcaseInput, setShowcaseInput] = useState("");
  const [showcaseDropValue, setShowcaseDropValue] = useState("Applied");
  const [showcasePassword, setShowcasePassword] = useState("");
  const [showcasePasswordVisible, setShowcasePasswordVisible] = useState(false);
  const [easingTrigger, setEasingTrigger] = useState(0);

  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);

  const [vaultSubTab, setVaultSubTab] = useState<"overview" | "personal" | "links" | "resumes" | "documents">("overview");

  const [savedOpportunities, setSavedOpportunities] = useState<any[]>([]);

  const [recentlyVisitedPortals, setRecentlyVisitedPortals] = useState<string[]>([
    "LinkedIn",
    "Wellfound",
    "Company Career Sites"
  ]);

  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [jobPortalFilter, setJobPortalFilter] = useState("All");
  const [jobCategoryFilter, setJobCategoryFilter] = useState("All");
  const [jobBookmarkFilter, setJobBookmarkFilter] = useState("All");
  const [jobAppliedFilter, setJobAppliedFilter] = useState("All");
  const [jobSortOption, setJobSortOption] = useState("Recently Saved");

  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [activeJobCategoryTab, setActiveJobCategoryTab] = useState<string>("All");

  const [formJobCompany, setFormJobCompany] = useState("");
  const [formJobRole, setFormJobRole] = useState("");
  const [formJobPortal, setFormJobPortal] = useState("LinkedIn");
  const [formJobUrl, setFormJobUrl] = useState("");
  const [formJobLocation, setFormJobLocation] = useState("");
  const [formJobDeadline, setFormJobDeadline] = useState("");
  const [formJobNotes, setFormJobNotes] = useState("");
  const [formJobCategory, setFormJobCategory] = useState("Internships");
  const [formJobBookmarked, setFormJobBookmarked] = useState(false);

  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobPortalSubTab, setJobPortalSubTab] = useState<"dashboard" | "portals" | "ai_capture" | "saved">("dashboard");

  const [aiCaptureUrl, setAiCaptureUrl] = useState("");
  const [aiCaptureOutcome, setAiCaptureOutcome] = useState<"success" | "invalid_url" | "unsupported" | "network_fail" | "timeout" | "malformed">("success");
  const [isAiCapturing, setIsAiCapturing] = useState(false);
  const [aiCaptureStep, setAiCaptureStep] = useState<"idle" | "fetching" | "processing" | "extracting" | "preparing" | "review" | "done">("idle");
  const [aiCaptureError, setAiCaptureError] = useState<string | null>(null);
  
  const [reviewCompany, setReviewCompany] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewEmploymentType, setReviewEmploymentType] = useState("Full-time");
  const [reviewLocation, setReviewLocation] = useState("");
  const [reviewSalary, setReviewSalary] = useState("");
  const [reviewDeadline, setReviewDeadline] = useState("");
  const [reviewExperience, setReviewExperience] = useState("");
  const [reviewEligibility, setReviewEligibility] = useState("");
  const [reviewRequiredSkills, setReviewRequiredSkills] = useState<string[]>([]);
  const [reviewPreferredSkills, setReviewPreferredSkills] = useState<string[]>([]);
  const [reviewSummary, setReviewSummary] = useState("");
  const [reviewPortal, setReviewPortal] = useState("");
  const [reviewUrl, setReviewUrl] = useState("");
  const [reviewCreateDeadline, setReviewCreateDeadline] = useState(true);

  const [newRequiredSkillInput, setNewRequiredSkillInput] = useState("");
  const [newPreferredSkillInput, setNewPreferredSkillInput] = useState("");

  const [reviewConfidence, setReviewConfidence] = useState<Record<string, number>>({});

  const [aiCaptureHistory, setAiCaptureHistory] = useState<any[]>([]);

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCollege, setProfileCollege] = useState("");
  const [profileDegree, setProfileDegree] = useState("");
  const [profileBranch, setProfileBranch] = useState("");
  const [profileGradYear, setProfileGradYear] = useState("");
  const [profileCgpa, setProfileCgpa] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileDob, setProfileDob] = useState("");
  const [profilePreferredRoles, setProfilePreferredRoles] = useState("");
  const [profileSkills, setProfileSkills] = useState("");

  const [linkLinkedin, setLinkLinkedin] = useState("");
  const [linkGithub, setLinkGithub] = useState("");
  const [linkPortfolio, setLinkPortfolio] = useState("");
  const [linkLeetcode, setLinkLeetcode] = useState("");
  const [linkCodeforces, setLinkCodeforces] = useState("");
  const [linkCodechef, setLinkCodechef] = useState("");
  const [linkHackerRank, setLinkHackerRank] = useState("");
  const [linkPersonalWebsite, setLinkPersonalWebsite] = useState("");

  const [vaultDocuments, setVaultDocuments] = useState<any[]>([]);

  const [vaultUploading, setVaultUploading] = useState(false);
  const [vaultUploadProgress, setVaultUploadProgress] = useState(0);
  const [simulateVaultFailure, setSimulateVaultFailure] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

  const showToast = (message: string, type: "success" | "warning" | "error" | "info" = "success") => {
    setActiveSnackbar({ message, type });
    setTimeout(() => {
      setActiveSnackbar(null);
    }, 3000);
  };

  const getProfileCompletion = () => {
    let score = 0;
    if (profileName) score += 15;
    if (profileEmail) score += 15;
    if (profilePhone) score += 10;
    if (profileCollege) score += 15;
    if (profileCgpa && Number(profileCgpa) > 0) score += 15;
    if (linkLinkedin) score += 15;
    if (linkGithub) score += 15;
    return Math.min(100, score);
  };

  React.useEffect(() => {
    if (auth.profile) {
      if (auth.profile.full_name) setProfileName(auth.profile.full_name);
      if (auth.profile.university) setProfileCollege(auth.profile.university);
      if (auth.profile.degree) setProfileDegree(auth.profile.degree);
      if (auth.profile.graduation_year) setProfileGradYear(auth.profile.graduation_year);
      if (auth.profile.cgpa) setProfileCgpa(auth.profile.cgpa);
      if (auth.profile.phone) setProfilePhone(auth.profile.phone);
      if (auth.profile.target_role) setProfilePreferredRoles(auth.profile.target_role);
      if (auth.profile.skills && Array.isArray(auth.profile.skills)) setProfileSkills(auth.profile.skills.join(", "));
      if (auth.profile.linkedin_url) setLinkLinkedin(auth.profile.linkedin_url);
      if (auth.profile.github_url) setLinkGithub(auth.profile.github_url);
      if (auth.profile.portfolio_url) setLinkPortfolio(auth.profile.portfolio_url);
    }
  }, [auth.profile]);

  const jobService = React.useMemo(() => new JobService(), []);

  React.useEffect(() => {
    if (auth.user) {
      jobService.getJobs(auth.user.id).then((res) => {
        if (res.jobs) {
          const mapped = res.jobs.map((j) => ({
            id: j.id,
            company: j.company,
            role: j.role,
            isInternship: j.employment_type === "Internship",
            compensation: j.compensation || 0,
            location: j.location || "Remote",
            source: j.source || "LinkedIn",
            jobUrl: j.job_url || "",
            appliedDate: j.applied_date || new Date(j.created_at).toISOString().split("T")[0],
            deadline: j.deadline_date || "",
            notes: j.notes || "",
            status: j.status || "Applied",
            createdAt: j.created_at,
            updatedAt: j.updated_at,
            timelineLogs: [
              `Created: Application record logged via ${j.source || "System"}.`,
              `Status Set: Assigned initial pipeline stage to ${j.status}.`
            ]
          }));
          setApplications(mapped);
        }
      });
    }
  }, [auth.user, jobService]);

  const deadlineService = React.useMemo(() => new DeadlineService(), []);

  React.useEffect(() => {
    if (auth.user) {
      deadlineService.getDeadlines(auth.user.id).then((res) => {
        if (res.deadlines) {
          const mapped = res.deadlines.map((d) => ({
            id: d.id,
            title: d.title,
            company: d.job_id ? "Linked Job" : "Personal",
            type: d.deadline_type || "Assessment",
            dueDate: d.due_date ? d.due_date.split("T")[0] : new Date().toISOString().split("T")[0],
            dueTime: d.due_time || "10:00",
            priority: d.priority || "High",
            completed: Boolean(d.is_completed),
            notes: d.notes || d.description || "",
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
          setDeadlines(mapped);
        }
      });
    }
  }, [auth.user, deadlineService]);

  const resumeService = React.useMemo(() => new ResumeService(), []);

  React.useEffect(() => {
    if (auth.user) {
      resumeService.getResumes(auth.user.id).then((res) => {
        if (res.resumes) {
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
        }
      });
    }
  }, [auth.user, resumeService]);

  const documentService = React.useMemo(() => new DocumentService(), []);

  React.useEffect(() => {
    if (auth.user) {
      documentService.getDocuments(auth.user.id).then((res) => {
        if (res.documents) {
          const mapped = res.documents.map((d) => ({
            id: d.id,
            name: d.name,
            category: d.category || "Other",
            storagePath: d.storage_path,
            fileSizeKb: d.file_size_kb || 500,
            createdAt: d.created_at ? d.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            updatedAt: d.updated_at ? d.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
          }));
          setVaultDocuments(mapped);
        }
      });
    }
  }, [auth.user, documentService]);

  const applicationService = React.useMemo(() => new ApplicationService(), []);
  const noteService = React.useMemo(() => new NoteService(), []);

  React.useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownTime]);

  React.useEffect(() => {
    if (currentScreen === "splash" && !auth.isLoading) {
      const timer = setTimeout(() => {
        if (auth.isAuthenticated) {
          setCurrentScreen("dashboard");
        } else {
          setCurrentScreen("login");
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, auth.isLoading, auth.isAuthenticated]);

  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  React.useEffect(() => {
    setHeaderVisible(true);
  }, [currentScreen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (currentScreen !== "dashboard") return;
    const scrollTop = e.currentTarget.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 40) {
      setHeaderVisible(false);
    } else if (scrollTop < lastScrollTop || scrollTop <= 10) {
      setHeaderVisible(true);
    }
    setLastScrollTop(scrollTop);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "Empty", color: "bg-zinc-800" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score <= 1) return { score, text: "Weak Credentials", color: "bg-red-500" };
    if (score === 2) return { score, text: "Fair Strength", color: "bg-yellow-500" };
    if (score === 3) return { score, text: "Good Strength", color: "bg-blue-500" };
    return { score, text: "Excellent Strength", color: "bg-emerald-500" };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownTime > 0) {
      setLoginError(`Rate limit active. Wait ${cooldownTime}s.`);
      showToast("Submission rate limited", "error");
      return;
    }
    
    setLoginError("");

    if (!isValidEmail(loginEmail)) {
      setLoginError("Please enter a valid university email address.");
      showToast("Invalid email address format", "error");
      return;
    }

    if (!loginPassword) {
      setLoginError("Password credentials cannot be blank.");
      showToast("Password cannot be blank", "error");
      return;
    }

    if (simulateNetworkFailure) {
      setLoginLoading(true);
      setTimeout(() => {
        setLoginError("Network connection failure: Host timed out.");
        showToast("Gateway timeout", "error");
        setLoginLoading(false);
      }, 1200);
      return;
    }

    setLoginLoading(true);
    const res = await auth.signIn(loginEmail, loginPassword);
    setLoginLoading(false);

    if (res.error) {
      const nextAttempts = loginAttempts + 1;
      setLoginAttempts(nextAttempts);
      if (nextAttempts >= 3) {
        setCooldownTime(30);
        setLoginError("Rate limit exceeded. Security lock engaged for 30s.");
        showToast("Account locked for 30 seconds", "error");
      } else {
        setLoginError(res.error);
        showToast("Authentication failed", "error");
      }
    } else {
      setLoginAttempts(0);
      setCurrentScreen("dashboard");
      showToast("Authenticated successfully with Supabase", "success");
    }
  };

  const handleGoogleSignIn = async () => {
    setLoginError("");
    setLoginLoading(true);
    try {
      const { supabase } = await import("../../lib/supabase/client");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) {
        setLoginError(error.message);
        showToast(`Google Sign-In error: ${error.message}`, "error");
      }
    } catch (err: any) {
      setLoginError(err.message || "Google OAuth unavailable.");
      showToast("OAuth initialization error", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim()) {
      setRegError("Please fill out your full name.");
      showToast("Full name is required", "error");
      return;
    }

    if (!isValidEmail(regEmail)) {
      setRegError("Please specify a valid university email address.");
      showToast("Invalid academic email address", "error");
      return;
    }

    const strength = getPasswordStrength(regPass);
    if (strength.score < 2) {
      setRegError("Password must be stronger (Fair strength or better).");
      showToast("Weak password", "error");
      return;
    }

    if (regPass !== regConfirmPass) {
      setRegError("Passwords do not match.");
      showToast("Passwords mismatch", "error");
      return;
    }

    if (!regAcceptedTerms) {
      setRegError("You must accept the VeyloPrep guidelines.");
      showToast("Terms not accepted", "error");
      return;
    }

    if (simulateNetworkFailure) {
      setRegLoading(true);
      setTimeout(() => {
        setRegError("Network timed out while contacting verification server.");
        showToast("Gateway timeout", "error");
        setRegLoading(false);
      }, 1200);
      return;
    }

    setRegLoading(true);

    const res = await auth.signUp(regEmail, regPass, regName);
    setRegLoading(false);

    if (res.error) {
      setRegError(res.error);
      showToast("Registration failed", "error");
    } else {
      setCurrentScreen("dashboard");
      showToast("Account created successfully in Supabase", "success");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess(false);

    if (!isValidEmail(forgotEmail)) {
      setForgotError("Please enter a valid registered email address.");
      showToast("Invalid email address format", "error");
      return;
    }

    if (simulateNetworkFailure) {
      setForgotLoading(true);
      setTimeout(() => {
        setForgotError("Failed to lookup email in database. Network error.");
        showToast("Gateway lookup timeout", "error");
        setForgotLoading(false);
      }, 1200);
      return;
    }

    setForgotLoading(true);
    const res = await auth.resetPassword(forgotEmail);
    setForgotLoading(false);

    if (res.error) {
      setForgotError(res.error);
      showToast("Reset request failed", "error");
    } else {
      setForgotSuccess(true);
      showToast("Password reset link dispatched", "success");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setLoginPassword("");
    setCurrentScreen("login");
    showToast("Logged out of session", "info");
  };

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) {
      showToast("Company Name and Role Title are required.", "warning");
      return;
    }

    if (simulateDatabaseFailure) {
      showToast("Database write failed: Connection refused. Click 'Retry Sync' to push queue.", "error");
      return;
    }

    const numericCompensation = parseFloat(newCompensation.replace(/[^0-9.]/g, "")) || 0;

    const tempId = String(Date.now());
    const newApp = {
      id: tempId,
      company: newCompany,
      role: newRole,
      isInternship: newIsInternship,
      compensation: numericCompensation,
      location: newLocation.trim() || "Remote",
      source: newSource,
      jobUrl: newJobUrl.trim(),
      appliedDate: newAppliedDate || new Date().toISOString().split("T")[0],
      deadline: newDeadline || "",
      notes: newNotes.trim(),
      status: newStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timelineLogs: [
        `Created: Application record logged via ${newSource}.`,
        `Status Set: Assigned initial pipeline stage to ${newStatus}.`
      ]
    };

    setApplications([newApp, ...applications]);
    
    setNewCompany("");
    setNewRole("");
    setNewIsInternship(true);
    setNewCompensation("");
    setNewLocation("");
    setNewSource("LinkedIn");
    setNewJobUrl("");
    setNewAppliedDate("2026-07-17");
    setNewDeadline("");
    setNewNotes("");
    setNewStatus("Applied");
    setActiveBottomSheet(null);

    if (auth.user) {
      const res = await jobService.createJob(auth.user.id, {
        company: newApp.company,
        role: newApp.role,
        employment_type: newApp.isInternship ? "Internship" : "Full-time",
        compensation: newApp.compensation,
        location: newApp.location,
        source: newApp.source,
        job_url: newApp.jobUrl,
        applied_date: newApp.appliedDate,
        deadline_date: newApp.deadline || null,
        notes: newApp.notes,
        status: newApp.status,
      });

      if (res.error) {
        setApplications((prev) => prev.filter((a) => a.id !== tempId));
        showToast(`Failed to persist job: ${res.error}`, "error");
        return;
      }

      if (res.job) {
        setApplications((prev) =>
          prev.map((a) => (a.id === tempId ? { ...a, id: res.job!.id } : a))
        );
      }
    }

    showToast(`${newCompany} application cataloged.`, "success");
  };

  const handleDeleteApplication = async (id: string) => {
    const appIndex = applications.findIndex(app => app.id === id);
    if (appIndex !== -1) {
      const appToDelete = applications[appIndex];
      setRecentlyDeletedApp({ app: appToDelete, index: appIndex });
      
      const updatedApps = applications.filter(app => app.id !== id);
      setApplications(updatedApps);
      
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(null);
        setCurrentScreen("tracker");
      }

      if (auth.user) {
        const res = await jobService.deleteJob(id);
        if (res.error) {
          setApplications(applications);
          showToast(`Delete failed: ${res.error}`, "error");
          return;
        }
      }

      setActiveSnackbar({
        message: `Deleted ${appToDelete.company} application record. Undo to restore.`,
        type: "info"
      });
    }
  };

  const handleEditApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (simulateDatabaseFailure) {
      showToast("Database write failed: Write socket closed. Try again later.", "error");
      return;
    }

    if (!editCompany.trim() || !editRole.trim()) {
      showToast("Company Name and Role Title cannot be empty.", "warning");
      return;
    }

    const stipend = parseFloat(editCompensation.toString().replace(/[^0-9.]/g, "")) || 0;
    
    const logs = [...(selectedApp.timelineLogs || [])];
    if (selectedApp.status !== editStatus) {
      logs.push(`Status Changed: Changed from ${selectedApp.status} to ${editStatus}.`);
    }
    if (selectedApp.notes !== editNotes) {
      logs.push(`Notes Updated: Modified interview preparation cues.`);
    }
    if (selectedApp.deadline !== editDeadline) {
      logs.push(`Deadline Updated: Adjusted test cutoff target to ${editDeadline || "N/A"}.`);
    }
    if (selectedApp.company !== editCompany || selectedApp.role !== editRole) {
      logs.push(`Edited: Updated core company/role parameters.`);
    }

    const updatedApp = {
      ...selectedApp,
      company: editCompany,
      role: editRole,
      isInternship: editIsInternship,
      compensation: stipend,
      location: editLocation,
      source: editSource,
      jobUrl: editJobUrl,
      appliedDate: editAppliedDate,
      deadline: editDeadline,
      notes: editNotes,
      status: editStatus,
      updatedAt: new Date().toISOString(),
      timelineLogs: logs
    };

    setApplications(applications.map(app => app.id === selectedApp.id ? updatedApp : app));
    setSelectedApp(updatedApp);
    setActiveBottomSheet(null);

    if (auth.user) {
      const res = await jobService.updateJob(selectedApp.id, {
        company: editCompany,
        role: editRole,
        employment_type: editIsInternship ? "Internship" : "Full-time",
        compensation: stipend,
        location: editLocation,
        source: editSource,
        job_url: editJobUrl,
        applied_date: editAppliedDate,
        deadline_date: editDeadline || null,
        notes: editNotes,
        status: editStatus,
      });

      if (res.error) {
        showToast(`Update failed: ${res.error}`, "error");
        return;
      }
    }

    showToast(`Updated ${editCompany} application successfully.`, "success");
  };

  const handleFastStatusUpdate = async (id: string, nextStatus: string) => {
    if (simulateDatabaseFailure) {
      showToast("Database write failed: Action aborted.", "error");
      return;
    }

    const appIndex = applications.findIndex(app => app.id === id);
    if (appIndex !== -1) {
      const app = applications[appIndex];
      const logs = [...(app.timelineLogs || [])];
      logs.push(`Fast Update: Shifted pipeline status from ${app.status} to ${nextStatus}.`);

      const updatedApp = {
        ...app,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        timelineLogs: logs
      };

      const updatedList = applications.map(a => a.id === id ? updatedApp : a);
      setApplications(updatedList);
      
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(updatedApp);
      }

      if (auth.user) {
        await jobService.updateJob(id, { status: nextStatus });
      }

      showToast(`Advanced ${app.company} to ${nextStatus}.`, "success");
    }
  };

  const themeBgClass = isDark ? "bg-black text-zinc-100" : "bg-[#FAFAFA] text-zinc-900";
  const themeCardClass = isDark ? "bg-gradient-to-b from-[#1A1A1E] to-[#121214] border-[#2D2D32]" : "bg-white border-zinc-200";
  const themeInputBg = isDark ? "bg-[#1E1E22] border-zinc-850 text-zinc-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" : "bg-[#F4F4F5] border-zinc-200 text-zinc-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600";
  const themeBorderClass = isDark ? "border-[#2D2D32]" : "border-zinc-200";
  const themeTextSubtle = isDark ? "text-zinc-500" : "text-zinc-555";

  return (
    <div className={`flex-1 flex flex-col relative overflow-hidden font-sans select-none ${themeBgClass}`}>
      


      <AnimatePresence mode="wait">
          {currentScreen === "splash" && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50"
            >
              <SplashScreen isDark={isDark} />
            </motion.div>
          )}

          {currentScreen === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col p-6 pt-16 overflow-y-auto bg-[#09090B] text-zinc-100"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="w-10 h-10 rounded-xl bg-[#121214] border border-zinc-800 flex items-center justify-center text-white mb-6 shadow-sm shadow-black/40"
              >
                <VeyloPrepLogo className="w-6 h-6" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 text-left"
              >
                <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">Welcome back.</h2>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed font-sans">Sign in to continue your career journey.</p>
              </motion.div>

              <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 space-y-4.5 shadow-xl"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono">University Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        placeholder="e.g. student@college.edu"
                        className="w-full h-12 pl-11 pr-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-550 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono">Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        placeholder="Enter password"
                        className="w-full h-12 pl-11 pr-11 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-550 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-350 transition-colors"
                      >
                        {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1.5 font-medium px-0.5">
                      <span>⚠</span> {loginError}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2.5">
                      <button
                        type="button"
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`w-8 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${rememberMe ? 'bg-blue-600' : 'bg-zinc-800'}`}
                        style={{ height: "18px", width: "32px" }}
                      >
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"
                          style={{ x: rememberMe ? 14 : 0 }}
                        />
                      </button>
                      <span className="text-xs text-zinc-400 font-semibold">Keep me signed in</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotSuccess(false);
                        setForgotError("");
                        setForgotEmail("");
                        setCurrentScreen("forgot");
                      }}
                      className="text-xs text-zinc-400 hover:text-blue-500 transition-colors font-bold"
                    >
                      Forgot?
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-550 active:scale-98 text-white text-sm font-bold transition-all duration-150 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/10"
                  >
                    {loginLoading ? "Signing in..." : "Sign In"}
                  </button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.20, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4"
              >
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loginLoading}
                  className="w-full h-12 rounded-xl border border-zinc-800 bg-transparent hover:bg-zinc-900/50 text-sm text-zinc-300 font-bold transition-all duration-150 flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50 active:scale-98 shadow-sm shadow-black/20"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.73 14.92 1 12 1 7.35 1 3.4 3.65 1.48 7.5l3.77 2.92C6.18 7.02 8.87 5.04 12 5.04z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.75-4.88 3.75-8.5z" />
                    <path fill="#FBBC05" d="M5.25 14.58c-.24-.71-.38-1.47-.38-2.27s.14-1.56.38-2.27L1.48 7.12C.54 9 0 11.1 0 13.3c0 2.2.54 4.3 1.48 6.18l3.77-2.9z" />
                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-4.3 1.08-3.13 0-5.82-1.98-6.77-4.86l-3.77 2.92C3.4 20.35 7.35 23 12 23z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-center pb-2 flex flex-col items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail("singhxayush100@gmail.com");
                    setLoginPassword("password");
                    showToast("Demo credentials loaded.", "info");
                  }}
                  className="text-xs text-zinc-550 hover:text-zinc-350 transition-colors font-bold underline underline-offset-4 cursor-pointer"
                >
                  Use demo account
                </button>

                <div className="text-xs text-zinc-400 font-semibold mt-1">
                  Need an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setRegError("");
                      setRegName("");
                      setRegEmail("");
                      setRegPass("");
                      setRegConfirmPass("");
                      setCurrentScreen("signup");
                    }}
                    className="text-blue-500 font-bold hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    Create Profile
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentScreen === "signup" && (
            <motion.div
              key="signup"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="absolute inset-0 flex flex-col p-6 pt-16 overflow-y-auto bg-[#09090B] text-zinc-100"
            >
              <div className="mb-6 text-left">
                <button 
                  onClick={() => {
                    setLoginError("");
                    setCurrentScreen("login");
                  }} 
                  className="flex items-center text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors uppercase tracking-wider mb-3 cursor-pointer"
                >
                  <ArrowLeft size={14} className="mr-1.5" /> Back
                </button>
                <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">Create Profile</h2>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">Establish your career identity.</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Ayush Singh"
                      className="w-full h-12 px-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-550 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono block">University Email</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. student@college.edu"
                      className="w-full h-12 px-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-550 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono block">Password</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full h-12 pl-3.5 pr-10 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-550 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-350 transition-colors"
                      >
                        {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {regPass && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="font-mono uppercase text-zinc-500">Password Strength:</span>
                          <span className={`font-bold ${
                            getPasswordStrength(regPass).score <= 1 ? 'text-red-500' :
                            getPasswordStrength(regPass).score === 2 ? 'text-yellow-500' :
                            getPasswordStrength(regPass).score === 3 ? 'text-blue-500' : 'text-emerald-500'
                          }`}>{getPasswordStrength(regPass).text}</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden flex space-x-0.5">
                          {[1, 2, 3, 4].map((step) => (
                            <div 
                              key={step}
                              className={`h-full flex-1 transition-all ${
                                getPasswordStrength(regPass).score >= step 
                                  ? getPasswordStrength(regPass).color
                                  : "bg-zinc-800/80"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono block">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showRegConfirmPassword ? "text" : "password"}
                        required
                        value={regConfirmPass}
                        onChange={(e) => setRegConfirmPass(e.target.value)}
                        placeholder="Repeat secret password"
                        className="w-full h-12 pl-3.5 pr-10 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-550 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-350 transition-colors"
                      >
                        {showRegConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 py-1">
                    <input 
                      type="checkbox" 
                      required 
                      checked={regAcceptedTerms}
                      onChange={(e) => setRegAcceptedTerms(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 accent-blue-600 w-4 h-4 focus:ring-0 cursor-pointer border-zinc-800 bg-zinc-900" 
                      id="terms" 
                    />
                    <label htmlFor="terms" className="text-xs text-zinc-400 leading-tight cursor-pointer select-none font-semibold">I agree to the secure guidelines and VeyloPrep terms of use.</label>
                  </div>
                </div>

                {regError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-red-400" />
                    <span className="font-semibold">{regError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-550 active:scale-98 text-white text-sm font-bold transition-all duration-150 flex items-center justify-center cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/10 mt-2"
                >
                  {regLoading ? "Configuring Vault..." : "Establish Profile"}
                </button>
              </form>
            </motion.div>
          )}

          {currentScreen === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="absolute inset-0 flex flex-col p-6 pt-16 overflow-y-auto bg-[#09090B] text-zinc-100"
            >
              <div className="mb-6 text-left">
                <button 
                  onClick={() => {
                    setLoginError("");
                    setCurrentScreen("login");
                  }} 
                  className="flex items-center text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors uppercase tracking-wider mb-3 cursor-pointer"
                >
                  <ArrowLeft size={14} className="mr-1.5" /> Back to login
                </button>
                <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">Recover Session</h2>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">We'll synchronize a dynamic reset link.</p>
              </div>

              {forgotSuccess ? (
                <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-mono">Dispatch Successful</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed px-2 font-semibold">A password authorization ticket has been securely routed to <span className="font-bold text-white">{forgotEmail}</span>.</p>
                  
                  <button
                    onClick={() => {
                      setLoginError("");
                      setLoginEmail(forgotEmail);
                      setCurrentScreen("login");
                    }}
                    className="w-full h-12 rounded-xl bg-zinc-800 text-white text-sm font-bold hover:bg-zinc-750 active:scale-98 transition-all cursor-pointer shadow-sm"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono block">Registered Email</label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. student@college.edu"
                        className="w-full h-12 px-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-550 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150 font-semibold"
                      />
                    </div>
                  </div>

                  {forgotError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2">
                      <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-red-400" />
                      <span className="font-semibold">{forgotError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-555 active:scale-98 text-white text-sm font-bold transition-all duration-150 flex items-center justify-center cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/10 mt-2"
                  >
                    {forgotLoading ? "Locating Credentials..." : "Send Recovery Link"}
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {isAuthenticated && (
            <motion.div
              key="auth_shell"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col h-full bg-[#000000]"
            >
              <div 
                onScroll={handleScroll}
                className={`flex-1 overflow-y-auto overflow-x-hidden ${currentScreen === "dashboard" ? "pt-5" : "pt-12"} pb-[104px] scrollbar-none`}
              >
                {currentScreen === "dashboard" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 px-4">
                    <DashboardScreen
                      userName={userName}
                      applications={applications}
                      setApplications={setApplications}
                      deadlines={deadlines}
                      setDeadlines={setDeadlines}
                      resumes={resumes}
                      setResumes={setResumes}
                      aiCaptureHistory={aiCaptureHistory}
                      getProfileCompletion={getProfileCompletion}
                      setCurrentScreen={setCurrentScreen}
                      setJobPortalSubTab={setJobPortalSubTab}
                      setVaultSubTab={setVaultSubTab}
                      isDark={isDark}
                      themeCardClass={themeCardClass}
                      themeTextSubtle={themeTextSubtle}
                      themeInputBg={themeInputBg}
                      themeBorderClass={themeBorderClass}
                      showToast={showToast}
                      setActiveBottomSheet={setActiveBottomSheet}
                    />
                  </motion.div>
                )}

                {(currentScreen === "tracker" || currentScreen === "tracker_detail") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 px-4">
                    <TrackerScreen
                      applications={applications}
                      setApplications={setApplications}
                      selectedApp={selectedApp}
                      setSelectedApp={setSelectedApp}
                      currentScreen={currentScreen}
                      setCurrentScreen={setCurrentScreen}
                      handleFastStatusUpdate={handleFastStatusUpdate}
                      handleDeleteApplication={handleDeleteApplication}
                      setNewCompany={setNewCompany}
                      setNewRole={setNewRole}
                      setNewCompensation={setNewCompensation}
                      setNewLocation={setNewLocation}
                      setNewSource={setNewSource}
                      setNewJobUrl={setNewJobUrl}
                      setNewNotes={setNewNotes}
                      setNewDeadline={setNewDeadline}
                      setNewStatus={setNewStatus}
                      setActiveBottomSheet={setActiveBottomSheet}
                      setEditCompany={setEditCompany}
                      setEditRole={setEditRole}
                      setEditIsInternship={setEditIsInternship}
                      setEditCompensation={setEditCompensation}
                      setEditLocation={setEditLocation}
                      setEditSource={setEditSource}
                      setEditJobUrl={setEditJobUrl}
                      setEditAppliedDate={setEditAppliedDate}
                      setEditDeadline={setEditDeadline}
                      setEditNotes={setEditNotes}
                      setEditStatus={setEditStatus}
                      simulateDatabaseFailure={simulateDatabaseFailure}
                      isDark={isDark}
                      themeCardClass={themeCardClass}
                      themeTextSubtle={themeTextSubtle}
                      themeInputBg={themeInputBg}
                      themeBorderClass={themeBorderClass}
                      showToast={showToast}
                    />
                  </motion.div>
                )}

                {currentScreen === "vault" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-4 px-4">
                    <VaultScreen
                      vaultSubTab={vaultSubTab}
                      setVaultSubTab={setVaultSubTab}
                      profileName={profileName}
                      setProfileName={setProfileName}
                      profileEmail={profileEmail}
                      setProfileEmail={setProfileEmail}
                      profilePhone={profilePhone}
                      setProfilePhone={setProfilePhone}
                      profileCollege={profileCollege}
                      setProfileCollege={setProfileCollege}
                      profileDegree={profileDegree}
                      setProfileDegree={setProfileDegree}
                      profileBranch={profileBranch}
                      setProfileBranch={setProfileBranch}
                      profileGradYear={profileGradYear}
                      setProfileGradYear={setProfileGradYear}
                      profileCgpa={profileCgpa}
                      setProfileCgpa={setProfileCgpa}
                      profileDob={profileDob}
                      setProfileDob={setProfileDob}
                      profileAddress={profileAddress}
                      setProfileAddress={setProfileAddress}
                      profilePreferredRoles={profilePreferredRoles}
                      setProfilePreferredRoles={setProfilePreferredRoles}
                      profileSkills={profileSkills}
                      setProfileSkills={setProfileSkills}
                      linkLinkedin={linkLinkedin}
                      setLinkLinkedin={setLinkLinkedin}
                      linkGithub={linkGithub}
                      setLinkGithub={setLinkGithub}
                      linkPortfolio={linkPortfolio}
                      setLinkPortfolio={setLinkPortfolio}
                      linkLeetcode={linkLeetcode}
                      setLinkLeetcode={setLinkLeetcode}
                      linkCodeforces={linkCodeforces}
                      setLinkCodeforces={setLinkCodeforces}
                      linkCodechef={linkCodechef}
                      setLinkCodechef={setLinkCodechef}
                      linkHackerRank={linkHackerRank}
                      setLinkHackerRank={setLinkHackerRank}
                      linkPersonalWebsite={linkPersonalWebsite}
                      setLinkPersonalWebsite={setLinkPersonalWebsite}
                      resumes={resumes}
                      setResumes={setResumes}
                      vaultUploading={vaultUploading}
                      setVaultUploading={setVaultUploading}
                      vaultUploadProgress={vaultUploadProgress}
                      setVaultUploadProgress={setVaultUploadProgress}
                      vaultDocuments={vaultDocuments}
                      setVaultDocuments={setVaultDocuments}
                      simulateVaultFailure={simulateVaultFailure}
                      setSimulateVaultFailure={setSimulateVaultFailure}
                      offlineQueue={offlineQueue}
                      setOfflineQueue={setOfflineQueue}
                      getProfileCompletion={getProfileCompletion}
                      isDark={isDark}
                      themeCardClass={themeCardClass}
                      themeTextSubtle={themeTextSubtle}
                      themeInputBg={themeInputBg}
                      themeBorderClass={themeBorderClass}
                      showToast={showToast}
                    />
                  </motion.div>
                )}

                {currentScreen === "deadlines" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4">
                    <DeadlinesScreen
                      deadlines={deadlines}
                      setDeadlines={setDeadlines}
                      applications={applications}
                      setSelectedApp={setSelectedApp}
                      setCurrentScreen={setCurrentScreen}
                      simulateDatabaseFailure={simulateDatabaseFailure}
                      isDark={isDark}
                      themeCardClass={themeCardClass}
                      themeInputBg={themeInputBg}
                      themeBorderClass={themeBorderClass}
                      showToast={showToast}
                    />
                  </motion.div>
                )}

                {currentScreen === "jobs" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4">
                    <JobsScreen
                      applications={applications}
                      setApplications={setApplications}
                      deadlines={deadlines}
                      setDeadlines={setDeadlines}
                      savedOpportunities={savedOpportunities}
                      setSavedOpportunities={setSavedOpportunities}
                      recentlyVisitedPortals={recentlyVisitedPortals}
                      setRecentlyVisitedPortals={setRecentlyVisitedPortals}
                      jobSearchQuery={jobSearchQuery}
                      setJobSearchQuery={setJobSearchQuery}
                      jobPortalFilter={jobPortalFilter}
                      setJobPortalFilter={setJobPortalFilter}
                      jobCategoryFilter={jobCategoryFilter}
                      setJobCategoryFilter={setJobCategoryFilter}
                      jobBookmarkFilter={jobBookmarkFilter}
                      setJobBookmarkFilter={setJobBookmarkFilter}
                      jobAppliedFilter={jobAppliedFilter}
                      setJobAppliedFilter={setJobAppliedFilter}
                      jobSortOption={jobSortOption}
                      setJobSortOption={setJobSortOption}
                      selectedOpportunityId={selectedOpportunityId}
                      setSelectedOpportunityId={setSelectedOpportunityId}
                      activeJobCategoryTab={activeJobCategoryTab}
                      setActiveJobCategoryTab={setActiveJobCategoryTab}
                      formJobCompany={formJobCompany}
                      setFormJobCompany={setFormJobCompany}
                      formJobRole={formJobRole}
                      setFormJobRole={setFormJobRole}
                      formJobPortal={formJobPortal}
                      setFormJobPortal={setFormJobPortal}
                      formJobUrl={formJobUrl}
                      setFormJobUrl={setFormJobUrl}
                      formJobLocation={formJobLocation}
                      setFormJobLocation={setFormJobLocation}
                      formJobDeadline={formJobDeadline}
                      setFormJobDeadline={setFormJobDeadline}
                      formJobNotes={formJobNotes}
                      setFormJobNotes={setFormJobNotes}
                      formJobCategory={formJobCategory}
                      setFormJobCategory={setFormJobCategory}
                      formJobBookmarked={formJobBookmarked}
                      setFormJobBookmarked={setFormJobBookmarked}
                      isLoadingJobs={isLoadingJobs}
                      setIsLoadingJobs={setIsLoadingJobs}
                      jobPortalSubTab={jobPortalSubTab}
                      setJobPortalSubTab={setJobPortalSubTab}
                      aiCaptureUrl={aiCaptureUrl}
                      setAiCaptureUrl={setAiCaptureUrl}
                      aiCaptureOutcome={aiCaptureOutcome}
                      setAiCaptureOutcome={setAiCaptureOutcome}
                      isAiCapturing={isAiCapturing}
                      setIsAiCapturing={setIsAiCapturing}
                      aiCaptureStep={aiCaptureStep}
                      setAiCaptureStep={setAiCaptureStep}
                      aiCaptureError={aiCaptureError}
                      setAiCaptureError={setAiCaptureError}
                      reviewCompany={reviewCompany}
                      setReviewCompany={setReviewCompany}
                      reviewRole={reviewRole}
                      setReviewRole={setReviewRole}
                      reviewEmploymentType={reviewEmploymentType}
                      setReviewEmploymentType={setReviewEmploymentType}
                      reviewLocation={reviewLocation}
                      setReviewLocation={setReviewLocation}
                      reviewSalary={reviewSalary}
                      setReviewSalary={setReviewSalary}
                      reviewDeadline={reviewDeadline}
                      setReviewDeadline={setReviewDeadline}
                      reviewExperience={reviewExperience}
                      setReviewExperience={setReviewExperience}
                      reviewEligibility={reviewEligibility}
                      setReviewEligibility={setReviewEligibility}
                      reviewRequiredSkills={reviewRequiredSkills}
                      setReviewRequiredSkills={setReviewRequiredSkills}
                      reviewPreferredSkills={reviewPreferredSkills}
                      setReviewPreferredSkills={setReviewPreferredSkills}
                      reviewSummary={reviewSummary}
                      setReviewSummary={setReviewSummary}
                      reviewPortal={reviewPortal}
                      setReviewPortal={setReviewPortal}
                      reviewUrl={reviewUrl}
                      setReviewUrl={setReviewUrl}
                      reviewCreateDeadline={reviewCreateDeadline}
                      setReviewCreateDeadline={setReviewCreateDeadline}
                      newRequiredSkillInput={newRequiredSkillInput}
                      setNewRequiredSkillInput={setNewRequiredSkillInput}
                      newPreferredSkillInput={newPreferredSkillInput}
                      setNewPreferredSkillInput={setNewPreferredSkillInput}
                      reviewConfidence={reviewConfidence}
                      setReviewConfidence={setReviewConfidence}
                      aiCaptureHistory={aiCaptureHistory}
                      setAiCaptureHistory={setAiCaptureHistory}
                      simulateNetworkFailure={simulateNetworkFailure}
                      setSimulateNetworkFailure={setSimulateNetworkFailure}
                      isDark={isDark}
                      themeCardClass={themeCardClass}
                      themeInputBg={themeInputBg}
                      themeBorderClass={themeBorderClass}
                      showToast={showToast}
                    />
                  </motion.div>
                )}


                {currentScreen === "settings" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 px-4">
                    <SettingsScreen
                      currentScreen={currentScreen}
                      setCurrentScreen={setCurrentScreen}
                      selectedTheme={selectedTheme}
                      setSelectedTheme={setSelectedTheme}
                      isDark={isDark}
                      setIsDark={setIsDark}
                      userName={userName}
                      userEmail={userEmail}
                      sessionExpiryTime={null}
                      setSessionExpiryTime={() => {}}
                      simulateNetworkFailure={simulateNetworkFailure}
                      setSimulateNetworkFailure={setSimulateNetworkFailure}
                      handleLogout={handleLogout}
                      showToast={showToast}
                      themeCardClass={themeCardClass}
                      themeTextSubtle={themeTextSubtle}
                      themeInputBg={themeInputBg}
                      themeBorderClass={themeBorderClass}
                      setActiveDialog={setActiveDialog}
                    />
                  </motion.div>
                )}

                {currentScreen === "design_system_showcase" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => {
                          setCurrentScreen("dashboard");
                          showToast("Returned to Active Workspace", "info");
                        }} 
                        className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-wider hover:text-zinc-300"
                      >
                        <ArrowLeft size={12} className="mr-1" /> BACK
                      </button>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-mono font-medium">TICKET-003</span>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold flex items-center">
                        <Sliders size={16} className="text-purple-400 mr-1.5" />
                        Design System
                      </h2>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">SPEC_LIVING_SHOWCASE</p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[9px] font-bold text-purple-400 uppercase tracking-wider font-mono">1. Typography Hierarchy</h5>
                      <div className={`p-3 rounded-xl border ${themeCardClass} space-y-2.5`}>
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-zinc-500">DISPLAY (Space Grotesk Bold, 24px)</span>
                          <h1 className="text-xl font-bold tracking-tight">VeyloPrep</h1>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-zinc-500">HEADLINE (Space Grotesk, 18px)</span>
                          <h3 className="text-sm font-bold tracking-tight">Pipeline Control</h3>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-zinc-500">TITLE (Inter SemiBold, 14px)</span>
                          <h4 className="text-xs font-semibold">Stripe interview scheduled</h4>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-zinc-500">BODY (Inter Normal, 12px)</span>
                          <p className="text-[11px] leading-relaxed text-zinc-400">Manage, organize, and accelerate your career prospects.</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-zinc-500">MONOSPACE (JetBrains Mono, 10px)</span>
                          <p className="text-[10px] font-mono text-zinc-500">VER_1.0.0_BUILD_PASS</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[9px] font-bold text-purple-400 uppercase tracking-wider font-mono">2. Semantic Colors</h5>
                      <div className={`p-3 rounded-xl border ${themeCardClass} grid grid-cols-2 gap-1.5`}>
                        <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 flex flex-col justify-between h-14">
                          <span className="text-[9px] font-bold text-blue-500 font-mono">PRIMARY</span>
                          <span className="text-[8px] text-zinc-500 font-mono font-medium">#3B82F6</span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between h-14">
                          <span className="text-[9px] font-bold text-emerald-500 font-mono">SUCCESS</span>
                          <span className="text-[8px] text-zinc-500 font-mono font-medium">#10B981</span>
                        </div>
                        <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex flex-col justify-between h-14">
                          <span className="text-[9px] font-bold text-yellow-500 font-mono">WARNING</span>
                          <span className="text-[8px] text-zinc-500 font-mono font-medium">#F59E0B</span>
                        </div>
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex flex-col justify-between h-14">
                          <span className="text-[9px] font-bold text-red-500 font-mono">ERROR</span>
                          <span className="text-[8px] text-zinc-500 font-mono font-medium">#EF4444</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[9px] font-bold text-purple-400 uppercase tracking-wider font-mono">3. Shared Components</h5>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-3 rounded-xl border ${themeCardClass}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase">OFFERS</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </div>
                          <h4 className="text-lg font-bold font-mono mt-1">02</h4>
                        </div>
                        <div className={`p-3 rounded-xl border ${themeCardClass}`}>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase">REJECTS</span>
                          <h4 className="text-lg font-bold font-mono text-red-500 mt-1">01</h4>
                        </div>
                      </div>

                      <div className={`p-3 rounded-xl border ${themeCardClass} space-y-3`}>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">Button Spec Variations</span>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-[8px] text-zinc-500 font-mono">PrimaryButton (Normal)</span>
                            <button className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/10 flex items-center justify-center cursor-pointer">
                              Primary Action
                            </button>
                          </div>

                          <div>
                            <span className="text-[8px] text-zinc-500 font-mono">SecondaryButton</span>
                            <button className={`w-full h-10 rounded-lg border ${themeBorderClass} hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 text-xs font-semibold flex items-center justify-center cursor-pointer`}>
                              Secondary Action
                            </button>
                          </div>

                          <div>
                            <span className="text-[8px] text-zinc-500 font-mono">DangerButton</span>
                            <button className="w-full h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center cursor-pointer">
                              Danger Action
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[8px] text-zinc-500 font-mono font-medium">Loading State</span>
                              <button disabled className={`w-full h-10 rounded-lg border ${themeBorderClass} text-xs font-semibold flex items-center justify-center opacity-60`}>
                                <RefreshCw size={12} className="animate-spin mr-1.5" /> Synchronizing...
                              </button>
                            </div>
                            <div>
                              <span className="text-[8px] text-zinc-500 font-mono font-medium">Disabled State</span>
                              <button disabled className={`w-full h-10 rounded-lg bg-zinc-800 text-zinc-500 text-xs font-bold flex items-center justify-center cursor-not-allowed`}>
                                Locked
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`p-3 rounded-xl border ${themeCardClass} space-y-3`}>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">Form Inputs</span>

                        <div className="space-y-2">
                          <div>
                            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">TextField</label>
                            <input
                              type="text"
                              value={showcaseInput}
                              onChange={(e) => setShowcaseInput(e.target.value)}
                              placeholder="Type something..."
                              className={`w-full h-9 px-3 mt-1 rounded-lg text-xs outline-none border transition-all ${themeInputBg}`}
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">PasswordField</label>
                            <div className="relative mt-1">
                              <input
                                type={showcasePasswordVisible ? "text" : "password"}
                                value={showcasePassword}
                                onChange={(e) => setShowcasePassword(e.target.value)}
                                className={`w-full h-9 pl-3 pr-9 rounded-lg text-xs outline-none border transition-all ${themeInputBg}`}
                              />
                              <button 
                                type="button"
                                onClick={() => setShowcasePasswordVisible(!showcasePasswordVisible)}
                                className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300"
                              >
                                {showcasePasswordVisible ? <Smartphone size={14} /> : <Lock size={14} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Dropdown Select</label>
                            <select
                              value={showcaseDropValue}
                              onChange={(e) => setShowcaseDropValue(e.target.value)}
                              className={`w-full h-9 px-2 mt-1 rounded-lg text-xs outline-none border transition-all ${themeInputBg}`}
                            >
                              <option value="Applied">Applied (Stage 1)</option>
                              <option value="Interviewing">Interviewing (Stage 2)</option>
                              <option value="Offered">Offered (Final Stage)</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className={`p-3 rounded-xl border ${themeCardClass} space-y-2.5`}>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">Status Chips</span>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold">OFFERED</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[9px] font-bold">INTERVIEWING</span>
                          <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-bold">APPLIED</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold">REJECTED</span>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 flex flex-col justify-between shadow-lg`}>
                        <span className="text-[9px] font-mono text-purple-400 uppercase font-bold">Ambient GlassCard</span>
                        <p className="text-[11px] text-zinc-300 mt-1.5 leading-relaxed">Dynamic color accents provide visual rhythm without unneeded aesthetic clutter.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[9px] font-bold text-purple-400 uppercase tracking-wider font-mono">4. Motion Easing Curves</h5>
                      <div className={`p-3 rounded-xl border ${themeCardClass} space-y-3`}>
                        <span className="text-[8px] text-zinc-500 font-mono leading-tight block">Click curve to trigger simulated ease transition:</span>
                        
                        <div className="flex space-x-1">
                          {["Standard (300ms)", "Decel (200ms)", "Micro (100ms)"].map((curve, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setEasingTrigger(idx + 1);
                                showToast(`Ease transition: ${curve}`, "info");
                              }}
                              className={`flex-1 h-7 rounded border ${themeBorderClass} text-[9px] font-bold`}
                            >
                              {curve.split(" ")[0]}
                            </button>
                          ))}
                        </div>

                        <div className="h-12 bg-zinc-950/40 rounded-lg border border-zinc-800 relative overflow-hidden flex items-center px-2">
                          <motion.div
                            key={easingTrigger}
                            initial={{ x: 0 }}
                            animate={{ x: 230 }}
                            transition={{
                              duration: easingTrigger === 1 ? 0.3 : easingTrigger === 2 ? 0.2 : 0.1,
                              ease: easingTrigger === 1 ? "easeInOut" : easingTrigger === 2 ? "easeOut" : "linear"
                            }}
                            className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-white"
                          >
                            <Sliders size={11} />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setCurrentScreen("dashboard");
                          showToast("VeyloPrep resumed successfully", "success");
                        }}
                        className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all"
                      >
                        Resume Active Session
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentScreen === "release_console" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <ReleaseConsoleScreen
                      setCurrentScreen={setCurrentScreen}
                      isDark={isDark}
                      themeCardClass={themeCardClass}
                      themeTextSubtle={themeTextSubtle}
                      themeInputBg={themeInputBg}
                      themeBorderClass={themeBorderClass}
                      showToast={showToast}
                    />
                  </motion.div>
                )}

              </div>

              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute bottom-5 left-4 right-4 h-[72px] rounded-full border px-2 flex items-center justify-between z-40 backdrop-blur-xl transition-all duration-200 ${
                  isDark 
                    ? "bg-[#121214]/80 border-white/[0.08] shadow-[0_12px_42px_rgba(0,0,0,0.6)]" 
                    : "bg-white/85 border-zinc-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.03)]"
                }`}
              >
                {[
                  { id: "dashboard", icon: <Home size={20} strokeWidth={2} />, label: "Home" },
                  { id: "tracker", icon: <BarChart2 size={20} strokeWidth={2} />, label: "Tracker" },
                  { id: "deadlines", icon: <Calendar size={20} strokeWidth={2} />, label: "Today" },
                  { id: "jobs", icon: <Search size={20} strokeWidth={2} />, label: "Jobs" },
                  { id: "vault", icon: <User size={20} strokeWidth={2} />, label: "Profile" },
                ].map(tab => {
                  const isActive = currentScreen === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentScreen(tab.id)}
                      className="flex-1 flex items-center justify-center cursor-pointer relative"
                    >
                      <div className={`w-full max-w-[62px] h-[54px] rounded-[20px] flex flex-col items-center justify-center relative select-none transition-all duration-255 ${
                        isActive 
                          ? isDark ? "bg-blue-500/10 border border-blue-500/20 text-blue-405" : "bg-blue-50 border border-blue-200 text-blue-600" 
                          : isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-700"
                      }`}>
                        {isActive && (
                          <motion.div
                            layoutId="activeTabOutline"
                            className="absolute inset-0 rounded-[20px] -z-10"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        {tab.icon}
                        <span className={`text-[10px] font-bold mt-0.5 transition-colors duration-250 select-none ${
                          isActive 
                            ? isDark ? "text-blue-400 font-extrabold" : "text-blue-600 font-extrabold"
                            : isDark ? "text-zinc-500" : "text-zinc-400"
                        }`}>
                          {tab.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeSnackbar && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-16 left-3 right-3 p-2.5 rounded-lg border shadow-xl z-[90] flex items-center space-x-2 bg-zinc-950 text-white border-zinc-800 text-[11px]"
            >
              <div className="flex-shrink-0">
                {activeSnackbar.type === "success" && <CheckCircle size={13} className="text-emerald-400" />}
                {activeSnackbar.type === "warning" && <AlertTriangle size={13} className="text-yellow-400" />}
                {activeSnackbar.type === "error" && <AlertTriangle size={13} className="text-red-400" />}
                {activeSnackbar.type === "info" && <Sparkles size={13} className="text-blue-400" />}
              </div>
              <p className="flex-1 font-medium leading-tight">{activeSnackbar.message}</p>
              <button onClick={() => setActiveSnackbar(null)} className="text-zinc-500 hover:text-zinc-300">
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeBottomSheet && (
            <div className="absolute inset-0 bg-black/60 z-[95] flex flex-col justify-end">
              <div className="flex-1" onClick={() => setActiveBottomSheet(null)} />
              
              <motion.div
                initial={{ y: 300 }}
                animate={{ y: 0 }}
                exit={{ y: 300 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className={`p-5 pb-[calc(20px+env(safe-area-inset-bottom,0px))] rounded-t-2xl border-t ${themeCardClass} z-[98] space-y-4`}
              >
                <div className="w-10 h-1 bg-zinc-700/50 rounded-full mx-auto" />

                {activeBottomSheet.type === "add_app" && (
                  <form onSubmit={handleAddApplication} className="space-y-4.5 max-h-[480px] overflow-y-auto pr-1">
                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Catalog Application</h4>
                    
                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Company *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Stripe"
                          value={newCompany}
                          onChange={(e) => setNewCompany(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Role Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Architect"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Employment Type</label>
                        <select
                          value={newIsInternship ? "Internship" : "Full-Time"}
                          onChange={(e) => setNewIsInternship(e.target.value === "Internship")}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        >
                          <option value="Internship">Internship</option>
                          <option value="Full-Time">Full-Time</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Stipend / CTC</label>
                        <input
                          type="text"
                          placeholder="e.g. 9500 or 150000"
                          value={newCompensation}
                          onChange={(e) => setNewCompensation(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Physical Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Remote"
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Acquisition Source</label>
                        <select
                          value={newSource}
                          onChange={(e) => setNewSource(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        >
                          {["LinkedIn", "Referral", "University Portal", "Career Fair", "Other"].map(src => (
                            <option key={src} value={src}>{src}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Applied Date</label>
                        <input
                          type="date"
                          value={newAppliedDate}
                          onChange={(e) => setNewAppliedDate(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">OA Cutoff (Optional)</label>
                        <input
                          type="date"
                          value={newDeadline}
                          onChange={(e) => setNewDeadline(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Listing Link (Job URL)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newJobUrl}
                        onChange={(e) => setNewJobUrl(e.target.value)}
                        className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pipeline Stage</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        >
                          {["Wishlist", "Planning", "Applied", "OA Scheduled", "OA Completed", "Interview", "Offer", "Rejected", "Not Eligible"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Preparation Notes</label>
                      <textarea
                        placeholder="Key milestones, recruiter contact details..."
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        className={`w-full h-24 p-3.5 mt-1.5 rounded-xl text-sm outline-none resize-none border transition-all duration-150 ${themeInputBg}`}
                      />
                    </div>

                    <div className="flex space-x-3 pt-2.5">
                      <button 
                        type="button" 
                        onClick={() => setActiveBottomSheet(null)}
                        className={`flex-1 h-12 rounded-xl border text-sm font-bold hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition-all duration-150 ${themeBorderClass}`}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all duration-150"
                      >
                        Catalog
                      </button>
                    </div>
                  </form>
                )}

                {activeBottomSheet.type === "edit_app" && (
                  <form onSubmit={handleEditApplication} className="space-y-4.5 max-h-[480px] overflow-y-auto pr-1">
                    <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Modify Application</h4>
                    
                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Company *</label>
                        <input
                          type="text"
                          required
                          value={editCompany}
                          onChange={(e) => setEditCompany(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Role Title *</label>
                        <input
                          type="text"
                          required
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Employment Type</label>
                        <select
                          value={editIsInternship ? "Internship" : "Full-Time"}
                          onChange={(e) => setEditIsInternship(e.target.value === "Internship")}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        >
                          <option value="Internship">Internship</option>
                          <option value="Full-Time">Full-Time</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Stipend / CTC</label>
                        <input
                          type="text"
                          value={editCompensation}
                          onChange={(e) => setEditCompensation(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Physical Location</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Acquisition Source</label>
                        <select
                          value={editSource}
                          onChange={(e) => setEditSource(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        >
                          {["LinkedIn", "Referral", "University Portal", "Career Fair", "Other"].map(src => (
                            <option key={src} value={src}>{src}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Applied Date</label>
                        <input
                          type="date"
                          value={editAppliedDate}
                          onChange={(e) => setEditAppliedDate(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">OA Cutoff (Optional)</label>
                        <input
                          type="date"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Listing Link (Job URL)</label>
                      <input
                        type="url"
                        value={editJobUrl}
                        onChange={(e) => setEditJobUrl(e.target.value)}
                        className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3.5">
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pipeline Stage</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className={`w-full h-12 px-3.5 mt-1.5 rounded-xl text-sm outline-none border transition-all duration-150 ${themeInputBg}`}
                        >
                          {["Wishlist", "Planning", "Applied", "OA Scheduled", "OA Completed", "Interview", "Offer", "Rejected", "Not Eligible"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Preparation Notes</label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className={`w-full h-24 p-3.5 mt-1.5 rounded-xl text-sm outline-none resize-none border transition-all duration-150 ${themeInputBg}`}
                      />
                    </div>

                    <div className="flex space-x-3 pt-2.5">
                      <button 
                        type="button" 
                        onClick={() => setActiveBottomSheet(null)}
                        className={`flex-1 h-12 rounded-xl border text-sm font-bold hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 transition-all duration-150 ${themeBorderClass}`}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-all duration-150"
                      >
                        Commit Changes
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeDialog === "confirm_delete" && (
            <div className="absolute inset-0 bg-black/65 z-[100] flex items-center justify-center p-5">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className={`p-5 rounded-2xl border ${themeCardClass} max-w-[290px] w-full space-y-3.5 text-center`}
              >
                <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                  <Trash2 size={18} />
                </div>
                <h4 className="text-sm font-bold">Purge System Record?</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">This operation is destructive and cannot be undone. Active listings will be permanently deleted.</p>
                
                <div className="flex space-x-2 pt-2.5">
                  <button 
                    onClick={() => setActiveDialog(null)}
                    className={`flex-1 h-10 rounded-xl border ${themeBorderClass} text-xs font-bold hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40`}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setActiveDialog(null);
                      showToast("Active placement session purged.", "info");
                    }}
                    className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                  >
                    Purge
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

    </div>
  );
}
