import { SupabaseStorageService, IStorageService } from "./storage.service";
import { validateFileFormatAndSize, ValidationResult } from "../validators";
import { mapSupabaseError } from "../errors";
import { StorageBucket } from "../config/constants";

export interface IFileService {
  validateFile(file: File, allowedExtensions: string[], maxSizeMb?: number): ValidationResult;
  buildStoragePath(userId: string, prefix: string, fileName: string): string;
  uploadFile(
    bucket: StorageBucket,
    userId: string,
    file: File,
    allowedExtensions: string[],
    maxSizeMb?: number
  ): Promise<{ path: string | null; error: string | null }>;
  deleteFile(bucket: StorageBucket, path: string): Promise<{ success: boolean; error: string | null }>;
  getSignedUrl(bucket: StorageBucket, path: string, expiresInSeconds?: number): Promise<{ url: string | null; error: string | null }>;
  rollbackUpload(bucket: StorageBucket, path: string): Promise<void>;
}

export class FileService implements IFileService {
  private storage: IStorageService;

  constructor(storage: IStorageService = new SupabaseStorageService()) {
    this.storage = storage;
  }

  validateFile(file: File, allowedExtensions: string[], maxSizeMb: number = 10): ValidationResult {
    return validateFileFormatAndSize(file, allowedExtensions, maxSizeMb);
  }

  buildStoragePath(userId: string, prefix: string, fileName: string): string {
    const ext = fileName.includes(".") ? fileName.split(".").pop() : "bin";
    const sanitizedPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, "_");
    return `${userId}/${sanitizedPrefix}_${Date.now()}.${ext}`;
  }

  async uploadFile(
    bucket: StorageBucket,
    userId: string,
    file: File,
    allowedExtensions: string[],
    maxSizeMb: number = 10
  ): Promise<{ path: string | null; error: string | null }> {
    try {
      const validation = this.validateFile(file, allowedExtensions, maxSizeMb);
      if (!validation.isValid) {
        return { path: null, error: validation.error };
      }

      const fileName = this.buildStoragePath(userId, "file", file.name).split("/").pop() || `${Date.now()}`;
      const res = await this.storage.uploadFile(bucket, userId, file, fileName);

      if (res.error || !res.path) {
        return { path: null, error: res.error || "Storage upload failed." };
      }

      return { path: res.path, error: null };
    } catch (err: any) {
      const appErr = mapSupabaseError(err, "Failed to upload file.");
      return { path: null, error: appErr.message };
    }
  }

  async deleteFile(bucket: StorageBucket, path: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!path) return { success: false, error: "File path is required." };
      const res = await this.storage.deleteFile(bucket, path);
      if (res.error) return { success: false, error: res.error };
      return { success: true, error: null };
    } catch (err: any) {
      const appErr = mapSupabaseError(err, "Failed to delete file.");
      return { success: false, error: appErr.message };
    }
  }

  async getSignedUrl(bucket: StorageBucket, path: string, expiresInSeconds: number = 7200): Promise<{ url: string | null; error: string | null }> {
    try {
      if (!path) return { url: null, error: "File path is required." };
      if (path.startsWith("http://") || path.startsWith("https://")) {
        return { url: path, error: null };
      }
      return await this.storage.getSignedUrl(bucket, path, expiresInSeconds);
    } catch (err: any) {
      const appErr = mapSupabaseError(err, "Failed to generate signed URL.");
      return { url: null, error: appErr.message };
    }
  }

  async rollbackUpload(bucket: StorageBucket, path: string): Promise<void> {
    if (path) {
      try {
        await this.storage.deleteFile(bucket, path);
      } catch (e) {
        console.warn(`[FileService] Rollback failed for path: ${path}`, e);
      }
    }
  }
}
