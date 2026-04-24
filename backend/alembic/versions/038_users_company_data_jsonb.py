"""convert users.company_data from JSON to JSONB

Revision ID: 038
Revises: 037

Причина: JSON не поддерживает equality/ordering, из-за чего любые SELECT DISTINCT
или GROUP BY по users.* падают с ошибкой "could not identify an equality operator for type json".
JSONB решает проблему, плюс выигрыш в скорости поиска.
"""
from typing import Sequence, Union

from alembic import op


revision: str = "038"
down_revision: Union[str, None] = "037"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE users ALTER COLUMN company_data TYPE jsonb USING company_data::jsonb"
    )


def downgrade() -> None:
    op.execute(
        "ALTER TABLE users ALTER COLUMN company_data TYPE json USING company_data::json"
    )
