/**
 * Deadline Tracker Domain Models
 */

export interface DeadlineItem {
  id: string;
  title: string;
  category: "Assessment" | "Application" | "Interview" | "Assignment";
  dueDate: string;
  dueTime: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  notes?: string;
}
