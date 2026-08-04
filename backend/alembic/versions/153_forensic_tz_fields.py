"""Судебная экспертиза по финальному ТЗ: диплом, доп. образование, степень, город; блоки заявки

Revision ID: 153
Revises: 152
"""
from collections.abc import Sequence

from alembic import op

revision: str = "153"
down_revision: str | None = "152"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

PROFILE = "expert_forensic_profiles"
DETAILS = "order_forensic_details"


def upgrade() -> None:
    op.execute(f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS education_diploma JSONB")
    op.execute(
        f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS extra_education TEXT NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS has_similar_experience BOOLEAN NOT NULL DEFAULT false"
    )
    op.execute(
        f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS has_degree BOOLEAN NOT NULL DEFAULT false"
    )
    op.execute(
        f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS degree VARCHAR(300) NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS city VARCHAR(200) NOT NULL DEFAULT ''"
    )
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS similar_cases_experience")

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
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS expertise_purpose TEXT NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS city VARCHAR(200) NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS education_requirement TEXT NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS extra_requirements TEXT NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS similar_experience_required BOOLEAN NOT NULL DEFAULT false"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS duration VARCHAR(200) NOT NULL DEFAULT ''"
    )
    op.execute(
        f"UPDATE {DETAILS} SET city = subject_location WHERE city = '' AND subject_location IS NOT NULL"
    )
    op.execute(
        f"UPDATE {DETAILS} SET extra_requirements = expert_requirements "
        f"WHERE extra_requirements = '' AND expert_requirements IS NOT NULL"
    )
    op.execute(f"ALTER TABLE {DETAILS} DROP COLUMN IF EXISTS subject_location")
    op.execute(f"ALTER TABLE {DETAILS} DROP COLUMN IF EXISTS expert_requirements")


def downgrade() -> None:
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS education_diploma")
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS extra_education")
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS has_similar_experience")
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS has_degree")
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS degree")
    op.execute(f"ALTER TABLE {PROFILE} DROP COLUMN IF EXISTS city")
    op.execute(
        f"ALTER TABLE {PROFILE} ADD COLUMN IF NOT EXISTS similar_cases_experience TEXT NOT NULL DEFAULT ''"
    )

    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS subject_location VARCHAR(500) NOT NULL DEFAULT ''"
    )
    op.execute(
        f"ALTER TABLE {DETAILS} ADD COLUMN IF NOT EXISTS expert_requirements TEXT NOT NULL DEFAULT ''"
    )
    op.execute(f"UPDATE {DETAILS} SET subject_location = city WHERE subject_location = ''")
    op.execute(f"UPDATE {DETAILS} SET expert_requirements = extra_requirements WHERE expert_requirements = ''")
    for column in (
        "applicant_full_name",
        "applicant_position",
        "applicant_organization",
        "applicant_inn",
        "applicant_phone",
        "applicant_email",
        "expertise_purpose",
        "city",
        "education_requirement",
        "extra_requirements",
        "similar_experience_required",
        "duration",
    ):
        op.execute(f"ALTER TABLE {DETAILS} DROP COLUMN IF EXISTS {column}")
