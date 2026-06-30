"""remove hazard factor group R9

Revision ID: 122
Revises: 121
"""
from collections.abc import Sequence

from alembic import op

revision: str = "122"
down_revision: str | None = "121"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("DELETE FROM hazard_factors WHERE group_code = 'R9'")


def downgrade() -> None:
    pass
