"""Настройки Telegram-поста, отложенная публикация, автоудаление и шаблоны.

Revision ID: 183
Revises: 182
"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision = "183"
down_revision = "182"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Колонки настроек и расписания у постов, срок удаления у доставок, таблица шаблонов."""
    op.add_column(
        "posts",
        sa.Column(
            "telegram",
            postgresql.JSONB(),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
    )
    op.add_column("posts", sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=True))
    op.drop_constraint("ck_posts_status", "posts", type_="check")
    op.create_check_constraint(
        "ck_posts_status",
        "posts",
        "status IN ('draft', 'scheduled', 'published', 'hidden')",
    )
    op.create_index(
        "ix_posts_scheduled",
        "posts",
        ["scheduled_at"],
        postgresql_where=sa.text("status = 'scheduled'"),
    )

    op.add_column("post_deliveries", sa.Column("delete_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index(
        "ix_post_deliveries_delete_at",
        "post_deliveries",
        ["delete_at"],
        postgresql_where=sa.text("status = 'sent' AND delete_at IS NOT NULL"),
    )

    op.create_table(
        "post_templates",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "owner_id",
            sa.Integer(),
            sa.ForeignKey("accounts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(100), nullable=False),
        sa.Column("html", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_post_templates_owner_id", "post_templates", ["owner_id"])


def downgrade() -> None:
    """Отложенные посты становятся черновиками, затем колонки и таблица удаляются."""
    op.drop_table("post_templates")
    op.drop_index("ix_post_deliveries_delete_at", table_name="post_deliveries")
    op.drop_column("post_deliveries", "delete_at")
    op.execute("UPDATE posts SET status = 'draft' WHERE status = 'scheduled'")
    op.drop_index("ix_posts_scheduled", table_name="posts")
    op.drop_constraint("ck_posts_status", "posts", type_="check")
    op.create_check_constraint("ck_posts_status", "posts", "status IN ('draft', 'published', 'hidden')")
    op.drop_column("posts", "scheduled_at")
    op.drop_column("posts", "telegram")
