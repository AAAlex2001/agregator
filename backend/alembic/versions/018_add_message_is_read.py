"""add is_read to chat_messages

Revision ID: 018
Revises: 017
Create Date: 2026-02-20 00:02:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "018"
down_revision = "017"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "chat_messages",
        sa.Column("is_read", sa.Boolean(), nullable=False, server_default="false"),
    )


def downgrade() -> None:
    op.drop_column("chat_messages", "is_read")
