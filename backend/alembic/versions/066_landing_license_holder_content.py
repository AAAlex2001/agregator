"""Добавить роль license_holder в landing_steps + LH-блок в pricing-content + дефолтные тексты.

Идемпотентна: ALTER TYPE ... ADD VALUE IF NOT EXISTS, ADD COLUMN IF NOT EXISTS,
ON CONFLICT DO NOTHING для seed-данных.

Revision ID: 066
Revises: 065
"""
import json
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "066"
down_revision: Union[str, None] = "065"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


HOW_IT_WORKS_LH = [
    {
        "position": 1,
        "title": "Подтвердите лицензию ЭПБ ОПО",
        "description": (
            "Загрузите номер лицензии Ростехнадзора и отметьте объекты экспертизы — "
            "КЛ, ТП, ЗС, ТУ, Д, ОБ"
        ),
        "icon": "/icons/diploma.svg",
    },
    {
        "position": 2,
        "title": "Опубликуйте предложение",
        "description": (
            "Укажите условия предоставления лицензии: процент от суммы заказа, "
            "фиксированная сумма или договорная цена"
        ),
        "icon": "/icons/quick.svg",
    },
    {
        "position": 3,
        "title": "Получайте заявки от экспертов",
        "description": (
            "Эксперты увидят вашу карточку в каталоге и обратятся с предложением "
            "о сотрудничестве по конкретному заказу"
        ),
        "icon": "/icons/search.svg",
    },
    {
        "position": 4,
        "title": "Договаривайтесь напрямую",
        "description": (
            "Обсудите детали в чате, согласуйте условия и подпишите договор о "
            "предоставлении лицензии"
        ),
        "icon": "/icons/comment.svg",
    },
]

KEY_ADVANTAGES_LH = [
    {
        "position": 1,
        "title": "Монетизация лицензии",
        "description": (
            "Превратите неиспользуемую лицензию в источник стабильного дохода — "
            "получайте процент с заказов, в которых эксперты используют вашу аттестацию"
        ),
        "sub_description": "",
        "icon": "/icons/diploma.svg",
    },
    {
        "position": 2,
        "title": "Прямой контакт с экспертами",
        "description": (
            "Без посредников и комиссий — аттестованные эксперты обращаются к вам "
            "напрямую с конкретными заказами"
        ),
        "sub_description": "",
        "icon": "/icons/comment.svg",
    },
    {
        "position": 3,
        "title": "Гибкие условия предоставления",
        "description": (
            "Сами выбираете формат сотрудничества: процент от суммы, фиксированная "
            "оплата за объект или договорная цена под каждый случай"
        ),
        "sub_description": "",
        "icon": "/icons/quick.svg",
    },
    {
        "position": 4,
        "title": "Прозрачность и безопасность",
        "description": (
            "Платформа проверяет аттестации экспертов и реквизиты компаний-заказчиков, "
            "а вся переписка по сделке хранится в чате"
        ),
        "sub_description": "",
        "icon": "/icons/search.svg",
    },
]

PRICING_LH_FEATURES = [
    "Неограниченное число обращений от экспертов",
    "Прямой контакт без посредников и комиссий платформы",
    "Свободные условия сделки: процент / фиксированная сумма / договорная",
    "Карточка лицензиата в общем каталоге держателей лицензий",
]


