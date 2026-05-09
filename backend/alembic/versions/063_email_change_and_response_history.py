"""email_change_requests + previous offer fields on order_responses

Revision ID: 063
Revises: 062
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "063"
down_revision: Union[str, None] = "062"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "email_change_requests",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("new_email", sa.String(), nullable=False),
        sa.Column("code", sa.String(length=10), nullable=False),
        sa.Column("is_used", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "expires_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now() + interval '15 minutes'"),
        ),
        sa.UniqueConstraint("user_id", name="uq_email_change_requests_user"),
    )

    op.add_column(
        "order_responses",
        sa.Column("previous_proposed_sum_amount", sa.BigInteger(), nullable=True),
    )
    op.add_column(
        "order_responses",
        sa.Column("previous_proposed_deadline", sa.Date(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("order_responses", "previous_proposed_deadline")
    op.drop_column("order_responses", "previous_proposed_sum_amount")
    op.drop_table("email_change_requests")
