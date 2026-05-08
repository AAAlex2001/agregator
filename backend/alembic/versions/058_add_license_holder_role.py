"""LICENSE_HOLDER role and license fields on users

Revision ID: 058
Revises: 057
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


revision: str = "058"
down_revision: Union[str, None] = "057"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'LICENSE_HOLDER'")

    op.add_column("users", sa.Column("license_number", sa.String(length=100), nullable=True))
    op.add_column("users", sa.Column("license_file_url", sa.String(length=500), nullable=True))
    op.add_column("users", sa.Column("license_areas", JSONB(), nullable=True))
    op.add_column("users", sa.Column("license_rental_kind", sa.String(length=20), nullable=True))
    op.add_column("users", sa.Column("license_rental_percent", sa.Numeric(5, 2), nullable=True))
    op.add_column("users", sa.Column("license_rental_fixed_amount", sa.BigInteger(), nullable=True))

    op.create_check_constraint(
        "user_license_rental_kind_valid",
        "users",
        "license_rental_kind IS NULL OR license_rental_kind IN ('PERCENT', 'FIXED', 'NEGOTIABLE')",
    )


def downgrade() -> None:
    op.drop_constraint("user_license_rental_kind_valid", "users", type_="check")
    op.drop_column("users", "license_rental_fixed_amount")
    op.drop_column("users", "license_rental_percent")
    op.drop_column("users", "license_rental_kind")
    op.drop_column("users", "license_areas")
    op.drop_column("users", "license_file_url")
    op.drop_column("users", "license_number")
