# Burdur Adliyesi Telefon Rehberi

## Vizyon
Kurum içi kullanıma yönelik, yerel ağ üzerinde çalışan, genişletilebilir bir telefon rehberi ve kurumsal bilgi sistemi. Modüler yapısı sayesinde yemek listesi, nöbet çizelgeleri gibi ek modüllerle zenginleştirilebilir.

## Kullanıcı Rolleri
- **Ziyaretçi (Anonim):** Arama yapabilir, kişi kartlarını görebilir, ünvan/birim filtreleme yapabilir, favori ekleyebilir
- **Admin (ADMIN):** Kişi/birim/ünvan/ipucu CRUD, dosya yükleme (SİLEMEZ)
- **Süper Admin (SUPER_ADMIN):** Tüm ADMIN yetkileri + silme + kullanıcı yönetimi

## Mevcut Özellikler

### Phase 1 — MVP (Tamamlandı)
- **Public Arama:** Ad, soyad, sicil, dahili, cep, email, ünvan, birim alanlarında genişletilmiş arama (büyük/küçük harf duyarsız, Türkçe karakter normalize); dropdown'lar kaldırıldı, ünvan/birim adı yazınca otomatik filtrelenir
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

### Phase 3 — İyileştirmeler (Tamamlandı)
- **Favori Bugfix:** API TransformInterceptor response'u `{ data: ... }` olarak sardığı için `toggleFav`'de `updated.isFav` yerine `updated.data.isFav` kullanıldı; favori görünümündeyken toggle sonrası kişi listeden çıkarılıyor; hatalar artık `console.error` ile loglanıyor
- **Auth Kalıcılığı:** Anasayfada `useAuth` ile giriş durumu kontrolü; token varsa "Admin Panel" (turuncu vurgulu), yoksa "Admin Giriş" butonu; admin sidebar'da "Ana Sayfa" linki
- **Arama Geçmişi Z-Index:** Glass container (`backdrop-blur-xl`) stacking context oluşturduğu için dropdown ipuçlarının altında kalıyordu; `relative z-10` ile düzeltildi
- **Arama Sadeleştirme:** "Tüm Birimler" ve "Tüm Ünvanlar" dropdown'ları kaldırıldı; arama çubuğu + buton tek satır; API'ye `department.name` içinde arama eklendi
- **Sık Kullanılanlar Bölümü:** Anasayfada arama yapılmamışsa favori kişiler "Sık Kullanılanlar" başlığıyla gösterilir; `getFavorites()` ile yüklenir; toggle sonrası state senkronize edilir
- **İpucu Geçiş Hızı Ayarı:** `Setting` modeli (key/value), `SettingsModule` ile `GET/POST /api/admin/settings`, admin ipuçları sayfasında hız inputu (ms), anasayfada `tipSpeed` değeri okunur; varsayılan 4000ms
- **İpuçlarını Göster/Gizle:** Admin ipuçları sayfasında toggle anahtarı; kapalıyken hız ayarı gizlenir, anasayfada ipucu carousel'i gösterilmez

### Phase 4 — Tema Sistemi & İyileştirmeler (Tamamlandı)
- **Anasayfada Düzenle/Sil:** Giriş yapmış admin kullanıcıları için grid/liste görünümünde kişi kartlarında düzenle ve sil butonları; SUPER_ADMIN silme yetkisi, ADMIN sadece düzenleme; favoriler bölümünde butonlar gösterilmez
- **Arama Geçmişi Kırpılma Düzeltmesi:** Hero wrapper'daki `overflow-hidden` dekorasyon elemanlarına özel bir kapsayıcıya taşındı, dropdown artık kırpılmıyor
- **Tema Sistemi:** Kullanıcının seçimine bağlı 4 tema (Turuncu, Mavi, Mor, Lacivert); brand rengi, hero gradient, butonlar, glow efektleri CSS değişkenleri ile tema class'ına göre değişir; `ThemeProvider` context ile localStorage + API'ye kaydedilir; tüm sayfalarda geçerlidir
- **Burdur Adliyesi Telefon Rehberi:** Tüm "Telefon Rehberi" referansları "Burdur Adliyesi Telefon Rehberi" olarak güncellendi
- **Tema Değiştirici:** Sağ alt köşeye sabitlenen tema seçici, tüm sayfalarda görünür

