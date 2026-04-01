"""add performance indexes for hot queries

Revision ID: 027
Revises: 026
Create Date: 2026-04-01 14:10:00.000000
"""

from alembic import op

revision = "027"
down_revision = "026"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index(
        "ix_orders_status_assigned_created_at",
        "orders",
        ["status", "assigned_expert_id", "created_at"],
    )
    op.create_index(
        "ix_orders_customer_created_at",
        "orders",
        ["customer_id", "created_at"],
    )
    op.create_index(
        "ix_order_responses_expert_status_created_at",
        "order_responses",
        ["expert_id", "status", "created_at"],
    )
    op.create_index(
        "ix_order_responses_order_status_created_at",
        "order_responses",
        ["order_id", "status", "created_at"],
    )
    op.create_index(
        "ix_chats_customer_updated_at",
        "chats",
        ["customer_id", "updated_at"],
    )
    op.create_index(
        "ix_chats_expert_updated_at",
        "chats",
        ["expert_id", "updated_at"],
    )
    op.create_index(
        "ix_chat_messages_chat_id_id",
        "chat_messages",
        ["chat_id", "id"],
    )
    op.create_index(
        "ix_payments_user_created_at",
        "payments",
        ["user_id", "created_at"],
    )
    op.create_index(
        "ix_reviews_expert_created_at",
        "reviews",
        ["expert_id", "created_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_reviews_expert_created_at", table_name="reviews")
    op.drop_index("ix_payments_user_created_at", table_name="payments")
    op.drop_index("ix_chat_messages_chat_id_id", table_name="chat_messages")
    op.drop_index("ix_chats_expert_updated_at", table_name="chats")
    op.drop_index("ix_chats_customer_updated_at", table_name="chats")
    op.drop_index("ix_order_responses_order_status_created_at", table_name="order_responses")
    op.drop_index("ix_order_responses_expert_status_created_at", table_name="order_responses")
    op.drop_index("ix_orders_customer_created_at", table_name="orders")
    op.drop_index("ix_orders_status_assigned_created_at", table_name="orders")
