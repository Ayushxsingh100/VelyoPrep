# DESIGN SYSTEM & ENGINEERING STANDARDS
## Core Blueprint for VeyloPrep
**Version:** 1.0.0-sprint1  
**Status:** Approved  
**Target Architecture:** Flutter (Clean Architecture) & Supabase

---

## PART 1 — DESIGN PHILOSOPHY

Our visual language is a deliberate departure from typical academic and social applications. VeyloPrep is a professional, high-density, lightning-fast workspace designed for ambitious college students. The interface takes direct cues from world-class tools like **Linear**, **Raycast**, **Arc Browser**, and **Stripe**.

```
┌─────────────────────────────────────────────────────────────┐
│                       VISUAL SPECTRUM                       │
│                                                             │
│  [SPEED]         ▶ Instant UI response & pre-fetched assets │
│  [PRECISION]     ▶ Pixel-perfect borders (1px) & alignment  │
│  [TRUST]         ▶ Monospace data grids & raw transparency  │
│  [FOCUS]         ▶ High-contrast dark core, zero noise      │
└─────────────────────────────────────────────────────────────┘
```

### 1.1 Visual Identity & Personality
- **Sophisticated Obsidian Core:** A dark-first aesthetic built around absolute black and deep slate layers. Dark mode is not an afterthought; it is our primary environment. Light mode is a clean, paper-white derivation designed for outdoor high-glare environments.
- **Architectural Honesty (Anti-AI-Slop):** We strictly prohibit gratuitous "tech-larping." No fake telemetry, zero running logs, and no status ticks (e.g., "CORE_NODE_ONLINE") designed to look complex. All data displayed must be functional and direct.
- **Monospaced Accents:** Monospace typography (**JetBrains Mono**) is used selectively to present analytical and system-level data (timestamps, salary figures, status codes, dates, and application counts) to convey precision and institutional authority.

### 1.2 User Experience & Interaction Principles
- **Command-Line-Like Speed:** Transitions must be immediate. Tap feedback should register at the hardware level, with instantaneous visual transitions.
- **Micro-Interactions over Layout Shifting:** Instead of introducing heavy page loads, we favor sliding detail panes, context menus, and inline expansions. The user should feel in control of a single, fluid canvas.
- **Structured Negative Space:** Negative space is treated as an active structural layout element, not just empty space. Dense tables of information are separated by generous, clear margins to maintain elite legibility.

### 1.3 Accessibility & Legibility Goals
- **High-Contrast Focus:** All state indicators, text blocks, and touch items must target **WCAG 2.1 AAA** compliance where technically possible, and a minimum of **AA** rating across all surfaces.
- **Dynamic Scale Support:** Interfaces must scale fluidly up to 200% text enlargement without breaking layout grids, overlapping content, or hiding interactive touch targets.

---

## PART 2 — DESIGN TOKENS

Design tokens are our absolute, immutable source of truth. Hardcoded raw values in widgets or styles are strictly banned.

### 2.1 Spacing Scale (4pt Base Grid)
Our spatial layout is strictly bound to a 4pt grid system to guarantee visual consistency.

| Token | Value (dp) | Use Case |
| :--- | :--- | :--- |
| `spacing.xxs` | 4 | Micro padding between text and icons. |
| `spacing.xs` | 8 | Standard inner padding for compact badges/chips. |
| `spacing.sm` | 12 | Layout separation between elements in a card. |
| `spacing.md` | 16 | Standard container and screen margins. |
| `spacing.lg` | 20 | Margin for prominent titles, sections, and dialog elements. |
| `spacing.xl` | 24 | Vertical padding between structural content modules. |
| `spacing.xxl` | 32 | Major section gaps on wide layouts. |
| `spacing.h1` | 40 | Top-level layout margins. |
| `spacing.h2` | 48 | Extensive negative space boundaries. |
| `spacing.h3` | 64 | Immersive top-level view padding. |

