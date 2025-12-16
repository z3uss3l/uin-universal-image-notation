# Universal Image Notation (UIN)

UIN ist eine präzise, messbare und reversible **Beschreibungssprache** für visuelle Inhalte.  
Es definiert, *was* ein Bild ist – nicht *wie* es erzeugt wird.  

---

## 🎯 Philosophie
- **Quantifizierbar statt qualitativ**: klare Zahlen und Indizes statt vager Begriffe.  
- **Maschinen- & menschenlesbar**: JSON-Struktur für Automatisierung, klare Namen für Menschen.  
- **Domänenübergreifend**: Forensik, KI-Generierung, Archivierung, CAD.  
- **Erweiterbar**: feste Basis + flexible Features & Metadaten.  

---

## 📐 Kernkonzepte
1. **Koordinatensystem**  
   - Rechtshändig, 3D (X/Y/Z).  
   - Einheit: Meter (`world_space_meters`).  

2. **Anchors (Referenzpunkte)**  
   - Präzise Positionierung durch definierte Anker (z. B. Fußpunkt bei Personen).  

3. **Vorwärts-/Rückwärts-Modus**  
   - Vorwärts: Skizze + Beschreibung → Bild.  
   - Rückwärts: Bild → Struktur + Text → rekonstruierbar.  

---

## 📊 Vorteile
- **Präzision**: exakte Spezifikation statt Zufall.  
- **Kontrolle**: visuelle + textuelle Kontrolle.  
- **Konsistenz**: wiederholbare Ergebnisse.  
- **Kompakt**: winzige Dateigröße bei voller Rekonstruierbarkeit.  
- **Bearbeitbar**: strukturbasiert, einfach anpassbar.  

---

## 🔗 Verbindung zu uin-ngin
UIN ist die **Sprache**.  
**uin-ngin** ist der **Motor**, der diese Sprache ausführt:  
- CLI, GUI, Monitoring, Benchmarks  
- Portierbarkeit, Unterkompatibilität  
- Erweiterbare Services  

👉 Siehe [uin-ngin](https://github.com/z3uss3l/uin-ngin) für die technische Engine.

---
---

## 🧪 Technische Spezifikation v0.7

Die aktuelle Spezifikation ist im Repository unter `/docs/UINspecificationSchemaV07.json` verfügbar.
*v0.7: ISO/IEC 19794-5 konforme biometrische Standards.  ✓ (steht)*
Sie definiert alle Felder, Typen und Validierungsregeln für UIN‑Dateien.

### Validierung
```bash
# Schema validieren
python validators/schema_validator.py your_file.uin.json

# Domänenspezifische Prüfung
python validators/domain_validator.py --domain gaming avatar.uin.json

# Komplette Testsuite
pytest tests/ -v

## 🚀 Erste Schritte
- Lesen Sie die Spezifikation (`/docs/UINspecificationSchemaV06.json`).  
- Verwenden Sie UIN-Dateien als Bauplan für visuelle Inhalte.  
- Für Ausführung, Tests und Benchmarks: nutzen Sie [uin-ngin](https://github.com/z3uss3l/uin-ngin).  
```
---

## 📈 Roadmap

- Cross-Domain-Kompatibilität (CAD, DICOM, Geospatial).  
- Gaming/Avatare (VRM, Unreal Engine, Ready Player Me).
