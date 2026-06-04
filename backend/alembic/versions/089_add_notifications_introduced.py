"""add notifications_introduced flag for one-time onboarding modal

Revision ID: 089
Revises: 088
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "089"
down_revision: Union[str, None] = "088"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "notifications_introduced",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "notifications_introduced")
