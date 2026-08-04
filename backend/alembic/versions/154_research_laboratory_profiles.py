"""Анкеты исполнителей НИР и лабораторных исследований

Revision ID: 154
Revises: 153
"""
from collections.abc import Sequence

from alembic import op

revision: str = "154"
down_revision: str | None = "153"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS expert_research_profiles (
            id SERIAL PRIMARY KEY,
            expert_id INTEGER NOT NULL UNIQUE REFERENCES experts(id) ON DELETE CASCADE,
            academic_degree VARCHAR(300) NOT NULL DEFAULT '',
            academic_title VARCHAR(300) NOT NULL DEFAULT '',
            research_field TEXT NOT NULL DEFAULT '',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_expert_research_profiles_expert_id "
        "ON expert_research_profiles (expert_id)"
    )
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS expert_laboratory_profiles (
            id SERIAL PRIMARY KEY,
            expert_id INTEGER NOT NULL UNIQUE REFERENCES experts(id) ON DELETE CASCADE,
            accreditation_area TEXT NOT NULL DEFAULT '',
            comment TEXT NOT NULL DEFAULT '',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_expert_laboratory_profiles_expert_id "
        "ON expert_laboratory_profiles (expert_id)"
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS expert_laboratory_profiles")
    op.execute("DROP TABLE IF EXISTS expert_research_profiles")
