from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

from app.core.security import decode_access_token
from app.core.config import settings
from app.core.db import engine
from app.domain.services import UserService

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)


def get_db() -> Generator[Session, None, None]:
    # TODO: Reverter para implementação real
    # with Session(engine) as session:
    #     yield session
    yield None


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(session: SessionDep, token: str = Depends(reusable_oauth2)):
    # TODO: Reverter para implementação real
    class FakeUser:
        id = "00000000-0000-0000-0000-000000000000"
        email = "dev@dl.com"
        role = "VENDEDOR"
        is_active = True
    return FakeUser()


CurrentUser = Annotated[object, Depends(get_current_user)]


def get_current_active_user(current_user: CurrentUser) -> object:
    """
    Verifica se o usuário atual está ativo.
    """
    # TODO: Reverter para implementação real
    return current_user


def get_current_active_superuser(current_user: CurrentUser) -> object:
    # TODO: Reverter para implementação real
    return current_user
