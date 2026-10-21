"""Блиц-аудит без назначаемых руководителей групп: аудит берёт любой эксперт с анкетой «Аудит СУПБ».

Revision ID: 188
Revises: 187
"""

import sqlalchemy as sa

from alembic import op

revision = "188"
down_revision = "187"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Удаляет таблицу руководителей групп."""

    op.drop_table("blitz_audit_leads")


def downgrade() -> None:
    """Возвращает пустую таблицу руководителей групп."""

    op.create_table(
        "blitz_audit_leads",
        sa.Column(
            "account_id",
            sa.Integer(),
            sa.ForeignKey("accounts.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
