"""Виды работ в заявке с сайта

Revision ID: 169
Revises: 168
"""
from collections.abc import Sequence

from alembic import op

revision: str = "169"
down_revision: str | None = "168"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE leads ADD COLUMN IF NOT EXISTS work_kinds VARCHAR(1000) NOT NULL DEFAULT ''"
    )


def downgrade() -> None:
    op.execute("ALTER TABLE leads DROP COLUMN IF EXISTS work_kinds")
