"""add expert attestation fields (areas, objects, categories, map fields)

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
    op.add_column("users", sa.Column("expert_areas", postgresql.JSONB(), nullable=True))
    op.add_column("users", sa.Column("expert_objects", postgresql.JSONB(), nullable=True))
    op.add_column("users", sa.Column("expert_categories", postgresql.JSONB(), nullable=True))
    op.add_column("users", sa.Column("expert_map_fields", postgresql.JSONB(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "expert_map_fields")
    op.drop_column("users", "expert_categories")
    op.drop_column("users", "expert_objects")
    op.drop_column("users", "expert_areas")
