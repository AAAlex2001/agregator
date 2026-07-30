"Админ-вьюшки разделов лендинга: hero, шаги, отзывы, FAQ, тарифы и прочее редактируемое содержимое."

from sqladmin import ModelView

from forms import BulletListField
from models import (
    LandingAdvantage,
    LandingFaq,
    LandingHero,
    LandingIndustry,
    LandingOrderExample,
    LandingPricingContent,
    LandingReview,
    LandingSectionHeader,
    LandingStep,
)


class LandingHeroAdmin(ModelView, model=LandingHero):
    "Главный экран лендинга: заголовок, маркированные буллеты, подзаголовок и CTA-кнопка."

    name = "Hero (шапка лендинга)"
    name_plural = "Лендинг · Hero"
    icon = "fa-solid fa-flag"
    category = "Лендинг"

    can_create = True
    can_delete = False

    column_list = [LandingHero.id, LandingHero.title, LandingHero.button_text]
    form_columns = [
        LandingHero.title,
        LandingHero.bullets,
        LandingHero.subtitle,
        LandingHero.button_text,
    ]
    form_overrides = {"bullets": BulletListField}
    column_labels = {
        LandingHero.id: "ID",
        LandingHero.title: "Заголовок",
        LandingHero.bullets: "Список под заголовком",
        LandingHero.subtitle: "Подзаголовок",
        LandingHero.button_text: "Текст кнопки",
    }


class LandingSectionHeaderAdmin(ModelView, model=LandingSectionHeader):
    "Шапки секций лендинга (заголовок + подзаголовок) с привязкой к ключу блока."

    name = "Шапка секции"
    name_plural = "Лендинг · Шапки секций"
    icon = "fa-solid fa-heading"
    category = "Лендинг"

    column_list = [LandingSectionHeader.block_key, LandingSectionHeader.title]
    form_columns = [LandingSectionHeader.block_key, LandingSectionHeader.title, LandingSectionHeader.subtitle]
    column_labels = {
        LandingSectionHeader.block_key: "Ключ блока",
        LandingSectionHeader.title: "Заголовок",
        LandingSectionHeader.subtitle: "Подзаголовок",
    }


class LandingStepAdmin(ModelView, model=LandingStep):
    "Шаги в блоках лендинга «как работает» / «преимущества» по ролям заказчик/исполнитель."

    name = "Шаг"
    name_plural = "Лендинг · Шаги (как работает / преимущества)"
    icon = "fa-solid fa-list-ol"
    category = "Лендинг"

    column_list = [
        LandingStep.id, LandingStep.block, LandingStep.role,
        LandingStep.position, LandingStep.title,
    ]
    column_sortable_list = [LandingStep.block, LandingStep.role, LandingStep.position]
    column_default_sort = [(LandingStep.block, False), (LandingStep.role, False), (LandingStep.position, False)]
    form_columns = [
        LandingStep.block, LandingStep.role, LandingStep.position,
        LandingStep.title, LandingStep.description, LandingStep.sub_description, LandingStep.icon,
    ]
    column_labels = {
        LandingStep.block: "Блок",
        LandingStep.role: "Роль",
        LandingStep.position: "Порядок",
        LandingStep.title: "Заголовок",
        LandingStep.description: "Описание",
        LandingStep.sub_description: "Доп. текст",
        LandingStep.icon: "Иконка (путь)",
    }


class LandingOrderExampleAdmin(ModelView, model=LandingOrderExample):
    "Примеры заказов на лендинге: заголовок, цена и описание для карусели на главной."

    name = "Пример заказа"
    name_plural = "Лендинг · Примеры заказов"
    icon = "fa-solid fa-briefcase"
    category = "Лендинг"

    column_list = [
        LandingOrderExample.position, LandingOrderExample.title,
        LandingOrderExample.price,
    ]
    column_sortable_list = [LandingOrderExample.position]
    column_default_sort = (LandingOrderExample.position, False)
    form_columns = [
        LandingOrderExample.position, LandingOrderExample.title,
        LandingOrderExample.price, LandingOrderExample.description,
    ]
    column_labels = {
        LandingOrderExample.position: "Порядок",
        LandingOrderExample.title: "Заголовок",
        LandingOrderExample.price: "Цена",
        LandingOrderExample.description: "Описание",
    }


class LandingAdvantageAdmin(ModelView, model=LandingAdvantage):
    "Карточки преимуществ платформы: иконка/фото + текст для секции главной."

    name = "Преимущество"
    name_plural = "Лендинг · Преимущества"
    icon = "fa-solid fa-award"
    category = "Лендинг"

    column_list = [LandingAdvantage.position, LandingAdvantage.title, LandingAdvantage.icon_key]
    column_sortable_list = [LandingAdvantage.position]
    column_default_sort = (LandingAdvantage.position, False)
    form_columns = [
        LandingAdvantage.position, LandingAdvantage.title,
        LandingAdvantage.description, LandingAdvantage.icon_key, LandingAdvantage.photo,
    ]
    column_labels = {
        LandingAdvantage.position: "Порядок",
        LandingAdvantage.title: "Заголовок",
        LandingAdvantage.description: "Описание",
        LandingAdvantage.icon_key: "Иконка",
        LandingAdvantage.photo: "Фото (путь)",
    }


