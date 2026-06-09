"Админ-вьюшки раздела пользователей: профили, сессии, коды восстановления пароля."

from typing import Any

from sqladmin import ModelView
from sqlalchemy import inspect as sa_inspect
from sqlalchemy.orm import selectinload
from starlette.requests import Request

from db import SessionLocal
from helpers.company import format_company_data
from integrations.dadata import fetch_dadata_party_by_inn
from models import (
    PasswordResetCode,
    PricingPlan,
    Session,
    SubscriptionStatus,
    User,
    UserSubscription,
)


class UserAdmin(ModelView, model=User):
    "Профили пользователей: редактирование, привязка карточки DaData по ИНН, выдача подписок."

    name = "Пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-users"
    details_template = "user_detail.html"
    edit_template = "user_edit.html"

    column_list = [
        User.id, User.role, User.inn, User.email, User.phone,
        User.first_name, User.last_name,
        User.rating, User.review_count, User.is_active, User.created_at,
    ]
    column_searchable_list = [User.inn, User.email, User.phone, User.first_name, User.last_name]
    column_sortable_list = [User.id, User.role, User.rating, User.created_at]
    column_default_sort = (User.id, True)

    column_details_list = [
        User.id, User.role, User.is_active,
        User.first_name, User.last_name, User.inn,
        User.email, User.email_verified, User.phone,
        User.rating, User.review_count,
        User.email_on_response_created, User.email_on_response_updated,
        User.email_on_expert_rejected, User.email_on_order_updated,
        User.email_on_bidding_finished, User.email_on_chat_message,
        User.email_on_question_asked, User.email_on_question_answered,
        User.notify_order_types,
        User.notifications_introduced,
        User.created_at, User.updated_at,
        User.orders, User.assigned_orders, User.responses,
        User.payments, User.subscriptions, User.customer_reviews, User.expert_reviews,
    ]

    form_columns = [
        User.role, User.is_active, User.first_name, User.last_name,
        User.inn, User.email, User.email_verified, User.phone,
        User.rating, User.review_count,
        User.email_on_response_created, User.email_on_response_updated,
        User.email_on_expert_rejected, User.email_on_order_updated,
        User.email_on_bidding_finished, User.email_on_chat_message,
        User.email_on_question_asked, User.email_on_question_answered,
        User.notify_order_types,
        User.notifications_introduced,
    ]

    column_formatters = {
        User.role: lambda m, a: str(m.role),
    }
    column_formatters_detail = {
        User.role: lambda m, a: str(m.role),
    }

    column_labels = {
        User.id: "ID",
        User.role: "Роль",
        User.is_active: "Активен",
        User.first_name: "Имя",
        User.last_name: "Фамилия",
        User.inn: "ИНН",
        User.email: "Email",
        User.email_verified: "Email подтверждён",
        User.phone: "Телефон",
        User.password: "Пароль (хеш)",
        User.company_data: "Данные компании (DaData)",
        User.rating: "Рейтинг",
        User.review_count: "Кол-во отзывов",
        User.email_on_response_created: "Письмо: новый отклик",
        User.email_on_response_updated: "Письмо: отклик изменён",
        User.email_on_expert_rejected: "Письмо: отклик отклонён",
        User.email_on_order_updated: "Письмо: заказ изменён",
        User.email_on_bidding_finished: "Письмо: торги завершены",
        User.email_on_chat_message: "Письмо: сообщение в чате",
        User.email_on_question_asked: "Письмо: новый вопрос по заказу",
        User.email_on_question_answered: "Письмо: ответ на вопрос",
        User.notify_order_types: "Коды бейджей для рассылки о новых заказах",
        User.notifications_introduced: "Прочитал модалку про уведомления",
        User.created_at: "Создан",
        User.updated_at: "Обновлён",
        User.orders: "Заказы (заказчик)",
        User.assigned_orders: "Заказы (эксперт)",
        User.responses: "Отклики",
        User.payments: "Платежи",
        User.subscriptions: "Подписки",
        User.customer_reviews: "Отзывы (заказчик)",
        User.expert_reviews: "Отзывы (эксперт)",
    }

    def render_company_data(self, company_data: Any) -> Any:
        "Рендерит карточку DaData для шаблона деталей пользователя."
        return format_company_data(company_data)

    async def on_model_change(self, data: dict[str, Any], model: User, is_created: bool, request: Request) -> None:
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

    def current_active_subscription(self, user_id: int) -> UserSubscription | None:
        "Текущая активная подписка пользователя (последняя по дате активации)."
        with SessionLocal() as db:
            return (
                db.query(UserSubscription)
                .options(selectinload(UserSubscription.plan))
                .filter(
                    UserSubscription.user_id == user_id,
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
        Session.user_id: "ID пользователя",
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
        PasswordResetCode.id, PasswordResetCode.user,
        PasswordResetCode.code, PasswordResetCode.is_used,
        PasswordResetCode.created_at, PasswordResetCode.expires_at,
    ]
    column_sortable_list = [PasswordResetCode.id, PasswordResetCode.is_used, PasswordResetCode.created_at]
    column_default_sort = (PasswordResetCode.id, True)

    column_labels = {
        PasswordResetCode.id: "ID",
        PasswordResetCode.user: "Пользователь",
        PasswordResetCode.code: "Код",
        PasswordResetCode.is_used: "Использован",
        PasswordResetCode.created_at: "Создан",
        PasswordResetCode.expires_at: "Истекает",
    }
