"""add NEW_BLOG_POST value to notificationtype enum

Revision ID: 099
Revises: 098
"""
from typing import Sequence, Union

from alembic import op

revision: str = "099"
down_revision: Union[str, None] = "098"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE notificationtype ADD VALUE IF NOT EXISTS 'NEW_BLOG_POST'")


def downgrade() -> None:
    "Postgres не поддерживает удаление значения из enum без пересоздания типа."
    pass
