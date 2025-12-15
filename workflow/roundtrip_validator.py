# workflows/roundtrip_validator.py
import json
import subprocess
import cv2
import numpy as np
from pathlib import Path
import matplotlib.pyplot as plt

class UINRoundtripValidator:
    def __init__(self, comfyui_url="http://localhost:8188"):
        self.comfyui_url = comfyui_url
        
    def validate_single_image(self, image_path, uin_json_path=None):
        """Vollständiger Roundtrip-Test für ein einzelnes Bild"""
        results = {}
        
        # 1. Falls kein UIN vorhanden: Erstelle es aus dem Bild
        if not uin_json_path:
            print("🔄 Erstelle UIN-Paket aus Bild...")
            result = subprocess.run(
                ["python", "utils/extract_edges.py", image_path, 
                 "-o", "./validation_output"],
                capture_output=True,
                text=True
            )
            uin_json_path = "./validation_output/attributes.uin.json"
        
        # 2. Lade UIN und generiere Prompt
        with open(uin_json_path, 'r') as f:
            uin_data = json.load(f)
        
        prompt = self._generate_prompt(uin_data)
        edge_map = uin_data["edge_reference"]["file_name"]
        
        # 3. Generiere Bild via ComfyUI API
        generated_image = self._generate_via_comfyui(prompt, edge_map)
        
        # 4. Berechne Metriken
        original = cv2.imread(image_path)
        generated = cv2.imread(generated_image)
        
        metrics = {
            "ssim": self._calculate_ssim(original, generated),
            "psnr": self._calculate_psnr(original, generated),
            "edge_preservation": self._edge_preservation_score(original, generated),
            "compression_ratio": Path(image_path).stat().st_size / 
                                (Path(uin_json_path).stat().st_size + 
                                 Path(edge_map).stat().st_size)
        }
        
        # 5. Visualisiere Ergebnisse
        self._create_validation_report(image_path, generated_image, metrics, uin_data)
        
        return {"metrics": metrics, "generated_image": generated_image}
    
    def batch_validation(self, image_dir, output_dir="./batch_validation"):
        """Validierung für einen ganzen Datensatz"""
        Path(output_dir).mkdir(exist_ok=True)
        
        results = []
        image_files = list(Path(image_dir).glob("*.jpg")) + \
                     list(Path(image_dir).glob("*.png"))
        
        for img_path in image_files[:10]:  # Teste erst 10 Bilder
            print(f"Teste: {img_path.name}")
            try:
                result = self.validate_single_image(str(img_path))
                results.append({
                    "image": img_path.name,
                    **result["metrics"]
                })
                
                # Speichere Fortschritt
                with open(f"{output_dir}/progress.json", "w") as f:
                    json.dump(results, f, indent=2)
                    
            except Exception as e:
                print(f"Fehler bei {img_path}: {e}")
        
        # Erstelle Zusammenfassung
        self._create_batch_summary(results, output_dir)
        return results
    
    def _generate_prompt(self, uin_data):
        """Generiere Prompt aus UIN (wie in React-Tool)"""
        prompt = "Professional photo, highly detailed, 8k, "
        
        if "objects" in uin_data:
            for obj in uin_data["objects"]:
                prompt += f"{obj.get('type', 'object')}, "
                if "features" in obj:
                    for key, val in obj["features"].items():
                        prompt += f"{key}: {val}, "
        
        prompt += "sharp focus, masterpiece"
        return prompt
    
    def _generate_via_comfyui(self, prompt, edge_map):
        """Sende Generation an ComfyUI"""
        import requests
        
        # Lade Workflow-Template
        with open("workflows/comfyui-uin-basic.json", "r") as f:
            workflow = json.load(f)
        
        # Ersetze Platzhalter
        # ... (Implementierung basierend auf deinem Workflow) ...
        
        response = requests.post(f"{self.comfyui_url}/prompt", json={"prompt": workflow})
        return response.json()["generated_image_path"]
    
    def _calculate_ssim(self, img1, img2):
        """Structural Similarity Index"""
        # Implementierung mit skimage oder OpenCV
        return 0.85  # Beispielwert
    
    def _create_validation_report(self, original_path, generated_path, metrics, uin_data):
        """Erstelle visuellen Report"""
        fig, axes = plt.subplots(2, 3, figsize=(15, 10))
        
        # Visualisierungen...
        plt.savefig(f"./validation_output/report_{Path(original_path).stem}.png")
        plt.close()

# Usage
validator = UINRoundtripValidator()
result = validator.validate_single_image("examples/test_image.jpg")
print(f"Roundtrip-Score: {result['metrics']['ssim']:.2%}")