### 2.2 Border Radius System
Borders are sharp and intentional, with larger curves reserved solely for high-level layouts like dialogs and bottom sheets.

| Radius Token | Value (px) | Application |
| :--- | :--- | :--- |
| `radius.xs` | 2 | Small badges, mini markers, inline code blocks. |
| `radius.sm` | 4 | Checkboxes, minor tags, input indicators. |
| `radius.md` | 8 | Standard buttons, text fields, small action cards. |
| `radius.lg` | 12 | Main content cards, interactive bento blocks, search bars. |
| `radius.xl` | 16 | Popovers, dialog containers, drawer layouts. |
| `radius.full` | 9999 | Profile pictures, capsule status chips. |

### 2.3 Elevation System
We avoid heavy, drop-shadow-heavy designs. Elevation is achieved through solid border outlines, transparent backdrops, and subtle, directional ambient occlusion.

- **Flat/Base (`elevation.0`):** Standard page canvas. Outlines serve as dividers.
- **Low/Surface (`elevation.1`):** Border outline `1px` with transparency offset (`rgba(255,255,255,0.03)`).
- **Medium/Interactive (`elevation.2`):** Direct key shadow `Offset(0, 4), blurRadius: 12, color: rgba(0,0,0,0.25)`.
- **High/Floating (`elevation.3`):** Directional shadow `Offset(0, 8), blurRadius: 24, color: rgba(0,0,0,0.40)`.

### 2.4 Stroke & Divider System
- **Hairline Border:** `0.5px` — Inner dividers.
- **Standard Border:** `1.0px` — Base card frames, button edges, text fields.
- **Thick Accent:** `1.5px` — Active focus state outlines.
- **Focus Border:** `2.0px` — High-visibility keyboard/accessibility focus rings.

### 2.5 Opacity Scale
- `opacity.disabled` = `0.38` (Strict WCAG standard for disabled elements).
- `opacity.subtle` = `0.50` (Secondary labels, metadata text).
- `opacity.hover` = `0.08` (White highlight overlay for dark mode hover).
- `opacity.border` = `0.12` (Default border contrast transparency).

### 2.6 Motion System: Timings & Curves
Animations must be snappy and physical, acting as feedback rather than decorative fluff.

```
                  ┌──────────────────────────────┐
                  │      ANIMATION TIMINGS       │
                  │                              │
                  │  [FAST]   ▶ 80ms  (Feedback) │
                  │  [MEDIUM] ▶ 150ms (Toggles)  │
                  │  [SLOW]   ▶ 250ms (Pages)    │
                  └──────────────────────────────┘
```

- **Durations:**
  - `duration.fast` = `80ms` (Micro-state changes, hover exits, feedback ripples).
  - `duration.medium` = `150ms` (Scale transformations, expand/collapse sheets).
  - `duration.slow` = `250ms` (Full page transitions, deep modal presentations).
  - `duration.verySlow` = `400ms` (Detailed analytics draws, complex dashboard entrances).
- **Curves:**
  - `curve.standard` = `Cubic(0.2, 0.8, 0.2, 1.0)` (Rapid start, smooth deceleration).
  - `curve.accelerate` = `Cubic(0.3, 0.0, 0.8, 0.15)` (Linear entry for swift drop-offs).
  - `curve.decelerate` = `Cubic(0.05, 0.7, 0.1, 1.0)` (Extremely smooth landing).

---

## PART 3 — COLOR SYSTEM

Colors are defined using exact hex values to avoid platform translation inconsistencies. Dark Mode is our dominant identity, with Light Mode derived directly from it.

