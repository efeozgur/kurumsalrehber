# Burdur Adliyesi Telefon Rehberi

Burdur Adliyesi personel telefon rehberi yönetim sistemi.

## Tech Stack

- **Backend**: NestJS, Prisma (SQLite), JWT Auth, bcrypt
- **Frontend**: Next.js 14 (App Router), TailwindCSS
- **Monorepo**: pnpm workspaces

## Yapı

```
apps/
  api/       - NestJS API (port 3001)
  web/       - Next.js frontend (port 3000)
```

## Modüller

| Modül | Açıklama |
|---|---|---|
| `teknik-servis` | Arıza takip sistemi (kullanıcı bildirim, teknisyen yönetimi, dashboard) |
| `meal-plans` | Haftalık yemek listesi yönetimi |
| `vesayet` | Vesayet kısıtlı ve banka hesabı yönetimi |
| `rehber-auth` | Rehber kimlik doğrulama (aktifse giriş zorunlu) |

## Özellikler

- Telefon rehberi arama (ad, soyad, sicil, dahili, cep, email)
- Departman/ünvan bazlı filtreleme
- Favori kişiler
- Admin panel (CRUD, import/export, kullanıcı yönetimi)
- SQLite veritabanından import aracı
- Fotoğraf yükleme (sicilNo.jpeg)
- Kimlik doğrulama modülü (opsiyonel)
- Şifre sıfırlama (token tabanlı)
- Otomatik personel hesabı oluşturma
- Vesayet yönetimi (kısıtlı, banka/altın hesapları, kur bilgisi)
- Yemek listesi planlama
- Analitik (arama, görüntüleme, popüler kişiler)
- İpuçları (dönen bant)
- Teknik Servis arıza takip sistemi (bildirim, atama, çözüm, dashboard)
- Modül aç/kapa (her modül bağımsız aktif/pasif edilebilir)
- Responsive tasarım (dark theme)

## Kurulum

```bash
pnpm install
cd apps/api && npx prisma migrate dev && cd ../..
pnpm --filter api seed
pnpm dev
```
