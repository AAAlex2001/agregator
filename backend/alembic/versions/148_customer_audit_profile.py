"""анкета заказчика по аудиту СУПБ отдельной таблицей

Revision ID: 148
Revises: 147
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "148"
down_revision: str | None = "147"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "customer_audit_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column("position", sa.String(200), nullable=False, server_default=""),
        sa.Column("opo_license_number", sa.String(100), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["customer_id"], ["customers.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("customer_id", name="uq_customer_audit_profiles_customer_id"),
    )
    op.create_index("ix_customer_audit_profiles_customer_id", "customer_audit_profiles", ["customer_id"])

    op.execute(
        "INSERT INTO customer_audit_profiles (customer_id, position, opo_license_number) "
        "SELECT id, COALESCE(position, ''), COALESCE(opo_license_number, '') FROM customers "
        "WHERE COALESCE(position, '') <> '' OR COALESCE(opo_license_number, '') <> ''"
    )

    op.drop_column("customers", "opo_license_number")
    op.drop_column("customers", "position")


def downgrade() -> None:
    op.add_column("customers", sa.Column("position", sa.String(200), nullable=False, server_default=""))
    op.add_column("customers", sa.Column("opo_license_number", sa.String(100), nullable=True))
    op.execute(
        "UPDATE customers SET position = p.position, opo_license_number = p.opo_license_number "
        "FROM customer_audit_profiles p WHERE p.customer_id = customers.id"
    )
    op.drop_table("customer_audit_profiles")
