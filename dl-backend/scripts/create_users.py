#!/usr/bin/env python3
"""
Script para criar usuários para os diferentes painéis do DL Sistema
Gestor, Vendedor e Anúncios
"""

import sys
import os
from pathlib import Path

# Adicionar o diretório raiz ao path
sys.path.append(str(Path(__file__).parent.parent))

from sqlmodel import Session, select
from app.core.db import engine
from app import crud
from app.models import User, UserCreate
from app.core.security import get_password_hash


def create_user_if_not_exists(session: Session, email: str, password: str, full_name: str, is_superuser: bool = False) -> User:
    """Cria um usuário se não existir"""
    
    # Verificar se o usuário já existe
    existing_user = session.exec(select(User).where(User.email == email)).first()
    
    if existing_user:
        print(f"✅ Usuário {email} já existe")
        return existing_user
    
    # Criar novo usuário
    user_in = UserCreate(
        email=email,
        password=password,
        full_name=full_name,
        is_superuser=is_superuser
    )
    
    user = crud.create_user(session=session, user_create=user_in)
    print(f"✅ Usuário {email} criado com sucesso")
    return user


def main():
    """Função principal para criar os usuários"""
    
    print("🔐 Criando usuários para os painéis do DL Sistema...")
    print("=" * 50)
    
    with Session(engine) as session:
        
        # 1. Gestor (Superusuário)
        print("\n👨‍💼 Criando usuário GESTOR...")
        gestor = create_user_if_not_exists(
            session=session,
            email="gestor@dl.com",
            password="gestor123",
            full_name="Gestor DL Sistema",
            is_superuser=True
        )
        
        # 2. Vendedor
        print("\n👨‍💼 Criando usuário VENDEDOR...")
        vendedor = create_user_if_not_exists(
            session=session,
            email="vendedor@dl.com",
            password="vendedor123",
            full_name="Vendedor DL Sistema",
            is_superuser=False
        )
        
        # 3. Anúncios
        print("\n📢 Criando usuário ANÚNCIOS...")
        anuncios = create_user_if_not_exists(
            session=session,
            email="anuncios@dl.com",
            password="anuncios123",
            full_name="Anúncios DL Sistema",
            is_superuser=False
        )
        
        # 4. Admin (já existe no .env)
        print("\n👑 Verificando usuário ADMIN...")
        admin = create_user_if_not_exists(
            session=session,
            email="admin@dl.com",
            password="admin123",
            full_name="Administrador DL Sistema",
            is_superuser=True
        )
        
        # 5. Usuário de Teste
        print("\n🧪 Criando usuário de TESTE...")
        teste = create_user_if_not_exists(
            session=session,
            email="teste@dl.com",
            password="teste123",
            full_name="Usuário de Teste",
            is_superuser=False
        )
    
    print("\n" + "=" * 50)
    print("✅ Todos os usuários foram criados/verificados!")
    print("\n📋 Credenciais de Acesso:")
    print("-" * 30)
    print("👑 ADMIN:     admin@dl.com / admin123")
    print("👨‍💼 GESTOR:   gestor@dl.com / gestor123")
    print("👨‍💼 VENDEDOR: vendedor@dl.com / vendedor123")
    print("📢 ANÚNCIOS:  anuncios@dl.com / anuncios123")
    print("🧪 TESTE:     teste@dl.com / teste123")
    print("-" * 30)
    print("\n🎯 Painéis disponíveis:")
    print("- /gestor - Painel do Gestor")
    print("- /vendedor - Painel do Vendedor")
    print("- /anuncios - Painel de Anúncios")
    print("\n🚀 Para acessar, use as credenciais acima no login!")


if __name__ == "__main__":
    main() 