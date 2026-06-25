"""normalize article tags into a many-to-many relation

Revision ID: 109
Revises: 108
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "109"
down_revision: str | None = "108"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "article_tags",
        sa.Column("article_id", sa.Integer(), sa.ForeignKey("articles.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("tag_id", sa.Integer(), sa.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
    )
    op.drop_column("articles", "tags")
    # Чистый старт: теги пересоздаются и привязываются к статьям вручную.
    op.execute("DELETE FROM tags")


def downgrade() -> None:
    op.add_column(
        "articles",
        sa.Column("tags", postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")),
    )
    op.drop_table("article_tags")
