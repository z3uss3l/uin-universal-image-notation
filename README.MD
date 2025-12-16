# Universal Image Notation (UIN)

UIN ist eine präzise, messbare und reversible **Beschreibungssprache** für visuelle Inhalte.  
Sie definiert, *was* ein Bild ist – nicht *wie* es erzeugt wird.  
Das Ziel: Bildkommunikation präzise, wiederholbar und domänenübergreifend machen.

---

🎯 **Philosophie & Design-Prinzipien**

- **Quantifizierbar statt qualitativ**: klare Zahlen und Indizes statt vager Begriffe.  
- **Maschinen- & menschenlesbar**: JSON-Struktur für Automatisierung, klare Namen für Menschen.  
- **Domänenübergreifend**: Forensik, KI-Generierung, Archivierung, CAD.  
- **Erweiterbar**: feste Basis + flexible Features & Metadaten.  
- **Standards by Design**: ab v0.7 ISO/IEC 19794‑5 Schlüssel für biometrische Daten.  

---

📐 **Kernkonzepte**

1. **Koordinatensystem**  
   - Rechtshändig, 3D (X/Y/Z).  
   - Einheit: Meter (`world_space_meters`).  
   - Für 2D-Projektionen wird Z für Tiefe genutzt.  

2. **Anchors (Referenzpunkte)**  
   - Präzise Positionierung durch definierte Anker (z. B. Fußpunkt bei Personen).  

3. **Vorwärts-/Rückwärts-Modus**  
   - Vorwärts: Skizze + Beschreibung → Bild.  
   - Rückwärts: Bild → Struktur + Text → rekonstruierbar.  

---

🎯 **Das Problem, das UIN löst**

Worte sind vage.  
„Eine Person, ungefähr hier, mit diesem Gesichtsausdruck…“  
„Ein Produkt, das genau so aussieht, aber in einer anderen Umgebung…“  

Mit UIN wird aus vagen Worten eine präzise Spezifikation:  
- Position, Größe, Farbe, Abstand.  
- Wiederholbar, komprimierbar, validierbar.  

---

✨ **Die UIN-Lösung in 30 Sekunden**

- Skizze erstellen (Papier, Tablet, Whiteboard).  
- Foto hochladen.  
- Details eintippen („braune Haare“, „blauer Himmel“, „1,80m groß“).  
- Ein perfekt detailliertes Bild erhalten, das der Skizze exakt folgt.  

---

🎨 **Für wen ist UIN?**

👩‍🎨 **Kreative & Designer**  
Storyboard, Konzeptdesign, Moodboards.  

🔍 **Forensik & Wissenschaft**  
Phantombilder, Dokumentation, Rekonstruktion.  

🏭 **Industrie & Technik**  
Technische Visualisierungen, Schulungsmaterial, Prototyping.  

👤 **Jeder mit einer Idee**  
Persönliche Projekte, Kommunikation, Erinnerungen.  

---

🚀 **Praktische Beispiele**

**Beispiel 1: Das Familienportrait neu erschaffen**  
„Ich habe nur ein verblasstes Foto meiner Urgroßmutter aus den 1920ern.“  
- Mit UIN: Foto hochladen → Struktur extrahieren → Details anpassen → neues Portrait generieren.  

**Beispiel 2: Das Produktdesign**  
„Ich möchte sehen, wie unsere neue Flasche in einem modernen Wohnzimmer aussieht.“  
- Mit UIN: Maße eingeben + Stil beschreiben → realistische Produktvisualisierung.  

**Beispiel 3: Der Romanautor**  
„Ich brauche ein Cover für mein Buch *Die Nacht des silbernen Wolfes*.“  
- Mit UIN: Szene skizzieren + Details definieren → professionelles Buchcover.  

---

📊 **Der UIN-Vorteil auf einen Blick**

- **Präzision**: exakte Spezifikation statt Zufall.  
- **Kontrolle**: visuelle + textuelle Kontrolle.  
- **Konsistenz**: reproduzierbare Ergebnisse.  
- **Kompakt**: winzige Dateigröße bei voller Rekonstruierbarkeit.  
- **Bearbeitbar**: strukturbasiert, einfach anpassbar.  

---

📈 **Die Zukunft mit UIN**

- Echtzeit-Zusammenarbeit: gemeinsame Bildbearbeitung live.  
- Universelle Bildsuche: nach Struktur statt Schlagworten.  
- Visuelle Programmierung: logische Regeln für Bildaufbau.  

---

🏁 **Erste Schritte mit UIN**

Für Techniker:
- Lesen Sie die Spezifikation (`/docs/UINspecificationSchemaV07.json`).  
- Validieren Sie Dateien mit `schema_validator.py`.  

Für Kreative & Neugierige:
- Skizze hochladen.  
- Details eingeben.  
- Ergebnis generieren.  

---

🧪 **Technische Spezifikation v0.7**

Die aktuelle Spezifikation ist im Repository unter `/docs/UINspecificationSchemaV07.json` verfügbar.  
Sie definiert alle Felder, Typen und Validierungsregeln für UIN‑Dateien.

### Validierung
```bash
# Schema validieren
python validators/schema_validator.py your_file.uin.json

# Domänenspezifische Prüfung
python validators/domain_validator.py --domain gaming avatar.uin.json

# Komplette Testsuite
pytest tests/ -v
