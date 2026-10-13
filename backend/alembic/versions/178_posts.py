"""Публикации, подписки авторов, комментарии и ИИ-помощник.

Revision ID: 178
Revises: 177
"""

import sqlalchemy as sa
from alembic import op

revision = "178"
down_revision = "177"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Создаёт таблицы публикаций и счётчик просмотренных подписок."""
    op.add_column("accounts", sa.Column("following_seen_at", sa.DateTime(timezone=True), nullable=True))
    op.execute("ALTER TYPE notificationtype ADD VALUE IF NOT EXISTS 'POST_ACTIVITY'")
    op.create_table(
        "post_ai_requests",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_post_ai_requests_user_created", "post_ai_requests", ["user_id", "created_at"], unique=False
    )
    op.create_table(
        "post_follows",
        sa.Column("follower_id", sa.Integer(), nullable=False),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["author_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["follower_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("follower_id", "author_id"),
    )
    op.create_index(op.f("ix_post_follows_author_id"), "post_follows", ["author_id"], unique=False)
    op.create_table(
        "posts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("repost_of_id", sa.Integer(), nullable=True),
        sa.Column("html", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("likes_count", sa.Integer(), nullable=False),
        sa.Column("comments_count", sa.Integer(), nullable=False),
        sa.Column("reposts_count", sa.Integer(), nullable=False),
        sa.Column("views_count", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("status IN ('draft', 'published', 'hidden')", name="ck_posts_status"),
        sa.ForeignKeyConstraint(["author_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["repost_of_id"], ["posts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_posts_author_feed",
        "posts",
        [
            "author_id",
            sa.literal_column("coalesce(published_at, created_at) DESC"),
            sa.literal_column("id DESC"),
        ],
        unique=False,
    )
    op.create_index(
        "ix_posts_feed",
        "posts",
        [sa.literal_column("coalesce(published_at, created_at) DESC"), sa.literal_column("id DESC")],
        unique=False,
        postgresql_where=sa.text("status = 'published'"),
    )
    op.create_index(op.f("ix_posts_repost_of_id"), "posts", ["repost_of_id"], unique=False)
    op.create_index(op.f("ix_posts_status"), "posts", ["status"], unique=False)
    op.create_table(
        "post_comments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("post_id", sa.Integer(), nullable=False),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("parent_id", sa.Integer(), nullable=True),
        sa.Column("reply_to_id", sa.Integer(), nullable=True),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("likes_count", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["author_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["parent_id"], ["post_comments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["post_id"], ["posts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["reply_to_id"], ["post_comments.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_post_comments_author_id"), "post_comments", ["author_id"], unique=False)
    op.create_index(op.f("ix_post_comments_post_id"), "post_comments", ["post_id"], unique=False)
    op.create_index(
        "ix_post_comments_replies", "post_comments", ["parent_id", "created_at", "id"], unique=False
    )
    op.create_index(op.f("ix_post_comments_reply_to_id"), "post_comments", ["reply_to_id"], unique=False)
    op.create_index(
        "ix_post_comments_roots",
        "post_comments",
        ["post_id", "created_at", "id"],
        unique=False,
        postgresql_where=sa.text("parent_id IS NULL"),
    )
    op.create_table(
        "post_likes",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("post_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["post_id"], ["posts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id", "post_id"),
    )
    op.create_index(op.f("ix_post_likes_post_id"), "post_likes", ["post_id"], unique=False)
    op.create_table(
        "post_media",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("post_id", sa.Integer(), nullable=True),
        sa.Column("kind", sa.String(length=16), nullable=False),
        sa.Column("path", sa.String(length=500), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("kind IN ('photo', 'video')", name="ck_post_media_kind"),
        sa.ForeignKeyConstraint(["owner_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["post_id"], ["posts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_post_media_owner_id"), "post_media", ["owner_id"], unique=False)
    op.create_index(op.f("ix_post_media_post_id"), "post_media", ["post_id"], unique=False)
    op.create_table(
        "post_saves",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("post_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["post_id"], ["posts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id", "post_id"),
    )
    op.create_index(op.f("ix_post_saves_post_id"), "post_saves", ["post_id"], unique=False)
    op.create_table(
        "post_views",
        sa.Column("post_id", sa.Integer(), nullable=False),
        sa.Column("visitor", sa.String(length=64), nullable=False),
        sa.Column("viewed_on", sa.Date(), nullable=False),
        sa.ForeignKeyConstraint(["post_id"], ["posts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("post_id", "visitor", "viewed_on"),
    )
    op.create_table(
        "post_comment_likes",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("comment_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["comment_id"], ["post_comments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id", "comment_id"),
    )
    op.create_index(
        op.f("ix_post_comment_likes_comment_id"), "post_comment_likes", ["comment_id"], unique=False
    )
    op.create_table(
        "post_reports",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("reporter_id", sa.Integer(), nullable=False),
        sa.Column("post_id", sa.Integer(), nullable=True),
        sa.Column("comment_id", sa.Integer(), nullable=True),
        sa.Column("reason", sa.String(length=500), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("status IN ('open', 'resolved')", name="ck_post_reports_status"),
        sa.ForeignKeyConstraint(["comment_id"], ["post_comments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["post_id"], ["posts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["reporter_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_post_reports_comment_id"), "post_reports", ["comment_id"], unique=False)
    op.create_index(op.f("ix_post_reports_post_id"), "post_reports", ["post_id"], unique=False)
    op.create_index(op.f("ix_post_reports_reporter_id"), "post_reports", ["reporter_id"], unique=False)
    op.create_index(op.f("ix_post_reports_status"), "post_reports", ["status"], unique=False)


def downgrade() -> None:
    """Удаляет данные публикаций и возвращает прежние типы уведомлений."""
    op.execute("""UPDATE accounts SET notification_unread_count = GREATEST(0,
        notification_unread_count - (SELECT count(*) FROM notifications
        WHERE notifications.user_id = accounts.id AND type::text = 'POST_ACTIVITY' AND NOT is_read))""")
    op.execute("DELETE FROM notifications WHERE type::text = 'POST_ACTIVITY'")
    op.drop_table("post_reports")
    op.drop_table("post_comment_likes")
    op.drop_table("post_views")
    op.drop_table("post_saves")
    op.drop_table("post_media")
    op.drop_table("post_likes")
    op.drop_table("post_comments")
    op.drop_table("posts")
    op.drop_table("post_follows")
    op.drop_table("post_ai_requests")
    op.drop_column("accounts", "following_seen_at")
    op.execute("ALTER TYPE notificationtype RENAME TO notificationtype_with_posts")
    op.execute("""CREATE TYPE notificationtype AS ENUM (
        'RESPONSE_UPDATED', 'RESPONSE_STATUS_CHANGED', 'CHAT_MESSAGE', 'QUESTION_ASKED',
        'QUESTION_ANSWERED', 'SUPPORT_REPLY', 'NEW_BLOG_POST', 'NEW_ORDER',
        'CONTACT_ACCESS', 'LABOR_RESPONSE')""")
    op.execute(
        "ALTER TABLE notifications ALTER COLUMN type TYPE notificationtype USING type::text::notificationtype"
    )
    op.execute("DROP TYPE notificationtype_with_posts")
