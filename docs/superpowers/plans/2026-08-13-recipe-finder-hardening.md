# Recipe Finder Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure and modernize the existing Recipe Finder application with cookie authentication, resilient global state, validated forms, optimistic real-API CRUD, error containment, responsive UI, and automated regression coverage.

**Architecture:** ASP.NET Core remains the authoritative API and security boundary. React gains a feature-based structure, a Context + `useReducer` auth layer, one credentialed Axios client, shared validation/UI primitives, and Vitest coverage; backend security is covered by an xUnit test project and endpoint integration tests.

**Tech Stack:** React 19, TypeScript, React Router 7, React Hook Form, Axios, Framer Motion, Tailwind CSS 4, Vitest, React Testing Library, ASP.NET Core 8, EF Core 8, SQL Server, xUnit.

## Global Constraints

- Existing React + ASP.NET Core + SQL Server application only; mock API and SEO are excluded.
- Preserve the existing emerald/orange visual identity and all current user-owned content/assets.
- Authentication state uses Context + `useReducer`; do not add Redux.
- JWT must not be readable from browser JavaScript.
- Backend validation and authorization remain authoritative.
- Do not introduce raw or concatenated SQL or `dangerouslySetInnerHTML`.
- Every production change follows a failing-test → minimal implementation → passing-test cycle.
- Do not reset or discard pre-existing user changes.

---

## File Structure

### Backend

- `RecipeFinderAPI/Program.cs`: service registration, cookie JWT extraction, CORS, antiforgery, rate limiting, security headers, middleware order.
- `Controllers/AuthController.cs`: register, cookie login, current user, antiforgery bootstrap, and logout endpoints.
- `Security/PasswordService.cs`: PBKDF2 hashing, legacy SHA-256 verification, and migration signal.
- `Security/SafeImageUrlAttribute.cs`: local/HTTPS image URL validation.
- `DTOs/*.cs`: authoritative request constraints.
- `Middleware/ExceptionMiddleware.cs`: safe RFC-style error envelope and correlation ID.
- `RecipeFinderAPI.Tests/*`: unit and in-memory integration coverage.

### Frontend

- `src/app/*`: provider composition, router, bootstrap, Error Boundary, route transitions.
- `src/features/auth/*`: reducer/context, login/register pages, route guards, auth tests.
- `src/features/recipes/*`: recipe API/pages/forms and tests.
- `src/features/blogs/*`: blog API/pages/forms and tests.
- `src/features/feedback/*`: feedback API/form/admin page and tests.
- `src/features/admin/*`: dashboard/layout/list behavior.
- `src/shared/api/*`: sole Axios instance, error normalization, auth-expiration event.
- `src/shared/lib/*`: safe image path and closure-safe async utilities.
- `src/shared/ui/*`: app loader, skeletons, form fields, error states, buttons.
- `src/test/*`: Vitest DOM setup and reusable render helpers.

---

### Task 1: Establish Safe Dependency and Test Baselines

**Files:**
- Modify: `frontend/recipe-finder-client/package.json`
- Modify: `frontend/recipe-finder-client/vite.config.ts`
- Create: `frontend/recipe-finder-client/src/test/setup.ts`
- Create: `frontend/recipe-finder-client/src/test/smoke.test.tsx`
- Create: `backend/RecipeFinderAPI/RecipeFinderAPI.Tests/RecipeFinderAPI.Tests.csproj`
- Create: `backend/RecipeFinderAPI/RecipeFinderAPI.Tests/Security/BaselineTests.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI.sln`

**Interfaces:**
- Produces: `npm run test`, jsdom test setup, xUnit test project referencing `RecipeFinderAPI`.

- [ ] **Step 1: Add the frontend test command and test dependencies**

Add scripts:

```json
"test": "vitest",
"test:run": "vitest run",
"test:coverage": "vitest run --coverage"
```

Install compatible patched runtime packages and the test/form dependencies:

