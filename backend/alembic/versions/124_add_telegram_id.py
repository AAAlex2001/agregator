"""add telegram_id to users

Revision ID: 124
Revises: 123
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "124"
down_revision: Union[str, None] = "123"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("telegram_id", sa.BigInteger(), nullable=True))
    op.create_index("ix_users_telegram_id", "users", ["telegram_id"])
    op.create_unique_constraint("uq_users_telegram_id", "users", ["telegram_id"])


def downgrade() -> None:
    op.drop_constraint("uq_users_telegram_id", "users", type_="unique")
    op.drop_index("ix_users_telegram_id", table_name="users")
    op.drop_column("users", "telegram_id")
