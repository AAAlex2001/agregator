"""add company_data to users

Revision ID: 029
Revises: 028
"""

from alembic import op
import sqlalchemy as sa


revision = "029"
down_revision = "028"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("company_data", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "company_data")