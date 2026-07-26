<p align="center">
  <img src="./showcase/hero/veylo-prep-hero.png" alt="VeyloPrep — Your Placement Journey, Organised" width="100%" />
</p>

<h1 align="center">VeyloPrep</h1>

<p align="center">
  <strong>Your Placement Journey, Organised.</strong>
</p>

<p align="center">
  A mobile-first career-readiness workspace for managing applications, placement milestones, job portals, resumes, certificates and professional information — all in one place.
</p>

<p align="center">
  <a href="https://veylo-prep.vercel.app/"><strong>Live App</strong></a>
  ·
  <a href="#product-showcase"><strong>Showcase</strong></a>
  ·
  <a href="#system-architecture"><strong>Architecture</strong></a>
  ·
  <a href="#getting-started"><strong>Run Locally</strong></a>
</p>

---

## Overview

Placement preparation rarely happens in one place.

Applications live in spreadsheets. Interview dates sit in calendars. Resumes and certificates are scattered across folders. Job portals become browser bookmarks, while deadlines and tasks end up in notes.

**VeyloPrep brings that fragmented workflow into one structured career workspace.**

Built for college students preparing for internships and placements, VeyloPrep provides a central place to track opportunities, manage upcoming milestones, organise career resources and maintain a reusable professional profile.

---

## Product Showcase

### Career Dashboard

Get a clear view of your placement journey, upcoming priorities and application progress from one home screen.

<p align="center">
  <img src="./showcase/screenshots/dashboard.png" alt="VeyloPrep Career Dashboard" width="100%" />
</p>

### Application Tracker

Track opportunities through the complete application journey — from applying to assessments, interviews and offers.

<p align="center">
  <img src="./showcase/screenshots/application-tracker.png" alt="VeyloPrep Application Tracker" width="100%" />
</p>

### Today & Milestones

Keep interviews, assessments, deadlines and other placement activities visible and organised.

<p align="center">
  <img src="./showcase/screenshots/today.png" alt="VeyloPrep Today and Milestones" width="100%" />
</p>

### Job Hub

Keep frequently used job portals and career resources accessible from one organised hub, with support for custom portals.

<p align="center">
  <img src="./showcase/screenshots/job-hub.png" alt="VeyloPrep Job Hub" width="100%" />
</p>

### Career Vault

Maintain the information and documents repeatedly needed throughout internship and placement applications.

<p align="center">
  <img src="./showcase/screenshots/career-vault.png" alt="VeyloPrep Career Vault" width="100%" />
</p>

### Career Resources

Organise resumes, certificates and professional links so important career assets remain easy to access.

<p align="center">
  <img src="./showcase/screenshots/vault-resources.png" alt="VeyloPrep Career Resources" width="100%" />
</p>

---

## Core Features

| Area | Capabilities |
| --- | --- |
| **Career Dashboard** | Placement overview, application progress and current priorities |
| **Application Tracker** | Application records, stage tracking, details and notes |
| **Milestones** | Interviews, assessments, deadlines and upcoming placement activities |
| **Job Hub** | Organised job-portal directory with custom portal management |
| **Career Vault** | Career profile, education details and reusable professional information |
| **Resume Management** | Multiple resume versions and default resume selection |
| **Certificates** | Certificate and document organisation |
| **Professional Links** | LinkedIn, GitHub, portfolio and other reusable links |
| **Profile & Settings** | Personal information, profile editing and appearance preferences |
| **Authentication** | User authentication and persistent account-based data |
| **Cross-Platform** | Responsive web app, installable PWA and Android app through Capacitor |

---

## Demo

A short walkthrough of the core VeyloPrep experience:

**Dashboard → Applications → Today → Job Hub → Career Vault**

<p align="center">
  <a href="./showcase/demo/veylo-prep-demo.mp4"><strong>Watch Product Demo</strong></a>
</p>

---

## System Architecture

<p align="center">
  <img src="./docs/architecture/system-architecture.png" alt="VeyloPrep System Architecture" width="100%" />
</p>

VeyloPrep uses a shared React + TypeScript application across its web and mobile experiences.

The application communicates with **Supabase** for authentication and persistent PostgreSQL-backed data. The web application is deployed through **Vercel**, while **Capacitor** packages the same application for Android.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19 |
| **Language** | TypeScript 5.8 |
| **Build Tool** | Vite 6 |
| **Backend / BaaS** | Supabase |
| **Database** | PostgreSQL |
| **Authentication** | Supabase Auth |
| **Styling** | Custom CSS |
| **Mobile** | Capacitor 8 |
| **PWA** | Progressive Web App |
| **Deployment** | Vercel |
| **Package Manager** | npm |

---

## Engineering Highlights

### Cross-Platform Architecture

VeyloPrep uses a shared React and TypeScript codebase across the web application, installable PWA and Android application, reducing duplicated platform logic while maintaining a mobile-first experience.

### Modular Feature Architecture

Major product areas are separated under `src/features/`, keeping dashboard, tracking, milestones, jobs and vault functionality independently organised.

### Persistent User Experience

Supabase provides authentication and persistent PostgreSQL-backed storage so career information and placement activity remain associated with the authenticated user.

### Mobile-First Product Design

The interface is designed around mobile workflows with bottom navigation, responsive layouts and interaction patterns suited to frequent day-to-day placement tracking.

### Native Android Packaging

Capacitor bridges the web application into an Android project, allowing the same product to run as an installable Android application while preserving the shared application codebase.

---

## Project Structure

```text
VeyloPrep/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   │
│   ├── config/
│   │   ├── assets.ts
│   │   └── constants.ts
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   ├── tracker/
│   │   ├── deadlines/
│   │   ├── jobs/
│   │   └── vault/
│   │
│   ├── providers/
│   │   ├── navigation.provider.tsx
│   │   └── theme.provider.tsx
│   │
│   └── repositories/
│
├── android/
├── assets/
│
├── showcase/
│   ├── hero/
│   ├── screenshots/
│   └── demo/
│
├── docs/
│   └── architecture/
│
├── .env.example
├── capacitor.config.ts
├── package.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase project
- Android Studio for Android development

### Clone the Repository

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd VeyloPrep
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a local `.env` file:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_URL=http://localhost:3010
```

Keep environment files containing real project values out of version control.

### Start Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Android

VeyloPrep uses Capacitor to package the application for Android.

Build the web application and synchronise it with the Android project:

```bash
npm run build
npx cap sync android
npx cap open android
```

This opens the native Android project in Android Studio for building and testing.

---

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Client-side Supabase anonymous key |
| `VITE_APP_URL` | Application base URL |

Environment-specific values should be configured locally or through the deployment platform rather than committed to the repository.

---

## Platform Support

| Platform | Status |
| --- | --- |
| **Web** | Available |
| **PWA** | Available |
| **Android** | Available through Capacitor |
| **iOS** | Development / Testing |

---

## Roadmap

- [x] Career Dashboard
- [x] Application Tracker
- [x] Today & Milestones
- [x] Job Hub
- [x] Career Vault
- [x] Resume management
- [x] Certificate management
- [x] Professional links
- [x] Authentication
- [x] Persistent user data
- [x] Progressive Web App
- [x] Capacitor Android integration
- [ ] Continue improving the mobile experience
- [ ] Expand placement workflow capabilities
- [ ] Continue iOS development and testing

---

## Author

**Ayush Singh**

Creator and developer of VeyloPrep.

---

## License

No open-source license has been selected for VeyloPrep yet.
