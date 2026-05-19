"""add start_date / proposed_start_date and WITHDRAWN_BY_EXPERT response status

Revision ID: 082
Revises: 081
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "082"
down_revision: Union[str, None] = "081"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("start_date", sa.Date(), nullable=True))
    op.add_column(
        "order_responses",
        sa.Column("proposed_start_date", sa.Date(), nullable=True),
    )
    op.add_column(
        "order_responses",
        sa.Column("previous_proposed_start_date", sa.Date(), nullable=True),
    )
    op.execute("ALTER TYPE responsestatus ADD VALUE IF NOT EXISTS 'WITHDRAWN_BY_EXPERT'")


def downgrade() -> None:
    op.drop_column("order_responses", "previous_proposed_start_date")
    op.drop_column("order_responses", "proposed_start_date")
    op.drop_column("orders", "start_date")
