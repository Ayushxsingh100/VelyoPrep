import { JobRow } from "../models";
import { SupabaseDatabaseService, IDatabaseService } from "./database.service";

export interface JobValidationResult {
  isValid: boolean;
  error: string | null;
  sanitized?: Partial<JobRow>;
}

export type JobSortOption = "newest" | "oldest" | "company_asc" | "company_desc" | "updated";

export interface JobFilterOptions {
  status?: string;
  employmentType?: string;
  source?: string;
  location?: string;
}

export interface IJobService {
  getJobs(userId: string): Promise<{ jobs: JobRow[]; error: string | null }>;
  getJobById(jobId: string): Promise<{ job: JobRow | null; error: string | null }>;
  createJob(userId: string, jobData: Partial<JobRow>): Promise<{ job: JobRow | null; error: string | null }>;
  updateJob(jobId: string, updates: Partial<JobRow>): Promise<{ job: JobRow | null; error: string | null }>;
  deleteJob(jobId: string): Promise<{ success: boolean; error: string | null }>;
  searchJobs(jobs: JobRow[], query: string): JobRow[];
  filterJobs(jobs: JobRow[], filters: JobFilterOptions): JobRow[];
  sortJobs(jobs: JobRow[], sortBy: JobSortOption): JobRow[];
  validateJob(jobData: Partial<JobRow>): JobValidationResult;
}

/**
 * Validates and sanitizes job fields before database insert or update
 */
export function validateJobData(jobData: Partial<JobRow>): JobValidationResult {
  const sanitized: Partial<JobRow> = {};

  if (jobData.company !== undefined) {
    const trimmed = (jobData.company || "").trim();
    if (!trimmed) {
      return { isValid: false, error: "Company Name is required." };
    }
    if (trimmed.length > 100) {
      return { isValid: false, error: "Company Name must not exceed 100 characters." };
    }
    sanitized.company = trimmed;
  }

  if (jobData.role !== undefined) {
    const trimmed = (jobData.role || "").trim();
    if (!trimmed) {
      return { isValid: false, error: "Role Title is required." };
    }
    if (trimmed.length > 100) {
      return { isValid: false, error: "Role Title must not exceed 100 characters." };
    }
    sanitized.role = trimmed;
  }

  if (jobData.job_url !== undefined && jobData.job_url !== null) {
    const trimmedUrl = jobData.job_url.trim();
    if (trimmedUrl) {
      if (!/^https?:\/\//i.test(trimmedUrl) && !trimmedUrl.startsWith("http")) {
        sanitized.job_url = `https://${trimmedUrl}`;
      } else {
        sanitized.job_url = trimmedUrl;
      }
    } else {
      sanitized.job_url = null;
    }
  }

  if (jobData.compensation !== undefined && jobData.compensation !== null) {
    const comp = Number(jobData.compensation);
    if (isNaN(comp) || comp < 0) {
      return { isValid: false, error: "Compensation must be a non-negative number." };
    }
    sanitized.compensation = comp;
  }

  if (jobData.location !== undefined) {
    sanitized.location = (jobData.location || "").trim() || "Remote";
  }

  if (jobData.employment_type !== undefined) {
    sanitized.employment_type = (jobData.employment_type || "").trim() || "Full-time";
  }

  if (jobData.status !== undefined) {
    sanitized.status = (jobData.status || "").trim() || "Applied";
  }

  if (jobData.source !== undefined) {
    sanitized.source = (jobData.source || "").trim() || "LinkedIn";
  }

  if (jobData.notes !== undefined) {
    sanitized.notes = (jobData.notes || "").trim() || null;
  }

  if (jobData.applied_date !== undefined) {
    sanitized.applied_date = jobData.applied_date || new Date().toISOString().split("T")[0];
  }

  if (jobData.deadline_date !== undefined) {
    sanitized.deadline_date = jobData.deadline_date || null;
  }

  return { isValid: true, error: null, sanitized };
}

/**
 * Production Job Service Implementation
 */
export class JobService implements IJobService {
  private db: IDatabaseService;

  constructor(db: IDatabaseService = new SupabaseDatabaseService()) {
    this.db = db;
  }

  validateJob(jobData: Partial<JobRow>): JobValidationResult {
    return validateJobData(jobData);
  }