### 3.1 Dark Mode (Primary Palette)
- **Background (`#09090B`):** Absolute deep carbon. Eliminates screen glare.
- **Surface Canvas (`#121214`):** Elevated level. Housing for widgets and cards.
- **Surface Elevated (`#1E1E22`):** Primary level for buttons, menus, and overlays.
- **Primary Accent (`#2563EB`):** Precision Electric Blue. Signifies main actions.
- **Secondary Accent (`#38BDF8`):** Sky Blue. Used for minor information points.
- **Success (`#10B981`):** Deep Emerald. Signifies application approval, success states.
- **Warning (`#F59E0B`):** Warn Amber. Signifies pending deadlines, missing docs.
- **Error (`#EF4444`):** Solid Crimson. Refused application, expired listings.
- **Info (`#6366F1`):** Indigo. Informational tips, system state notices.
- **Borders (`#27272A`):** Low-contrast boundary lines.
- **Dividers (`#18181B`):** Hairline interior lines.
- **Skeleton Background:** `#1B1B1E` to `#242428` linear wave.

### 3.2 Light Mode (Derived Palette)
- **Background (`#FAFAFA`):** Clean Paper White.
- **Surface Canvas (`#FFFFFF`):** High-contrast elevated sheets.
- **Surface Elevated (`#F4F4F5`):** Light grey baseline.
- **Primary Accent (`#1D4ED8`):** Deep Ocean Blue for readable text overlay.
- **Secondary Accent (`#0284C7`):** High-contrast blue.
- **Success (`#059669`):** Forest Green.
- **Warning (`#D97706`):** Ocher Amber.
- **Error (`#DC2626`):** Deep Crimson.
- **Info (`#4F46E5`):** Royal Purple.
- **Borders (`#E4E4E7`):** Subtle boundaries.
- **Dividers (`#F4F4F5`):** Base separator lines.
- **Skeleton Background:** `#EAEAEA` to `#F3F3F3` linear wave.

---

## PART 4 — TYPOGRAPHY

Our typography prioritizes legibility, structured hierarchy, and an analytical tone. 

- **Primary Font Family:** `Inter` or `SF Pro Display` (Sans-Serif for body copy and general layout structures).
- **Secondary Font Family:** `JetBrains Mono` (Monospaced accents for critical analytical variables).

```
┌─────────────────────────────────────────────────────────────┐
│                       TYPOGRAPHY SCALE                      │
│                                                             │
│  Display  ▶ 32px / Bold / Tracking -0.02                    │
│  Headline ▶ 24px / Bold / Tracking -0.015                   │
│  Title    ▶ 18px / SemiBold / Tracking -0.01                │
│  Body     ▶ 14px / Regular / Tracking 0                     │
│  Label    ▶ 12px / Medium / Tracking +0.02 (Uppercase)      │
│  Caption  ▶ 11px / Regular / Tracking +0.01                 │
└─────────────────────────────────────────────────────────────┘
```

### 4.1 Typography Scale Details

| Category | Size (sp) | Weight | Line Height (em) | Tracking (Letter Spacing) | Font Family |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Large** | 32 | Bold (`W700`) | 1.20 | `-0.02` | Sans-Serif |
| **Display Small** | 28 | Bold (`W700`) | 1.25 | `-0.02` | Sans-Serif |
| **Headline Large**| 24 | Bold (`W700`) | 1.30 | `-0.015` | Sans-Serif |
| **Headline Small**| 20 | SemiBold (`W600`) | 1.35 | `-0.01` | Sans-Serif |
| **Title Medium**  | 18 | SemiBold (`W600`) | 1.40 | `-0.01` | Sans-Serif |
| **Title Small**   | 16 | Medium (`W500`) | 1.40 | `0.00` | Sans-Serif |
| **Body Medium**   | 14 | Regular (`W400`) | 1.50 | `0.00` | Sans-Serif |
| **Body Mono**     | 14 | Medium (`W500`) | 1.45 | `-0.01` | Monospace |
| **Label Standard**| 12 | Medium (`W500`) | 1.30 | `0.02` | Sans-Serif |
| **Label Mono**    | 12 | SemiBold (`W600`) | 1.30 | `0.00` | Monospace |
| **Caption**       | 11 | Regular (`W400`) | 1.40 | `0.01` | Sans-Serif |