class LandingIndustryAdmin(ModelView, model=LandingIndustry):
    "Отрасли в одноимённой секции лендинга: название, маркированные пункты и фото."

    name = "Отрасль"
    name_plural = "Лендинг · Отрасли"
    icon = "fa-solid fa-industry"
    category = "Лендинг"

    column_list = [LandingIndustry.position, LandingIndustry.title]
    column_sortable_list = [LandingIndustry.position]
    column_default_sort = (LandingIndustry.position, False)
    form_columns = [
        LandingIndustry.position, LandingIndustry.title,
        LandingIndustry.descriptions, LandingIndustry.photo,
    ]
    column_labels = {
        LandingIndustry.position: "Порядок",
        LandingIndustry.title: "Название",
        LandingIndustry.descriptions: "Пункты (JSON-массив строк)",
        LandingIndustry.photo: "Фото (путь)",
    }


class LandingReviewAdmin(ModelView, model=LandingReview):
    "Отзывы на лендинге: автор, должность, текст; порядок сортировки задаётся вручную."

    name = "Отзыв"
    name_plural = "Лендинг · Отзывы"
    icon = "fa-solid fa-comment"
    category = "Лендинг"

    column_list = [LandingReview.position, LandingReview.reviewer, LandingReview.reviewer_position]
    column_sortable_list = [LandingReview.position]
    column_default_sort = (LandingReview.position, False)
    form_columns = [
        LandingReview.position, LandingReview.reviewer,
        LandingReview.reviewer_position, LandingReview.text,
    ]
    column_labels = {
        LandingReview.position: "Порядок",
        LandingReview.reviewer: "Автор",
        LandingReview.reviewer_position: "Должность",
        LandingReview.text: "Текст отзыва",
    }


class LandingFaqAdmin(ModelView, model=LandingFaq):
    "FAQ-блок лендинга: вопрос и ответ с заданным порядком отображения."

    name = "FAQ"
    name_plural = "Лендинг · FAQ"
    icon = "fa-solid fa-circle-question"
    category = "Лендинг"

    column_list = [LandingFaq.position, LandingFaq.question]
    column_sortable_list = [LandingFaq.position]
    column_default_sort = (LandingFaq.position, False)
    form_columns = [LandingFaq.position, LandingFaq.question, LandingFaq.answer]
    column_labels = {
        LandingFaq.position: "Порядок",
        LandingFaq.question: "Вопрос",
        LandingFaq.answer: "Ответ",
    }


class LandingPricingContentAdmin(ModelView, model=LandingPricingContent):
    "Текстовое сопровождение блока тарифов на лендинге (заголовки/подписи/CTA для трёх ролей)."

    name = "Тарифы (тексты)"
    name_plural = "Лендинг · Тарифы"
    icon = "fa-solid fa-tags"
    category = "Лендинг"

    can_create = False
    can_delete = False

    column_list = [
        LandingPricingContent.id,
        LandingPricingContent.expert_title,
        LandingPricingContent.customer_title,
    ]

    form_columns = [
        LandingPricingContent.expert_title,
        LandingPricingContent.expert_subtitle,
        LandingPricingContent.expert_footnote,
        LandingPricingContent.customer_title,
        LandingPricingContent.customer_subtitle,
        LandingPricingContent.customer_headline,
        LandingPricingContent.customer_features,
        LandingPricingContent.customer_footnote,
        LandingPricingContent.customer_cta_label,
        LandingPricingContent.customer_cta_href,
        LandingPricingContent.license_holder_title,
        LandingPricingContent.license_holder_subtitle,
        LandingPricingContent.license_holder_headline,
        LandingPricingContent.license_holder_features,
        LandingPricingContent.license_holder_footnote,
        LandingPricingContent.license_holder_cta_label,
        LandingPricingContent.license_holder_cta_href,
    ]

    column_labels = {
        LandingPricingContent.id: "ID",
        LandingPricingContent.expert_title: "Исполнитель · Заголовок",
        LandingPricingContent.expert_subtitle: "Исполнитель · Подзаголовок",
        LandingPricingContent.expert_footnote: "Исполнитель · Сноска под карточками",
        LandingPricingContent.customer_title: "Заказчик · Заголовок",
        LandingPricingContent.customer_subtitle: "Заказчик · Подзаголовок",
        LandingPricingContent.customer_headline: "Заказчик · Большой текст по центру",
        LandingPricingContent.customer_features: "Заказчик · Список преимуществ (JSON-массив строк)",
        LandingPricingContent.customer_footnote: "Заказчик · Сноска",
        LandingPricingContent.customer_cta_label: "Заказчик · Текст кнопки",
        LandingPricingContent.customer_cta_href: "Заказчик · Ссылка кнопки",
        LandingPricingContent.license_holder_title: "Держатель разрешительных документов · Заголовок",
        LandingPricingContent.license_holder_subtitle: "Держатель разрешительных документов · Подзаголовок",
        LandingPricingContent.license_holder_headline: "Держатель разрешительных документов · Большой текст по центру",
        LandingPricingContent.license_holder_features: "Держатель разрешительных документов · Список преимуществ (JSON-массив строк)",
        LandingPricingContent.license_holder_footnote: "Держатель разрешительных документов · Сноска",
        LandingPricingContent.license_holder_cta_label: "Держатель разрешительных документов · Текст кнопки",
        LandingPricingContent.license_holder_cta_href: "Держатель разрешительных документов · Ссылка кнопки",
    }
