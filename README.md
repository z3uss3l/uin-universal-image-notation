# uin-universal-image-notation
Universal Image Notation (UIN) v0.6 Spezifikation
*/docs
/UINspecificationSchemaV06.json*
## 🎯 Philosophie & Design-Prinzipien

UIN ist eine **präzise, messbare und reversible** Beschreibungssprache für visuelle Inhalte. Jedes Feld ist bewusst gewählt:

1. **Quantifizierbar statt qualitativ**: Statt "große Nase" → `"nasal_index": 1.2`
2. **Maschinen- & menschenlesbar**: Strukturierte JSON für Automatisierung, klare Namen für Menschen
3. **Domänenübergreifend**: Forensik, KI-Generierung, Archivierung, CAD
4. **Erweiterbar durch `features` & `metadata`**: Feste Struktur + flexible Erweiterung

## 📐 Kernkonzepte

### 1. Das Koordinatensystem
UIN verwendet ein **rechtshändiges 3D-Koordinatensystem**:
- **X**: Rechts (positiv) / Links (negativ)
- **Y**: Oben (positiv) / Unten (negativ)  
- **Z**: Vorne (positiv) / Hinten (negativ)

Standard: **Meter als Einheit** (`world_space_meters`). Für 2D-Projektionen wird Z für Tiefe genutzt.

### 2. Anchors (Referenzpunkte)
Objekte haben definierte Ankerpunkte für präzise Positionierung:
```json
"position": {
  "x": 1.5, "y": 0, "z": 2.0,
  "anchor": "feet"  // Bei Personen: Fußpunkt statt Mittelpunkt
}
```
# UIN: Ihre Skizze + KI = Perfektes Bild
## Warum UIN die Bildkommunikation revolutioniert

### 🎯 Das Problem, das UIN löst
Haben Sie schon versucht, einer KI genau zu erklären, welches Bild Sie wollen? 
- "Eine Person, ungefähr hier, mit diesem Gesichtsausdruck..."
- "Ein Produkt, das genau so aussieht, aber in einer anderen Umgebung..."
- "Können Sie das aus diesem alten Foto rekonstruieren?"

**Herausforderung**: Worte sind vage. UIN macht sie präzise.

### ✨ Die UIN-Lösung in 30 Sekunden
*was ist UIN und warum braucht die Welt es?*
Stellen Sie sich vor, Sie könnten...
1. **Eine schnelle Skizze malen** (auf Papier, Tablet oder Whiteboard)
2. **Ein Foto davon machen** und hochladen
3. **Ein paar Details eintippen** ("braune Haare", "blauer Himmel", "1,80m groß")
4. **Ein perfekt detailliertes Bild erhalten**, das Ihrer Skizze exakt folgt

**Das ist UIN**. Es verbindet Ihre kreative Intuition (die Skizze) mit der Präzision der KI.

### 🎨 Für wen ist UIN?

#### 👩‍🎨 **Kreative & Designer**
- **Storyboard-Erstellung**: Skizzieren Sie Szenen, UIN macht sie filmreif.
- **Konzept-Design**: Zeichnen Sie grobe Ideen, sehen Sie sie sofort in realistischer Form.
- **Moodboards**: Generieren Sie konsistente Bildserien aus einem Stil.

#### 🔍 **Forensik & Wissenschaft**
- **Phantombilder**: Beschreiben Sie präzise Gesichtsmerkmale (Augenabstand in mm), erhalten Sie ein realistisches Portrait.
- **Dokumentation**: Speichern Sie komplexe visuelle Daten winzig klein (95% Kompression).
- **Rekonstruktion**: Rekonstruieren Sie Bilder aus minimalen Informationen.

#### 🏭 **Industrie & Technik**
- **Technische Visualisierungen**: Aus Skizzen werden präzise Renderings.
- **Schulungsmaterial**: Generieren Sie exakte Abbildungen von Maschinen oder Prozessen.
- **Prototyping**: Visualisieren Sie Produktideen in Minuten statt Stunden.

#### 👤 **Jeder mit einer Idee**
- **Persönliche Projekte**: Visualisieren Sie Ihr Traumhaus, Ihr Buchcover, Ihr Tattoo.
- **Kommunikation**: Zeigen Sie, was Sie meinen, beschreiben Sie es nicht nur.
- **Erinnerungen**: Bewahren Sie Fotos in einer komprimierten, leicht verschlüsselten, aber easy rekonstruierbaren Form auf.

### 🔄 Die zwei magischen Arbeitsweisen

#### 1. **"Ich weiß, was ich will" (Vorwärts-Modus)**
Sie haben eine klare Vorstellung → Sie skizzieren oder beschreiben sie präzise → UIN macht daraus ein fertiges Bild.