---

## PART 5 — COMPONENT LIBRARY

Every element in our application uses these concrete specs to maintain an integrated layout.

```
       ┌───────────────── Button Layout ─────────────────┐
       │                                                 │
       │  Outer boundary: 1px border                     │
       │  Corner radius: radius.md (8px)                 │
       │  Padding: 12px vertical, 20px horizontal        │
       │  Interactive state overlay: rgba(255,255,255,x) │
       │                                                 │
       └─────────────────────────────────────────────────┘
```

### 5.1 Interactive Buttons
- **Primary Button:**
  - *Colors:* Solid `Primary Accent` (`#2563EB` / `#1D4ED8`). Text is high-contrast white.
  - *Sizing:* Height `44px` (touch target optimization), 1px border.
  - *Hover State:* Overlay with `rgba(255,255,255,0.08)`.
  - *Pressed State:* Solid background scale reduction (`0.98x`).
  - *Disabled State:* Background opacity `0.12`, text opacity `0.38`.
- **Secondary Button:**
  - *Colors:* Background opaque transparent (`rgba(255,255,255,0.05)`), border `1px` solid `#27272A`.
  - *Hover State:* Border transitions to Primary Accent.
- **Ghost Button:**
  - *Colors:* Transparent background, sharp typography. Padding strictly matches parent boundaries.
- **Danger Button:**
  - *Colors:* Solid `Error` Crimson background. Text is solid white.
- **FAB (Floating Action Button):**
  - *Colors:* Solid deep black Surface background with an illuminated outer boundary ring. Corner radius set to `radius.lg`.

### 5.2 Card Layouts
- **Base Card:**
  - *Attributes:* Background `#121214`, border `1px` solid `#27272A`, corner radius `radius.lg` (12px).
- **Glass Card (Transparent Overlays):**
  - *Attributes:* Background `rgba(18,18,20, 0.70)` with backdrop filter `blur(20px)`. Outer boundary `1px` white outline at `0.08` opacity.
- **Metric Card:**
  - *Attributes:* Features high-visibility monospace statistical indicators paired with structured change indicators.

### 5.3 Inputs & Control Fields
- **Standard Text Input:**
  - *Attributes:* Background `#1E1E22`, height `48px`, border `1px` solid `#27272A`. Focused state transitions to `Primary Accent` with a `1.5px` stroke depth.
- **Dropdown Field:**
  - *Attributes:* Dropdown popover mimics Glass Card with standard overlay positioning to avoid visual clipping.
- **Date Picker Dialog:**
  - *Attributes:* Uses grid selectors. Weekend items use transparent slate coloring.

### 5.4 Overlay Containers
- **System Dialogs:**
  - *Attributes:* Heavy modal layer. Background `#121214`, outer edge `1px` `#27272A`. Center alignment, dismissable dark backdrop layer `rgba(0,0,0,0.60)`.
- **Sliding Bottom Sheets:**
  - *Attributes:* Bound to bottom layout margins. Slide physics configured using `curve.decelerate` over `duration.slow` (250ms). Included handle bar: `width: 32px, height: 4px, color: rgba(255,255,255,0.15)`.

### 5.5 Indicators & System Elements
- **Status Badges / Tags:**
  - *Success State:* Green background `rgba(16,185,129,0.12)` with solid green text `#10B981`.
  - *Warning State:* Amber background `rgba(245,158,11,0.12)` with solid amber text `#F59E0B`.
  - *Error State:* Crimson background `rgba(239,68,110,0.12)` with solid crimson text `#EF4444`.
- **System Snackbars:**
  - *Attributes:* Fixed positioning above bottom navigation layer. Floating container with dark background, 1px border matching action category (e.g. green border for success, red for error).

---

## PART 6 — MOTION SYSTEM

