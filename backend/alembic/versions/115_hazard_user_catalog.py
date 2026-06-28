"""hazard user catalog + report excluded_groups

Revision ID: 115
Revises: 114
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "115"
down_revision: str | None = "114"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "hazard_reports",
        sa.Column("excluded_groups", postgresql.JSONB(), nullable=False, server_default="[]"),
    )
    op.create_table(
        "hazard_user_catalogs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("expert_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("profile", sa.String(length=10), nullable=False),
        sa.Column("factors", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("expert_id", "profile", name="uq_hazard_user_catalog"),
    )
    op.create_index("ix_hazard_user_catalogs_expert_id", "hazard_user_catalogs", ["expert_id"])


def downgrade() -> None:
    op.drop_index("ix_hazard_user_catalogs_expert_id", table_name="hazard_user_catalogs")
    op.drop_table("hazard_user_catalogs")
    op.drop_column("hazard_reports", "excluded_groups")
