@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo    UIN v0.6 - Development Starter
echo ==========================================
echo.

:: Prüfe, ob Frontend-Server schon läuft
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ℹ️  React-Server läuft bereits auf Port 3000.
) else (
    echo [1] Starte React-Frontend (http://localhost:3000)...
    start "UIN Frontend" cmd /k "npm start"
    timeout /t 3 /nobreak >nul
)

:: Aktiviere Python-Umgebung
echo.
echo [2] Aktiviere Python-Umgebung...
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo   ✓ Virtuelle Umgebung aktiviert.
) else (
    echo   ℹ️  Verwende globale Python-Installation.
)

:: Zeige verfügbare Befehle
echo.
echo ==========================================
echo ✅ UIN IST BEREIT!
echo ==========================================
echo.
echo 🔗 Frontend:  http://localhost:3000
echo.
echo 📁 Wichtige Befehle:
echo    - Kanten extrahieren: python utils\extract_edges.py bild.jpg
echo    - Batch-Verarbeitung: python utils\extract_edges.py ordner\ --batch
echo    - Hilfe anzeigen:     python utils\extract_edges.py --help
echo.
echo 🚀 Tipp: Teste zuerst "Skizze hochladen" im Browser!
echo.
pause
