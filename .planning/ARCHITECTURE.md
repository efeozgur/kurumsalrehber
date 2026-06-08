# Mimari Kararlar

## Veritabanı Şeması (MVP)

```prisma
model Department {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  parentId    Int?
  parent      Department?  @relation("DepartmentHierarchy", fields: [parentId], references: [id])
  children    Department[] @relation("DepartmentHierarchy")
  contacts    Contact[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Contact {
  id            Int       @id @default(autoincrement())
  firstName     String
  lastName      String
  title         String?         // unvan
  phoneInternal String?         // dahili telefon
  phoneMobile   String?         // cep telefonu
  email         String?
  avatar        String?         // fotoğraf URL'i
  departmentId  Int?
  department    Department?     @relation(fields: [departmentId], references: [id])
  isFavorite    Boolean         @default(false)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  password  String    // hash'lenmiş
  role      Role      @default(ADMIN)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

enum Role {
  SUPER_ADMIN
  ADMIN
}
```

## API Tasarımı

### Public (JWT gerektirmez)
```
GET  /api/contacts/search?q=:query&departmentId=:id&page=1&limit=20
GET  /api/contacts/:id
GET  /api/departments/tree         // hiyerarşik birim ağacı
POST /api/auth/login
```

### Admin (JWT gerekli)
```
GET    /api/admin/contacts
POST   /api/admin/contacts
PUT    /api/admin/contacts/:id
DELETE /api/admin/contacts/:id

GET    /api/admin/departments
POST   /api/admin/departments
PUT    /api/admin/departments/:id
DELETE /api/admin/departments/:id

GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id

GET    /api/admin/stats             // dashboard istatistikleri
```

## Frontend Route Yapısı

### Public Routes (erişim: herkes)
```
/                    → Ana sayfa (arama + sonuçlar)
/contact/:id         → Kişi detay
```

### Admin Routes (erişim: admin)
```
/admin               → Dashboard
/admin/contacts      → Kişi listesi
/admin/contacts/new  → Yeni kişi
/admin/contacts/:id  → Kişi düzenle
/admin/departments   → Birim listesi
/admin/departments/new
/admin/departments/:id
/admin/users         → Kullanıcı yönetimi
/admin/settings      → Sistem ayarları
```

## Modül Sistemi (Faz 3+)

Her modül aşağıdaki yapıyı takip edecek:
```
apps/api/src/modules/meal-plans/
├── meal-plan.module.ts       # NestJS module
├── meal-plan.controller.ts   # REST controller
├── meal-plan.service.ts      # Business logic
├── dto/                      # Data transfer objects
├── entities/                 # Database entities (Prisma schema extension)
└── meal-plan.constants.ts    # Sabitler
```

Frontend'de her modül kendi route ve bileşenlerine sahip olacak:
```
apps/web/src/app/(admin)/admin/meal-plans/
├── page.tsx
├── new/page.tsx
└── [id]/page.tsx
```

Modüller `apps/api/prisma/schema.prisma` dosyasında ayrı bloklar halinde tanımlanacak ve Prisma migration ile yönetilecek.

## Deployment

- **Sunucu:** Kurum içi bir Windows/Linux makinesi (LAN)
- **Backend:** PM2 ile Node.js process manager, 3000 portu
- **Frontend:** Next.js standalone build, 3001 portu (veya aynı portta reverse proxy)
- **Veritabanı:** SQLite (tek dosya `prisma/dev.db`, sunucu gerektirmez, Prisma migration ile yönetilir)
- **Reverse Proxy (opsiyonel):** Nginx ile 80/443'ten 3000/3001'e yönlendirme
- **Başlatma:** `start.bat` / `start.sh` scripti ile tüm servisleri başlatma
- **Yedekleme:** SQLite dosyasını periyodik olarak kopyala (ör: `backup.bat`)