```powershell
npm install axios@^1.19.0 react-router-dom@^7.18.2 react-hook-form@^7.62.0
npm install --save-dev vite@^7.3.6 vitest@^3.2.4 jsdom@^26.1.0 @testing-library/react@^16.3.0 @testing-library/jest-dom@^6.6.4 @testing-library/user-event@^14.6.1
```

- [ ] **Step 2: Configure Vitest and write a failing smoke test**

Add to `vite.config.ts`:

```ts
/// <reference types="vitest/config" />
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: { environment: "jsdom", setupFiles: "./src/test/setup.ts" },
})
```

Create `setup.ts`:

```ts
import "@testing-library/jest-dom/vitest"
```

Create `smoke.test.tsx` expecting a shared loader that does not exist yet:

```tsx
import { render, screen } from "@testing-library/react"
import { AppLoader } from "../shared/ui/AppLoader"

it("announces application bootstrap", () => {
  render(<AppLoader />)
  expect(screen.getByRole("status", { name: /recipe finder yüklənir/i })).toBeInTheDocument()
})
```

- [ ] **Step 3: Verify the frontend test fails for the missing component**

Run: `npm run test:run -- src/test/smoke.test.tsx`

Expected: FAIL because `../shared/ui/AppLoader` is unresolved.

- [ ] **Step 4: Add the backend test project and failing baseline assertion**

Use a net8.0 xUnit project with `Microsoft.AspNetCore.Mvc.Testing`, `Microsoft.EntityFrameworkCore.InMemory`, and a project reference. Add:

```cs
using RecipeFinderAPI.Helpers;

namespace RecipeFinderAPI.Tests.Security;

public class BaselineTests
{
    [Fact]
    public void NewPasswordHash_IsVersionedAndSalted()
    {
        var first = PasswordHasher.Hash("StrongPass123!");
        var second = PasswordHasher.Hash("StrongPass123!");

        Assert.StartsWith("PBKDF2$", first);
        Assert.NotEqual(first, second);
    }
}
```

Run: `dotnet test RecipeFinderAPI.sln --filter NewPasswordHash_IsVersionedAndSalted`

Expected: FAIL because the current SHA-256 hashes are deterministic and unversioned.

- [ ] **Step 5: Record the baseline without hiding existing failures**

Run `npm run lint`, `npm run build`, and `dotnet build RecipeFinderAPI.sln`; save the observed failures in the task notes and do not weaken lint rules to make them disappear.

- [ ] **Step 6: Commit the test baseline**

```powershell
git add frontend/recipe-finder-client/package.json frontend/recipe-finder-client/package-lock.json frontend/recipe-finder-client/vite.config.ts frontend/recipe-finder-client/src/test backend/RecipeFinderAPI/RecipeFinderAPI.Tests backend/RecipeFinderAPI/RecipeFinderAPI.sln
git commit -m "test: add frontend and backend regression harnesses"
```

### Task 2: Harden Passwords, Validation, and Error Responses

