/**
 * VeyloPrep Production App Constants
 */

export const APP_CONFIG = {
  name: "VeyloPrep",
  tagline: "Career & Placement Readiness Operating System",
  version: "1.0.0-PROD_FOUNDATION",
  sprint: "S1_PHASE-3.8",
  environment: "production",
  author: "VeyloPrep Core Team",
} as const;

export const SESSION_DEFAULTS = {
  defaultUser: {
    name: "Placement Candidate",
    email: "",
    role: "Placement Candidate",
    avatar: "",
  },
  databaseEngine: "Supabase PostgreSQL",
  authEngine: "Google & Email OAuth2",
} as const;

export const TELEMETRY = {
  statusText: "SYSTEM READY",
  buildTarget: "React 19 / TypeScript 5.8 / Supabase PG",
} as const;

/**
 * Domain Enum Constants
 */
export const APPLICATION_STAGES = [
  "Wishlist",
  "Applied",
  "OA Scheduled",
  "OA Completed",
  "Interview",
  "Final Round",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;

export const DOCUMENT_CATEGORIES = [
  "Certificate",
  "Transcript",
  "Cover Letter",
  "Portfolio",
  "Offer Letter",
  "Recommendation Letter",
  "Identity",
  "Other",
] as const;

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Internship", "Contract"] as const;

export const JOB_SOURCES = ["LinkedIn", "Unstop", "Naukri", "Wellfound", "Company Career Site", "Other"] as const;

export const PRIORITY_LEVELS = ["Low", "Medium", "High", "Critical"] as const;

/**
 * Supabase Storage Buckets & Validation Rules
 */
export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  RESUMES: "resumes",
  DOCUMENTS: "documents",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export interface StorageValidationRules {
  maxSizeMb: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}

export const STORAGE_VALIDATION_RULES: Record<StorageBucket, StorageValidationRules> = {
  avatars: {
    maxSizeMb: 5,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp"],
  },
  resumes: {
    maxSizeMb: 10,
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    allowedExtensions: [".pdf", ".doc", ".docx"],
  },
  documents: {
    maxSizeMb: 15,
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ],
    allowedExtensions: [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"],
  },
};
