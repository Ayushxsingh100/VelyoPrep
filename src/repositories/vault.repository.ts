/**
 * Vault Repository Contract & Mock Implementation
 */

import { VaultDocument } from "../models/vault.model";

export interface IVaultRepository {
  getDocuments(): Promise<VaultDocument[]>;
  uploadDocument(doc: Omit<VaultDocument, "id" | "uploadedAt">): Promise<VaultDocument>;
  deleteDocument(id: string): Promise<boolean>;
}

export class MockVaultRepository implements IVaultRepository {
  async getDocuments(): Promise<VaultDocument[]> {
    return [
      {
        id: "v1",
        title: "Ayush_Singh_Software_Engineer_Resume.pdf",
        category: "Resume",
        fileType: "PDF",
        sizeMb: 1.2,
        uploadedAt: "2026-07-01",
      },
      {
        id: "v2",
        title: "AWS_Certified_Solutions_Architect.pdf",
        category: "Certificate",
        fileType: "PDF",
        sizeMb: 2.4,
        uploadedAt: "2026-06-15",
      },
    ];
  }

  async uploadDocument(doc: Omit<VaultDocument, "id" | "uploadedAt">): Promise<VaultDocument> {
    return {
      ...doc,
      id: `v_${Date.now()}`,
      uploadedAt: new Date().toISOString().split("T")[0],
    };
  }

  async deleteDocument(_id: string): Promise<boolean> {
    return true;
  }
}
