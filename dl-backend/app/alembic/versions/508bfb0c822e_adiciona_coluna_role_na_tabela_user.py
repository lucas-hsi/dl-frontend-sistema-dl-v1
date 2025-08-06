"""adiciona_coluna_role_na_tabela_user

Revision ID: 508bfb0c822e
Revises: 508bfb0c822d
Create Date: 2025-08-03 03:55:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = '508bfb0c822e'
down_revision = '508bfb0c822d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('user', sa.Column('role', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('user', 'role')