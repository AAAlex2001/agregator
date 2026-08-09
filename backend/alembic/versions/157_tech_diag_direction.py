"""Направление «Техническое освидетельствование и диагностирование»

Revision ID: 157
Revises: 156
"""
from collections.abc import Sequence

from alembic import op

revision: str = "157"
down_revision: str | None = "156"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE orderworktype ADD VALUE IF NOT EXISTS 'TECH_DIAG'")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS expert_tech_diag_profiles (
            id SERIAL PRIMARY KEY,
            expert_id INTEGER NOT NULL UNIQUE REFERENCES experts(id) ON DELETE CASCADE,
            qualification_certificates TEXT NOT NULL DEFAULT '',
            documents JSONB NOT NULL DEFAULT '[]',
            methods JSONB NOT NULL DEFAULT '[]',
            control_objects JSONB NOT NULL DEFAULT '[]',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_expert_tech_diag_profiles_expert_id "
        "ON expert_tech_diag_profiles (expert_id)"
    )
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS license_holder_tech_diag_profiles (
            id SERIAL PRIMARY KEY,
            license_holder_id INTEGER NOT NULL UNIQUE REFERENCES license_holders(id) ON DELETE CASCADE,
            methods JSONB NOT NULL DEFAULT '[]',
            organization_city VARCHAR(200) NOT NULL DEFAULT '',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_license_holder_tech_diag_profiles_license_holder_id "
        "ON license_holder_tech_diag_profiles (license_holder_id)"
    )
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS order_tech_diag_details (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
            purpose TEXT NOT NULL DEFAULT '',
            object_city VARCHAR(200) NOT NULL DEFAULT '',
            duration VARCHAR(200) NOT NULL DEFAULT ''
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_order_tech_diag_details_order_id "
        "ON order_tech_diag_details (order_id)"
    )

    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types || jsonb_build_array('TECH_DIAG') "
        "WHERE notify_order_types IS NOT NULL "
        "AND NOT notify_order_types @> '[\"TECH_DIAG\"]'::jsonb"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types - 'TECH_DIAG' "
        "WHERE notify_order_types IS NOT NULL"
    )
    op.execute("DROP TABLE IF EXISTS order_tech_diag_details")
    op.execute("DROP TABLE IF EXISTS license_holder_tech_diag_profiles")
    op.execute("DROP TABLE IF EXISTS expert_tech_diag_profiles")
