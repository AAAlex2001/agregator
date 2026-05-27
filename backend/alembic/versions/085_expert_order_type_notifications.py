"""expert per-type new-order notifications

Revision ID: 085
Revises: 084
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "085"
down_revision: Union[str, None] = "084"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("notify_order_types", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )
    op.drop_column("users", "email_on_new_order")


def downgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "email_on_new_order",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )
    op.drop_column("users", "notify_order_types")
