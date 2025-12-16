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

🧪 **Technische Spezifikation v0.8**

Die aktuelle Spezifikation ist im Repository unter `/docs/UINspecificationSchemaV08.json` verfügbar.  
Sie definiert alle Felder, Typen und Validierungsregeln für UIN‑Dateien.
 Universal Image Notation (UIN) v0.8 – Technische Spezifikation   body { font-family: system-ui, sans-serif; background: #0f1220; color: #e6e9ff; margin: 0; } header { padding: 32px 24px; border-bottom: 1px solid #242844; } h1 { margin: 0 0 8px; font-size: 28px; } header p { margin: 0; color: #a9b0d9; } main { padding: 24px; max-width: 1000px; margin: 0 auto; } section { background: #171a2b; border: 1px solid #242844; border-radius: 12px; padding: 20px; margin-bottom: 18px; } h2 { font-size: 20px; margin: 0 0 12px; } pre { background: #0b0e1a; border: 1px solid #22263f; border-radius: 10px; padding: 14px; overflow: auto; font-family: monospace; } footer { color: #a9b0d9; text-align: center; padding: 24px; border-top: 1px solid #242844; }

Universal Image Notation (UIN) v0.8 – Technische Spezifikation
==============================================================

Formal, vollständig und validierbar. Fokus: Sprache/Notation, nicht Engine.

1\. Scope
---------

Diese Spezifikation definiert die Universal Image Notation (UIN) Version 0.8. Neu sind optionale Erweiterungen für **MCP‑Verträge** und **Workflow‑Hooks**.

2\. Normative Verweise
----------------------

*   JSON Schema Draft‑07
*   ISO/IEC 19794‑5:2011 – Biometrische Datenformate
*   DICOM Standard – Medizinische Bildgebung
*   EPSG Codes – Geospatial Koordinatensysteme

3\. Modellübersicht (UML‑ähnlich)
---------------------------------

    UIN v0.8
     ├─ version : "0.8"
     ├─ metadata : { title, description, author, created, tags, document_hash, conformance }
     ├─ canvas : { aspect_ratio, bounds[x,y,z], coordinate_system }
     ├─ global : { lighting, style }
     ├─ objects[] : Object {...}
     ├─ relations[] : {...}
     ├─ edge_reference : {...}
     ├─ cross_domain_mappings : {...}
     ├─ compatibility : { ai_models[] }
     ├─ mcp_contracts : { contexts[], capability_negotiation }
     └─ workflow_hooks : { triggers[], nodes[], edges[] }
    

4\. Validierung
---------------

    python validators/schema_validator.py your_file.uin.json docs/UINspecificationSchemaV08.json
    python validators/conformance_validator.py your_file.uin.json
    python validators/workflow_io_validator.py your_file.uin.json
    python validators/mcp_validator.py your_file.uin.json
    

5\. Beispiel
------------

    {
      "version": "0.8",
      "metadata": {
        "title": "Beispiel UIN v0.8",
        "conformance": "UIN-Full-0.8",
        "document_hash": "sha256:..."
      },
      "canvas": {
        "aspect_ratio": "16:9",
        "bounds": {"x":[0,1],"y":[0,1],"z":[0,1]},
        "coordinate_system": "normalized_0_1"
      },
      "objects": [
        { "id": "person1", "type": "human", "position": {"x":0.5,"y":0.1,"z":0.0} }
      ],
      "mcp_contracts": {
        "contexts": [
          { "id": "default", "capabilities": ["render"], "constraints": {"max_runtime_ms": 5000} }
        ]
      },
      "workflow_hooks": {
        "triggers": [ { "id": "t1", "type": "on_render_complete" } ],
        "nodes": [
          {
            "id": "n1",
            "kind": "webhook",
            "io": {
              "inputs": [{"name":"result","type":"json"}],
              "outputs": [{"name":"ack","type":"json"}]
            },
            "security": {"requires_auth": true, "auth_type": "api_key"}
          }
        ],
        "edges": [ { "from": "t1", "to": "n1" } ]
      }
    }
    

UIN v0.8 – Technische Spezifikation • © 2025
### Validierung
```bash
# Schema validieren
python validators/schema_validator.py your_file.uin.json

# Domänenspezifische Prüfung
python validators/domain_validator.py --domain gaming avatar.uin.json

# Komplette Testsuite
pytest tests/ -v
