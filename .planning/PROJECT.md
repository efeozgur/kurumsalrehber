# TelefonRehberi - Kurumsal Telefon Rehberi Sistemi

## Vizyon
Kurum içi kullanıma yönelik, yerel ağ üzerinde çalışan, genişletilebilir bir telefon rehberi ve kurumsal bilgi sistemi. Zamanla yemek listesi, nöbet çizelgeleri gibi ek modüllerle zenginleştirilecek modüler bir platform.

## Kullanıcı Rolleri
- **Ziyaretçi (Anonim):** Sadece arama yapabilir, sonuçları görebilir
- **Admin:** Kişi/birim CRUD, kullanıcı yönetimi, sistem ayarları, modül yönetimi

## Teknoloji Kararları

| Katman | Teknoloji | Gerekçe |
|--------|-----------|---------|
| Backend | **NestJS** | Modüler yapısı sayesinde yeni modüller eklemek çok kolay. Decorator tabanlı, TypeScript, DI desteği |
| Frontend | **Next.js 14+** | SSR/SSG, dosya tabanlı routing, hem public site hem admin panel tek projede |
| UI Kiti | **TailwindCSS + shadcn/ui** | Admin ve public arayüz için hazır bileşenler, hızlı prototipleme |
| Veritabanı | **SQLite** | Sıfır konfigürasyon, tek dosya, taşınabilir, kurum içi LAN için ideal, sunucu gerektirmez |
| ORM | **Prisma** | Type-safe, migration desteği, SQLite dahil çoklu DB desteği, NestJS ile iyi entegrasyon |
| Auth | **JWT (access + refresh token)** | İstemsiz, local network için ideal |
| API | **REST (Swagger/OpenAPI)** | Standart, her dilden tüketilebilir, dökümantasyon otomatik |
| Build | **pnpm** | Hızlı, disk efektif, monorepo desteği |
| Monorepo | **Turborepo** | Backend + frontend tek repo altında, paylaşılan tipler |

## Tasarım Referansları
1. **Admin Panel:** [Logip Admin Dashboard](https://dribbble.com/shots/21590789-Logip-Admin-Dashboard-Analytics-UX) - Koyu tema, kart tabanlı, yan menülü
2. **Public Arayüz:** [Creative Talent Platform](https://dribbble.com/shots/27445480-Creative-Talent-Platform-Website-Design) - Modern, temiz, arama odaklı
3. **Sorgu Sonuçları:** Liste ve kart görünümü, ikisi arasında geçiş

## Dizin Yapısı (Taslak)

```
TelefonRehberi/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── contacts/   # Kişi modülü
│   │   │   │   ├── departments/# Birim modülü
│   │   │   │   ├── auth/       # Kimlik doğrulama
│   │   │   │   └── ...         # Gelecek modüller
│   │   │   ├── common/         # Paylaşılan utilities
│   │   │   └── main.ts
│   │   └── prisma/
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── (public)/   # Herkese açık sayfalar
│       │   │   └── (admin)/    # Admin panel sayfaları
│       │   ├── components/
│       │   └── lib/
│       └── ...
├── packages/
│   └── shared/                 # Paylaşılan TypeScript tipleri
├── .planning/                  # Planlama dokümanları
└── package.json                # Turborepo root
```
