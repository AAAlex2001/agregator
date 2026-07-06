"""orders: удаление visible_expert_ids (фича выбора видимости заказа снята)

Revision ID: 130
Revises: 129
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "130"
down_revision: str | None = "129"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_column("orders", "visible_expert_ids")


def downgrade() -> None:
    op.add_column("orders", sa.Column("visible_expert_ids", postgresql.JSONB(), nullable=True))
