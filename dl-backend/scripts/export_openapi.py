#!/usr/bin/env python3
"""
Script para exportar o schema OpenAPI para artifacts/auditoria/openapi_snapshot.json
Uso: python scripts/export_openapi.py
"""
import os
import json
import urllib.request
import pathlib
import sys

TOKEN = os.getenv("INTERNAL_TOKEN")
URL = os.getenv("OPENAPI_URL", "http://127.0.0.1:8001/__internal__/openapi.json")

if not TOKEN:
    print("ERROR: INTERNAL_TOKEN não definido no ambiente.", file=sys.stderr)
    sys.exit(2)

req = urllib.request.Request(URL, headers={"x-internal-token": TOKEN})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read())
except Exception as e:
    print(f"ERROR: Falha ao obter OpenAPI: {e}", file=sys.stderr)
    sys.exit(1)

out_dir = pathlib.Path("artifacts/auditoria")
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / "openapi_snapshot.json"
out_file.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

print(f"✅ OpenAPI salvo em {out_file}") 