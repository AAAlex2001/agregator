"""add uuid column to chats

Revision ID: 017
Revises: 016
Create Date: 2026-02-20 00:01:00.000000
"""

import uuid

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


revision = "017"
down_revision = "016"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("chats", sa.Column("uuid", UUID(as_uuid=True), nullable=True))

    conn = op.get_bind()
    chats = conn.execute(sa.text("SELECT id FROM chats")).fetchall()
    for (chat_id,) in chats:
        conn.execute(
            sa.text("UPDATE chats SET uuid = :uuid WHERE id = :id"),
            {"uuid": str(uuid.uuid4()), "id": chat_id},
        )

    op.alter_column("chats", "uuid", nullable=False)
    op.create_index(op.f("ix_chats_uuid"), "chats", ["uuid"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_chats_uuid"), table_name="chats")
    op.drop_column("chats", "uuid")