**Files:**
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/Helpers/PasswordHasher.cs`
- Create: `backend/RecipeFinderAPI/RecipeFinderAPI/Validation/SafeImageUrlAttribute.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/DTOs/LoginDto.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/DTOs/RegisterDto.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/DTOs/CreateFeedbackDto.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/DTOs/CreateRecipeDto.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/DTOs/CreateBlogDto.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/DTOs/RecipeSearchDto.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/Helpers/PaginationParams.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/Middleware/ExceptionMiddleware.cs`
- Test: `backend/RecipeFinderAPI/RecipeFinderAPI.Tests/Security/PasswordHasherTests.cs`
- Test: `backend/RecipeFinderAPI/RecipeFinderAPI.Tests/Validation/DtoValidationTests.cs`

**Interfaces:**
- Produces: `PasswordHasher.Hash`, `PasswordHasher.Verify`, `PasswordHasher.IsLegacyHash`, `[SafeImageUrl]`, validation problem responses.

- [ ] **Step 1: Expand failing password tests**

Cover correct/incorrect password verification, unique salts, PBKDF2 prefix, legacy SHA-256 verification, and malformed records returning false without throwing:

```cs
Assert.True(PasswordHasher.Verify("StrongPass123!", hash));
Assert.False(PasswordHasher.Verify("wrong", hash));
Assert.True(PasswordHasher.IsLegacyHash(legacyHash));
Assert.False(PasswordHasher.Verify("x", "PBKDF2$broken"));
```

Run: `dotnet test RecipeFinderAPI.sln --filter PasswordHasherTests`

Expected: FAIL because the new API does not exist.

- [ ] **Step 2: Implement versioned PBKDF2 with legacy verification**

Use `Rfc2898DeriveBytes.Pbkdf2` with SHA-256, a 16-byte random salt, 32-byte subkey, at least 210,000 iterations, and `CryptographicOperations.FixedTimeEquals`. Store:

```text
PBKDF2$210000$<base64-salt>$<base64-subkey>
```

Keep deterministic SHA-256 generation private and only for verifying pre-existing records.

- [ ] **Step 3: Write DTO validation tests before changing DTOs**

Use `Validator.TryValidateObject` to assert rejection of whitespace-only fields, malformed email, weak/oversized password, empty or duplicate ingredients, out-of-range cooking time/page values, unknown difficulty/sort values, `javascript:` image URLs, and overlong feedback/blog text.

Run: `dotnet test RecipeFinderAPI.sln --filter DtoValidationTests`

Expected: FAIL for constraints that are currently absent.

- [ ] **Step 4: Implement explicit validation attributes**

Use `[Required]`, `[StringLength]`, `[EmailAddress]`, `[RegularExpression]`, `[Range]`, `[MinLength]`, and `[SafeImageUrl]`. Implement `IValidatableObject` for trimmed non-empty values, ingredient uniqueness/count, and allowlists:

```cs
private static readonly HashSet<string> Difficulties =
    new(StringComparer.OrdinalIgnoreCase) { "Çox asan", "Asan", "Orta", "Çətin", "Çox çətin" };
```

- [ ] **Step 5: Make exception output safe**

Return a generic 500 object with `statusCode`, `message`, and `traceId`; log the exception through `ILogger<ExceptionMiddleware>`. Preserve explicit 404 messages but never serialize arbitrary `ex.Message` for 500 responses.

- [ ] **Step 6: Run backend tests and commit**

Run: `dotnet test RecipeFinderAPI.sln`

Expected: PASS.

```powershell
git add backend/RecipeFinderAPI
git commit -m "fix: harden passwords validation and API errors"
```

### Task 3: Implement Cookie Authentication, CSRF, Authorization, and Rate Limits

**Files:**
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/Program.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/Controllers/AuthController.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/Controllers/RecipesController.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/Services/JwtService.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/appsettings.json`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/appsettings.Development.json`
- Create: `backend/RecipeFinderAPI/RecipeFinderAPI/Contracts/AuthUserResponse.cs`
- Test: `backend/RecipeFinderAPI/RecipeFinderAPI.Tests/Auth/AuthFlowTests.cs`
- Test: `backend/RecipeFinderAPI/RecipeFinderAPI.Tests/Auth/AuthorizationTests.cs`

**Interfaces:**
- Produces: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`, `GET /api/auth/csrf`, cookie name `recipe_finder_auth`, antiforgery header `X-CSRF-TOKEN`.

- [ ] **Step 1: Write failing in-memory endpoint tests**

Using `WebApplicationFactory<Program>`, assert:

```cs
Assert.Contains("recipe_finder_auth=", login.Headers.GetValues("Set-Cookie").Single());
Assert.Contains("httponly", cookie, StringComparison.OrdinalIgnoreCase);
Assert.Equal(HttpStatusCode.Unauthorized, expiredMe.StatusCode);
Assert.Equal(HttpStatusCode.Forbidden, userDelete.StatusCode);
Assert.Equal(HttpStatusCode.Unauthorized, anonymousDelete.StatusCode);
```

