#!/usr/bin/env python3
"""
UIN Capsule Format Handler - Für Stable Diffusion Integration
"""

import json
import base64
import io
from PIL import Image
import os
from typing import Dict, Any, Tuple
import tempfile

class UINCapsule:
    """Handles UIN Capsule format for Stable Diffusion integration"""
    
    @staticmethod
    def load(capsule_path: str) -> Tuple[Dict[str, Any], Image.Image]:
        """Lädt UIN Capsule"""
        with open(capsule_path, 'r') as f:
            capsule = json.load(f)
        
        # Base64 Edges dekodieren
        edges_b64 = capsule.get('edges', '')
        edges_data = base64.b64decode(edges_b64)
        edges_img = Image.open(io.BytesIO(edges_data))
        
        return capsule.get('attributes', {}), edges_img
    
    @staticmethod
    def save(attributes: Dict[str, Any], edges_image: Image.Image, 
            output_path: str) -> str:
        """Speichert UIN Capsule"""
        # Edges zu base64
        buffered = io.BytesIO()
        edges_image.save(buffered, format="PNG", optimize=True)
        edges_b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        capsule = {
            "format": "uin-capsule-v1",
            "edges": edges_b64,
            "attributes": attributes
        }
        
        with open(output_path, 'w') as f:
            json.dump(capsule, f, indent=2)
        
        return output_path
    
    @staticmethod
    def create_sd_webui_config(capsule_path: str) -> Dict[str, Any]:
        """Erstellt Stable Diffusion WebUI Config aus UIN Capsule"""
        attributes, edges_img = UINCapsule.load(capsule_path)
        
        # Temporäre Datei für Edges
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            edges_img.save(tmp.name)
            edges_path = tmp.name
        
        # ControlNet Config erstellen
        controlnet_args = {
            "input_image": edges_path,
            "module": "canny",
            "model": "control_v11p_sd15_canny",
            "weight": 1.0,
            "guidance_start": 0,
            "guidance_end": 1,
            "processor_res": 512,
            "threshold_a": attributes.get('canny_thresholds', {}).get('low', 50),
            "threshold_b": attributes.get('canny_thresholds', {}).get('high', 150)
        }
        
        # Vollständige SD Config
        config = {
            "prompt": attributes.get('prompt', ''),
            "negative_prompt": attributes.get('negative_prompt', ''),
            "steps": 30,
            "cfg_scale": 7,
            "width": 512,
            "height": 512,
            "sampler_name": "DPM++ 2M Karras",
            "alwayson_scripts": {
                "ControlNet": {
                    "args": [controlnet_args]
                }
            }
        }
        
        return config
    
    @staticmethod
    def create_comfyui_workflow(capsule_path: str) -> Dict[str, Any]:
        """Erstellt ComfyUI Workflow aus UIN Capsule"""
        attributes, _ = UINCapsule.load(capsule_path)
        
        # Einfacher ComfyUI Workflow
        workflow = {
            "3": {
                "class_type": "CLIPTextEncode",
                "inputs": {
                    "text": attributes.get('prompt', ''),
                    "clip": ["4", 0]
                }
            },
            "4": {
                "class_type": "CLIPTextEncode",
                "inputs": {
                    "text": attributes.get('negative_prompt', ''),
                    "clip": ["4", 0]
                }
            },
            "6": {
                "class_type": "KSampler",
                "inputs": {
                    "seed": 42,
                    "steps": 30,
                    "cfg": 7,
                    "sampler_name": "dpmpp_2m",
                    "scheduler": "karras",
                    "denoise": 1,
                    "model": ["5", 0],
                    "positive": ["3", 0],
                    "negative": ["4", 0],
                    "latent_image": ["7", 0]
                }
            },
            "7": {
                "class_type": "EmptyLatentImage",
                "inputs": {
                    "width": 512,
                    "height": 512,
                    "batch_size": 1
                }
            },
            "8": {
                "class_type": "VAEDecode",
                "inputs": {
                    "samples": ["6", 0],
                    "vae": ["5", 2]
                }
            },
            "_meta": {
                "uin_capsule": capsule_path,
                "attributes": attributes
            }
        }
        
        return workflow
