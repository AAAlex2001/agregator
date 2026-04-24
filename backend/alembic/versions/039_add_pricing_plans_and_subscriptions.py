"""add pricing_plans and user_subscriptions

Revision ID: 039
Revises: 038

Тарифы + активные подписки. Сидим 3 тарифа: SINGLE (100 ₽ / отклик),
MONTHLY (1000 ₽ / 30 дней), YEARLY (5000 ₽ / 365 дней).
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


revision: str = "039"
down_revision: Union[str, None] = "038"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        DO $$ BEGIN
            CREATE TYPE subscriptionkind AS ENUM ('SINGLE', 'MONTHLY', 'YEARLY');
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END $$;
        """
    )
    op.execute(
        """
        DO $$ BEGIN
            CREATE TYPE subscriptionstatus AS ENUM ('ACTIVE', 'EXPIRED', 'USED');
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END $$;
        """
    )

    kind_enum = postgresql.ENUM(
        "SINGLE", "MONTHLY", "YEARLY",
        name="subscriptionkind",
        create_type=False,
    )
    status_enum = postgresql.ENUM(
        "ACTIVE", "EXPIRED", "USED",
        name="subscriptionstatus",
        create_type=False,
    )

    op.create_table(
        "pricing_plans",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("kind", kind_enum, nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("badge", sa.String(length=50), nullable=True),
        sa.Column("price_kopecks", sa.BigInteger(), nullable=False),
        sa.Column("period_label", sa.String(length=50), nullable=False),
        sa.Column("duration_days", sa.Integer(), nullable=True),
        sa.Column("description", sa.String(length=500), nullable=False, server_default=""),
        sa.Column("cta_label", sa.String(length=100), nullable=False),
        sa.Column("features", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("highlighted", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.UniqueConstraint("kind", name="uq_pricing_plans_kind"),
    )

    op.create_table(
        "user_subscriptions",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("plan_id", sa.Integer(), sa.ForeignKey("pricing_plans.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("kind", kind_enum, nullable=False),
        sa.Column("status", status_enum, nullable=False, server_default="ACTIVE", index=True),
        sa.Column("activated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("responses_remaining", sa.Integer(), nullable=True),
        sa.Column("payment_id", sa.Integer(), sa.ForeignKey("payments.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index(
        "ix_user_subscriptions_user_status",
        "user_subscriptions",
        ["user_id", "status"],
    )

    op.execute(
        """
        INSERT INTO pricing_plans
            (kind, name, badge, price_kopecks, period_label, duration_days, description, cta_label, features, highlighted, sort_order)
        VALUES
            (
                'SINGLE',
                'Разовый доступ',
                NULL,
                10000,
                '/отклик',
                NULL,
                'Попробуйте платформу без подписки',
                'Откликнуться за 100 ₽',
                '["Оплата только за отклик", "Доступ к выбранному проекту", "Прямой контакт с заказчиком"]'::jsonb,
                false,
                10
            ),
            (
                'MONTHLY',
                'Подписка',
                'Популярный',
                100000,
                '/месяц',
                30,
                'Оптимально для регулярной работы',
                'Начать откликаться',
                '["Неограниченные отклики", "Доступ ко всем проектам", "Прямое общение с заказчиком"]'::jsonb,
                true,
                20
            ),
            (
                'YEARLY',
                'Годовая подписка',
                'Выгода',
                500000,
                '/год',
                365,
                'Лучший выбор для постоянного потока заказов',
                'Получить доступ на год',
                '["Все возможности подписки", "Экономия более 50%", "Долгосрочный доступ к заказам"]'::jsonb,
                false,
                30
            );
        """
    )


def downgrade() -> None:
    op.drop_index("ix_user_subscriptions_user_status", table_name="user_subscriptions")
    op.drop_table("user_subscriptions")
    op.drop_table("pricing_plans")
    op.execute("DROP TYPE IF EXISTS subscriptionstatus")
    op.execute("DROP TYPE IF EXISTS subscriptionkind")
