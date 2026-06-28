"""refresh pricing plans marketing copy (selling benefits + SEO)

Revision ID: 117
Revises: 116
"""
from collections.abc import Sequence

from alembic import op

revision: str = "117"
down_revision: str | None = "116"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE pricing_plans SET
            description = 'Разовый отклик без подписки — оплата только за нужный заказ',
            features = '["Платите только за один отклик — без абонентской платы", "Прямой контакт с заказчиком, без посредников и комиссий", "Полный доступ к проекту: условия, бюджет и сроки", "Удобно, чтобы протестировать платформу"]'::jsonb
        WHERE kind = 'SINGLE';
        """
    )
    op.execute(
        """
        UPDATE pricing_plans SET
            description = 'Безлимитные отклики на месяц — для стабильного потока заказов',
            features = '["Безлимитные отклики на все заказы месяца", "Доступ ко всем проектам: экспертиза ПБ, проектирование, маркшейдерия", "Прямое общение с заказчиками и быстрые сделки", "Откликайтесь первыми на свежие тендеры", "Окупается уже с одного-двух заказов"]'::jsonb
        WHERE kind = 'MONTHLY';
        """
    )
    op.execute(
        """
        UPDATE pricing_plans SET
            description = 'Год безлимитных откликов и выгода более 50% — для постоянной загрузки',
            features = '["Безлимитные отклики на весь год", "Экономия более 50% против помесячной оплаты", "Все возможности подписки без ограничений", "Приоритетный доступ к новым заказам", "Фиксируете цену — не зависите от роста тарифов"]'::jsonb
        WHERE kind = 'YEARLY';
        """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE pricing_plans SET
            description = 'Попробуйте платформу без подписки',
            features = '["Оплата только за отклик", "Доступ к выбранному проекту", "Прямой контакт с заказчиком"]'::jsonb
        WHERE kind = 'SINGLE';
        """
    )
    op.execute(
        """
        UPDATE pricing_plans SET
            description = 'Оптимально для регулярной работы',
            features = '["Неограниченные отклики", "Доступ ко всем проектам", "Прямое общение с заказчиком"]'::jsonb
        WHERE kind = 'MONTHLY';
        """
    )
    op.execute(
        """
        UPDATE pricing_plans SET
            description = 'Лучший выбор для постоянного потока заказов',
            features = '["Все возможности подписки", "Экономия более 50%", "Долгосрочный доступ к заказам"]'::jsonb
        WHERE kind = 'YEARLY';
        """
    )
