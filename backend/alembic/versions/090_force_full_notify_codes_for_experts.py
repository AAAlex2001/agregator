"""force notify_order_types to the full badge catalog for every expert

Revision ID: 090
Revises: 089
"""
import json
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from services.experts.badge_codes import ALL_BADGE_CODES


revision: str = "090"
down_revision: Union[str, None] = "089"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    payload = json.dumps(list(ALL_BADGE_CODES), ensure_ascii=False)
    op.execute(
        sa.text(
            "UPDATE users SET notify_order_types = CAST(:codes AS JSONB) "
            "WHERE role = 'EXPERT'"
        ).bindparams(codes=payload)
    )


def downgrade() -> None:
    pass
