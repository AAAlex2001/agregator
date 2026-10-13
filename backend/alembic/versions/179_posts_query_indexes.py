"""Индексы выборок публикаций и карты сайта.

Revision ID: 179
Revises: 178
"""

import sqlalchemy as sa

from alembic import op

revision = "179"
down_revision = "178"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Добавляет индексы под фильтры, порядок выдачи и новые страницы карты сайта."""
    op.create_index(
        "ix_posts_author_status_feed",
        "posts",
        [
            "author_id",
            "status",
            sa.literal_column("coalesce(published_at, created_at) DESC"),
            sa.literal_column("id DESC"),
        ],
    )
    op.drop_index("ix_posts_author_feed", table_name="posts")
    op.create_index(
        "ix_posts_author_published",
        "posts",
        ["author_id", "published_at"],
        postgresql_where=sa.text("status = 'published'"),
    )
    op.create_index(
        "ix_posts_sitemap",
        "posts",
        ["id"],
        postgresql_where=sa.text("status = 'published' AND repost_of_id IS NULL"),
        postgresql_include=["updated_at"],
    )
    op.create_index(
        "ix_post_saves_user_recent",
        "post_saves",
        ["user_id", sa.literal_column("created_at DESC"), sa.literal_column("post_id DESC")],
    )
    op.create_index(
        "ix_post_media_free_owner",
        "post_media",
        ["owner_id"],
        postgresql_where=sa.text("post_id IS NULL"),
    )
    op.create_index(
        "ix_post_reports_status_recent",
        "post_reports",
        ["status", sa.literal_column("created_at DESC"), sa.literal_column("id DESC")],
    )
    op.drop_index("ix_post_reports_status", table_name="post_reports")


def downgrade() -> None:
    """Возвращает индексы предыдущей версии без изменения данных."""
    op.create_index("ix_post_reports_status", "post_reports", ["status"])
    op.drop_index("ix_post_reports_status_recent", table_name="post_reports")
    op.drop_index("ix_post_media_free_owner", table_name="post_media")
    op.drop_index("ix_post_saves_user_recent", table_name="post_saves")
    op.drop_index("ix_posts_sitemap", table_name="posts")
    op.drop_index("ix_posts_author_published", table_name="posts")
    op.create_index(
        "ix_posts_author_feed",
        "posts",
        [
            "author_id",
            sa.literal_column("coalesce(published_at, created_at) DESC"),
            sa.literal_column("id DESC"),
        ],
    )
    op.drop_index("ix_posts_author_status_feed", table_name="posts")
