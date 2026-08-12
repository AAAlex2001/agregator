"""Поля заявки направления «Проектирование промышленных и гражданских объектов»

Revision ID: 163
Revises: 162
"""
from collections.abc import Sequence

from alembic import op

revision: str = "163"
down_revision: str | None = "162"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS order_design_details (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
            object_name VARCHAR(500) NOT NULL DEFAULT '',
            construction_city VARCHAR(200) NOT NULL DEFAULT '',
            doc_categories JSONB NOT NULL DEFAULT '[]',
            documentation_kinds JSONB NOT NULL DEFAULT '[]',
            scope VARCHAR(20) NOT NULL DEFAULT 'FULL',
            sections JSONB NOT NULL DEFAULT '[]',
            approvals JSONB NOT NULL DEFAULT '[]',
            approvals_other TEXT NOT NULL DEFAULT '',
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
        "CREATE INDEX IF NOT EXISTS ix_order_design_details_order_id "
        "ON order_design_details (order_id)"
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS order_design_details")