Our motion system is designed to provide high-performance physical feedback while keeping screen layouts stable.

### 6.1 Layout Transitions
- **View-Level Transitions (Page Navigation):**
  - Uses horizontal slide transitions paired with clean opacity fades. 
  - *Duration:* `duration.slow` (250ms).
  - *Curve:* `curve.standard`.
  - *Behavior:* The current view shifts left (`0.05x`), while the incoming view slides in from the right edge with a clean fade.
- **Bottom Sheet Presentations:**
  - Uses vertical slide-ups with a subtle backdrop dim.
  - *Duration:* `duration.slow` (250ms).
  - *Curve:* `curve.decelerate`.

### 6.2 Element-Level Transitions
- **Hover Transitions:**
  - Subtle change in background opacity and border color.
  - *Duration:* `duration.fast` (80ms) for high-performance visual responsiveness.
- **Interactive Press Scaling:**
  - Tactile physical scale reduction when elements are pressed.
  - *Scale factor:* Scale down to `0.98` on touch down, spring back to `1.0` on release.
- **Loading Skeletons:**
  - Custom linear gradient shifting across card surfaces.
  - *Duration:* Loop cycle set to `1200ms`.
  - *Curve:* Linear.

---

## PART 7 — RESPONSIVE SYSTEM

We design for a wide range of devices, ensuring layouts remain clear and functional from small phone screens to tablets.

```
Breakpoints:
┌───────────────────────────┬───────────────────────────┐
│ Small Phones (<360dp)      │ Large Phones (360-600dp)  │
├───────────────────────────┼───────────────────────────┤
│ Tablets (600-1024dp)      │ Desktop (>1024dp)         │
└───────────────────────────┴───────────────────────────┘
```

### 7.1 Layout Grids & Structural Margins
- **Small Phone Boundaries (<360dp):**
  - Screen Margin: `12dp`.
  - Base Layout Column count: `4`.
  - Grid Gap: `8dp`.
- **Standard/Large Phone Boundaries (360dp - 600dp):**
  - Screen Margin: `16dp`.
  - Column count: `4`.
  - Grid Gap: `12dp`.
- **Tablet / Large Screen Boundaries (>600dp):**
  - Screen Margin: `24dp` or `32dp`.
  - Columns auto-scale into clean Bento grids (up to `12` columns on tablet/desktop layouts).
  - Sidebars occupy a fixed `260dp` width.

### 7.2 Core Scaling & Structural Guidelines
- **Responsive Text Scaling:** All typography must use device independent pixels (`sp`). Never use hardcoded physical pixel parameters.
- **Layout Constraints:**
  - Wrap layouts in `SafeArea` widgets to protect interactive content from camera cutouts, notches, and rounded display corners.
  - Complex data structures and wide columns automatically transition to scrollable horizontal lists or multi-line card summaries on narrow screens to prevent layout overflow.

---

## PART 8 — ENGINEERING STANDARDS

We use a **Feature-first Clean Architecture** pattern to ensure the codebase remains modular, testable, and easy to scale.

### 8.1 Base Directory Architecture
Every module and layer of the application is isolated in a clear, structured directory pattern.

```
/lib/
├── core/                        # Global resources, design system, unified utilities
│   ├── constants/               # Global static definitions
│   ├── errors/                  # Unified exceptions and failures definitions
│   ├── theme/                   # Unified colors, fonts, and dark/light modes
│   └── utils/                   # Shared validation helpers
├── services/                    # Shared system-wide third-party handlers
│   ├── auth/                    # Core Auth service
│   ├── database/                # Supabase database instance bindings
│   └── storage/                 # Storage management system
├── shared/                      # Reusable widget library and layouts
│   ├── layouts/                 # Screen templates and sidebars
│   └── widgets/                 # Reusable buttons, inputs, and elements
└── features/                    # Feature-focused modules (Self-contained)
    ├── auth_portal/             # Auth Portal Feature (e.g. Login, Register)
    │   ├── data/                # Data adapters, API models, DTOs
    │   ├── domain/              # Entities, repository interfaces, use cases
    │   └── presentation/        # Riverpod controllers, widgets, and screens
    └── dashboard_portal/        # Dashboard Portal Feature (Placeholder)
```

