# Recipe Finder Hardening and Frontend Modernization Design

**Date:** 2026-08-13

**Status:** Approved direction

**Scope:** Existing React + ASP.NET Core + SQL Server application only; mock API and SEO are excluded.

## 1. Goals

The work will improve the existing project without replacing its product identity or discarding the current uncommitted frontend work. The completed application must:

- preserve the existing recipe, blog, feedback, authentication, and admin workflows;
- use server-authoritative authentication that survives a browser refresh;
- prevent unauthenticated and non-admin access to protected routes and API actions;
- clear all sensitive client state during logout and after token expiration;
- provide consistent frontend and backend validation;
- retain EF Core's parameterized data access and close the identified XSS, CSRF, authorization, password-storage, and error-disclosure gaps;
- use the real ASP.NET Core API for CRUD operations, including rollback-safe optimistic deletion;
- contain failures through an Error Boundary and purpose-built error states/pages;
- adopt a practical feature-based frontend structure;
- provide responsive, accessible loading, form, navigation, admin, and content experiences;
- verify critical behavior through automated tests, linting, builds, and dependency audits.

## 2. Constraints and Non-goals

- No `json-server`, mock backend, Redux Toolkit, server-side rendering, or SEO work will be added.
- The existing emerald/orange visual identity and content will be retained and refined.
- Existing uncommitted user changes and image assets are treated as source material and must not be reset or overwritten.
- The refactor will follow current React, TypeScript, ASP.NET Core, EF Core, and SQL Server patterns rather than introduce a second application architecture.
- React Hook Form and the minimal Vitest/React Testing Library dependencies may be added. No schema library is required unless implementation proves that React Hook Form rules cannot express a necessary constraint.
- Authentication state will use Context + `useReducer`; Redux would add unnecessary weight for the current application size.

## 3. Target Frontend Architecture

The frontend will move from page/type/service folders to responsibility-based feature boundaries:

```text
src/
├── app/
│   ├── App.tsx
│   ├── AppProviders.tsx
│   ├── router/
│   └── errors/
├── features/
│   ├── auth/
│   ├── recipes/
│   ├── blogs/
│   ├── feedback/
│   └── admin/
├── shared/
│   ├── api/
│   ├── auth/
│   ├── lib/
│   ├── types/
│   └── ui/
└── main.tsx
```

Each feature owns its pages, API wrapper, form rules, and feature-specific components. Cross-feature primitives such as the Axios client, image URL normalizer, error mapping, buttons, form fields, loaders, skeletons, and generic error states live in `shared`. Application providers, route composition, top-level errors, and bootstrap behavior live in `app`.

Files will be moved incrementally while preserving their current behavior and design work. Compatibility re-exports may be used temporarily only when they reduce migration risk; they will not remain when no longer necessary.

## 4. Authentication and Authorization

### 4.1 Server behavior

- Login will issue the JWT in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie. JavaScript will not read or persist the token.
- `GET /api/auth/me` will validate the cookie and return the authenticated user's public identity and role.
- `POST /api/auth/logout` will expire the auth cookie.
- JWT validation will read the token from the expected cookie. Issuer, audience, signature, and expiration validation remain mandatory.
- Recipe create, update, and delete; blog create, update, and delete; and feedback read/delete endpoints will require the Admin role. Public reads, search, registration, login, and feedback submission remain public.
- Protected mutation requests will carry an antiforgery header. CORS will allow credentials only from configured frontend origins.

### 4.2 Client behavior

`AuthProvider` will expose:

```ts
type AuthStatus = "checking" | "authenticated" | "anonymous";

type AuthUser = {
  username: string;
  role: "Admin" | "User";
};

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  login(credentials: LoginInput): Promise<AuthUser>;
  logout(reason?: "manual" | "expired"): Promise<void>;
};
```

On application bootstrap, the provider calls `/auth/me`. The global entrance loader remains visible while this check is unresolved, preventing protected content from flashing.

`ProtectedRoute` waits for `checking`, redirects anonymous users to `/login` with `replace`, and preserves the intended internal location. `AdminRoute` additionally checks the server-derived role and routes authenticated non-admin users to `/forbidden`.

