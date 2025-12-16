# validators/schema_validator.py
import json
import sys
from jsonschema import Draft7Validator

def load_schema(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def validate(doc_path, schema_path):
    schema = load_schema(schema_path)
    with open(doc_path, 'r', encoding='utf-8') as f:
        doc = json.load(f)
    validator = Draft7Validator(schema)
    errors = sorted(validator.iter_errors(doc), key=lambda e: e.path)
    if errors:
        for e in errors:
            print(f"[SCHEMA] Fehler: {list(e.path)} -> {e.message}")
        sys.exit(1)
    print("[SCHEMA] OK: Dokument ist konform zu v0.8.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python validators/schema_validator.py <doc.json> <schema.json>")
        sys.exit(2)
      validate(sys.argv[1], sys.argv[2])
