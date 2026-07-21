import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as defaultClient } from "../lib/supabase/client";
import {
  StorageBucket,
  STORAGE_VALIDATION_RULES,
} from "../config/constants";

export interface StorageFileItem {
  name: string;
  id: string;
  updatedAt: string;
  createdAt: string;
  lastAccessedAt: string;
  metadata: Record<string, any>;
}

export interface UploadResult {
  path: string | null;
  fullPath: string | null;
  error: string | null;
}

export interface IStorageService {
  validateFile(
    bucket: StorageBucket,
    file: File | Blob,
    fileName?: string
  ): { isValid: boolean; error: string | null };
  uploadFile(
    bucket: StorageBucket,
    userId: string,
    file: File | Blob,
    fileName: string
  ): Promise<UploadResult>;
  deleteFile(
    bucket: StorageBucket,
    path: string
  ): Promise<{ success: boolean; error: string | null }>;
  listFiles(
    bucket: StorageBucket,
    folderPath: string
  ): Promise<{ files: StorageFileItem[]; error: string | null }>;
  getSignedUrl(
    bucket: StorageBucket,
    path: string,
    expiresInSeconds?: number
  ): Promise<{ url: string | null; error: string | null }>;
}

/**
 * User-friendly Storage Error Mapper
 */
export function mapStorageError(error: any): string {
  if (!error) return "An unexpected storage operation error occurred.";
  const msg = typeof error === "string" ? error : error.message || "";

  if (msg.includes("Object not found") || msg.includes("The resource was not found")) {
    return "The requested file could not be found.";
  }
  if (msg.includes("row-level security") || msg.includes("RLS") || msg.includes("permission denied")) {
    return "Permission denied. You are only authorized to access your own files.";
  }
  if (msg.includes("Payload Too Large") || msg.includes("file size exceeds")) {
    return "The uploaded file exceeds the maximum allowed size limit.";
  }
  if (msg.includes("mime type") || msg.includes("unsupported")) {
    return "The uploaded file format is not supported for this folder.";
  }
  if (msg.includes("Failed to fetch") || msg.includes("network")) {
    return "Network error while reaching storage server. Check your connection.";
  }
  return msg || "Storage operation failed. Please try again.";
}

/**
 * Production Supabase File Storage Service Implementation
 */
export class SupabaseStorageService implements IStorageService {
  private client: SupabaseClient;

  constructor(client: SupabaseClient = defaultClient) {
    this.client = client;
  }

