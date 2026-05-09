"""Добавить created_at к отзывам лендинга для отображения даты на публичной странице.

Идемпотентна: ADD COLUMN IF NOT EXISTS, дефолт NOW() для существующих записей.

Revision ID: 065
Revises: 064
"""
from typing import Sequence, Union

from alembic import op


revision: str = "065"
down_revision: Union[str, None] = "064"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE landing_reviews "
        "ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()"
    )


def downgrade() -> None:
    op.execute("ALTER TABLE landing_reviews DROP COLUMN IF EXISTS created_at")
