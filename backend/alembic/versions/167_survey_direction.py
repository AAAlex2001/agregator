"""Направление «Инженерные изыскания»: анкеты изыскателя и члена СРО, поля заявки

Revision ID: 167
Revises: 166
"""
from collections.abc import Sequence

from alembic import op

revision: str = "167"
down_revision: str | None = "166"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE orderworktype ADD VALUE IF NOT EXISTS 'SURVEY'")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS expert_survey_profiles (
            id SERIAL PRIMARY KEY,
            expert_id INTEGER NOT NULL UNIQUE REFERENCES experts(id) ON DELETE CASCADE,
            education TEXT NOT NULL DEFAULT '',
            kinds JSONB NOT NULL DEFAULT '[]',
            kinds_other TEXT NOT NULL DEFAULT '',
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
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_expert_survey_profiles_expert_id "
        "ON expert_survey_profiles (expert_id)"
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS license_holder_survey_profiles (
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
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_license_holder_survey_profiles_license_holder_id "
        "ON license_holder_survey_profiles (license_holder_id)"
    )

    op.execute(
        "ALTER TABLE license_holders ADD COLUMN IF NOT EXISTS sro_survey_file_url VARCHAR(500)"
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS order_survey_details (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
            kinds JSONB NOT NULL DEFAULT '[]',
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
        "CREATE INDEX IF NOT EXISTS ix_order_survey_details_order_id "
        "ON order_survey_details (order_id)"
    )

    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types || jsonb_build_array('SURVEY') "
        "WHERE notify_order_types IS NOT NULL "
        "AND NOT notify_order_types @> '[\"SURVEY\"]'::jsonb"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE experts SET notify_order_types = notify_order_types - 'SURVEY' "
        "WHERE notify_order_types IS NOT NULL"
    )
    op.execute("DROP TABLE IF EXISTS order_survey_details")
    op.execute("ALTER TABLE license_holders DROP COLUMN IF EXISTS sro_survey_file_url")
    op.execute("DROP TABLE IF EXISTS license_holder_survey_profiles")
    op.execute("DROP TABLE IF EXISTS expert_survey_profiles")
