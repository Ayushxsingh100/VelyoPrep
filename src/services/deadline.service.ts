import { DeadlineRow } from "../models";
import { SupabaseDatabaseService, IDatabaseService } from "./database.service";

export interface DeadlineValidationResult {
  isValid: boolean;
  error: string | null;
  sanitized?: Partial<DeadlineRow>;
}

export type DeadlineSortOption = "nearest" | "latest" | "priority" | "updated" | "alphabetical";

export type DeadlineClassification = "Completed" | "Overdue" | "Today" | "Tomorrow" | "This Week" | "Upcoming";

export interface DeadlineFilterOptions {
  category?: string;
  priority?: string;
  classification?: DeadlineClassification | "All";
  jobId?: string;
}

export interface IDeadlineService {
  getDeadlines(userId: string): Promise<{ deadlines: DeadlineRow[]; error: string | null }>;
  getDeadlineById(id: string): Promise<{ deadline: DeadlineRow | null; error: string | null }>;
  createDeadline(userId: string, data: Partial<DeadlineRow>): Promise<{ deadline: DeadlineRow | null; error: string | null }>;
  updateDeadline(id: string, updates: Partial<DeadlineRow>): Promise<{ deadline: DeadlineRow | null; error: string | null }>;
  deleteDeadline(id: string): Promise<{ success: boolean; error: string | null }>;
  markCompleted(id: string, isCompleted: boolean): Promise<{ deadline: DeadlineRow | null; error: string | null }>;
  getClassification(dueDateStr: string, isCompleted: boolean): DeadlineClassification;
  filterDeadlines(deadlines: DeadlineRow[], filters: DeadlineFilterOptions): DeadlineRow[];
  sortDeadlines(deadlines: DeadlineRow[], sortBy: DeadlineSortOption): DeadlineRow[];
  getUpcomingDeadlines(deadlines: DeadlineRow[]): DeadlineRow[];
  validateDeadline(data: Partial<DeadlineRow>): DeadlineValidationResult;
}

/**
 * Validates and sanitizes deadline fields before database insert or update
 */
export function validateDeadlineData(data: Partial<DeadlineRow>): DeadlineValidationResult {
  const sanitized: Partial<DeadlineRow> = {};

  if (data.title !== undefined) {
    const trimmed = (data.title || "").trim();
    if (!trimmed) {
      return { isValid: false, error: "Deadline Title is required." };
    }
    if (trimmed.length > 120) {
      return { isValid: false, error: "Deadline Title must not exceed 120 characters." };
    }
    sanitized.title = trimmed;
  }

  if (data.due_date !== undefined) {
    const trimmedDate = (data.due_date || "").trim();
    if (!trimmedDate) {
      return { isValid: false, error: "Due Date is required." };
    }
    sanitized.due_date = trimmedDate;
  }

  if (data.due_time !== undefined) {
    sanitized.due_time = (data.due_time || "").trim() || "23:59";
  }

  if (data.priority !== undefined) {
    const p = (data.priority || "").trim();
    sanitized.priority = p === "High" || p === "Medium" || p === "Low" ? p : "Medium";
  }

  if (data.deadline_type !== undefined) {
    sanitized.deadline_type = (data.deadline_type || "").trim() || "Assessment";
  }

  if (data.job_id !== undefined) {
    sanitized.job_id = data.job_id || null;
  }

  if (data.description !== undefined) {
    sanitized.description = (data.description || "").trim() || null;
  }

  if (data.reminder_time !== undefined) {
    sanitized.reminder_time = data.reminder_time || null;
  }

  if (data.is_completed !== undefined) {
    sanitized.is_completed = Boolean(data.is_completed);
  }

  return { isValid: true, error: null, sanitized };
}

/**
 * Computes dynamic timeline status at runtime (Overdue, Today, Tomorrow, This Week, Upcoming, Completed)
 */
export function classifyDeadline(dueDateStr: string, isCompleted: boolean): DeadlineClassification {
  if (isCompleted) return "Completed";
  if (!dueDateStr) return "Upcoming";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return "This Week";
  return "Upcoming";
}

/**
 * Production Deadline Service Implementation
 */
export class DeadlineService implements IDeadlineService {
  private db: IDatabaseService;

  constructor(db: IDatabaseService = new SupabaseDatabaseService()) {
    this.db = db;
  }

  validateDeadline(data: Partial<DeadlineRow>): DeadlineValidationResult {
    return validateDeadlineData(data);
  }

