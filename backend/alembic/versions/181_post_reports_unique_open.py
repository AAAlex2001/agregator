"""Одна открытая жалоба пользователя на пост или комментарий.

Revision ID: 181
Revises: 180
"""

import sqlalchemy as sa

from alembic import op

revision = "181"
down_revision = "180"
branch_labels = None
depends_on = None

OPEN_ONLY = sa.text("status = 'open'")


def upgrade() -> None:
    """Повторные открытые жалобы закрываются, затем уникальность закрепляется индексами."""
    op.execute(
        """
        UPDATE post_reports AS duplicate
        SET status = 'resolved'
        FROM post_reports AS first
        WHERE duplicate.status = 'open'
          AND first.status = 'open'
          AND duplicate.reporter_id = first.reporter_id
          AND duplicate.post_id IS NOT DISTINCT FROM first.post_id
          AND duplicate.comment_id IS NOT DISTINCT FROM first.comment_id
          AND duplicate.id > first.id
        """
    )
    op.create_index(
        "ux_post_reports_open_post",
        "post_reports",
        ["reporter_id", "post_id"],
        unique=True,
        postgresql_where=OPEN_ONLY,
    )
    op.create_index(
        "ux_post_reports_open_comment",
        "post_reports",
        ["reporter_id", "comment_id"],
        unique=True,
        postgresql_where=OPEN_ONLY,
    )


def downgrade() -> None:
    """Удаляет только индексы уникальности."""
    op.drop_index("ux_post_reports_open_comment", table_name="post_reports")
    op.drop_index("ux_post_reports_open_post", table_name="post_reports")
