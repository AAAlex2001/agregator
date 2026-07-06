"""articles: отдельная превью-картинка для Telegram мини-аппа

Revision ID: 131
Revises: 130
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "131"
down_revision: str | None = "130"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "articles",
        sa.Column("tg_cover_image", sa.String(length=500), nullable=False, server_default=""),
    )


def downgrade() -> None:
    op.drop_column("articles", "tg_cover_image")
