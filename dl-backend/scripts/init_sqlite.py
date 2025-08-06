import sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

# Resto do código original:
from sqlmodel import SQLModel
from sqlalchemy import create_engine
from app.core.config import settings

# ⚠️ Garante que os modelos sejam carregados no metadata
try:
    import app.models  # __init__.py deve agrupar os modelos
except Exception:
    pass
# OU: importe explicitamente os modelos, se necessário:
# from app.models.user import User
# from app.models.item import Item

def main():
    engine = create_engine(settings.get_database_uri, echo=True)
    SQLModel.metadata.create_all(engine)
    print("[init_sqlite] Tabelas criadas com sucesso.")

if __name__ == "__main__":
    main()
