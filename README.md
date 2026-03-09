# 🍳 Recipe Finder by Ingredients

**Recipe Finder by Ingredients** istifadəçilərə evdə olan ərzaqlara əsasən uyğun reseptlər tapmağa kömək edən **fullstack web tətbiqidir**.

Bu layihə **Code Academy final layihəsi** kimi hazırlanmışdır.

İstifadəçilər sistemə qeydiyyatdan keçə, daxil ola, reseptləri axtara və resept detalları ilə tanış ola bilərlər. Admin panel vasitəsilə isə reseptlər idarə olunur.

---

# 🚀 İstifadə olunan texnologiyalar

## Backend

* **C#**
* **ASP.NET Core Web API**
* **Entity Framework Core**
* **JWT Authentication**
* **Role-based Authorization**
* **SQL Server**

## Frontend

* **React**
* **TypeScript**
* **Tailwind CSS**

## Alətlər

* Visual Studio
* VS Code
* Swagger (API test etmək üçün)
* Git & GitHub

---

# ✨ Əsas funksiyalar

### 👤 Authentication sistemi

* İstifadəçi qeydiyyatı (Register)
* İstifadəçi girişi (Login)
* JWT token ilə identifikasiya
* Role əsaslı icazə sistemi (Admin / User)

### 🔎 Resept axtarışı

* İstifadəçilər ərzaqlara görə resept axtara bilirlər
* Reseptlərin detallı məlumatları göstərilir

### 📖 Admin panel

Admin istifadəçilər aşağıdakı əməliyyatları edə bilər:

* Yeni resept əlavə etmək
* Reseptləri redaktə etmək
* Reseptləri silmək
* Resept məlumatlarını idarə etmək

### 📚 Statik səhifələr

* About Us
* Blog

### 🎨 UI xüsusiyyətləri

* Responsive dizayn
* Tailwind CSS ilə modern interfeys
* Komponent əsaslı struktur

---

# 🗄️ Verilənlər bazası

Layihədə **SQL Server** istifadə olunur.

Əsas cədvəllər:

* Users
* Recipes
* Ingredients
* RecipeIngredients
* Blogs

---

# 📂 Layihə strukturu

```
recipe-finder
│
├── backend
│   ├── Controllers
│   ├── Models
│   ├── DTOs
│   ├── Services
│   └── Data
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   └── types
│
└── README.md
```

---

# 🔐 API Authorization

Bəzi endpoint-lərə daxil olmaq üçün **JWT token** tələb olunur.

Addımlar:

1. Register və ya Login edin
2. Token-i kopyalayın
3. Swagger-də **Authorize** düyməsinə klikləyin
4. Aşağıdakı formada daxil edin:

```
Bearer SIZIN_TOKEN
```

---

# 🎓 Layihənin məqsədi

Bu layihə aşağıdakı bacarıqları inkişaf etdirmək üçün hazırlanmışdır:

* Fullstack web development
* REST API qurulması
* Authentication və Authorization sistemi
* React + TypeScript istifadəsi
* SQL Server ilə database dizaynı

---

# 👨‍💻 Müəllif

**Firudin Maniyev**

Junior Fullstack Developer
