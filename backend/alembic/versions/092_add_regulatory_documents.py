"""add 6 regulatory document columns to users: mining license, SRO design, lab accreditation

Revision ID: 092
Revises: 091
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "092"
down_revision: Union[str, None] = "091"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


COLUMNS = [
    ("mining_license_number", sa.String(length=100)),
    ("mining_license_file_url", sa.String(length=500)),
    ("sro_design_number", sa.String(length=100)),
    ("sro_design_file_url", sa.String(length=500)),
    ("lab_accreditation_number", sa.String(length=100)),
    ("lab_accreditation_file_url", sa.String(length=500)),
]


def upgrade() -> None:
    for name, type_ in COLUMNS:
        op.add_column("users", sa.Column(name, type_, nullable=True))


def downgrade() -> None:
    for name, _ in reversed(COLUMNS):
        op.drop_column("users", name)
