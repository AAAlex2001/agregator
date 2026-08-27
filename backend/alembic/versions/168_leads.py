"""Заявки с публичных страниц сайта

Revision ID: 168
Revises: 167
"""
from collections.abc import Sequence

from alembic import op

revision: str = "168"
down_revision: str | None = "167"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
                CREATE TYPE lead_status AS ENUM ('NEW', 'IN_WORK', 'DONE', 'SPAM');
            END IF;
        END$$;
        """
    )
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS leads (
            id SERIAL PRIMARY KEY,
            direction VARCHAR(50) NOT NULL,
            name VARCHAR(200) NOT NULL DEFAULT '',
            phone VARCHAR(50) NOT NULL DEFAULT '',
            email VARCHAR(255) NOT NULL DEFAULT '',
            company VARCHAR(300) NOT NULL DEFAULT '',
            inn VARCHAR(20) NOT NULL DEFAULT '',
            region VARCHAR(200) NOT NULL DEFAULT '',
            object_name VARCHAR(500) NOT NULL DEFAULT '',
            task TEXT NOT NULL DEFAULT '',
            deadline VARCHAR(100) NOT NULL DEFAULT '',
            budget VARCHAR(100) NOT NULL DEFAULT '',
            source_url VARCHAR(500) NOT NULL DEFAULT '',
            comment TEXT NOT NULL DEFAULT '',
            status lead_status NOT NULL DEFAULT 'NEW',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute("CREATE INDEX IF NOT EXISTS ix_leads_direction ON leads (direction)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_leads_status ON leads (status)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_leads_created_at ON leads (created_at DESC)")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS leads")
    op.execute("DROP TYPE IF EXISTS lead_status")
