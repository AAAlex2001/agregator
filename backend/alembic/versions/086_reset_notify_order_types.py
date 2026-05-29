"""reset notify_order_types after switching from short types to full badge codes

Revision ID: 086
Revises: 085
"""
from typing import Sequence, Union

from alembic import op


revision: str = "086"
down_revision: Union[str, None] = "085"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("UPDATE users SET notify_order_types = NULL WHERE notify_order_types IS NOT NULL")


def downgrade() -> None:
    pass
