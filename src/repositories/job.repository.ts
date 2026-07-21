/**
 * Job Repository Contract & Mock Implementation
 */

import { JobPosting } from "../models/job.model";

export interface IJobRepository {
  getJobs(): Promise<JobPosting[]>;
  getJobById(id: string): Promise<JobPosting | null>;
  applyToJob(id: string): Promise<boolean>;
}

export class MockJobRepository implements IJobRepository {
  async getJobs(): Promise<JobPosting[]> {
    return [
      {
        id: "job_1",
        companyName: "Google",
        roleTitle: "Software Engineering Intern",
        ctc: "45 LPA",
        location: "Bangalore / Remote",
        eligibilityCgpa: 8.5,
        deadline: "2026-08-15",
        tags: ["DSA", "System Design", "Python/Go"],
        status: "open",
      },
      {
        id: "job_2",
        companyName: "Microsoft",
        roleTitle: "SDE-1 (Full Time)",
        ctc: "51 LPA",
        location: "Hyderabad",
        eligibilityCgpa: 8.0,
        deadline: "2026-08-20",
        tags: ["C++", "Azure", "Algorithms"],
        status: "open",
      },
    ];
  }

  async getJobById(id: string): Promise<JobPosting | null> {
    const jobs = await this.getJobs();
    return jobs.find((j) => j.id === id) || null;
  }

  async applyToJob(_id: string): Promise<boolean> {
    return true;
  }
}
