# validation/conformance_validator.py
import json
import sys

CONFORMANCE_ENUM = {
    "UIN-Core-0.8": {"require_mcp": False, "require_workflow": False},
    "UIN-Core+MCP-0.8": {"require_mcp": True, "require_workflow": False},
    "UIN-Core+Workflow-0.8": {"require_mcp": False, "require_workflow": True},
    "UIN-Full-0.8": {"require_mcp": True, "require_workflow": True},
}

def load_doc(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def check(doc):
    meta = doc.get("metadata", {})
    conf = meta.get("conformance", "UIN-Core-0.8")
    rules = CONFORMANCE_ENUM.get(conf)
    if not rules:
        print(f"[CONF] Unbekannte Konformität: {conf}")
        return 1

    mcp_present = "mcp_contracts" in doc
    wf_present = "workflow_hooks" in doc

    if rules["require_mcp"] and not mcp_present:
        print("[CONF] Fehlend: mcp_contracts für", conf)
        return 1
    if rules["require_workflow"] and not wf_present:
        print("[CONF] Fehlend: workflow_hooks für", conf)
        return 1

    print(f"[CONF] OK: {conf} erfüllt.")
    return 0

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validators/conformance_validator.py <doc.json>")
        sys.exit(2)
    sys.exit(check(load_doc(sys.argv[1])))
