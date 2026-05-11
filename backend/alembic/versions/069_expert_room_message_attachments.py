"""Добавить attachments JSONB в expert_room_messages + сделать text опциональным
(сообщение может быть только с файлами без текста).

Идемпотентна: ADD COLUMN IF NOT EXISTS + ALTER COLUMN ... DROP NOT NULL.

Revision ID: 069
Revises: 068
"""
from typing import Sequence, Union

from alembic import op


revision: str = "069"
down_revision: Union[str, None] = "068"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE expert_room_messages "
        "ADD COLUMN IF NOT EXISTS attachments JSONB NOT NULL DEFAULT '[]'::jsonb"
    )
    # text больше не обязателен: можно отправить сообщение, состоящее только из файлов.
    op.execute(
        "ALTER TABLE expert_room_messages "
        "ALTER COLUMN text SET DEFAULT ''"
    )


def downgrade() -> None:
    op.execute("ALTER TABLE expert_room_messages DROP COLUMN IF EXISTS attachments")
    op.execute("ALTER TABLE expert_room_messages ALTER COLUMN text DROP DEFAULT")
