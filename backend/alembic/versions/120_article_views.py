"""article views

Revision ID: 120
Revises: 119
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "120"
down_revision: str | None = "119"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("articles", sa.Column("views_count", sa.Integer(), nullable=False, server_default="0"))

    op.create_table(
        "article_views",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("article_id", sa.Integer(), sa.ForeignKey("articles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("article_id", "user_id", name="uq_article_view_user"),
    )
    op.create_index("ix_article_views_article_id", "article_views", ["article_id"])


def downgrade() -> None:
    op.drop_index("ix_article_views_article_id", table_name="article_views")
    op.drop_table("article_views")
    op.drop_column("articles", "views_count")
