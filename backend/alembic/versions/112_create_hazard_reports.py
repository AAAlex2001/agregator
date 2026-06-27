"""create hazard_reports (expert saved assessments)

Revision ID: 112
Revises: 111
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "112"
down_revision: str | None = "111"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "hazard_reports",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("expert_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=300), nullable=False, server_default=""),
        sa.Column("profile", sa.String(length=10), nullable=False),
        sa.Column("selections", postgresql.JSONB(), nullable=False, server_default="{}"),
        sa.Column("overall_r", sa.Float(), nullable=False, server_default="0"),
        sa.Column("overall_category", sa.String(length=120), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_hazard_reports_expert_id", "hazard_reports", ["expert_id"])


def downgrade() -> None:
    op.drop_index("ix_hazard_reports_expert_id", table_name="hazard_reports")
    op.drop_table("hazard_reports")
