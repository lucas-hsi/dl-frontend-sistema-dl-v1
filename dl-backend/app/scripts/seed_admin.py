import os, sys
from sqlalchemy import create_engine
from sqlmodel import Session, select

ROOT = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(ROOT))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

# Tenta usar a sessão padrão do projeto
engine = None
try:
    from app.infra.db.session import get_session  # seu projeto já tem isso
    def _session():
        return get_session()
except Exception:
    # Fallback: monta engine a partir das settings
    from app.core.config import settings
    uri = getattr(settings, "SQLALCHEMY_DATABASE_URI", None) or "sqlite:///./app.db"
    engine = create_engine(uri, pool_pre_ping=True, future=True)
    def _session():
        return Session(engine)

# Importa User de onde existir
User = None
try:
    from app.models.user import User  # template original
except Exception:
    try:
        from app.models import User
    except Exception:
        from app.domain.models import User  # scaffold novo

# Hash de senha
try:
    from app.core.security import get_password_hash
except Exception:
    # fallback simples (não use em prod)
    import hashlib
    def get_password_hash(p): return hashlib.sha256(p.encode()).hexdigest()

def main():
    with _session() as s:
        user = s.exec(select(User).where(User.email=="admin@example.com")).first()
        if user:
            print("seed: admin@example.com já existe"); return
        u = User(email="admin@example.com", hashed_password=get_password_hash("admin123"), is_active=True, is_superuser=True)
        s.add(u)
        s.commit()
        print("seed: admin@example.com criado")

if __name__ == "__main__":
    main()
