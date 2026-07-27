Perfect. This is the phase where we design the foundation of VeyloPrep's data model. We won't write SQL yet—we'll first define the architecture so that implementation is clean and scalable.

---

# VeyloPrep Database Design Document (DDD)

* *Phase 3.3 — Database Architecture**

**Version:** 1.0
**Status:** Design Draft

---

# 1. Design Principles

The database must be:

* User-centric (every user's data is isolated)
* Scalable to thousands of users
* Easy to query
* Easy to maintain
* Secure using Row Level Security (RLS)
* Extensible for future AI features
* Free from duplicated data

---

# 2. Core Entities

### Users

Stores authenticated user information (managed by Supabase Auth).

---

### Profiles

Stores user profile information.

Examples:

* Full Name
* University
* Degree
* Graduation Year
* Target Role
* Target Companies
* Avatar

Relationship:

```
User
│
└── 1 Profile
```

---

### Jobs

Stores every job/internship the user tracks.

Examples:

* Company
* Role
* Job URL
* Location
* Salary
* Employment Type
* Status

Relationship:

```
User
│
└── Many Jobs
```

---

### Applications

Tracks application progress.

Examples:

* Applied
* OA Scheduled
* Interview
* Offer
* Rejected

Relationship:

```
Job
│
└── Many Application Events
```

This gives you a complete timeline instead of overwriting status.

---

### Deadlines

Stores all important dates.

Examples:

* OA Deadline
* Application Deadline
* Interview Date
* Reminder

Relationship:

```
Job
│
└── Many Deadlines
```

---

### Resumes

Supports multiple resumes.

Examples:

* SWE Resume
* Backend Resume
* Cloud Resume

Fields:

* Name
* Version
* Active
* Created At

Relationship:

```
User
│
└── Many Resumes
```

---

### Documents

General document storage.

Examples:

* Resume PDF
* Cover Letter
* Certificates
* Transcript

Relationship:

```
User
│
└── Many Documents
```

---

### Notes

Personal notes for interviews.

Examples:

* HR questions
* Company research
* Interview preparation

Relationship:

```
Job
│
└── Many Notes
```

---

# 3. Entity Relationship Diagram

```text
Users
 │
 ├──────── Profile (1:1)
 │
 ├──────── Jobs (1:N)
 │              │
 │              ├──── Deadlines (1:N)
 │              ├──── Notes (1:N)
 │              └──── Applications (1:N)
 │
 ├──────── Resumes (1:N)
 │
 └──────── Documents (1:N)
```

---

# 4. Primary Keys

Every table should use:

```
UUID
```

Never integer IDs.

---

# 5. Foreign Keys

Examples:

```
profiles.user_id

jobs.user_id

deadlines.job_id

applications.job_id

documents.user_id

notes.job_id

resumes.user_id
```

---

# 6. Audit Columns

Every table should include:

```
id

created_at

updated_at
```

Optional for future:

```
deleted_at
```

for soft deletes.

---

# 7. Required Indexes

Examples:

```
jobs.user_id

applications.job_id

deadlines.job_id

notes.job_id

documents.user_id

resumes.user_id
```

These support fast lookups by owner.

---

# 8. Unique Constraints

Examples:

```
profiles.user_id
```

One profile per user.

---

Only one active resume:

```
(user_id, is_active)
```

Enforced so a user cannot have multiple active resumes at once (this may require a partial unique index in PostgreSQL).

---

# 9. Row Level Security (RLS)

Every user should only access their own records.

Policy pattern:

```
auth.uid() = user_id
```

For child tables:

```
Job belongs to authenticated user

↓

Access allowed
```

No user should ever be able to query another user's data.

---

# 10. Storage Buckets

Reserve buckets for:

```
resumes/

documents/

avatars/
```

All private by default.

---

# 11. Future Expansion

The schema is designed to support future additions without major redesign:

* AI Resume Review
* AI Job Matching
* AI Interview Feedback
* AI Career Analytics
* Recruiter Portal
* Team Collaboration
* Notifications
* Calendar Sync

---

# 12. Naming Conventions

* Table names: plural (`jobs`, `profiles`, `documents`)
* Columns: `snake_case`
* Primary key: `id`
* Foreign keys: `<table>_id`
* Timestamps: `created_at`, `updated_at`

---

# 13. Implementation Sequence

Once this design is approved, we'll implement it in the following order:

1. Create database tables.
2. Define foreign key relationships.
3. Add indexes and constraints.
4. Enable Row Level Security (RLS).
5. Create storage buckets.
6. Generate TypeScript database types.
7. Verify schema and migrations.

---

## CTO Review

This design keeps the schema **normalized, secure, and scalable** while remaining simple enough for a solo developer to maintain. It establishes a solid foundation for VeyloPrep's current roadmap and leaves room for future AI capabilities without requiring disruptive database redesigns. Once you're happy with this design, the next step is to convert it into Supabase SQL migrations and implement the schema.
