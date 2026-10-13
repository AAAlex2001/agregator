"""Индекс ограниченной очистки временных файлов публикаций.

Revision ID: 180
Revises: 179
"""

import sqlalchemy as sa

from alembic import op

revision = "180"
down_revision = "179"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Находит старые непривязанные файлы без просмотра всех загрузок."""
    op.create_index(
        "ix_post_media_expired",
        "post_media",
        ["created_at", "id"],
        postgresql_where=sa.text("post_id IS NULL"),
    )


def downgrade() -> None:
    """Удаляет только индекс очистки."""
    op.drop_index("ix_post_media_expired", table_name="post_media")
