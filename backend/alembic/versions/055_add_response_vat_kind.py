"""add vat_kind to order_responses

Revision ID: 055
Revises: 054
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect
from sqlalchemy.dialects import postgresql


revision: str = "055"
down_revision: Union[str, None] = "054"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


VAT_KIND_VALUES = ("NONE", "VAT_5", "VAT_7", "VAT_22")


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    postgresql.ENUM(*VAT_KIND_VALUES, name="vatkind").create(bind, checkfirst=True)

    columns = {col["name"] for col in inspector.get_columns("order_responses")}
    if "vat_kind" not in columns:
        op.add_column(
            "order_responses",
            sa.Column(
                "vat_kind",
                postgresql.ENUM(*VAT_KIND_VALUES, name="vatkind", create_type=False),
                nullable=False,
                server_default="NONE",
            ),
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    columns = {col["name"] for col in inspector.get_columns("order_responses")}
    if "vat_kind" in columns:
        op.drop_column("order_responses", "vat_kind")

    postgresql.ENUM(name="vatkind").drop(bind, checkfirst=True)
