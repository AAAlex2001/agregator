"""Денормализация: last_message_text / last_message_at в support_tickets.
Поля заполняются при каждом новом сообщении в тикете.
Это снимает необходимость поднимать всю коллекцию messages при выводе списка тикетов.

Идемпотентна: ADD COLUMN IF NOT EXISTS + бэкфилл по существующим данным.

Revision ID: 072
Revises: 071
"""
from typing import Sequence, Union

from alembic import op


revision: str = "072"
down_revision: Union[str, None] = "071"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE support_tickets "
        "ADD COLUMN IF NOT EXISTS last_message_text TEXT NOT NULL DEFAULT ''"
    )
    op.execute(
        "ALTER TABLE support_tickets "
        "ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ"
    )

    # Бэкфилл: для каждого тикета берём последнее сообщение по created_at.
    op.execute(
        """
        UPDATE support_tickets t
        SET
            last_message_text = COALESCE(m.text, ''),
            last_message_at = m.created_at
        FROM (
            SELECT DISTINCT ON (ticket_id) ticket_id, text, created_at
            FROM support_ticket_messages
            ORDER BY ticket_id, created_at DESC
        ) m
        WHERE m.ticket_id = t.id;
        """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE support_tickets DROP COLUMN IF EXISTS last_message_text")
    op.execute("ALTER TABLE support_tickets DROP COLUMN IF EXISTS last_message_at")
