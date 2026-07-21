/**
 * User & Authentication Models
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  college?: string;
  degree?: string;
  cgpa?: number;
  batchYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  expiresAt?: number;
}
