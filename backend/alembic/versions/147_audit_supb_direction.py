"""направление «Аудит СУПБ»: анкета исполнителя и поля заказчика

Revision ID: 147
Revises: 146
"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "147"
down_revision: str | None = "146"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("ALTER TYPE orderworktype ADD VALUE IF NOT EXISTS 'AUDIT_SUPB'")
    op.execute("CREATE TYPE auditparticipantkind AS ENUM ('AUDITOR', 'INSPECTION_BODY')")

    op.add_column("customers", sa.Column("position", sa.String(200), nullable=False, server_default=""))
    op.add_column("customers", sa.Column("opo_license_number", sa.String(100), nullable=True))

    op.create_table(
        "expert_audit_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("expert_id", sa.Integer(), nullable=False),
        sa.Column(
            "participant_kind",
            postgresql.ENUM("AUDITOR", "INSPECTION_BODY", name="auditparticipantkind", create_type=False),
            nullable=False,
            server_default="AUDITOR",
        ),
        sa.Column("industrial_safety_areas", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("expert_attestation_areas", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("audit_qualifications", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("full_name", sa.String(500), nullable=False, server_default=""),
        sa.Column("short_name", sa.String(300), nullable=False, server_default=""),
        sa.Column("certificate_number", sa.String(100), nullable=False, server_default=""),
        sa.Column("accreditation_areas", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("documents", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["expert_id"], ["experts.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("expert_id", name="uq_expert_audit_profiles_expert_id"),
    )
    op.create_index("ix_expert_audit_profiles_expert_id", "expert_audit_profiles", ["expert_id"])

    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types || jsonb_build_array('AUDIT_SUPB') "
        "WHERE notify_order_types IS NOT NULL "
        "AND NOT notify_order_types @> '[\"AUDIT_SUPB\"]'::jsonb"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types - 'AUDIT_SUPB' "
        "WHERE notify_order_types IS NOT NULL"
    )
    op.drop_table("expert_audit_profiles")
    op.drop_column("customers", "opo_license_number")
    op.drop_column("customers", "position")
    op.execute("DROP TYPE auditparticipantkind")
