"""add PURPLE to BadgeVariant enum

Revision ID: 024
Revises: 023
Create Date: 2026-03-16
"""

from typing import Union

from alembic import op


revision: str = "024"
down_revision: Union[str, None] = "023"
branch_labels: Union[str, None] = None
depends_on: Union[str, None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE badgevariant ADD VALUE IF NOT EXISTS 'PURPLE'")


def downgrade() -> None:
    pass
