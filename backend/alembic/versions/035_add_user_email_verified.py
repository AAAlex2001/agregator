"""add email_verified flag to users

Revision ID: 035
Revises: 034
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "035"
down_revision: Union[str, None] = "034"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("email_verified", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )
    # Новые пользователи будут создаваться с false на уровне ORM defaults.
    op.alter_column("users", "email_verified", server_default=None)


def downgrade() -> None:
    op.drop_column("users", "email_verified")
