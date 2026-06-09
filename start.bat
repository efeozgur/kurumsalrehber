@echo off
cd /d "%~dp0"
echo ============================================
echo   Telefon Rehberi - Kurumsal Iletisim Sistemi
echo ============================================
echo.
echo 1/4 - Bagimliliklar yukleniyor...
call pnpm install

echo 2/4 - Prisma istemcisi ve veritabani hazirlaniyor...
call pnpm --filter api exec prisma generate
call pnpm --filter api exec prisma migrate deploy

echo 3/4 - Seed verileri olusturuluyor...
call pnpm --filter api run seed

echo 4/4 - Servisler baslatiliyor...
echo.
echo  API (port 3001) aciliyor...
start "TelefonRehberi-API" cmd /c "pnpm --filter api dev"
timeout /t 4 /nobreak > nul

echo  WEB (port 3002) aciliyor...
start "TelefonRehberi-WEB" cmd /c "pnpm --filter web dev"
timeout /t 3 /nobreak > nul

echo.
echo ============================================
echo   SISTEM HAZIR!
echo ============================================
echo   Ana sayfa:    http://localhost:3002
echo   Admin paneli: http://localhost:3002/admin/login
echo   API docs:     http://localhost:3001/api/docs
echo ============================================
echo.
start http://localhost:3002
echo Tarayici acildi. Kapatmak icin API ve WEB pencerelerini kapatin.
pause
