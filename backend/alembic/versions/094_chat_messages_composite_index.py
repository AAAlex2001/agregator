"""composite index on chat_messages (chat_id, created_at DESC)

Revision ID: 094
Revises: 093

Идемпотентна: CREATE INDEX IF NOT EXISTS / DROP INDEX IF EXISTS.
Ускоряет выборку списка чатов и постраничную загрузку сообщений.
"""
from typing import Sequence, Union

from alembic import op


revision: str = "094"
down_revision: Union[str, None] = "093"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_chat_messages_chat_id_created_at "
        "ON chat_messages (chat_id, created_at DESC)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_chat_messages_chat_id_created_at")
