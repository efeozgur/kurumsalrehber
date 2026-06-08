# Phase 1: MVP - Temel Telefon Rehberi — Context

**Gathered:** 2026-06-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Çalışan bir telefon rehberi sistemi: halka açık arama + admin panelinde kişi/birim CRUD. JWT auth ile korunan admin paneli. SQLite veritabanı. Faz 2+ için modüler altyapı henüz kurulmayacak.

</domain>

<decisions>
## Implementation Decisions

### Arama Davranışı
- **D-01:** Arama butonla tetiklenir. Anında arama (debounce) yok.
- **D-02:** Türkçe karakter normalize edilir. Case-insensitive arama yapılır (örn: "ısıklar", "IŞIKLAR", "ışıklar" aynı sonucu verir). Backend'de SQLite ICU extension veya Prisma level'da normalize collation kullanılabilir; alternatif olarak uygulama katmanında normalize edilmiş bir alan (searchIndex) tutulabilir.

### Birim Hiyerarşisi
- **D-03:** MVP'de birimler düz liste olarak gösterilir. `parentId` modelde tanımlanır ancak MVP UI'ında kullanılmaz. Hiyerarşik ağaç görünümü Faz 2'ye bırakıldı.

### Fotoğraf/Avatar
- **D-04:** Dosya yükleme ile fotoğraf eklenir. Admin panelinden .jpg/.png yüklenir, backend `uploads/` dizinine kaydeder. NestJS'de Multer kullanılır. Varsayılan placeholder: ismin baş harflerinden oluşan renkli avatar (JS ile).
- **D-05:** Dosya boyutu sınırı ve resim boyutlandırma (thumbnail) backend'de yapılır.

### İlk Admin Kurulumu
- **D-06:** Uygulama ilk çalıştırıldığında, eğer hiç admin kullanıcı yoksa, bir setup/register sayfasına yönlendirilir. Bu sayfada admin kullanıcı adı ve şifre belirlenir. Sonraki çalıştırmalarda normal login ekranı açılır.

### Sorgu Sonuç Görünümü
- **D-07:** Görünüm dinamik belirlenir:
  - Sonuç sayısı fazla (>= eşik değer, örn: 10) → liste görünümü
  - Sonuç sayısı az (< eşik değer) → kart görünümü
  - Ekran boyutuna göre de optimize edilir (mobilde liste daha uygun)
- **D-08:** Sonuçlarda tüm bilgiler direkt görünür: ad-soyad, unvan, birim, dahili telefon, cep telefonu, email, fotoğraf. Detay modal veya ayrı sayfa yok.

### Arayüz Dili
- **D-09:** Tüm arayüz Türkçe. Çoklu dil desteği (i18n) MVP'de yok. Tüm etiketler, butonlar, mesajlar, hata metinleri Türkçe.

### Claude's Discretion
- Seed data içeriği (50+ demo kişi) — gerçekçi Türkçe isimler, birimler, unvanlar
- Admin paneli tema renkleri ve sidebar genişliği
- Responsive breakpoint değerleri
- Arama eşik değeri (liste/kart geçişi için)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Proje Dokümanları
- `.planning/PROJECT.md` — Teknoloji kararları, dizin yapısı, vizyon
- `.planning/ROADMAP.md` § Faz 1 — Faz kapsamı ve teslimat kriterleri
- `.planning/ARCHITECTURE.md` — Veritabanı şeması, API tasarımı, route yapısı

### Tasarım Referansları
- `https://dribbble.com/shots/21590789-Logip-Admin-Dashboard-Analytics-UX` — Admin panel tasarım referansı
- `https://dribbble.com/shots/27445480-Creative-Talent-Platform-Website-Design` — Public arayüz tasarım referansı

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Henüz kod yok — sıfırdan başlanıyor.

### Established Patterns
- Henüz kod yok — ilk faz olduğu için pattern'ler bu fazda oluşturulacak.

### Integration Points
- Bu faz sonunda diğer fazların entegre olacağı temel API ve veritabanı yapısı kurulmuş olacak.

</code_context>

<specifics>
## Specific Ideas

- Admin panel tasarımı Logip referansındaki gibi koyu tema, yan menü, üst bar, istatistik kartları
- Public arayüz Creative Talent Platform referansındaki gibi temiz, modern, arama odaklı
- Sorgu sonuçları: Creative Talent Platform'daki gibi kişi kartları/listesi şeklinde

</specifics>

<deferred>
## Deferred Ideas

- Birim hiyerarşik ağaç görünümü — Faz 2
- Gelişmiş arama (fuzzy search) — Faz 2
- Favoriler / sık kullanılanlar — Faz 2
- Excel/CSV import/export — Faz 2
- Modül sistemi (plugin mimarisi) — Faz 3
- Yemek listesi modülü — Faz 3
- Nöbet çizelgeleri — Faz 4
- Karanlık/aydınlık tema — Faz 5
- Çoklu dil (i18n) — Faz 5

</deferred>

---

*Phase: 1-MVP*
*Context gathered: 2026-06-08*
