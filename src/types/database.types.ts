/**
 * VeyloPrep Generated Database Types
 * Directly maps to PostgreSQL schema in supabase/migrations/20260721000000_initial_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          university: string | null;
          degree: string | null;
          graduation_year: string | null;
          target_role: string | null;
          target_companies: string[] | null;
          avatar_url: string | null;
          phone: string | null;
          cgpa: string | null;
          skills: string[] | null;
          linkedin_url: string | null;
          github_url: string | null;
          portfolio_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          university?: string | null;
          degree?: string | null;
          graduation_year?: string | null;
          target_role?: string | null;
          target_companies?: string[] | null;
          avatar_url?: string | null;
          phone?: string | null;
          cgpa?: string | null;
          skills?: string[] | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          portfolio_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          university?: string | null;
          degree?: string | null;
          graduation_year?: string | null;
          target_role?: string | null;
          target_companies?: string[] | null;
          avatar_url?: string | null;
          phone?: string | null;
          cgpa?: string | null;
          skills?: string[] | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          portfolio_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          role: string;
          job_url: string | null;
          location: string | null;
          compensation: number | null;
          employment_type: string | null;
          status: string;
          source: string | null;
          notes: string | null;
          applied_date: string | null;
          deadline_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company: string;
          role: string;
          job_url?: string | null;
          location?: string | null;
          compensation?: number | null;
          employment_type?: string | null;
          status?: string;
          source?: string | null;
          notes?: string | null;
          applied_date?: string | null;
          deadline_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company?: string;
          role?: string;
          job_url?: string | null;
          location?: string | null;
          compensation?: number | null;
          employment_type?: string | null;
          status?: string;
          source?: string | null;
          notes?: string | null;
          applied_date?: string | null;
          deadline_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          status: string;
          stage_notes: string | null;
          logged_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          status: string;
          stage_notes?: string | null;
          logged_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          status?: string;
          stage_notes?: string | null;
          logged_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      deadlines: {
        Row: {
          id: string;
          user_id: string;
          job_id: string | null;
          title: string;
          description: string | null;
          deadline_type: string | null;
          due_date: string;
          due_time: string | null;
          priority: string | null;
          reminder_time: string | null;
          is_completed: boolean;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id?: string | null;
          title: string;
          description?: string | null;
          deadline_type?: string | null;
          due_date: string;
          due_time?: string | null;
          priority?: string | null;
          reminder_time?: string | null;
          is_completed?: boolean;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string | null;
          title?: string;
          description?: string | null;
          deadline_type?: string | null;
          due_date?: string;
          due_time?: string | null;
          priority?: string | null;
          reminder_time?: string | null;
          is_completed?: boolean;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          version: string | null;
          storage_path: string;
          is_active: boolean;
          file_size_kb: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          version?: string | null;
          storage_path: string;
          is_active?: boolean;
          file_size_kb?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          version?: string | null;
          storage_path?: string;
          is_active?: boolean;
          file_size_kb?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string | null;
          storage_path: string;
          file_size_kb: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category?: string | null;
          storage_path: string;
          file_size_kb?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string | null;
          storage_path?: string;
          file_size_kb?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          title: string | null;
          content: string;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          title?: string | null;
          content: string;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string;
          title?: string | null;
          content?: string;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
