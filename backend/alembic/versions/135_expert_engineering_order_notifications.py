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
            "UPDATE users "
            "SET notify_order_types = ("
            "SELECT jsonb_agg(token ORDER BY first_position) FROM ("
            "SELECT token, MIN(position) AS first_position FROM ("
            "SELECT token, position FROM jsonb_array_elements_text("
            "COALESCE(users.notify_order_types, CAST('[]' AS JSONB))"
            ") WITH ORDINALITY AS existing(token, position) "
            "UNION ALL "
            "SELECT token, jsonb_array_length("
            "COALESCE(users.notify_order_types, CAST('[]' AS JSONB))"
            ") + position FROM jsonb_array_elements_text("
            "CAST(:types AS JSONB)"
            ") WITH ORDINALITY AS added(token, position)"
            ") AS combined GROUP BY token"
            ") AS deduplicated) "
            "WHERE role = 'EXPERT'"
        ).bindparams(types=payload)
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            "UPDATE users "
            "SET notify_order_types = NULLIF("
            "notify_order_types - 'DESIGN_SURVEY' - 'INSPECTION_TESTING' "
            "- 'RESEARCH_LAB' - 'OTHER', CAST('[]' AS JSONB)) "
            "WHERE role = 'EXPERT' AND notify_order_types IS NOT NULL"
        )
    )