  getClassification(dueDateStr: string, isCompleted: boolean): DeadlineClassification {
    return classifyDeadline(dueDateStr, isCompleted);
  }

  async getDeadlines(userId: string): Promise<{ deadlines: DeadlineRow[]; error: string | null }> {
    try {
      if (!userId) return { deadlines: [], error: "User ID is required." };
      const deadlines = await this.db.query<DeadlineRow>("deadlines", { user_id: userId });
      return { deadlines, error: null };
    } catch (err: any) {
      return { deadlines: [], error: err.message || "Failed to retrieve deadlines." };
    }
  }

  async getDeadlineById(id: string): Promise<{ deadline: DeadlineRow | null; error: string | null }> {
    try {
      if (!id) return { deadline: null, error: "Deadline ID is required." };
      const deadline = await this.db.findOne<DeadlineRow>("deadlines", { id });
      return { deadline, error: null };
    } catch (err: any) {
      return { deadline: null, error: err.message || "Failed to retrieve deadline details." };
    }
  }

  async createDeadline(userId: string, data: Partial<DeadlineRow>): Promise<{ deadline: DeadlineRow | null; error: string | null }> {
    try {
      if (!userId) return { deadline: null, error: "User ID is required." };
      const validation = this.validateDeadline(data);
      if (!validation.isValid || !validation.sanitized) {
        return { deadline: null, error: validation.error };
      }

      const payload: Partial<DeadlineRow> = {
        ...validation.sanitized,
        user_id: userId,
        is_completed: validation.sanitized.is_completed ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const created = await this.db.insert<DeadlineRow>("deadlines", payload);
      return { deadline: created, error: null };
    } catch (err: any) {
      return { deadline: null, error: err.message || "Failed to create deadline." };
    }
  }

  async updateDeadline(id: string, updates: Partial<DeadlineRow>): Promise<{ deadline: DeadlineRow | null; error: string | null }> {
    try {
      if (!id) return { deadline: null, error: "Deadline ID is required." };
      const validation = this.validateDeadline(updates);
      if (!validation.isValid || !validation.sanitized) {
        return { deadline: null, error: validation.error };
      }

      const payload: Partial<DeadlineRow> = {
        ...validation.sanitized,
        updated_at: new Date().toISOString(),
      };

      const updated = await this.db.update<DeadlineRow>("deadlines", id, payload);
      return { deadline: updated, error: null };
    } catch (err: any) {
      return { deadline: null, error: err.message || "Failed to update deadline." };
    }
  }

  async deleteDeadline(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!id) return { success: false, error: "Deadline ID is required." };
      await this.db.delete("deadlines", id);
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to delete deadline." };
    }
  }

  async markCompleted(id: string, isCompleted: boolean): Promise<{ deadline: DeadlineRow | null; error: string | null }> {
    return this.updateDeadline(id, { is_completed: isCompleted });
  }

  getUpcomingDeadlines(deadlines: DeadlineRow[]): DeadlineRow[] {
    return deadlines.filter((d) => !d.is_completed && new Date(d.due_date).getTime() >= Date.now());
  }

  filterDeadlines(deadlines: DeadlineRow[], filters: DeadlineFilterOptions): DeadlineRow[] {
    return deadlines.filter((d) => {
      if (filters.category && filters.category !== "All") {
        if ((d.deadline_type || "").toLowerCase() !== filters.category.toLowerCase()) return false;
      }
      if (filters.priority && filters.priority !== "All") {
        if ((d.priority || "").toLowerCase() !== filters.priority.toLowerCase()) return false;
      }
      if (filters.jobId) {
        if (d.job_id !== filters.jobId) return false;
      }
      if (filters.classification && filters.classification !== "All") {
        const cls = classifyDeadline(d.due_date, d.is_completed);
        if (cls !== filters.classification) return false;
      }
      return true;
    });
  }

  sortDeadlines(deadlines: DeadlineRow[], sortBy: DeadlineSortOption = "nearest"): DeadlineRow[] {
    const copy = [...deadlines];
    switch (sortBy) {
      case "nearest":
        return copy.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
      case "latest":
        return copy.sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime());
      case "priority": {
        const pMap: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
        return copy.sort((a, b) => (pMap[b.priority || "Medium"] || 0) - (pMap[a.priority || "Medium"] || 0));
      }
      case "alphabetical":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "updated":
        return copy.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());
      default:
        return copy;
    }
  }
}
