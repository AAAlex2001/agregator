"""Направление статьи: новости привязываются к направлению платформы.

Revision ID: 177
Revises: 176
"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision = "177"
down_revision = "176"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Добавляет articles.direction того же типа, что и направление заявки."""
    op.add_column(
        "articles",
        sa.Column("direction", postgresql.ENUM(name="orderworktype", create_type=False), nullable=True),
    )
    op.create_index("ix_articles_direction", "articles", ["direction"])


def downgrade() -> None:
    """Убирает направление статьи."""
    op.drop_index("ix_articles_direction", table_name="articles")
    op.drop_column("articles", "direction")
