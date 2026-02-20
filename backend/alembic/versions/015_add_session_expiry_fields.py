"""add session expiry fields

Revision ID: 015
Revises: 014
Create Date: 2026-02-20 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "015"
down_revision = "014"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("sessions", sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("sessions", sa.Column("max_expires_at", sa.DateTime(timezone=True), nullable=True))

    op.execute("UPDATE sessions SET expires_at = created_at + interval '7 days' WHERE expires_at IS NULL")
    op.execute("UPDATE sessions SET max_expires_at = created_at + interval '14 days' WHERE max_expires_at IS NULL")

    op.alter_column("sessions", "expires_at", nullable=False)
    op.alter_column("sessions", "max_expires_at", nullable=False)


def downgrade() -> None:
    op.drop_column("sessions", "max_expires_at")
    op.drop_column("sessions", "expires_at")
