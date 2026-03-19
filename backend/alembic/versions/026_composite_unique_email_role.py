"""replace unique email/phone with composite (email,role)/(phone,role)

Revision ID: 026
Revises: 025
"""

from alembic import op
from sqlalchemy import inspect

revision = "026"
down_revision = "025"
branch_labels = None
depends_on = None


def _find_unique_constraint(inspector, table, columns):
    target = set(columns)
    for uc in inspector.get_unique_constraints(table):
        if set(uc["column_names"]) == target:
            return uc["name"]
    return None


def _find_index(inspector, table, columns):
    target = set(columns)
    for idx in inspector.get_indexes(table):
        if set(idx["column_names"]) == target:
            return idx["name"], idx.get("unique", False)
    return None, False


def upgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)

    email_uc = _find_unique_constraint(inspector, "users", ["email"])
    if email_uc:
        op.drop_constraint(email_uc, "users", type_="unique")

    phone_uc = _find_unique_constraint(inspector, "users", ["phone"])
    if phone_uc:
        op.drop_constraint(phone_uc, "users", type_="unique")

    email_idx, email_idx_unique = _find_index(inspector, "users", ["email"])
    if email_idx and email_idx_unique:
        op.drop_index(email_idx, table_name="users")
        op.create_index("ix_users_email", "users", ["email"], unique=False)

    phone_idx, phone_idx_unique = _find_index(inspector, "users", ["phone"])
    if phone_idx and phone_idx_unique:
        op.drop_index(phone_idx, table_name="users")
        op.create_index("ix_users_phone", "users", ["phone"], unique=False)

    email_role_uc = _find_unique_constraint(inspector, "users", ["email", "role"])
    if not email_role_uc:
        op.create_unique_constraint("uq_users_email_role", "users", ["email", "role"])

    phone_role_uc = _find_unique_constraint(inspector, "users", ["phone", "role"])
    if not phone_role_uc:
        op.create_unique_constraint("uq_users_phone_role", "users", ["phone", "role"])


def downgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)

    email_role_uc = _find_unique_constraint(inspector, "users", ["email", "role"])
    if email_role_uc:
        op.drop_constraint(email_role_uc, "users", type_="unique")

    phone_role_uc = _find_unique_constraint(inspector, "users", ["phone", "role"])
    if phone_role_uc:
        op.drop_constraint(phone_role_uc, "users", type_="unique")

    email_idx, email_idx_unique = _find_index(inspector, "users", ["email"])
    if email_idx and not email_idx_unique:
        op.drop_index(email_idx, table_name="users")
        op.create_index("ix_users_email", "users", ["email"], unique=True)

    phone_idx, phone_idx_unique = _find_index(inspector, "users", ["phone"])
    if phone_idx and not phone_idx_unique:
        op.drop_index(phone_idx, table_name="users")
        op.create_index("ix_users_phone", "users", ["phone"], unique=True)

    email_uc = _find_unique_constraint(inspector, "users", ["email"])
    if not email_uc:
        op.create_unique_constraint("users_email_key", "users", ["email"])

    phone_uc = _find_unique_constraint(inspector, "users", ["phone"])
    if not phone_uc:
        op.create_unique_constraint("users_phone_key", "users", ["phone"])
