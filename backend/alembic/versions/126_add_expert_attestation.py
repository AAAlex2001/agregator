"""add expert certificates + map display prefs

Revision ID: 126
Revises: 125
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "126"
down_revision: Union[str, None] = "125"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("expert_certificates", postgresql.JSONB(), nullable=True))
    op.add_column(
        "users",
        sa.Column(
            "expert_show_on_map",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )
    op.add_column("users", sa.Column("expert_map_fields", postgresql.JSONB(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "expert_map_fields")
    op.drop_column("users", "expert_show_on_map")
    op.drop_column("users", "expert_certificates")
