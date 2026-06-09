# TelefonRehberi - Kurumsal Telefon Rehberi Sistemi

## Vizyon
Kurum içi kullanıma yönelik, yerel ağ üzerinde çalışan, genişletilebilir bir telefon rehberi ve kurumsal bilgi sistemi. Modüler yapısı sayesinde yemek listesi, nöbet çizelgeleri gibi ek modüllerle zenginleştirilebilir.

## Kullanıcı Rolleri
- **Ziyaretçi (Anonim):** Arama yapabilir, kişi kartlarını görebilir, ünvan/birim filtreleme yapabilir, favori ekleyebilir
- **Admin (ADMIN):** Kişi/birim/ünvan/ipucu CRUD, dosya yükleme (SİLEMEZ)
- **Süper Admin (SUPER_ADMIN):** Tüm ADMIN yetkileri + silme + kullanıcı yönetimi

## Mevcut Özellikler

### Phase 1 — MVP (Tamamlandı)
- **Public Arama:** Ad, soyad, sicil, dahili, cep, email, ünvan alanlarında genişletilmiş arama (büyük/küçük harf duyarsız, Türkçe karakter normalize)
- **Kişi Kartları:** Avatar (placeholder baş harfler), ünvan, birim badge, sicil, dahili/cep/email bilgileri, grid/list görünüm
- **Ünvan/Birim Modal:** Ünvan veya birim adına tıklayınca o gruptaki kişileri listeleyen modal (içinde arama)
- **İpucu Kartları:** Anasayfada otomatik kayan kullanım ipuçları (admin panelden yönetilir)
- **Admin Panel:** Dashboard (istatistik + son eklenenler), Kişiler/Birimler/Ünvanlar/İpuçları/Kullanıcılar CRUD
- **Auth:** JWT tabanlı giriş, setup ekranı, rol tabanlı yetkilendirme

### Phase 2 — Gelişmiş Özellikler (Tamamlandı)
- **Import/Export (Task 1):** Admin panelinden Excel/CSV dosyasıyla toplu kişi içe aktarma (otomatik birim/ünvan oluşturma) + dışa aktarma (XLSX/CSV)
- **Birim Hiyerarşisi (Task 2.1):** Departmanların alt-üst ilişkisi (ağaç yapısı), admin sayfasında genişletilebilir tablo görünümü, yeni/düzenle formlarında üst birim seçici, silme öncesi alt birim kontrolü
- **Sık Kullanılanlar (Task 2.2):** Her kişi kartında star butonu (public sayfa), `PATCH /api/contacts/:id/favorite` ile toggle, favori filtreleme butonu
- **Arama Geçmişi (Task 2.3):** localStorage'da son 10 arama, input focus olunca dropdown ile geçmişi göster, geçmiş temizleme
- **Gelişmiş Arama (Task 2.4):** Fuzzy scoring ile alaka sıralaması (tam eşleşme > contains), ünvan bazlı filtre dropdown, titleId sorgu parametresi
- **Dashboard Grafikler (Task 2.5):** Recharts ile birim bazlı kişi dağılımı (PieChart) + ünvan bazlı dağılım (BarChart), responsive container, renkli legend
- **Role-Based Access (Task 2.6):** `@Roles('SUPER_ADMIN')` dekoratörü, DELETE/Düzenleme yetkisi sadece SUPER_ADMIN'de, frontend'de silme butonları role göre gizlenir, kullanıcı oluşturma/silme SUPER_ADMIN'e kısıtlı

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Backend | NestJS + Prisma + JWT |
| Frontend | Next.js 14 (App Router) + TailwindCSS |
| Veritabanı | SQLite |
| Auth | JWT (access token, role-based guards) |
| Monorepo | Turborepo + pnpm |
| UI | Custom TailwindCSS (koyu tema, turuncu aksan) |
| Grafikler | Recharts (PieChart, BarChart) |
| Import | SheetJS (xlsx) — CSV/Excel ayrıştırma |
| Export | SheetJS — XLSX/CSV oluşturma |

## Proje Durumu

- **MVP:** Tamamlandı
- **Phase 2 (Gelişmiş Özellikler):** Tamamlandı (Tüm Task 1.x ve 2.x)
- **Sonraki Fazlar:** Planlama aşamasında

## Dizin Yapısı

```
TelefonRehberi/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   ├── decorators/     # @Public, @Roles
│   │   │   │   └── guards/         # JwtAuthGuard, RolesGuard
│   │   │   ├── modules/
│   │   │   │   ├── auth/           # JWT giriş/kayıt/kullanıcı yönetimi
│   │   │   │   ├── contacts/       # Kişi CRUD + arama + import/export + favori
│   │   │   │   ├── departments/    # Birim CRUD + hiyerarşik ağaç
│   │   │   │   ├── titles/         # Ünvan CRUD
│   │   │   │   ├── tips/           # İpucu CRUD
│   │   │   │   └── upload/         # Dosya yükleme
│   │   │   └── seed.ts
│   │   └── uploads/contacts/
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── admin/          # Dashboard (grafikli), contacts, departments (ağaç), titles, tips, users
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx        # Public arama (favori + tarihçe + fuzzy)
│       │   ├── lib/
│       │   │   ├── api.ts
│       │   │   └── auth.tsx
│       │   └── types/
│       └── ...
├── .planning/
│   ├── PROJECT.md
│   ├── ROADMAP.md
│   └── phases/02-advanced/01-PLAN.md
├── .opencode/
│   ├── agents/
│   │   └── tester.md               # Tester ajanı
├── opencode.json                    # Agent tanımları (backend, frontend, planning, tester)
├── start.bat
└── package.json
```
