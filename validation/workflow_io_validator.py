# validation/workflow_io_validator.py
import json
import sys

def load_doc(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def check_io(doc):
    hooks = doc.get("workflow_hooks")
    if not hooks:
        print("[WF-IO] Übersprungen: keine workflow_hooks vorhanden.")
        return 0

    nodes = hooks.get("nodes", [])
    ok = True
    for n in nodes:
        nid = n.get("id", "<unknown>")
        io = n.get("io", {})
        inputs = io.get("inputs", [])
        outputs = io.get("outputs", [])
        if not inputs or not outputs:
            print(f"[WF-IO] Fehler: Node {nid} ohne vollständige I/O-Definition.")
            ok = False
            continue
        for item in inputs + outputs:
            if item.get("type") not in {"json", "binary", "text"}:
                print(f"[WF-IO] Fehler: Node {nid} I/O Typ ungültig: {item.get('type')}")
                ok = False
            # Optional: schema_ref vorhanden?
            if "schema_ref" in item and not isinstance(item["schema_ref"], str):
                print(f"[WF-IO] Fehler: Node {nid} schema_ref muss string sein.")
                ok = False
    if ok:
        print("[WF-IO] OK: I/O-Verträge plausibel.")
        return 0
    return 1

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validators/workflow_io_validator.py <doc.json>")
        sys.exit(2)
    sys.exit(check_io(load_doc(sys.argv[1])))
