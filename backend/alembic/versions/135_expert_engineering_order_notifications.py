"""enable engineering order notifications for existing experts

Revision ID: 135
Revises: 134
"""
import json
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "135"
down_revision: str | None = "134"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

ENGINEERING_ORDER_NOTIFICATION_TYPES: tuple[str, ...] = (
    "DESIGN_SURVEY",
    "INSPECTION_TESTING",
    "RESEARCH_LAB",
    "OTHER",
)


def upgrade() -> None:
    payload = json.dumps(
        list(ENGINEERING_ORDER_NOTIFICATION_TYPES),
        ensure_ascii=False,
    )
    op.execute(
        sa.text(
            "UPDATE users AS target "
            "SET notify_order_types = ("
            "SELECT jsonb_agg(token ORDER BY first_position) FROM ("
            "SELECT token, MIN(position) AS first_position "
            "FROM jsonb_array_elements_text("
            "(CASE WHEN jsonb_typeof(target.notify_order_types) = 'array' "
            "THEN target.notify_order_types ELSE CAST('[]' AS JSONB) END) "
            "|| CAST(:types AS JSONB)"
            ") WITH ORDINALITY AS combined(token, position) "
            "GROUP BY token"
            ") AS deduplicated) "
            "WHERE target.role = 'EXPERT'"
        ).bindparams(types=payload)
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            "UPDATE users AS target "
            "SET notify_order_types = CASE "
            "WHEN jsonb_typeof(target.notify_order_types) = 'array' THEN NULLIF("
            "target.notify_order_types - 'DESIGN_SURVEY' - 'INSPECTION_TESTING' "
            "- 'RESEARCH_LAB' - 'OTHER', CAST('[]' AS JSONB)) "
            "ELSE target.notify_order_types END "
            "WHERE target.role = 'EXPERT'"
        )
    )
