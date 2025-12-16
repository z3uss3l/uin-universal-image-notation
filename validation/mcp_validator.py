# validators/mcp_validator.py
import json
import sys

def load_doc(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def check_mcp(doc):
    mcp = doc.get("mcp_contracts")
    if not mcp:
        print("[MCP] Übersprungen: keine mcp_contracts vorhanden.")
        return 0
    contexts = mcp.get("contexts", [])
    if not contexts:
        print("[MCP] Fehler: contexts fehlen.")
        return 1
    ok = True
    for ctx in contexts:
        if not ctx.get("capabilities"):
            print(f"[MCP] Fehler: Kontext {ctx.get('id','<unknown>')} ohne capabilities.")
            ok = False
        constraints = ctx.get("constraints", {})
        for key in ("max_runtime_ms", "max_memory_mb", "max_tokens"):
            val = constraints.get(key)
            if val is not None and (not isinstance(val, int) or val < 1):
                print(f"[MCP] Fehler: {key} ungültig in Kontext {ctx.get('id')}: {val}")
                ok = False
        pm = constraints.get("precision_mode")
        if pm and pm not in {"fast", "balanced", "accurate"}:
            print(f"[MCP] Fehler: precision_mode ungültig: {pm}")
            ok = False
    if ok:
        print("[MCP] OK: Verträge plausibel.")
        return 0
    return 1

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validators/mcp_validator.py <doc.json>")
        sys.exit(2)
    sys.exit(check_mcp(load_doc(sys.argv[1])))