  /**
   * Validates file size and format against pre-configured bucket validation rules
   */
  validateFile(
    bucket: StorageBucket,
    file: File | Blob,
    fileName?: string
  ): { isValid: boolean; error: string | null } {
    const rules = STORAGE_VALIDATION_RULES[bucket];
    if (!rules) {
      return { isValid: false, error: `Invalid storage bucket: '${bucket}'` };
    }

    // 1. File Size Validation
    const maxSizeBytes = rules.maxSizeMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${rules.maxSizeMb}MB for ${bucket}.`,
      };
    }

    // 2. MIME Type / Extension Validation
    const targetName = fileName || (file as File).name || "";
    const extension = targetName.includes(".")
      ? `.${targetName.split(".").pop()?.toLowerCase()}`
      : "";

    const mimeValid = file.type
      ? rules.allowedMimeTypes.includes(file.type.toLowerCase())
      : true;
    const extValid = extension
      ? rules.allowedExtensions.includes(extension)
      : true;

    if (!mimeValid && !extValid) {
      return {
        isValid: false,
        error: `File format '${file.type || extension}' is not allowed for ${bucket}. Allowed extensions: ${rules.allowedExtensions.join(", ")}`,
      };
    }

    return { isValid: true, error: null };
  }

  /**
   * Uploads file to private Supabase storage bucket under user folder <user_id>/filename.ext
   */
  async uploadFile(
    bucket: StorageBucket,
    userId: string,
    file: File | Blob,
    fileName: string
  ): Promise<UploadResult> {
    try {
      if (!userId || !userId.trim()) {
        return { path: null, fullPath: null, error: "User ID is required for storage path isolation." };
      }

      // Pre-upload validation guard
      const validation = this.validateFile(bucket, file, fileName);
      if (!validation.isValid) {
        return { path: null, fullPath: null, error: validation.error };
      }

      // Enforce path convention: <user_id>/<filename>
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${userId}/${cleanFileName}`;

      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(storagePath, file, {
          upsert: true,
          contentType: file.type || undefined,
        });

      if (error) {
        return { path: null, fullPath: null, error: mapStorageError(error) };
      }

      return {
        path: data.path,
        fullPath: `${bucket}/${data.path}`,
        error: null,
      };
    } catch (err: any) {
      return { path: null, fullPath: null, error: mapStorageError(err) };
    }
  }

  /**
   * Deletes specified file path from private storage bucket
   */
  async deleteFile(
    bucket: StorageBucket,
    path: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await this.client.storage.from(bucket).remove([path]);
      if (error) {
        return { success: false, error: mapStorageError(error) };
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: mapStorageError(err) };
    }
  }

  /**
   * Lists files contained inside a user's folder path
   */
  async listFiles(
    bucket: StorageBucket,
    folderPath: string
  ): Promise<{ files: StorageFileItem[]; error: string | null }> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .list(folderPath, {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        return { files: [], error: mapStorageError(error) };
      }

      const files: StorageFileItem[] = (data || []).map((item) => ({
        name: item.name,
        id: item.id || item.name,
        updatedAt: item.updated_at || new Date().toISOString(),
        createdAt: item.created_at || new Date().toISOString(),
        lastAccessedAt: item.last_accessed_at || new Date().toISOString(),
        metadata: item.metadata || {},
      }));

      return { files, error: null };
    } catch (err: any) {
      return { files: [], error: mapStorageError(err) };
    }
  }

  /**
   * Generates a private signed download URL for safe temporary access
   */
  async getSignedUrl(
    bucket: StorageBucket,
    path: string,
    expiresInSeconds: number = 3600
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .createSignedUrl(path, expiresInSeconds);

      if (error || !data?.signedUrl) {
        return { url: null, error: mapStorageError(error) };
      }

      return { url: data.signedUrl, error: null };
    } catch (err: any) {
      return { url: null, error: mapStorageError(err) };
    }
  }
}

/**
 * Stub Storage Service for testing/offline scenarios
 */
export class StubStorageService implements IStorageService {
  validateFile(
    bucket: StorageBucket,
    file: File | Blob,
    fileName?: string
  ): { isValid: boolean; error: string | null } {
    const rules = STORAGE_VALIDATION_RULES[bucket];
    if (file.size > rules.maxSizeMb * 1024 * 1024) {
      return { isValid: false, error: "File exceeds size limit." };
    }
    return { isValid: true, error: null };
  }

  async uploadFile(
    bucket: StorageBucket,
    userId: string,
    _file: File | Blob,
    fileName: string
  ): Promise<UploadResult> {
    return {
      path: `${userId}/${fileName}`,
      fullPath: `${bucket}/${userId}/${fileName}`,
      error: null,
    };
  }

  async deleteFile(
    _bucket: StorageBucket,
    _path: string
  ): Promise<{ success: boolean; error: string | null }> {
    return { success: true, error: null };
  }

  async listFiles(
    _bucket: StorageBucket,
    _folderPath: string
  ): Promise<{ files: StorageFileItem[]; error: string | null }> {
    return { files: [], error: null };
  }

  async getSignedUrl(
    bucket: StorageBucket,
    path: string,
    _expiresInSeconds?: number
  ): Promise<{ url: string | null; error: string | null }> {
    return {
      url: `https://placeholder-storage.supabase.co/signed/${bucket}/${path}`,
      error: null,
    };
  }

  // Legacy fallback signature
  getPublicUrl(bucket: string, path: string): string {
    return `https://placeholder-storage.supabase.co/${bucket}/${path}`;
  }
}
