"""add order expert and license requirements

Revision ID: 084
Revises: 083
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "084"
down_revision: Union[str, None] = "083"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "orders",
        sa.Column(
            "requires_expert",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )
    op.add_column(
        "orders",
        sa.Column(
            "requires_license",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )


def downgrade() -> None:
    op.drop_column("orders", "requires_license")
    op.drop_column("orders", "requires_expert")
