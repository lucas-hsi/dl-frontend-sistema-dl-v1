from sqlmodel import Session, create_engine
from app.core.config import settings


def get_db_uri() -> str:
    """Retorna a URI do banco de dados"""
    return str(settings.get_database_uri)


# TODO: Reverter para implementação real
# Criando engine do banco de dados
# engine = create_engine(get_db_uri())
engine = None


def get_session() -> Session:
    """Retorna uma sessão do banco de dados"""
    # TODO: Reverter para implementação real
    # return Session(engine)
    return None 