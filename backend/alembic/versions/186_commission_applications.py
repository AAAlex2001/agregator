"""Конкурсная комиссия: заявки кандидатов в эксперты со статусом рассмотрения.

Revision ID: 186
Revises: 185
"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision = "186"
down_revision = "185"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Таблица заявок кандидатов."""

    op.create_table(
        "commission_applications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(32), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("attestations", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("status", sa.String(16), nullable=False),
        sa.Column("decision", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_commission_applications_status", "commission_applications", ["status"])


def downgrade() -> None:
    """Удаляет таблицу заявок."""

    op.drop_table("commission_applications")
