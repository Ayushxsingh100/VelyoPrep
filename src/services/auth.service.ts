import { SupabaseClient, User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase as defaultClient } from "../lib/supabase/client";
import { AuthSession, UserProfile } from "../models/user.model";

/**
 * Authentication Response Interfaces
 */
export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: string | null;
}

export interface IAuthService {
  signUp(email: string, pass: string, name?: string): Promise<AuthResult>;
  signIn(email: string, pass: string): Promise<AuthResult>;
  signOut(): Promise<{ error: string | null }>;
  resetPassword(email: string): Promise<{ error: string | null }>;
  updatePassword(newPassword: string): Promise<{ error: string | null }>;
  getSession(): Promise<{ user: User | null; session: Session | null }>;
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): { unsubscribe: () => void };
  // Legacy compatibility signatures
  login(email: string, pass: string): Promise<AuthSession>;
  register(name: string, email: string, pass: string): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<AuthSession | null>;
}

/**
 * Maps raw Supabase auth error messages into clean, user-facing messaging.
 */
export function mapAuthError(error: any): string {
  if (!error) return "An unexpected authentication error occurred.";
  const msg = typeof error === "string" ? error : error.message || "";
  
  if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
    return "Invalid email address or password.";
  }
  if (msg.includes("User already registered") || msg.includes("already_exists")) {
    return "An account with this email address already exists.";
  }
  if (msg.includes("Password should be at least")) {
    return "Password must be at least 6 characters long.";
  }
  if (msg.includes("Email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }
  if (msg.includes("Failed to fetch") || msg.includes("network")) {
    return "Unable to connect to authentication server. Please check your internet connection.";
  }
  return msg || "Authentication request failed. Please try again.";
}

/**
 * Production Supabase Auth Service Implementation
 */
export class SupabaseAuthService implements IAuthService {
  private client: SupabaseClient;

  constructor(client: SupabaseClient = defaultClient) {
    this.client = client;
  }

  async signUp(email: string, pass: string, name?: string): Promise<AuthResult> {
    try {
      const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}` : undefined;
      const { data, error } = await this.client.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name || "",
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        return { user: null, session: null, error: mapAuthError(error) };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      return { user: null, session: null, error: mapAuthError(err) };
    }
  }

  async signIn(email: string, pass: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { user: null, session: null, error: mapAuthError(error) };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      return { user: null, session: null, error: mapAuthError(err) };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) {
        return { error: mapAuthError(error) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: mapAuthError(err) };
    }
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}` : undefined;
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      if (error) {
        return { error: mapAuthError(error) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: mapAuthError(err) };
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await this.client.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        return { error: mapAuthError(error) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: mapAuthError(err) };
    }
  }

  async getSession(): Promise<{ user: User | null; session: Session | null }> {
    try {
      const { data } = await this.client.auth.getSession();
      return {
        user: data.session?.user || null,
        session: data.session || null,
      };
    } catch {
      return { user: null, session: null };
    }
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): { unsubscribe: () => void } {
    const { data } = this.client.auth.onAuthStateChange(callback);
    return {
      unsubscribe: () => data.subscription.unsubscribe(),
    };
  }

  // Legacy adapter compatibility
  async login(email: string, pass: string): Promise<AuthSession> {
    const res = await this.signIn(email, pass);
    if (res.error || !res.user) {
      throw new Error(res.error || "Authentication failed");
    }
    const mockUser: UserProfile = {
      id: res.user.id,
      name: res.user.user_metadata?.full_name || email.split("@")[0],
      email: res.user.email || email,
      role: "Placement Candidate",
      createdAt: res.user.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      user: mockUser,
      token: res.session?.access_token || null,
      isAuthenticated: true,
    };
  }

  async register(name: string, email: string, pass: string): Promise<AuthSession> {
    const res = await this.signUp(email, pass, name);
    if (res.error || !res.user) {
      throw new Error(res.error || "Registration failed");
    }
    const mockUser: UserProfile = {
      id: res.user.id,
      name: name || email.split("@")[0],
      email: res.user.email || email,
      role: "Placement Candidate",
      createdAt: res.user.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      user: mockUser,
      token: res.session?.access_token || null,
      isAuthenticated: true,
    };
  }

  async logout(): Promise<void> {
    await this.signOut();
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    const { user, session } = await this.getSession();
    if (!user || !session) return null;
    return {
      user: {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        role: "Placement Candidate",
        createdAt: user.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: session.access_token,
      isAuthenticated: true,
    };
  }
}

export class StubAuthService implements IAuthService {
  async signUp(email: string, _pass: string, name?: string): Promise<AuthResult> {
    return {
      user: { id: "stub_1", email, user_metadata: { full_name: name || "Ayush" } } as any,
      session: { access_token: "stub_token" } as any,
      error: null,
    };
  }
  async signIn(email: string, _pass: string): Promise<AuthResult> {
    return {
      user: { id: "stub_1", email, user_metadata: { full_name: "Ayush" } } as any,
      session: { access_token: "stub_token" } as any,
      error: null,
    };
  }
  async signOut(): Promise<{ error: string | null }> {
    return { error: null };
  }
  async resetPassword(_email: string): Promise<{ error: string | null }> {
    return { error: null };
  }
  async updatePassword(_newPassword: string): Promise<{ error: string | null }> {
    return { error: null };
  }
  async getSession(): Promise<{ user: User | null; session: Session | null }> {
    return { user: null, session: null };
  }
  onAuthStateChange(_callback: any): { unsubscribe: () => void } {
    return { unsubscribe: () => {} };
  }
  async login(email: string, _pass: string): Promise<AuthSession> {
    const mockUser: UserProfile = {
      id: "usr_stub_1",
      name: "Ayush Singh",
      email,
      role: "Placement Candidate",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { user: mockUser, token: "mock_jwt_token_stub", isAuthenticated: true };
  }
  async register(name: string, email: string, _pass: string): Promise<AuthSession> {
    const mockUser: UserProfile = {
      id: "usr_stub_2",
      name,
      email,
      role: "Placement Candidate",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { user: mockUser, token: "mock_jwt_token_stub", isAuthenticated: true };
  }
  async logout(): Promise<void> {
    return Promise.resolve();
  }
  async getCurrentSession(): Promise<AuthSession | null> {
    return null;
  }
}
