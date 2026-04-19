"""add avatar_url to users

Revision ID: 030
Revises: 029
"""

from alembic import op
import sqlalchemy as sa


revision = "030"
down_revision = "029"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("avatar_url", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "avatar_url")