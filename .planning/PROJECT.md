# TelefonRehberi - Kurumsal Telefon Rehberi Sistemi

## Vizyon
Kurum içi kullanıma yönelik, yerel ağ üzerinde çalışan, genişletilebilir bir telefon rehberi ve kurumsal bilgi sistemi. Modüler yapısı sayesinde yemek listesi, nöbet çizelgeleri gibi ek modüllerle zenginleştirilebilir.

## Kullanıcı Rolleri
- **Ziyaretçi (Anonim):** Arama yapabilir, kişi kartlarını görebilir, ünvan/birim filtreleme yapabilir
- **Admin:** Kişi/birim/ünvan/ipucu CRUD, kullanıcı yönetimi, dosya yükleme

## Mevcut Özellikler
- **Public Arama:** Ad, soyad, sicil, dahili, cep, email, ünvan alanlarında genişletilmiş arama (büyük/küçük harf duyarsız, Türkçe karakter normalize)
- **Kişi Kartları:** Avatar (placeholder baş harfler), ünvan, birim badge, sicil, dahili/cep/email bilgileri, grid/list görünüm
- **Ünvan/Birim Modal:** Ünvan veya birim adına tıklayınca o gruptaki kişileri listeleyen modal (içinde arama)
- **İpucu Kartları:** Anasayfada otomatik kayan kullanım ipuçları (admin panelden yönetilir)
- **Admin Panel:** Dashboard (istatistik + son eklenenler), Kişiler/Birimler/Ünvanlar/İpuçları/Kullanıcılar CRUD
- **Dosya Yükleme:** Multer ile fotoğraf yükleme (2MB, jpg/png/webp)
- **Seed:** Sadece admin kullanıcı oluşturur, demo veri yüklenmez

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Backend | NestJS + Prisma + JWT |
| Frontend | Next.js 14 (App Router) + TailwindCSS |
| Veritabanı | SQLite |
| Auth | JWT (access token) |
| Monorepo | Turborepo + pnpm |
| UI | Custom TailwindCSS (koyu tema, turuncu aksan) |

## Proje Durumu

- **MVP:** Tamamlandı (public arama + admin CRUD + auth)
- **Genişletilmiş Arama:** Türkçe karakter + büyük/küçük harf duyarsız, tüm alanlarda
- **Ünvan Modülü:** Backend + frontend CRUD, kişi formunda combobox
- **İpucu Modülü:** Backend + frontend CRUD, anasayfada kayan kart
- **Görev Yeri / Ünvan Modalı:** Kart tıklaması ile filtreleme

## Dizin Yapısı

```
TelefonRehberi/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/         # JWT giriş/kayıt/kullanıcı yönetimi
│   │   │   │   ├── contacts/     # Kişi CRUD + arama
│   │   │   │   ├── departments/  # Birim CRUD
│   │   │   │   ├── titles/       # Ünvan CRUD
│   │   │   │   ├── tips/         # İpucu CRUD
│   │   │   │   └── upload/       # Dosya yükleme
│   │   │   ├── common/           # Guard, interceptor, filtre
│   │   │   └── seed.ts
│   │   └── uploads/contacts/
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── admin/        # Dashboard, contacts, departments, titles, tips, users
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx      # Public arama sayfası
│       │   ├── lib/
│       │   │   ├── api.ts
│       │   │   └── auth.tsx
│       │   └── types/
│       └── ...
├── .planning/
├── start.bat
└── package.json
```