The single Axios client uses `withCredentials`. Its 401 handler notifies the auth layer once, clears in-memory identity, and redirects only when the current route requires authentication. It must not retry the failed request and must ignore expected 401 responses from login and `/auth/me`; therefore an expired token cannot produce a retry or redirect loop.

Logout first asks the server to clear the cookie, always resets the reducer in `finally`, removes any legacy `sessionStorage`/`localStorage` auth keys, clears sensitive feature caches, and navigates to login with `replace`. Browser Back may change the URL, but route guards must prevent protected data from rendering.

## 5. Backend Security Hardening

### 5.1 Passwords and secrets

New passwords will use versioned PBKDF2 records with a random salt and constant-time verification. Existing SHA-256 records will be recognized only as a migration format: after a successful legacy verification, the server immediately replaces the stored value with PBKDF2. No plaintext password or hash is logged.

The JWT signing key and production connection string will not be committed in `appsettings.json`. Development setup will use user-secrets or environment variables, and documentation will provide exact setup commands. Example configuration will contain placeholders only.

### 5.2 Validation and abuse controls

Backend DTO validation is authoritative. Rules will cover trimmed required strings, username and email format, password strength and maximum size, title/content/message lengths, cooking-time range, difficulty and sort allowlists, ingredient count/length/uniqueness, positive route IDs, and safe image URLs. Services will normalize values after validation.

Login, registration, and public feedback submission receive ASP.NET Core rate-limit policies with non-sensitive 429 responses. Authentication errors use one generic response so account existence is not disclosed.

### 5.3 SQL Injection and XSS

All database operations remain EF Core LINQ expressions, which generate parameterized SQL. No concatenated SQL or raw query will be introduced. Tests will submit quote/comment-style injection payloads and verify they are rejected or stored/searched as inert data rather than changing query structure.

React text interpolation remains the rendering mechanism for user-controlled content; `dangerouslySetInnerHTML`, `innerHTML`, and dynamic script execution are prohibited. Image URLs will accept configured local paths or HTTPS URLs only. External links will use `rel="noopener noreferrer"`.

The frontend entry document will define an application-compatible baseline Content Security Policy, and the production hosting notes will require the equivalent response header at the frontend host. The API will emit API-appropriate security headers. Production exception responses will contain a correlation identifier and generic message, never raw exception text or stack traces.

## 6. Forms and Validation UX

Login, registration, contact, recipe create/edit, and blog create/edit forms will use React Hook Form. Shared field components will provide:

- an associated label and stable field ID;
- inline Azerbaijani validation feedback;
- `aria-invalid` and `aria-describedby` wiring;
- consistent focus, disabled, and error styling;
- whitespace normalization before submission;
- submit locking and an inline progress indicator while pending.

Frontend rules mirror the user-facing subset of backend constraints but never replace server validation. API validation problems map back to individual fields when possible; unknown problems show a form-level error without leaking implementation details. Password fields support show/hide without changing their value or validation state.

## 7. Real API CRUD and Optimistic UI

The application continues to use the ASP.NET Core API.

- Admin recipe, blog, and feedback deletion will remove the item from local state immediately after confirmation.
- The deleted item and its original index are retained until the request succeeds.
- If the request fails, the exact item is restored at its previous position and an actionable error toast is shown.
- Buttons for the item remain protected from duplicate mutations.
- Create and edit forms use pessimistic submission because the server is authoritative for validation and identity; controls are disabled while pending and navigation occurs only after success.
- Query functions accept an `AbortSignal` where useful so unmounted pages do not commit stale responses.
- List refreshes use functional state updates or current request identifiers so an older response cannot overwrite a newer mutation.

## 8. Error Containment and Error Pages

A top-level Error Boundary catches render/lifecycle errors and displays a branded recovery panel with Reload and Home actions. Route-level boundaries may isolate admin and public shells where doing so improves recovery. Event-handler and async errors remain explicitly caught because React boundaries do not catch them.

The router will provide:

- `/unauthorized` or login redirect behavior for unauthenticated access;
- `/forbidden` for an authenticated user without the required role;
- the existing branded 404 page for unknown routes/resources;
- a generic failure state for unexpected API/server failures;
- a reusable offline/network state with Retry.

