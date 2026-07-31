"""направления НИР и лабораторных исследований

Revision ID: 146
Revises: 145
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "146"
down_revision: str | None = "145"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

LEGACY_KEY = "RESEARCH_LAB"
NEW_KEYS = ("RESEARCH", "LABORATORY")


def upgrade() -> None:
    for key in NEW_KEYS:
        op.execute(f"ALTER TYPE orderworktype ADD VALUE IF NOT EXISTS '{key}'")

    op.create_table(
        "order_research_details",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), nullable=False),
        sa.Column("executor_requirements", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("needs_site_visit", sa.Boolean(), nullable=False, server_default="false"),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("order_id", name="uq_order_research_details_order_id"),
    )
    op.create_index("ix_order_research_details_order_id", "order_research_details", ["order_id"])

    op.create_table(
        "order_laboratory_details",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), nullable=False),
        sa.Column("equipment_requirements", sa.Text(), nullable=False, server_default=""),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("order_id", name="uq_order_laboratory_details_order_id"),
    )
    op.create_index("ix_order_laboratory_details_order_id", "order_laboratory_details", ["order_id"])

    added_keys = ", ".join(f"'{key}'" for key in NEW_KEYS)
    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types || "
        f"jsonb_build_array({added_keys}) "
        "WHERE notify_order_types IS NOT NULL "
        f"AND notify_order_types @> '[\"{LEGACY_KEY}\"]'::jsonb"
    )


def downgrade() -> None:
    for key in NEW_KEYS:
        op.execute(
            "UPDATE experts SET notify_order_types = notify_order_types - "
            f"'{key}' WHERE notify_order_types IS NOT NULL"
        )
    op.drop_table("order_laboratory_details")
    op.drop_table("order_research_details")
