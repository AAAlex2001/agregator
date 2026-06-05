"ModelView-регистрации для всех основных сущностей: CRUD прямо из админки."

from sqladmin import ModelView

from models.article import Article
from models.chat import Chat, ChatMessage
from models.notification import Notification
from models.order import Order, OrderBadge
from models.payment import Payment
from models.platform_settings import PlatformSettings
from models.pricing import PricingPlan, UserSubscription
from models.question import OrderQuestion
from models.response import OrderResponse
from models.review import Review
from models.session import Session
from models.support_ticket import SupportTicket, SupportTicketMessage
from models.user import User


class UserAdmin(ModelView, model=User):
    "Пользователи: customer / expert / license-holder."

    name = "Пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-user"
    category = "Пользователи"

    column_list = ("id", "role", "email", "phone", "first_name", "last_name", "is_active", "created_at")
    column_searchable_list = ("email", "phone", "first_name", "last_name", "inn")
    column_sortable_list = ("id", "created_at", "role", "email", "is_active")
    column_default_sort = ("id", True)
    page_size = 50


class SessionAdmin(ModelView, model=Session):
    "Активные сессии (cookie-based авторизация)."

    name = "Сессия"
    name_plural = "Сессии"
    icon = "fa-solid fa-key"
    category = "Пользователи"

    column_list = ("id", "user_id", "session_id", "expires_at", "max_expires_at")
    column_default_sort = ("id", True)
    page_size = 50


class OrderAdmin(ModelView, model=Order):
    "Заказы клиентов на ЭПБ."

    name = "Заказ"
    name_plural = "Заказы"
    icon = "fa-solid fa-clipboard-list"
    category = "Заказы"

    column_list = ("id", "title", "customer_id", "assigned_expert_id", "status", "sum_amount", "deadline", "created_at")
    column_searchable_list = ("title", "company", "public_id")
    column_sortable_list = ("id", "created_at", "deadline", "sum_amount", "status")
    column_default_sort = ("id", True)
    page_size = 50


class OrderBadgeAdmin(ModelView, model=OrderBadge):
    "Бейджи (теги) заказов."

    name = "Бейдж"
    name_plural = "Бейджи"
    category = "Заказы"

    column_list = ("id", "order_id", "text", "variant")


class OrderResponseAdmin(ModelView, model=OrderResponse):
    "Отклики экспертов на заказы."

    name = "Отклик"
    name_plural = "Отклики"
    icon = "fa-solid fa-paper-plane"
    category = "Заказы"

    column_list = ("id", "order_id", "expert_id", "status", "proposed_sum_amount", "created_at")
    column_sortable_list = ("id", "created_at", "status", "proposed_sum_amount")
    column_default_sort = ("id", True)
    page_size = 50


class OrderQuestionAdmin(ModelView, model=OrderQuestion):
    "Вопросы по заказам."

    name = "Вопрос"
    name_plural = "Вопросы по заказам"
    category = "Заказы"

    column_list = ("id", "order_id", "author_id", "created_at")
    column_default_sort = ("id", True)


class ReviewAdmin(ModelView, model=Review):
    "Отзывы по завершённым сделкам."

    name = "Отзыв"
    name_plural = "Отзывы"
    icon = "fa-solid fa-star"
    category = "Заказы"

    column_list = ("id", "order_id", "customer_id", "expert_id", "rating", "created_at")
    column_default_sort = ("id", True)


class ChatAdmin(ModelView, model=Chat):
    "Чаты по заказам/откликам."

    name = "Чат"
    name_plural = "Чаты"
    icon = "fa-solid fa-comments"
    category = "Чаты"

    column_list = ("id", "order_id", "customer_id", "expert_id", "created_at")
    column_default_sort = ("id", True)


class ChatMessageAdmin(ModelView, model=ChatMessage):
    "Сообщения в чатах."

    name = "Сообщение"
    name_plural = "Сообщения"
    category = "Чаты"

    column_list = ("id", "chat_id", "sender_id", "is_read", "created_at")
    column_default_sort = ("id", True)
    page_size = 100


class PaymentAdmin(ModelView, model=Payment):
    "Платежи через ЮKassa."

    name = "Платёж"
    name_plural = "Платежи"
    icon = "fa-solid fa-credit-card"
    category = "Биллинг"

    column_list = ("id", "user_id", "amount", "status", "created_at")
    column_default_sort = ("id", True)


class PricingPlanAdmin(ModelView, model=PricingPlan):
    "Тарифные планы."

    name = "Тариф"
    name_plural = "Тарифы"
    category = "Биллинг"

    column_list = ("id", "kind", "name", "price_kopecks", "period_label", "is_active", "sort_order")
    column_sortable_list = ("id", "sort_order", "price_kopecks", "is_active")
    column_default_sort = ("sort_order", False)


class UserSubscriptionAdmin(ModelView, model=UserSubscription):
    "Подписки пользователей на тарифы."

    name = "Подписка"
    name_plural = "Подписки"
    category = "Биллинг"

    column_list = ("id", "user_id", "plan_id", "kind", "status", "expires_at", "responses_remaining", "created_at")
    column_default_sort = ("id", True)


class NotificationAdmin(ModelView, model=Notification):
    "Уведомления (in-app колокольчик)."

    name = "Уведомление"
    name_plural = "Уведомления"
    icon = "fa-solid fa-bell"

    column_list = ("id", "user_id", "type", "is_read", "created_at")
    column_default_sort = ("id", True)
    page_size = 50


class ArticleAdmin(ModelView, model=Article):
    "Статьи блога."

    name = "Статья"
    name_plural = "Статьи"
    icon = "fa-solid fa-newspaper"

    column_list = ("id", "kind", "status", "title", "slug", "published_at", "created_at")
    column_searchable_list = ("title", "slug")
    column_default_sort = ("id", True)


class SupportTicketAdmin(ModelView, model=SupportTicket):
    "Тикеты в поддержку."

    name = "Тикет"
    name_plural = "Тикеты поддержки"
    icon = "fa-solid fa-life-ring"
    category = "Поддержка"

    column_list = ("id", "user_id", "subject", "status", "created_at")
    column_default_sort = ("id", True)


class SupportTicketMessageAdmin(ModelView, model=SupportTicketMessage):
    "Сообщения в тикетах."

    name = "Сообщение тикета"
    name_plural = "Сообщения тикетов"
    category = "Поддержка"

    column_list = ("id", "ticket_id", "author_kind", "author_user_id", "author_name", "created_at")
    column_default_sort = ("id", True)


class PlatformSettingsAdmin(ModelView, model=PlatformSettings):
    "Глобальные настройки платформы (singleton)."

    name = "Настройки платформы"
    name_plural = "Настройки платформы"
    icon = "fa-solid fa-gear"


ALL_VIEWS: list[type[ModelView]] = [
    UserAdmin,
    SessionAdmin,
    OrderAdmin,
    OrderBadgeAdmin,
    OrderResponseAdmin,
    OrderQuestionAdmin,
    ReviewAdmin,
    ChatAdmin,
    ChatMessageAdmin,
    PaymentAdmin,
    PricingPlanAdmin,
    UserSubscriptionAdmin,
    NotificationAdmin,
    ArticleAdmin,
    SupportTicketAdmin,
    SupportTicketMessageAdmin,
    PlatformSettingsAdmin,
]
