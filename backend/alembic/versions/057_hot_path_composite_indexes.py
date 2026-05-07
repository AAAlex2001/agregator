"""composite indexes for hot read paths

Revision ID: 057
Revises: 056
"""
from typing import Sequence, Union

from alembic import op


revision: str = "057"
down_revision: Union[str, None] = "056"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# (имя_индекса, таблица, колонки)
INDEXES: list[tuple[str, str, list[str]]] = [
    # Списки откликов: фильтр expert_id + сортировка по created_at desc
    ("ix_order_responses_expert_created", "order_responses", ["expert_id", "created_at DESC"]),
    # list_active_siblings / list_auto_rejected — order_id + status
    ("ix_order_responses_order_status", "order_responses", ["order_id", "status"]),
    # Сообщения чата: пагинация по дате
    ("ix_chat_messages_chat_created", "chat_messages", ["chat_id", "created_at"]),
    # Список уведомлений пользователя
    ("ix_notifications_user_created", "notifications", ["user_id", "created_at DESC"]),
    # Вопросы по заказу
    ("ix_order_questions_order_asked", "order_questions", ["order_id", "asked_at"]),
    # Отзывы об эксперте
    ("ix_reviews_expert_created", "reviews", ["expert_id", "created_at DESC"]),
    # Сообщения поддержки
    ("ix_support_messages_ticket_created", "support_messages", ["ticket_id", "created_at"]),
    # Тикеты пользователя в поддержке
    ("ix_support_tickets_user_updated", "support_tickets", ["user_id", "updated_at DESC"]),
    # Заказы заказчика
    ("ix_orders_customer_created", "orders", ["customer_id", "created_at DESC"]),
]


def upgrade() -> None:
    for name, table, cols in INDEXES:
        op.execute(
            f"CREATE INDEX IF NOT EXISTS {name} ON {table} ({', '.join(cols)})"
        )


def downgrade() -> None:
    for name, _table, _cols in INDEXES:
        op.execute(f"DROP INDEX IF EXISTS {name}")
