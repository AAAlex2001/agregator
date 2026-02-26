"""remove ARCHIVED from responsestatus enum

Revision ID: 022
Revises: 021
Create Date: 2026-02-26 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "022"
down_revision: Union[str, None] = "021"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

OLD_VALUES = ("REVIEW", "REJECTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "ARCHIVED")
NEW_VALUES = ("REVIEW", "REJECTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED")


def upgrade() -> None:
    conn = op.get_bind()

    # Clean up any leftover state from a previous failed run:
    # if responsestatus_old exists, the column may still reference it.
    has_old_type = conn.execute(
        sa.text(
            "SELECT EXISTS ("
            "  SELECT 1 FROM pg_type WHERE typname = 'responsestatus_old'"
            ")"
        )
    ).scalar()

    if has_old_type:
        # Previous run renamed but crashed before finishing.
        # The new responsestatus type may already exist — drop it if so.
        has_new_type = conn.execute(
            sa.text(
                "SELECT EXISTS ("
                "  SELECT 1 FROM pg_type "
                "  WHERE typname = 'responsestatus' AND typtype = 'e'"
                ")"
            )
        ).scalar()
        if has_new_type:
            # Column still references _old; update rows and re-cast
            op.execute(
                "UPDATE order_responses "
                "SET status = 'COMPLETED'::responsestatus_old "
                "WHERE status::text = 'ARCHIVED'"
            )
            op.execute(
                "ALTER TABLE order_responses "
                "ALTER COLUMN status TYPE responsestatus "
                "USING status::text::responsestatus"
            )
            op.execute("DROP TYPE responsestatus_old")
        else:
            # New type was never created — rename back and proceed below
            op.execute("ALTER TYPE responsestatus_old RENAME TO responsestatus")

    # Now check whether ARCHIVED exists in the (current) responsestatus enum
    has_archived = conn.execute(
        sa.text(
            "SELECT EXISTS ("
            "  SELECT 1 FROM pg_enum "
            "  JOIN pg_type ON pg_enum.enumtypid = pg_type.oid "
            "  WHERE pg_type.typname = 'responsestatus' "
            "    AND pg_enum.enumlabel = 'ARCHIVED'"
            ")"
        )
    ).scalar()

    if not has_archived:
        # ARCHIVED is not in the enum — nothing to do
        return

    # Rename old enum, create new one without ARCHIVED
    op.execute("ALTER TYPE responsestatus RENAME TO responsestatus_old")
    op.execute(
        "CREATE TYPE responsestatus AS ENUM(%s)"
        % ", ".join(f"'{v}'" for v in NEW_VALUES)
    )

    # Move any ARCHIVED rows to COMPLETED (using text cast to avoid enum mismatch)
    op.execute(
        "UPDATE order_responses "
        "SET status = 'COMPLETED'::responsestatus_old "
        "WHERE status::text = 'ARCHIVED'"
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
