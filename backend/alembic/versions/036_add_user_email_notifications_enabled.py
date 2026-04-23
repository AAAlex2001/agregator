"""add email_notifications_enabled flag to users

Revision ID: 036
Revises: 035
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "036"
down_revision: Union[str, None] = "035"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "email_notifications_enabled",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )
    op.alter_column("users", "email_notifications_enabled", server_default=sa.text("true"))


def downgrade() -> None:
    op.drop_column("users", "email_notifications_enabled")
