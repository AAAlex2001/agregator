"""add company, typical_names to orders and extend badgevariant enum

Revision ID: 008
Revises: 007
Create Date: 2026-02-16 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "008"
down_revision: Union[str, None] = "007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "orders",
        sa.Column("company", sa.String(500), nullable=False, server_default=""),
    )
    op.add_column(
        "orders",
        sa.Column("typical_names", sa.String(1000), nullable=False, server_default=""),
    )

    op.execute("ALTER TYPE badgevariant ADD VALUE IF NOT EXISTS 'GRAY'")
    op.execute("ALTER TYPE badgevariant ADD VALUE IF NOT EXISTS 'ORANGE'")
    op.execute("ALTER TYPE badgevariant ADD VALUE IF NOT EXISTS 'BROWN'")

    op.alter_column(
        "orders", "sum_amount",
        existing_type=sa.Integer(),
        type_=sa.BigInteger(),
    )


def downgrade() -> None:
    op.alter_column(
        "orders", "sum_amount",
        existing_type=sa.BigInteger(),
        type_=sa.Integer(),
    )
    op.drop_column("orders", "typical_names")
    op.drop_column("orders", "company")