Also assert login upgrades a legacy hash, logout expires the cookie, invalid credentials use one generic message, and a protected mutation without the CSRF header is rejected.

Run: `dotnet test RecipeFinderAPI.sln --filter "AuthFlowTests|AuthorizationTests"`

Expected: FAIL because cookie/me/logout/CSRF behavior and recipe update/delete authorization are absent.

- [ ] **Step 2: Configure JWT cookie extraction and exact CORS**

In `JwtBearerEvents.OnMessageReceived`, read only `recipe_finder_auth`. Configure allowed origins from `Frontend:Origins`, call `AllowCredentials`, and keep issuer/audience/lifetime/signing-key validation enabled with a small clock skew.

- [ ] **Step 3: Implement login, current-user, CSRF, and logout**

Login verifies PBKDF2 or legacy hash, migrates legacy records, writes the secure cookie, and returns only public user data. `/me` uses `[Authorize]`. Logout expires the same cookie even if the token is already invalid. `/csrf` emits antiforgery tokens for the Axios header.

- [ ] **Step 4: Protect every admin mutation**

Ensure `[Authorize(Roles = "Admin")]` is present on recipe POST/PUT/DELETE, blog POST/PUT/DELETE, and feedback GET/DELETE. Add antiforgery validation to authenticated mutation endpoints.

- [ ] **Step 5: Add rate-limit policies and security headers**

Use fixed-window policies for login, register, and feedback. Return 429 with a generic JSON response. Add `X-Content-Type-Options`, `Referrer-Policy`, and a restrictive `Permissions-Policy`; remove duplicate registrations/usings/middleware in `Program.cs`.

- [ ] **Step 6: Move secrets out of committed settings**

Leave non-secret issuer/audience and placeholder-free configuration shape in tracked files. Require `Jwt__Key` and `ConnectionStrings__DefaultConnection` through environment variables or user-secrets, and fail startup with a clear configuration exception when the JWT key is absent/too short.

- [ ] **Step 7: Run focused and full backend tests, then commit**

Run: `dotnet test RecipeFinderAPI.sln` and `dotnet build RecipeFinderAPI.sln`

Expected: both PASS.

```powershell
git add backend/RecipeFinderAPI
git commit -m "feat: secure authentication with http-only cookies"
```

### Task 4: Build the Frontend App Shell, Global Auth State, and Safe API Client

**Files:**
- Create: `frontend/recipe-finder-client/src/shared/api/client.ts`
- Create: `frontend/recipe-finder-client/src/shared/api/errors.ts`
- Create: `frontend/recipe-finder-client/src/features/auth/authTypes.ts`
- Create: `frontend/recipe-finder-client/src/features/auth/authReducer.ts`
- Create: `frontend/recipe-finder-client/src/features/auth/AuthContext.tsx`
- Create: `frontend/recipe-finder-client/src/features/auth/ProtectedRoute.tsx`
- Create: `frontend/recipe-finder-client/src/features/auth/AdminRoute.tsx`
- Create: `frontend/recipe-finder-client/src/app/AppProviders.tsx`
- Create: `frontend/recipe-finder-client/src/app/router/AppRouter.tsx`
- Create: `frontend/recipe-finder-client/src/shared/ui/AppLoader.tsx`
- Modify: `frontend/recipe-finder-client/src/App.tsx`
- Modify: `frontend/recipe-finder-client/src/main.tsx`
- Delete after migration: `frontend/recipe-finder-client/src/api/axios.ts`
- Delete after migration: `frontend/recipe-finder-client/src/services/api.ts`
- Test: `frontend/recipe-finder-client/src/features/auth/authReducer.test.ts`
- Test: `frontend/recipe-finder-client/src/features/auth/AuthContext.test.tsx`
- Test: `frontend/recipe-finder-client/src/features/auth/routeGuards.test.tsx`

