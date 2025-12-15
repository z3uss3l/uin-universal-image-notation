#!/bin/bash
# UIN v0.6 Setup Script

echo "🚀 UIN Universal Image Notation Setup v0.6"
echo "=========================================="

# 1. Repository klonen
echo -e "\n📦 1. Repository klonen..."
git clone https://github.com/your-username/uin-universal-image-notation.git
cd uin-universal-image-notation

# 2. Frontend Abhängigkeiten installieren
echo -e "\n⚛️  2. React Frontend einrichten..."
npm install

# 3. Python Abhängigkeiten für Skripte
echo -e "\n🐍 3. Python-Umgebung einrichten..."
python3 -m venv venv
source venv/bin/activate

pip install opencv-python pillow numpy

# 4. Verzeichnisstruktur erstellen
echo -e "\n📁 4. Verzeichnisstruktur erstellen..."
mkdir -p examples/workflows utils/output

# 5. Beispielbilder und Workflows herunterladen
echo -e "\n📸 5. Beispielressourcen vorbereiten..."

# Beispiel-UIN erstellen
cat > examples/test-scene-park.json << 'EOF'
{
  "version": "0.6",
  "metadata": {
    "description": "Park-Szene bei Sonnenuntergang",
    "coordinate_system": "world_space_meters"
  },
  "canvas": {
    "aspect_ratio": "16:9",
    "bounds": {
      "x": [-4, 4],
      "y": [0, 4.5],
      "z": [-2, 6]
    }
  },
  "global": {
    "lighting": {
      "type": "golden_hour",
      "sun_position": {
        "azimuth": 285,
        "elevation": 15
      }
    }
  },
  "objects": [
    {
      "id": "person_1",
      "type": "person",
      "position": {
        "x": -1.5,
        "y": 0,
        "z": 2,
        "anchor": "feet"
      },
      "rotation": {
        "y": 15
      },
      "measurements": {
        "height": {
          "value": 1.75,
          "unit": "m"
        }
      },
      "features": {
        "hair_color_hex": "#2C1B0D",
        "clothing_style": "casual"
      }
    }
  ]
}
EOF

# 6. Start-Skript erstellen
cat > start-uin.sh << 'EOF'
#!/bin/bash
echo "Starting UIN Development Environment..."
echo ""

# Frontend starten
echo "🌐 Starting React frontend (http://localhost:3000)..."
npm start &

# Python-Umgebung aktivieren
source venv/bin/activate

echo ""
echo "✅ UIN v0.6 is running!"
echo "   Frontend: http://localhost:3000"
echo "   API Examples: python utils/extract_edges.py --help"
echo ""
echo "📚 Next steps:"
echo "   1. Open browser to http://localhost:3000"
echo "   2. Try uploading a sketch in the 'Skizze hochladen' tab"
echo "   3. Extract edges and generate a UIN package"
echo "   4. Use the exported files with ComfyUI"
EOF

chmod +x start-uin.sh

# 7. README aktualisieren
cat > QUICKSTART.md << 'EOF'
# UIN v0.6 - Quick Start Guide

## 🎯 In 5 Minuten startklar

### 1. System starten
```bash
./start-uin.sh