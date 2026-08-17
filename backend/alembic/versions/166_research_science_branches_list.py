"""Отрасли науки списком в анкете исполнителя НИР

Revision ID: 166
Revises: 165
"""
from collections.abc import Sequence

from alembic import op

revision: str = "166"
down_revision: str | None = "165"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE expert_research_profiles "
        "ADD COLUMN IF NOT EXISTS science_branches JSONB NOT NULL DEFAULT '[]'"
    )
    op.execute("ALTER TABLE expert_research_profiles DROP COLUMN IF EXISTS science_branch")


def downgrade() -> None:
    op.execute(
        "ALTER TABLE expert_research_profiles "
        "ADD COLUMN IF NOT EXISTS science_branch VARCHAR(100) NOT NULL DEFAULT ''"
    )
    op.execute("ALTER TABLE expert_research_profiles DROP COLUMN IF EXISTS science_branches")