**Interfaces:**
- Consumes: backend auth endpoints from Task 3.
- Produces: `api`, `setUnauthorizedHandler`, `AuthProvider`, `useAuth`, `ProtectedRoute`, `AdminRoute`, `AppLoader`.

- [ ] **Step 1: Write reducer and route-guard tests first**

Assert the exact state transitions `CHECK_START`, `AUTHENTICATED`, and `ANONYMOUS`. Render guards in a memory router and verify checking shows a loader, anonymous redirects with `replace`, and non-admin users reach `/forbidden`.

Run: `npm run test:run -- src/features/auth`

Expected: FAIL because the auth feature does not exist.

- [ ] **Step 2: Write the 401 loop regression test**

Mock two 401 responses and assert the registered unauthorized handler runs once, neither request is retried, and `/auth/login` plus `/auth/me` expected 401s do not trigger navigation.

```ts
expect(onUnauthorized).toHaveBeenCalledTimes(1)
expect(adapter).toHaveBeenCalledTimes(2)
```

- [ ] **Step 3: Implement the sole Axios client**

Read the base URL from `VITE_API_URL` with a safe localhost development fallback, enable `withCredentials`, obtain/send the antiforgery token for mutations, attach no browser-stored bearer token, and normalize API/network errors. Use a latch reset after a successful login so repeated expired requests cannot cause a loop.

- [ ] **Step 4: Implement Context + reducer session bootstrap**

On mount, call `/auth/me`, then dispatch authenticated or anonymous. Login calls `/auth/login`; logout calls `/auth/logout` and always clears reducer plus legacy `token`, `role`, and `username` keys from both storage APIs in `finally`.

- [ ] **Step 5: Compose providers/router and implement the entrance loader**

`AppLoader` must use `role="status"`, display the existing logo, include reduced-motion-safe animation, and satisfy Task 1's smoke test. Put public and admin routes under the new router; move the wildcard route last and add `/forbidden` plus generic failure UI.

- [ ] **Step 6: Replace all imports of the duplicate API clients**

Run `rg -n 'api/axios|services/api' src`; update every match to `shared/api/client`, then delete both old clients. Run the search again and expect no matches.

- [ ] **Step 7: Verify auth behavior and commit**

Run: `npm run test:run -- src/features/auth src/test/smoke.test.tsx`, `npm run lint`, and `npm run build`.

Expected: PASS.

```powershell
git add frontend/recipe-finder-client
git commit -m "feat: add resilient global authentication state"
```

### Task 5: Migrate Features and Standardize Validated Forms

**Files:**
- Move/modify: `frontend/recipe-finder-client/src/pages/LoginPage.tsx` → `src/features/auth/pages/LoginPage.tsx`
- Move/modify: `frontend/recipe-finder-client/src/pages/RegisterPage.tsx` → `src/features/auth/pages/RegisterPage.tsx`
- Move/modify recipe public/admin pages into `src/features/recipes/pages/`
- Move/modify blog public/admin pages into `src/features/blogs/pages/`
- Move/modify contact/admin feedback pages into `src/features/feedback/pages/`
- Move/modify dashboard/layout into `src/features/admin/`
- Move: `src/types/*` into the owning feature or `src/shared/types/`
- Create: `frontend/recipe-finder-client/src/shared/ui/FormField.tsx`
- Create: `frontend/recipe-finder-client/src/shared/ui/SubmitButton.tsx`
- Create: `frontend/recipe-finder-client/src/features/auth/validation.ts`
- Create: `frontend/recipe-finder-client/src/features/recipes/validation.ts`
- Create: `frontend/recipe-finder-client/src/features/blogs/validation.ts`
- Create: `frontend/recipe-finder-client/src/features/feedback/validation.ts`
- Test: `frontend/recipe-finder-client/src/features/*/validation.test.ts`

