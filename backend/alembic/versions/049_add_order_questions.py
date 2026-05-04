"""add order_questions table

Revision ID: 049
Revises: 047
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "049"
down_revision: Union[str, None] = "047"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "order_questions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "order_id",
            sa.Integer(),
            sa.ForeignKey("orders.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "expert_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("question", sa.Text(), nullable=False),
        sa.Column("answer", sa.Text(), nullable=True),
        sa.Column(
            "asked_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("answered_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("order_id", "expert_id", name="uq_order_questions_order_expert"),
    )
    op.create_index("ix_order_questions_order_id", "order_questions", ["order_id"])
    op.create_index("ix_order_questions_expert_id", "order_questions", ["expert_id"])


def downgrade() -> None:
    op.drop_index("ix_order_questions_expert_id", table_name="order_questions")
    op.drop_index("ix_order_questions_order_id", table_name="order_questions")
    op.drop_table("order_questions")
