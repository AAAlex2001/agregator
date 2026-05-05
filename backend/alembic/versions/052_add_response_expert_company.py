"""add expert_inn and expert_company_data to order_responses

Revision ID: 052
Revises: 051
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "052"
down_revision: Union[str, None] = "051"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("order_responses", sa.Column("expert_inn", sa.String(length=12), nullable=True))
    op.add_column("order_responses", sa.Column("expert_company_data", sa.JSON(), nullable=True))
    op.create_index("ix_order_responses_expert_inn", "order_responses", ["expert_inn"])


def downgrade() -> None:
    op.drop_index("ix_order_responses_expert_inn", table_name="order_responses")
    op.drop_column("order_responses", "expert_company_data")
    op.drop_column("order_responses", "expert_inn")
