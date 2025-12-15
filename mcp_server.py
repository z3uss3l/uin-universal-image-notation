# mcp_server.py - Minimaler MCP-Server für UIN
import json
import subprocess
from typing import List, Optional
from mcp.server import Server, NotificationOptions
from mcp.server.models import TextContent
import mcp.server.stdio
import asyncio

class UINServer:
    def __init__(self):
        self.server = Server("uin-tools")
        
        # UIN-Tools als MCP-Tools verfügbar machen
        self.server.list_tools()(self.list_tools)
        self.server.call_tool()(self.call_tool)
    
    async def list_tools(self) -> List[dict]:
        """Liste alle verfügbaren UIN-Tools"""
        return [
            {
                "name": "extract_edges",
                "description": "Extract Canny edges from image and create UIN package",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "image_path": {"type": "string", "description": "Path to input image"},
                        "low_threshold": {"type": "number", "default": 100},
                        "high_threshold": {"type": "number", "default": 200}
                    }
                }
            },
            {
                "name": "generate_from_uin",
                "description": "Generate image from UIN JSON description",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "uin_json": {"type": "string", "description": "UIN JSON string"},
                        "output_format": {"type": "string", "enum": ["prompt", "controlnet_json", "comfyui_workflow"], "default": "prompt"}
                    }
                }
            }
        ]
    
    async def call_tool(self, name: str, arguments: dict) -> List[TextContent]:
        """Führe UIN-Tools aus"""
        if name == "extract_edges":
            # Nutze das vorhandene Python-Skript
            result = subprocess.run(
                ["python", "utils/extract_edges.py", arguments["image_path"], 
                 "-l", str(arguments.get("low_threshold", 100)),
                 "-H", str(arguments.get("high_threshold", 200))],
                capture_output=True,
                text=True
            )
            return [TextContent(type="text", text=result.stdout)]
        
        elif name == "generate_from_uin":
            uin_data = json.loads(arguments["uin_json"])
            # Hier: Logik zur Prompt/Workflow-Generierung
            prompt = self._uin_to_prompt(uin_data)
            return [TextContent(type="text", text=prompt)]
        
        return [TextContent(type="text", text=f"Tool {name} nicht gefunden")]
    
    def _uin_to_prompt(self, uin_data: dict) -> str:
        """Konvertiere UIN-JSON zu Prompt (existiert bereits in React-Code)"""
        # Nutze dieselbe Logik wie in src/App.jsx
        prompt = f"Professional photo of"
        # ... deine existierende Prompt-Generierungslogik ...
        return prompt

async def main():
    server = UINServer()
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.server.run(read_stream, write_stream, NotificationOptions())

if __name__ == "__main__":
    asyncio.run(main())
