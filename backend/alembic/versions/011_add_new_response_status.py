"""add new response status

Revision ID: 011
Revises: 010
Create Date: 2026-02-17 21:15:00.000000

"""
from typing import Sequence, Union

from alembic import op


revision: str = "011"
down_revision: Union[str, None] = "010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE responsestatus ADD VALUE IF NOT EXISTS 'NEW'")
    op.execute("UPDATE order_responses SET status = 'NEW' WHERE status = 'REVIEW'")


def downgrade() -> None:
    pass