### 8.2 Coding & Naming Standard
- **File Naming Conventions:**
  - Files use standard `snake_case` (e.g., `primary_button.dart`).
  - Directories use lowercase `snake_case` (e.g., `auth_portal`).
- **Class Naming Conventions:**
  - Classes use standard `PascalCase` (e.g., `PrimaryButton`).
  - DTO classes end with `Dto` suffix (e.g., `UserCredentialsDto`).
  - Entities do not use a suffix (e.g., `UserCredentials`).
- **Riverpod State Naming:**
  - StateNotifier / Notifier classes end with `Controller` (e.g., `AuthController`).
  - Providers use `camelCase` and end with `Provider` (e.g., `authControllerProvider`).
- **Repository Implementation Patterns:**
  - Abstract repository interfaces are defined in the **Domain** layer.
  - Concrete repository implementations live in the **Data** layer to keep the domain clean and testable.

### 8.3 SOLID & Clean Code Rules
- **No Inline Business Logic:** Presentation widgets must only render UI. All business logic, state handling, and API routing live in Riverpod Controllers and Use Cases.
- **Single Responsibility (SRP):** Keep files under `200` lines of code. If a widget starts growing too large, split it out into modular sub-widgets.
- **Composition over Inheritance:** Always favor composing modular components together over extending parent widget classes.

---

## PART 9 — ERROR HANDLING

We use a type-safe, unified error handling architecture to catch issues early and show helpful messages to the user.

### 9.1 The Result Type Container
We use a unified `Result` monad structure to enforce type safety in our service and repository calls, replacing standard error-prone throw blocks.

```dart
sealed class Result<S, E extends Failure> {
  const Result();
}

class Success<S, E extends Failure> extends Result<S, E> {
  final S value;
  const Success(this.value);
}

class FailureState<S, E extends Failure> extends Result<S, E> {
  final E failure;
  const FailureState(this.failure);
}
```

### 9.2 Failure Categories
All system failures extend a base `Failure` class with clear, user-friendly fallback messages:
- **`ServerFailure`:** Returned for network dropouts, timeout errors, or API gateway failures.
- **`DatabaseFailure`:** Returned for Supabase row-level issues, transaction errors, or storage write failures.
- **`AuthFailure`:** Returned for invalid credentials, expired session tokens, or unauthorized route access.
- **`ValidationFailure`:** Returned for invalid form inputs or client-side validation errors.

### 9.3 Global Logging & User Notifications
- Unhandled system exceptions are intercepted globally using Flutter's `FlutterError.onError` handler.
- Failed actions must show a clean, high-contrast contextual error banner or snackbar to the user with a retry action, rather than silent failures or raw system stack traces.

---

## PART 10 — ENVIRONMENT STRATEGY

To keep local secrets secure and decouple external services, we define clean, separate environment configurations.

### 10.1 Environment Configurations
We support three isolated stages:
- **Development (`dev`):** Local sandbox using mock services or local Supabase instances. Feature flags enabled for development.
- **Staging (`staging`):** Accurate replica of the production environment for user acceptance testing (UAT).
- **Production (`prod`):** Live database and auth systems with strict performance monitoring and crash analytics enabled.

### 10.2 Secrets Configuration (`.env` template)
Local configuration keys are managed using standard environment files.

```env
# Core Application Configurations
APP_ENV=development
APP_VERSION=1.0.0

# Third-Party API Credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GROQ_API_KEY=gsk_v12...
```

*Note: Environment configuration files are added to `.gitignore` to prevent leaking raw secrets to version control.*

---

## PART 11 — PERFORMANCE STANDARDS

