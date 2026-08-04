"""Кадастровые работы по финальному ТЗ: файлы анкеты, оборудование да/нет, город; блоки заявки

Revision ID: 152
Revises: 151
"""
from collections.abc import Sequence

from alembic import op

revision: str = "152"
down_revision: str | None = "151"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

PROFILE = "expert_cadastral_profiles"
DETAILS = "order_cadastral_details"


def upgrade() -> None:
    op.execute(f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS education_diploma JSONB")
    op.execute(f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS certificate_file JSONB")
    op.execute(
        f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS has_equipment BOOLEAN NOT NULL DEFAULT false"
    )
    op.execute(
        f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS city VARCHAR(200) NOT NULL DEFAULT ''"
    )
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS equipment")

    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS applicant_full_name VARCHAR(300) NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS applicant_position VARCHAR(200) NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS applicant_organization VARCHAR(500) NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS applicant_inn VARCHAR(12) NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS applicant_phone VARCHAR(30) NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS applicant_email VARCHAR(320) NOT NULL DEFAULT ''"
    )
    op.execute(f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS work_purpose TEXT NOT NULL DEFAULT ''")
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS city VARCHAR(200) NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS education_requirement TEXT NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS sro_required BOOLEAN NOT NULL DEFAULT false"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS duration VARCHAR(200) NOT NULL DEFAULT ''"
    )
    op.execute(f"UPDATE {DETAILS} SET city = work_location WHERE city = '' AND work_location IS NOT NULL")
    op.execute(f"ALTER TABLE {DETAILS} DROP COLUMN IF EXISTS work_location")


def downgrade() -> None:
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS education_diploma")
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS certificate_file")
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS has_equipment")
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS city")
    op.execute(f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS equipment TEXT NOT NULL DEFAULT ''")

    op.execute(f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS work_location VARCHAR(500) NOT NULL DEFAULT ''")
    op.execute(f"UPDATE {DETAILS} SET work_location = city WHERE work_location = ''")
    for column in (
        "applicant_full_name",
        "applicant_position",
        "applicant_organization",
        "applicant_inn",
        "applicant_phone",
        "applicant_email",
        "work_purpose",
        "city",
        "education_requirement",
        "sro_required",
        "duration",
    ):
        op.execute(f"ALTER TABLE {DETAILS} DROP COLUMN IF EXISTS {column}")
