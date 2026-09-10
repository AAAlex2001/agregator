"""Статус «в работе» и причина отклонения у вопросов РТН.

Revision ID: 171
Revises: 170
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "171"
down_revision: str | None = "170"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE rtn_question_status ADD VALUE IF NOT EXISTS 'IN_REVIEW' AFTER 'NEW'")
    op.add_column(
        "rtn_questions",
        sa.Column("dismiss_reason", sa.String(length=1000), nullable=False, server_default=""),
    )


def downgrade() -> None:
    op.drop_column("rtn_questions", "dismiss_reason")
