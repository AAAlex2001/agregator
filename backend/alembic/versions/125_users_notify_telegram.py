"""users: telegram notifications opt-in flag

Revision ID: 125
Revises: 124
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "125"
down_revision: str | None = "124"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "notify_telegram_enabled",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "notify_telegram_enabled")
