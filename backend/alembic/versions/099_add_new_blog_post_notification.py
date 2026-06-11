"""add NEW_BLOG_POST value to notificationtype enum

Revision ID: 099
Revises: 098
"""
from collections.abc import Sequence

from alembic import op

revision: str = "099"
down_revision: str | None = "098"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("ALTER TYPE notificationtype ADD VALUE IF NOT EXISTS 'NEW_BLOG_POST'")


def downgrade() -> None:
    "Postgres не поддерживает удаление значения из enum без пересоздания типа."
