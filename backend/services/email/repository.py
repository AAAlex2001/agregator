from dataclasses import dataclass

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.chat import Chat, ChatMessage
from models.order import Order
from models.question import OrderQuestion
from models.response import OrderResponse
from models.review import Review
from models.user import User, UserRole


@dataclass(frozen=True)
class ExpertStats:
    review_count: int
    avg_rating: float | None


class EmailRepository:
    "Все SQL-запросы, нужные для email-уведомлений."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_user(self, user_id: int) -> User | None:
        query = select(User).where(User.id == user_id)
        return (await self.db.execute(query)).scalars().first()

    async def find_response(self, response_id: int) -> OrderResponse | None:
        query = (
            select(OrderResponse)
            .where(OrderResponse.id == response_id)
            .options(
                selectinload(OrderResponse.order).selectinload(Order.customer),
                selectinload(OrderResponse.expert),
            )
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_order(self, order_id: int) -> Order | None:
        query = select(Order).where(Order.id == order_id)
        return (await self.db.execute(query)).scalars().first()

    async def find_message(self, message_id: int) -> ChatMessage | None:
        query = (
            select(ChatMessage)
            .where(ChatMessage.id == message_id)
            .options(
                selectinload(ChatMessage.sender),
                selectinload(ChatMessage.chat).selectinload(Chat.customer),
                selectinload(ChatMessage.chat).selectinload(Chat.expert),
                selectinload(ChatMessage.chat).selectinload(Chat.order),
            )
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_experts_with_preference(self, preference_field: str) -> list[User]:
        query = select(User).where(
            User.role == UserRole.EXPERT,
            User.email.isnot(None),
            getattr(User, preference_field).is_(True),
        )
        return list((await self.db.execute(query)).scalars().all())

    async def list_experts_subscribed_to_order_types(self) -> list[User]:
        "Эксперты с email и непустым фильтром типов заказов. Пересечение проверяем в use case."
        query = select(User).where(
            User.role == UserRole.EXPERT,
            User.email.isnot(None),
            User.notify_order_types.isnot(None),
        )
        return list((await self.db.execute(query)).scalars().all())

    async def list_responders_with_preference(
        self, order_id: int, preference_field: str
    ) -> list[User]:
        query = (
            select(User)
            .join(OrderResponse, OrderResponse.expert_id == User.id)
            .where(
                OrderResponse.order_id == order_id,
                User.email.isnot(None),
                getattr(User, preference_field).is_(True),
            )
        )
        return list((await self.db.execute(query)).scalars().all())

    async def find_question(self, question_id: int) -> OrderQuestion | None:
        query = (
            select(OrderQuestion)
            .where(OrderQuestion.id == question_id)
            .options(
                selectinload(OrderQuestion.order).selectinload(Order.customer),
                selectinload(OrderQuestion.expert),
            )
        )
        return (await self.db.execute(query)).scalars().first()

    async def get_expert_stats(self, expert_id: int) -> ExpertStats:
        query = select(func.count(Review.id), func.avg(Review.rating)).where(
            Review.expert_id == expert_id
        )
        count, avg = (await self.db.execute(query)).one()
        return ExpertStats(
            review_count=int(count or 0),
            avg_rating=float(avg) if avg is not None else None,
        )