### Phase 5 — Modül Altyapısı & Haftalık Yemek Listesi (Tamamlandı)
- **Modül Sistemi (Görev 1-3):** `Module` modeli (key/name/description/enabled), backend `ModulesModule` ile GET/PATCH API, admin panelde modül yönetim sayfası (aktif/pasif toggle), yan menüde Modüller linki
- **Yemek Listesi Backend (Görev 4):** `MealPlan` modeli (weekStart/dayOfWeek/soup/mainDishes/salad), `FoodItem` modeli (name/category ile benzersiz), haftalık sorgu + bugünün yemeği endpoint'leri, admin CRUD
- **Yemek Listesi Frontend Admin (Görev 5):** Hafta seçici + 5 gün (Pzt-Cuma) × 3 kategori tablosu; modal tabanlı yemek seçici (FoodItem havuzundan seçim + yeni ekleme); anasayfada gösterme toggle'ı
- **Yemek Listesi Public:** `/meal-plans` sayfasında haftalık kart görünümü; anasayfada "Bugünün Yemeği" kartı (hero içinde animasyonlu taşınma, admin toggle ile açılıp kapatılabilir)
- **FoodItem Havuzu:** Çorba/ana yemek/salata kategorilerinde önceden tanımlı yemek listesi (14 varsayılan yemek seed'li), admin ekleme/silme

### Phase 6 — Genişletilmiş İstatistik Dashboard (Tamamlandı)
- **SearchLog Modeli:** `SearchLog` Prisma modeli (query/departmentId/titleId/contactId/resultCount/source/createdAt) ile arama, görüntüleme ve export logları; demo seed verisi (127 kayıt, son 30 güne yayılmış)
- **Backend Analytics API:** `AnalyticsModule` ile 8 endpoint — log kaydı (search/view/export) + dashboard analitik (summary, en çok aranan terimler, en çok görüntülenen kişiler, saatlik/günlük kullanım, boş sonuç dönen aramalar, en çok favorilenen kişiler)
- **Log Entegrasyonu:** Public search, admin list, kişi görüntüleme ve export işlemlerine otomatik log kaydı (arka planda, kullanıcı deneyimini etkilemez)
- **Admin Dashboard Güncellemesi:** 4 yeni analitik kartı (bugünkü arama, toplam arama, boş sonuç oranı, ortalama sonuç sayısı); saat bazlı bar chart; günlük kullanım area chart; en çok aranan terimler tablosu; en çok görüntülenen kişiler tablosu; boş sonuç dönen aramalar tablosu; en çok favorilenen kişiler tablosu
- **Dashboard Auto-Refresh:** `window focus` event'i ile sayfaya dönüşte verilerin otomatik tazelenmesi
- **Modül Durumu Entegrasyonu:** Modül pasif edilince backend `findToday()` null döndürür, public header'daki buton ve kartlar kaybolur, admin sidebar'daki link filtrelenir; `GET /api/modules/:key/status` public endpoint'i
- **İstatistik Sıfırlama:** `DELETE /api/admin/analytics/clear` endpoint'i (sadece SUPER_ADMIN), admin dashboard'da "İstatistikleri Sıfırla" butonu, onay sonrası tüm SearchLog kayıtlarını siler ve dashboard'u otomatik yeniler

### Phase 7 — Vesayet (Kısıtlı) Modülü (Tamamlandı)
- **Vesayet Modeli:** `Ward` modeli (firstName/lastName/tcKimlikNo/dosyaNo/status/birthDate/notes + guardian fields) ve `BankAccount` modeli (bankName/iban/amount/currency/termMonth) ilişkili olarak Prisma şemasına eklendi; migration oluşturuldu
- **Backend CRUD:** `VesayetModule` ile tüm Ward ve BankAccount CRUD endpoint'leri; sadece `VESAYET_ADMIN` ve `SUPER_ADMIN` rollerine yetki veren `@ModuleAccess('VESAYET_ADMIN')` dekoratörü ve guard
- **Kur Bilgisi API:** `GET /api/admin/vesayet/exchange-rates` — exchangerate-api.com üzerinden USD/EUR/GBP/CHF kurlarını 1 USD = X TL formatında döndürür; fallback değerler mevcut
- **Rapor Özet API:** `GET /api/admin/vesayet/reports/summary` — toplam kısıtlı sayısı, aktif/pasif dağılımı, para birimi bazlı bakiye toplamları, banka kırılımı (her bankanın para birimi bazlı bakiyeleri), ortalama bakiye
- **Admin Panel Entegrasyonu:** Admin sidebar'da "Vesayet" linki (sadece yetkili kullanıcılara gösterilir), admin layout'ta `@ModuleAccess` kontrolü
- **Vesayet Arayüzü (Light Tema):** Kendi layout'u (üst profil barı + 64px ikon sidebar: Dashboard/Kısıtlı Ara/Kısıtlı Ekle/Banka Hesapları), light Bootstrap teması (#f1f5f9 bg, #0d6efd primary, Inter font), büyük kartlar ve yazılar
- **Dashboard:** 4 istatistik kartı (toplam kısıtlı/toplam hesap/toplam bakiye/para birimleri), kur bilgisi kartı, hesap bakiye özeti (para birimi bazlı), raporlamalar bölümü
- **Kısıtlı Listesi:** `/vesayet/kisitli` — arama + tablo (ad, TC, dosya no, durum badge, hesap sayısı, düzenle/sil); SUPER_ADMIN silme yetkisi
- **Kısıtlı Detay:** `/vesayet/kisitli/[id]` — kişisel bilgiler, para birimi bazlı bakiye kartları, banka hesapları tablosu, düzenleme formu
- **Kısıtlı Ekleme:** `/vesayet/kisitli/new` — TC 11 hane validasyonu, banka hesabı ekleme/çıkarma
- **Banka Hesapları:** `/vesayet/hesaplar` — tüm kısıtlılara ait banka hesaplarının merkezi listesi, banka adı/para birimi filtreleme

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Backend | NestJS + Prisma + JWT |
| Frontend | Next.js 14 (App Router) + TailwindCSS |
| Veritabanı | SQLite |
| Auth | JWT (access token, role-based guards) |
| Monorepo | Turborepo + pnpm |
| UI | Custom TailwindCSS (koyu tema, 4 renk teması seçeneği) |
| Grafikler | Recharts (PieChart, BarChart, AreaChart, BarChart) |
| Import | SheetJS (xlsx) — CSV/Excel ayrıştırma |
| Export | SheetJS — XLSX/CSV oluşturma |

## Proje Durumu

- **MVP:** Tamamlandı
- **Phase 2 (Gelişmiş Özellikler):** Tamamlandı (Tüm Task 1.x ve 2.x)
- **Phase 3 (İyileştirmeler):** Tamamlandı
- **Phase 4 (Tema Sistemi & İyileştirmeler):** Tamamlandı
- **Phase 5 (Modül Altyapısı & Yemek Listesi):** Tamamlandı
- **Phase 6 (Genişletilmiş İstatistik Dashboard):** Tamamlandı
- **Phase 7 (Vesayet Modülü):** Tamamlandı
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
│   │   │   │   ├── filters/        # HttpExceptionFilter
│   │   │   │   ├── guards/         # JwtAuthGuard, RolesGuard
│   │   │   │   └── interceptors/   # TransformInterceptor
│   │   │   ├── modules/
│   │   │   │   ├── analytics/      # SearchLog + dashboard istatistikleri
│   │   │   │   ├── auth/           # JWT giriş/kayıt/kullanıcı yönetimi
│   │   │   │   ├── contacts/       # Kişi CRUD + arama + import/export + favori
│   │   │   │   ├── departments/    # Birim CRUD + hiyerarşik ağaç
│   │   │   │   ├── titles/         # Ünvan CRUD
│   │   │   │   ├── tips/           # İpucu CRUD
│   │   │   │   ├── settings/       # Sistem ayarları (ipucu hızı, tema, yemek toggle)
│   │   │   │   ├── modules/        # Modül yönetimi (aktif/pasif) + public status endpoint
│   │   │   │   ├── vesayet/        # Kısıtlı/Banka hesabı CRUD + kur bilgisi + rapor özet
│   │   │   │   ├── meal-plans/     # Haftalık yemek listesi CRUD (modül kontrollü)
│   │   │   │   ├── food-items/     # Yemek havuzu (çorba/ana yemek/salata)
│   │   │   │   └── upload/         # Dosya yükleme
│   │   │   └── seed.ts
│   │   └── uploads/contacts/
│   └── web/
│       ├── src/
│       │   ├── app/
│   │       │   ├── admin/          # Dashboard (grafikli), contacts, departments (ağaç), titles, tips, users, modules, meal-plans
│   │       │   ├── vesayet/        # Kısıtlı modülü (dashboard, liste, detay, ekleme, banka hesapları)
│   │       │   ├── meal-plans/     # Haftalık yemek listesi (public)
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx        # Public arama (favori + tarihçe + fuzzy)
│       │   ├── lib/
│       │   │   ├── api.ts
│       │   │   ├── auth.tsx
│       │   │   └── theme.tsx
│       │   ├── types/
│       │   │   └── index.ts         # Stats, AnalyticsSummary, SearchTerm, TopContactView, vb.
│       └── ...
├── .planning/
│   ├── PROJECT.md
│   ├── ROADMAP.md
│   ├── phases/02-advanced/01-PLAN.md
│   └── phases/03-module-system/01-PLAN.md
├── .opencode/
│   ├── agents/
│   │   └── tester.md               # Tester ajanı
├── opencode.json                    # Agent tanımları (backend, frontend, planning, tester)
├── start.bat
└── package.json
```
