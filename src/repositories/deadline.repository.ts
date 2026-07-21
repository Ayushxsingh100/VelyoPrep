/**
 * Deadline Repository Contract & Mock Implementation
 */

import { DeadlineItem } from "../models/deadline.model";

export interface IDeadlineRepository {
  getDeadlines(): Promise<DeadlineItem[]>;
  addDeadline(item: Omit<DeadlineItem, "id">): Promise<DeadlineItem>;
  toggleDeadline(id: string): Promise<boolean>;
}

export class MockDeadlineRepository implements IDeadlineRepository {
  async getDeadlines(): Promise<DeadlineItem[]> {
    return [
      {
        id: "d1",
        title: "Amazon OA Assessment",
        category: "Assessment",
        dueDate: "Today",
        dueTime: "11:59 PM",
        priority: "High",
        completed: false,
      },
      {
        id: "d2",
        title: "Submit Updated Resume to TPO",
        category: "Assignment",
        dueDate: "Tomorrow",
        dueTime: "05:00 PM",
        priority: "Medium",
        completed: true,
      },
    ];
  }

  async addDeadline(item: Omit<DeadlineItem, "id">): Promise<DeadlineItem> {
    return {
      ...item,
      id: `d_${Date.now()}`,
    };
  }

  async toggleDeadline(_id: string): Promise<boolean> {
    return true;
  }
}
