"""mailer simplification: companies.sent_at + drop campaign/recipient/suppression tables

Revision ID: 097
Revises: 096
"""
from typing import Sequence, Union

from alembic import op


revision: str = "097"
down_revision: Union[str, None] = "096"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Трекинг отправки прямо в базе компаний — отдельные таблицы кампаний/получателей больше не нужны.
    op.execute("ALTER TABLE companies ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ NULL")
    op.execute("CREATE INDEX IF NOT EXISTS ix_companies_sent_at ON companies (sent_at)")

    op.execute("DROP TABLE IF EXISTS campaign_recipients CASCADE")
    op.execute("DROP TABLE IF EXISTS email_campaigns CASCADE")
    op.execute("DROP TABLE IF EXISTS email_suppression CASCADE")

    op.execute("DROP TYPE IF EXISTS recipientstatus")
    op.execute("DROP TYPE IF EXISTS campaignstatus")
    op.execute("DROP TYPE IF EXISTS suppressionreason")


def downgrade() -> None:
    # Откат не воссоздаёт удалённые таблицы кампаний (схема упрощена осознанно).
    op.execute("DROP INDEX IF EXISTS ix_companies_sent_at")
    op.execute("ALTER TABLE companies DROP COLUMN IF EXISTS sent_at")
