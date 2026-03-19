"""add public_id uuid to orders

Revision ID: 025
Revises: 024
"""

import uuid

from alembic import op
import sqlalchemy as sa

revision = "025"
down_revision = "024"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("public_id", sa.String(36), nullable=True))
    op.execute(
        "UPDATE orders SET public_id = gen_random_uuid()::text WHERE public_id IS NULL"
    )
    op.alter_column("orders", "public_id", nullable=False)
    op.create_unique_constraint("uq_orders_public_id", "orders", ["public_id"])
    op.create_index("ix_orders_public_id", "orders", ["public_id"])


def downgrade() -> None:
    op.drop_index("ix_orders_public_id", table_name="orders")
    op.drop_constraint("uq_orders_public_id", "orders", type_="unique")
    op.drop_column("orders", "public_id")
