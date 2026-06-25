"""article reactions and comments

Revision ID: 110
Revises: 109
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "110"
down_revision: str | None = "109"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("articles", sa.Column("likes_count", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("articles", sa.Column("dislikes_count", sa.Integer(), nullable=False, server_default="0"))

    reaction_value = postgresql.ENUM("LIKE", "DISLIKE", name="reactionvalue")
    reaction_value.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "article_reactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("article_id", sa.Integer(), sa.ForeignKey("articles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("value", postgresql.ENUM("LIKE", "DISLIKE", name="reactionvalue", create_type=False), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("article_id", "user_id", name="uq_article_reaction_user"),
    )
    op.create_index("ix_article_reactions_article_id", "article_reactions", ["article_id"])
    op.create_index("ix_article_reactions_user_id", "article_reactions", ["user_id"])

    op.create_table(
        "article_comments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("article_id", sa.Integer(), sa.ForeignKey("articles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("article_comments.id", ondelete="CASCADE"), nullable=True),
        sa.Column("text", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_article_comments_article_id", "article_comments", ["article_id"])
    op.create_index("ix_article_comments_user_id", "article_comments", ["user_id"])
    op.create_index("ix_article_comments_parent_id", "article_comments", ["parent_id"])


def downgrade() -> None:
    op.drop_table("article_comments")
    op.drop_table("article_reactions")
    postgresql.ENUM(name="reactionvalue").drop(op.get_bind(), checkfirst=True)
    op.drop_column("articles", "dislikes_count")
    op.drop_column("articles", "likes_count")
