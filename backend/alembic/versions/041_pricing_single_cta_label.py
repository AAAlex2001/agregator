"""rename SINGLE plan cta_label to 'Откликнуться разово'

Revision ID: 041
Revises: 040
"""
from typing import Sequence, Union

from alembic import op


revision: str = "041"
down_revision: Union[str, None] = "040"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "UPDATE pricing_plans "
        "SET cta_label = 'Откликнуться разово' "
        "WHERE kind = 'SINGLE' AND cta_label = 'Откликнуться за 100 ₽'"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE pricing_plans "
        "SET cta_label = 'Откликнуться за 100 ₽' "
        "WHERE kind = 'SINGLE' AND cta_label = 'Откликнуться разово'"
    )
