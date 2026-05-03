"""add chats.is_blocked

Revision ID: 045
Revises: 044
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "045"
down_revision: Union[str, None] = "044"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "chats",
        sa.Column(
            "is_blocked",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )


def downgrade() -> None:
    op.drop_column("chats", "is_blocked")
