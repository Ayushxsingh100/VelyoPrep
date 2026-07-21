import { ResumeRow } from "../models";
import { SupabaseDatabaseService, IDatabaseService } from "./database.service";
import { FileService, IFileService } from "./file.service";
import { STORAGE_BUCKETS, STORAGE_VALIDATION_RULES } from "../config/constants";
import { mapSupabaseError } from "../errors";

export interface ResumeValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface IResumeService {
  getResumes(userId: string): Promise<{ resumes: ResumeRow[]; error: string | null }>;
  getResumeById(id: string): Promise<{ resume: ResumeRow | null; error: string | null }>;
  uploadResume(
    userId: string,
    file: File,
    customName?: string,
    version?: string
  ): Promise<{ resume: ResumeRow | null; signedUrl: string | null; error: string | null }>;
  renameResume(id: string, newName: string): Promise<{ resume: ResumeRow | null; error: string | null }>;
  setActiveResume(userId: string, id: string): Promise<{ resumes: ResumeRow[]; error: string | null }>;
  deleteResume(id: string, storagePath: string): Promise<{ success: boolean; error: string | null }>;
  getSignedUrl(storagePath: string): Promise<{ url: string | null; error: string | null }>;
  validateResume(file: File): ResumeValidationResult;
}

export function validateResumeFile(file: File): ResumeValidationResult {
  const rules = STORAGE_VALIDATION_RULES.resumes;
  return new FileService().validateFile(file, rules.allowedExtensions, rules.maxSizeMb);
}

/**
 * Production Resume Service Implementation
 */
export class ResumeService implements IResumeService {
  private db: IDatabaseService;
  private fileService: IFileService;

  constructor(
    db: IDatabaseService = new SupabaseDatabaseService(),
    fileService: IFileService = new FileService()
  ) {
    this.db = db;
    this.fileService = fileService;
  }

  validateResume(file: File): ResumeValidationResult {
    return validateResumeFile(file);
  }

  async getResumes(userId: string): Promise<{ resumes: ResumeRow[]; error: string | null }> {
    try {
      if (!userId) return { resumes: [], error: "User ID is required." };
      const resumes = await this.db.query<ResumeRow>("resumes", { user_id: userId });
      return { resumes, error: null };
    } catch (err: any) {
      return { resumes: [], error: mapSupabaseError(err, "Failed to retrieve resume vault items.").message };
    }
  }

  async getResumeById(id: string): Promise<{ resume: ResumeRow | null; error: string | null }> {
    try {
      if (!id) return { resume: null, error: "Resume ID is required." };
      const resume = await this.db.findOne<ResumeRow>("resumes", { id });
      return { resume, error: null };
    } catch (err: any) {
      return { resume: null, error: mapSupabaseError(err, "Failed to retrieve resume details.").message };
    }
  }

  async uploadResume(
    userId: string,
    file: File,
    customName?: string,
    version?: string
  ): Promise<{ resume: ResumeRow | null; signedUrl: string | null; error: string | null }> {
    try {
      if (!userId) return { resume: null, signedUrl: null, error: "User ID is required." };

      const rules = STORAGE_VALIDATION_RULES.resumes;
      const uploadRes = await this.fileService.uploadFile(
        STORAGE_BUCKETS.RESUMES,
        userId,
        file,
        rules.allowedExtensions,
        rules.maxSizeMb
      );

      if (uploadRes.error || !uploadRes.path) {
        return { resume: null, signedUrl: null, error: uploadRes.error || "Storage upload failed." };
      }

      const existing = await this.getResumes(userId);
      const isFirst = (existing.resumes || []).length === 0;

      const fileSizeKb = Math.round((file.size / 1024) * 10) / 10;
      const payload: Partial<ResumeRow> = {
        user_id: userId,
        name: (customName || file.name.replace(/\.[^/.]+$/, "")).trim(),
        version: version || "v1.0",
        storage_path: uploadRes.path,
        is_active: isFirst,
        file_size_kb: fileSizeKb,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      try {
        const created = await this.db.insert<ResumeRow>("resumes", payload);
        const signed = await this.getSignedUrl(uploadRes.path);
        return { resume: created, signedUrl: signed.url, error: null };
      } catch (dbErr: any) {
        await this.fileService.rollbackUpload(STORAGE_BUCKETS.RESUMES, uploadRes.path);
        return { resume: null, signedUrl: null, error: mapSupabaseError(dbErr, "Failed to persist resume metadata.").message };
      }
    } catch (err: any) {
      return { resume: null, signedUrl: null, error: mapSupabaseError(err, "Resume upload operation failed.").message };
    }
  }

  async renameResume(id: string, newName: string): Promise<{ resume: ResumeRow | null; error: string | null }> {
    try {
      const trimmed = (newName || "").trim();
      if (!trimmed) return { resume: null, error: "Resume name cannot be empty." };

      const updated = await this.db.update<ResumeRow>("resumes", id, {
        name: trimmed,
        updated_at: new Date().toISOString(),
      });
      return { resume: updated, error: null };
    } catch (err: any) {
      return { resume: null, error: mapSupabaseError(err, "Failed to rename resume.").message };
    }
  }

  async setActiveResume(userId: string, id: string): Promise<{ resumes: ResumeRow[]; error: string | null }> {
    try {
      if (!userId || !id) return { resumes: [], error: "User ID and Resume ID are required." };

      const currentRes = await this.getResumes(userId);
      const list = currentRes.resumes || [];

      const activeItem = list.find((r) => r.is_active && r.id !== id);
      if (activeItem) {
        await this.db.update<ResumeRow>("resumes", activeItem.id, { is_active: false });
      }

      await this.db.update<ResumeRow>("resumes", id, { is_active: true });

      const refreshed = await this.getResumes(userId);
      return { resumes: refreshed.resumes, error: null };
    } catch (err: any) {
      return { resumes: [], error: mapSupabaseError(err, "Failed to set active resume.").message };
    }
  }

  async deleteResume(id: string, storagePath: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!id) return { success: false, error: "Resume ID is required." };

      if (storagePath) {
        await this.fileService.deleteFile(STORAGE_BUCKETS.RESUMES, storagePath);
      }

      await this.db.delete("resumes", id);
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: mapSupabaseError(err, "Failed to delete resume.").message };
    }
  }

  async getSignedUrl(storagePath: string): Promise<{ url: string | null; error: string | null }> {
    return this.fileService.getSignedUrl(STORAGE_BUCKETS.RESUMES, storagePath, 7200);
  }
}