**Interfaces:**
- Produces: typed `LoginInput`, `RegisterInput`, `RecipeFormInput`, `BlogFormInput`, `FeedbackFormInput`, shared accessible form controls.

- [ ] **Step 1: Write boundary tests for validation rules**

Test empty/whitespace fields, username length/charset, valid and invalid emails, password boundaries, message/title/content lengths, cooking time, difficulty allowlist, ingredient trimming/deduplication, and safe image URLs.

```ts
expect(validateImageUrl("javascript:alert(1)")).toBe("Şəkil ünvanı təhlükəsiz deyil")
expect(normalizeIngredients("Pomidor, pomidor, Soğan")).toEqual(["Pomidor", "Soğan"])
```

Run: `npm run test:run -- src/features --testNamePattern validation`

Expected: FAIL because shared validators do not exist.

- [ ] **Step 2: Implement pure rule helpers and accessible field primitives**

Keep transformations pure and export them for React Hook Form. `FormField` connects label, control ID, error ID, `aria-invalid`, and `aria-describedby`. `SubmitButton` always uses `type="submit"`, disables while pending, and includes a visible/announced progress state.

- [ ] **Step 3: Convert auth and contact forms to React Hook Form**

Use `useForm<T>({ mode: "onBlur" })`, `register`, `handleSubmit`, and `setError` for server problems. Login delegates persistence to `useAuth`; no page reads or writes auth storage directly.

- [ ] **Step 4: Convert recipe/blog create and edit forms**

Share each feature's form component between create/edit modes. Initial edit loading renders a skeleton; failed loads show Retry; submit is locked until the server responds. Convert comma-separated ingredients with `normalizeIngredients` before the API call.

- [ ] **Step 5: Complete feature-based moves and fix route/import boundaries**

Use `git mv` for existing files so history remains visible. Keep public layout primitives in `shared/ui/layout`. Delete empty legacy folders and remove the unused `ProtectedRoute` implementation that reads `localStorage`.

- [ ] **Step 6: Run tests, lint, and build; commit**

Run: `npm run test:run`, `npm run lint`, `npm run build`.

Expected: PASS with no `any`, unused imports, or hook dependency warnings.

```powershell
git add frontend/recipe-finder-client
git commit -m "refactor: organize features and validate forms"
```

### Task 6: Add Optimistic Real-API CRUD and Stale-Closure Protection

**Files:**
- Create/modify: `frontend/recipe-finder-client/src/features/recipes/api.ts`
- Create/modify: `frontend/recipe-finder-client/src/features/blogs/api.ts`
- Create/modify: `frontend/recipe-finder-client/src/features/feedback/api.ts`
- Modify: admin list pages in their feature folders
- Create: `frontend/recipe-finder-client/src/shared/lib/useLatest.ts`
- Test: `frontend/recipe-finder-client/src/features/admin/optimisticDelete.test.tsx`
- Test: `frontend/recipe-finder-client/src/shared/lib/useLatest.test.tsx`

**Interfaces:**
- Produces: abortable feature API calls, rollback-safe delete handlers, `useLatest<T>(value): MutableRefObject<T>`.

- [ ] **Step 1: Write optimistic success and rollback tests**

Render an admin list with three records. On confirmation, assert the selected row disappears before the request settles. Resolve and assert it remains absent; in a second test reject and assert it returns at the exact original index with one error toast.

- [ ] **Step 2: Write the intentional stale-closure regression test**

Register a callback while state is `0`, update to `1`, invoke the previously registered callback, and assert it observes `1` through `useLatest` or a dependency-correct callback:

```ts
expect(observed).toEqual([1])
```

The test must fail against a callback that captures the initial value.

- [ ] **Step 3: Implement closure-safe API/list state**

Use functional state updates and capture `{ item, index }` before optimistic removal. Restore with a new array insertion on failure. Track pending IDs in a `Set<number>` state so duplicate deletes are disabled without blocking unrelated rows.

