"""update_user_roles

Revision ID: 418885b9239e
Revises: 234589330454
Create Date: 2025-08-03 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = '418885b9239e'
# CORREÇÃO CRÍTICA: Aponta para a migração de seed, consertando a corrente.
down_revision = '234589330454'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Esta migração agora está vazia, pois a lógica de roles foi consolidada.
    # Apenas garante a continuidade da linha do tempo.
    pass


def downgrade() -> None:
    # A lógica de downgrade correspondente também pode ser vazia.
    pass
