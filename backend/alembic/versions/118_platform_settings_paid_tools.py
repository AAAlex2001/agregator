"""platform_settings: separate paid toggle for expert tools (lining / hazard)

Revision ID: 118
Revises: 117
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "118"
down_revision: str | None = "117"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "platform_settings",
        sa.Column(
            "paid_tools_enabled",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )


def downgrade() -> None:
    op.drop_column("platform_settings", "paid_tools_enabled")
