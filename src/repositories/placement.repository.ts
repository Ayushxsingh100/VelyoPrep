/**
 * Placement Tracker Repository Contract & Mock Implementation
 */

import { PlacementApplication } from "../models/placement.model";

export interface IPlacementRepository {
  getApplications(): Promise<PlacementApplication[]>;
  updateStage(id: string, stage: PlacementApplication["stage"]): Promise<boolean>;
}

export class MockPlacementRepository implements IPlacementRepository {
  async getApplications(): Promise<PlacementApplication[]> {
    return [
      {
        id: "p1",
        companyName: "Google",
        role: "Software Engineer",
        stage: "Technical Interview",
        appliedDate: "2026-06-20",
      },
      {
        id: "p2",
        companyName: "Atlassian",
        role: "Backend Engineer",
        stage: "OA Round",
        appliedDate: "2026-07-02",
      },
    ];
  }

  async updateStage(_id: string, _stage: PlacementApplication["stage"]): Promise<boolean> {
    return true;
  }
}
