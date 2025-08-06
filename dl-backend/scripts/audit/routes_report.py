#!/usr/bin/env python3
import os, sys, inspect, datetime, traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / "audit"
AUDIT.mkdir(parents=True, exist_ok=True)

def write_error(e: BaseException, stage: str):
    (AUDIT / "routes_report_error.log").write_text(
        f"[{stage}] " + "".join(traceback.format_exception(e)),
        encoding="utf-8",
    )

# --- Guardas de ambiente APENAS para a auditoria (nao altera arquivos) ---
os.environ.setdefault("ENV_FOR_DYNACONF", "development")
os.environ.setdefault("FIRST_SUPERUSER", "audit@example.com")
os.environ.setdefault("FIRST_SUPERUSER_PASSWORD", "audit-temp-123")

# Forca uma URI valida de PostgreSQL para evitar str(None) no create_engine
# Use os mesmos valores do seu .env: dlsystem/strongpass@localhost:5432/dl_sistema
os.environ.setdefault(
    "SQLALCHEMY_DATABASE_URI",
    "postgresql+psycopg://dlsystem:strongpass@localhost:5432/dl_sistema",
)

try:
    sys.path.insert(0, str(ROOT))
    from app.main import app  # app = FastAPI(...)
except Exception as e:
    write_error(e, "import_app")
    print(f"ERRO ao importar app: veja {AUDIT / 'routes_report_error.log'}")
    sys.exit(1)

ts = datetime.datetime.now().isoformat()
out = [f"# Routes Report - {ts}"]

try:
    for route in app.routes:
        methods = ",".join(sorted((route.methods or [])))
        path = getattr(route, "path", "")
        name = getattr(route, "name", "")
        endpoint = getattr(route, "endpoint", None)
        doc = ""
        if endpoint:
            doc = inspect.getdoc(endpoint) or ""
        out.append(f"- **{methods}** `{path}` -> `{name}`")
        if doc:
            out.append(f"  - doc: {doc[:240]}")
except Exception as e:
    write_error(e, "iterate_routes")
    print(f"ERRO ao inspecionar rotas: veja {AUDIT / 'routes_report_error.log'}")
    sys.exit(1)

(AUDIT / "routes_report.md").write_text("\n".join(out), encoding="utf-8")
print(f"Gerado {AUDIT / 'routes_report.md'}")