- [ ] **Step 4: Add abort and request-order safeguards**

Feature GET calls accept `AbortSignal`. Effects abort on cleanup and ignore Axios cancellation. Search/list code increments a request ID and applies results only when the response belongs to the latest request.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:run -- src/features/admin src/shared/lib`, `npm run lint`, and `npm run build`.

Expected: PASS.

```powershell
git add frontend/recipe-finder-client
git commit -m "feat: add rollback-safe optimistic admin CRUD"
```

### Task 7: Contain Errors and Finish Loading/Responsive UI

**Files:**
- Create: `frontend/recipe-finder-client/src/app/errors/AppErrorBoundary.tsx`
- Create: `frontend/recipe-finder-client/src/shared/ui/AsyncState.tsx`
- Create: `frontend/recipe-finder-client/src/shared/ui/PageSkeleton.tsx`
- Create: `frontend/recipe-finder-client/src/shared/ui/RouteTransition.tsx`
- Create: `frontend/recipe-finder-client/src/shared/lib/safeImageUrl.ts`
- Modify: `frontend/recipe-finder-client/src/shared/ui/layout/Navbar.tsx`
- Modify: `frontend/recipe-finder-client/src/shared/ui/layout/Layout.tsx`
- Modify: `frontend/recipe-finder-client/src/features/admin/AdminLayout.tsx`
- Modify: public and admin feature pages for shared loading/error primitives
- Modify: `frontend/recipe-finder-client/src/index.css`
- Modify: `frontend/recipe-finder-client/index.html`
- Test: `frontend/recipe-finder-client/src/app/errors/AppErrorBoundary.test.tsx`
- Test: `frontend/recipe-finder-client/src/shared/lib/safeImageUrl.test.ts`

**Interfaces:**
- Produces: branded render-error recovery, consistent async states, safe image URL normalization, responsive route shell.

- [ ] **Step 1: Write failing Error Boundary and XSS-safety tests**

Render a component that throws and assert Reload/Home recovery actions are visible. Render `<img src=x onerror=alert(1)>` as content and assert it stays text. Assert `javascript:`, `data:`, and protocol-relative image sources return the placeholder while `/images/a.jpg` and HTTPS URLs are allowed.

- [ ] **Step 2: Implement Error Boundary and safe URL helper**

Use a class boundary with `getDerivedStateFromError`; log details only in development. `safeImageUrl` returns `/images/placeholder.jpg` unless the value is a normalized local path or parseable HTTPS URL.

- [ ] **Step 3: Standardize async visual states**

Replace full-page text-only loading with shape-matched skeletons. Admin dashboard/list/edit pages gain initial loading, retry, empty, mutation-pending, and network-error states. Images use fixed aspect-ratio containers and lazy loading below the fold.

- [ ] **Step 4: Refine responsive public/admin shells**

Use a single mobile menu state source, route-aware `NavLink` styling, body-scroll locking only while drawers are open, Escape-to-close, 44px controls, `aria-expanded`, `aria-controls`, and a backdrop. Admin content uses `min-w-0`, mobile cards below `md`, and overflow-safe tables at larger widths.

- [ ] **Step 5: Add reduced-motion entrance and route transitions**

Use Framer Motion's reduced-motion support. Keep the bootstrap animation under one second, stop continuous decorative animation for reduced-motion users, and avoid re-running the full splash on every route.

- [ ] **Step 6: Add baseline CSP and semantic document metadata**

Set `<html lang="az">`, a viewport-safe document, and a CSP compatible with the known API/image/font origins. Ensure all external `_blank` links include `rel="noopener noreferrer"`.

- [ ] **Step 7: Test responsive behavior manually and run automation**

Verify at 360×800, 430×932, 768×1024, 1024×768, 1440×900. Check navbar/admin drawer, forms, cards, tables, long text, keyboard focus, reduced motion, loaders, and error recovery.

Run: `npm run test:run`, `npm run lint`, `npm run build`.

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add frontend/recipe-finder-client
git commit -m "feat: add resilient responsive application experience"
```

