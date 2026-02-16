"""add in progress response status

Revision ID: 009
Revises: 008
Create Date: 2026-02-16 18:30:00.000000

"""
from typing import Sequence, Union

from alembic import op


revision: str = "009"
down_revision: Union[str, None] = "008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE responsestatus ADD VALUE IF NOT EXISTS 'IN_PROGRESS'")


def downgrade() -> None:
    pass
