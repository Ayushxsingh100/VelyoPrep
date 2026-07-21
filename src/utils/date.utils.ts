/**
 * Date and Time Helper Utilities
 */

export function formatDateString(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toISOString().split("T")[0];
  } catch {
    return String(dateInput);
  }
}

export function formatTimeAgo(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "Recently";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Recently";

  const diffMs = Date.now() - d.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;

  return d.toLocaleDateString();
}

export function isDateOverdue(dueDateStr: string | null | undefined): boolean {
  if (!dueDateStr) return false;
  const due = new Date(dueDateStr);
  if (isNaN(due.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}
