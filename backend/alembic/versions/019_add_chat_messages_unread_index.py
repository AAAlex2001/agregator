"""add composite index on chat_messages for unread count

Revision ID: 019
Revises: 018
Create Date: 2026-02-24 00:00:00.000000
"""

from alembic import op

revision = "019"
down_revision = "018"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Partial index: only unread rows — tiny, fits in RAM, O(1) unread count per chat+user
    op.create_index(
        "ix_chat_messages_unread",
        "chat_messages",
        ["chat_id", "sender_id", "is_read"],
        postgresql_where="is_read = false",
    )


def downgrade() -> None:
    op.drop_index("ix_chat_messages_unread", table_name="chat_messages")
