import { ApplicationRow } from "../models";
import { SupabaseDatabaseService, IDatabaseService } from "./database.service";

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

export type ApplicationStage = (typeof APPLICATION_STAGES)[number];

export interface ApplicationValidationResult {
  isValid: boolean;
  error: string | null;
}

export type ApplicationSortOption = "newest" | "oldest" | "recently_updated";

export interface IApplicationService {
  getApplications(jobId?: string): Promise<{ applications: ApplicationRow[]; error: string | null }>;
  getApplicationById(id: string): Promise<{ application: ApplicationRow | null; error: string | null }>;
  createApplication(
    jobId: string,
    status: string,
    stageNotes?: string
  ): Promise<{ application: ApplicationRow | null; error: string | null }>;
  updateApplication(id: string, updates: Partial<ApplicationRow>): Promise<{ application: ApplicationRow | null; error: string | null }>;
  deleteApplication(id: string): Promise<{ success: boolean; error: string | null }>;
  changeStage(
    jobId: string,
    newStage: string,
    stageNotes?: string
  ): Promise<{ application: ApplicationRow | null; error: string | null }>;
  searchApplications(apps: ApplicationRow[], query: string): ApplicationRow[];
  filterApplications(apps: ApplicationRow[], stage?: string): ApplicationRow[];
  sortApplications(apps: ApplicationRow[], sortBy: ApplicationSortOption): ApplicationRow[];
  validateApplication(data: { jobId?: string; status?: string }): ApplicationValidationResult;
}

export function validateApplicationInput(data: { jobId?: string; status?: string }): ApplicationValidationResult {
  if (!data.jobId) return { isValid: false, error: "Job ID is required for application entry." };
  if (!data.status || !data.status.trim()) return { isValid: false, error: "Application status stage is required." };
  return { isValid: true, error: null };
}

/**
 * Production Application Service Implementation
 */
export class ApplicationService implements IApplicationService {
  private db: IDatabaseService;

  constructor(db: IDatabaseService = new SupabaseDatabaseService()) {
    this.db = db;
  }

  validateApplication(data: { jobId?: string; status?: string }): ApplicationValidationResult {
    return validateApplicationInput(data);
  }

  async getApplications(jobId?: string): Promise<{ applications: ApplicationRow[]; error: string | null }> {
    try {
      const criteria = jobId ? { job_id: jobId } : undefined;
      const applications = await this.db.query<ApplicationRow>("applications", criteria);
      return { applications, error: null };
    } catch (err: any) {
      return { applications: [], error: err.message || "Failed to retrieve application logs." };
    }
  }

  async getApplicationById(id: string): Promise<{ application: ApplicationRow | null; error: string | null }> {
    try {
      if (!id) return { application: null, error: "Application ID is required." };
      const application = await this.db.findOne<ApplicationRow>("applications", { id });
      return { application, error: null };
    } catch (err: any) {
      return { application: null, error: err.message || "Failed to retrieve application details." };
    }
  }

  async createApplication(
    jobId: string,
    status: string,
    stageNotes?: string
  ): Promise<{ application: ApplicationRow | null; error: string | null }> {
    try {
      const validation = this.validateApplication({ jobId, status });
      if (!validation.isValid) return { application: null, error: validation.error };

      const payload: Partial<ApplicationRow> = {
        job_id: jobId,
        status: status.trim(),
        stage_notes: stageNotes ? stageNotes.trim() : null,
        logged_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const created = await this.db.insert<ApplicationRow>("applications", payload);
      return { application: created, error: null };
    } catch (err: any) {
      return { application: null, error: err.message || "Failed to log application stage." };
    }
  }

  async updateApplication(
    id: string,
    updates: Partial<ApplicationRow>
  ): Promise<{ application: ApplicationRow | null; error: string | null }> {
    try {
      if (!id) return { application: null, error: "Application ID is required." };
      const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      const updated = await this.db.update<ApplicationRow>("applications", id, payload);
      return { application: updated, error: null };
    } catch (err: any) {
      return { application: null, error: err.message || "Failed to update application entry." };
    }
  }

  async deleteApplication(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!id) return { success: false, error: "Application ID is required." };
      await this.db.delete("applications", id);
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to delete application entry." };
    }
  }

  async changeStage(
    jobId: string,
    newStage: string,
    stageNotes?: string
  ): Promise<{ application: ApplicationRow | null; error: string | null }> {
    try {
      // 1. Update job status column in jobs table
      await this.db.update("jobs", jobId, { status: newStage, updated_at: new Date().toISOString() });
      // 2. Create application history log entry
      return this.createApplication(jobId, newStage, stageNotes || `Stage changed to ${newStage}`);
    } catch (err: any) {
      return { application: null, error: err.message || "Failed to transition application stage." };
    }
  }

  searchApplications(apps: ApplicationRow[], query: string): ApplicationRow[] {
    if (!query || !query.trim()) return apps;
    const q = query.toLowerCase().trim();
    return apps.filter(
      (a) => a.status.toLowerCase().includes(q) || (a.stage_notes && a.stage_notes.toLowerCase().includes(q))
    );
  }

  filterApplications(apps: ApplicationRow[], stage?: string): ApplicationRow[] {
    if (!stage || stage === "All") return apps;
    return apps.filter((a) => a.status.toLowerCase() === stage.toLowerCase());
  }

  sortApplications(apps: ApplicationRow[], sortBy: ApplicationSortOption = "newest"): ApplicationRow[] {
    const copy = [...apps];
    switch (sortBy) {
      case "newest":
        return copy.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      case "oldest":
        return copy.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
      case "recently_updated":
        return copy.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());
      default:
        return copy;
    }
  }
}
