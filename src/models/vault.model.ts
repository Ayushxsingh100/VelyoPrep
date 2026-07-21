/**
 * Career Vault Domain Models
 */

export interface VaultDocument {
  id: string;
  title: string;
  category: "Resume" | "Certificate" | "Transcript" | "Project";
  fileType: string;
  sizeMb: number;
  uploadedAt: string;
  fileUrl?: string;
}
