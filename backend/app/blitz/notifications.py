"""События заявки Блиц-эксперта: уведомление в кабинете, письмо и сообщение в Telegram.

Отправка писем и Telegram уходит в фон после ответа. Администраторам — только письмо.
"""

from fastapi import BackgroundTasks, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.blitz.orders.models import BlitzOrder, ServiceKind
from app.core.config import get_settings
from app.core.database import get_db
from models.account import Account
from models.notification import Notification, NotificationType
from services.email.dispatcher import EmailDispatcher
from services.notifications.repository import NotificationRepository

TEMPLATE = "blitz_order"
TELEGRAM_CTA = "Откройте заявку в личном кабинете на сайте"


class BlitzEmailContext(BaseModel):
    """Письмо о событии: заголовок, текст и ссылка на заявку."""

    title: str
    message: str
    cta_url: str


def order_title(order: BlitzOrder) -> str:
    """Короткое название заявки для писем и уведомлений."""

    return f"Заявка №{order.id}: {order.object_name}"


def order_path(order: BlitzOrder) -> str:
    """Адрес заявки в кабинете: у экспертизы и аудита свои разделы."""

    section = "blitz-audit" if order.service == ServiceKind.AUDIT else "blitz"

    return f"/{section}/orders/{order.id}"


class BlitzNotifier:
    """Сообщает сторонам заявки и администраторам, что с ней произошло."""

    def __init__(self, notifications: NotificationRepository, emails: EmailDispatcher) -> None:
        self.notifications = notifications
        self.emails = emails
        self.base_url = get_settings().public_base_url

    async def notify(self, account: Account | None, order: BlitzOrder, message: str) -> None:
        """Уведомление в кабинете, письмо и Telegram одному человеку."""

        if account is None:
            return

        title = order_title(order)
        notification = Notification(
            user_id=account.id,
            type=NotificationType.BLITZ_ORDER,
            payload={"order_id": order.id, "title": title, "message": message},
            action_url=order_path(order),
        )
        await self.notifications.add(notification)
        await self.notifications.flush()
        await self.notifications.increment_unread(account.id)

        context = BlitzEmailContext(title=title, message=message, cta_url=self.order_url(order))
        self.emails.notify(account, None, TEMPLATE, title, context, TELEGRAM_CTA)

    async def notify_all(self, accounts: list[Account], order: BlitzOrder, message: str) -> None:
        """То же самое нескольким людям."""

        for account in accounts:
            await self.notify(account, order, message)

    def notify_admins(self, order: BlitzOrder, message: str) -> None:
        """Письмо администраторам из ADMIN_NOTIFY_EMAILS."""

        title = order_title(order)
        context = BlitzEmailContext(title=title, message=message, cta_url=self.order_url(order))

        for email in get_settings().admin_emails:
            self.emails.dispatch(email, TEMPLATE, title, context)

    def order_url(self, order: BlitzOrder) -> str:
        """Полная ссылка на заявку."""

        return f"{self.base_url}{order_path(order)}"


def get_blitz_notifier(
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> BlitzNotifier:
    """Уведомитель с сессией запроса и фоновыми задачами ответа."""

    return BlitzNotifier(NotificationRepository(db), EmailDispatcher(background_tasks))
