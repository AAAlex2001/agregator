"""add SUPPORT_REPLY value to notificationtype enum

Revision ID: 054
Revises: 053
"""
from typing import Sequence, Union

from alembic import op


revision: str = "054"
down_revision: Union[str, None] = "053"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE notificationtype ADD VALUE IF NOT EXISTS 'SUPPORT_REPLY'")


def downgrade() -> None:
    "Postgres не поддерживает удаление значения из enum без пересоздания типа."
    pass
