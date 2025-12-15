# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Installiere Abhängigkeiten
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# MCP-spezifische Abhängigkeiten
RUN pip install mcp opencv-python pillow numpy

# Kopiere UIN-Code
COPY utils/ ./utils/
COPY mcp_server.py .
COPY examples/ ./examples/

# Starte MCP-Server
CMD ["python", "mcp_server.py"]
