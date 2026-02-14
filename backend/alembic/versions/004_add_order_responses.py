"""add order responses

Revision ID: 004
Revises: 003
Create Date: 2026-02-14 22:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "order_responses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("order_id", sa.Integer(), nullable=False),
        sa.Column("expert_id", sa.Integer(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=False, server_default=""),
        sa.Column("proposed_sum_amount", sa.Integer(), nullable=False),
        sa.Column("proposed_deadline", sa.Date(), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "REVIEW",
                "REJECTED",
                "ACCEPTED",
                "COMPLETED",
                "ARCHIVED",
                name="responsestatus",
            ),
            nullable=False,
            server_default="REVIEW",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["expert_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("order_id", "expert_id", name="uq_order_responses_order_expert"),
    )
    op.create_index(op.f("ix_order_responses_id"), "order_responses", ["id"], unique=False)
    op.create_index(op.f("ix_order_responses_order_id"), "order_responses", ["order_id"], unique=False)
    op.create_index(op.f("ix_order_responses_expert_id"), "order_responses", ["expert_id"], unique=False)
    op.create_index(op.f("ix_order_responses_status"), "order_responses", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_order_responses_status"), table_name="order_responses")
    op.drop_index(op.f("ix_order_responses_expert_id"), table_name="order_responses")
    op.drop_index(op.f("ix_order_responses_order_id"), table_name="order_responses")
    op.drop_index(op.f("ix_order_responses_id"), table_name="order_responses")
    op.drop_table("order_responses")
    op.execute("DROP TYPE responsestatus")
