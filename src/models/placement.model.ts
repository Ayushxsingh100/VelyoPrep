/**
 * Placement Tracker Domain Models
 */

export interface PlacementApplication {
  id: string;
  companyName: string;
  role: string;
  stage: "Applied" | "OA Round" | "Technical Interview" | "HR Round" | "Offer Received" | "Rejected";
  appliedDate: string;
  notes?: string;
}
