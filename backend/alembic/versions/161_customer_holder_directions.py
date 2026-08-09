"""Отметки направлений у заказчика и держателя разрешительных документов

Revision ID: 161
Revises: 160
"""
from collections.abc import Sequence

from alembic import op

revision: str = "161"
down_revision: str | None = "160"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

TABLES = ("customers", "license_holders")


def upgrade() -> None:
    for table in TABLES:
        op.execute(
            f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS directions "
            "JSONB NOT NULL DEFAULT '[]'"
        )


def downgrade() -> None:
    for table in TABLES:
        op.execute(f"ALTER TABLE {table} DROP COLUMN IF EXISTS directions")
