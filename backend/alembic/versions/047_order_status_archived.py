"""drop OrderStatus.COMPLETED, ensure ARCHIVED present

Revision ID: 047
Revises: 046
"""
from typing import Sequence, Union

from alembic import op


revision: str = "047"
down_revision: Union[str, None] = "046"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute(
            "ALTER TYPE orderstatus ADD VALUE IF NOT EXISTS 'ARCHIVED' AFTER 'ACTIVE'"
        )

    op.execute(
        """
        UPDATE orders
        SET status = 'ARCHIVED'
        WHERE status = 'COMPLETED'
        """
    )

    op.execute("ALTER TYPE orderstatus RENAME TO orderstatus_old")
    op.execute("CREATE TYPE orderstatus AS ENUM ('ACTIVE', 'ARCHIVED')")
    op.execute(
        "ALTER TABLE orders "
        "ALTER COLUMN status DROP DEFAULT, "
        "ALTER COLUMN status TYPE orderstatus USING status::text::orderstatus, "
        "ALTER COLUMN status SET DEFAULT 'ACTIVE'"
    )
    op.execute("DROP TYPE orderstatus_old")


def downgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute(
            "ALTER TYPE orderstatus ADD VALUE IF NOT EXISTS 'COMPLETED' AFTER 'ACTIVE'"
        )