  async getJobs(userId: string): Promise<{ jobs: JobRow[]; error: string | null }> {
    try {
      if (!userId) return { jobs: [], error: "User ID is required." };
      const jobs = await this.db.query<JobRow>("jobs", { user_id: userId });
      return { jobs, error: null };
    } catch (err: any) {
      return { jobs: [], error: err.message || "Failed to retrieve job tracker items." };
    }
  }

  async getJobById(jobId: string): Promise<{ job: JobRow | null; error: string | null }> {
    try {
      if (!jobId) return { job: null, error: "Job ID is required." };
      const job = await this.db.findOne<JobRow>("jobs", { id: jobId });
      return { job, error: null };
    } catch (err: any) {
      return { job: null, error: err.message || "Failed to retrieve job details." };
    }
  }

  async createJob(userId: string, jobData: Partial<JobRow>): Promise<{ job: JobRow | null; error: string | null }> {
    try {
      if (!userId) return { job: null, error: "User ID is required." };
      const validation = this.validateJob(jobData);
      if (!validation.isValid || !validation.sanitized) {
        return { job: null, error: validation.error };
      }

      const payload: Partial<JobRow> = {
        ...validation.sanitized,
        user_id: userId,
        status: validation.sanitized.status || "Applied",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const created = await this.db.insert<JobRow>("jobs", payload);
      return { job: created, error: null };
    } catch (err: any) {
      return { job: null, error: err.message || "Failed to create job entry." };
    }
  }

  async updateJob(jobId: string, updates: Partial<JobRow>): Promise<{ job: JobRow | null; error: string | null }> {
    try {
      if (!jobId) return { job: null, error: "Job ID is required." };
      const validation = this.validateJob(updates);
      if (!validation.isValid || !validation.sanitized) {
        return { job: null, error: validation.error };
      }

      const payload: Partial<JobRow> = {
        ...validation.sanitized,
        updated_at: new Date().toISOString(),
      };

      const updated = await this.db.update<JobRow>("jobs", jobId, payload);
      return { job: updated, error: null };
    } catch (err: any) {
      return { job: null, error: err.message || "Failed to update job entry." };
    }
  }

  async deleteJob(jobId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!jobId) return { success: false, error: "Job ID is required." };
      await this.db.delete("jobs", jobId);
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to delete job entry." };
    }
  }

  searchJobs(jobs: JobRow[], query: string): JobRow[] {
    if (!query || !query.trim()) return jobs;
    const q = query.toLowerCase().trim();
    return jobs.filter(
      (j) =>
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q) ||
        (j.location && j.location.toLowerCase().includes(q)) ||
        (j.notes && j.notes.toLowerCase().includes(q)) ||
        (j.source && j.source.toLowerCase().includes(q))
    );
  }

  filterJobs(jobs: JobRow[], filters: JobFilterOptions): JobRow[] {
    return jobs.filter((j) => {
      if (filters.status && filters.status !== "All") {
        if (j.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      }
      if (filters.employmentType && filters.employmentType !== "All") {
        if ((j.employment_type || "").toLowerCase() !== filters.employmentType.toLowerCase()) return false;
      }
      if (filters.source && filters.source !== "All") {
        if ((j.source || "").toLowerCase() !== filters.source.toLowerCase()) return false;
      }
      if (filters.location && filters.location !== "All") {
        if ((j.location || "").toLowerCase() !== filters.location.toLowerCase()) return false;
      }
      return true;
    });
  }

  sortJobs(jobs: JobRow[], sortBy: JobSortOption = "newest"): JobRow[] {
    const copy = [...jobs];
    switch (sortBy) {
      case "newest":
        return copy.sort((a, b) => new Date(b.created_at || b.applied_date || 0).getTime() - new Date(a.created_at || a.applied_date || 0).getTime());
      case "oldest":
        return copy.sort((a, b) => new Date(a.created_at || a.applied_date || 0).getTime() - new Date(b.created_at || b.applied_date || 0).getTime());
      case "company_asc":
        return copy.sort((a, b) => a.company.localeCompare(b.company));
      case "company_desc":
        return copy.sort((a, b) => b.company.localeCompare(a.company));
      case "updated":
        return copy.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());
      default:
        return copy;
    }
  }
}
