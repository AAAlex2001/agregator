"""Поля заявки на аудит СУПБ и список ОПО

Revision ID: 155
Revises: 154
"""
from collections.abc import Sequence

from alembic import op

revision: str = "155"
down_revision: str | None = "154"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def create_enum(name: str, values: tuple[str, ...]) -> None:
    joined = ", ".join(f"'{value}'" for value in values)
    op.execute(
        f"""
        DO $$ BEGIN
            CREATE TYPE {name} AS ENUM ({joined});
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
        """
    )


def upgrade() -> None:
    create_enum("auditscale", ("SINGLE_OPO", "ALL_OPO", "SELECTED_OPO"))
    create_enum("auditkind", ("BASIC", "INTERIM", "SELECTIVE", "CONSULTATION"))
    create_enum("audittimeline", ("MONTH_URGENT", "CURRENT_QUARTER", "NEXT_QUARTER", "CONSULTATION"))
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS order_audit_details (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
            applicant_full_name VARCHAR(300) NOT NULL DEFAULT '',
            applicant_position VARCHAR(200) NOT NULL DEFAULT '',
            applicant_organization VARCHAR(500) NOT NULL DEFAULT '',
            applicant_inn VARCHAR(12) NOT NULL DEFAULT '',
            applicant_phone VARCHAR(30) NOT NULL DEFAULT '',
            applicant_email VARCHAR(320) NOT NULL DEFAULT '',
            audit_scale auditscale NOT NULL,
            opo_total INTEGER,
            opo_class_1 INTEGER,
            opo_class_2 INTEGER,
            opo_class_3 INTEGER,
            opo_class_4 INTEGER,
            main_industry VARCHAR(500) NOT NULL DEFAULT '',
            multiple_regions BOOLEAN,
            registration_certificate JSONB,
            audit_kind auditkind NOT NULL,
            considers_sto BOOLEAN,
            sto_name VARCHAR(500) NOT NULL DEFAULT '',
            sto_file JSONB,
            audit_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
            desired_timeline audittimeline NOT NULL,
            comments TEXT NOT NULL DEFAULT ''
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_order_audit_details_order_id "
        "ON order_audit_details (order_id)"
    )
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS order_audit_opo_items (
            id SERIAL PRIMARY KEY,
            details_id INTEGER NOT NULL REFERENCES order_audit_details(id) ON DELETE CASCADE,
            position INTEGER NOT NULL DEFAULT 0,
            registration_number VARCHAR(100) NOT NULL DEFAULT '',
            name VARCHAR(500) NOT NULL DEFAULT '',
            hazard_class VARCHAR(50) NOT NULL DEFAULT '',
            address VARCHAR(500) NOT NULL DEFAULT '',
            industry VARCHAR(500) NOT NULL DEFAULT '',
            hazard_signs VARCHAR(1000) NOT NULL DEFAULT ''
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_order_audit_opo_items_details_id "
        "ON order_audit_opo_items (details_id)"
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS order_audit_opo_items")
    op.execute("DROP TABLE IF EXISTS order_audit_details")
    op.execute("DROP TYPE IF EXISTS audittimeline")
    op.execute("DROP TYPE IF EXISTS auditkind")
    op.execute("DROP TYPE IF EXISTS auditscale")
