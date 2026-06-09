---
phase: 2
type: full
wave: 1-2
depends_on: [01-mvp]
---

## Faz 2 — Gelişmiş Özellikler

### Sıralama
1. **Toplu kişi import (Excel/CSV)** — Bulk import
2. **Kişi export (Excel/PDF)** — Export
3. **Birim hiyerarşisi (ağaç görünümü)** — Department tree
4. **Sık kullanılanlar / favoriler** — Favorites
5. **Arama geçmişi** — Search history
6. **Gelişmiş arama (fuzzy search)** — Advanced search
7. **Admin paneli istatistikleri (grafikler)** — Charts
8. **Role-based access (super admin, admin)** — RBAC

---

### Wave 1 — Import / Export

#### Task 1.1: Excel/CSV Import (Backend)

<action>
1. Install `xlsx` (SheetJS) package in api
2. Create `POST /api/admin/contacts/import` endpoint
   - Accept multipart file (CSV or Excel: .xlsx, .xls, .csv)
   - Parse file, validate each row
   - Required fields: firstName, lastName
   - Optional: titleName, departmentName, phoneInternal, phoneMobile, email, sicilNo
   - Auto-create titles/departments by name if not exists
   - Return: { total, imported, errors: [{ row, reason }] }
3. File size limit: 5MB
</action>

#### Task 1.2: Excel/CSV Import (Frontend)

<action>
1. Add "Toplu İçe Aktar" button to admin contacts page
2. Create import dialog/modal: file upload + preview
3. Show import results: kaç kişi eklendi, hatalı satırlar
4. Download error report as CSV
</action>

#### Task 1.3: Excel Export (Backend)

<action>
1. Create `GET /api/admin/contacts/export` endpoint
   - Query params: format (xlsx/csv), departmentId (optional)
   - Generate xlsx/csv file with all contacts
   - Headers: Ad, Soyad, Sicil No, Ünvan, Birim, Dahili, Cep, Email
</action>

#### Task 1.4: Excel Export (Frontend)

<action>
1. Add "Dışa Aktar" button in admin contacts page
2. Format selection (Excel/CSV)
3. Download file
</action>

---

### Wave 2 — Diğer Özellikler

#### Task 2.1: Birim Hiyerarşisi

- Backend: `GET /api/departments/tree` recursive query
- Frontend: Department sayfasında ağaç görünümü

#### Task 2.2: Sık Kullanılanlar / Favoriler

- Backend: Bulk update `isFav` toggle
- Frontend: Public sayfada favori butonu, filtreleme

#### Task 2.3: Arama Geçmişi

- LocalStorage'da son 10 arama
- Public sayfada input focus olunca geçmiş göster

#### Task 2.4: Gelişmiş Arama

- Fuzzy search (benzerlik skoru)
- Title/department bazlı filtreler

#### Task 2.5: Dashboard Grafikler

- Recharts: birim bazlı kişi dağılımı (pie/bar chart)

#### Task 2.6: Role-Based Access

- SUPER_ADMIN silebilir, ADMIN sadece CRUD
- Frontend'de rol bazlı menü gizleme
