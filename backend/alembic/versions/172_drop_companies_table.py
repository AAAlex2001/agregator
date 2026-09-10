"""Удаление базы компаний вместе с функционалом почтовой рассылки.

Revision ID: 172
Revises: 171
"""
from collections.abc import Sequence

from alembic import op

revision: str = "172"
down_revision: str | None = "171"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("DROP TABLE IF EXISTS companies CASCADE")


def downgrade() -> None:
    pass
