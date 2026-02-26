"""remove new response status

Revision ID: 020
Revises: 019
Create Date: 2026-02-26 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "020"
down_revision: Union[str, Sequence[str], None] = "019"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("UPDATE order_responses SET status = 'REVIEW' WHERE status = 'NEW'")
    op.execute("ALTER TABLE order_responses ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TABLE order_responses ALTER COLUMN status TYPE text USING status::text")
    op.execute("DROP TYPE responsestatus")
    op.execute("CREATE TYPE responsestatus AS ENUM ('REVIEW', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')")
    op.execute("ALTER TABLE order_responses ALTER COLUMN status TYPE responsestatus USING status::responsestatus")
    op.execute("ALTER TABLE order_responses ALTER COLUMN status SET DEFAULT 'REVIEW'::responsestatus")


def downgrade() -> None:
    op.execute("ALTER TABLE order_responses ALTER COLUMN status DROP DEFAULT")
    op.execute("ALTER TABLE order_responses ALTER COLUMN status TYPE text USING status::text")
    op.execute("DROP TYPE responsestatus")
    op.execute("CREATE TYPE responsestatus AS ENUM ('NEW', 'REVIEW', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')")
    op.execute("ALTER TABLE order_responses ALTER COLUMN status TYPE responsestatus USING status::responsestatus")
    op.execute("ALTER TABLE order_responses ALTER COLUMN status SET DEFAULT 'REVIEW'::responsestatus")
