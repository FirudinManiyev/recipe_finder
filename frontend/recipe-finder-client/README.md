# Recipe Finder Client

Frontend React 19, TypeScript və Vite ilə qurulub. Auth state Context + `useReducer`, form state React Hook Form, naviqasiya React Router vasitəsilə idarə olunur.

## Komandalar

```powershell
npm ci
npm run dev
npm run lint
npm run test:run
npm run build
npm audit
```

Development server `/api` sorğularını standart olaraq `https://localhost:7192` ünvanına proxy edir. `.env.example` faylını `.env` kimi kopyalamaq kifayətdir.

Production-da frontend və API eyni origin altında yerləşdirilməlidir: reverse proxy `/api` yolunu ASP.NET API-yə ötürməlidir. Bu quruluş `SameSite=Strict` auth cookie-si və sərt `connect-src 'self'` CSP ilə uyğun işləyir. Ayrı origin zəruridirsə, CSP, backend-in dəqiq CORS origin-i və cookie `SameSite` siyasəti birlikdə, CSRF qorunması saxlanılmaqla dəyişdirilməlidir.
