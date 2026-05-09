"""replace global unique on (email)/(phone)/(inn) with composite (X, role)

Revision ID: 059
Revises: 058
"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy import inspect


revision: str = "059"
down_revision: Union[str, None] = "058"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


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

    for col in ("email", "phone", "inn"):
        # глобальный unique constraint (если был как constraint)
        uc = _find_unique_constraint(inspector, "users", [col])
        if uc:
            op.drop_constraint(uc, "users", type_="unique")

        # глобальный unique index → пересоздаём не-уникальным
        idx_name, is_unique = _find_index(inspector, "users", [col])
        if idx_name and is_unique:
            op.drop_index(idx_name, table_name="users")
            op.create_index(f"ix_users_{col}", "users", [col], unique=False)

    # composite unique по (col, role)
    for col, name in (
        ("email", "uq_users_email_role"),
        ("phone", "uq_users_phone_role"),
        ("inn", "uq_users_inn_role"),
    ):
        if not _find_unique_constraint(inspector, "users", [col, "role"]):
            op.create_unique_constraint(name, "users", [col, "role"])


def downgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)

    for col, role_uc_name in (
        ("email", "uq_users_email_role"),
        ("phone", "uq_users_phone_role"),
        ("inn", "uq_users_inn_role"),
    ):
        uc = _find_unique_constraint(inspector, "users", [col, "role"])
        if uc:
            op.drop_constraint(uc, "users", type_="unique")

        idx_name, is_unique = _find_index(inspector, "users", [col])
        if idx_name and not is_unique:
            op.drop_index(idx_name, table_name="users")
            op.create_index(f"ix_users_{col}", "users", [col], unique=True)
        del role_uc_name
