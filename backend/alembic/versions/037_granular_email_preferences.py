"""granular email preferences per notification type

Revision ID: 037
Revises: 036
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "037"
down_revision: Union[str, None] = "036"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


GRANULAR_COLUMNS = [
    "email_on_response_created",
    "email_on_response_updated",
    "email_on_expert_rejected",
    "email_on_new_order",
    "email_on_order_updated",
    "email_on_bidding_finished",
    "email_on_chat_message",
]


def upgrade() -> None:
    for name in GRANULAR_COLUMNS:
        op.add_column(
            "users",
            sa.Column(name, sa.Boolean(), nullable=False, server_default=sa.text("true")),
        )
    op.drop_column("users", "email_notifications_enabled")


def downgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "email_notifications_enabled",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )
    for name in GRANULAR_COLUMNS:
        op.drop_column("users", name)
