"""drop orders.typical_names and wipe user data, reset identities

Revision ID: 044
Revises: 043

Полная очистка пользовательских данных (КРОМЕ лендинга и тарифов).
Идентификаторы (sequences) сбрасываются — следующая запись начнётся с 1.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "044"
down_revision: Union[str, None] = "043"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


WIPE_TABLES = [
    "order_responses",
    "order_badges",
    "orders",
    "chat_messages",
    "chats",
    "reviews",
    "notifications",
    "password_reset_codes",
    "payments",
    "user_subscriptions",
    "sessions",
    "users",
]


def upgrade() -> None:
    op.drop_column("orders", "typical_names")
    op.execute(
        f"TRUNCATE TABLE {', '.join(WIPE_TABLES)} RESTART IDENTITY CASCADE"
    )


def downgrade() -> None:
    op.add_column(
        "orders",
        sa.Column("typical_names", sa.String(1000), nullable=False, server_default=""),
    )