### Task 8: Remove Vulnerabilities and Finish Repository Documentation

**Files:**
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/RecipeFinderAPI.csproj`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/Services/RecipeService.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/Services/BlogService.cs`
- Modify: `backend/RecipeFinderAPI/RecipeFinderAPI/Services/FeedbackService.cs`
- Create: `backend/RecipeFinderAPI/RecipeFinderAPI/Mappings/EntityMappings.cs`
- Delete: `backend/RecipeFinderAPI/RecipeFinderAPI/Mappings/MappingProfile.cs`
- Test: `backend/RecipeFinderAPI/RecipeFinderAPI.Tests/Mappings/EntityMappingsTests.cs`
- Modify: `frontend/recipe-finder-client/package.json`
- Modify: `frontend/recipe-finder-client/package-lock.json`
- Modify: `.gitignore`
- Modify: `README.md`
- Modify: `frontend/recipe-finder-client/README.md`
- Create: `frontend/recipe-finder-client/.env.example`

**Interfaces:**
- Produces: reproducible setup with no committed secrets and no applicable high-severity dependency advisory.

- [ ] **Step 1: Run audits before dependency changes**

Run:

```powershell
npm audit --json
dotnet list RecipeFinderAPI.sln package --vulnerable --include-transitive
```

Expected baseline: vulnerable Axios/React Router/Vite chains and the AutoMapper advisory identified during design.

- [ ] **Step 2: Remove vulnerable AutoMapper and keep explicit field parity**

Write mapping tests asserting every Recipe, Blog, and Feedback entity field exposed by its DTO. Add explicit `ToDto` and `Apply` extension methods in `EntityMappings.cs`, replace service `_mapper` calls, remove `MappingProfile.cs`, remove `AddAutoMapper` from `Program.cs`, and remove `AutoMapper.Extensions.Microsoft.DependencyInjection` from the project. Run the mapping tests and expect PASS.

- [ ] **Step 3: Keep frontend dependencies on audited patched versions**

Keep the Task 1 Axios, React Router, and Vite floors, regenerate the lockfile through `npm install`, and use `npm audit` to confirm the resolved tree rather than relying only on manifest ranges.

- [ ] **Step 4: Update repository hygiene**

Ignore `.env.*` except `.env.example`, `coverage/`, `.coverage`, TestResults, local user-secrets exports, generated logs, and normal build outputs. Do not ignore tracked source configuration examples.

- [ ] **Step 5: Rewrite setup/run/security documentation**

Document exact frontend/backend prerequisites, `dotnet user-secrets set` commands, environment variables, migrations, start commands, test commands, cookie auth flow, admin authorization, CSRF behavior, and the fact that EF Core parameterization plus output encoding are the SQL Injection/XSS controls.

- [ ] **Step 6: Run the complete verification matrix**

Run:

```powershell
npm run lint
npm run test:run
npm run build
npm audit
dotnet test RecipeFinderAPI.sln
dotnet build RecipeFinderAPI.sln
dotnet list RecipeFinderAPI.sln package --vulnerable --include-transitive
```

Expected: every command exits 0; no applicable high-severity advisory remains.

- [ ] **Step 7: Inspect final diffs and commit**

Run `git diff --check`, `git status --short`, and `git diff --stat`. Confirm no secrets, generated build output, or unrelated user files are included.

```powershell
git add .gitignore README.md frontend/recipe-finder-client backend/RecipeFinderAPI
git commit -m "chore: document and verify hardened application"
```

---

## Plan Self-review

- Every design requirement maps to Tasks 2–8.
- Auth types and endpoint names are consistent across backend and frontend tasks.
- Mock API and SEO remain excluded.
- Each implementation task starts with a failing regression test and ends with focused verification.
- The final task includes dependency, lint, test, build, secret, and diff checks.
