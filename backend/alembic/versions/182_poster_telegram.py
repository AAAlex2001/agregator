"""Постер в Telegram: привязка бота, каналы, доставки постов и пост только для Telegram.

Revision ID: 182
Revises: 181
"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision = "182"
down_revision = "181"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Таблицы ссылок на бота, каналов и доставок; признак «пост на сайте»."""
    op.create_table(
        "telegram_link_tokens",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("token", sa.String(64), nullable=False, unique=True),
        sa.Column(
            "account_id",
            sa.Integer(),
            sa.ForeignKey("accounts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_telegram_link_tokens_account_id", "telegram_link_tokens", ["account_id"])

    op.create_table(
        "poster_channels",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "owner_id",
            sa.Integer(),
            sa.ForeignKey("accounts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("chat_id", sa.BigInteger(), nullable=False),
        sa.Column("kind", sa.String(16), nullable=False),
        sa.Column("title", sa.String(255), nullable=False, server_default=""),
        sa.Column("username", sa.String(64), nullable=True),
        sa.Column("members_count", sa.Integer(), nullable=True),
        sa.Column("can_post", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("owner_id", "chat_id", name="uq_poster_channels_owner_chat"),
    )
    op.create_index("ix_poster_channels_owner_id", "poster_channels", ["owner_id"])
    op.create_index("ix_poster_channels_chat_id", "poster_channels", ["chat_id"])

    op.create_table(
        "post_deliveries",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "post_id",
            sa.Integer(),
            sa.ForeignKey("posts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "channel_id",
            sa.Integer(),
            sa.ForeignKey("poster_channels.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("status", sa.String(16), nullable=False, server_default="pending"),
        sa.Column(
            "message_ids",
            postgresql.JSONB(),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column("error", sa.Text(), nullable=True),
        sa.Column("attempts", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("next_attempt_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("post_id", "channel_id", name="uq_post_deliveries_post_channel"),
    )
    op.create_index("ix_post_deliveries_post_id", "post_deliveries", ["post_id"])
    op.create_index("ix_post_deliveries_channel_id", "post_deliveries", ["channel_id"])
    op.create_index(
        "ix_post_deliveries_pending",
        "post_deliveries",
        ["id"],
        postgresql_where=sa.text("status = 'pending'"),
    )

    op.add_column(
        "posts",
        sa.Column("on_site", sa.Boolean(), nullable=False, server_default=sa.true()),
    )


def downgrade() -> None:
    """Убирает постер в Telegram целиком."""
    op.drop_column("posts", "on_site")
    op.drop_table("post_deliveries")
    op.drop_table("poster_channels")
    op.drop_table("telegram_link_tokens")
