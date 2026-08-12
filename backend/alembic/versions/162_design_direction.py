"""Направление «Проектирование промышленных и гражданских объектов»

Revision ID: 162
Revises: 161
"""
from collections.abc import Sequence

from alembic import op

revision: str = "162"
down_revision: str | None = "161"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE orderworktype ADD VALUE IF NOT EXISTS 'DESIGN'")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS expert_design_profiles (
            id SERIAL PRIMARY KEY,
            expert_id INTEGER NOT NULL UNIQUE REFERENCES experts(id) ON DELETE CASCADE,
            education TEXT NOT NULL DEFAULT '',
            specialties JSONB NOT NULL DEFAULT '[]',
            nok_passed BOOLEAN NOT NULL DEFAULT FALSE,
            nrs_number VARCHAR(200) NOT NULL DEFAULT '',
            sro_gip_declared BOOLEAN NOT NULL DEFAULT FALSE,
            qualification_courses TEXT NOT NULL DEFAULT '',
            rtn_areas JSONB NOT NULL DEFAULT '[]',
            education_documents JSONB NOT NULL DEFAULT '[]',
            nok_documents JSONB NOT NULL DEFAULT '[]',
            nrs_documents JSONB NOT NULL DEFAULT '[]',
            qualification_documents JSONB NOT NULL DEFAULT '[]',
            rtn_documents JSONB NOT NULL DEFAULT '[]',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_expert_design_profiles_expert_id "
        "ON expert_design_profiles (expert_id)"
    )
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS license_holder_design_profiles (
            id SERIAL PRIMARY KEY,
            license_holder_id INTEGER NOT NULL UNIQUE REFERENCES license_holders(id) ON DELETE CASCADE,
            sro_name VARCHAR(500) NOT NULL DEFAULT '',
            sro_registry_number VARCHAR(200) NOT NULL DEFAULT '',
            hazardous_objects_right BOOLEAN NOT NULL DEFAULT FALSE,
            nuclear_objects_right BOOLEAN NOT NULL DEFAULT FALSE,
            liability_level INTEGER NOT NULL DEFAULT 1,
            pricing_kind VARCHAR(20) NOT NULL DEFAULT 'PERCENT',
            pricing_percent FLOAT,
            pricing_fixed_amount INTEGER,
            documents JSONB NOT NULL DEFAULT '[]',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_license_holder_design_profiles_license_holder_id "
        "ON license_holder_design_profiles (license_holder_id)"
    )

    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types || jsonb_build_array('DESIGN') "
        "WHERE notify_order_types IS NOT NULL "
        "AND NOT notify_order_types @> '[\"DESIGN\"]'::jsonb"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types - 'DESIGN' "
        "WHERE notify_order_types IS NOT NULL"
    )
    op.execute("DROP TABLE IF EXISTS license_holder_design_profiles")
    op.execute("DROP TABLE IF EXISTS expert_design_profiles")
