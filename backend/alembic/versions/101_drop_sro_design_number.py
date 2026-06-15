"""drop users.sro_design_number column

Revision ID: 101
Revises: 100
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "101"
down_revision: str | None = "100"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_column("users", "sro_design_number")


def downgrade() -> None:
    op.add_column("users", sa.Column("sro_design_number", sa.String(length=100), nullable=True))
