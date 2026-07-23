"""harden contacts, labor listings and chat writes

Revision ID: 141
Revises: 140
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "141"
down_revision: str | None = "140"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        "ALTER TYPE notificationtype "
        "ADD VALUE IF NOT EXISTS 'LABOR_RESPONSE'"
    )

    op.add_column(
        "labor_listings",
        sa.Column(
            "client_request_id",
            postgresql.UUID(as_uuid=True),
            nullable=True,
        ),
    )
    op.create_unique_constraint(
        "uq_labor_listings_owner_request",
        "labor_listings",
        ["owner_id", "client_request_id"],
    )

    op.add_column(
        "chat_messages",
        sa.Column(
            "client_message_id",
            postgresql.UUID(as_uuid=True),
            nullable=True,
        ),
    )

    op.add_column(
        "chats",
        sa.Column(
            "labor_response_is_read",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )
    op.create_unique_constraint(
        "uq_chat_messages_sender_request",
        "chat_messages",
        ["chat_id", "sender_id", "client_message_id"],
    )

    op.add_column(
        "contact_access_deals",
        sa.Column(
            "buyer_deleted_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )

    op.alter_column(
        "reviews",
        "order_id",
        existing_type=sa.Integer(),
        nullable=True,
    )
    op.alter_column(
        "reviews",
        "response_id",
        existing_type=sa.Integer(),
        nullable=True,
    )
    op.add_column(
        "reviews",
        sa.Column("contact_deal_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_reviews_contact_deal_id",
        "reviews",
        "contact_access_deals",
        ["contact_deal_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_index(
        "ix_reviews_contact_deal_id",
        "reviews",
        ["contact_deal_id"],
    )
    op.create_unique_constraint(
        "uq_reviews_contact_deal_customer",
        "reviews",
        ["contact_deal_id", "customer_id"],
    )
    op.create_check_constraint(
        "ck_reviews_single_source",
        "reviews",
        (
            "(response_id IS NOT NULL AND order_id IS NOT NULL "
            "AND contact_deal_id IS NULL) OR "
            "(response_id IS NULL AND order_id IS NULL "
            "AND contact_deal_id IS NOT NULL)"
        ),
    )

    op.execute(
        "CREATE INDEX ix_labor_listings_active_kind_created "
        "ON labor_listings (kind, created_at DESC) "
        "WHERE is_active"
    )
    op.execute(
        "CREATE INDEX ix_labor_listings_active_owner_kind_created "
        "ON labor_listings (owner_id, kind, created_at DESC) "
        "WHERE is_active"
    )
    op.execute(
        "CREATE INDEX ix_users_contact_catalog "
        "ON users (contact_sales_enabled DESC, rating DESC NULLS LAST, id DESC) "
        "WHERE role = 'EXPERT' AND is_active"
    )
    op.execute(
        "CREATE INDEX ix_contact_deals_seller_updated "
        "ON contact_access_deals (seller_id, updated_at DESC, id DESC)"
    )
    op.execute(
        "CREATE INDEX ix_contact_deals_buyer_updated "
        "ON contact_access_deals (buyer_id, updated_at DESC, id DESC) "
        "WHERE buyer_deleted_at IS NULL"
    )
    op.execute(
        "CREATE INDEX ix_contact_deals_status_updated "
        "ON contact_access_deals (status, updated_at DESC, id DESC)"
    )
    op.create_index(
        "ix_contact_receipts_deal_status",
        "contact_payment_receipts",
        ["deal_id", "status"],
    )


def downgrade() -> None:
    op.execute("DELETE FROM reviews WHERE contact_deal_id IS NOT NULL")
    op.drop_index(
        "ix_contact_receipts_deal_status",
        table_name="contact_payment_receipts",
    )
    op.execute("DROP INDEX IF EXISTS ix_contact_deals_status_updated")
    op.execute("DROP INDEX IF EXISTS ix_contact_deals_buyer_updated")
    op.execute("DROP INDEX IF EXISTS ix_contact_deals_seller_updated")
    op.execute("DROP INDEX IF EXISTS ix_users_contact_catalog")
    op.execute(
        "DROP INDEX IF EXISTS ix_labor_listings_active_owner_kind_created"
    )
    op.execute("DROP INDEX IF EXISTS ix_labor_listings_active_kind_created")

    op.drop_constraint("ck_reviews_single_source", "reviews", type_="check")
    op.drop_constraint(
        "uq_reviews_contact_deal_customer",
        "reviews",
        type_="unique",
    )
    op.drop_index("ix_reviews_contact_deal_id", table_name="reviews")
    op.drop_constraint(
        "fk_reviews_contact_deal_id",
        "reviews",
        type_="foreignkey",
    )
    op.drop_column("reviews", "contact_deal_id")
    op.alter_column(
        "reviews",
        "response_id",
        existing_type=sa.Integer(),
        nullable=False,
    )
    op.alter_column(
        "reviews",
        "order_id",
        existing_type=sa.Integer(),
        nullable=False,
    )

    op.drop_column("contact_access_deals", "buyer_deleted_at")
    op.drop_column("chats", "labor_response_is_read")
    op.drop_constraint(
        "uq_chat_messages_sender_request",
        "chat_messages",
        type_="unique",
    )
    op.drop_column("chat_messages", "client_message_id")
    op.drop_constraint(
        "uq_labor_listings_owner_request",
        "labor_listings",
        type_="unique",
    )
    op.drop_column("labor_listings", "client_request_id")
