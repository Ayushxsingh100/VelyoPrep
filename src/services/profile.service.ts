import { ProfileRow } from "../models";
import { SupabaseDatabaseService, IDatabaseService } from "./database.service";
import { SupabaseStorageService, IStorageService } from "./storage.service";
import { STORAGE_BUCKETS } from "../config/constants";

export interface ProfileValidationResult {
  isValid: boolean;
  error: string | null;
  sanitized?: Partial<ProfileRow>;
}

export interface IProfileService {
  getProfileByUserId(userId: string): Promise<{ profile: ProfileRow | null; error: string | null }>;
  getOrCreateProfile(userId: string, email: string, name?: string): Promise<{ profile: ProfileRow; error: string | null }>;
  updateProfile(userId: string, updates: Partial<ProfileRow>): Promise<{ profile: ProfileRow | null; error: string | null }>;
  uploadAvatar(userId: string, file: File, currentAvatarPath?: string): Promise<{ avatarPath: string | null; avatarSignedUrl: string | null; error: string | null }>;
  getAvatarSignedUrl(avatarPath: string): Promise<{ url: string | null; error: string | null }>;
}

export function validateProfileUpdates(updates: Partial<ProfileRow>): ProfileValidationResult {
  const sanitized: Partial<ProfileRow> = {};

  if (updates.full_name !== undefined) {
    const trimmed = (updates.full_name || "").trim();
    if (!trimmed) {
      return { isValid: false, error: "Full Name cannot be empty." };
    }
    if (trimmed.length > 100) {
      return { isValid: false, error: "Full Name must not exceed 100 characters." };
    }
    sanitized.full_name = trimmed;
  }

  if (updates.university !== undefined) {
    sanitized.university = (updates.university || "").trim();
  }

  if (updates.degree !== undefined) {
    sanitized.degree = (updates.degree || "").trim();
  }

  if (updates.graduation_year !== undefined) {
    const yrStr = (updates.graduation_year || "").trim();
    if (yrStr) {
      const yrNum = parseInt(yrStr, 10);
      if (isNaN(yrNum) || yrNum < 1990 || yrNum > 2040) {
        return { isValid: false, error: "Graduation Year must be a valid 4-digit year between 1990 and 2040." };
      }
    }
    sanitized.graduation_year = yrStr;
  }

  if (updates.cgpa !== undefined) {
    const cgpaStr = (updates.cgpa || "").trim();
    if (cgpaStr) {
      const cgpaNum = parseFloat(cgpaStr);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        return { isValid: false, error: "CGPA must be a numeric value between 0.0 and 10.0." };
      }
    }
    sanitized.cgpa = cgpaStr;
  }

  if (updates.target_role !== undefined) {
    sanitized.target_role = (updates.target_role || "").trim();
  }

  if (updates.phone !== undefined) {
    sanitized.phone = (updates.phone || "").trim();
  }

  if (updates.linkedin_url !== undefined) {
    sanitized.linkedin_url = (updates.linkedin_url || "").trim();
  }

  if (updates.github_url !== undefined) {
    sanitized.github_url = (updates.github_url || "").trim();
  }

  if (updates.portfolio_url !== undefined) {
    sanitized.portfolio_url = (updates.portfolio_url || "").trim();
  }

  if (updates.target_companies !== undefined) {
    sanitized.target_companies = updates.target_companies;
  }

  if (updates.skills !== undefined) {
    sanitized.skills = updates.skills;
  }

  if (updates.avatar_url !== undefined) {
    sanitized.avatar_url = updates.avatar_url;
  }

  return { isValid: true, error: null, sanitized };
}

export class ProfileService implements IProfileService {
  private db: IDatabaseService;
  private storage: IStorageService;

  constructor(
    db: IDatabaseService = new SupabaseDatabaseService(),
    storage: IStorageService = new SupabaseStorageService()
  ) {
    this.db = db;
    this.storage = storage;
  }

  async getProfileByUserId(userId: string): Promise<{ profile: ProfileRow | null; error: string | null }> {
    try {
      if (!userId) return { profile: null, error: "User ID is required." };
      const profile = await this.db.findOne<ProfileRow>("profiles", { user_id: userId });
      return { profile, error: null };
    } catch (err: any) {
      return { profile: null, error: err.message || "Failed to fetch profile." };
    }
  }

