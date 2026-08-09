"""Удаление инженерных видов работ: ПИРы, обследования/дефектоскопия, прочие

Revision ID: 158
Revises: 157
"""
from collections.abc import Sequence

from alembic import op

revision: str = "158"
down_revision: str | None = "157"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

KEPT_VALUES = (
    "EXPERTISE",
    "RESEARCH_LAB",
    "CADASTRAL",
    "FORENSIC",
    "RESEARCH",
    "LABORATORY",
    "AUDIT_SUPB",
    "TECH_DIAG",
)

DROPPED_VALUES = ("DESIGN_SURVEY", "INSPECTION_TESTING", "OTHER")


def upgrade() -> None:
    values = ", ".join(f"'{value}'" for value in KEPT_VALUES)
    op.execute("ALTER TABLE orders ALTER COLUMN work_type DROP DEFAULT")
    op.execute("ALTER TYPE orderworktype RENAME TO orderworktype_old")
    op.execute(f"CREATE TYPE orderworktype AS ENUM ({values})")
    op.execute(
        "ALTER TABLE orders ALTER COLUMN work_type "
        "TYPE orderworktype USING work_type::text::orderworktype"
    )
    op.execute("ALTER TABLE orders ALTER COLUMN work_type SET DEFAULT 'EXPERTISE'")
    op.execute("DROP TYPE orderworktype_old")

    for value in DROPPED_VALUES:
        op.execute(
            f"UPDATE experts SET notify_order_types = notify_order_types - '{value}' "
            "WHERE notify_order_types IS NOT NULL"
        )


def downgrade() -> None:
    for value in DROPPED_VALUES:
        op.execute(f"ALTER TYPE orderworktype ADD VALUE IF NOT EXISTS '{value}'")
