"""подписки исполнителей на кадастр и судебную экспертизу; чистка ключа EXPERTISE

Revision ID: 151
Revises: 150
"""
from collections.abc import Sequence

from alembic import op

revision: str = "151"
down_revision: str | None = "150"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

ADD_DIRECTIONS = """
    UPDATE experts SET notify_order_types = (
        SELECT jsonb_agg(DISTINCT item)
        FROM jsonb_array_elements(
            notify_order_types || '["CADASTRAL", "FORENSIC"]'::jsonb
        ) AS item
    )
    WHERE notify_order_types IS NOT NULL
      AND NOT (notify_order_types @> '["CADASTRAL"]'::jsonb
               AND notify_order_types @> '["FORENSIC"]'::jsonb)
"""

DROP_EXPERTISE_KEY = """
    UPDATE experts SET notify_order_types = notify_order_types - 'EXPERTISE'
    WHERE notify_order_types @> '["EXPERTISE"]'::jsonb
"""


def upgrade() -> None:
    op.execute(ADD_DIRECTIONS)
    op.execute(DROP_EXPERTISE_KEY)


def downgrade() -> None:
    op.execute(
        "UPDATE experts SET notify_order_types = "
        "(notify_order_types - 'CADASTRAL') - 'FORENSIC' "
        "WHERE notify_order_types IS NOT NULL"
    )
