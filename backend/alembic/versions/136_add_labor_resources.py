"""add labor resource listings and labor chats

Revision ID: 136
Revises: 135
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "136"
down_revision: str | None = "135"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    listing_kind = postgresql.ENUM(
        "EXPERT_WANTED",
        "EXPERT_AVAILABLE",
        name="laborlistingkind",
        create_type=False,
    )
    employment_term = postgresql.ENUM(
        "PERMANENT",
        "FIXED",
        name="employmentterm",
        create_type=False,
    )
    employment_type = postgresql.ENUM(
        "PRIMARY",
        "PART_TIME",
        name="employmenttype",
        create_type=False,
    )
    job_status = postgresql.ENUM(
        "NONE",
        "EMPLOYED",
        name="currentjobstatus",
        create_type=False,
    )
    listing_kind.create(op.get_bind(), checkfirst=True)
    employment_term.create(op.get_bind(), checkfirst=True)
    employment_type.create(op.get_bind(), checkfirst=True)
    job_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "labor_listings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("public_id", sa.String(36), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("kind", listing_kind, nullable=False),
        sa.Column(
            "certificates",
            postgresql.JSONB(),
            server_default="[]",
            nullable=False,
        ),
        sa.Column("region", sa.String(300), nullable=False),
        sa.Column("employment_term", employment_term, nullable=False),
        sa.Column("fixed_term", sa.String(300), nullable=True),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("employment_type", employment_type, nullable=True),
        sa.Column("current_job_status", job_status, nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("public_id"),
    )
    for column in ("id", "public_id", "owner_id", "kind", "is_active"):
        op.create_index(
            f"ix_labor_listings_{column}",
            "labor_listings",
            [column],
        )

    op.alter_column("chats", "order_id", existing_type=sa.Integer(), nullable=True)
    op.add_column(
        "chats",
        sa.Column("labor_listing_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_chats_labor_listing_id",
        "chats",
        "labor_listings",
        ["labor_listing_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_index("ix_chats_labor_listing_id", "chats", ["labor_listing_id"])
    op.create_unique_constraint(
        "uq_chats_labor_customer_expert",
        "chats",
        ["labor_listing_id", "customer_id", "expert_id"],
    )


def downgrade() -> None:
    op.execute(sa.text("DELETE FROM chats WHERE labor_listing_id IS NOT NULL"))
    op.drop_constraint("uq_chats_labor_customer_expert", "chats", type_="unique")
    op.drop_index("ix_chats_labor_listing_id", table_name="chats")
    op.drop_constraint("fk_chats_labor_listing_id", "chats", type_="foreignkey")
    op.drop_column("chats", "labor_listing_id")
    op.alter_column("chats", "order_id", existing_type=sa.Integer(), nullable=False)
    op.drop_table("labor_listings")
    enum_names = (
        "currentjobstatus",
        "employmenttype",
        "employmentterm",
        "laborlistingkind",
    )
    for name in enum_names:
        sa.Enum(name=name).drop(op.get_bind(), checkfirst=True)
