import os
from markupsafe import Markup
from fastapi import FastAPI
from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models import (
    Base, User, Order, OrderBadge, OrderResponse, Chat, ChatMessage,
    Payment, Review, Session, PasswordResetCode,
)

# --- БД (sync для SQLAdmin) ---
DATABASE_URL = os.getenv("DATABASE_URL", "")
# SQLAdmin работает с sync движком
SYNC_DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

engine = create_engine(SYNC_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)

# --- Авторизация в админке ---
ADMIN_LOGIN = os.getenv("ADMIN_LOGIN", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin")
ADMIN_SECRET = os.getenv("ADMIN_SECRET", "supersecretkey-change-me")


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")
        if username == ADMIN_LOGIN and password == ADMIN_PASSWORD:
            request.session.update({"authenticated": True})
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return request.session.get("authenticated", False)


# --- FastAPI ---
app = FastAPI(title="Ресурс-Плюс Админ-панель")

authentication_backend = AdminAuth(secret_key=ADMIN_SECRET)
admin = Admin(
    app,
    engine,
    authentication_backend=authentication_backend,
    title="Ресурс-Плюс | Админка",
    base_url="/admin",
    templates_dir=os.path.join(os.path.dirname(__file__), "templates"),
)


# ========== УТИЛИТЫ ==========

def format_technical_files(m, a):
    files = getattr(m, "technical_files", None)
    if not files:
        return "—"
    if isinstance(files, list):
        parts = []
        for f in files:
            if isinstance(f, str):
                name = f.rsplit("/", 1)[-1]
                ext = name.rsplit(".", 1)[-1].lower() if "." in name else ""
                if ext in ("jpg", "jpeg", "png", "gif", "webp", "svg"):
                    parts.append(
                        f'<div style="margin:4px 0">'
                        f'<a href="{f}" target="_blank">'
                        f'<img src="{f}" style="max-width:200px;max-height:150px;border-radius:6px;border:1px solid #ddd;" />'
                        f'</a>'
                        f'<br><small>{name}</small></div>'
                    )
                else:
                    parts.append(f'<div style="margin:4px 0"><a href="{f}" target="_blank">{name}</a></div>')
            else:
                parts.append(str(f))
        return Markup("".join(parts))
    return str(files)


# ========== ВЬЮШКИ ==========

class UserAdmin(ModelView, model=User):
    name = "Пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-users"

    column_list = [
        User.id, User.role, User.email, User.phone,
        User.first_name, User.last_name, User.balance,
        User.rating, User.review_count, User.is_active, User.created_at,
    ]
    column_searchable_list = [User.email, User.phone, User.first_name, User.last_name]
    column_sortable_list = [User.id, User.role, User.balance, User.rating, User.created_at]
    column_default_sort = (User.id, True)

    column_details_list = [
        User.id, User.role, User.is_active,
        User.first_name, User.last_name,
        User.email, User.phone, User.password,
        User.balance, User.rating, User.review_count,
        User.created_at, User.updated_at,
        User.orders, User.assigned_orders, User.responses,
        User.payments, User.customer_reviews, User.expert_reviews,
    ]

    form_columns = [
        User.role, User.is_active, User.first_name, User.last_name,
        User.email, User.phone, User.password,
        User.balance, User.rating, User.review_count,
    ]

    column_formatters = {
        User.balance: lambda m, a: f"{m.balance / 100:.2f} ₽" if m.balance is not None else "0.00 ₽",
        User.role: lambda m, a: str(m.role),
    }
    column_formatters_detail = {
        User.balance: lambda m, a: f"{m.balance / 100:.2f} ₽" if m.balance is not None else "0.00 ₽",
        User.role: lambda m, a: str(m.role),
    }

    column_labels = {
        User.id: "ID",
        User.role: "Роль",
        User.is_active: "Активен",
        User.first_name: "Имя",
        User.last_name: "Фамилия",
        User.email: "Email",
        User.phone: "Телефон",
        User.password: "Пароль (хеш)",
        User.balance: "Баланс",
        User.rating: "Рейтинг",
        User.review_count: "Кол-во отзывов",
        User.created_at: "Создан",
        User.updated_at: "Обновлён",
        User.orders: "Заказы (заказчик)",
        User.assigned_orders: "Заказы (эксперт)",
        User.responses: "Отклики",
        User.payments: "Платежи",
        User.customer_reviews: "Отзывы (заказчик)",
        User.expert_reviews: "Отзывы (эксперт)",
    }


class OrderAdmin(ModelView, model=Order):
    name = "Заказ"
    name_plural = "Заказы"
    icon = "fa-solid fa-clipboard-list"

    column_list = [
        Order.id, Order.title, Order.company, Order.status,
        Order.sum_amount, Order.deadline, Order.customer, Order.assigned_expert,
        Order.created_at,
    ]
    column_searchable_list = [Order.title, Order.company, Order.typical_names]
    column_sortable_list = [Order.id, Order.status, Order.sum_amount, Order.deadline, Order.created_at]
    column_default_sort = (Order.id, True)

    column_details_list = [
        Order.id, Order.title, Order.company, Order.typical_names,
        Order.comment, Order.customer, Order.assigned_expert,
        Order.technical_files, Order.sum_amount, Order.deadline,
        Order.status, Order.created_at, Order.updated_at,
        Order.badges, Order.responses, Order.chats,
    ]

    form_columns = [
        Order.title, Order.company, Order.typical_names, Order.comment,
        Order.customer, Order.assigned_expert,
        Order.sum_amount, Order.deadline, Order.status,
    ]

    column_formatters = {
        Order.sum_amount: lambda m, a: f"{m.sum_amount / 100:.2f} ₽" if m.sum_amount is not None else "0.00 ₽",
        Order.status: lambda m, a: str(m.status),
        Order.technical_files: format_technical_files,
    }
    column_formatters_detail = {
        Order.sum_amount: lambda m, a: f"{m.sum_amount / 100:.2f} ₽" if m.sum_amount is not None else "0.00 ₽",
        Order.status: lambda m, a: str(m.status),
        Order.technical_files: format_technical_files,
    }

    column_labels = {
        Order.id: "ID",
        Order.title: "Название",
        Order.company: "Компания",
        Order.typical_names: "Типовые названия",
        Order.comment: "Описание",
        Order.customer: "Заказчик",
        Order.assigned_expert: "Назначенный эксперт",
        Order.technical_files: "Тех. файлы",
        Order.sum_amount: "Сумма",
        Order.deadline: "Дедлайн",
        Order.status: "Статус",
        Order.created_at: "Создан",
        Order.updated_at: "Обновлён",
        Order.badges: "Бейджи",
        Order.responses: "Отклики",
        Order.chats: "Чаты",
    }


class OrderBadgeAdmin(ModelView, model=OrderBadge):
    name = "Бейдж заказа"
    name_plural = "Бейджи заказов"
    icon = "fa-solid fa-tags"

    column_list = [OrderBadge.id, OrderBadge.order, OrderBadge.text, OrderBadge.variant]
    column_searchable_list = [OrderBadge.text]
    column_sortable_list = [OrderBadge.id]

    column_formatters = {
        OrderBadge.variant: lambda m, a: str(m.variant),
    }

    column_labels = {
        OrderBadge.id: "ID",
        OrderBadge.order: "Заказ",
        OrderBadge.text: "Текст",
        OrderBadge.variant: "Вариант",
    }


class OrderResponseAdmin(ModelView, model=OrderResponse):
    name = "Отклик"
    name_plural = "Отклики"
    icon = "fa-solid fa-reply"

    column_list = [
        OrderResponse.id, OrderResponse.order, OrderResponse.expert,
        OrderResponse.status, OrderResponse.proposed_sum_amount,
        OrderResponse.proposed_deadline, OrderResponse.expert_confirmed,
        OrderResponse.created_at,
    ]
    column_searchable_list = [OrderResponse.comment]
    column_sortable_list = [OrderResponse.id, OrderResponse.status, OrderResponse.proposed_sum_amount, OrderResponse.created_at]
    column_default_sort = (OrderResponse.id, True)

    column_details_list = [
        OrderResponse.id, OrderResponse.order, OrderResponse.expert,
        OrderResponse.comment, OrderResponse.proposed_sum_amount,
        OrderResponse.proposed_deadline, OrderResponse.technical_files,
        OrderResponse.expert_confirmed, OrderResponse.status,
        OrderResponse.created_at, OrderResponse.updated_at,
        OrderResponse.reviews,
    ]

    form_columns = [
        OrderResponse.order, OrderResponse.expert,
        OrderResponse.comment, OrderResponse.proposed_sum_amount,
        OrderResponse.proposed_deadline, OrderResponse.expert_confirmed,
        OrderResponse.status,
    ]

    column_formatters = {
        OrderResponse.proposed_sum_amount: lambda m, a: f"{m.proposed_sum_amount / 100:.2f} ₽" if m.proposed_sum_amount is not None else "0.00 ₽",
        OrderResponse.status: lambda m, a: str(m.status),
        OrderResponse.technical_files: format_technical_files,
    }
    column_formatters_detail = {
        OrderResponse.proposed_sum_amount: lambda m, a: f"{m.proposed_sum_amount / 100:.2f} ₽" if m.proposed_sum_amount is not None else "0.00 ₽",
        OrderResponse.status: lambda m, a: str(m.status),
        OrderResponse.technical_files: format_technical_files,
    }

    column_labels = {
        OrderResponse.id: "ID",
        OrderResponse.order: "Заказ",
        OrderResponse.expert: "Эксперт",
        OrderResponse.comment: "Комментарий",
        OrderResponse.proposed_sum_amount: "Предложенная сумма",
        OrderResponse.proposed_deadline: "Предложенный дедлайн",
        OrderResponse.technical_files: "Тех. файлы",
        OrderResponse.expert_confirmed: "Эксперт подтвердил",
        OrderResponse.status: "Статус",
        OrderResponse.created_at: "Создан",
        OrderResponse.updated_at: "Обновлён",
        OrderResponse.reviews: "Отзывы",
    }


class ChatAdmin(ModelView, model=Chat):
    name = "Чат"
    name_plural = "Чаты"
    icon = "fa-solid fa-comments"
    details_template = "chat_detail.html"

    column_list = [
        Chat.id, Chat.uuid, Chat.order, Chat.customer,
        Chat.expert, Chat.created_at,
    ]
    column_sortable_list = [Chat.id, Chat.created_at]
    column_default_sort = (Chat.id, True)

    column_details_list = [
        Chat.id, Chat.uuid, Chat.order, Chat.customer, Chat.expert,
        Chat.created_at, Chat.updated_at,
    ]

    form_columns = [Chat.order, Chat.customer, Chat.expert]

    column_labels = {
        Chat.id: "ID",
        Chat.uuid: "UUID",
        Chat.order: "Заказ",
        Chat.customer: "Заказчик",
        Chat.expert: "Эксперт",
        Chat.created_at: "Создан",
        Chat.updated_at: "Обновлён",
    }

    async def get_object_for_details(self, value):
        model = await super().get_object_for_details(value)
        return model


class PaymentAdmin(ModelView, model=Payment):
    name = "Платёж"
    name_plural = "Платежи"
    icon = "fa-solid fa-credit-card"

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


class ReviewAdmin(ModelView, model=Review):
    name = "Отзыв"
    name_plural = "Отзывы"
    icon = "fa-solid fa-star"

    column_list = [
        Review.id, Review.customer, Review.expert,
        Review.rating, Review.comment, Review.created_at,
    ]
    column_searchable_list = [Review.comment]
    column_sortable_list = [Review.id, Review.rating, Review.created_at]
    column_default_sort = (Review.id, True)

    column_details_list = [
        Review.id, Review.order_id, Review.response,
        Review.customer, Review.expert,
        Review.rating, Review.comment, Review.created_at,
    ]

    form_columns = [
        Review.order_id, Review.response, Review.customer,
        Review.expert, Review.rating, Review.comment,
    ]

    column_labels = {
        Review.id: "ID",
        Review.order_id: "ID заказа",
        Review.response: "Отклик",
        Review.customer: "Заказчик",
        Review.expert: "Эксперт",
        Review.rating: "Оценка",
        Review.comment: "Комментарий",
        Review.created_at: "Создан",
    }


class SessionAdmin(ModelView, model=Session):
    name = "Сессия"
    name_plural = "Сессии"
    icon = "fa-solid fa-key"

    column_list = [
        Session.id, Session.session_id, Session.user_id,
        Session.created_at, Session.expires_at,
    ]
    column_sortable_list = [Session.id, Session.created_at, Session.expires_at]
    column_default_sort = (Session.id, True)

    column_details_list = [
        Session.id, Session.session_id, Session.user_id,
        Session.created_at, Session.expires_at, Session.max_expires_at,
    ]

    form_columns = [Session.user_id, Session.expires_at, Session.max_expires_at]

    column_labels = {
        Session.id: "ID",
        Session.session_id: "ID сессии",
        Session.user_id: "ID пользователя",
        Session.created_at: "Создана",
        Session.expires_at: "Истекает",
        Session.max_expires_at: "Макс. срок",
    }


class PasswordResetCodeAdmin(ModelView, model=PasswordResetCode):
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


# --- Регистрация вьюшек ---
admin.add_view(UserAdmin)
admin.add_view(OrderAdmin)
admin.add_view(OrderBadgeAdmin)
admin.add_view(OrderResponseAdmin)
admin.add_view(ChatAdmin)
admin.add_view(PaymentAdmin)
admin.add_view(ReviewAdmin)
admin.add_view(SessionAdmin)
admin.add_view(PasswordResetCodeAdmin)
