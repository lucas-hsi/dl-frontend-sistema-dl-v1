"""add_default_users_seed

Revision ID: 234589330454
Revises: 508bfb0c822e
Create Date: 2025-08-03 00:20:26.677873

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
import uuid


# revision identifiers, used by Alembic.
revision = '234589330454'
down_revision = '508bfb0c822e'
branch_labels = None
depends_on = None


def upgrade():
    # SEED: usuários padrão (idempotente)
    op.execute("""
        INSERT INTO "user" (id, email, hashed_password, full_name, is_active, is_superuser, role)
        VALUES
          -- gestor@dl.com / gestor123
          ('""" + str(uuid.uuid4()) + """',
           'gestor@dl.com',
           '$2b$12$ZMtbRWNu8aBwTkYe5kAdAuLmNSJfJAU/QSei7x4sjWcPzqCjERo7.',
           'Gestor', true, true, 'GESTOR'),
          -- vendedor@dl.com / vendedor123
          ('""" + str(uuid.uuid4()) + """',
           'vendedor@dl.com',
           '$2b$12$BhAFB0XKj/t37redfMoSvu7.p43NOUzC1t8gHgpUba8pxilY1zJam',
           'Vendedor', true, false, 'VENDEDOR'),
          -- anuncios@dl.com / anuncios123
          ('""" + str(uuid.uuid4()) + """',
           'anuncios@dl.com',
           '$2b$12$i3tmvZMUek3DNGGxxrVNau6JT.ut/POX1//LmZ7tihF4F9yrazrRO',
           'Anuncios', true, false, 'ANUNCIOS')
        ON CONFLICT (email) DO UPDATE
        SET hashed_password = EXCLUDED.hashed_password,
            full_name       = EXCLUDED.full_name,
            is_active       = EXCLUDED.is_active,
            is_superuser    = EXCLUDED.is_superuser,
            role            = EXCLUDED.role;
    """)


def downgrade():
    # Remove os usuários seedados
    op.execute("""
        DELETE FROM "user" 
        WHERE email IN ('gestor@dl.com', 'vendedor@dl.com', 'anuncios@dl.com');
    """)
