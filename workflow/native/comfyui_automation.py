# workflow/native/comfyui_automation.py
import requests
import json
import base64
from pathlib import Path
import time
from queue import Queue
from threading import Thread

class ComfyUIUINAutoPilot:
    def __init__(self, server_url="http://localhost:8188", max_workers=2):
        self.server_url = server_url
        self.workflow_queue = Queue()
        self.results = []
        
    def create_workflow_from_uin(self, uin_json_path, edge_image_path):
        """Erstelle ComfyUI-Workflow aus UIN-Paket"""
        with open(uin_json_path, 'r') as f:
            uin_data = json.load(f)
        
        # Lade Basis-Workflow
        with open("workflows/comfyui-uin-basic.json", 'r') as f:
            workflow = json.load(f)
        
        # Generiere Prompt
        prompt_text = self._generate_detailed_prompt(uin_data)
        
        # Upload Edge Image
        image_name = self._upload_image(edge_image_path)
        
        # Modifiziere Workflow-Nodes
        workflow["6"]["inputs"]["text"] = prompt_text  # CLIP Text Encode
        workflow["11"]["inputs"]["image"] = image_name  # Load Image Node
        
        # Füge ControlNet hinzu basierend auf UIN
        if uin_data.get("edge_reference", {}).get("use_as_control", True):
            workflow = self._add_controlnet_config(workflow, uin_data)
        
        return workflow
    
    def batch_process_uin_folder(self, uin_folder, output_dir="./comfyui_output"):
        """Verarbeite einen ganzen Ordner mit UIN-Paketen"""
        Path(output_dir).mkdir(exist_ok=True)
        
        uin_packages = []
        for item in Path(uin_folder).iterdir():
            if item.is_dir():
                json_files = list(item.glob("*.uin.json"))
                if json_files:
                    uin_packages.append({
                        "json": json_files[0],
                        "edges": item / json_files[0].stem.replace("_attributes", "_edges") + ".png"
                    })
        
        print(f"🔄 Starte Batch-Verarbeitung von {len(uin_packages)} UIN-Paketen...")
        
        for i, package in enumerate(uin_packages):
            print(f"  [{i+1}/{len(uin_packages)}] Verarbeite {package['json'].name}")
            
            try:
                # Erstelle Workflow
                workflow = self.create_workflow_from_uin(
                    package["json"], 
                    package["edges"]
                )
                
                # Sende an ComfyUI
                result = self._queue_prompt(workflow)
                
                # Warte auf Fertigstellung
                image_path = self._wait_for_completion(result["prompt_id"])
                
                # Speichere Ergebnis
                self.results.append({
                    "package": package["json"].stem,
                    "workflow_id": result["prompt_id"],
                    "image_path": image_path,
                    "timestamp": time.time()
                })
                
                # Backup der Ergebnisse
                with open(f"{output_dir}/batch_results.json", "w") as f:
                    json.dump(self.results, f, indent=2)
                    
            except Exception as e:
                print(f"    ✗ Fehler: {e}")
                continue
        
        print(f"✅ Batch abgeschlossen! {len(self.results)}/{len(uin_packages)} erfolgreich")
        return self.results
    
    def _upload_image(self, image_path):
        """Lade Bild auf ComfyUI Server"""
        with open(image_path, "rb") as f:
            files = {"image": (Path(image_path).name, f)}
            response = requests.post(f"{self.server_url}/upload/image", files=files)
        
        return response.json()["name"]
    
    def _queue_prompt(self, workflow):
        """Sende Workflow an ComfyUI"""
        response = requests.post(f"{self.server_url}/prompt", json={"prompt": workflow})
        return response.json()
    
    def _wait_for_completion(self, prompt_id, timeout=300):
        """Warte auf Fertigstellung der Generierung"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            response = requests.get(f"{self.server_url}/history/{prompt_id}")
            history = response.json()
            
            if prompt_id in history:
                # Extrahiere den ersten generierten Bild-Pfad
                outputs = history[prompt_id]["outputs"]
                for node_id, node_output in outputs.items():
                    if "images" in node_output:
                        image_info = node_output["images"][0]
                        return f"{self.server_url}/view?filename={image_info['filename']}"
            
            time.sleep(2)
        
        raise TimeoutError(f"Generierung {prompt_id} timeout nach {timeout}s")
    
    def _generate_detailed_prompt(self, uin_data):
        """Erweitere Prompt-Generierung für bessere Ergebnisse"""
        prompt_parts = []
        
        # Globale Szene
        if "global" in uin_data and "lighting" in uin_data["global"]:
            lighting = uin_data["global"]["lighting"]
            prompt_parts.append(f"{lighting.get('type', '')} lighting, "
                              f"sun at {lighting.get('sun_position', {}).get('elevation', 45)} degrees")
        
        # Objekte
        if "objects" in uin_data:
            for obj in uin_data["objects"]:
                obj_desc = f"{obj.get('type', 'object')}"
                
                # Forensische Details
                if "forensic_attributes" in obj:
                    forensics = obj["forensic_attributes"]
                    if "interpupillary_distance_mm" in forensics:
                        distance = forensics["interpupillary_distance_mm"]
                        width_desc = "wide-set" if distance > 65 else "close-set" if distance < 60 else "normal"
                        obj_desc += f", {width_desc} eyes"
                
                # Visuelle Features
                if "features" in obj:
                    features = obj["features"]
                    if "hair_color_hex" in features:
                        obj_desc += f", hair color {features['hair_color_hex']}"
                
                prompt_parts.append(obj_desc)
        
        # Qualitäts-Booster
        prompt_parts.extend([
            "highly detailed",
            "sharp focus",
            "professional photography",
            "8k resolution",
            "masterpiece"
        ])
        
        return ", ".join(prompt_parts)

# Beispiel-Nutzung
pilot = ComfyUIUINAutoPilot()
results = pilot.batch_process_uin_folder("./uin_packages")
