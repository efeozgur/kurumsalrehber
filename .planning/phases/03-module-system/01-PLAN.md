# Faz 3 — Modül Altyapısı ve Haftalık Yemek Listesi

## Genel Bakış
Modüler yapı: backend'de dinamik modül yönetimi, admin panelde modülleri aktif/pasif etme, ilk modül olarak Haftalık Yemek Listesi.

---

## Görev 1: Veritabanı Modül Altyapısı

### 1.1 Prisma'ya `Module` modeli ekle
- `schema.prisma`'ya `Module` tablosu: `id`, `key` (unique), `name`, `description`, `enabled` (default true), `createdAt`, `updatedAt`
- Migration oluştur: `prisma migrate dev --name add-module-model`

### 1.2 Seed'e varsayılan modülleri ekle
- `seed.ts`'ye `meal-plans` modül kaydı ekle (enabled: true)

---

## Görev 2: Backend Modül Yönetimi

### 2.1 ModulesModule oluştur
- `apps/api/src/modules/modules/` dizini
- `modules.module.ts` — NestJS Module
- `modules.controller.ts` — `GET /api/admin/modules` (list), `PATCH /api/admin/modules/:id` (toggle enabled)
- `modules.service.ts` — CRUD işlemleri
- `dto/update-module.dto.ts` — `{ enabled: boolean }`
- `@Public()` değil, admin auth gerekli

### 2.2 AppModule'e ModulesModule ekle

---

## Görev 3: Frontend Modül Yönetimi

### 3.1 Admin modül yönetim sayfası
- `apps/web/src/app/admin/modules/page.tsx`
- Tablo: modül adı, açıklama, aktif/pasif toggle
- Toggle ile `PATCH /api/admin/modules/:id` çağrısı
- Her toggle sonrası liste yenilenir

### 3.2 Admin yan menüyü güncelle
- Admin layout'ta modüller dinamik mi olacak yoksa statik mi? Şimdilik statik bağlantıları koru.
- `Apps` veya `Modüller` başlığı altında modülleri listele
- İleride API'den modül listesi çekilebilir

---

## Görev 4: Yemek Listesi Modülü — Backend

### 4.1 Prisma'ya `MealPlan` modeli ekle
```
model MealPlan {
  id        Int      @id @default(autoincrement())
  day       String   // 'monday', 'tuesday', ... veya '2024-01-15' (ISO tarih)
  mealType  String   // 'lunch' | 'dinner'
  menu      String   // menü açıklaması
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
- Migration oluştur

### 4.2 MealPlan Module oluştur
- `apps/api/src/modules/meal-plans/`
- `meal-plan.module.ts`
- `meal-plan.controller.ts`
  - `GET /api/meal-plans` — public, haftanın yemeklerini getir (aktif modül kontrolü yok, direkt çalışır)
  - `POST /api/admin/meal-plans` — admin, yeni yemek kaydı
  - `PUT /api/admin/meal-plans/:id` — admin, düzenle
  - `DELETE /api/admin/meal-plans/:id` — admin, sil
- `meal-plan.service.ts` — CRUD
- `dto/create-meal-plan.dto.ts` — `day`, `mealType`, `menu`
- `dto/update-meal-plan.dto.ts` — partial of create

### 4.3 AppModule'e MealPlanModule ekle

---

## Görev 5: Yemek Listesi Modülü — Frontend

### 5.1 Admin yemek listesi sayfaları
- `apps/web/src/app/admin/meal-plans/page.tsx`
  - Haftalık tablo görünümü (günler × öğle/akşam)
  - Her hücrede düzenle/sil
  - "Yeni Ekle" butonu
- `apps/web/src/app/admin/meal-plans/new/page.tsx`
  - Gün, öğün tipi, menü metni formu
- `apps/web/src/app/admin/meal-plans/[id]/page.tsx`
  - Düzenleme formu

### 5.2 Public yemek listesi sayfası
- `apps/web/src/app/meal-plans/page.tsx`
  - Haftalık yemek listesi tablosu (sadece okunur)
  - Gün bazında gruplanmış
  - Ana sayfadan link (hero altında veya header'da)

### 5.3 API client'a yemek listesi metodları ekle
- `api.ts`'ye `getMealPlans`, `createMealPlan`, `updateMealPlan`, `deleteMealPlan`

### 5.4 Ana navigasyona ekle
- Admin yan menüde "Yemek Listesi" linki
- Public header'da (veya hero altında) "Yemek Listesi" linki

---

## Bağımlılık Sırası
```
Görev 1 (Prisma Module) → Görev 2 (Backend Modules) → Görev 3 (Frontend Modules)
                                                      
Görev 4 (Prisma MealPlan + Backend) → Görev 5 (Frontend MealPlan)
```

Görev 1-2-3 ve Görev 4-5 paralel ilerleyebilir (farklı modeller).

---

## Dosya Değişiklik Özeti

| Dosya | İşlem |
|-------|-------|
| `apps/api/prisma/schema.prisma` | `Module` + `MealPlan` model ekle |
| `apps/api/src/modules/modules/` | Yeni modül (4 dosya) |
| `apps/api/src/modules/meal-plans/` | Yeni modül (6 dosya) |
| `apps/api/src/app.module.ts` | 2 yeni module import ekle |
| `apps/api/src/seed.ts` | Varsayılan modülleri ekle |
| `apps/web/src/app/admin/modules/page.tsx` | Yeni sayfa |
| `apps/web/src/app/admin/meal-plans/` | 3 yeni sayfa |
| `apps/web/src/app/meal-plans/page.tsx` | Yeni public sayfa |
| `apps/web/src/lib/api.ts` | API metodları ekle |

---

## Tahmini Süre
- Görev 1 (Prisma): 15 dk
- Görev 2 (Backend Modules): 30 dk
- Görev 3 (Frontend Modules): 30 dk
- Görev 4 (Backend MealPlan): 45 dk
- Görev 5 (Frontend MealPlan): 60 dk
- **Toplam:** ~3 saat
