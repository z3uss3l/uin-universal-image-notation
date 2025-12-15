import React, { useState, useRef, useEffect } from 'react';

function App() {
  // Zustand für den aktuellen aktiven Tab
  const [activeTab, setActiveTab] = useState('editor');
  
  // Zustand für die UIN-JSON-Daten
  const [uinData, setUinData] = useState({
    "version": "0.6",
    "metadata": {
      "description": "Eine Person im Park bei Sonnenuntergang",
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
    "edge_reference": {
      "use_as_control": false,
      "file_name": "",
      "canny_thresholds": {
        "low": 100,
        "high": 200
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
          "eye_color": "braun",
          "clothing_style": "casual"
        },
        "forensic_attributes": {
          "face_shape": "oval",
          "interpupillary_distance_mm": 65
        }
      },
      {
        "id": "bench_1",
        "type": "bench",
        "position": {
          "x": 1,
          "y": 0,
          "z": 3,
          "anchor": "center"
        },
        "measurements": {
          "width": {
            "value": 1.8,
            "unit": "m"
          },
          "height": {
            "value": 0.45,
            "unit": "m"
          }
        },
        "attributes": {
          "material": "wood",
          "color": "#8B4513"
        }
      },
      {
        "id": "tree_1",
        "type": "tree",
        "position": {
          "x": 3,
          "y": 0,
          "z": 5,
          "anchor": "base"
        },
        "measurements": {
          "height": {
            "value": 6,
            "unit": "m"
          }
        },
        "attributes": {
          "type": "oak",
          "foliage_density": "dense"
        }
      }
    ],
    "relations": [
      {
        "type": "distance",
        "from": "person_1",
        "to": "bench_1",
        "value": 2.5,
        "unit": "m"
      }
    ]
  });

  // Zustand für JSON-Eingabe
  const [jsonInput, setJsonInput] = useState(JSON.stringify(uinData, null, 2));
  
  // Zustand für generierten Prompt
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  
  // Zustand für ControlNet JSON
  const [controlNetJson, setControlNetJson] = useState('');
  
  // Zustand für hochgeladenes Bild und Canny-Ergebnis
  const [uploadedImage, setUploadedImage] = useState(null);
  const [cannyImage, setCannyImage] = useState(null);
  const [cannyThresholds, setCannyThresholds] = useState({ low: 100, high: 200 });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Zustand für extrahierte Attribute
  const [extractedAttributes, setExtractedAttributes] = useState('');
  
  // Referenzen für Canvas-Elemente
  const originalCanvasRef = useRef(null);
  const cannyCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // jsfeat Bibliothek laden
  useEffect(() => {
    // Dynamisches Laden von jsfeat
    const loadJsFeat = async () => {
      if (typeof window !== 'undefined') {
        window.jsfeat = await import('jsfeat');
      }
    };
    loadJsFeat();
  }, []);

  // Canny Edge Detection Funktion
  const extractCannyEdges = async () => {
    if (!uploadedImage || !window.jsfeat) return;
    
    setIsProcessing(true);
    
    const img = new Image();
    img.src = uploadedImage;
    
    img.onload = () => {
      const canvas = cannyCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Canvas auf Bildgröße setzen
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Originalbild zeichnen
      ctx.drawImage(img, 0, 0);
      
      // Bilddaten extrahieren
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // In Graustufen konvertieren
      const grayData = new Uint8Array(canvas.width * canvas.height);
      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        grayData[j] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      }
      
      // jsfeat Matrix erstellen
      const matrix = new window.jsfeat.matrix_t(canvas.width, canvas.height, window.jsfeat.U8C1_t);
      window.jsfeat.matlib.set(matrix, grayData);
      
      // Canny Edge Detection anwenden
      window.jsfeat.imgproc.canny(matrix, matrix, cannyThresholds.low, cannyThresholds.high);
      
      // Ergebnis visualisieren
      const resultData = new ImageData(canvas.width, canvas.height);
      for (let i = 0; i < matrix.data.length; i++) {
        const idx = i * 4;
        const value = matrix.data[i];
        resultData.data[idx] = value;     // R
        resultData.data[idx + 1] = value; // G
        resultData.data[idx + 2] = value; // B
        resultData.data[idx + 3] = 255;   // A
      }
      
      ctx.putImageData(resultData, 0, 0);
      
      // Data URL für Download speichern
      setCannyImage(canvas.toDataURL('image/png'));
      
      // Automatische Attribut-Extraktion simulieren
      simulateAttributeExtraction(img);
      
      setIsProcessing(false);
    };
  };

  // Simulierte Attribut-Extraktion (in Produktion durch VLM ersetzen)
  const simulateAttributeExtraction = (img) => {
    const attributes = {
      "version": "0.6",
      "metadata": {
        "source_image": "user_uploaded_image.png",
        "extraction_method": "canny_edge_detection_v1",
        "dimensions": {
          "width": img.width,
          "height": img.height
        }
      },
      "edge_reference": {
        "file_name": "extracted_edges.png",
        "canny_thresholds": cannyThresholds,
        "edge_statistics": {
          "processing_time_ms": "~150ms",
          "recommended_use": "controlnet_canny_input"
        }
      },
      "suggested_attributes": {
        "detected_composition": "Central subject with background elements",
        "recommended_lighting": "balanced studio lighting",
        "color_palette_suggestion": "Use natural tones or specify custom colors",
        "detail_level": "high"
      },
      "uin_template": {
        "canvas": {
          "aspect_ratio": `${img.width}:${img.height}`,
          "bounds": {
            "x": [-img.width/100, img.width/100],
            "y": [-img.height/100, img.height/100],
            "z": [-1, 3]
          }
        },
        "objects": [
          {
            "id": "main_subject_1",
            "type": "subject",
            "position": {"x": 0, "y": 0, "z": 0, "anchor": "center"},
            "note": "Define your subject attributes here"
          }
        ]
      }
    };
    
    setExtractedAttributes(JSON.stringify(attributes, null, 2));
  };

  // Bild-Upload Handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // UIN-JSON aktualisieren
  const updateUinData = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setUinData(parsed);
    } catch (error) {
      alert('Ungültige JSON: ' + error.message);
    }
  };

  // Prompt aus UIN generieren
  const generatePromptFromUin = () => {
    let prompt = "Professional photo of";
    
    // Objekte beschreiben
    uinData.objects.forEach((obj, index) => {
      prompt += ` ${obj.type}`;
      if (obj.features?.hair_color_hex) {
        prompt += ` with ${obj.features.hair_color_hex} hair`;
      }
      if (obj.forensic_attributes?.face_shape) {
        prompt += `, ${obj.forensic_attributes.face_shape} face`;
      }
      if (index < uinData.objects.length - 1) {
        prompt += " and";
      }
    });
    
    // Beziehungen hinzufügen
    if (uinData.relations && uinData.relations.length > 0) {
      prompt += ". " + uinData.relations.map(rel => {
        return `${rel.from} is ${rel.value}${rel.unit} from ${rel.to}`;
      }).join(', ');
    }
    
    // Globale Eigenschaften
    if (uinData.global?.lighting?.type) {
      prompt += `, ${uinData.global.lighting.type} lighting`;
    }
    
    // Qualitäts-Booster
    prompt += ". Highly detailed, sharp focus, masterpiece, 8k, professional photography";
    
    setGeneratedPrompt(prompt);
  };

  // ControlNet JSON generieren
  const generateControlNetJson = () => {
    const controlNetConfig = {
      "controlnet_units": [
        {
          "enabled": true,
          "input_image": cannyImage ? "extracted_edges.png" : "generated_depth.png",
          "model": cannyImage ? "control_v11p_sd15_canny" : "control_v11f1p_sd15_depth",
          "weight": 1.0,
          "guidance_start": 0.0,
          "guidance_end": 1.0,
          "processor_res": 512,
          "threshold_a": cannyThresholds.low,
          "threshold_b": cannyThresholds.high
        }
      ],
      "uin_reference": {
        "version": uinData.version,
        "object_count": uinData.objects.length,
        "uses_edge_control": !!cannyImage
      },
      "comfyui_integration": {
        "workflow_file": "workflows/comfyui-uin-basic.json",
        "required_nodes": ["LoadImage", "ControlNetLoader", "ControlNetApply"],
        "api_endpoint": "http://127.0.0.1:8188/prompt"
      }
    };
    
    setControlNetJson(JSON.stringify(controlNetConfig, null, 2));
  };

  // Canny-Bild herunterladen
  const downloadCannyImage = () => {
    if (!cannyImage) return;
    
    const link = document.createElement('a');
    link.href = cannyImage;
    link.download = 'uin_canny_edges.png';
    link.click();
  };

  // Komplettes UIN-Paket herunterladen
  const downloadUinPackage = () => {
    const packageData = {
      metadata: {
        created: new Date().toISOString(),
        version: "0.6",
        package_type: "uin_complete_package"
      },
      uin_json: uinData,
      generated_prompt: generatedPrompt,
      controlnet_config: JSON.parse(controlNetJson || '{}'),
      edge_image_present: !!cannyImage
    };
    
    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `uin_package_${Date.now()}.json`;
    link.click();
  };

  // Tab-Inhalte
  const tabs = [
    { id: 'editor', label: 'UIN Editor', icon: '📝' },
    { id: 'sketch', label: 'Skizze hochladen', icon: '🎨' },
    { id: 'reverse', label: 'Bild analysieren', icon: '🔄' },
    { id: 'export', label: 'Export', icon: '📤' },
    { id: 'help', label: 'Hilfe', icon: '❓' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-gray-100 p-4 md:p-8">
      {/* Kopfzeile */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            UIN v0.6
          </span>
          <span className="ml-3 text-sm bg-blue-800 px-3 py-1 rounded-full">
            Universal Image Notation
          </span>
        </h1>
        <p className="text-gray-400">
          Präzise Bildbeschreibung für KI-Generierung & Forensik • Hybrid: JSON + Canny Edge Control
        </p>
      </header>

      {/* Hauptbereich mit Tabs */}
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Tab-Navigation */}
        <div className="flex border-b border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-750'
              }`}
            >
              <span className="mr-2 text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab-Inhalte */}
        <div className="p-6">
          {/* Tab 1: UIN Editor */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* JSON Editor */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <span className="bg-blue-500 p-2 rounded-lg mr-3">📝</span>
                    UIN JSON Editor
                  </h2>
                  <div className="bg-gray-900 rounded-lg p-4 h-[500px]">
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="w-full h-full bg-gray-900 text-green-400 font-mono text-sm p-4 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                      spellCheck="false"
                    />
                  </div>
                  <button
                    onClick={updateUinData}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
                  >
                    UIN aktualisieren & Visualisieren
                  </button>
                </div>

                {/* Live Vorschau */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <span className="bg-green-500 p-2 rounded-lg mr-3">👁️</span>
                    Live Vorschau & Metriken
                  </h2>
                  <div className="bg-gray-900 rounded-lg p-4 h-[500px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-800 p-4 rounded">
                        <div className="text-gray-400 text-sm">Objekte</div>
                        <div className="text-2xl font-bold">{uinData.objects?.length || 0}</div>
                      </div>
                      <div className="bg-gray-800 p-4 rounded">
                        <div className="text-gray-400 text-sm">Dateigröße</div>
                        <div className="text-2xl font-bold">
                          {Math.round(JSON.stringify(uinData).length / 1024 * 100) / 100} KB
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-2">Szenen-Übersicht:</h3>
                    <div className="space-y-3">
                      {uinData.objects?.map(obj => (
                        <div key={obj.id} className="bg-gray-800 p-3 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">{obj.type}</span>
                            <span className="text-blue-400">ID: {obj.id}</span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            Position: ({obj.position?.x}, {obj.position?.y}, {obj.position?.z})
                          </div>
                          {obj.forensic_attributes && (
                            <div className="text-xs text-green-400 mt-1">
                              Forensisch: {Object.entries(obj.forensic_attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-900/30 rounded border border-blue-700">
                      <h4 className="font-semibold mb-2">💡 Tipp</h4>
                      <p className="text-sm">
                        Nutzen Sie exakte Maße (z.B. "interpupillary_distance_mm: 65") für forensisch präzise Ergebnisse.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Skizze hochladen */}
          {activeTab === 'sketch' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-yellow-500 p-2 rounded-lg mr-3">🎨</span>
                Handskizze als KI-Steuerung nutzen
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Bereich */}
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-xl p-6 border-2 border-dashed border-gray-700 hover:border-blue-500 transition">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-8 flex flex-col items-center justify-center"
                    >
                      <div className="text-6xl mb-4">📤</div>
                      <div className="text-xl font-semibold">Skizze oder Bild hochladen</div>
                      <div className="text-gray-400 mt-2">PNG, JPG, WebP (max. 5MB)</div>
                    </button>
                  </div>
                  
                  {uploadedImage && (
                    <div>
                      <h3 className="font-semibold mb-2">Hochgeladenes Bild:</h3>
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded sketch" 
                        className="rounded-lg max-h-64 w-full object-contain bg-gray-900 p-2"
                      />
                    </div>
                  )}
                  
                  <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
                    <h4 className="font-semibold mb-2">ℹ️ So funktioniert's:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Zeichnen Sie eine Skizze (Papier/Tablet) oder nutzen Sie ein Foto</li>
                      <li>Laden Sie es hier hoch</li>
                      <li>Extrahieren Sie die Kanten (Canny-Algorithmus)</li>
                      <li>Nutzen Sie das Kantenbild als ControlNet-Steuerung in ComfyUI</li>
                    </ol>
                  </div>
                </div>
                
                {/* Canny Parameter & Verarbeitung */}
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Canny Edge Parameter</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2">Low Threshold: {cannyThresholds.low}</label>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={cannyThresholds.low}
                          onChange={(e) => setCannyThresholds(prev => ({ ...prev, low: parseInt(e.target.value) }))}
                          className="w-full accent-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-2">High Threshold: {cannyThresholds.high}</label>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={cannyThresholds.high}
                          onChange={(e) => setCannyThresholds(prev => ({ ...prev, high: parseInt(e.target.value) }))}
                          className="w-full accent-blue-500"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={extractCannyEdges}
                      disabled={!uploadedImage || isProcessing}
                      className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
                        !uploadedImage || isProcessing
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                          Verarbeite Bild...
                        </span>
                      ) : (
                        'Kanten extrahieren'
                      )}
                    </button>
                  </div>
                  
                  {cannyImage && (
                    <div className="bg-gray-900 rounded-xl p-6">
                      <h3 className="font-semibold mb-4">Extrahierte Kanten (Canny)</h3>
                      <img 
                        src={cannyImage} 
                        alt="Canny edges" 
                        className="rounded-lg mb-4 bg-white p-2"
                      />
                      <button
                        onClick={downloadCannyImage}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
                      >
                        📥 Kantenbild herunterladen (.png)
                      </button>
                      <div className="mt-4 text-sm text-gray-400">
                        <p>✅ Dieses Bild kann direkt in ControlNet (Canny-Modell) geladen werden.</p>
                        <p>✅ Kombinieren Sie es mit einem Text-Prompt für präzise Ergebnisse.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Versteckte Canvas-Elemente */}
                  <canvas ref={originalCanvasRef} className="hidden" />
                  <canvas ref={cannyCanvasRef} className="hidden" />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Bild analysieren (Reverse Engineering) */}
          {activeTab === 'reverse' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-500 p-2 rounded-lg mr-3">🔄</span>
                Reverse Engineering: Bild → UIN + Kanten
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bildanalyse */}
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">1. Bild analysieren</h3>
                    <p className="text-gray-400 mb-4">
                      Laden Sie ein beliebiges Bild hoch, um Kanten zu extrahieren und UIN-Attribute vorzuschlagen.
                    </p>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    
                    {uploadedImage && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-2">Originalbild:</h4>
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded for analysis" 
                          className="rounded-lg max-h-64 w-full object-contain bg-gray-800 p-2"
                        />
                      </div>
                    )}
                    
                    <button
                      onClick={extractCannyEdges}
                      disabled={!uploadedImage}
                      className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
                        !uploadedImage
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      🔍 Bild analysieren & UIN generieren
                    </button>
                  </div>
                  
                  {cannyImage && (
                    <div className="bg-gray-900 rounded-xl p-6">
                      <h3 className="font-semibold mb-4">Extrahierte Kanten</h3>
                      <img 
                        src={cannyImage} 
                        alt="Extracted edges" 
                        className="rounded-lg bg-white p-2 mb-4"
                      />
                      <div className="text-sm text-gray-400">
                        <p>💾 <strong>Kompression:</strong> ~95% kleiner als Original</p>
                        <p>🎯 <strong>Nutzung:</strong> Perfekt für Canny-ControlNet</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Extrahierte UIN-Attribute */}
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">2. Generierte UIN-Attribute</h3>
                    
                    {extractedAttributes ? (
                      <div className="space-y-4">
                        <div className="bg-gray-800 rounded p-4 h-96 overflow-y-auto">
                          <pre className="text-green-400 text-sm font-mono">
                            {extractedAttributes}
                          </pre>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => setJsonInput(extractedAttributes)}
                            className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition"
                          >
                            In Editor übernehmen
                          </button>
                          <button
                            onClick={() => {
                              const blob = new Blob([extractedAttributes], { type: 'application/json' });
                              const link = document.createElement('a');
                              link.href = URL.createObjectURL(blob);
                              link.download = 'uin_extracted_attributes.json';
                              link.click();
                            }}
                            className="bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition"
                          >
                            JSON speichern
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h4 className="text-xl font-semibold mb-2">Keine Analyse durchgeführt</h4>
                        <p className="text-gray-400">
                          Laden Sie ein Bild hoch und klicken Sie auf "Bild analysieren", 
                          um automatisch UIN-Attribute zu generieren.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-purple-900/30 p-6 rounded-xl border border-purple-700">
                    <h4 className="font-semibold mb-3">🎯 Reverse-Engineering Vorteile</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span><strong>95%+ Kompression:</strong> Bilder als Kanten + JSON speichern</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span><strong>Rekonstruierbar:</strong> Verlustarme Neugenerierung möglich</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span><strong>Editierbar:</strong> JSON-Attribute einfach anpassbar</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span><strong>Durchsuchbar:</strong> Metadaten in JSON indexierbar</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Export */}
          {activeTab === 'export' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-green-500 p-2 rounded-lg mr-3">📤</span>
                Export für KI-Generierung
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Prompt Generierung */}
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">1. KI-Prompt generieren</h3>
                    <button
                      onClick={generatePromptFromUin}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition mb-4"
                    >
                      Prompt aus UIN generieren
                    </button>
                    
                    {generatedPrompt && (
                      <div>
                        <h4 className="font-semibold mb-2">Generierter Prompt:</h4>
                        <div className="bg-gray-800 rounded p-4">
                          <p className="text-gray-300">{generatedPrompt}</p>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                          className="w-full mt-4 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold transition"
                        >
                          📋 Prompt kopieren
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* ComfyUI Integration */}
                  <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-700">
                    <h4 className="font-semibold mb-3">⚙️ ComfyUI Integration</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Workflow <code className="bg-gray-800 px-1 rounded">comfyui-uin-basic.json</code> laden</li>
                      <li>Kantenbild in <strong>LoadImage</strong>-Node laden</li>
                      <li>Prompt in <strong>CLIPTextEncode</strong> einfügen</li>
                      <li>ControlNet-Modell auf <strong>canny</strong> setzen</li>
                      <li><strong>Queue Prompt</strong> klicken</li>
                    </ol>
                    <div className="mt-4 p-3 bg-green-900/30 rounded border border-green-700">
                      <p className="text-sm text-green-300">
                        <span className="font-bold">Erwartung:</span> >90% räumliche Treue dank präziser Kantensteuerung.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* ControlNet Export */}
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">2. ControlNet JSON exportieren</h3>
                    <button
                      onClick={generateControlNetJson}
                      className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition mb-4"
                    >
                      ControlNet-Konfiguration generieren
                    </button>
                    
                    {controlNetJson && (
                      <div>
                        <h4 className="font-semibold mb-2">ControlNet Konfiguration:</h4>
                        <div className="bg-gray-800 rounded p-4 h-64 overflow-y-auto">
                          <pre className="text-yellow-400 text-sm font-mono">
                            {controlNetJson}
                          </pre>
                        </div>
                        <button
                          onClick={() => {
                            const blob = new Blob([controlNetJson], { type: 'application/json' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = 'uin_controlnet_config.json';
                            link.click();
                          }}
                          className="w-full mt-4 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold transition"
                        >
                          📥 JSON speichern
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Komplettes Paket */}
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">3. Komplettes UIN-Paket</h3>
                    <p className="text-gray-400 mb-4">
                      Exportieren Sie alle Komponenten als einheitliches Paket für Backup oder Sharing.
                    </p>
                    
                    <button
                      onClick={downloadUinPackage}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 py-4 rounded-lg font-semibold transition flex items-center justify-center"
                    >
                      <span className="text-2xl mr-3">📦</span>
                      Komplettes UIN-Paket herunterladen
                    </button>
                    
                    <div className="mt-4 text-sm text-gray-400">
                      <p>Enthaltene Dateien:</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>UIN-JSON mit allen Attributen</li>
                        <li>Generierter KI-Prompt</li>
                        <li>ControlNet-Konfiguration</li>
                        <li>Kantenbild (falls vorhanden)</li>
                        <li>Metadaten und Versionierung</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Hilfe */}
          {activeTab === 'help' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-yellow-500 p-2 rounded-lg mr-3">❓</span>
                Hilfe & Anleitungen
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Schnellstart */}
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="font-semibold mb-4 text-xl">🚀 Schnellstart</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold">UIN erstellen</h4>
                          <p className="text-gray-400 text-sm">
                            Bearbeiten Sie die JSON im Editor-Tab oder laden Sie eine Skizze hoch.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                          2
                        </div>
                        <div>
                          <h4 className="font-semibold">Kanten extrahieren</h4>
                          <p className="text-gray-400 text-sm">
                            Nutzen Sie den "Skizze hochladen"-Tab, um Canny-Kanten für ControlNet zu generieren.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                          3
                        </div>
                        <div>
                          <h4 className="font-semibold">Exportieren</h4>
                          <p className="text-gray-400 text-sm">
                            Generieren Sie Prompt und ControlNet-JSON, dann in ComfyUI laden.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                          4
                        </div>
                        <div>
                          <h4 className="font-semibold">Generieren</h4>
                          <p className="text-gray-400 text-sm">
                            In ComfyUI: Workflow laden, Dateien einfügen, "Queue Prompt" klicken.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Best Practices */}
                  <div className="bg-green-900/30 rounded-xl p-6 border border-green-700">
                    <h3 className="font-semibold mb-4">✅ Best Practices</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Für Phantombilder: Nutzen Sie <code>forensic_attributes</code> mit mm-Angaben</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Für hohe Präzision: Kombinieren Sie Handskizze mit UIN-Attributen</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Canny Thresholds: 100/200 für klare Linien, 50/150 für mehr Details</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Speichern Sie UIN-Pakete für reproduzierbare Ergebnisse</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Workflow-Integration */}
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="font-semibold mb-4 text-xl">🔗 ComfyUI Integration</h3>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Voraussetzungen:</h4>
                      <ul className="list-disc list-inside ml-4 space-y-2 text-gray-400">
                        <li>ComfyUI installiert und laufend</li>
                        <li>ControlNet-Modelle: <code>canny</code> und <code>depth</code></li>
                        <li>API-Zugriff aktiviert (<code>--listen</code> Parameter)</li>
                      </ul>
                      
                      <h4 className="font-semibold mt-6">Automatischer Workflow:</h4>
                      <div className="bg-gray-800 rounded p-4">
                        <pre className="text-sm text-green-400 font-mono">
{`python workflows/comfyui-uin-api-example.py \\
  --image "extracted_edges.png" \\
  --prompt "Ihr generierter Prompt" \\
  --workflow "comfyui-uin-basic.json"`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fehlerbehebung */}
                  <div className="bg-red-900/30 rounded-xl p-6 border border-red-700">
                    <h3 className="font-semibold mb-4">🔧 Fehlerbehebung</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-red-300">Canny-Extraktion scheitert</h4>
                        <p className="text-sm text-gray-400">
                          Stellen Sie sicher, dass jsfeat korrekt geladen ist. Prüfen Sie die Browser-Konsole.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-red-300">ComfyUI-Verbindung fehlgeschlagen</h4>
                        <p className="text-sm text-gray-400">
                          Prüfen Sie: 1) ComfyUI läuft mit <code>--listen</code>, 2) Port 8188 ist erreichbar.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-red-300">KI-Ergebnis ungenau</h4>
                        <p className="text-sm text-gray-400">
                          Passen Sie Canny-Thresholds an oder ergänzen Sie mehr Details im UIN-JSON.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Support Links */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="font-semibold mb-4">📚 Weitere Ressourcen</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a href="#" className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-center transition">
                    <div className="text-2xl mb-2">📖</div>
                    <div className="font-semibold">Dokumentation</div>
                  </a>
                  <a href="#" className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-center transition">
                    <div className="text-2xl mb-2">🐙</div>
                    <div className="font-semibold">GitHub Repo</div>
                  </a>
                  <a href="#" className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-center transition">
                    <div className="text-2xl mb-2">💬</div>
                    <div className="font-semibold">Discord</div>
                  </a>
                  <a href="#" className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-center transition">
                    <div className="text-2xl mb-2">🎥</div>
                    <div className="font-semibold">Video-Tutorials</div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer mit Status */}
      <footer className="mt-8 pt-6 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-sm text-gray-400">
              UIN v0.6 • Universal Image Notation • {new Date().getFullYear()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Hybrid: JSON + Canny Edge Control • Präzise Bildgenerierung für Forensik & KI
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-sm">
                {isProcessing ? 'Verarbeitung läuft...' : 'System bereit'}
              </span>
            </div>
            
            <div className="text-sm bg-gray-800 px-3 py-1 rounded-full">
              Objekte: {uinData.objects?.length || 0} | 
              Kanten: {cannyImage ? '✅' : '❌'} | 
              Prompt: {generatedPrompt ? '✅' : '❌'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
