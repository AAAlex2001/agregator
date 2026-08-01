"""ИНН инспекционного органа в анкете аудита СУПБ

Revision ID: 149
Revises: 148
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "149"
down_revision: str | None = "148"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "expert_audit_profiles",
        sa.Column("inn", sa.String(12), nullable=False, server_default=""),
    )


def downgrade() -> None:
    op.drop_column("expert_audit_profiles", "inn")
