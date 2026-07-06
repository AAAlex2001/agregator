"""orders: список экспертов, которым виден заказ (null = виден всем)

Revision ID: 128
Revises: 127
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "128"
down_revision: str | None = "127"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("visible_expert_ids", postgresql.JSONB(), nullable=True))


def downgrade() -> None:
    op.drop_column("orders", "visible_expert_ids")
