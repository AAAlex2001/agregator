"""link chat to contact access deal

Revision ID: 140
Revises: 139
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "140"
down_revision: str | None = "139"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "chats",
        sa.Column("contact_deal_id", sa.Integer(), nullable=True),
    )
    op.create_index(
        "ix_chats_contact_deal_id", "chats", ["contact_deal_id"]
    )
    op.create_unique_constraint(
        "uq_chats_contact_deal", "chats", ["contact_deal_id"]
    )
    op.create_foreign_key(
        "fk_chats_contact_deal_id",
        "chats",
        "contact_access_deals",
        ["contact_deal_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint("fk_chats_contact_deal_id", "chats", type_="foreignkey")
    op.drop_constraint("uq_chats_contact_deal", "chats", type_="unique")
    op.drop_index("ix_chats_contact_deal_id", table_name="chats")
    op.drop_column("chats", "contact_deal_id")
