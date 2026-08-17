"""Отрасль науки в анкете исполнителя НИР

Revision ID: 165
Revises: 164
"""
from collections.abc import Sequence

from alembic import op

revision: str = "165"
down_revision: str | None = "164"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE expert_research_profiles "
        "ADD COLUMN IF NOT EXISTS science_branch VARCHAR(100) NOT NULL DEFAULT ''"
    )


def downgrade() -> None:
    op.execute("ALTER TABLE expert_research_profiles DROP COLUMN IF EXISTS science_branch")