def upgrade() -> None:
    # 1. Расширяем enum landingsteprole (ALTER TYPE ... ADD VALUE требует autocommit).
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE landingsteprole ADD VALUE IF NOT EXISTS 'license_holder'")

    # 2. Добавляем поля license_holder_* в landing_pricing_content.
    op.execute(
        "ALTER TABLE landing_pricing_content "
        "ADD COLUMN IF NOT EXISTS license_holder_title TEXT NOT NULL DEFAULT ''"
    )
    op.execute(
        "ALTER TABLE landing_pricing_content "
        "ADD COLUMN IF NOT EXISTS license_holder_subtitle TEXT NOT NULL DEFAULT ''"
    )
    op.execute(
        "ALTER TABLE landing_pricing_content "
        "ADD COLUMN IF NOT EXISTS license_holder_headline TEXT NOT NULL DEFAULT ''"
    )
    op.execute(
        "ALTER TABLE landing_pricing_content "
        "ADD COLUMN IF NOT EXISTS license_holder_features JSONB NOT NULL DEFAULT '[]'::jsonb"
    )
    op.execute(
        "ALTER TABLE landing_pricing_content "
        "ADD COLUMN IF NOT EXISTS license_holder_footnote TEXT NOT NULL DEFAULT ''"
    )
    op.execute(
        "ALTER TABLE landing_pricing_content "
        "ADD COLUMN IF NOT EXISTS license_holder_cta_label VARCHAR(200) NOT NULL DEFAULT ''"
    )
    op.execute(
        "ALTER TABLE landing_pricing_content "
        "ADD COLUMN IF NOT EXISTS license_holder_cta_href VARCHAR(500) NOT NULL DEFAULT ''"
    )

    # 3. Заполняем дефолты в pricing-content (только если поля пустые).
    op.execute(
        sa.text(
            """
            UPDATE landing_pricing_content
            SET
              license_holder_title = CASE WHEN license_holder_title = '' THEN :title ELSE license_holder_title END,
              license_holder_subtitle = CASE WHEN license_holder_subtitle = '' THEN :subtitle ELSE license_holder_subtitle END,
              license_holder_headline = CASE WHEN license_holder_headline = '' THEN :headline ELSE license_holder_headline END,
              license_holder_features = CASE
                WHEN license_holder_features = '[]'::jsonb OR license_holder_features IS NULL
                  THEN CAST(:features AS jsonb)
                ELSE license_holder_features
              END,
              license_holder_footnote = CASE WHEN license_holder_footnote = '' THEN :footnote ELSE license_holder_footnote END,
              license_holder_cta_label = CASE WHEN license_holder_cta_label = '' THEN :cta_label ELSE license_holder_cta_label END,
              license_holder_cta_href = CASE WHEN license_holder_cta_href = '' THEN :cta_href ELSE license_holder_cta_href END
            """
        ).bindparams(
            title="Готовы предоставлять лицензию ЭПБ ОПО?",
            subtitle="Подключитесь к платформе и принимайте обращения от аттестованных экспертов",
            headline="Бесплатное размещение для держателей лицензий",
            features=json.dumps(PRICING_LH_FEATURES, ensure_ascii=False),
            footnote="Платформа не берёт комиссию с держателей лицензий — оплата только за услуги, согласованные с экспертом",
            cta_label="Зарегистрироваться",
            cta_href="/register",
        )
    )

    # 4. Сидим landing_steps для license_holder, если их ещё нет.
    seed_steps_block(op, "how_it_works", HOW_IT_WORKS_LH)
    seed_steps_block(op, "key_advantages", KEY_ADVANTAGES_LH)


def seed_steps_block(operation, block: str, items: list[dict]) -> None:
    for item in items:
        operation.execute(
            sa.text(
                """
                INSERT INTO landing_steps
                  (block, role, position, title, description, sub_description, icon)
                SELECT :block, 'license_holder', :position, :title, :description, :sub_description, :icon
                WHERE NOT EXISTS (
                  SELECT 1 FROM landing_steps
                  WHERE block = :block AND role = 'license_holder' AND position = :position
                )
                """
            ).bindparams(
                block=block,
                position=item["position"],
                title=item["title"],
                description=item["description"],
                sub_description=item.get("sub_description", ""),
                icon=item["icon"],
            )
        )


def downgrade() -> None:
    op.execute("DELETE FROM landing_steps WHERE role = 'license_holder'")
    op.execute("ALTER TABLE landing_pricing_content DROP COLUMN IF EXISTS license_holder_cta_href")
    op.execute("ALTER TABLE landing_pricing_content DROP COLUMN IF EXISTS license_holder_cta_label")
    op.execute("ALTER TABLE landing_pricing_content DROP COLUMN IF EXISTS license_holder_footnote")
    op.execute("ALTER TABLE landing_pricing_content DROP COLUMN IF EXISTS license_holder_features")
    op.execute("ALTER TABLE landing_pricing_content DROP COLUMN IF EXISTS license_holder_headline")
    op.execute("ALTER TABLE landing_pricing_content DROP COLUMN IF EXISTS license_holder_subtitle")
    op.execute("ALTER TABLE landing_pricing_content DROP COLUMN IF EXISTS license_holder_title")
    # ALTER TYPE ... DROP VALUE не поддерживается в Postgres — оставляем enum-значение.
