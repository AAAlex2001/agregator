"""add landing_pricing_content table

Revision ID: 043
Revises: 041

Тексты pricing-секции на лендинге (singleton, редактируется из админки).
Сидим текущими дефолтами, чтобы лендинг не сломался после миграции.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


revision: str = "043"
down_revision: Union[str, None] = "041"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "landing_pricing_content",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("expert_title", sa.Text(), nullable=False, server_default=""),
        sa.Column("expert_subtitle", sa.Text(), nullable=False, server_default=""),
        sa.Column("expert_footnote", sa.Text(), nullable=False, server_default=""),
        sa.Column("customer_title", sa.Text(), nullable=False, server_default=""),
        sa.Column("customer_subtitle", sa.Text(), nullable=False, server_default=""),
        sa.Column("customer_headline", sa.Text(), nullable=False, server_default=""),
        sa.Column("customer_features", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("customer_footnote", sa.Text(), nullable=False, server_default=""),
        sa.Column("customer_cta_label", sa.String(length=200), nullable=False, server_default=""),
        sa.Column("customer_cta_href", sa.String(length=500), nullable=False, server_default=""),
    )

    op.execute(
        """
        INSERT INTO landing_pricing_content
            (expert_title, expert_subtitle, expert_footnote,
             customer_title, customer_subtitle, customer_headline,
             customer_features, customer_footnote, customer_cta_label, customer_cta_href)
        VALUES
            (
                'Готовы откликаться на проекты?',
                'Выберите тариф и начните откликаться на проекты уже сегодня',
                'Заказчики размещают проекты бесплатно — эксперты получают доступ к заказам по тарифу',
                'Готовы разместить заказ?',
                'Публикуйте задачи и получайте отклики от аттестованных экспертов по всей России',
                'Размещение заказов — бесплатно',
                '["Размещение заказов без оплаты", "Десятки откликов от экспертов", "Выбор исполнителя по рейтингу и опыту", "Прямое общение без посредников"]'::jsonb,
                'Заказчики размещают проекты бесплатно — эксперты получают доступ к заказам по тарифу',
                'Разместить заказ',
                '/register'
            );
        """
    )


def downgrade() -> None:
    op.drop_table("landing_pricing_content")
