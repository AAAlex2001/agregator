"""remove ARCHIVED from responsestatus enum

Revision ID: 022
Revises: 021
Create Date: 2026-02-26 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


revision: str = "022"
down_revision: Union[str, None] = "021"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

OLD_VALUES = ("REVIEW", "REJECTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "ARCHIVED")
NEW_VALUES = ("REVIEW", "REJECTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED")


def upgrade() -> None:
    # Move any existing ARCHIVED responses to COMPLETED before removing the enum value
    op.execute(
        "UPDATE order_responses SET status = 'COMPLETED' WHERE status = 'ARCHIVED'"
    )

    # Alter the enum type: rename old, create new, migrate column, drop old
    op.execute("ALTER TYPE responsestatus RENAME TO responsestatus_old")
    op.execute(
        "CREATE TYPE responsestatus AS ENUM(%s)"
        % ", ".join(f"'{v}'" for v in NEW_VALUES)
    )
    op.execute(
        "ALTER TABLE order_responses "
        "ALTER COLUMN status TYPE responsestatus USING status::text::responsestatus"
    )
    op.execute("DROP TYPE responsestatus_old")


def downgrade() -> None:
    op.execute("ALTER TYPE responsestatus RENAME TO responsestatus_old")
    op.execute(
        "CREATE TYPE responsestatus AS ENUM(%s)"
        % ", ".join(f"'{v}'" for v in OLD_VALUES)
    )
    op.execute(
        "ALTER TABLE order_responses "
        "ALTER COLUMN status TYPE responsestatus USING status::text::responsestatus"
    )
    op.execute("DROP TYPE responsestatus_old")
