export interface DBTable {
  name: string;
  description: string;
  columns: { name: string; type: string; constraints: string; description: string }[];
}

export const DATABASE_TABLES: DBTable[] = [
  {
    name: "users",
    description: "Primary student profile record mapped to Supabase auth.users.",
    columns: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY REFERENCES auth.users", description: "Matches auth.uid() exactly." },
      { name: "email", type: "text", constraints: "UNIQUE NOT NULL", description: "Verified email address." },
      { name: "full_name", type: "text", constraints: "NOT NULL", description: "Display name of student." },
      { name: "avatar_url", type: "text", constraints: "NULL", description: "Profile photo address." },
      { name: "role_preference", type: "text", constraints: "NULL", description: "Target role (e.g. Software Engineer)." },
      { name: "created_at", type: "timestamptz", constraints: "DEFAULT now() NOT NULL", description: "Timestamp of signup." },
      { name: "updated_at", type: "timestamptz", constraints: "DEFAULT now() NOT NULL", description: "Timestamp of last modification." },
      { name: "deleted_at", type: "timestamptz", constraints: "NULL", description: "Soft delete tracking field." }
    ]
  },
  {
    name: "applications",
    description: "Tracks company applications, hiring stages, and salary details.",
    columns: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique application record identifier." },
      { name: "user_id", type: "uuid", constraints: "NOT NULL REFERENCES users(id) ON DELETE CASCADE", description: "Owner of application listing." },
      { name: "company_name", type: "text", constraints: "NOT NULL", description: "Name of target business." },
      { name: "role_title", type: "text", constraints: "NOT NULL", description: "Job title (e.g. Frontend Associate)." },
      { name: "status", type: "text", constraints: "CHECK (status IN ('Applied', 'Interviewing', 'Offered', 'Rejected'))", description: "Current stage status." },
      { name: "salary_package", type: "numeric", constraints: "NULL", description: "Offered base salary amount (e.g. CTC)." },
      { name: "job_url", type: "text", constraints: "NULL", description: "Source description or form URL." },
      { name: "notes", type: "text", constraints: "NULL", description: "Student's customized logs or prep questions." },
      { name: "created_at", type: "timestamptz", constraints: "DEFAULT now() NOT NULL", description: "Timestamp of listing creation." },
      { name: "updated_at", type: "timestamptz", constraints: "DEFAULT now() NOT NULL", description: "Timestamp of last modification." }
    ]
  },
  {
    name: "deadlines",
    description: "Keeps schedules, interviews, test schedules, and document deadlines.",
    columns: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique target event identifier." },
      { name: "user_id", type: "uuid", constraints: "NOT NULL REFERENCES users(id) ON DELETE CASCADE", description: "Owner of the event schedule." },
      { name: "application_id", type: "uuid", constraints: "NULL REFERENCES applications(id) ON DELETE CASCADE", description: "Linked application (if applicable)." },
      { name: "title", type: "text", constraints: "NOT NULL", description: "E.g. Online Assessment, HR Round." },
      { name: "due_date", type: "timestamptz", constraints: "NOT NULL", description: "Explicit expiration date and time." },
      { name: "completed", type: "boolean", constraints: "DEFAULT false NOT NULL", description: "Status of deadline task." },
      { name: "created_at", type: "timestamptz", constraints: "DEFAULT now() NOT NULL", description: "Creation timing." },
      { name: "updated_at", type: "timestamptz", constraints: "DEFAULT now() NOT NULL", description: "Modification timing." }
    ]
  },
  {
    name: "career_profiles",
    description: "Houses custom portfolios, LinkedIn details, and bio metrics.",
    columns: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique identifier." },
      { name: "user_id", type: "uuid", constraints: "UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE", description: "Linked student user account." },
      { name: "linkedin_url", type: "text", constraints: "NULL", description: "Personal LinkedIn link." },
      { name: "github_url", type: "text", constraints: "NULL", description: "Personal GitHub link." },
      { name: "portfolio_url", type: "text", constraints: "NULL", description: "Personal Website link." },
      { name: "primary_skills", type: "text[]", constraints: "NULL", description: "Array of tech tags (e.g. Flutter, Dart, Postgre)." },
      { name: "bio_summary", type: "text", constraints: "NULL", description: "Brief cover letter snippet." }
    ]
  },
  {
    name: "resume_versions",
    description: "Stores versions of resume PDFs pointing to Supabase Storage files.",
    columns: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique identifier." },
      { name: "user_id", type: "uuid", constraints: "NOT NULL REFERENCES users(id) ON DELETE CASCADE", description: "Owner student user account." },
      { name: "version_name", type: "text", constraints: "NOT NULL", description: "E.g. FullStack_Summer_2026.pdf." },
      { name: "file_path", type: "text", constraints: "NOT NULL", description: "Supabase Storage bucket path reference." },
      { name: "is_primary", type: "boolean", constraints: "DEFAULT false NOT NULL", description: "Mark as primary resume file." },
      { name: "parsed_keywords", type: "text[]", constraints: "NULL", description: "Keywords parsed from file." },
      { name: "created_at", type: "timestamptz", constraints: "DEFAULT now() NOT NULL", description: "Time of upload." }
    ]
  }
];

export const POSTGRESQL_MIGRATION = `-- ==========================================
-- PLACEMENT OS: PRIMARY SCHEMAS MIGRATION
-- Production-ready, fully normalized DDL script.
-- Includes Row-Level Security, Indices, and Triggers.
-- ==========================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. Table: users
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role_preference TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Enable RLS for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- 2. Table: applications
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Applied', 'Interviewing', 'Offered', 'Rejected')),
    salary_package NUMERIC,
    job_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for applications table
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- 3. Table: deadlines
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.deadlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for deadlines table
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- 4. Table: career_profiles
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    primary_skills TEXT[],
    bio_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for career_profiles
ALTER TABLE public.career_profiles ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- 5. Table: resume_versions
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.resume_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    version_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false NOT NULL,
    parsed_keywords TEXT[],
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for resume_versions
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- users policies
CREATE POLICY "Users can view own profile" 
    ON public.users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id);

-- applications policies
CREATE POLICY "Users can view own applications" 
    ON public.applications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" 
    ON public.applications FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" 
    ON public.applications FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" 
    ON public.applications FOR DELETE 
    USING (auth.uid() = user_id);

-- deadlines policies
CREATE POLICY "Users can view own deadlines" 
    ON public.deadlines FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deadlines" 
    ON public.deadlines FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deadlines" 
    ON public.deadlines FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deadlines" 
    ON public.deadlines FOR DELETE 
    USING (auth.uid() = user_id);


-- ==========================================
-- PERFORMANCE INDEXES (High Density Queries)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON public.applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_deadlines_user_due ON public.deadlines(user_id, due_date) WHERE completed = false;
CREATE INDEX IF NOT EXISTS idx_resumes_user_primary ON public.resume_versions(user_id) WHERE is_primary = true;


-- ==========================================
-- AUTO UPDATE TRIGGER FUNCTIONS
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_applications_modtime
    BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_deadlines_modtime
    BEFORE UPDATE ON public.deadlines
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
`;
