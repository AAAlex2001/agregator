"""add company_card_url to users (PDF for license holder)

Revision ID: 060
Revises: 059
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "060"
down_revision: Union[str, None] = "059"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("company_card_url", sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "company_card_url")
