"""Доливка заявителя в техдиагностирование: стенды со старой 159 не получили колонки

Revision ID: 160
Revises: 159
"""
from collections.abc import Sequence

from alembic import op

revision: str = "160"
down_revision: str | None = "159"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

APPLICANT_COLUMNS = (
    ("applicant_full_name", "VARCHAR(300)"),
    ("applicant_position", "VARCHAR(200)"),
    ("applicant_organization", "VARCHAR(500)"),
    ("applicant_inn", "VARCHAR(12)"),
    ("applicant_phone", "VARCHAR(30)"),
    ("applicant_email", "VARCHAR(320)"),
)


def upgrade() -> None:
    for name, column_type in APPLICANT_COLUMNS:
        op.execute(
            f"ALTER TABLE order_tech_diag_details ADD COLUMN IF NOT EXISTS {name} "
            f"{column_type} NOT NULL DEFAULT ''"
        )


def downgrade() -> None:
    pass
