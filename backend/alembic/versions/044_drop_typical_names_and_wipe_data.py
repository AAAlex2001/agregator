"""drop orders.typical_names

Revision ID: 044
Revises: 043
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "044"
down_revision: Union[str, None] = "043"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("orders", "typical_names")


def downgrade() -> None:
    op.add_column(
        "orders",
        sa.Column("typical_names", sa.String(1000), nullable=False, server_default=""),
    )
