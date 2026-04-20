"""add public_id to users

Revision ID: 032
Revises: 031
"""

from uuid import uuid4

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "032"
down_revision = "031"
branch_labels = None
depends_on = None


def _has_column(inspector, table, column):
    return any(c["name"] == column for c in inspector.get_columns(table))


def _find_index(inspector, table, columns):
    target = set(columns)
    for index in inspector.get_indexes(table):
        if set(index["column_names"]) == target:
            return index["name"], index.get("unique", False)
    return None, False


def upgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)

    if _has_column(inspector, "users", "public_id"):
        return

    op.add_column("users", sa.Column("public_id", sa.String(length=36), nullable=True))

    rows = conn.execute(sa.text("SELECT id FROM users")).fetchall()
    for row in rows:
        conn.execute(
            sa.text("UPDATE users SET public_id = :pid WHERE id = :uid"),
            {"pid": str(uuid4()), "uid": row[0]},
        )

    op.alter_column("users", "public_id", nullable=False)
    op.create_index("ix_users_public_id", "users", ["public_id"], unique=True)


def downgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)

    index_name, _ = _find_index(inspector, "users", ["public_id"])
    if index_name:
        op.drop_index(index_name, table_name="users")

    if _has_column(inspector, "users", "public_id"):
        op.drop_column("users", "public_id")
