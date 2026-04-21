"""add auto_rejected flag to order_responses

Revision ID: 033
Revises: 032
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision: str = "033"
down_revision: Union[str, None] = "032"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _has_column(inspector, table: str, column: str) -> bool:
    return any(c["name"] == column for c in inspector.get_columns(table))


def upgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)
    if _has_column(inspector, "order_responses", "auto_rejected"):
        return
    op.add_column(
        "order_responses",
        sa.Column("auto_rejected", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )


def downgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)
    if _has_column(inspector, "order_responses", "auto_rejected"):
        op.drop_column("order_responses", "auto_rejected")
