"""add user inn and chat attachments

Revision ID: 028
Revises: 027
Create Date: 2026-04-19 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "028"
down_revision = "027"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("inn", sa.String(length=12), nullable=True))
    op.create_index(op.f("ix_users_inn"), "users", ["inn"], unique=False)
    op.create_unique_constraint("uq_users_inn_role", "users", ["inn", "role"])

    op.add_column(
        "chat_messages",
        sa.Column("attachments", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
    )


def downgrade() -> None:
    op.drop_column("chat_messages", "attachments")

    op.drop_constraint("uq_users_inn_role", "users", type_="unique")
    op.drop_index(op.f("ix_users_inn"), table_name="users")
    op.drop_column("users", "inn")