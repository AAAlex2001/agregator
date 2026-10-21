"""Блиц-эксперт: заявки на экспертизу, история статусов, файлы, замечания, счета, оплата картой, цены.

Revision ID: 185
Revises: 184
"""

import sqlalchemy as sa

from alembic import op

revision = "185"
down_revision = "184"
branch_labels = None
depends_on = None


def order_reference() -> sa.Column:
    """Ссылка на заявку: строка уходит вместе с ней."""

    return sa.Column(
        "order_id",
        sa.Integer(),
        sa.ForeignKey("blitz_orders.id", ondelete="CASCADE"),
        nullable=False,
    )


def created_at() -> sa.Column:
    """Когда создана запись."""

    return sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False)


def upgrade() -> None:
    """Таблицы Блиц-эксперта и тип уведомления о событии заявки."""

    op.create_table(
        "blitz_orders",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("service", sa.String(16), nullable=False),
        sa.Column(
            "customer_id",
            sa.Integer(),
            sa.ForeignKey("accounts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "expert_id",
            sa.Integer(),
            sa.ForeignKey("accounts.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("object_code", sa.String(8), nullable=True),
        sa.Column("area_code", sa.String(8), nullable=True),
        sa.Column("hazard_class", sa.SmallInteger(), nullable=True),
        sa.Column("expert_category", sa.SmallInteger(), nullable=True),
        sa.Column("deadline", sa.String(16), nullable=False),
        sa.Column("object_name", sa.String(500), nullable=False),
        sa.Column("contract_kind", sa.String(32), nullable=True),
        sa.Column("customer_type", sa.String(16), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("status", sa.String(24), nullable=False),
        sa.Column("result", sa.String(16), nullable=True),
        sa.Column("cancel_reason", sa.Text(), nullable=True),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("paid_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        created_at(),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("price > 0", name="ck_blitz_orders_price_positive"),
        sa.CheckConstraint("paid_amount >= 0", name="ck_blitz_orders_paid_amount"),
    )
    op.create_index("ix_blitz_orders_service", "blitz_orders", ["service"])
    op.create_index("ix_blitz_orders_customer_id", "blitz_orders", ["customer_id"])
    op.create_index("ix_blitz_orders_expert_id", "blitz_orders", ["expert_id"])
    op.create_index("ix_blitz_orders_status", "blitz_orders", ["status"])

    op.create_table(
        "blitz_status_changes",
        sa.Column("id", sa.Integer(), primary_key=True),
        order_reference(),
        sa.Column("status", sa.String(24), nullable=False),
        sa.Column("actor", sa.String(16), nullable=False),
        sa.Column("note", sa.Text(), nullable=True),
        created_at(),
    )
    op.create_index("ix_blitz_status_changes_order_id", "blitz_status_changes", ["order_id"])

    op.create_table(
        "blitz_order_companies",
        sa.Column(
            "order_id",
            sa.Integer(),
            sa.ForeignKey("blitz_orders.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("full_name", sa.String(500), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("inn", sa.String(12), nullable=False),
        sa.Column("kpp", sa.String(9), nullable=True),
        sa.Column("ogrn", sa.String(15), nullable=False),
        sa.Column("address", sa.String(500), nullable=False),
        sa.Column("bank", sa.String(255), nullable=False),
        sa.Column("bic", sa.String(9), nullable=False),
        sa.Column("account", sa.String(20), nullable=False),
        sa.Column("corr_account", sa.String(20), nullable=False),
        sa.Column("signer_position", sa.String(255), nullable=False),
        sa.Column("signer_name", sa.String(255), nullable=False),
        sa.Column("signer_genitive", sa.String(500), nullable=False),
        sa.Column("signer_basis", sa.String(255), nullable=False),
    )

    op.create_table(
        "blitz_order_individuals",
        sa.Column(
            "order_id",
            sa.Integer(),
            sa.ForeignKey("blitz_orders.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("passport_number", sa.String(11), nullable=False),
        sa.Column("passport_issued_by", sa.String(500), nullable=False),
        sa.Column("passport_issued_at", sa.Date(), nullable=False),
        sa.Column("address", sa.String(500), nullable=False),
    )

    op.create_table(
        "blitz_remarks",
        sa.Column("id", sa.Integer(), primary_key=True),
        order_reference(),
        sa.Column("text", sa.Text(), nullable=True),
        sa.Column("response_text", sa.Text(), nullable=True),
        created_at(),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_blitz_remarks_order_id", "blitz_remarks", ["order_id"])

    op.create_table(
        "blitz_documents",
        sa.Column("id", sa.Integer(), primary_key=True),
        order_reference(),
        sa.Column(
            "remark_id",
            sa.Integer(),
            sa.ForeignKey("blitz_remarks.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "uploaded_by",
            sa.Integer(),
            sa.ForeignKey("accounts.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("kind", sa.String(24), nullable=False),
        sa.Column("item_number", sa.SmallInteger(), nullable=True),
        sa.Column("path", sa.String(500), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("size", sa.Integer(), nullable=False),
        created_at(),
    )
    op.create_index("ix_blitz_documents_order_id", "blitz_documents", ["order_id"])

    op.create_table(
        "blitz_invoices",
        sa.Column("id", sa.Integer(), primary_key=True),
        order_reference(),
        sa.Column("stage", sa.String(8), nullable=False),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("payer_name", sa.String(255), nullable=False),
        sa.Column("payer_inn", sa.String(12), nullable=False),
        sa.Column("payer_kpp", sa.String(9), nullable=True),
        sa.Column("payer_address", sa.String(500), nullable=False),
        created_at(),
        sa.Column("reported_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("canceled_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_blitz_invoices_order_id", "blitz_invoices", ["order_id"])

    op.create_table(
        "blitz_card_payments",
        sa.Column(
            "payment_id",
            sa.Integer(),
            sa.ForeignKey("payments.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        order_reference(),
        sa.Column("stage", sa.String(8), nullable=False),
    )
    op.create_index("ix_blitz_card_payments_order_id", "blitz_card_payments", ["order_id"])

    op.create_table(
        "blitz_tariffs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("area_code", sa.String(8), nullable=False),
        sa.Column("object_code", sa.String(8), nullable=False),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("area_code", "object_code", name="uq_blitz_tariffs_pair"),
    )

    op.create_table(
        "blitz_price_changes",
        sa.Column("id", sa.Integer(), primary_key=True),
        order_reference(),
        sa.Column("old_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("new_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("reason", sa.Text(), nullable=False),
        created_at(),
    )
    op.create_index("ix_blitz_price_changes_order_id", "blitz_price_changes", ["order_id"])

    op.execute("ALTER TYPE notificationtype ADD VALUE IF NOT EXISTS 'BLITZ_ORDER'")


def downgrade() -> None:
    """Удаляет таблицы. Значение типа уведомления Postgres удалить не даёт — оно остаётся."""

    for table in (
        "blitz_price_changes",
        "blitz_tariffs",
        "blitz_card_payments",
        "blitz_invoices",
        "blitz_documents",
        "blitz_remarks",
        "blitz_order_individuals",
        "blitz_order_companies",
        "blitz_status_changes",
        "blitz_orders",
    ):
        op.drop_table(table)