Our performance goal is a stable **120 FPS** on supported devices, keeping load times under **50ms**.

### 11.1 Widget Rebuild Optimization
- **Declare Const Constructors:** Mark widgets with `const` wherever possible. This allows Flutter to cache and reuse the widget sub-tree instead of rebuilding it.
- **Targeted Riverpod Selectors:** Use `ref.select` to listen only to the specific properties you need. This prevents the parent widget from rebuilding when unrelated state properties change.
- **Isolate List View Rebuilds:** In infinite list views, wrap each child item in its own dedicated, lightweight widget to prevent the entire list from repainting during scrolling.

### 11.2 Database & Media Performance
- **Indexed Database Queries:** Ensure all database queries leverage primary keys, foreign keys, or indexes.
- **Lazy Initialization:** Initialize expensive API SDKs and state objects only when first needed, rather than at app launch.
- **Paginate Data Lists:** Always paginate dynamic data lists, starting with a base size of `20` items per page to keep payloads light.

---

## PART 12 — ACCESSIBILITY

We design VeyloPrep to be accessible to everyone, ensuring no student is left behind.

- **WCAG 2.1 AAA Compliance:** All primary text-to-background elements must maintain a contrast ratio of at least `7:1`. Secondary elements must target a minimum ratio of `4.5:1`.
- **Screen Reader Support:** Maintain detailed `semanticsLabel` properties on non-text elements and interactive icon buttons to ensure screen readers can announce them correctly.
- **Dynamic Text Scaling:** Wrap text blocks in auto-fitting containers, using scalable font units (`sp`) to handle user-configured font scale sizes gracefully.
- **Touch Target Padding:** Ensure interactive buttons maintain a minimum physical touch target of `44 x 44 dp` to prevent misclicks.
- **Respect Device Motion Settings:** Check the user's system motion settings. When "Reduce Motion" is enabled, heavy slide and scale transitions must automatically fallback to simple, clean opacity fades.

---

## PART 13 — DEFINITION OF DONE (DoD)

A development sprint is considered complete only when all criteria in our unified definition of done are fully satisfied.

```
┌─────────────────────────────────────────────────────────────┐
│                    DEFINITION OF DONE (DoD)                 │
│                                                             │
│  [1] CLEAN ARCHITECTURE   ▶ Feature-first isolation         │
│  [2] NO REUSE VIOLATIONS  ▶ Zero inline styles or magic values│
│  [3] PERFORMANCE          ▶ Stable 120 FPS, const constructors│
│  [4] ACCESSIBILITY        ▶ Contrast check, 44dp touch target │
│  [5] DATABASE CONSTRAINTS ▶ RLS rules & clean indexing      │
└─────────────────────────────────────────────────────────────┘
```

1. **Architecture Isolation:** Features must be entirely self-contained. The domain layer has zero dependencies on data adapters, databases, or UI widgets.
2. **Design Language Alignment:** Components must consume existing Design Tokens. No hardcoded colors, spacing scales, or custom font parameters are allowed.
3. **Responsive Verification:** UI must scale and adapt cleanly across small phones, standard tablets, and landscape configurations.
4. **Type-Safe Error Handling:** Repository operations must wrap network calls and database queries in type-safe `Result` monads.
5. **No Blockers or Warnings:** The codebase must pass strict compilation checks and lint analysis with zero warnings or errors.
6. **Code Reusability:** Duplicate UI structures must be refactored into shared widgets under `/lib/shared/`.
7. **Accessibility Compliance:** Touch targets must meet the `44dp` minimum, contrast checks must pass, and semantic labels must be defined for interactive icons.
8. **Performance Optimization:** All static widgets must use `const` constructors, and Riverpod observers must target specific state fields using `ref.select`.
9. **Secure Database Connectivity:** Tables must configure Row-Level Security (RLS) rules, and API keys must be loaded securely from environment configurations.
