import uuid
from typing import List, Optional
from sqlmodel import Session, select
from app.domain.models import Produto
from app.domain.schemas import (
    ProdutoCreate, ProdutoUpdate, ProdutoRead, ProdutosList,
    LoginData, Token, ResetPasswordData, UserCreate, UserRead, UserUpdate, PasswordUpdate,
    ItemCreate, ItemRead, ItemUpdate
)
from app.infra.db.session import get_session
from app.models import User
from app.core.security import verify_password, create_access_token


class AuthService:
    """Serviço de domínio para Autenticação"""
    
    def __init__(self, session: Session):
        self.session = session
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Autentica um usuário usando verificação real via passlib"""
        # Buscar usuário pelo email
        statement = select(User).where(User.email == email)
        user = self.session.exec(statement).first()
        
        # Se usuário não existe, retorna None
        if not user:
            return None
        
        # Se usuário não está ativo, retorna None
        if not user.is_active:
            return None
        
        # Verificar senha usando passlib
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
    
    def create_access_token(self, user_id: uuid.UUID, expires_delta: int = 30) -> str:
        """Cria token de acesso"""
        # TODO: Implementar criação de token real
        raise NotImplementedError("create_access_token - implementação pendente")
    
    def test_token(self, token: str) -> Optional[UserRead]:
        """Testa um token de acesso"""
        # TODO: Implementar validação de token real
        raise NotImplementedError("test_token - implementação pendente")
    
    def recover_password(self, email: str) -> bool:
        """Recupera senha do usuário"""
        # TODO: Implementar recuperação de senha real
        raise NotImplementedError("recover_password - implementação pendente")
    
    def reset_password(self, token: str, new_password: str) -> bool:
        """Reseta senha do usuário"""
        # TODO: Implementar reset de senha real
        raise NotImplementedError("reset_password - implementação pendente")
    
    def html_content(self, email: str) -> str:
        """Gera conteúdo HTML para recuperação de senha"""
        # TODO: Implementar geração de HTML real
        raise NotImplementedError("html_content - implementação pendente")


class UserService:
    """Serviço de domínio para Usuários"""
    
    def __init__(self, session: Session):
        self.session = session
    
    def list_all(self, skip: int = 0, limit: int = 100) -> List[UserRead]:
        """Lista todos os usuários"""
        # TODO: Implementar listagem real
        raise NotImplementedError("list_all - implementação pendente")
    
    def get(self, user_id: uuid.UUID) -> Optional[UserRead]:
        """Busca um usuário por ID"""
        # TODO: Implementar busca real
        raise NotImplementedError("get - implementação pendente")
    
    def create(self, user_create: UserCreate) -> UserRead:
        """Cria um novo usuário"""
        # TODO: Implementar criação real
        raise NotImplementedError("create - implementação pendente")
    
    def update(self, user_id: uuid.UUID, user_update: UserUpdate) -> Optional[UserRead]:
        """Atualiza um usuário existente"""
        # TODO: Implementar atualização real
        raise NotImplementedError("update - implementação pendente")
    
    def delete(self, user_id: uuid.UUID) -> bool:
        """Remove um usuário"""
        # TODO: Implementar remoção real
        raise NotImplementedError("delete - implementação pendente")
    
    def get_by_email(self, email: str) -> Optional[object]:
        """Busca um usuário por email"""
        # Implementação temporária usando crud
        from app.models import User
        from sqlmodel import select
        
        statement = select(User).where(User.email == email)
        user = self.session.exec(statement).first()
        return user
    
    def change_password(self, user_id: uuid.UUID, password_update: PasswordUpdate) -> bool:
        """Altera senha do usuário"""
        # TODO: Implementar alteração de senha real
        raise NotImplementedError("change_password - implementação pendente")


class ItemService:
    """Serviço de domínio para Itens"""
    
    def __init__(self, session: Session):
        self.session = session
    
    def list_all(self, skip: int = 0, limit: int = 100) -> List[ItemRead]:
        """Lista todos os itens"""
        # TODO: Implementar listagem real
        raise NotImplementedError("list_all - implementação pendente")
    
    def get(self, item_id: uuid.UUID) -> Optional[ItemRead]:
        """Busca um item por ID"""
        # TODO: Implementar busca real
        raise NotImplementedError("get - implementação pendente")
    
    def create(self, item_create: ItemCreate, owner_id: uuid.UUID) -> ItemRead:
        """Cria um novo item"""
        # TODO: Implementar criação real
        raise NotImplementedError("create - implementação pendente")
    
    def update(self, item_id: uuid.UUID, item_update: ItemUpdate) -> Optional[ItemRead]:
        """Atualiza um item existente"""
        # TODO: Implementar atualização real
        raise NotImplementedError("update - implementação pendente")
    
    def delete(self, item_id: uuid.UUID) -> bool:
        """Remove um item"""
        # TODO: Implementar remoção real
        raise NotImplementedError("delete - implementação pendente")


class UtilsService:
    """Serviço de domínio para Utilitários"""
    
    def __init__(self, session: Session):
        self.session = session
    
    def send_test_email(self, to_email: str, subject: str = "Test Email") -> bool:
        """Envia email de teste"""
        # TODO: Implementar envio de email real
        raise NotImplementedError("send_test_email - implementação pendente")


class PrivateService:
    """Serviço de domínio para Operações Privadas"""
    
    def __init__(self, session: Session):
        self.session = session
    
    def create_user_private(self, user_data: dict) -> UserRead:
        """Cria usuário via endpoint privado"""
        # TODO: Implementar criação privada real
        raise NotImplementedError("create_user_private - implementação pendente")


class ProdutoService:
    """Serviço de domínio para Produto"""
    
    def __init__(self, session: Session):
        self.session = session
    
    def list_all(self) -> ProdutosList:
        """Lista todos os produtos"""
        produtos = self.session.exec(select(Produto)).all()
        produtos_read = [ProdutoRead.model_validate(produto) for produto in produtos]
        return ProdutosList(data=produtos_read, count=len(produtos_read))
    
    def get(self, produto_id: str) -> ProdutoRead | None:
        """Busca um produto por ID"""
        try:
            produto_uuid = uuid.UUID(produto_id)
            produto = self.session.exec(
                select(Produto).where(Produto.id == produto_uuid)
            ).first()
            return ProdutoRead.model_validate(produto) if produto else None
        except ValueError:
            return None
    
    def create(self, produto_create: ProdutoCreate) -> ProdutoRead:
        """Cria um novo produto"""
        produto = Produto.model_validate(produto_create)
        self.session.add(produto)
        self.session.commit()
        self.session.refresh(produto)
        return ProdutoRead.model_validate(produto)
    
    def update(self, produto_id: str, produto_update: ProdutoUpdate) -> ProdutoRead | None:
        """Atualiza um produto existente"""
        try:
            produto_uuid = uuid.UUID(produto_id)
            produto = self.session.exec(
                select(Produto).where(Produto.id == produto_uuid)
            ).first()
            
            if not produto:
                return None
            
            update_data = produto_update.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(produto, field, value)
            
            self.session.add(produto)
            self.session.commit()
            self.session.refresh(produto)
            return ProdutoRead.model_validate(produto)
        except ValueError:
            return None
    
    def delete(self, produto_id: str) -> bool:
        """Remove um produto"""
        try:
            produto_uuid = uuid.UUID(produto_id)
            produto = self.session.exec(
                select(Produto).where(Produto.id == produto_uuid)
            ).first()
            
            if not produto:
                return False
            
            self.session.delete(produto)
            self.session.commit()
            return True
        except ValueError:
            return False


# Factories para criar instâncias dos serviços
def get_auth_service() -> AuthService:
    """Factory para criar instância do AuthService"""
    return AuthService(get_session())

def get_user_service() -> UserService:
    """Factory para criar instância do UserService"""
    return UserService(get_session())

def get_item_service() -> ItemService:
    """Factory para criar instância do ItemService"""
    return ItemService(get_session())

def get_utils_service() -> UtilsService:
    """Factory para criar instância do UtilsService"""
    return UtilsService(get_session())

def get_private_service() -> PrivateService:
    """Factory para criar instância do PrivateService"""
    return PrivateService(get_session())

def get_produto_service() -> ProdutoService:
    """Factory para criar instância do ProdutoService"""
    return ProdutoService(get_session()) 