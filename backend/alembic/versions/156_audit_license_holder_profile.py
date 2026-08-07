"""Анкета инспекционного органа у держателя; анкета аудитора без полей органа

Revision ID: 156
Revises: 155
"""
from collections.abc import Sequence

from alembic import op

revision: str = "156"
down_revision: str | None = "155"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS license_holder_audit_profiles (
            id SERIAL PRIMARY KEY,
            license_holder_id INTEGER NOT NULL UNIQUE REFERENCES license_holders(id) ON DELETE CASCADE,
            certificate_number VARCHAR(100) NOT NULL DEFAULT '',
            accreditation_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_license_holder_audit_profiles_license_holder_id "
        "ON license_holder_audit_profiles (license_holder_id)"
    )
    op.execute("ALTER TABLE expert_audit_profiles DROP COLUMN IF EXISTS participant_kind")
    op.execute("ALTER TABLE expert_audit_profiles DROP COLUMN IF EXISTS full_name")
    op.execute("ALTER TABLE expert_audit_profiles DROP COLUMN IF EXISTS short_name")
    op.execute("ALTER TABLE expert_audit_profiles DROP COLUMN IF EXISTS inn")
    op.execute("ALTER TABLE expert_audit_profiles DROP COLUMN IF EXISTS certificate_number")
    op.execute("ALTER TABLE expert_audit_profiles DROP COLUMN IF EXISTS accreditation_areas")
    op.execute("DROP TYPE IF EXISTS auditparticipantkind")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS license_holder_audit_profiles")
