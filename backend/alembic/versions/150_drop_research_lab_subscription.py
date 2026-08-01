"""подписка RESEARCH_LAB заменяется на RESEARCH и LABORATORY

Revision ID: 150
Revises: 149
"""
from collections.abc import Sequence

from alembic import op

revision: str = "150"
down_revision: str | None = "149"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SPLIT_RESEARCH_LAB = """
    UPDATE experts SET notify_order_types = (
        SELECT jsonb_agg(DISTINCT item)
        FROM jsonb_array_elements(
            (notify_order_types - 'RESEARCH_LAB') || '["RESEARCH", "LABORATORY"]'::jsonb
        ) AS item
    )
    WHERE notify_order_types @> '["RESEARCH_LAB"]'::jsonb
"""


def upgrade() -> None:
    op.execute(SPLIT_RESEARCH_LAB)


def downgrade() -> None:
    "Обратной замены нет: RESEARCH и LABORATORY — самостоятельные направления."
