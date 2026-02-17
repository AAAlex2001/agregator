"""add user profile fields (first_name, last_name, rating, review_count)

Revision ID: 010
Revises: 009
Create Date: 2026-02-17 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "010"
down_revision: Union[str, None] = "009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("first_name", sa.String(100), nullable=True))
    op.add_column("users", sa.Column("last_name", sa.String(100), nullable=True))
    op.add_column("users", sa.Column("rating", sa.Numeric(2, 1), nullable=True))
    op.add_column(
        "users",
        sa.Column("review_count", sa.Integer(), nullable=False, server_default="0"),
    )


def downgrade() -> None:
    op.drop_column("users", "review_count")
    op.drop_column("users", "rating")
    op.drop_column("users", "last_name")
    op.drop_column("users", "first_name")
