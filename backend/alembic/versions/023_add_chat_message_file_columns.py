"""add chat file columns and responses deadline

Revision ID: 023
Revises: 022
Create Date: 2026-03-11
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "023"
down_revision: Union[str, None] = "022"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("chat_messages", sa.Column("file_url", sa.String(1000), nullable=True))
    op.add_column("chat_messages", sa.Column("file_name", sa.String(500), nullable=True))
    op.add_column(
        "orders",
        sa.Column("responses_deadline", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("orders", "responses_deadline")
    op.drop_column("chat_messages", "file_name")
    op.drop_column("chat_messages", "file_url")
