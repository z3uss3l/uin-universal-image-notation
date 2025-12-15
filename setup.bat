@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo    UIN Universal Image Notation Setup v0.6
echo            (Windows Installer)
echo ==========================================
echo.

:: -- Prüfe Voraussetzungen --
echo [1/5] Prüfe Systemvoraussetzungen...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo FEHLER: Node.js/npm nicht gefunden.
    echo Bitte installiere Node.js von https://nodejs.org
    pause
    exit /b 1
)
echo   ✓ Node.js/npm gefunden.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo FEHLER: Python nicht im PATH gefunden.
    echo Bitte installiere Python 3.8+ von https://python.org
    echo und aktiviere "Add Python to PATH" beim Installer.
    pause
    exit /b 1
)
echo   ✓ Python gefunden.

:: -- Installiere Frontend-Abhängigkeiten --
echo.
echo [2/5] Installiere Frontend-Abhängigkeiten (React, jsfeat)...
call npm install
if %errorlevel% neq 0 (
    echo FEHLER: npm install fehlgeschlagen.
    pause
    exit /b 1
)
echo   ✓ Frontend-Abhängigkeiten installiert.

:: -- Richte Python-Umgebung ein --
echo.
echo [3/5] Richte Python-Umgebung ein...
python -m venv venv
if %errorlevel% neq 0 (
    echo WARNUNG: Konnte virtuelle Umgebung nicht erstellen.
    echo Fahre mit globaler Python-Installation fort.
    set USE_VENV=0
) else (
    set USE_VENV=1
)

:: -- Installiere Python-Pakete --
echo.
echo [4/5] Installiere Python-Pakete (opencv, pillow, numpy)...
if %USE_VENV%==1 (
    call venv\Scripts\activate.bat
    echo   (Virtuelle Umgebung aktiviert)
)
pip install opencv-python pillow numpy
if %errorlevel% neq 0 (
    echo FEHLER: pip install fehlgeschlagen.
    pause
    exit /b 1
)
echo   ✓ Python-Pakete installiert.

:: -- Erstelle Beispiele und Startskript --
echo.
echo [5/5] Vervollständige Einrichtung...
if not exist "examples" mkdir examples
if not exist "utils\output" mkdir utils\output

:: Erstelle eine Windows-spezifische Start-Datei
echo @echo off > start_uin.bat
echo echo Starte UIN Development Environment... >> start_uin.bat
echo echo. >> start_uin.bat
echo echo [1] Starte React-Frontend (http://localhost:3000)... >> start_uin.bat
echo start "" "npm" "start" >> start_uin.bat
echo echo. >> start_uin.bat
echo echo [2] Python-Tools sind bereit. >> start_uin.bat
echo echo    Skript testen mit: python utils\extract_edges.py --help >> start_uin.bat
echo echo. >> start_uin.bat
echo echo ✅ UIN v0.6 ist eingerichtet! >> start_uin.bat
echo echo    Frontend: http://localhost:3000 >> start_uin.bat
echo echo    Python-Umgebung: aktiviert >> start_uin.bat
echo echo. >> start_uin.bat
echo echo Nächste Schritte: >> start_uin.bat
echo echo    1. Öffne http://localhost:3000 im Browser >> start_uin.bat
echo echo    2. Teste den Tab "Skizze hochladen" >> start_uin.bat
echo echo    3. Extrahiere Kanten und exportiere ein UIN-Paket >> start_uin.bat
echo pause >> start_uin.bat

:: Finale Meldung
echo.
echo ==========================================
echo ✅ SETUP ERFOLGREICH ABGESCHLOSSEN!
echo ==========================================
echo.
echo Nächste Schritte:
echo   1. Starte die Anwendung mit: start_uin.bat
echo   2. Öffne im Browser: http://localhost:3000
echo   3. Folge den Anweisungen im Tool.
echo.
echo Wichtige Verzeichnisse:
echo   - src\          React Frontend
echo   - utils\        Python-Skripte (Edge Extraction)
echo   - workflows\    ComfyUI-Konfigurationen
echo.
pause
