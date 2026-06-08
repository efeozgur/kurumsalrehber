@echo off
cd /d "%~dp0"
set BACKUP_DIR=apps\api\prisma\backup
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
set BACKUP_FILE=%BACKUP_DIR%\%DATE:~-4,4%-%DATE:~-7,2%-%DATE:~-4,2%.db
copy /Y apps\api\prisma\dev.db "%BACKUP_FILE%"
echo Yedek alindi: %BACKUP_FILE%
pause
