"""turn off all email notifications for existing license holders

Revision ID: 088
Revises: 087
"""
from typing import Sequence, Union

from alembic import op


revision: str = "088"
down_revision: Union[str, None] = "087"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


EMAIL_FLAGS = [
    "email_on_response_created",
    "email_on_response_updated",
    "email_on_expert_rejected",
    "email_on_order_updated",
    "email_on_bidding_finished",
    "email_on_chat_message",
    "email_on_question_asked",
    "email_on_question_answered",
]


def upgrade() -> None:
    setters = ", ".join(f"{flag} = FALSE" for flag in EMAIL_FLAGS)
    op.execute(f"UPDATE users SET {setters} WHERE role = 'LICENSE_HOLDER'")


def downgrade() -> None:
    pass
