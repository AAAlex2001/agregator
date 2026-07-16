"""add order work type

Revision ID: 134
Revises: 133
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "134"
down_revision: str | None = "133"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    work_type = sa.Enum(
        "EXPERTISE",
        "DESIGN_SURVEY",
        "INSPECTION_TESTING",
        "RESEARCH_LAB",
        "OTHER",
        name="orderworktype",
    )
    work_type.create(op.get_bind(), checkfirst=True)
    op.add_column(
        "orders",
        sa.Column("work_type", work_type, nullable=False, server_default="EXPERTISE"),
    )


def downgrade() -> None:
    op.drop_column("orders", "work_type")
    sa.Enum(name="orderworktype").drop(op.get_bind(), checkfirst=True)
