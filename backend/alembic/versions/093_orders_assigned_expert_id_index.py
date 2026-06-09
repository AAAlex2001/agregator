"""ensure index on orders.assigned_expert_id

Revision ID: 093
Revises: 092

Идемпотентна: CREATE INDEX IF NOT EXISTS / DROP INDEX IF EXISTS,
индекс уже мог быть создан миграцией 005 на свежих БД.
"""
from typing import Sequence, Union

from alembic import op


revision: str = "093"
down_revision: Union[str, None] = "092"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_orders_assigned_expert_id "
        "ON orders (assigned_expert_id)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_orders_assigned_expert_id")
