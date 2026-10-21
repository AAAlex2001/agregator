"""Блиц-аудит СУПБ: анкета и План в заявке, торг по цене, аудиторские группы и их руководители.

Цена заявки может быть пустой: заказчик аудита вправе не указывать бюджет.

Revision ID: 187
Revises: 186
"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision = "187"
down_revision = "186"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Поля аудита в заявке, необязательная цена, таблицы группы и руководителей."""

    op.drop_constraint("ck_blitz_orders_price_positive", "blitz_orders", type_="check")
    op.alter_column("blitz_orders", "price", existing_type=sa.Numeric(12, 2), nullable=True)
    op.create_check_constraint("ck_blitz_orders_price_positive", "blitz_orders", "price IS NULL OR price > 0")

    op.add_column("blitz_orders", sa.Column("offer_price", sa.Numeric(12, 2), nullable=True))
    op.add_column("blitz_orders", sa.Column("counter_price", sa.Numeric(12, 2), nullable=True))
    op.add_column("blitz_orders", sa.Column("audit_details", postgresql.JSONB(), nullable=True))
    op.add_column("blitz_orders", sa.Column("audit_plan", postgresql.JSONB(), nullable=True))
    op.add_column("blitz_orders", sa.Column("plan_comment", sa.Text(), nullable=True))

    op.alter_column("blitz_price_changes", "old_price", existing_type=sa.Numeric(12, 2), nullable=True)

    op.create_table(
        "blitz_audit_team",
        sa.Column(
            "order_id",
            sa.Integer(),
            sa.ForeignKey("blitz_orders.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "account_id",
            sa.Integer(),
            sa.ForeignKey("accounts.id", ondelete="CASCADE"),
            primary_key=True,
        ),
    )
    op.create_index("ix_blitz_audit_team_account_id", "blitz_audit_team", ["account_id"])

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


def downgrade() -> None:
    """Удаляет аудит. Заявки без цены удаляются: вернуть обязательную цену иначе нельзя."""

    op.drop_table("blitz_audit_leads")
    op.drop_table("blitz_audit_team")

    op.execute("DELETE FROM blitz_price_changes WHERE old_price IS NULL")
    op.alter_column("blitz_price_changes", "old_price", existing_type=sa.Numeric(12, 2), nullable=False)

    op.drop_column("blitz_orders", "plan_comment")
    op.drop_column("blitz_orders", "audit_plan")
    op.drop_column("blitz_orders", "audit_details")
    op.drop_column("blitz_orders", "counter_price")
    op.drop_column("blitz_orders", "offer_price")

    op.execute("DELETE FROM blitz_orders WHERE price IS NULL")
    op.drop_constraint("ck_blitz_orders_price_positive", "blitz_orders", type_="check")
    op.alter_column("blitz_orders", "price", existing_type=sa.Numeric(12, 2), nullable=False)
    op.create_check_constraint("ck_blitz_orders_price_positive", "blitz_orders", "price > 0")
