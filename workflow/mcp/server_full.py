# mcp_server_full.py
import json
import asyncio
import subprocess
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from mcp.server import Server, NotificationOptions
from mcp.server.models import TextContent, ImageContent, EmbeddedResource
import mcp.server.stdio

@dataclass
class UINTool:
    name: str
    description: str
    parameters: Dict[str, Any]
    handler: callable

class UINMCPServer:
    def __init__(self, tools_dir: str = "./tools"):
        self.server = Server("uin-universal-image-notation")
        self.tools_dir = Path(tools_dir)
        self.tools_dir.mkdir(exist_ok=True)
        
        # Registriere alle verfügbaren Tools
        self._register_tools()
    
    def _register_tools(self):
        """Registriere alle UIN-Tools beim MCP-Server"""
        
        # Tool 1: Extract Edges
        @self.server.list_tools()
        async def handle_list_tools() -> List[Dict]:
            return [
                {
                    "name": "extract_edges",
                    "description": "Extract Canny edges from image and create UIN package",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "image_path": {
                                "type": "string",
                                "description": "Path to the input image"
                            },
                            "low_threshold": {
                                "type": "number",
                                "default": 100,
                                "minimum": 0,
                                "maximum": 255
                            },
                            "high_threshold": {
                                "type": "number",
                                "default": 200,
                                "minimum": 0,
                                "maximum": 255
                            },
                            "output_dir": {
                                "type": "string",
                                "default": "./uin_output"
                            }
                        },
                        "required": ["image_path"]
                    }
                },
                {
                    "name": "generate_from_uin",
                    "description": "Generate image from UIN JSON description via ComfyUI",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "uin_json_path": {
                                "type": "string",
                                "description": "Path to UIN JSON file"
                            },
                            "edge_image_path": {
                                "type": "string",
                                "description": "Path to edge image (optional)"
                            },
                            "output_format": {
                                "type": "string",
                                "enum": ["comfyui_workflow", "prompt_only", "controlnet_config"],
                                "default": "comfyui_workflow"
                            }
                        },
                        "required": ["uin_json_path"]
                    }
                },
                {
                    "name": "analyze_image",
                    "description": "Analyze image and suggest UIN attributes",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "image_path": {
                                "type": "string",
                                "description": "Path to the image to analyze"
                            },
                            "detail_level": {
                                "type": "string",
                                "enum": ["basic", "detailed", "forensic"],
                                "default": "detailed"
                            }
                        },
                        "required": ["image_path"]
                    }
                },
                {
                    "name": "validate_uin",
                    "description": "Validate UIN JSON against schema and suggest improvements",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "uin_json": {
                                "type": "string",
                                "description": "UIN JSON string or path to file"
                            }
                        },
                        "required": ["uin_json"]
                    }
                }
            ]
        
        # Tool 2: Execute Tools
        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: Dict) -> List[TextContent]:
            try:
                if name == "extract_edges":
                    return await self._handle_extract_edges(arguments)
                elif name == "generate_from_uin":
                    return await self._handle_generate_from_uin(arguments)
                elif name == "analyze_image":
                    return await self._handle_analyze_image(arguments)
                elif name == "validate_uin":
                    return await self._handle_validate_uin(arguments)
                else:
                    return [TextContent(
                        type="text",
                        text=f"Unknown tool: {name}"
                    )]
            except Exception as e:
                return [TextContent(
                    type="text",
                    text=f"Error executing {name}: {str(e)}"
                )]
        
        # Tool 3: Resources (UIN Schema, Examples)
        @self.server.list_resources()
        async def handle_list_resources() -> List[Dict]:
            return [
                {
                    "uri": "uin://schema/v0.6",
                    "name": "UIN JSON Schema v0.6",
                    "description": "Complete schema for UIN JSON files",
                    "mimeType": "application/json"
                },
                {
                    "uri": "uin://examples/basic",
                    "name": "Basic UIN Examples",
                    "description": "Example UIN JSON files for common scenes",
                    "mimeType": "application/json"
                }
            ]
        
        @self.server.read_resource()
        async def handle_read_resource(uri: str) -> str:
            if uri == "uin://schema/v0.6":
                # Lade das tatsächliche Schema
                schema_path = Path("docs/UIN_SCHEMA_v0.6.json")
                if schema_path.exists():
                    return schema_path.read_text()
                return json.dumps(self._generate_schema_template(), indent=2)
            
            elif uri == "uin://examples/basic":
                examples = {
                    "portrait": {
                        "version": "0.6",
                        "canvas": {"aspect_ratio": "3:4"},
                        "objects": [{
                            "type": "person",
                            "position": {"x": 0, "y": 0, "z": 0},
                            "forensic_attributes": {"face_shape": "oval"}
                        }]
                    }
                }
                return json.dumps(examples, indent=2)
            
            return f"Resource not found: {uri}"
    
    async def _handle_extract_edges(self, arguments: Dict) -> List[TextContent]:
        """Handle edge extraction tool"""
        image_path = arguments["image_path"]
        low = arguments.get("low_threshold", 100)
        high = arguments.get("high_threshold", 200)
        output_dir = arguments.get("output_dir", "./uin_output")
        
        # Führe Python-Skript aus
        cmd = [
            "python", "utils/extract_edges.py",
            image_path,
            "-l", str(low),
            "-H", str(high),
            "-o", output_dir
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            # Finde generierte Dateien
            base_name = Path(image_path).stem
            edge_file = f"{output_dir}/{base_name}_edges.png"
            json_file = f"{output_dir}/{base_name}_attributes.uin.json"
            
            return [
                TextContent(
                    type="text",
                    text=f"✅ Successfully extracted edges!\n\n"
                         f"• Edge map: {edge_file}\n"
                         f"• UIN JSON: {json_file}\n\n"
                         f"Output:\n{result.stdout[:500]}..."
                ),
                ImageContent(
                    type="image",
                    data=Path(edge_file).read_bytes() if Path(edge_file).exists() else b"",
                    mimeType="image/png"
                ) if Path(edge_file).exists() else None
            ]
        else:
            return [TextContent(
                type="text",
                text=f"❌ Extraction failed:\n{result.stderr}"
            )]
    
    async def _handle_generate_from_uin(self, arguments: Dict) -> List[TextContent]:
        """Generate image from UIN"""
        uin_json_path = arguments["uin_json_path"]
        
        with open(uin_json_path, 'r') as f:
            uin_data = json.load(f)
        
        # Generiere Prompt
        prompt = self._generate_mcp_prompt(uin_data)
        
        # Erstelle ComfyUI Workflow
        workflow = self._create_comfyui_workflow(uin_data, prompt)
        
        return [
            TextContent(
                type="text",
                text=f"## Generated from UIN\n\n"
                     f"**Prompt:**\n```\n{prompt}\n```\n\n"
                     f"**Workflow ready for ComfyUI**\n\n"
                     f"Objects: {len(uin_data.get('objects', []))}\n"
                     f"Use edge control: {uin_data.get('edge_reference', {}).get('use_as_control', False)}"
            ),
            TextContent(
                type="text",
                text=f"```json\n{json.dumps(workflow, indent=2)[:1000]}...\n```",
                isComplete=False
            )
        ]
    
    async def _handle_analyze_image(self, arguments: Dict) -> List[TextContent]:
        """Analyze image and suggest UIN attributes"""
        image_path = arguments["image_path"]
        detail_level = arguments.get("detail_level", "detailed")
        
        # Simuliere Bildanalyse (in Produktion: CV Modelle nutzen)
        suggestions = {
            "basic": {
                "suggested_objects": ["main_subject", "background"],
                "lighting_suggestion": "balanced studio lighting",
                "color_palette": "natural tones"
            },
            "detailed": {
                "composition": "central subject with supportive background",
                "suggested_details": "Add facial features, clothing details",
                "recommended_measurements": {"subject_height": "1.7m"}
            },
            "forensic": {
                "facial_analysis": "oval face shape, normal eye distance",
                "recommended_forensic_attributes": {
                    "interpupillary_distance_mm": 64,
                    "face_shape": "oval",
                    "nose_type": "straight"
                }
            }
        }
        
        return [TextContent(
            type="text",
            text=f"## Image Analysis Results\n\n"
                 f"**File:** {image_path}\n"
                 f"**Detail Level:** {detail_level}\n\n"
                 f"**Suggestions:**\n```json\n"
                 f"{json.dumps(suggestions[detail_level], indent=2)}\n```"
        )]
    
    async def _handle_validate_uin(self, arguments: Dict) -> List[TextContent]:
        """Validate UIN JSON"""
        uin_input = arguments["uin_json"]
        
        try:
            # Prüfe ob es ein Pfad oder direkt JSON ist
            if Path(uin_input).exists():
                with open(uin_input, 'r') as f:
                    uin_data = json.load(f)
            else:
                uin_data = json.loads(uin_input)
            
            # Validiere gegen Schema
            errors = self._validate_against_schema(uin_data)
            
            if not errors:
                suggestions = self._suggest_improvements(uin_data)
                
                return [TextContent(
                    type="text",
                    text=f"## ✅ UIN Validation Passed\n\n"
                         f"**Version:** {uin_data.get('version', 'unknown')}\n"
                         f"**Objects:** {len(uin_data.get('objects', []))}\n\n"
                         f"**Improvement Suggestions:**\n{suggestions}"
                )]
            else:
                return [TextContent(
                    type="text",
                    text=f"## ❌ UIN Validation Failed\n\n"
                         f"**Errors:**\n" + "\n".join(f"- {e}" for e in errors)
                )]
                
        except json.JSONDecodeError as e:
            return [TextContent(
                type="text",
                text=f"Invalid JSON: {str(e)}"
            )]
    
    def _generate_mcp_prompt(self, uin_data: Dict) -> str:
        """Generate optimized prompt for MCP context"""
        prompt_parts = ["Professional photo"]
        
        if "global" in uin_data and "lighting" in uin_data["global"]:
            lighting = uin_data["global"]["lighting"]
            prompt_parts.append(f"{lighting.get('type', 'natural')} lighting")
        
        if "objects" in uin_data:
            for obj in uin_data["objects"]:
                desc = obj.get("type", "")
                
                # Füge spezifische Attribute hinzu
                if obj.get("type") == "person":
                    if "forensic_attributes" in obj:
                        fa = obj["forensic_attributes"]
                        if "face_shape" in fa:
                            desc += f" with {fa['face_shape']} face"
                        if "interpupillary_distance_mm" in fa:
                            dist = fa["interpupillary_distance_mm"]
                            if dist > 67:
                                desc += ", wide-set eyes"
                            elif dist < 62:
                                desc += ", close-set eyes"
                
                prompt_parts.append(desc)
        
        prompt_parts.extend(["highly detailed", "sharp focus", "8k"])
        return ", ".join(prompt_parts)
    
    def _create_comfyui_workflow(self, uin_data: Dict, prompt: str) -> Dict:
        """Create ComfyUI workflow from UIN"""
        with open("workflows/comfyui-uin-basic.json", 'r') as f:
            workflow = json.load(f)
        
        # Modifiziere den Workflow basierend auf UIN
        workflow["6"]["inputs"]["text"] = prompt
        
        # Füge ControlNet hinzu falls Kanten vorhanden
        if uin_data.get("edge_reference", {}).get("use_as_control", False):
            workflow = self._enhance_with_controlnet(workflow, uin_data)
        
        return workflow
    
    def _validate_against_schema(self, uin_data: Dict) -> List[str]:
        """Simple validation (in production use jsonschema)"""
        errors = []
        
        if "version" not in uin_data:
            errors.append("Missing 'version' field")
        
        if "objects" in uin_data and not isinstance(uin_data["objects"], list):
            errors.append("'objects' must be a list")
        
        return errors
    
    def _suggest_improvements(self, uin_data: Dict) -> str:
        """Suggest improvements for UIN"""
        suggestions = []
        
        if "objects" in uin_data:
            for obj in uin_data["objects"]:
                if obj.get("type") == "person" and "forensic_attributes" not in obj:
                    suggestions.append(f"Add forensic_attributes to {obj.get('id', 'person')}")
        
        if "global" not in uin_data:
            suggestions.append("Consider adding global lighting settings")
        
        return "\n".join(suggestions) if suggestions else "No suggestions"
    
    def _generate_schema_template(self) -> Dict:
        """Generate UIN schema template"""
        return {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "title": "UIN v0.6",
            "type": "object",
            "properties": {
                "version": {"type": "string", "const": "0.6"},
                "canvas": {"type": "object"},
                "objects": {"type": "array"},
                "global": {"type": "object"}
            },
            "required": ["version", "canvas"]
        }

async def main():
    """Start the MCP server"""
    server = UINMCPServer()
    
    print("🚀 Starting UIN MCP Server...")
    print("📡 Available tools:")
    print("  • extract_edges - Extract Canny edges from images")
    print("  • generate_from_uin - Generate images from UIN")
    print("  • analyze_image - Analyze images for UIN attributes")
    print("  • validate_uin - Validate UIN JSON files")
    print("\n🔗 Connect with:")
    print("  • Claude Desktop")
    print("  • Cursor IDE")
    print("  • Any MCP-compatible client")
    
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.server.run(
            read_stream,
            write_stream,
            NotificationOptions()
        )

if __name__ == "__main__":
    asyncio.run(main()) cash
