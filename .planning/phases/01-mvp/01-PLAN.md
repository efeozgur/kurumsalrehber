---
phase: 1
plan: 1
type: full
wave: 1-3
depends_on: []
files_modified:
  - apps/api/package.json
  - apps/api/tsconfig.json
  - apps/api/prisma/schema.prisma
  - apps/api/src/main.ts
  - apps/api/src/modules/auth/auth.module.ts
  - apps/api/src/modules/auth/auth.controller.ts
  - apps/api/src/modules/auth/auth.service.ts
  - apps/api/src/modules/auth/jwt.strategy.ts
  - apps/api/src/modules/auth/jwt-auth.guard.ts
  - apps/api/src/modules/contacts/contacts.module.ts
  - apps/api/src/modules/contacts/contacts.controller.ts
  - apps/api/src/modules/contacts/contacts.service.ts
  - apps/api/src/modules/departments/departments.module.ts
  - apps/api/src/modules/departments/departments.controller.ts
  - apps/api/src/modules/departments/departments.service.ts
  - apps/api/src/modules/upload/upload.module.ts
  - apps/api/src/modules/upload/upload.controller.ts
  - apps/api/src/modules/upload/upload.service.ts
  - apps/api/src/prisma/prisma.module.ts
  - apps/api/src/prisma/prisma.service.ts
  - apps/api/src/common/decorators/public.decorator.ts
  - apps/api/src/common/filters/http-exception.filter.ts
  - apps/api/src/common/interceptors/transform.interceptor.ts
  - apps/api/src/seed.ts
  - apps/api/uploads/
  - apps/web/package.json
  - apps/web/next.config.js
  - apps/web/src/app/layout.tsx
  - apps/web/src/app/page.tsx
  - apps/web/src/app/(public)/page.tsx
  - apps/web/src/app/(admin)/layout.tsx
  - apps/web/src/app/(admin)/page.tsx
  - apps/web/src/app/(admin)/contacts/page.tsx
  - apps/web/src/app/(admin)/contacts/new/page.tsx
  - apps/web/src/app/(admin)/contacts/[id]/page.tsx
  - apps/web/src/app/(admin)/departments/page.tsx
  - apps/web/src/app/(admin)/departments/new/page.tsx
  - apps/web/src/app/(admin)/departments/[id]/page.tsx
  - apps/web/src/app/(admin)/login/page.tsx
  - apps/web/src/app/(admin)/setup/page.tsx
  - apps/web/src/app/(admin)/users/page.tsx
  - apps/web/src/components/ui/
  - apps/web/src/components/contacts/contact-card.tsx
  - apps/web/src/components/contacts/contact-list.tsx
  - apps/web/src/components/contacts/contact-search.tsx
  - apps/web/src/lib/api.ts
  - apps/web/src/lib/auth.ts
  - apps/web/src/types/index.ts
  - package.json
  - turbo.json
autonomous: true
requirements:
  - REQ-01
  - REQ-02
  - REQ-03
  - REQ-04
  - REQ-05
  - REQ-06
---

## PLANNING COMPLETE

All plans for Phase 1 (MVP) have been created. The plan below is organized in waves for parallel execution.

---

## Objective

Faz 1 MVP — Çalışan bir telefon rehberi sistemi kurulumu. Halka açık arama sayfası, admin paneli (JWT auth), kişi/birim CRUD, fotoğraf yükleme, seed data.

---

## Tasks

### Wave 1 — Proje İskeleti ve Veritabanı

#### Task 1.1: Monorepo ve Turborepo Kurulumu

<read_first>
- package.json (root)
- turbo.json
</read_first>

<action>
1. Root `package.json` oluştur: Turborepo + pnpm workspaces
2. `turbo.json` oluştur: pipeline tanımları (dev, build, lint)
3. `apps/api/package.json` oluştur: NestJS, Prisma, bcrypt, @nestjs/jwt, @nestjs/passport, passport-jwt, multer, class-validator, class-transformer, @nestjs/swagger
4. `apps/web/package.json` oluştur: Next.js 14, tailwindcss, shadcn/ui, recharts, lucide-react
5. `pnpm install` çalıştır
</action>

<acceptance_criteria>
- root `package.json`'da `"workspaces": ["apps/*", "packages/*"]` var
- `turbo.json`'da `dev`, `build`, `lint` pipeline'ları tanımlı
- `pnpm dev` komutu her iki app'i de başlatabiliyor
- `apps/api` NestJS ile çalışıyor, `apps/web` Next.js ile çalışıyor
</acceptance_criteria>

