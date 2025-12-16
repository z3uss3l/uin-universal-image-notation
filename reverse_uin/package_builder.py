#!/usr/bin/env python3
"""
Baut komplette UIN Packages aus verschiedenen Komponenten
"""

import json
import base64
import os
from datetime import datetime
from typing import Dict, Any, Optional
import cv2
import numpy as np

class UINPackageBuilder:
    def __init__(self):
        self.version = "uin-v0.6-hybrid"
        
    def build_from_components(self, 
                            edges_image: np.ndarray,
                            attributes: Dict[str, Any],
                            source_info: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Baut UIN Package aus Komponenten
        
        Args:
            edges_image: Canny edges als numpy array
            attributes: UIN-Attribute Dictionary
            source_info: Informationen über die Quelle
        
        Returns:
            Vollständiges UIN Package Dictionary
        """
        
        # Edges zu base64 konvertieren
        import io
        from PIL import Image
        
        if len(edges_image.shape) == 2:
            # Graustufenbild
            pil_img = Image.fromarray(edges_image)
        else:
            # Farbbild zu Graustufen
            if edges_image.shape[2] == 3:
                gray = cv2.cvtColor(edges_image, cv2.COLOR_BGR2GRAY)
                pil_img = Image.fromarray(gray)
            else:
                pil_img = Image.fromarray(edges_image)
        
        buffered = io.BytesIO()
        pil_img.save(buffered, format="PNG", optimize=True)
        edges_b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        # Package zusammenstellen
        package = {
            "format": "uin-capsule-v1",
            "version": self.version,
            "metadata": {
                "creation_timestamp": datetime.now().isoformat(),
                "edges_format": "png_base64",
                "compression": "none"
            },
            "edges": edges_b64,
            "attributes": attributes
        }
        
        # Source Info hinzufügen falls vorhanden
        if source_info:
            package["metadata"]["source"] = source_info
        
        return package
    
    def build_from_files(self,
                        edges_path: str,
                        attributes_path: str,
                        output_path: Optional[str] = None) -> str:
        """
        Baut Package aus existierenden Dateien
        
        Args:
            edges_path: Pfad zu Canny Edges PNG
            attributes_path: Pfad zu JSON mit Attributen
            output_path: Ausgabepfad für .uin Datei
        
        Returns:
            Pfad zur erstellten .uin Datei
        """
        
        # Edges lesen und encodieren
        with open(edges_path, 'rb') as f:
            edges_b64 = base64.b64encode(f.read()).decode('utf-8')
        
        # Attribute laden
        with open(attributes_path, 'r') as f:
            attributes = json.load(f)
        
        # Package erstellen
        package = {
            "format": "uin-capsule-v1",
            "version": self.version,
            "metadata": {
                "creation_timestamp": datetime.now().isoformat(),
                "source_files": {
                    "edges": os.path.basename(edges_path),
                    "attributes": os.path.basename(attributes_path)
                }
            },
            "edges": edges_b64,
            "attributes": attributes
        }
        
        # Ausgabepfad bestimmen
        if not output_path:
            base_name = os.path.splitext(edges_path)[0]
            output_path = f"{base_name}.uin"
        
        # Package speichern
        with open(output_path, 'w') as f:
            json.dump(package, f, indent=2, ensure_ascii=False)
        
        # Größeninfo ausgeben
        edges_size = os.path.getsize(edges_path)
        package_size = os.path.getsize(output_path)
        
        print(f"✅ UIN Package erstellt: {output_path}")
        print(f"   Canny Edges Größe: {edges_size:,} Bytes")
        print(f"   Package Größe: {package_size:,} Bytes")
        print(f"   Overhead: {package_size - edges_size:,} Bytes")
        
        return output_path
    
    def load_package(self, uin_path: str) -> Dict[str, Any]:
        """Lädt und dekodiert UIN Package"""
        
        with open(uin_path, 'r') as f:
            package = json.load(f)
        
        # Base64 Edges dekodieren
        edges_b64 = package.get('edges', '')
        edges_data = base64.b64decode(edges_b64)
        
        # Als numpy array konvertieren
        import io
        from PIL import Image
        import numpy as np
        
        img = Image.open(io.BytesIO(edges_data))
        edges_array = np.array(img)
        
        return {
            "package": package,
            "edges_array": edges_array,
            "attributes": package.get('attributes', {})
        }
    
    def validate_package(self, package: Dict[str, Any]) -> bool:
        """Validiert UIN Package Struktur"""
        
        required_fields = ["format", "edges", "attributes"]
        
        for field in required_fields:
            if field not in package:
                print(f"❌ Fehlendes Feld: {field}")
                return False
        
        # Format Version prüfen
        if package.get("format") != "uin-capsule-v1":
            print("❌ Falsches Format")
            return False
        
        # Edges sollten base64 sein
        try:
            base64.b64decode(package["edges"][:100] + "...")
        except:
            print("❌ Ungültiges base64 in edges")
            return False
        
        # Attributes sollten ein Dictionary sein
        if not isinstance(package["attributes"], dict):
            print("❌ Attributes sollten ein Dictionary sein")
            return False
        
        return True

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Baut UIN Packages')
    subparsers = parser.add_subparsers(dest='command', help='Befehl')
    
    # Build from files command
    build_parser = subparsers.add_parser('build', help='Erstellt Package aus Dateien')
    build_parser.add_argument('--edges', '-e', required=True, help='Canny Edges PNG')
    build_parser.add_argument('--attributes', '-a', required=True, help='Attribute JSON')
    build_parser.add_argument('--output', '-o', help='Ausgabedatei')
    
    # Load command
    load_parser = subparsers.add_parser('load', help='Lädt und zeigt Package Info')
    load_parser.add_argument('package', help='.uin Package Datei')
    
    # Validate command
    validate_parser = subparsers.add_parser('validate', help='Validiert Package')
    validate_parser.add_argument('package', help='.uin Package Datei')
    
    args = parser.parse_args()
    
    builder = UINPackageBuilder()
    
    if args.command == 'build':
        builder.build_from_files(args.edges, args.attributes, args.output)
    
    elif args.command == 'load':
        try:
            data = builder.load_package(args.package)
            package = data["package"]
            attributes = data["attributes"]
            
            print(f"📦 Package: {args.package}")
            print(f"   Format: {package.get('format')}")
            print(f"   Version: {package.get('version')}")
            print(f"   Erstellt: {package.get('metadata', {}).get('creation_timestamp')}")
            print(f"\n📝 Attribute:")
            for key, value in attributes.items():
                if isinstance(value, dict):
                    print(f"   {key}: {len(value)} items")
                elif isinstance(value, list):
                    print(f"   {key}: {len(value)} items")
                else:
                    print(f"   {key}: {value}")
            
            # Edge-Dimensionen zeigen
            edges_array = data["edges_array"]
            print(f"\n🖼️ Edges: {edges_array.shape} (Höhe x Breite)")
            
        except Exception as e:
            print(f"❌ Fehler beim Laden: {e}")
    
    elif args.command == 'validate':
        with open(args.package, 'r') as f:
            package = json.load(f)
        
        if builder.validate_package(package):
            print("✅ Package ist gültig")
        else:
            print("❌ Package ist ungültig")
    
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
