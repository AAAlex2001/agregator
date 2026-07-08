"""anonymous article interactions

Revision ID: 132
Revises: 131
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "132"
down_revision: str | None = "131"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("article_reactions", sa.Column("visitor_key", sa.String(length=100), nullable=True))
    op.add_column("article_views", sa.Column("visitor_key", sa.String(length=100), nullable=True))
    op.add_column("article_comments", sa.Column("visitor_key", sa.String(length=100), nullable=True))

    op.execute("UPDATE article_reactions SET visitor_key = 'user:' || user_id::text WHERE visitor_key IS NULL")
    op.execute("UPDATE article_views SET visitor_key = 'user:' || user_id::text WHERE visitor_key IS NULL")
    op.execute("UPDATE article_comments SET visitor_key = 'user:' || user_id::text WHERE visitor_key IS NULL")

    op.alter_column("article_reactions", "user_id", nullable=True)
    op.alter_column("article_views", "user_id", nullable=True)
    op.alter_column("article_comments", "user_id", nullable=True)
    op.alter_column("article_reactions", "visitor_key", nullable=False)
    op.alter_column("article_views", "visitor_key", nullable=False)
    op.alter_column("article_comments", "visitor_key", nullable=False)

    op.drop_constraint("uq_article_reaction_user", "article_reactions", type_="unique")
    op.drop_constraint("uq_article_view_user", "article_views", type_="unique")

    op.create_index("ix_article_reactions_visitor_key", "article_reactions", ["visitor_key"])
    op.create_index("ix_article_views_visitor_key", "article_views", ["visitor_key"])
    op.create_index("ix_article_comments_visitor_key", "article_comments", ["visitor_key"])
    op.create_index("uq_article_reaction_identity", "article_reactions", ["article_id", "visitor_key"], unique=True)
    op.create_index("ix_article_views_identity_created", "article_views", ["article_id", "visitor_key", "created_at"])


def downgrade() -> None:
    op.drop_index("ix_article_views_identity_created", table_name="article_views")
    op.drop_index("uq_article_reaction_identity", table_name="article_reactions")
    op.drop_index("ix_article_comments_visitor_key", table_name="article_comments")
    op.drop_index("ix_article_views_visitor_key", table_name="article_views")
    op.drop_index("ix_article_reactions_visitor_key", table_name="article_reactions")

    op.execute("DELETE FROM article_comments WHERE user_id IS NULL")
    op.execute("DELETE FROM article_views WHERE user_id IS NULL")
    op.execute("DELETE FROM article_reactions WHERE user_id IS NULL")

    op.alter_column("article_comments", "user_id", nullable=False)
    op.alter_column("article_views", "user_id", nullable=False)
    op.alter_column("article_reactions", "user_id", nullable=False)

    op.create_unique_constraint("uq_article_view_user", "article_views", ["article_id", "user_id"])
    op.create_unique_constraint("uq_article_reaction_user", "article_reactions", ["article_id", "user_id"])

    op.drop_column("article_comments", "visitor_key")
    op.drop_column("article_views", "visitor_key")
    op.drop_column("article_reactions", "visitor_key")
