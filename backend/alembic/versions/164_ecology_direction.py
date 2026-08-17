"""Направление «Экологическое сопровождение предприятий»: анкета эколога и поля заявки

Revision ID: 164
Revises: 163
"""
from collections.abc import Sequence

from alembic import op

revision: str = "164"
down_revision: str | None = "163"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE orderworktype ADD VALUE IF NOT EXISTS 'ECOLOGY'")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS expert_ecology_profiles (
            id SERIAL PRIMARY KEY,
            expert_id INTEGER NOT NULL UNIQUE REFERENCES experts(id) ON DELETE CASCADE,
            work_types JSONB NOT NULL DEFAULT '[]',
            practical_skills TEXT NOT NULL DEFAULT '',
            documents JSONB NOT NULL DEFAULT '[]',
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_expert_ecology_profiles_expert_id "
        "ON expert_ecology_profiles (expert_id)"
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS order_ecology_details (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
            work_types JSONB NOT NULL DEFAULT '[]',
            applicant_full_name VARCHAR(300) NOT NULL DEFAULT '',
            applicant_position VARCHAR(200) NOT NULL DEFAULT '',
            applicant_organization VARCHAR(500) NOT NULL DEFAULT '',
            applicant_inn VARCHAR(12) NOT NULL DEFAULT '',
            applicant_phone VARCHAR(30) NOT NULL DEFAULT '',
            applicant_email VARCHAR(320) NOT NULL DEFAULT ''
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_order_ecology_details_order_id "
        "ON order_ecology_details (order_id)"
    )

    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types || jsonb_build_array('ECOLOGY') "
        "WHERE notify_order_types IS NOT NULL "
        "AND NOT notify_order_types @> '[\"ECOLOGY\"]'::jsonb"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types - 'ECOLOGY' "
        "WHERE notify_order_types IS NOT NULL"
    )
    op.execute("DROP TABLE IF EXISTS order_ecology_details")
    op.execute("DROP TABLE IF EXISTS expert_ecology_profiles")
