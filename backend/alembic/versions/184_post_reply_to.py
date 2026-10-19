"""Ответ на свой пост: новый пост выходит в Telegram ответом на прошлый.

Revision ID: 184
Revises: 183
"""

import sqlalchemy as sa

from alembic import op

revision = "184"
down_revision = "183"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Ссылка на пост, на который отвечает новый. Удалили исходный — ссылка обнуляется."""
    op.add_column(
        "posts",
        sa.Column(
            "reply_to_id",
            sa.Integer(),
            sa.ForeignKey("posts.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.create_index("ix_posts_reply_to_id", "posts", ["reply_to_id"])


def downgrade() -> None:
    """Убирает ссылку на исходный пост."""
    op.drop_index("ix_posts_reply_to_id", table_name="posts")
    op.drop_column("posts", "reply_to_id")
