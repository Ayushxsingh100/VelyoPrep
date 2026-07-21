-- ==============================================================================
-- VeyloPrep Production Database Migration
-- Phase 3.4 — PostgreSQL Schema, Constraints, Indexes, RLS & Storage Buckets
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper Functions & Triggers
-- ------------------------------------------------------------------------------

-- Function to automatically refresh updated_at timestamp before UPDATE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. Core Tables Schema
-- ------------------------------------------------------------------------------

-- Table: profiles (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    university TEXT,
    degree TEXT,
    graduation_year TEXT,
    target_role TEXT,
    target_companies TEXT[] DEFAULT '{}',
    avatar_url TEXT,
    phone TEXT,
    cgpa TEXT,
    skills TEXT[] DEFAULT '{}',
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Table: jobs (1:N with auth.users)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    job_url TEXT,
    location TEXT,
    compensation NUMERIC DEFAULT 0,
    employment_type TEXT DEFAULT 'Full-Time',
    status TEXT NOT NULL DEFAULT 'Applied',
    source TEXT DEFAULT 'LinkedIn',
    notes TEXT,
    applied_date DATE,
    deadline_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: applications (1:N with jobs for pipeline timeline history)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    stage_notes TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: deadlines (1:N with jobs and auth.users)
CREATE TABLE IF NOT EXISTS public.deadlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    deadline_type TEXT DEFAULT 'Online Assessment',
    due_date DATE NOT NULL,
    due_time TEXT DEFAULT '23:59',
    priority TEXT DEFAULT 'Medium',
    reminder_time TEXT DEFAULT '4 hours before',
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT DEFAULT 'Upcoming',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: resumes (1:N with auth.users)
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    version TEXT DEFAULT 'v1.0',
    storage_path TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    file_size_kb NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: documents (1:N with auth.users)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Transcripts',
    storage_path TEXT NOT NULL,
    file_size_kb NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: notes (1:N with jobs and auth.users)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Interview Prep',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Partial Unique Index Constraints
-- ------------------------------------------------------------------------------

-- Enforce maximum of ONE active resume per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_resumes_one_active_per_user 
ON public.resumes(user_id) 
WHERE (is_active = true);

-- ------------------------------------------------------------------------------
-- 4. Foreign Key & Query Performance Indexes
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON public.jobs(user_id, status);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);

CREATE INDEX IF NOT EXISTS idx_deadlines_user_id ON public.deadlines(user_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_job_id ON public.deadlines(job_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_due_date ON public.deadlines(due_date);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_job_id ON public.notes(job_id);

-- ------------------------------------------------------------------------------
-- 5. Updated_at Trigger Attachments
-- ------------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trigger_update_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_jobs_updated_at ON public.jobs;
CREATE TRIGGER trigger_update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_applications_updated_at ON public.applications;
CREATE TRIGGER trigger_update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_deadlines_updated_at ON public.deadlines;
CREATE TRIGGER trigger_update_deadlines_updated_at
BEFORE UPDATE ON public.deadlines
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_resumes_updated_at ON public.resumes;
CREATE TRIGGER trigger_update_resumes_updated_at
BEFORE UPDATE ON public.resumes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_documents_updated_at ON public.documents;
CREATE TRIGGER trigger_update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_notes_updated_at ON public.notes;
CREATE TRIGGER trigger_update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 6. Row Level Security (RLS) Enablement & Policies
-- ------------------------------------------------------------------------------

-- Enable RLS on all 7 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Policies for: profiles
CREATE POLICY "Users can select own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON public.profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for: jobs
CREATE POLICY "Users can select own jobs" ON public.jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs" ON public.jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs" ON public.jobs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs" ON public.jobs
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for: applications (linked through jobs.user_id)
CREATE POLICY "Users can select applications for own jobs" ON public.applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert applications for own jobs" ON public.applications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update applications for own jobs" ON public.applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete applications for own jobs" ON public.applications
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.user_id = auth.uid()
        )
    );

-- Policies for: deadlines
CREATE POLICY "Users can select own deadlines" ON public.deadlines
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deadlines" ON public.deadlines
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deadlines" ON public.deadlines
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deadlines" ON public.deadlines
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for: resumes
CREATE POLICY "Users can select own resumes" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON public.resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON public.resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON public.resumes
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for: documents
CREATE POLICY "Users can select own documents" ON public.documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for: notes
CREATE POLICY "Users can select own notes" ON public.notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON public.notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON public.notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON public.notes
    FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7. Supabase Storage Buckets Reservation & Policies
-- ------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', false),
    ('documents', 'documents', false),
    ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for: avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can read own avatar" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for: documents
CREATE POLICY "Users can upload own document" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can read own document" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own document" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own document" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for: resumes
CREATE POLICY "Users can upload own resume" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can read own resume" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own resume" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own resume" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
    );