---

#### Task 1.2: Prisma Şeması ve Migration

<read_first>
- .planning/ARCHITECTURE.md (veritabanı şeması)
</read_first>

<action>
1. `apps/api/prisma/schema.prisma` oluştur:
   - Provider: sqlite, db: `file:./dev.db`
   - Model Contact: id, firstName, lastName, title, phoneInternal, phoneMobile, email, avatar (String?), departmentId (Int?), isFav (Boolean default false, MVP'de UI'da kullanılmayacak ama modelde olsun), createdAt, updatedAt
   - Model Department: id, name (unique), parentId (Int? — modelde var ama MVP'de kullanılmayacak), createdAt, updatedAt
   - Model User: id, username (unique), password (hash), role (String default "ADMIN"), createdAt, updatedAt
2. `apps/api/src/prisma/prisma.service.ts` — PrismaClient singleton
3. `apps/api/src/prisma/prisma.module.ts` — Global module olarak export
4. `npx prisma migrate dev --name init` çalıştır
</action>

<acceptance_criteria>
- `schema.prisma`'da Contact, Department, User modelleri tanımlı
- Provider sqlite, db path `file:./dev.db`
- Migration başarıyla çalışıyor, `dev.db` dosyası oluşuyor
- `prisma.service.ts` ve `prisma.module.ts` NestJS modül yapısına uygun
</acceptance_criteria>

---

#### Task 1.3: Backend Proje İskeleti

<read_first>
- apps/api/src/main.ts
- apps/api/tsconfig.json
</read_first>

<action>
1. `apps/api/tsconfig.json` — NestJS standart config + decorator desteği
2. `apps/api/src/main.ts` — NestJS bootstrap:
   - PrismaModule global import
   - Swagger setup (`/api/docs`)
   - CORS enabled (LAN erişimi için)
   - Static files serving for `/uploads` (Multer yüklenen dosyalar)
   - ValidationPipe global
   - Port: 3001
3. Express adapter ile NestFactory.create
4. `apps/api/src/common/decorators/public.decorator.ts` — @Public() decorator (JWT skip)
5. `apps/api/src/common/filters/http-exception.filter.ts` — Global exception filter (Türkçe hata mesajları)
6. `apps/api/src/common/interceptors/transform.interceptor.ts` — Response transform (wrap in { data, meta })
</action>

<acceptance_criteria>
- `npm run start:dev` ile NestJS 3001 portunda çalışıyor
- `GET /api/docs` Swagger UI gösteriyor
- Static files `/uploads` path'inden servis ediliyor
- ValidationPipe body validation çalışıyor
- Global filter Türkçe hata mesajı döndürüyor
</acceptance_criteria>

---

#### Task 1.4: Frontend Proje İskeleti

<read_first>
- apps/web/next.config.js
- apps/web/src/app/layout.tsx
</read_first>

<action>
1. `apps/web/next.config.js` — API proxy (`/api` → `http://localhost:3001/api`)
2. TailwindCSS kurulumu + shadcn/ui init
3. Root layout: Inter font, metadata (Türkçe başlık)
4. Apps arası tipler için `apps/web/src/types/index.ts` — Contact, Department, User interface'leri (Prisma şemasıyla uyumlu)
5. `apps/web/src/lib/api.ts` — Axios/fetch wrapper: base URL, auth header interceptor, hata handling
6. `apps/web/src/lib/auth.ts` — Token storage (localStorage), login/logout helpers, auth context
</action>

<acceptance_criteria>
- `pnpm dev` web app'i başlatıyor
- TailwindCSS class'ları çalışıyor
- `shadcn/ui` buton, input, card, dialog gibi temel bileşenler import edilebiliyor
- API proxy `/api` → backend 3001 portuna yönlendirme yapıyor
- TypeScript tipleri backend Prisma şemasıyla uyumlu
</acceptance_criteria>

---

### Wave 2 — Backend API ve Auth (Wave 1 bittiğinde başlar)

#### Task 2.1: Auth Modülü

<read_first>
- .planning/phases/01-mvp/01-CONTEXT.md (D-06: setup ekranı)
</read_first>

<action>
1. `auth.module.ts` — JwtModule.register, PassportModule
2. `auth.service.ts`:
   - `setup(username, password)` — İlk admin oluşturma. Eğer User tablosunda hiç kayıt yoksa çalışır. Varsa 403 döner.
   - `login(username, password)` — JWT access token döner
   - `validateUser(username, password)` — bcrypt ile hash karşılaştırma
   - `getUsers()` — Admin kullanıcı listesi
   - `createUser(username, password, role)` — Yeni admin ekleme
3. `auth.controller.ts`:
   - `POST /api/auth/setup` — İlk kurulum
   - `POST /api/auth/login` — Giriş
   - `GET /api/auth/me` — Token sahibi bilgisi
   - `GET /api/auth/users` — Kullanıcı listesi (admin yetki)
   - `POST /api/auth/users` — Kullanıcı oluştur (admin yetki)
4. `jwt.strategy.ts` — ExtractJwt.fromAuthHeaderAsBearerToken
5. `jwt-auth.guard.ts` — @Public() decorator'ını kontrol eden guard
6. JWT secret: `.env` dosyasında `JWT_SECRET`, varsayılan fallback ile
</action>

<acceptance_criteria>
- İlk çalıştırmada auth/setup çağrılabilir, sonra devre dışı kalır
- `POST /api/auth/login` geçerli kullanıcı için JWT token döner
- `POST /api/auth/login` yanlış şifre için 401 döner
- JWT guard olmayan endpoint'ler public erişime açık
- Kullanıcı oluşturma sadece JWT token ile çalışır
</acceptance_criteria>

---

#### Task 2.2: Departments API

<read_first>
- .planning/phases/01-mvp/01-CONTEXT.md (D-03: düz liste)
</read_first>

<action>
1. `departments.service.ts`:
   - `findAll()` — Tüm birimleri düz liste döndür
   - `findOne(id)` — Tek birim döndür
   - `create(name)` — Yeni birim
   - `update(id, name)` — Birim güncelle
   - `remove(id)` — Birim sil (ilişkili contact varsa engelle)
2. `departments.controller.ts`:
   - `GET /api/departments` — Public, tüm birimler
   - `GET /api/departments/:id` — Public
   - `POST /api/admin/departments` — Admin
   - `PUT /api/admin/departments/:id` — Admin
   - `DELETE /api/admin/departments/:id` — Admin
</action>

<acceptance_criteria>
- Birimler düz liste halinde dönüyor (hiyerarşi yok)
- Admin endpoint'leri JWT token gerektiriyor
- Public endpoint'ler token gerektirmiyor
- Birim silme: ilişkili kişi varsa hata döner
- CRUD işlemleri `prisma.service` üzerinden yapılır
</acceptance_criteria>

---

#### Task 2.3: Contacts API

<read_first>
- .planning/phases/01-mvp/01-CONTEXT.md (D-01, D-02: butonla arama, Türkçe normalize; D-04: fotoğraf yükleme)
</read_first>

<action>
1. `contacts.service.ts`:
   - `search(query, departmentId, page, limit)` — Arama:
     - query → firstName, lastName, title, phoneInternal, phoneMobile, email alanlarında contains arar
     - Türkçe karakter normalize: query'deki 'i'→'İ','ı','I','i', 's'→'S','s','ş','Ş' vb. tüm varyasyonları kapsar
     - SQLite'da LIKE ile case-insensitive
     - Department filtresi opsiyonel
     - Pagination: default page=1, limit=20
   - `findOne(id)` — Detay
   - `create(data)` — Yeni kişi (avatar dahil)
   - `update(id, data)` — Güncelle
   - `remove(id)` — Sil
   - `getStats()` — Toplam kişi sayısı, birim sayısı (dashboard için)
2. `contacts.controller.ts`:
   - `GET /api/contacts/search` — Public, query params: q, departmentId, page, limit
   - `GET /api/contacts/:id` — Public
   - `POST /api/admin/contacts` — Admin
   - `PUT /api/admin/contacts/:id` — Admin (JSON ile, multipart değil)
   - `DELETE /api/admin/contacts/:id` — Admin
   - `GET /api/admin/contacts` — Admin (tüm kişiler, pagination)
   - `GET /api/admin/stats` — Admin dashboard istatistikleri
</action>

<acceptance_criteria>
- `GET /api/contacts/search?q=ahmet` isim-soyisim-telefon alanlarında contains araması yapar
- Türkçe karakter normalize: `ısıklar` yazınca `Işıklar` sonucunu da bulur
- `?departmentId=3` ile birim bazlı filtreleme çalışır
- `?page=1&limit=10` ile pagination çalışır
- Admin CRUD endpoint'leri JWT korumalı
- Stats endpoint'i toplam kişi ve birim sayısı döner
</acceptance_criteria>

---

#### Task 2.4: Upload Modülü

<read_first>
- .planning/phases/01-mvp/01-CONTEXT.md (D-04, D-05: dosya yükleme)
</read_first>

<action>
1. `upload.module.ts` — MulterModule.register
2. `upload.controller.ts`:
   - `POST /api/admin/upload` — Admin, multipart file alır
   - Dosya tipi: .jpg, .jpeg, .png, .webp
   - Max boyut: 2MB
   - Kaydet: `uploads/contacts/{uuid}-{originalname}`
   - Dönen: `{ url: "/uploads/contacts/xxx.jpg" }`
3. `upload.service.ts`:
   - Dosya validation (tip, boyut)
   - UUID ile yeniden adlandırma
   - Eski dosyayı silme (güncelleme durumunda)
</action>

<acceptance_criteria>
- Resim yükleme başarılı: `201 { url: "/uploads/contacts/xxx.jpg" }`
- 2MB üzeri dosya reddedilir: `413`
- .exe, .pdf gibi geçersiz tipler reddedilir: `400`
- Yüklenen dosyaya `GET /uploads/contacts/xxx.jpg` ile erişilebilir
- Eski avatar güncellenince eski dosya silinir
</acceptance_criteria>

---

### Wave 3 — Frontend (Wave 2 bittiğinde başlar)

#### Task 3.1: Public Arama Sayfası

<read_first>
- .planning/phases/01-mvp/01-CONTEXT.md (tüm kararlar)
- apps/web/src/app/(public)/page.tsx
</read_first>

<action>
1. Ana sayfa layout:
   - Üstte: kurum logosu (placeholder), başlık ("Telefon Rehberi"), admin giriş butonu
   - Arama çubuğu: geniş, ortalanmış, placeholder "Ad, soyad, telefon veya birim ile ara..."
   - Filtre: birim dropdown (tüm birimler `/api/departments`'den çekilir)
   - "Ara" butonu (mavi, belirgin)
2. `contact-search.tsx`:
   - Search form: input + birim dropdown + Ara butonu
   - Enter tuşu ile arama, buton ile arama
   - Arama sırasında loading spinner
3. `contact-card.tsx`:
   - Fotoğraf (veya baş harf placeholder)
   - Ad-soyad (büyük punt)
   - Unvan
   - Birim adı
   - Telefonlar (dahili + cep yan yana)
   - Email
   - Kart hover effect, gölgeli
4. `contact-list.tsx`:
   - Tablo/liste görünümü: aynı bilgiler satırlar halinde
   - Her satırda fotoğraf thumbnail + bilgiler
   - Alternatif satır renkleri
5. **Dinamik görünüm geçişi:**
   - Sonuç sayısı < 10 → kart görünümü (grid: 2-3 kolon)
   - Sonuç sayısı >= 10 → liste görünümü
   - Ekran ≤ 768px → her durumda liste görünümü
   - Kullanıcı manuel geçiş yapabilir (list/grid toggle butonu)
6. Boş durum: "Sonuç bulunamadı" mesajı
7. Hata durumu: "Bir hata oluştu" mesajı + tekrar dene butonu
</action>

<acceptance_criteria>
- Arama çubuğuna yazılıp Ara butonuna basılınca `/api/contacts/search` çağrılır
- Sonuçlar kart/listedinamik olarak gösterilir
- Tüm bilgiler (ad, unvan, birim, dahili, cep, email, foto) görünür
- Boş sorguda tüm kişiler listelenir
- Filtre + arama birlikte çalışır
- 10+ sonuçta liste, 10- sonuçta kart görünümü
- Mobilde liste görünümü
- Detay modal/sayfa yok
</acceptance_criteria>

---

#### Task 3.2: Admin Panel Layout ve Giriş

<read_first>
- .planning/phases/01-mvp/01-CONTEXT.md (D-06: setup ekranı, D-09: Türkçe)
- design reference: Logip Admin Dashboard
</read_first>

<action>
1. Admin layout (`apps/web/src/app/(admin)/layout.tsx`):
   - Sol sidebar: logo, menü linkleri (Dashboard, Kişiler, Birimler, Kullanıcılar), çıkış butonu
   - Üst bar: kullanıcı adı, avatar
   - Koyu tema (dark theme)
   - Responsive: mobilde sidebar hamburger menü
2. `login/page.tsx`:
   - Kullanıcı adı + şifre formu
   - Hata mesajı (Türkçe)
   - Giriş sonrası dashboard'a yönlendir
3. `setup/page.tsx`:
   - İlk çalıştırmada gösterilir (auth/setup endpoint'ine 403 dönene kadar)
   - Kullanıcı adı + şifre + şifre tekrar
   - Setup sonrası login sayfasına yönlendir
4. Auth context: token yoksa login'e yönlendir
</action>

<acceptance_criteria>
- Admin sayfasına gitmeden önce token kontrolü yapılır, token yoksa login'e yönlendir
- Login formu çalışır, geçersiz bilgide hata gösterir
- Setup sayfası sadece hiç admin yokken erişilebilir
- Sidebar menü linkleri çalışır
- Tüm admin sayfaları koyu tema
- Mobilde sidebar hamburger menü ile açılır
</acceptance_criteria>

---

#### Task 3.3: Admin Dashboard

<read_first>
- apps/web/src/app/(admin)/page.tsx
- design reference: Logip Admin Dashboard
</read_first>

<action>
1. Dashboard sayfası:
   - Üstte istatistik kartları: Toplam Kişi, Toplam Birim, Toplam Kullanıcı
   - Her kart: icon, sayı, label
   - Son eklenen 5 kişi listesi (isim + birim)
   - Admin paneli ana sayfası
</action>

<acceptance_criteria>
- Dashboard istatistikleri `/api/admin/stats` endpoint'inden çekilir
- Kartlar responsive grid yapısında
- Son eklenen kişiler listelenir
</acceptance_criteria>

---

#### Task 3.4: Admin Kişi CRUD Sayfaları

<read_first>
- apps/web/src/app/(admin)/contacts/page.tsx
- apps/web/src/app/(admin)/contacts/new/page.tsx
- apps/web/src/app/(admin)/contacts/[id]/page.tsx
</read_first>

<action>
1. Kişi listesi (`contacts/page.tsx`):
   - Tablo görünümü: foto, ad-soyad, unvan, birim, telefon
   - Her satırda düzenle/sil butonları
   - Silme onay dialog'u (Are you sure? — Türkçe)
   - Filtreleme: isim/birim ile
   - "Yeni Kişi" butonu
   - Pagination
2. Yeni kişi formu (`contacts/new/page.tsx`):
   - Ad (zorunlu), Soyad (zorunlu), Unvan, Dahili, Cep, Email, Birim (dropdown)
   - Fotoğraf yükleme (drag-drop veya dosya seçici, preview gösterimi)
   - Validasyon (zorunlu alanlar, telefon formatı)
   - Kaydet butonu
3. Düzenleme formu (`contacts/[id]/page.tsx`):
   - Mevcut verilerle ön doldurulmuş
   - Fotoğraf değiştirme
   - Kaydet/Sil butonları
</action>

<acceptance_criteria>
- Kişi listesi admin panelinde sayfalanmış şekilde gösterilir
- Yeni kişi eklenebilir (fotoğraflı)
- Kişi düzenlenebilir
- Kişi silinebilir (onay dialog'u ile)
- Validasyon: zorunlu alanlar boşsa hata gösterir
- Fotoğraf yükleme çalışır (upload module'e gider, dönen URL kaydedilir)
</acceptance_criteria>

---

#### Task 3.5: Admin Birim CRUD Sayfaları

<read_first>
- apps/web/src/app/(admin)/departments/page.tsx
- apps/web/src/app/(admin)/departments/new/page.tsx
- apps/web/src/app/(admin)/departments/[id]/page.tsx
</read_first>

<action>
1. Birim listesi: tablo (ad, kişi sayısı, düzenle/sil)
2. Yeni birim formu: ad (zorunlu)
3. Düzenleme formu: ad güncelle
4. Silme: ilişkili kişi varsa uyarı göster, engelle
</action>

<acceptance_criteria>
- Birim CRUD çalışır
- Birim silme: ilişkili kişi varsa hata mesajı gösterilir
</acceptance_criteria>

---

#### Task 3.6: Admin Kullanıcı Yönetimi

<read_first>
- apps/web/src/app/(admin)/users/page.tsx
- apps/web/src/app/(admin)/login/page.tsx
</read_first>

<action>
1. Kullanıcı listesi: kullanıcı adı, rol, son giriş
2. Yeni kullanıcı ekleme: kullanıcı adı, şifre, rol (ADMIN/SUPER_ADMIN)
3. Kullanıcı silme (son admin silinemez)
</action>

<acceptance_criteria>
- Kullanıcı listelenir
- Yeni kullanıcı eklenebilir
- Son admin silinemez
</acceptance_criteria>

---

### Wave 4 — Seed Data ve Son Kontroller (Wave 3 bittiğinde başlar)

#### Task 4.1: Seed Script

<read_first>
- apps/api/src/seed.ts
</read_first>

<action>
1. `apps/api/src/seed.ts` — PrismaClient ile:
   - Admin kullanıcı: admin / admin123 (setup ile değiştirilmeli)
   - 5 birim: "İdari İşler", "Hukuk", "Muhasebe", "Bilgi İşlem", "İnsan Kaynakları"
   - 50+ kişi: gerçekçi Türkçe isimler, birimlere dağıtılmış, unvanlar (Avukat, Hakim, Savcı, Yazı İşleri Müdürü, Şef, Memur), telefonlar
   - Her birime 8-12 kişi
   - Avatar'lar boş (seed'de fotoğraf yok, placeholder kullanılacak)
2. `package.json` scripts: `"seed": "ts-node src/seed.ts"`
</action>

<acceptance_criteria>
- `pnpm seed` çalıştırınca 50+ kişi, 5 birim, 1 admin oluşur
- Admin login olabilir (admin/admin123)
- Public aramada tüm kişiler görünür
</acceptance_criteria>

---

#### Task 4.2: Başlangıç Scripti ve README

<read_first>
- package.json
</read_first>

<action>
1. `start.bat` oluştur (Windows için):
   ```
   @echo off
   cd /d "%~dp0"
   echo Telefon Rehberi baslatiliyor...
   call pnpm install
   call pnpm --filter api exec prisma migrate dev
   call pnpm --filter api exec ts-node src/seed.ts
   start http://localhost:3000
   pnpm dev
   ```
2. `start.sh` oluştur (Linux/Mac için):
   ```bash
   #!/bin/bash
   cd "$(dirname "$0")"
   echo "Telefon Rehberi başlatılıyor..."
   pnpm install
   pnpm --filter api exec prisma migrate dev
   pnpm --filter api exec ts-node src/seed.ts
   pnpm dev
   ```
3. `backup.bat` oluştur:
   ```
   @echo off
   copy /Y apps\api\prisma\dev.db apps\api\prisma\backup\%date:~-10,4%-%date:~-7,2%-%date:~-4,2%.db
   ```
</action>

<acceptance_criteria>
- `start.bat` çalıştırınca tüm servisler başlar
- `backup.bat` çalıştırınca dev.db'nin tarihli kopyası alınır
</acceptance_criteria>

---

## Verification

1. Backend test:
   - `pnpm --filter api start:dev` → 3001 portu açık
   - `GET /api/contacts/search?q=ahmet` → 200 + sonuç
   - `POST /api/auth/login` → 200 + token
   - `GET /api/admin/contacts` (with token) → 200
   - `GET /api/admin/contacts` (without token) → 401
   - `GET /api/docs` → Swagger UI
   - `POST /api/admin/upload` (with file) → 201 + url

2. Frontend test:
   - Ana sayfa: arama çalışıyor, sonuçlar gösteriliyor
   - Admin login: giriş yapılabiliyor
   - Admin kişi CRUD: ekleme/düzenleme/silme çalışıyor
   - Admin birim CRUD: çalışıyor
   - Setup: ilk çalıştırmada setup ekranı

3. Responsive test:
   - Mobil görünüm: liste modu
   - Masüstü görünüm: dinamik kart/liste

4. Türkçe karakter testi:
   - "ışıklar" araması "Işıklar"ı buluyor
   - "İ" araması "isim" gibi sonuçları buluyor

## Success Criteria

- [x] Tüm Wave 1-4 task'ları tamamlandı
- [x] `pnpm dev` ile çalışan proje
- [x] 50+ demo kişi ile seed data
- [x] Arama: isim, soyisim, telefon, birim ile filtreleme
- [x] Admin paneli tam CRUD
- [x] JWT auth çalışıyor
- [x] Setup ekranı ile ilk admin oluşturma
- [x] Türkçe karakter normalize arama
- [x] Dinamik liste/kart görünümü
- [x] Fotoğraf yükleme
- [x] Tüm arayüz Türkçe
