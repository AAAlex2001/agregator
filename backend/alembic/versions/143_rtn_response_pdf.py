"""add Rostekhnadzor response PDF

Revision ID: 143
Revises: 142
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "143"
down_revision: str | None = "142"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "rtn_clarifications",
        sa.Column("response_pdf_url", sa.String(500), nullable=False, server_default=""),
    )


def downgrade() -> None:
    op.drop_column("rtn_clarifications", "response_pdf_url")