  async getOrCreateProfile(
    userId: string,
    email: string,
    name?: string
  ): Promise<{ profile: ProfileRow; error: string | null }> {
    try {
      const existing = await this.getProfileByUserId(userId);
      if (existing.profile) {
        return { profile: existing.profile, error: null };
      }

      // Auto-create default profile for new user
      const defaultProfile: Partial<ProfileRow> = {
        user_id: userId,
        full_name: name || email.split("@")[0] || "Placement Candidate",
        university: "",
        degree: "",
        graduation_year: "",
        cgpa: "",
        target_role: "",
        target_companies: [],
        skills: [],
        phone: "",
        linkedin_url: "",
        github_url: "",
        portfolio_url: "",
      };

      const created = await this.db.insert<ProfileRow>("profiles", defaultProfile);
      return { profile: created, error: null };
    } catch (err: any) {
      // Fallback in-memory default profile if DB fails temporarily
      const fallbackProfile: ProfileRow = {
        id: `p_${userId}`,
        user_id: userId,
        full_name: name || "Placement Candidate",
        university: "",
        degree: "",
        graduation_year: "",
        cgpa: "",
        target_role: "",
        target_companies: [],
        avatar_url: null,
        phone: "",
        skills: [],
        linkedin_url: "",
        github_url: "",
        portfolio_url: "",
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any;

      return { profile: fallbackProfile, error: err.message || "Profile auto-creation error." };
    }
  }

  async updateProfile(
    userId: string,
    updates: Partial<ProfileRow>
  ): Promise<{ profile: ProfileRow | null; error: string | null }> {
    try {
      const validation = validateProfileUpdates(updates);
      if (!validation.isValid || !validation.sanitized) {
        return { profile: null, error: validation.error };
      }

      const sanitized = validation.sanitized;
      sanitized.updated_at = new Date().toISOString();

      const updated = await this.db.updateByField<ProfileRow>("profiles", "user_id", userId, sanitized);
      return { profile: updated, error: null };
    } catch (err: any) {
      return { profile: null, error: err.message || "Failed to update profile." };
    }
  }

  async uploadAvatar(
    userId: string,
    file: File,
    currentAvatarPath?: string
  ): Promise<{ avatarPath: string | null; avatarSignedUrl: string | null; error: string | null }> {
    try {
      // 1. Pre-validation
      const validation = this.storage.validateFile(STORAGE_BUCKETS.AVATARS, file, file.name);
      if (!validation.isValid) {
        return { avatarPath: null, avatarSignedUrl: null, error: validation.error };
      }

      // 2. Delete old avatar if present
      if (currentAvatarPath && currentAvatarPath.includes("/")) {
        await this.storage.deleteFile(STORAGE_BUCKETS.AVATARS, currentAvatarPath);
      }

      // 3. Upload new avatar
      const ext = file.name.split(".").pop() || "png";
      const fileName = `avatar_${Date.now()}.${ext}`;
      const uploadRes = await this.storage.uploadFile(STORAGE_BUCKETS.AVATARS, userId, file, fileName);

      if (uploadRes.error || !uploadRes.path) {
        return { avatarPath: null, avatarSignedUrl: null, error: uploadRes.error || "Avatar upload failed." };
      }

      // 4. Update profiles table with new storage path
      await this.updateProfile(userId, { avatar_url: uploadRes.path });

      // 5. Generate signed URL for immediate rendering
      const signedRes = await this.getAvatarSignedUrl(uploadRes.path);

      return {
        avatarPath: uploadRes.path,
        avatarSignedUrl: signedRes.url,
        error: null,
      };
    } catch (err: any) {
      return { avatarPath: null, avatarSignedUrl: null, error: err.message || "Avatar upload operation failed." };
    }
  }

  async getAvatarSignedUrl(avatarPath: string): Promise<{ url: string | null; error: string | null }> {
    if (!avatarPath) return { url: null, error: null };
    // If it's already a full http URL (e.g. external link/stub), return directly
    if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
      return { url: avatarPath, error: null };
    }
    return this.storage.getSignedUrl(STORAGE_BUCKETS.AVATARS, avatarPath, 7200);
  }
}
