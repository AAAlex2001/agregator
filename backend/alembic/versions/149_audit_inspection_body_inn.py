"""ИНН инспекционного органа в анкете аудита СУПБ

Revision ID: 149
Revises: 148
"""
from collections.abc import Sequence

from alembic import op

revision: str = "149"
down_revision: str | None = "148"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE expert_audit_profiles "
        "ADD COLUMN IF NOT EXISTS inn VARCHAR(12) NOT NULL DEFAULT ''"
    )


def downgrade() -> None:
    op.execute("ALTER TABLE expert_audit_profiles DROP COLUMN IF EXISTS inn")
