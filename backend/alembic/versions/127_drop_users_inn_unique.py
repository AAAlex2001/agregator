"""drop unique constraint on users (inn, role)

Revision ID: 127
Revises: 126
"""
from typing import Sequence, Union

from alembic import op


revision: str = "127"
down_revision: Union[str, None] = "126"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint("uq_users_inn_role", "users", type_="unique")


def downgrade() -> None:
    op.create_unique_constraint("uq_users_inn_role", "users", ["inn", "role"])
