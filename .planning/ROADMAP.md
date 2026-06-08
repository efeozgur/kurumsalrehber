# Yol Haritası (ROADMAP)

## Faz 1 — MVP: Temel Telefon Rehberi (1-2 hafta)

### Amaç
Çalışan bir telefon rehberi sistemi: arama, listeleme, admin panelinde kişi/birim yönetimi.

### Backend
- NestJS proje iskeleti + Prisma + SQLite
- Kişi (Contact) modeli: ad, soyad, unvan, telefon (dahili/cep), email, birim, fotoğraf
- Birim (Department) modeli: ad, üst birim (hiyerarşi)
- Auth modülü: JWT login, register (admin), guard middleware
- REST API: `/api/contacts`, `/api/departments`, `/api/auth`
- Swagger dokümantasyonu
- Seed script (demo veriler)

### Frontend (Public)
- Next.js + TailwindCSS + shadcn/ui kurulumu
- Ana sayfa: logo, arama çubuğu, filtreler (birim, unvan)
- Sorgu sonuçları: Liste ve kart görünümü (geçiş yapılabilir)
- Her kişi için detay popup/modal
- Responsive tasarım

### Frontend (Admin)
- Admin layout: yan menü, üst bar, koyu tema (Logip tasarımı referans)
- Dashboard özet: toplam kişi, birim sayısı
- Kişi CRUD sayfaları (liste, ekle, düzenle, sil)
- Birim CRUD sayfaları
- Admin kullanıcı yönetimi

### Teslimat Kriterleri
- [ ] `pnpm dev` ile çalışan proje
- [ ] 50+ demo kişi ile seed data
- [ ] Arama: isim, soyisim, telefon, birim ile filtreleme
- [ ] Admin paneli tam CRUD
- [ ] JWT auth çalışıyor

---

## Faz 2 — Gelişmiş Özellikler (1 hafta)

### Özellikler
- Toplu kişi import (Excel/CSV)
- Kişi export (Excel/PDF)
- Birim hiyerarşisi (ağaç görünümü)
- Sık kullanılanlar / favoriler
- Arama geçmişi
- Gelişmiş arama (fuzzy search, unvan/birim bazlı filtreleme)
- Admin paneli istatistikleri (grafikler)
- Role-based access (super admin, admin)

---

## Faz 3 — Modül Altyapısı ve İlk Ek Modül (1 hafta)

### Modül Sistemi
- Backend'de plugin/modül mimarisi (NestJS modüllerini dinamik yükleme)
- Admin panelinde modül yönetimi (aktif/pasif)
- Ortak veritabanı migration stratejisi
- Modül için CRUD generator/template

### İlk Ek Modül: Haftalık Yemek Listesi
- Yemek modeli: gün, öğle/akşam, menü
- Admin panelinde haftalık yemek girişi
- Public sayfada haftalık yemek listesi görüntüleme

---

## Faz 4 — Nöbet Çizelgeleri (1 hafta)

### Mahkeme Nöbetleri
- Nöbet tipi, tarih, kişi atama
- Takvim görünümü
- Admin panelinde nöbet planlama

### Savcılık Nöbetleri
- Savcılık nöbetleri için ayrı modül
- Benzer yapı, farklı kurallar

---

## Faz 5 — İyileştirme ve Kararlılık (sürekli)

### Yapılacaklar
- Performans optimizasyonu
- Loglama ve monitoring
- Yedekleme stratejisi
- Kullanıcı geri bildirimi ile iyileştirme
- Mobil uyumluluk
- Karanlık/aydınlık tema
- Kısayol tuşları (ör: ESC ile modal kapatma, Ctrl+K ile arama)
