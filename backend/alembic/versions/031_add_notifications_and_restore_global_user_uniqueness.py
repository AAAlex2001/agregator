"""add notifications and restore global user uniqueness

Revision ID: 031
Revises: 030
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect, text
from sqlalchemy.dialects import postgresql


revision = "031"
down_revision = "030"
branch_labels = None
depends_on = None


def _find_unique_constraint(inspector, table, columns):
    target = set(columns)
    for unique_constraint in inspector.get_unique_constraints(table):
        if set(unique_constraint["column_names"]) == target:
            return unique_constraint["name"]
    return None


def _find_index(inspector, table, columns):
    target = set(columns)
    for index in inspector.get_indexes(table):
        if set(index["column_names"]) == target:
            return index["name"], index.get("unique", False)
    return None, False


def _has_column(inspector, table, column):
    return any(existing_column["name"] == column for existing_column in inspector.get_columns(table))


def _ensure_no_duplicates(column: str) -> None:
    if column not in {"email", "phone", "inn"}:
        raise ValueError(f"Unexpected users column: {column}")

    rows = op.get_bind().execute(
        text(
            f"""
            SELECT {column}, COUNT(*) AS total
            FROM users
            WHERE {column} IS NOT NULL
            GROUP BY {column}
            HAVING COUNT(*) > 1
            ORDER BY total DESC, {column}
            LIMIT 10
            """
        )
    ).fetchall()

    if rows:
        duplicates = ", ".join(str(row[0]) for row in rows)
        raise RuntimeError(
            f"Cannot restore global uniqueness for users.{column}; duplicate values already exist: {duplicates}"
        )


def upgrade() -> None:
    _ensure_no_duplicates("email")
    _ensure_no_duplicates("phone")
    _ensure_no_duplicates("inn")

    conn = op.get_bind()
    inspector = inspect(conn)

    for columns in (["email", "role"], ["phone", "role"], ["inn", "role"]):
        unique_constraint_name = _find_unique_constraint(inspector, "users", columns)
        if unique_constraint_name:
            op.drop_constraint(unique_constraint_name, "users", type_="unique")

    email_index, email_is_unique = _find_index(inspector, "users", ["email"])
    if email_index and not email_is_unique:
        op.drop_index(email_index, table_name="users")
    if not email_is_unique:
        op.create_index("ix_users_email", "users", ["email"], unique=True)

    phone_index, phone_is_unique = _find_index(inspector, "users", ["phone"])
    if phone_index and not phone_is_unique:
        op.drop_index(phone_index, table_name="users")
    if not phone_is_unique:
        op.create_index("ix_users_phone", "users", ["phone"], unique=True)

    inn_index, inn_is_unique = _find_index(inspector, "users", ["inn"])
    if inn_index and not inn_is_unique:
        op.drop_index(inn_index, table_name="users")
    if not inn_is_unique:
        op.create_index("ix_users_inn", "users", ["inn"], unique=True)

    if not _has_column(inspector, "users", "notification_unread_count"):
        op.add_column(
            "users",
            sa.Column("notification_unread_count", sa.Integer(), nullable=False, server_default="0"),
        )

    notification_type = postgresql.ENUM(
        "RESPONSE_UPDATED",
        "RESPONSE_STATUS_CHANGED",
        "CHAT_MESSAGE",
        name="notificationtype",
    )
    notification_type.create(conn, checkfirst=True)

    notification_type_column = postgresql.ENUM(
        "RESPONSE_UPDATED",
        "RESPONSE_STATUS_CHANGED",
        "CHAT_MESSAGE",
        name="notificationtype",
        create_type=False,
    )

    if not inspector.has_table("notifications"):
        op.create_table(
            "notifications",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("type", notification_type_column, nullable=False),
            sa.Column("payload", sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")),
            sa.Column("action_url", sa.String(length=500), nullable=True),
            sa.Column("is_read", sa.Boolean(), nullable=False, server_default="false"),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
            sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_notifications_user_id", "notifications", ["user_id"], unique=False)
        op.create_index("ix_notifications_is_read", "notifications", ["is_read"], unique=False)
        op.create_index("ix_notifications_created_at", "notifications", ["created_at"], unique=False)


def downgrade() -> None:
    conn = op.get_bind()
    inspector = inspect(conn)

    if inspector.has_table("notifications"):
        notification_created_index, _ = _find_index(inspector, "notifications", ["created_at"])
        if notification_created_index:
            op.drop_index(notification_created_index, table_name="notifications")

        notification_is_read_index, _ = _find_index(inspector, "notifications", ["is_read"])
        if notification_is_read_index:
            op.drop_index(notification_is_read_index, table_name="notifications")

        notification_user_index, _ = _find_index(inspector, "notifications", ["user_id"])
        if notification_user_index:
            op.drop_index(notification_user_index, table_name="notifications")

        op.drop_table("notifications")

    notification_type = postgresql.ENUM(
        "RESPONSE_UPDATED",
        "RESPONSE_STATUS_CHANGED",
        "CHAT_MESSAGE",
        name="notificationtype",
    )
    notification_type.drop(conn, checkfirst=True)

    if _has_column(inspector, "users", "notification_unread_count"):
        op.drop_column("users", "notification_unread_count")

    email_index, email_is_unique = _find_index(inspector, "users", ["email"])
    if email_index and email_is_unique:
        op.drop_index(email_index, table_name="users")
        op.create_index("ix_users_email", "users", ["email"], unique=False)

    phone_index, phone_is_unique = _find_index(inspector, "users", ["phone"])
    if phone_index and phone_is_unique:
        op.drop_index(phone_index, table_name="users")
        op.create_index("ix_users_phone", "users", ["phone"], unique=False)

    inn_index, inn_is_unique = _find_index(inspector, "users", ["inn"])
    if inn_index and inn_is_unique:
        op.drop_index(inn_index, table_name="users")
        op.create_index("ix_users_inn", "users", ["inn"], unique=False)

    for constraint_name, columns in (
        ("uq_users_email_role", ["email", "role"]),
        ("uq_users_phone_role", ["phone", "role"]),
        ("uq_users_inn_role", ["inn", "role"]),
    ):
        unique_constraint_name = _find_unique_constraint(inspector, "users", columns)
        if not unique_constraint_name:
            op.create_unique_constraint(constraint_name, "users", columns)