**Echte Anwendung**: 
- *Ein Autor* skizziert eine Buchszene, beschreibt die Stimmung ("düster, regnerisch") und erhält ein perfektes Cover.
- *Ein Ermittler* beschreibt einen Zeugen („Nasenform: gebogen, Augenabstand: 68mm") und erhält ein Phantombild.

#### 2. **"Ich habe ein Bild, das ich behalten/verändern will" (Rückwärts-Modus)**
Sie haben ein Foto oder Bild → UIN extrahiert die wesentliche Struktur (als einfache Strichzeichnung) und die Details (als Text) → Sie können es neu generieren, verändern oder winzig klein speichern.

**Echte Anwendung**:
- *Ein Archivar* komprimiert 10.000 historische Fotos auf 1% ihrer Größe, ohne wichtige Details zu verlieren.
- *Ein Grafiker* nimmt ein Firmenlogo, extrahiert seine Essenz, und generiert es in unendlich vielen Variationen.

### 📊 Der UIN-Vorteil auf einen Blick

| | Herkömmliche KI-Bilder | Mit UIN |
|--|-----------------------|---------|
| **Präzision** | "Ungefähr das, was Sie meinen" | **Exakt das, was Sie spezifizieren** (Position, Größe, Farbe) |
| **Kontrolle** | Begrenzt durch Ihre Beschreibungsfähigkeit | **Visuelle + textuelle Kontrolle** (Skizze + Details) |
| **Konsistenz** | Jedes Bild ist einzigartig | **Wiederholbare Ergebnisse** bei gleicher Spezifikation |
| **Dateigröße** | Groß (MB) für hohe Qualität | **Winzig (KB)** bei gleicher Rekonstruierbarkeit |
| **Bearbeitbarkeit** | Pixel-basiert, schwer zu ändern | **Strukturbasiert**, einfach anzupassen |

### 🚀 Einfacher Einstieg - Drei Beispiele aus der Praxis

#### Beispiel 1: Das Familienportrait neu erschaffen
*"Ich habe nur ein verblasstes Foto meiner Urgroßmutter aus den 1920ern."*
- **Mit UIN**: Foto hochladen → UIN extrahiert Gesichtszüge und Kleidung → Sie passen Details an ("Augenfarbe: grün") → Neu generiertes, restauriertes Portrait.

#### Beispiel 2: Das Produktdesign
*"Ich möchte sehen, wie unsere neue Flasche in einem modernen Wohnzimmer aussieht."*
- **Mit UIN**: Flaschen-Skizze zeichnen + Maße eingeben ("Höhe: 24cm") → Wohnzimmer-Stil beschreiben ("skandinavisch, hell") → Realistische Produktvisualisierung.

#### Beispiel 3: Der Romanautor
*"Ich brauche ein Cover für mein Buch 'Die Nacht des silbernen Wolfes'."*
- **Mit UIN**: Wolf skizzieren, Mondposition angeben → Stil beschreiben ("dramatisch, mystisch, dunkelblauer Himmel") → Professionelles Buchcover in Minuten.

### 💭 Philosophie hinter UIN
UIN basiert auf einem einfachen Prinzip: **Die beste Bildkommunikation kombiniert menschliche Intuition mit maschineller Präzision.**

Ihre Skizze erfasst die **Intention** – die Komposition, die Pose, das Gefühl.  
Die KI fügt die **Perfektion** hinzu – die Details, den Realismus, die Konsistenz.

### 📈 Die Zukunft mit UIN
UIN ist mehr als ein Tool – es ist eine **neue Sprache für visuelle Ideen**. Während sich die Technologie entwickelt, wird UIN ermöglichen:
- **Echtzeit-Zusammenarbeit**: Zeichnen Sie gemeinsam mit anderen an Bildern, die sich live vervollständigen.
- **Universelle Bildsuche**: Suchen Sie nach Bildern basierend auf ihrer Struktur, nicht nur nach Schlagwörtern.
- **Visuelle Programmierung**: "Programmieren" Sie Bilder durch logische Regeln ("wenn Person A hier ist, dann ist Person B dort").

---

## 🏁 Erste Schritte mit UIN

**Für Techniker**:  
Lesen Sie die [technische Dokumentation](ARCHITECTURE.md) und klonen Sie das Repository.

**Für Kreative & Neugierige**:  
1. Besuchen Sie [uin-tool.example.com](https://github.com/uin-universal-image-notation bald live)
2. Laden Sie eine Skizze hoch
3. Geben Sie drei Details ein
4. Sehen Sie die Magie geschehen

**UIN ist Open Source** – weil die beste Art, eine neue visuelle Sprache zu entwickeln, darin besteht, sie mit der Welt zu teilen.

---
*"Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt." – Ludwig Wittgenstein*  
*UIN erweitert diese Grenzen für die visuelle Welt.*


Stell dir vor, du beschreibst einer KI ein Bild – z. B. eine Person in einem Park – und das Ergebnis sieht genau so aus, wie du es dir vorgestellt hast. Kein Zufall, keine endlosen Anpassungen. Genau das hat Universal Image Notation (UIN) vor möglich zu machen. Zumindest so weit, dies eben geht.

Viele Menschen nutzen heute KI-Tools wie Midjourney oder Stable Diffusion, um Bilder zu erzeugen. Aber oft kommt etwas komplett ganz anderes heraus: Die Person ist zu groß, der Baum im falschen Abstand, die Haarfarbe stimmt nicht. UIN löst das Problem mit einer einfachen, klaren Beschreibungssprache, die wie ein "Bauplan" für Bilder funktioniert.

**Wie funktioniert UIN?**
*UIN ist eine smarte Datei (kleiner als ein Foto!), in der du genau angibst:*
Wie groß eine Person ist (z. B. 1,68 m).
Wie weit die Augen auseinander sind.
Welche Farbe die Haare genau haben.
Wo Dinge stehen (z.B. Baum, 4 Meter hinter der Person).

Ein kostenloses Tool (das du einfach im Browser startest) zeigt dir eine Vorschau und erzeugt perfekten Text für KI.

Plus: Es erstellt automatisch eine "Tiefe-Karte", die der KI hilft, Abstände realistisch darzustellen.

**Für wen ist UIN hilfreich?**

*Kreative & Designer:*
Endlich Bilder, die genau passen – ohne stundenlanges Probieren.

*Polizei & Forensik:*
Präzise Phantombiler aus Zeugenaussagen – sicherer und schneller.

*Lehrer & Erklärer:*
Klare Illustrationen für Unterricht oder Videos.

*Ein Jeder mit KI:*
Von Hobby bis Profi bessere Ergebnisse auf Knopfdruck.

*Die Vision:*
UIN macht KI-Bilder zugänglich und zuverlässig für alle.

*Ziel:*
kein "Glücksspiel" mehr, sondern präzise Kontrolle.

*Aktueller Stand:*
mit UIN sehen die Bilder aus wie geplant gefühlt in über 90% der Fälle! 

Machst das besser? Metrik ist, ein Originalbild wiederzutreffen: bring deine Optimierung gerne ein und hilf mit, UIN zu verbessern.

Lad das kostenlose Tool herunter, teste aus und erstell deine Pics. 

**open-source**
gemeinsam machen wirs besser!

Probiers aus. Die Zukunft der Bildbeschreibung beginnt jetzt. 🚀


1. **Repository erstellen** mit der bereitgestellten Struktur
2. **Dateien kopieren** in die entsprechenden Ordner
3. **Setup-Skript ausführen**: `chmod +x setup.sh && ./setup.sh`
4. **Anwendung starten**: `./start-uin.sh`
5. **Ersten Roundtrip testen**: Skizze → Kanten → ComfyUI → Ergebnis

*Falls nicht schon gemacht, Fehler  auftreten:*
# Virtuelle Umgebung erstellen und aktivieren (empfohlen)
python3 -m venv venv
source venv/bin/activate  
# Auf Windows: venv\Scripts\activate

# Abhängigkeiten installieren
pip install opencv-python pillow numpy

# Skript testen
python utils/extract_edges.py --help

## 🪟 Windows Installation
1. Stelle sicher, dass [Node.js](https://nodejs.org) und [Python 3.8+](https://python.org) installiert sind.
2. Klone das Repository: `git clone https://github.com/z3uss3l/uin-universal-image-notation.git`
3. Führe das Setup-Skript aus: Doppelklick auf **`setup.bat`**
4. Starte UIN mit: Doppelklick auf **`start_uin.bat`**

MCP / N8N

```

🔌 n8n-Workflow-Beispiele (praktische Anwendung)

Workflow 1: Automatische Bildanalyse-Pipeline

```
[Datei-Upload] → [UIN: Extract Edges] → [ChatGPT: Analyse JSON] → [Datenbank: Speichern] → [Email: Report senden]
```

Workflow 2: KI-Bild-Generierung mit Qualitätskontrolle

```
[Formular: UIN-Eingabe] → [UIN: Generate Prompt] → [Stable Diffusion API] → [UIN: Compare with Original] → [Slack: Ergebnis teilen]
```

📊 Aktueller Status & Prioritäten
✅ Bereits vorhanden (direkt nutzbar):

1. Strukturierte JSON API
MCP-Tool-Definitionen
2. CLI-Tools (extract_edges.py) - Direkt in n8n integrierbar via exec
3. Komplette Logik für Vorwärts/Rückwärts-Konvertierung
```
next steps:
1. Minimaler MCP-Server mcp_server.py
2. n8n-Custom-Node
Einfache Integration
3. Beispiel-Workflows
In workflows/n8n/ speichern
-----------------------------
Snippets: uin to unreal avatar
```
image to textual description compression convention
def uin_to_unreal_avatar(uin_data):
    avatar_config = {
        "metahuman_preset": map_body_type(uin_data["avatar_attributes"]["body_type"]),
        "facial_features": {
            "eye_size": uin_data["avatar_attributes"]["facial_features"]["eye_size"],
            "jaw_strength": uin_data["avatar_attributes"]["facial_features"]["jaw_strength"]
        },
        "cosmetics": []
    }
    
    for mod in uin_data["avatar_attributes"]["cosmetic_modifications"]:
        if mod["type"] == "cyberware":
            avatar_config["cosmetics"].append({
                "type": "attachment",
                "socket": map_location(mod["location"]),
                "asset": "Cyberware/" + mod["style"]
            })
    
    return avatar_config