Errors are mapped centrally from Axios/network responses. Public UI receives short Azerbaijani messages; diagnostic details remain in development logging only.

## 9. Loading, Animation, and Responsive UI

The entrance experience will use the existing Recipe Finder logo and palette. It appears during auth bootstrap and has only a short minimum display time needed for a coherent animation; it will not impose a long artificial delay. The animation and all route transitions respect `prefers-reduced-motion`.

Existing public-page skeletons will be standardized. Missing loading states will be added to admin lists, dashboard statistics, edit-page initial loads, mutations, image loading, and retry flows. Layout-sized skeletons are preferred over full-screen spinners once the application shell is visible.

UI refinement includes:

- consistent container widths, type scale, spacing, radii, focus rings, and button states;
- a clearer mobile navbar and admin navigation;
- responsive form grids and overflow-safe admin tables/cards;
- touch targets of at least 44px where practical;
- semantic headings, landmarks, button types, labels, alt text, and visible keyboard focus;
- safe long-text wrapping and image aspect ratios;
- tasteful motion limited to hierarchy, feedback, and page entry rather than continuous distraction.

Breakpoints will be verified at narrow mobile, mobile landscape/small tablet, tablet, laptop, and wide desktop widths.

## 10. Stale Closure Prevention

Effects and callbacks will include all semantic dependencies unless a documented stable-ref pattern is intentionally used. Async effects use cancellation or request identity checks. Mutation handlers that derive next state use functional updates.

An automated regression component/hook test will intentionally reproduce the classic stale-closure shape: change state after registering a callback, invoke the callback, and assert that the latest value is observed. The production implementation must pass this test without disabling `react-hooks/exhaustive-deps`.

## 11. Automated Verification

Vitest, React Testing Library, and `@testing-library/user-event` will cover at least:

- auth bootstrap restores a valid cookie session;
- anonymous and non-admin route redirects;
- a protected request returning 401 clears auth state and redirects once without retry loops;
- logout clears identity and legacy storage and Back cannot reveal protected content;
- login/register/contact and admin form validation boundaries;
- malicious HTML is rendered as text and unsafe image protocols are rejected;
- optimistic deletion succeeds and rolls back on failure;
- Error Boundary recovery UI;
- stale-closure regression behavior;
- loading and reduced-motion fallbacks where behavior is significant.

Backend tests will cover authorization, DTO validation, legacy-password migration, expired JWT behavior, safe error responses, antiforgery enforcement, rate limiting at the policy boundary, and injection-like input handling.

Completion requires fresh evidence from:

```text
npm run lint
npm run test -- --run
npm run build
npm audit
dotnet test
dotnet build
dotnet list package --vulnerable --include-transitive
```

Known vulnerable direct and transitive packages will be upgraded to non-vulnerable compatible releases. Major upgrades are avoided unless necessary to clear an applicable advisory.

## 12. Documentation and Repository Hygiene

The root README will be corrected to UTF-8 and updated with architecture, environment setup, user-secrets, run/test commands, auth behavior, and security notes. The generated Vite README will be replaced or removed if redundant.

`.gitignore` will cover frontend environment variants, local development secrets, test coverage, build outputs, IDE artifacts, and generated logs while retaining safe example configuration. Package manifests and lockfiles will change only for dependencies actually used by the design.

## 13. Acceptance Criteria

The design is complete when all of the following are true:

1. Authentication survives reload without exposing a token to JavaScript.
2. Expired authentication produces one deterministic transition to anonymous/login without crashes or loops.
3. Logout removes all sensitive client state and protected content cannot be recovered through Back navigation.
4. Server authorization protects every admin mutation regardless of frontend routing.
5. All user-controlled inputs have server constraints and consistent frontend feedback.
6. SQL access remains parameterized and user content cannot become executable HTML/script.
7. Real API deletes are optimistic and restore state exactly after failure.
8. A component failure renders recovery UI rather than unmounting the entire page to a blank screen.
9. The stale-closure regression test observes current state.
10. Public and admin experiences are usable by keyboard and at the defined responsive widths.
11. Loading and error states exist for every network-dependent screen or mutation.
12. Lint, tests, builds, and dependency audits pass with no unresolved applicable high-severity advisory.
