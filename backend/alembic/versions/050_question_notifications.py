"""add question notification types and user email toggles

Revision ID: 050
Revises: 049
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "050"
down_revision: Union[str, None] = "049"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE notificationtype ADD VALUE IF NOT EXISTS 'QUESTION_ASKED'")
        op.execute("ALTER TYPE notificationtype ADD VALUE IF NOT EXISTS 'QUESTION_ANSWERED'")

    op.add_column(
        "users",
        sa.Column(
            "email_on_question_asked",
            sa.Boolean(),
            nullable=False,
            server_default="true",
        ),
    )
    op.add_column(
        "users",
        sa.Column(
            "email_on_question_answered",
            sa.Boolean(),
            nullable=False,
            server_default="true",
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "email_on_question_answered")
    op.drop_column("users", "email_on_question_asked")
