import logging
from datetime import date
from pathlib import Path

from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from models.order import Order
from models.response import OrderResponse
from models.review import Review
from models.user import User
from utils.email import EmailAttachment, send_email

logger = logging.getLogger(__name__)

BACKEND_ROOT = Path(__file__).resolve().parents[1]
UPLOADS_PREFIX = "/uploads/"
RESPONSE_NOTIFICATION_SUBJECT = "Новый отклик на вашу заявку — Ресурс-Плюс"


async def send_response_notification(db: AsyncSession, response_id: int) -> None:
    "Отправляет заказчику письмо о новом отклике. Тихо выходит, если уведомления отключены."
    service = ResponseEmailService(db)
    await service.notify_customer(response_id)


class ResponseEmailService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def notify_customer(self, response_id: int) -> None:
        response = await self.load_response(response_id)
        if response is None:
            return

        customer: User | None = getattr(response.order, "customer", None)
        if customer is None or not customer.email:
            return
        if not customer.email_notifications_enabled:
            return

        expert_stats = await self.load_expert_stats(response.expert_id)
        body = self.build_body(response, customer, expert_stats)
        attachments = self.collect_attachments(response)

        try:
            await send_email(
                customer.email,
                RESPONSE_NOTIFICATION_SUBJECT,
                body,
                attachments,
            )
        except Exception as exc:
            logger.exception(
                "Не удалось отправить письмо об отклике #%s заказчику %s: %s",
                response_id,
                customer.email,
                exc,
            )

    async def load_response(self, response_id: int) -> OrderResponse | None:
        result = await self.db.execute(
            select(OrderResponse)
            .where(OrderResponse.id == response_id)
            .options(
                selectinload(OrderResponse.order).selectinload(Order.customer),
                selectinload(OrderResponse.expert),
            )
        )
        return result.scalars().first()

    async def load_expert_stats(self, expert_id: int) -> "ExpertStats":
        result = await self.db.execute(
            select(
                func.count(Review.id),
                func.avg(Review.rating),
            ).where(Review.expert_id == expert_id)
        )
        count, avg = result.one()
        return ExpertStats(
            review_count=int(count or 0),
            avg_rating=float(avg) if avg is not None else None,
        )

    def build_body(
        self,
        response: OrderResponse,
        customer: User,
        expert_stats: "ExpertStats",
    ) -> str:
        order = response.order
        expert = response.expert

        customer_greeting = self.greeting_for(customer)
        order_title = (order.title if order else f"Заказ #{response.order_id}") or f"Заказ #{response.order_id}"
        expert_name = self.full_name(expert) or "Эксперт"
        expert_contact = self.contact_line(expert)

        lines: list[str] = []
        lines.append(f"Здравствуйте, {customer_greeting}!")
        lines.append("")
        lines.append(f"На вашу заявку «{order_title}» откликнулся новый эксперт.")
        lines.append("")

        lines.append("— Заявка —")
        if order is not None:
            if order.company:
                lines.append(f"Компания: {order.company}")
            lines.append(f"Бюджет: {self.format_rubles(order.sum_amount)}")
            lines.append(f"Срок выполнения: {self.format_date(order.deadline)}")
            if order.comment:
                lines.append("Комментарий:")
                lines.append(order.comment)
        lines.append("")

        lines.append("— Эксперт —")
        lines.append(f"Имя: {expert_name}")
        if expert_contact:
            lines.append(f"Контакты: {expert_contact}")
        if expert_stats.review_count > 0:
            rating_part = (
                f" (средняя оценка {expert_stats.avg_rating:.1f} из 5)"
                if expert_stats.avg_rating is not None
                else ""
            )
            lines.append(f"Отзывов на платформе: {expert_stats.review_count}{rating_part}")
        else:
            lines.append("Отзывов на платформе пока нет")
        lines.append("")

        lines.append("— Предложение эксперта —")
        lines.append(f"Стоимость: {self.format_rubles(response.proposed_sum_amount)}")
        lines.append(f"Срок: {self.format_date(response.proposed_deadline)}")
        if response.comment:
            lines.append("Комментарий:")
            lines.append(response.comment)
        lines.append("")

        if response.technical_files:
            lines.append(
                f"К отклику приложено файлов: {len(response.technical_files)} "
                f"(см. вложения или полный список в личном кабинете)."
            )
            lines.append("")

        lines.append(
            "Ответить эксперту и принять решение можно в личном кабинете на plus-resurs.com."
        )
        lines.append("")
        lines.append(
            "Отключить письма об откликах можно в настройках профиля."
        )

        return "\n".join(lines)

    def collect_attachments(self, response: OrderResponse) -> list[EmailAttachment]:
        attachments: list[EmailAttachment] = []
        for stored in response.technical_files or []:
            if not isinstance(stored, str) or not stored.startswith(UPLOADS_PREFIX):
                continue
            relative = stored.lstrip("/")
            path = BACKEND_ROOT / relative
            if not path.exists() or not path.is_file():
                continue
            attachments.append(
                EmailAttachment(path=path, filename=path.name)
            )
        return attachments

    @staticmethod
    def greeting_for(user: User) -> str:
        if user.first_name:
            return user.first_name
        if user.last_name:
            return user.last_name
        return "клиент Ресурс-Плюс"

    @staticmethod
    def full_name(user: User | None) -> str:
        if user is None:
            return ""
        parts = [part for part in (user.last_name, user.first_name) if part]
        return " ".join(parts)

    @staticmethod
    def contact_line(user: User | None) -> str:
        if user is None:
            return ""
        parts = [part for part in (user.email, user.phone) if part]
        return ", ".join(parts)

    @staticmethod
    def format_rubles(sum_amount: int) -> str:
        if sum_amount is None:
            return "не указана"
        roubles = sum_amount // 100
        kopeks = sum_amount % 100
        formatted = f"{roubles:,}".replace(",", " ")
        if kopeks:
            return f"{formatted},{kopeks:02d} ₽"
        return f"{formatted} ₽"

    @staticmethod
    def format_date(value: date | None) -> str:
        if value is None:
            return "не указан"
        return value.strftime("%d.%m.%Y")


class ExpertStats:
    def __init__(self, review_count: int, avg_rating: float | None):
        self.review_count = review_count
        self.avg_rating = avg_rating
