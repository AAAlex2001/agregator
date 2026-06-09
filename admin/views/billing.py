"Админ-вьюшки финансовой части: платежи YooKassa, тарифы и подписки пользователей."

from sqladmin import ModelView

from models import Payment, PricingPlan, UserSubscription


class PaymentAdmin(ModelView, model=Payment):
    "Платежи YooKassa: сумма, статус, тип (подписка/отклик), привязка к пользователю."

    name = "Платёж"
    name_plural = "Платежи"
    icon = "fa-solid fa-credit-card"

    can_delete = False
    can_edit = False

    column_list = [
        Payment.id, Payment.user, Payment.amount,
        Payment.payment_type, Payment.status,
        Payment.yookassa_id, Payment.created_at,
    ]
    column_searchable_list = [Payment.yookassa_id, Payment.description]
    column_sortable_list = [Payment.id, Payment.amount, Payment.status, Payment.payment_type, Payment.created_at]
    column_default_sort = (Payment.id, True)

    column_details_list = [
        Payment.id, Payment.user, Payment.yookassa_id,
        Payment.amount, Payment.payment_type, Payment.status,
        Payment.description, Payment.created_at, Payment.updated_at,
    ]

    form_columns = [
        Payment.user, Payment.yookassa_id, Payment.amount,
        Payment.payment_type, Payment.status, Payment.description,
    ]

    column_formatters = {
        Payment.amount: lambda m, a: f"{m.amount / 100:.2f} ₽" if m.amount is not None else "0.00 ₽",
        Payment.status: lambda m, a: str(m.status),
        Payment.payment_type: lambda m, a: str(m.payment_type),
    }
    column_formatters_detail = {
        Payment.amount: lambda m, a: f"{m.amount / 100:.2f} ₽" if m.amount is not None else "0.00 ₽",
        Payment.status: lambda m, a: str(m.status),
        Payment.payment_type: lambda m, a: str(m.payment_type),
    }

    column_labels = {
        Payment.id: "ID",
        Payment.user: "Пользователь",
        Payment.yookassa_id: "YooKassa ID",
        Payment.amount: "Сумма",
        Payment.payment_type: "Тип",
        Payment.status: "Статус",
        Payment.description: "Описание",
        Payment.created_at: "Создан",
        Payment.updated_at: "Обновлён",
    }


class PricingPlanAdmin(ModelView, model=PricingPlan):
    "Каталог тарифов: цены, длительности, список фич, флаги активности и выделения."

    name = "Тариф"
    name_plural = "Тарифы"
    icon = "fa-solid fa-tags"
    category = "Тарифы"

    can_delete = False
    can_edit = False

    column_list = [
        PricingPlan.id, PricingPlan.kind, PricingPlan.name,
        PricingPlan.price_kopecks, PricingPlan.period_label, PricingPlan.duration_days,
        PricingPlan.badge, PricingPlan.highlighted,
        PricingPlan.is_active, PricingPlan.sort_order,
    ]
    column_sortable_list = [PricingPlan.sort_order, PricingPlan.kind, PricingPlan.price_kopecks, PricingPlan.is_active]
    column_default_sort = (PricingPlan.sort_order, False)

    column_details_list = [
        PricingPlan.id, PricingPlan.kind, PricingPlan.name,
        PricingPlan.badge, PricingPlan.price_kopecks, PricingPlan.period_label,
        PricingPlan.duration_days,
        PricingPlan.description, PricingPlan.cta_label, PricingPlan.features,
        PricingPlan.highlighted, PricingPlan.is_active, PricingPlan.sort_order,
        PricingPlan.created_at, PricingPlan.updated_at,
    ]

    form_columns = [
        PricingPlan.kind, PricingPlan.name, PricingPlan.badge,
        PricingPlan.price_kopecks, PricingPlan.period_label, PricingPlan.duration_days,
        PricingPlan.description, PricingPlan.cta_label, PricingPlan.features,
        PricingPlan.highlighted, PricingPlan.is_active, PricingPlan.sort_order,
    ]

    column_formatters = {
        PricingPlan.price_kopecks: lambda m, a: f"{m.price_kopecks / 100:,.2f} ₽".replace(",", " "),
        PricingPlan.kind: lambda m, a: str(m.kind),
    }
    column_formatters_detail = {
        PricingPlan.price_kopecks: lambda m, a: f"{m.price_kopecks / 100:,.2f} ₽".replace(",", " "),
        PricingPlan.kind: lambda m, a: str(m.kind),
    }

    column_labels = {
        PricingPlan.id: "ID",
        PricingPlan.kind: "Тип",
        PricingPlan.name: "Название",
        PricingPlan.badge: "Бейдж",
        PricingPlan.price_kopecks: "Цена (в копейках)",
        PricingPlan.period_label: "Подпись периода",
        PricingPlan.duration_days: "Срок действия (дней, пусто для разового)",
        PricingPlan.description: "Описание",
        PricingPlan.cta_label: "Текст кнопки",
        PricingPlan.features: "Список фич (JSON-массив строк)",
        PricingPlan.highlighted: "Выделенный (градиент)",
        PricingPlan.is_active: "Активен",
        PricingPlan.sort_order: "Порядок",
        PricingPlan.created_at: "Создан",
        PricingPlan.updated_at: "Обновлён",
    }


class UserSubscriptionAdmin(ModelView, model=UserSubscription):
    "Подписки пользователей: статусы, активация, истечение, остаток откликов, привязка платежа."

    name = "Подписка"
    name_plural = "Подписки пользователей"
    icon = "fa-solid fa-id-card"
    category = "Тарифы"

    can_delete = False
    can_edit = False

    column_list = [
        UserSubscription.id, UserSubscription.user, UserSubscription.plan,
        UserSubscription.kind, UserSubscription.status,
        UserSubscription.activated_at, UserSubscription.expires_at,
        UserSubscription.responses_remaining,
    ]
    column_sortable_list = [
        UserSubscription.id, UserSubscription.status, UserSubscription.activated_at, UserSubscription.expires_at,
    ]
    column_default_sort = (UserSubscription.id, True)

    column_details_list = [
        UserSubscription.id, UserSubscription.user, UserSubscription.plan,
        UserSubscription.kind, UserSubscription.status,
        UserSubscription.activated_at, UserSubscription.expires_at,
        UserSubscription.responses_remaining, UserSubscription.payment,
        UserSubscription.created_at, UserSubscription.updated_at,
    ]

    form_columns = [
        UserSubscription.user, UserSubscription.plan,
        UserSubscription.kind, UserSubscription.status,
        UserSubscription.activated_at, UserSubscription.expires_at,
        UserSubscription.responses_remaining, UserSubscription.payment,
    ]

    column_formatters = {
        UserSubscription.kind: lambda m, a: str(m.kind),
        UserSubscription.status: lambda m, a: str(m.status),
    }
    column_formatters_detail = {
        UserSubscription.kind: lambda m, a: str(m.kind),
        UserSubscription.status: lambda m, a: str(m.status),
    }

    column_labels = {
        UserSubscription.id: "ID",
        UserSubscription.user: "Пользователь",
        UserSubscription.plan: "Тариф",
        UserSubscription.kind: "Тип",
        UserSubscription.status: "Статус",
        UserSubscription.activated_at: "Активирована",
        UserSubscription.expires_at: "Истекает",
        UserSubscription.responses_remaining: "Остаток откликов",
        UserSubscription.payment: "Платёж",
        UserSubscription.created_at: "Создана",
        UserSubscription.updated_at: "Обновлена",
    }
