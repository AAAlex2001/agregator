"""Блок «Сведения о заявителе» в заявках НИР и лабораторных исследований

Revision ID: 159
Revises: 158
"""
from collections.abc import Sequence

from alembic import op

revision: str = "159"
down_revision: str | None = "158"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

TABLES = ("order_research_details", "order_laboratory_details")

APPLICANT_COLUMNS = (
    ("applicant_full_name", "VARCHAR(300)"),
    ("applicant_position", "VARCHAR(200)"),
    ("applicant_organization", "VARCHAR(500)"),
    ("applicant_inn", "VARCHAR(12)"),
    ("applicant_phone", "VARCHAR(30)"),
    ("applicant_email", "VARCHAR(320)"),
)


def upgrade() -> None:
    for table in TABLES:
        for name, column_type in APPLICANT_COLUMNS:
            op.execute(
                f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS {name} "
                f"{column_type} NOT NULL DEFAULT ''"
            )


def downgrade() -> None:
    for table in TABLES:
        for name, _ in APPLICANT_COLUMNS:
            op.execute(f"ALTER TABLE {table} DROP COLUMN IF EXISTS {name}")
