"""fix order response deadlines stored as UTC instead of Moscow time

Revision ID: 133
Revises: 132
"""
from collections.abc import Sequence

from alembic import op

revision: str = "133"
down_revision: str | None = "132"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        "UPDATE orders "
        "SET responses_deadline = responses_deadline - INTERVAL '3 hours' "
        "WHERE responses_deadline IS NOT NULL"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE orders "
        "SET responses_deadline = responses_deadline + INTERVAL '3 hours' "
        "WHERE responses_deadline IS NOT NULL"
    )
