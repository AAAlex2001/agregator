"""users: expert base location + travel flag

Revision ID: 119
Revises: 118
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "119"
down_revision: str | None = "118"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("users", sa.Column("location_lat", sa.Float(), nullable=True))
    op.add_column("users", sa.Column("location_lng", sa.Float(), nullable=True))
    op.add_column("users", sa.Column("location_address", sa.String(length=500), nullable=True))
    op.add_column("users", sa.Column("location_city", sa.String(length=200), nullable=True))
    op.add_column(
        "users",
        sa.Column(
            "travels_to_other_regions",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "travels_to_other_regions")
    op.drop_column("users", "location_city")
    op.drop_column("users", "location_address")
    op.drop_column("users", "location_lng")
    op.drop_column("users", "location_lat")
