"""add comment and technical_files to orders

Revision ID: 003
Revises: 002
Create Date: 2026-02-14 16:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "orders",
        sa.Column(
            "comment",
            sa.Text(),
            nullable=False,
            server_default="",
        ),
    )
    op.add_column(
        "orders",
        sa.Column(
            "technical_files",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'::json"),
        ),
    )


def downgrade() -> None:
    op.drop_column("orders", "technical_files")
    op.drop_column("orders", "comment")
