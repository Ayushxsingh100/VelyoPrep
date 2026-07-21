/**
 * VeyloPrep Shared Helper Utilities & Formatters
 */

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatFileSize(sizeMb: number): string {
  if (sizeMb < 1) {
    return `${Math.round(sizeMb * 1024)} KB`;
  }
  return `${sizeMb.toFixed(1)} MB`;
}

export function truncateText(text: string, maxLength: number = 30): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
