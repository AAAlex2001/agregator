import logging
from dataclasses import dataclass
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
from utils.email_templates import render_email

logger = logging.getLogger(__name__)

BACKEND_ROOT = Path(__file__).resolve().parents[1]
UPLOADS_PREFIX = "/uploads/"
RESPONSE_NOTIFICATION_SUBJECT = "Новый отклик на вашу заявку — Ресурс-Плюс"
RESPONSES_CTA_URL = "https://plus-resurs.com/customer/orders"


@dataclass(frozen=True)
class ExpertStats:
    review_count: int
    avg_rating: float | None


@dataclass(frozen=True)
class OrderBrief:
    company: str
    sum_amount: int | None
    deadline: date | None
    comment: str


@dataclass(frozen=True)
class ExpertBrief:
    name: str
    contact: str
    review_count: int
    avg_rating: float | None


@dataclass(frozen=True)
class ResponseBrief:
    proposed_sum_amount: int
    proposed_deadline: date
    comment: str
    files_count: int


@dataclass(frozen=True)
class ResponseNotificationContext:
    customer_greeting: str
    order_title: str
    cta_url: str
    order: OrderBrief
    expert: ExpertBrief
    response: ResponseBrief


async def send_response_notification(db: AsyncSession, response_id: int) -> None:
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
        context = self.build_context(response, customer, expert_stats)
        rendered = render_email(
            name="response_notification",
            subject=RESPONSE_NOTIFICATION_SUBJECT,
            context=context.__dict__,
        )
        attachments = self.collect_attachments(response)

        try:
            await send_email(
                customer.email,
                rendered.subject,
                rendered.text,
                rendered.html,
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

    async def load_expert_stats(self, expert_id: int) -> ExpertStats:
        result = await self.db.execute(
            select(func.count(Review.id), func.avg(Review.rating))
            .where(Review.expert_id == expert_id)
        )
        count, avg = result.one()
        return ExpertStats(
            review_count=int(count or 0),
            avg_rating=float(avg) if avg is not None else None,
        )

    def build_context(
        self,
        response: OrderResponse,
        customer: User,
        expert_stats: ExpertStats,
    ) -> ResponseNotificationContext:
        order = response.order
        expert = response.expert
        order_title = (order.title if order else None) or f"Заказ #{response.order_id}"

        return ResponseNotificationContext(
            customer_greeting=self.greeting_for(customer),
            order_title=order_title,
            cta_url=RESPONSES_CTA_URL,
            order=OrderBrief(
                company=(order.company if order else "") or "",
                sum_amount=order.sum_amount if order else None,
                deadline=order.deadline if order else None,
                comment=(order.comment if order else "") or "",
            ),
            expert=ExpertBrief(
                name=self.full_name(expert) or "Эксперт",
                contact=self.contact_line(expert),
                review_count=expert_stats.review_count,
                avg_rating=expert_stats.avg_rating,
            ),
            response=ResponseBrief(
                proposed_sum_amount=response.proposed_sum_amount,
                proposed_deadline=response.proposed_deadline,
                comment=response.comment or "",
                files_count=len(response.technical_files or []),
            ),
        )

    def collect_attachments(self, response: OrderResponse) -> list[EmailAttachment]:
        attachments: list[EmailAttachment] = []
        for stored in response.technical_files or []:
            if not isinstance(stored, str) or not stored.startswith(UPLOADS_PREFIX):
                continue
            path = BACKEND_ROOT / stored.lstrip("/")
            if not path.exists() or not path.is_file():
                continue
            attachments.append(EmailAttachment(path=path, filename=path.name))
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
