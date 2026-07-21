import { DocumentRow } from "../models";
import { SupabaseDatabaseService, IDatabaseService } from "./database.service";
import { FileService, IFileService } from "./file.service";
import { STORAGE_BUCKETS, STORAGE_VALIDATION_RULES, DOCUMENT_CATEGORIES } from "../config/constants";
import { mapSupabaseError } from "../errors";

export { DOCUMENT_CATEGORIES };
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export interface DocumentValidationResult {
  isValid: boolean;
  error: string | null;
}

export type DocumentSortOption = "newest" | "oldest" | "alphabetical" | "updated";

export interface DocumentFilterOptions {
  category?: string;
}

export interface IDocumentService {
  getDocuments(userId: string): Promise<{ documents: DocumentRow[]; error: string | null }>;
  getDocumentById(id: string): Promise<{ document: DocumentRow | null; error: string | null }>;
  uploadDocument(
    userId: string,
    file: File,
    category?: string,
    customName?: string
  ): Promise<{ document: DocumentRow | null; signedUrl: string | null; error: string | null }>;
  renameDocument(id: string, newName: string): Promise<{ document: DocumentRow | null; error: string | null }>;
  deleteDocument(id: string, storagePath: string): Promise<{ success: boolean; error: string | null }>;
  getSignedUrl(storagePath: string): Promise<{ url: string | null; error: string | null }>;
  searchDocuments(documents: DocumentRow[], query: string): DocumentRow[];
  filterDocuments(documents: DocumentRow[], filters: DocumentFilterOptions): DocumentRow[];
  sortDocuments(documents: DocumentRow[], sortBy: DocumentSortOption): DocumentRow[];
  validateDocument(file: File): DocumentValidationResult;
}

export function validateDocumentFile(file: File): DocumentValidationResult {
  const rules = STORAGE_VALIDATION_RULES.documents;
  return new FileService().validateFile(file, rules.allowedExtensions, rules.maxSizeMb);
}

/**
 * Production Document Service Implementation
 */
export class DocumentService implements IDocumentService {
  private db: IDatabaseService;
  private fileService: IFileService;

  constructor(
    db: IDatabaseService = new SupabaseDatabaseService(),
    fileService: IFileService = new FileService()
  ) {
    this.db = db;
    this.fileService = fileService;
  }

  validateDocument(file: File): DocumentValidationResult {
    return validateDocumentFile(file);
  }

  async getDocuments(userId: string): Promise<{ documents: DocumentRow[]; error: string | null }> {
    try {
      if (!userId) return { documents: [], error: "User ID is required." };
      const documents = await this.db.query<DocumentRow>("documents", { user_id: userId });
      return { documents, error: null };
    } catch (err: any) {
      return { documents: [], error: mapSupabaseError(err, "Failed to retrieve documents.").message };
    }
  }

  async getDocumentById(id: string): Promise<{ document: DocumentRow | null; error: string | null }> {
    try {
      if (!id) return { document: null, error: "Document ID is required." };
      const document = await this.db.findOne<DocumentRow>("documents", { id });
      return { document, error: null };
    } catch (err: any) {
      return { document: null, error: mapSupabaseError(err, "Failed to retrieve document details.").message };
    }
  }

  async uploadDocument(
    userId: string,
    file: File,
    category: string = "Other",
    customName?: string
  ): Promise<{ document: DocumentRow | null; signedUrl: string | null; error: string | null }> {
    try {
      if (!userId) return { document: null, signedUrl: null, error: "User ID is required." };

      const rules = STORAGE_VALIDATION_RULES.documents;
      const uploadRes = await this.fileService.uploadFile(
        STORAGE_BUCKETS.DOCUMENTS,
        userId,
        file,
        rules.allowedExtensions,
        rules.maxSizeMb
      );

      if (uploadRes.error || !uploadRes.path) {
        return { document: null, signedUrl: null, error: uploadRes.error || "Storage upload failed." };
      }

      const fileSizeKb = Math.round((file.size / 1024) * 10) / 10;
      const payload: Partial<DocumentRow> = {
        user_id: userId,
        name: (customName || file.name.replace(/\.[^/.]+$/, "")).trim(),
        category: category || "Other",
        storage_path: uploadRes.path,
        file_size_kb: fileSizeKb,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      try {
        const created = await this.db.insert<DocumentRow>("documents", payload);
        const signed = await this.getSignedUrl(uploadRes.path);
        return { document: created, signedUrl: signed.url, error: null };
      } catch (dbErr: any) {
        await this.fileService.rollbackUpload(STORAGE_BUCKETS.DOCUMENTS, uploadRes.path);
        return { document: null, signedUrl: null, error: mapSupabaseError(dbErr, "Failed to persist document metadata.").message };
      }
    } catch (err: any) {
      return { document: null, signedUrl: null, error: mapSupabaseError(err, "Document upload operation failed.").message };
    }
  }

  async renameDocument(id: string, newName: string): Promise<{ document: DocumentRow | null; error: string | null }> {
    try {
      const trimmed = (newName || "").trim();
      if (!trimmed) return { document: null, error: "Document name cannot be empty." };

      const updated = await this.db.update<DocumentRow>("documents", id, {
        name: trimmed,
        updated_at: new Date().toISOString(),
      });
      return { document: updated, error: null };
    } catch (err: any) {
      return { document: null, error: mapSupabaseError(err, "Failed to rename document.").message };
    }
  }

  async deleteDocument(id: string, storagePath: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!id) return { success: false, error: "Document ID is required." };

      if (storagePath) {
        await this.fileService.deleteFile(STORAGE_BUCKETS.DOCUMENTS, storagePath);
      }

      await this.db.delete("documents", id);
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: mapSupabaseError(err, "Failed to delete document.").message };
    }
  }

  async getSignedUrl(storagePath: string): Promise<{ url: string | null; error: string | null }> {
    return this.fileService.getSignedUrl(STORAGE_BUCKETS.DOCUMENTS, storagePath, 7200);
  }

  searchDocuments(documents: DocumentRow[], query: string): DocumentRow[] {
    if (!query || !query.trim()) return documents;
    const q = query.toLowerCase().trim();
    return documents.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.category && d.category.toLowerCase().includes(q)) ||
        d.storage_path.toLowerCase().includes(q)
    );
  }

  filterDocuments(documents: DocumentRow[], filters: DocumentFilterOptions): DocumentRow[] {
    return documents.filter((d) => {
      if (filters.category && filters.category !== "All") {
        if ((d.category || "").toLowerCase() !== filters.category.toLowerCase()) return false;
      }
      return true;
    });
  }

  sortDocuments(documents: DocumentRow[], sortBy: DocumentSortOption = "newest"): DocumentRow[] {
    const copy = [...documents];
    switch (sortBy) {
      case "newest":
        return copy.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      case "oldest":
        return copy.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
      case "alphabetical":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "updated":
        return copy.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());
      default:
        return copy;
    }
  }
}
