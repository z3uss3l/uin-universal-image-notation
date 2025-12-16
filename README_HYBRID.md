# 🎨 UIN v0.6 - Hybrid Sketch Integration

**Bidirektionale Konvertierung zwischen Handskizzen, Canny Edges und fotorealistischen Bildern**

## ✨ Features

### 1. **Sketch → UIN Capsule**
- Lade Handskizzen (Foto/Scan) hoch
- Automatische Canny Edge Detection
- Hinzufügen von UIN-Attributen (Prompt, Beleuchtung, Stil, etc.)
- Export als `.uin` Capsule (nur 1-5% der Originalgröße)

### 2. **Bild → UIN Capsule (Reverse)**
- Extrahiere Canny Edges aus existierenden Bildern
- Automatische Attribut-Extraktion mit BLIP
- Dominante Farben, Beleuchtung, Komposition erkennen
- Kompakte Archivierung komplexer Bilder

### 3. **UIN Capsule → Stable Diffusion**
- Integration mit A1111 und ComfyUI
- ControlNet-ready Canny Maps
- Volle Rekonstruktionsfähigkeit
- Iterative Verbesserung möglich

## 🚀 Schnellstart

### Web Interface (Sketch Input)
```bash
# Einfach im Browser öffnen:
open sketch_input/sketch_upload.html
