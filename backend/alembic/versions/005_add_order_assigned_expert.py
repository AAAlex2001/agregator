"""add assigned expert to orders

Revision ID: 005
Revises: 004
Create Date: 2026-02-14 23:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("assigned_expert_id", sa.Integer(), nullable=True))
    op.create_index(op.f("ix_orders_assigned_expert_id"), "orders", ["assigned_expert_id"], unique=False)
    op.create_foreign_key(
        "fk_orders_assigned_expert_id_users",
        "orders",
        "users",
        ["assigned_expert_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_orders_assigned_expert_id_users", "orders", type_="foreignkey")
    op.drop_index(op.f("ix_orders_assigned_expert_id"), table_name="orders")
    op.drop_column("orders", "assigned_expert_id")
