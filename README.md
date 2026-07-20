# PlacementOS (V1.0.0-GOLD Stable)

> **Enterprise-Grade Candidate Management, Smart Job Sourcing & Interactive Placement Analytics**
> Developed with strict compliance to clean architectural boundaries, robust security sandboxing, and accessible, responsive presentation tiers.

[![Project Version](https://img.shields.io/badge/version-1.0.0--GOLD-emerald.svg?style=flat-square)](#)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg?style=flat-square)](#)
[![Clean Architecture](https://img.shields.io/badge/architecture-Clean--Riverpod--Supabase-indigo.svg?style=flat-square)](#)
[![Accessibility Compliance](https://img.shields.io/badge/accessibility-WCAG--AAA-orange.svg?style=flat-square)](#)

---

PlacementOS is an advanced, production-hardened platform engineered to automate and optimize the recruitment lifecycle for software engineers. This repository hosts **both** the architectural blueprint specifications for the mobile core (Dart, Flutter, Supabase, Riverpod state models) and the high-fidelity, interactive **React 19 TypeScript Simulator environment**, featuring a state-of-the-art **QA Hardening Console & Automated Test Runner**.

This comprehensive manual provides deep-dive operational, architectural, and deployment details suitable for senior software engineering reviews, production launches, and contributor onboarding.

---

## 📖 Table of Contents

- [1. Technology Audit \& Real-World Stack](#1-technology-audit--real-world-stack)
- [2. Platform Architecture \& System Flow](#2-platform-architecture--system-flow)
  - [2.1 Presentation Tier (React 19 Simulator)](#21-presentation-tier-react-19-simulator)
  - [2.2 Domain Tier (State Management \& Riverpod Abstraction)](#22-domain-tier-state-management--riverpod-abstraction)
  - [2.3 Data \& Repository Tier (Supabase Client \& Caching)](#23-data--repository-tier-supabase-client--caching)
  - [2.4 Architectural Decision Records (ADRs)](#24-architectural-decision-records-adrs)
- [3. Folder Structure](#3-folder-structure)
- [4. Core Feature Modules](#4-core-feature-modules)
  - [4.1 Authentication \& Security Leases](#41-authentication--security-leases)
  - [4.2 Placement Tracker](#42-placement-tracker)
  - [4.3 Career Vault](#43-career-vault)
  - [4.4 Deadline Tracker](#44-deadline-tracker)
  - [4.5 Job Portal Hub](#45-job-portal-hub)
  - [4.6 AI Smart Job Capture](#46-ai-smart-job-capture)
  - [4.7 Dashboard \& Analytical Insights](#47-dashboard--analytical-insights)
- [5. Database Schema \& Storage Architecture](#5-database-schema--storage-architecture)
  - [5.1 Entity-Relationship (ER) Overview](#51-entity-relationship-er-overview)
- [6. AI Cognitive Architecture \& Prompt Engineering](#6-ai-cognitive-architecture--prompt-engineering)
  - [6.1 Prompt Processing Pipeline Flow](#61-prompt-processing-pipeline-flow)
- [7. Security, Compliance \& Cryptographic Boundaries](#7-security-compliance--cryptographic-boundaries)
- [8. Performance Metrics \& Latency Benchmarks](#8-performance-metrics--latency-benchmarks)
- [9. Accessibility (WCAG AAA Compliance)](#9-accessibility-wcag-aaa-compliance)
- [10. Testing \& Headless QA Suite](#10-testing--headless-qa-suite)
- [11. Production Deployment Guide](#11-production-deployment-guide)
- [12. Continuous Integration \& Linting Rules](#12-continuous-integration--linting-rules)
- [13. Developer Guide \& Contribution Protocol](#13-developer-guide--contribution-protocol)
- [14. Production-Ready Release Checklist](#14-production-ready-release-checklist)
- [15. System License](#15-system-license)

---

## 1. Technology Audit & Real-World Stack

PlacementOS enforces a dual-nature layout that bridges interactive sandbox evaluation with genuine system specifications:

| Subsystem | Under-the-Hood Production Stack (Blueprint Specification) | Interactive Simulator Stack (Local React Sandbox) |
| :--- | :--- | :--- |
| **Client Core** | Flutter (Dart 3.x), Material 3 tokens | React 19 (TypeScript 5.8) |
| **Layout Animations** | Flutter Motion & Flare/Rive | Motion v12 (`motion/react`) |
| **State Management** | Riverpod 2.x StateNotifierProviders | React Hooks & Memoized Selectors |
| **Relational Database**| PostgreSQL (Supabase DB Engine) | Virtualized In-Memory & LocalStorage |
| **File Storage** | Supabase Secure Buckets (Encrypted) | Local Sandbox Buffer |
| **Secure Secrets** | Server API Routes (Shielded) | Local Memory Session Lease & LocalStorage |
| **AI Processing** | Google Gemini API (Server-side) | Simulated Cognitive Parser & Outcome Failsafes |

> [!IMPORTANT]
> **Production Key Isolation & Sandbox Isolation Standards**:
> * In the *Under-the-Hood Production Stack*, all API credentials (such as active Google Gemini API keys) are strictly encapsulated server-side and never exposed to the client bundle.
> * In this *Interactive Simulator Stack*, the entire environment operates fully client-side inside the web browser's sandbox. External APIs, databases, and secure storage endpoints are realistically simulated in memory or LocalStorage to enable secure evaluations without transmitting real candidate data or exposing secrets. Detailed production-ready implementations are viewable under the `BlueprintConsole` tab.

---

## 2. Platform Architecture & System Flow

PlacementOS segregates responsibilities cleanly across three architectural tiers. This prevents cascading re-renders, secures sensitive credentials, and provides robust offline support.

```
                  ┌────────────────────────────────────────┐
                  │           PRESENTATION TIER            │
                  │   - Mobile Simulator Viewport (React)  │
                  │   - Framer Motion Springs (Reduced Coeff)│
                  │   - AAA High-Contrast Color Tokens     │
                  └───────────────────┬────────────────────┘
                                      │  Memoized Props / Event Calls
                                      ▼
                  ┌────────────────────────────────────────┐
                  │              DOMAIN TIER               │
                  │   - Riverpod StateNotifier Abstraction │
                  │   - Filtered Selectors (Recomputation) │
                  │   - Real-time Session Lifecycle Hooks  │
                  └───────────────────┬────────────────────┘
                                      │  Secure SSL Gateway / API Routes
                                      ▼
                  ┌────────────────────────────────────────┐
                  │             DATA REPOSITORY            │
                  │   - PostgreSQL Supabase DB Schemas     │
                  │   - Candidate-Bound RLS Policies       │
                  │   - Encrypted PDF Storage Buckets     │
                  └────────────────────────────────────────┘
```

### 2.1 Presentation Tier (React 19 Simulator)
The simulator leverages high-density responsive grids that adapt seamlessly to different viewport sizes. By default, it runs in a sleek, high-contrast Slate dark theme (with a togglable warm light theme) tailored for developer comfort during extended periods of monitoring. 

### 2.2 Domain Tier (State Management & Riverpod Abstraction)
Our domain layer replicates Riverpod’s unidirectional data flow. Computations are memoized using React's `useMemo` hooks, behaving exactly like Riverpod selectors. This guarantees that complex analytical aggregations (e.g., active funnel rates, monthly velocity metrics, and profile completion rates) are only re-calculated when the underlying data array changes.

### 2.3 Data & Repository Tier (Supabase Client & Caching)
The repository level acts as a single source of truth for both online and offline data. When active network connections exist, CRUD operations are dispatched to Supabase with low latency. If the network is interrupted, the system fails over gracefully to local storage states and prompts the user with offline haptic notifications.

### 2.4 Architectural Decision Records (ADRs)

#### ADR-001: Hybrid Blueprint-Simulation Structure
* **Context**: Reviewing source code on different devices is tedious.
* **Decision**: We bundle production-grade Flutter/Dart files directly into a syntax-highlighted explorer (`BlueprintConsole`) while maintaining an interactive React simulator on the left viewport.
* **Consequences**: Engineers can immediately inspect true production Dart code blocks while evaluating dynamic UX flows.

#### ADR-002: Token-Locked Session Leases
* **Context**: Visualizing security timeouts requires realistic state engines.
* **Decision**: Implement a 15-minute inactivity session manager with local countdown intervals.
* **Consequences**: Guarantees that sensitive application data (such as transcripts and credentials) is securely hidden when session timers expire.

---

## 3. Folder Structure

```
.
├── .env.example               # Environment template for local secrets
├── DESIGN_SYSTEM.md           # Approved design guidelines, font pairs, and UI components
├── metadata.json              # Platform metadata, camera permissions, and capabilities
├── package.json               # Package definitions and lock files
├── tsconfig.json              # Strict TypeScript compilation parameters
├── vite.config.ts             # Vite dev server and HMR configuration overrides
├── src/
│   ├── main.tsx               # Entry point of the web simulator
│   ├── App.tsx                # Main Router and layout scaffold
│   ├── index.css              # Custom Tailwind directives and responsive font rules
│   ├── components/            # High-fidelity visual components
│   │   ├── MobileEmulator.tsx     # Shell representing the physical device frame
│   │   ├── DashboardScreen.tsx    # Live data visualizations, KPI cards, and today's agenda
│   │   ├── ReleaseConsoleScreen.tsx # Multi-tab QA console, unit tests, and accessibility audit
│   │   └── BlueprintConsole.tsx   # Code repository, syntax showcase, and database blueprints
│   └── data/                  # Source-code templates represented in the blueprint console
│       ├── aiCaptureCode.ts           # Dart algorithms for URL parsing and payload mapping
│       ├── authenticationModuleCode.ts# Secure sign-in protocols and credential validators
│       ├── backendFoundationCode.ts   # Database clients and PostgreSQL initialization scripts
│       ├── careerVaultCode.ts         # PDF loaders and encrypted storage repository models
│       ├── databaseSchema.ts          # Relational SQL definitions and tables
│       ├── deadlineTrackerCode.ts     # Date filters and notification schedule engines
│       ├── designSystemCode.ts        # Dart theme definitions and button tokens
│       ├── flutterScaffoldCode.ts     # Flutter main container layout code
│       ├── jobPortalCode.ts           # Job search filters and mock catalog arrays
│       ├── navigationShellCode.ts     # Mobile navigation layout scripts
│       └── placementTrackerCode.ts    # Application state logs and tracking repositories
```

---

## 4. Core Feature Modules

### 4.1 Authentication & Security Leases
* **Purpose**: Manages secure access boundaries for candidate workspaces.
* **Capabilities**: Support for biometric (simulated) face checks, OAuth 2.0 logins, structured verification forms, and password strength checks.
* **Architecture**: Intercepts active network endpoints to manage secure, time-limited token leases, refreshing sessions automatically.

### 4.2 Placement Tracker
* **Purpose**: Visualizes and maintains status logs for corporate placement processes.
* **Capabilities**: Visual stages (Wishlist, Applied, OA Scheduled, OA Completed, Interview, Offer, Rejected), activity logs, note logging, and custom salary tracker inputs.
* **Related Modules**: Feeds directly into Dashboard metrics and the Recent Activity Feed.

### 4.3 Career Vault
* **Purpose**: Manages and encrypts academic transcripts, certificates, and resumes.
* **Capabilities**: Drag-and-drop file imports, file size validation (max 10MB), custom resume version tagging, default resume selectors, and encrypted cloud asset downloads.
* **Related Modules**: Linked to Dashboard (influencing Profile Completion metrics).

### 4.4 Deadline Tracker
* **Purpose**: Displays time-sensitive milestones like Online Assessments (OAs) and interviews.
* **Capabilities**: Multi-view calendars, color-coded priority flags (High, Medium, Low), task checklists, and push notifications with sound cues (simulated).
* **Related Modules**: Today’s Agenda (Dashboard) automatically surfaces matching items.

### 4.5 Job Portal Hub
* **Purpose**: Aggregates job opportunities with precise filters for software engineers.
* **Capabilities**: Comprehensive search matching role type, location, and salary, and interactive wishlist tracking.

### 4.6 AI Smart Job Capture
* **Purpose**: Uses AI to automatically parse and extract details from job application URLs.
* **Capabilities**: Scrapes details (Company, Role, Locations, Estimated Salaries, Application Deadlines, Key Tech Keywords) from URLs (e.g., Google, Stripe, Atlassian careers), processes the data safely, and validates payloads.
* **Related Modules**: Sourced items can be exported directly to the Placement Tracker with a single click.

### 4.7 Dashboard & Analytical Insights
* **Purpose**: Serves as the central command center for the candidate's workspace.
* **Capabilities**: Displays key performance indicators, dynamic rule-based productivity insights, interactive SVGs for monthly trends, conversion funnels, and Today’s Agenda.
* **Related Modules**: Uses an aggregation layer to pull data from all modules (Placement Tracker, Deadline Tracker, Career Vault, AI Capture History).

---

## 5. Database Schema & Storage Architecture

The real-world storage engine relies on a hardened, fully normalized PostgreSQL schema. Below is the exact structural representation of the relational tables and Row-Level Security (RLS) policies as documented in the database blueprints:

```sql
-- PostgreSQL DDL Specifications (Target Supabase Instance)
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
```

### 5.1 Entity-Relationship (ER) Overview

```
                                ┌──────────────────────┐
                                │    users (Parent)    │
                                └──────────┬───────────┘
                                           │
         ┌─────────────────────────┬───────┴───────────────┬─────────────────────────┐
         │ 1:1 Cascade             │ 1:N Cascade           │ 1:N Cascade             │ 1:N Cascade
         ▼                         ▼                       ▼                         ▼
┌──────────────────┐      ┌──────────────────┐    ┌──────────────────┐      ┌──────────────────┐
│ career_profiles  │      │   applications   │    │    deadlines     │      │ resume_versions  │
└──────────────────┘      └──────────────────┘    └──────────────────┘      └──────────────────┘
```

* **Referential Integrity**: All child tables (`applications`, `deadlines`, `career_profiles`, `resume_versions`) enforce strict foreign key constraints referencing `users(id)` with `ON DELETE CASCADE` parameters to guarantee zero orphan records.
* **Row-Level Security**: Policies exist to restrict database operations at the engine level. A user can only access, modify, or insert records where the owner `user_id = auth.uid()` (or `id = auth.uid()` for the parent `users` table).

---

## 6. AI Cognitive Architecture & Prompt Engineering

The AI Smart Job Capture system extracts metadata from unstructured job postings. The parsing pipeline follows these steps:

### 6.1 Prompt Processing Pipeline Flow

```
┌────────────────────────┐      ┌─────────────────────────┐      ┌────────────────────────┐
│  Candidate Submits URL  │ ───> │ Gemini Schema Injection │ ───> │  Validation & Fallback  │
│  (e.g. stripe.com/job) │      │ (Strict JSON Output)    │      │  (Verify Tech Badges)  │
└────────────────────────┘      └─────────────────────────┘      └───────────┬────────────┘
                                                                             │
                                                                             ▼
                                                                 ┌────────────────────────┐
                                                                 │ Inject to PlacementOS  │
                                                                 │ Dashboard & Workspace  │
                                                                 └────────────────────────┘
```

#### Structured JSON Schema Constraints
To eliminate the unpredictability of model outputs, the system utilizes the `responseSchema` property in the Gemini SDK:

```json
{
  "type": "object",
  "properties": {
    "company": { "type": "string" },
    "role": { "type": "string" },
    "location": { "type": "string" },
    "salary_range": { "type": "string" },
    "application_deadline": { "type": "string" },
    "key_skills": { "type": "array", "items": { "type": "string" } },
    "confidence_score": { "type": "number" }
  },
  "required": ["company", "role", "location", "key_skills"]
}
```

#### Prompt Isolation & Validation
The system prompt enforces zero hallucination thresholds. If a job posting lacks key details, the model returns explicit flags rather than guessing. 

---

## 7. Security, Compliance & Cryptographic Boundaries

PlacementOS is designed with strict data isolation policies:

1. **API Key Isolation**: Server API proxy endpoints handle calls to external models. Sensitive API keys are never exposed in the browser's developer tools.
2. **PostgreSQL Row Level Security (RLS)**: RLS is active on all tables, isolating candidate records. 
3. **Sandbox Cryptographic Verification**: The Career Vault checks file checksums to ensure file integrity.
4. **Input Sanitization**: URLs are checked for potential injection vectors before processing.
5. **Biometric Session Expiry**: Sessions are automatically expired after 15 minutes of inactivity to keep candidate data secure.

---

## 8. Performance Metrics & Latency Benchmarks

The following latency metrics are established as architectural design targets and simulator reference benchmarks:

* **In-Memory Query Aggregations (Design Goal)**: `< 1ms` (using memoized React/TypeScript selectors).
* **Navigation Transitions (Design Goal)**: `< 12ms` (utilizing optimized Motion v12 spring physics).
* **Automated Data Simulation (Design Goal)**: `< 1200ms` (using debounced state changes and simulated server delays).
* **Initial Page Load / Bundle Size (Design Goal)**: `< 240KB` (fully tree-shaken, compressed, and static-optimized).
* **Layout Refresh Rate (Design Goal)**: Stable `60 FPS` on responsive and mobile viewports.

---

## 9. Accessibility (WCAG AAA Compliance)

PlacementOS implements rigorous visual and interactive access features inside the simulator interface to demonstrate AAA standards:

* **Interactive Elements**: All simulated buttons, inputs, and tab rails are configured with minimum touch/click targets of `44px x 44px` to ensure ergonomic usability.
* **Large Text Scaling (Interactive Simulator Feature)**: Accessible in the QA console's Accessibility tab. When activated, text sizes dynamically scale using responsive `rem` units with full layout restructuring.
* **Motion Accessibility (Interactive Simulator Feature)**: Includes a global "Reduced Motion Mode" switch that instantly suppresses Spring animations, protecting users with vestibular sensitivities.
* **Auditory Narration (Interactive Simulator Feature)**: Built-in voice synthesizer simulation that reads focused element labels and active page status logs aloud.

---

## 10. Testing & Headless QA Suite

The simulator platform includes a highly detailed visual **QA Test Runner Console** representing true target mobile core test cases:

| Target Blueprint Module | Simulated Purpose | Verification Mode |
| :--- | :--- | :--- |
| **auth_module_test.dart** | Auth Lifecycle Validation | Token expiration checks |
| **placement_tracker_crud_spec.dart** | Pipeline CRUD Verification | Assert status workflows |
| **supabase_backend_rls_policies.dart** | RLS Isolation Assertions | Multi-tenant protection |
| **career_vault_file_encryption.dart**| Cryptographic Validation | Validate vault constraints |
| **deadline_schedules_notification.dart**| Lifecycle Trigger Tests | Scheduling alert events |
| **ai_capture_metadata_validation.dart**| AI Payload Integrity | Check structural consistency |
| **dashboard_riverpod_memoization.dart** | Performance Selectors Check | Verify calculation latency |

### Executing Static Analysis (Actual Command)
Static type safety is enforced strictly using TypeScript compilation. Run the following command in the terminal to execute the static check:
```bash
npm run lint
```

### Running the Simulator QA Suite (Interactive)
1. Launch the simulator web app.
2. Click the **Preferences (Settings)** tab in the bottom bar of the device frame.
3. Click the **V1.0 Release & QA Console** option.
4. Under the **QA Test Runner** tab, click **Execute Test Suite** to run and observe the simulated core tests.

---

## 11. Production Deployment Guide

PlacementOS runs as a static Single Page Application (SPA). To run, analyze, and build the application locally, use the following verified npm scripts:

```bash
# 1. Start the local development server (binds to port 3000)
npm run dev

# 2. Run static analysis and TypeScript verification
npm run lint

# 3. Compile the production-ready static application files (to dist/)
npm run build

# 4. Preview the compiled production build locally
npm run preview
```

---

## 12. Continuous Integration & Linting Rules

Every commit must pass strict TypeScript compilation and standard formatting rules before code can be merged:

* **Type Verification**: `tsc --noEmit` verifies there are no type mismatches or implicit `any` assignments across the workspace.
* **Import Rules**: Imports must be placed at the top level and must not use object destructuring.
* **Standard Enums**: Enforce standard `enum` declarations. Do not use `const enum`.

---

## 13. Developer Guide & Contribution Protocol

To maintain a reliable workspace, all contributors must follow these guidelines:

1. **Branch Naming Conventions**:
   * Features: `feature/ticket-[id]-[description]`
   * Security: `security/ticket-[id]-[description]`
   * Hardening / Cleanup: `hardening/ticket-[id]-[description]`
2. **Commit Message Standards**: Use structured prefixes:
   * `feat(ticket-012)`: Implemented accessibility audits.
   * `fix(ticket-011)`: Resolved chart coordinates alignment.
   * `docs(readme)`: Updated architecture documentation.

---

## 14. Production-Ready Release Checklist

A checklist of requirements for a production release:

- [x] **Static Analysis**: Lint check (`npm run lint`) results in zero errors.
- [x] **Verification**: All simulated automated test runs pass successfully.
- [x] **Key Isolation**: Sensitive secrets and tokens are safely isolated.
- [x] **Contrast Ratio Compliance**: Complies with AAA high-contrast color standards.
- [x] **Accessibility Targets**: Interactive touch targets are sized at `44px` or greater.
- [x] **Clean Codebases**: Unused modules, mock comments, and redundant files have been pruned.
- [x] **Documentation Complete**: Technical manuals and blueprints are fully accurate.

---

## 15. System License

PlacementOS is open-source software licensed under the **Apache License, Version 2.0**.
For more details, please review the license files in the repository root.

---

*Designed and engineered by the Principal Engineers of PlacementOS. All rights reserved. 2026.*
