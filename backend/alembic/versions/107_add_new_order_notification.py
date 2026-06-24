"""add NEW_ORDER value to notificationtype enum

Revision ID: 107
Revises: 106
"""
from collections.abc import Sequence

from alembic import op

revision: str = "107"
down_revision: str | None = "106"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("ALTER TYPE notificationtype ADD VALUE IF NOT EXISTS 'NEW_ORDER'")


def downgrade() -> None:
    "Postgres не поддерживает удаление значения из enum без пересоздания типа."
