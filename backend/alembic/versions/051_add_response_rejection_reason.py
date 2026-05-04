"""add rejection_reason to order_responses

Revision ID: 051
Revises: 050
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "051"
down_revision: Union[str, None] = "050"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "order_responses",
        sa.Column("rejection_reason", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("order_responses", "rejection_reason")
