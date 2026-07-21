import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { SupabaseAuthService, AuthResult } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
import { UserProfile } from "../models/user.model";
import { ProfileRow } from "../models";
import { SESSION_DEFAULTS } from "../config/constants";

const authService = new SupabaseAuthService();
const profileService = new ProfileService();

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  profile: ProfileRow | null;
  avatarSignedUrl: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingProfile: boolean;
  signUp: (email: string, pass: string, name?: string) => Promise<AuthResult>;
  signIn: (email: string, pass: string) => Promise<AuthResult>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  refreshSession: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileRow>) => Promise<{ profile: ProfileRow | null; error: string | null }>;
  uploadAvatar: (file: File) => Promise<{ avatarPath: string | null; avatarSignedUrl: string | null; error: string | null }>;
  // Legacy aliases
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [avatarSignedUrl, setAvatarSignedUrl] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  // Computed UserProfile representation for legacy domain UI models
  const userProfile: UserProfile | null = profile
    ? {
        id: profile.user_id,
        name: profile.full_name || SESSION_DEFAULTS.defaultUser.name,
        email: user?.email || SESSION_DEFAULTS.defaultUser.email,
        role: profile.target_role || SESSION_DEFAULTS.defaultUser.role,
        avatarUrl: avatarSignedUrl || profile.avatar_url || undefined,
        college: profile.university || undefined,
        degree: profile.degree || undefined,
        cgpa: profile.cgpa ? parseFloat(profile.cgpa) : undefined,
        batchYear: profile.graduation_year ? parseInt(profile.graduation_year, 10) : undefined,
        createdAt: profile.created_at || new Date().toISOString(),
        updatedAt: profile.updated_at || new Date().toISOString(),
      }
    : user
    ? {
        id: user.id,
        name: user.user_metadata?.full_name || SESSION_DEFAULTS.defaultUser.name,
        email: user.email || SESSION_DEFAULTS.defaultUser.email,
        role: SESSION_DEFAULTS.defaultUser.role,
        avatarUrl: user.user_metadata?.avatar_url,
        createdAt: user.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    : null;

  const isAuthenticated = !!user && !!session;

  const loadProfile = async (targetUser: User) => {
    setIsLoadingProfile(true);
    try {
      const res = await profileService.getOrCreateProfile(
        targetUser.id,
        targetUser.email || "",
        targetUser.user_metadata?.full_name
      );
      if (res.profile) {
        setProfile(res.profile);
        if (res.profile.avatar_url) {
          const signed = await profileService.getAvatarSignedUrl(res.profile.avatar_url);
          setAvatarSignedUrl(signed.url);
        }
      }
    } catch {
      // Fallback silent handle
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  const refreshSession = async () => {
    try {
      const res = await authService.getSession();
      setUser(res.user);
      setSession(res.session);
      if (res.user) {
        await loadProfile(res.user);
      }
    } catch {
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial Session Restoration
    refreshSession();

    // 2. Auth State Change Listener
    const { unsubscribe } = authService.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user || null;
      setUser(currentUser);
      setIsLoading(false);

      if (currentUser) {
        await loadProfile(currentUser);
      } else {
        setProfile(null);
        setAvatarSignedUrl(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signUp = async (email: string, pass: string, name?: string): Promise<AuthResult> => {
    setIsLoading(true);
    const res = await authService.signUp(email, pass, name);
    if (res.user && res.session) {
      setUser(res.user);
      setSession(res.session);
      await loadProfile(res.user);
    }
    setIsLoading(false);
    return res;
  };

  const signIn = async (email: string, pass: string): Promise<AuthResult> => {
    setIsLoading(true);
    const res = await authService.signIn(email, pass);
    if (res.user && res.session) {
      setUser(res.user);
      setSession(res.session);
      await loadProfile(res.user);
    }
    setIsLoading(false);
    return res;
  };

  const signOut = async (): Promise<{ error: string | null }> => {
    setIsLoading(true);
    const res = await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setAvatarSignedUrl(null);
    setIsLoading(false);
    return res;
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    return authService.resetPassword(email);
  };

  const updatePassword = async (newPassword: string): Promise<{ error: string | null }> => {
    return authService.updatePassword(newPassword);
  };

  const updateProfile = async (updates: Partial<ProfileRow>): Promise<{ profile: ProfileRow | null; error: string | null }> => {
    if (!user) return { profile: null, error: "Authenticated user session required." };
    setIsLoadingProfile(true);
    const res = await profileService.updateProfile(user.id, updates);
    if (res.profile) {
      setProfile(res.profile);
    }
    setIsLoadingProfile(false);
    return res;
  };

  const uploadAvatar = async (file: File): Promise<{ avatarPath: string | null; avatarSignedUrl: string | null; error: string | null }> => {
    if (!user) return { avatarPath: null, avatarSignedUrl: null, error: "Authenticated user session required." };
    setIsLoadingProfile(true);
    const res = await profileService.uploadAvatar(user.id, file, profile?.avatar_url || undefined);
    if (res.avatarPath) {
      setProfile((prev) => (prev ? { ...prev, avatar_url: res.avatarPath } : prev));
      setAvatarSignedUrl(res.avatarSignedUrl);
    }
    setIsLoadingProfile(false);
    return res;
  };

  // Legacy API adapters
  const login = async (email: string, pass: string): Promise<boolean> => {
    const res = await signIn(email, pass);
    return !res.error;
  };

  const logout = () => {
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        profile,
        avatarSignedUrl,
        isAuthenticated,
        isLoading,
        isLoadingProfile,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        refreshSession,
        refreshProfile,
        updateProfile,
        uploadAvatar,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
