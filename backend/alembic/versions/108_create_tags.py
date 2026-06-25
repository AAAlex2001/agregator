"""create tags catalog

Revision ID: 108
Revises: 107
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "108"
down_revision: str | None = "107"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "tags",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_tags_name", "tags", ["name"], unique=True)
    # Заполняем каталог уже существующими тегами статей.
    op.execute(
        "INSERT INTO tags (name) "
        "SELECT DISTINCT trim(value) FROM articles, jsonb_array_elements_text(articles.tags) AS value "
        "WHERE trim(value) <> '' ON CONFLICT (name) DO NOTHING"
    )


def downgrade() -> None:
    op.drop_index("ix_tags_name", table_name="tags")
    op.drop_table("tags")
