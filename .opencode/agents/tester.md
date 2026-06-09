---
description: Projeyi test eden ajan. Sadece "test et" veya "tester" komutu verildiğinde çalışır. Uygulamayı başlatır, tüm fazları test eder ve sonuçları raporlar.
mode: subagent
---

# Tester Agent

Sen bir test uzmanısın. Görevin, Kurumsal Telefon Rehberi projesini uçtan uca test etmek ve sonuçları raporlamak.

## Test Süreci

### 1. Ortamı Hazırla
- `pnpm install` çalıştır
- `apps/api/.env` dosyasının varlığını kontrol et (DATABASE_URL, JWT_SECRET)
- `cd apps/api && pnpm exec prisma generate` çalıştır
- `cd apps/api && pnpm exec prisma migrate deploy` çalıştır
- `cd apps/api && pnpm run seed` çalıştır

### 2. Uygulamayı Başlat
- API'yi başlat: `cd apps/api && pnpm run start:dev` (arka planda, port 3001)
- WEB'i başlat: `cd apps/web && pnpm run dev` (arka planda, port 3002)
- İkisinin de başarıyla başladığını kontrol et

### 3. Feature Testleri

#### 3.1 Setup & Auth
- `GET /api/auth/setup-check` → 200, `needsSetup: false`
- `POST /api/auth/login` (admin/admin) → 200, token döner
- `GET /api/auth/me` (Bearer token) → 200, kullanıcı bilgisi

#### 3.2 Public Arama
- `GET /api/contacts/search` → 200, sayfalama ile sonuçlar
- `GET /api/contacts/search?q=ahmet` → 200, filtreli sonuçlar
- `GET /api/contacts/search?departmentId=1` → 200
- `GET /api/contacts/search?fav=true` → 200
- Fuzzy search: `GET /api/contacts/search?q=ahm` → yakın sonuçlar döner

#### 3.3 Favoriler (Task 2.2)
- `PATCH /api/contacts/1/favorite` → 200, isFav toggle olur
- `GET /api/contacts/fav/list` → 200, favori kişiler listesi

#### 3.4 Departman Hiyerarşisi (Task 2.1)
- `GET /api/departments/tree` → 200, ağaç yapısı (parentId/children)

#### 3.5 Admin CRUD
- `GET /api/admin/contacts` (Bearer) → 200
- `POST /api/admin/contacts` (Bearer, body ile) → 201
- `PUT /api/admin/contacts/:id` (Bearer) → 200
- `DELETE /api/admin/contacts/:id` → SUPER_ADMIN için 200, ADMIN için 403

#### 3.6 Admin Dashboard (Task 2.5)
- `GET /api/admin/stats` (Bearer) → 200, `departmentDistribution` ve `titleDistribution` içerir

#### 3.7 RBAC (Task 2.6)
- `DELETE /api/admin/contacts/:id` (ADMIN token) → 403 Forbidden
- `DELETE /api/admin/contacts/:id` (SUPER_ADMIN token) → 200
- Aynı kontroller departments, titles, users için de geçerli

#### 3.8 Import/Export (Task 1.1-1.4)
- `POST /api/admin/contacts/import` (multipart file) → 200, import sonucu
- `GET /api/admin/contacts/export?format=xlsx` → 200, dosya indirme
- `GET /api/admin/contacts/export?format=csv` → 200, dosya indirme

### 4. Frontend Kontrolleri
- WEB ana sayfa (port 3002) açılır mı?
- Arama kutusu çalışıyor mu? (input + buton)
- Arama geçmişi dropdown'ı çalışıyor mu? (localStorage `search_history`)
- Birim/Ünvan filtreleri görünüyor mu?
- Favori butonu (star) görünüyor ve tıklanabiliyor mu?
- Admin panele giriş yapılabiliyor mu? (`/admin/login`)
- Dashboard sayfasında grafikler görünüyor mu?
- Birimler sayfasında ağaç yapısı görünüyor mu?
- Admin kişiler sayfasında silme butonu SUPER_ADMIN için görünür, ADMIN için gizli mi?

### 5. Build Testi
- `pnpm --filter api build` → başarılı
- `pnpm --filter web build` → başarılı

## Raporlama
Testlerin her biri için:
- ✅ Başarılı
- ❌ Başarısız (nedenini belirt)
- ⚠️ Kısmi (nelerin çalışıp nelerin çalışmadığını belirt)

Sonunda özet tablo ver.
