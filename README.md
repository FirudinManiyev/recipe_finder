# Recipe Finder

Recipe Finder evdə olan ərzaqlara əsasən resept tapmağa kömək edən React + ASP.NET Core tətbiqidir. İstifadəçilər qeydiyyatdan keçə, sessiyanı səhifə yenilənəndə qoruya və reseptləri axtara bilirlər. Admin istifadəçilər resept, bloq və rəyləri qorunan paneldən idarə edirlər.

## Texnologiyalar

- Frontend: React 19, TypeScript, Vite, React Router, Context + `useReducer`, React Hook Form, Tailwind CSS
- Backend: ASP.NET Core 8 Web API, Entity Framework Core, SQL Server
- Test: Vitest, React Testing Library, xUnit

## Təhlükəsizlik

- JWT brauzerin JavaScript yaddaşında deyil, `HttpOnly`, `Secure`, `SameSite=Strict` cookie-də saxlanılır.
- Dəyişiklik edən qorunan sorğular anti-CSRF tokeni tələb edir.
- Login və feedback endpoint-lərində rate limit var.
- Admin CRUD endpoint-ləri rol əsaslı authorization ilə qorunur.
- Şifrələr PBKDF2 (unikal salt, 210 000 iterasiya) ilə saxlanılır; köhnə SHA-256 hash-lər uğurlu login zamanı avtomatik yenilənir.
- DTO və frontend form validasiyası, təhlükəsiz şəkil URL yoxlaması və ümumi təhlükəsiz error cavabları mövcuddur.
- EF Core parametrli sorğulardan istifadə edir; raw SQL yoxdur. UI mətnləri React vasitəsilə escape olunur və `dangerouslySetInnerHTML` istifadə edilmir.

## Lokal quraşdırma

Tələblər: .NET 8 SDK, Node.js, npm və SQL Server.

### Backend

```powershell
cd backend/RecipeFinderAPI/RecipeFinderAPI
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=.\\SQLEXPRESS;Database=RecipeFinderDb;Trusted_Connection=True;TrustServerCertificate=True;"
dotnet user-secrets set "Jwt:Key" "ən-azı-32-simvoldan-ibarət-lokal-gizli-açar"
cd ../../..
dotnet tool restore
dotnet tool run dotnet-ef database update --project backend/RecipeFinderAPI/RecipeFinderAPI --startup-project backend/RecipeFinderAPI/RecipeFinderAPI
cd backend/RecipeFinderAPI/RecipeFinderAPI
dotnet run --launch-profile https
```

`Jwt:Key` və connection string repozitoriyaya yazılmamalıdır. Development API ünvanı standart olaraq `https://localhost:7192`-dir; Vite `/api` sorğularını bu ünvana proxy edir.

### Frontend

```powershell
cd frontend/recipe-finder-client
Copy-Item .env.example .env
npm ci
npm run dev
```

Frontend standart olaraq `http://localhost:5173` ünvanında açılır.

Production deploy üçün frontend və API eyni origin-də saxlanılmalı, reverse proxy `/api` yolunu backend-ə ötürməlidir. Bu, `SameSite=Strict` cookie və `connect-src 'self'` CSP kontraktıdır. Ayrı origin/top-level site seçilərsə CORS, CSP və cookie siyasəti birlikdə yenidən konfiqurasiya edilməlidir.

Reverse proxy istifadə olunursa onun daxili IP ünvanını `ReverseProxy__KnownProxies__0` (davamı üçün `__1`, `__2`) environment dəyişənləri ilə backend-ə verin. Yalnız etibar etdiyiniz proxy IP-lərini əlavə edin; rate limit real client IP-ni yalnız bu siyahıdan gələn `X-Forwarded-For` başlığından qəbul edir.

## Keyfiyyət yoxlamaları

```powershell
# Frontend
cd frontend/recipe-finder-client
npm run lint
npm run test:run
npm run build
npm audit

# Backend
cd ../../backend/RecipeFinderAPI
dotnet test RecipeFinderAPI.sln -c Release
dotnet list RecipeFinderAPI.sln package --vulnerable --include-transitive
```

## Əsas struktur

```text
backend/RecipeFinderAPI/
  RecipeFinderAPI/          API və data layer
  RecipeFinderAPI.Tests/    security, auth və validation testləri
frontend/recipe-finder-client/src/
  app/                      tətbiq səviyyəli error handling
  features/                 auth, recipe və blog funksiyaları
  shared/                   API client, UI və ümumi util-lər
  pages/                    route səhifələri
  routes/                   public/protected/admin route-lar
docs/superpowers/            dizayn və icra planı
```

## Auth axını

Login cavabı tokeni body-də qaytarmır. Server `HttpOnly` cookie yaradır və yalnız sessiyanın təhlükəsiz bitmə vaxtını (`expiresAtUtc`) cavabda paylaşır; frontend refresh zamanı `/api/auth/me` sorğusu ilə sessiyanı bərpa edib həmin vaxta taymer qurur. Sessiya boş dayansa belə vaxt bitən kimi həssas state təmizlənir və istifadəçi bir dəfə login səhifəsinə yönləndirilir. Gecikmiş sorğudan gələn `401` eyni axının ehtiyat qorumasıdır və təkrar logout dövrəsi yaratmır. Logout tarixçədəki qorunan səhifələrin yenidən açılmasına imkan vermir.

## Müəllif

Firudin Maniyev
