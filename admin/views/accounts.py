"Админ-вьюшки раздела учётных записей: аккаунты, сессии, коды восстановления пароля."

from typing import Any

from sqladmin import ModelView
from sqlalchemy import inspect as sa_inspect
from sqlalchemy.orm import selectinload
from starlette.requests import Request

from db import SessionLocal
from helpers.company import format_company_data
from integrations.dadata import fetch_dadata_party_by_inn
from models import (
    Account,
    PasswordResetCode,
    PricingPlan,
    Session,
    SubscriptionStatus,
    UserSubscription,
)


class AccountAdmin(ModelView, model=Account):
    "Учётные записи: общие данные входа, привязка карточки DaData по ИНН, выдача подписок."

    name = "Учётная запись"
    name_plural = "Учётные записи"
    icon = "fa-solid fa-users"
    details_template = "account_detail.html"
    edit_template = "account_edit.html"

    column_list = [
        Account.id, Account.role, Account.inn, Account.email, Account.phone,
        Account.telegram_id, Account.first_name, Account.last_name,
        Account.is_active, Account.created_at,
    ]
    column_searchable_list = [
        Account.inn, Account.email, Account.phone, Account.telegram_id,
        Account.first_name, Account.last_name,
    ]
    column_sortable_list = [Account.id, Account.role, Account.created_at]
    column_default_sort = (Account.id, True)

    column_details_list = [
        Account.id, Account.public_id, Account.role, Account.is_active,
        Account.first_name, Account.last_name, Account.inn,
        Account.email, Account.email_verified, Account.phone, Account.telegram_id,
        Account.email_on_chat_message, Account.email_on_new_blog_post,
        Account.notify_telegram_enabled, Account.notifications_introduced,
        Account.notification_unread_count,
        Account.created_at, Account.updated_at,
        Account.customer_profile, Account.expert_profile, Account.license_holder_profile,
        Account.orders, Account.assigned_orders, Account.responses,
        Account.payments, Account.subscriptions,
        Account.customer_reviews, Account.expert_reviews,
    ]

    form_columns = [
        Account.role, Account.is_active, Account.first_name, Account.last_name,
        Account.inn, Account.email, Account.email_verified, Account.phone,
        Account.email_on_chat_message, Account.email_on_new_blog_post,
        Account.notify_telegram_enabled, Account.notifications_introduced,
    ]

    column_formatters = {
        Account.role: lambda m, a: str(m.role),
    }
    column_formatters_detail = {
        Account.role: lambda m, a: str(m.role),
    }

    column_labels = {
        Account.id: "ID",
        Account.public_id: "Публичный ID",
        Account.role: "Роль",
        Account.is_active: "Активен",
        Account.first_name: "Имя",
        Account.last_name: "Фамилия",
        Account.inn: "ИНН",
        Account.email: "Email",
        Account.email_verified: "Email подтверждён",
        Account.phone: "Телефон",
        Account.telegram_id: "Telegram ID",
        Account.email_on_chat_message: "Письмо: сообщение в чате",
        Account.email_on_new_blog_post: "Письмо: новая статья в блоге",
        Account.notify_telegram_enabled: "Уведомления в Telegram",
        Account.notifications_introduced: "Прочитал модалку про уведомления",
        Account.notification_unread_count: "Непрочитанных уведомлений",
        Account.created_at: "Создан",
        Account.updated_at: "Обновлён",
        Account.customer_profile: "Профиль заказчика",
        Account.expert_profile: "Профиль исполнителя",
        Account.license_holder_profile: "Профиль держателя документов",
        Account.orders: "Заказы (заказчик)",
        Account.assigned_orders: "Заказы (исполнитель)",
        Account.responses: "Отклики",
        Account.payments: "Платежи",
        Account.subscriptions: "Подписки",
        Account.customer_reviews: "Отзывы (заказчик)",
        Account.expert_reviews: "Отзывы (исполнитель)",
    }

    def render_company_data(self, company_data: Any) -> Any:
        "Рендерит карточку DaData для шаблона деталей аккаунта."
        return format_company_data(company_data)

    async def on_model_change(self, data: dict[str, Any], model: Account, is_created: bool, request: Request) -> None:
        "Если ИНН задан и изменился — подтягивает свежую карточку компании из DaData."
        new_inn = (data.get("inn") or "").strip() or None
        if not new_inn:
            model.company_data = None
            return

        if is_created:
            inn_changed = True
        else:
            history = sa_inspect(model).attrs.inn.history
            inn_changed = history.has_changes()

        if not inn_changed and model.company_data:
            return

        suggestion = await fetch_dadata_party_by_inn(new_inn)
        if suggestion is not None:
            model.company_data = suggestion

    def active_pricing_plans(self) -> list[PricingPlan]:
        "Возвращает активные тарифы для рендера выпадающего списка выдачи подписки."
        with SessionLocal() as db:
            return (
                db.query(PricingPlan)
                .filter(PricingPlan.is_active.is_(True))
                .order_by(PricingPlan.sort_order.asc(), PricingPlan.id.asc())
                .all()
            )

    def current_active_subscription(self, account_id: int) -> UserSubscription | None:
        "Текущая активная подписка аккаунта (последняя по дате активации)."
        with SessionLocal() as db:
            return (
                db.query(UserSubscription)
                .options(selectinload(UserSubscription.plan))
                .filter(
                    UserSubscription.user_id == account_id,
                    UserSubscription.status == SubscriptionStatus.ACTIVE,
                )
                .order_by(UserSubscription.activated_at.desc(), UserSubscription.id.desc())
                .first()
            )


class SessionAdmin(ModelView, model=Session):
    "Активные сессии пользователей (cookie/redis-ключи): просмотр и ручная инвалидация."

    name = "Сессия"
    name_plural = "Сессии"
    icon = "fa-solid fa-key"

    column_list = [
        Session.id, Session.user_id,
        Session.created_at, Session.expires_at,
    ]
    column_sortable_list = [Session.id, Session.created_at, Session.expires_at]
    column_default_sort = (Session.id, True)

    column_details_list = [
        Session.id, Session.user_id,
        Session.created_at, Session.expires_at, Session.max_expires_at,
    ]

    form_columns = [Session.user_id, Session.expires_at, Session.max_expires_at]

    column_labels = {
        Session.id: "ID",
        Session.user_id: "ID аккаунта",
        Session.created_at: "Создана",
        Session.expires_at: "Истекает",
        Session.max_expires_at: "Макс. срок",
    }


class PasswordResetCodeAdmin(ModelView, model=PasswordResetCode):
    "Коды восстановления пароля: журнал отправленных и использованных кодов."

    name = "Код сброса пароля"
    name_plural = "Коды сброса пароля"
    icon = "fa-solid fa-unlock"

    column_list = [
        PasswordResetCode.id, PasswordResetCode.account,
        PasswordResetCode.code, PasswordResetCode.is_used,
        PasswordResetCode.created_at, PasswordResetCode.expires_at,
    ]
    column_sortable_list = [PasswordResetCode.id, PasswordResetCode.is_used, PasswordResetCode.created_at]
    column_default_sort = (PasswordResetCode.id, True)

    column_labels = {
        PasswordResetCode.id: "ID",
        PasswordResetCode.account: "Аккаунт",
        PasswordResetCode.code: "Код",
        PasswordResetCode.is_used: "Использован",
        PasswordResetCode.created_at: "Создан",
        PasswordResetCode.expires_at: "Истекает",
    }
