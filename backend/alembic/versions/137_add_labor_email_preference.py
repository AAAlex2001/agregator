"""add labor listing email preference

Revision ID: 137
Revises: 136
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "137"
down_revision: str | None = "136"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "email_on_labor_listing",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )
    op.execute(
        sa.text(
            "UPDATE users "
            "SET email_on_labor_listing = TRUE"
        )
    )


def downgrade() -> None:
    op.drop_column("users", "email_on_labor_listing")
