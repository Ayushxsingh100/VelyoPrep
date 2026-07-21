import { NoteRow } from "../models";
import { SupabaseDatabaseService, IDatabaseService } from "./database.service";

export interface NoteValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface INoteService {
  getNotes(userId: string): Promise<{ notes: NoteRow[]; error: string | null }>;
  getNotesForJob(jobId: string): Promise<{ notes: NoteRow[]; error: string | null }>;
  createNote(
    userId: string,
    jobId: string,
    content: string,
    title?: string,
    category?: string
  ): Promise<{ note: NoteRow | null; error: string | null }>;
  updateNote(id: string, updates: Partial<NoteRow>): Promise<{ note: NoteRow | null; error: string | null }>;
  deleteNote(id: string): Promise<{ success: boolean; error: string | null }>;
  validateNote(data: { userId?: string; jobId?: string; content?: string }): NoteValidationResult;
}

export function validateNoteInput(data: { userId?: string; jobId?: string; content?: string }): NoteValidationResult {
  if (!data.userId) return { isValid: false, error: "User ID is required." };
  if (!data.jobId) return { isValid: false, error: "Job ID is required for note entry." };
  if (!data.content || !data.content.trim()) return { isValid: false, error: "Note content cannot be empty." };
  return { isValid: true, error: null };
}

/**
 * Production Note Service Implementation
 */
export class NoteService implements INoteService {
  private db: IDatabaseService;

  constructor(db: IDatabaseService = new SupabaseDatabaseService()) {
    this.db = db;
  }

  validateNote(data: { userId?: string; jobId?: string; content?: string }): NoteValidationResult {
    return validateNoteInput(data);
  }

  async getNotes(userId: string): Promise<{ notes: NoteRow[]; error: string | null }> {
    try {
      if (!userId) return { notes: [], error: "User ID is required." };
      const notes = await this.db.query<NoteRow>("notes", { user_id: userId });
      return { notes, error: null };
    } catch (err: any) {
      return { notes: [], error: err.message || "Failed to retrieve notes." };
    }
  }

  async getNotesForJob(jobId: string): Promise<{ notes: NoteRow[]; error: string | null }> {
    try {
      if (!jobId) return { notes: [], error: "Job ID is required." };
      const notes = await this.db.query<NoteRow>("notes", { job_id: jobId });
      return { notes, error: null };
    } catch (err: any) {
      return { notes: [], error: err.message || "Failed to retrieve notes for specified job." };
    }
  }

  async createNote(
    userId: string,
    jobId: string,
    content: string,
    title?: string,
    category?: string
  ): Promise<{ note: NoteRow | null; error: string | null }> {
    try {
      const validation = this.validateNote({ userId, jobId, content });
      if (!validation.isValid) return { note: null, error: validation.error };

      const payload: Partial<NoteRow> = {
        user_id: userId,
        job_id: jobId,
        title: title ? title.trim() : null,
        content: content.trim(),
        category: category || "General",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const created = await this.db.insert<NoteRow>("notes", payload);
      return { note: created, error: null };
    } catch (err: any) {
      return { note: null, error: err.message || "Failed to create note." };
    }
  }

  async updateNote(
    id: string,
    updates: Partial<NoteRow>
  ): Promise<{ note: NoteRow | null; error: string | null }> {
    try {
      if (!id) return { note: null, error: "Note ID is required." };
      const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      const updated = await this.db.update<NoteRow>("notes", id, payload);
      return { note: updated, error: null };
    } catch (err: any) {
      return { note: null, error: err.message || "Failed to update note." };
    }
  }

  async deleteNote(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!id) return { success: false, error: "Note ID is required." };
      await this.db.delete("notes", id);
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to delete note." };
    }
  }
}
