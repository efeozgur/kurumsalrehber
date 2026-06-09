#!/bin/bash
cd "$(dirname "$0")"
echo "============================================"
echo "  Telefon Rehberi - Kurumsal Iletisim Sistemi"
echo "============================================"
echo ""
echo "1/4 - Bagimliliklar yukleniyor..."
pnpm install
echo "2/4 - Veritabani migrasyonu yapiliyor..."
pnpm --filter api exec prisma migrate dev --name init
echo "3/4 - Seed verileri olusturuluyor..."
pnpm --filter api exec ts-node src/seed.ts
echo "4/4 - Servisler baslatiliyor..."
echo ""
echo "Admin paneli: http://localhost:3002/admin/login"
echo "Ana sayfa:    http://localhost:3002"
echo "API docs:     http://localhost:3001/api/docs"
echo ""
pnpm dev
