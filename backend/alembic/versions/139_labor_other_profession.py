"""add other_profession to labor listings

Revision ID: 139
Revises: 138
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "139"
down_revision: str | None = "138"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "labor_listings",
        sa.Column("other_profession", sa.String(length=500), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("labor_listings", "other_profession")
