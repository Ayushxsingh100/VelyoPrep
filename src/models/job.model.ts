/**
 * Job Portal Domain Models
 */

export interface JobPosting {
  id: string;
  companyName: string;
  companyLogo?: string;
  roleTitle: string;
  ctc: string;
  location: string;
  eligibilityCgpa: number;
  deadline: string;
  tags: string[];
  status: "open" | "applied" | "closed";
  description?: string;
}
