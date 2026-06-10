"""companies base table + campaign_recipients.company_id

Revision ID: 096
Revises: 095
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "096"
down_revision: Union[str, None] = "095"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "companies",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("inn", sa.String(length=12), nullable=False),
        sa.Column("name", sa.String(length=500), nullable=False, server_default=""),
        sa.Column("full_name", sa.String(length=1000), nullable=False, server_default=""),
        sa.Column("kpp", sa.String(length=20), nullable=True),
        sa.Column("ogrn", sa.String(length=20), nullable=True),
        sa.Column("email", sa.String(length=320), nullable=True),
        sa.Column("region", sa.String(length=200), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("okved_code", sa.String(length=20), nullable=True),
        sa.Column("okved_name", sa.String(length=500), nullable=True),
        sa.Column("status", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("inn", name="uq_companies_inn"),
    )
    op.create_index("ix_companies_inn", "companies", ["inn"])
    op.create_index("ix_companies_email", "companies", ["email"])
    op.create_index("ix_companies_status", "companies", ["status"])

    op.add_column(
        "campaign_recipients",
        sa.Column("company_id", sa.Integer(), sa.ForeignKey("companies.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_campaign_recipients_company_id", "campaign_recipients", ["company_id"])


def downgrade() -> None:
    op.drop_index("ix_campaign_recipients_company_id", "campaign_recipients")
    op.drop_column("campaign_recipients", "company_id")
    op.drop_table("companies")
