"Repository: доступ к БД для email."
from dataclasses import dataclass

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.chat import Chat, ChatMessage
from models.labor import LaborListing
from models.order import Order
from models.question import OrderQuestion
from models.response import OrderResponse
from models.review import Review
from models.user import User, UserRole


@dataclass(frozen=True)
class ExpertStats:
    "Компонент сервисного слоя."
    review_count: int
    avg_rating: float | None


class EmailRepository:
    "Все SQL-запросы, нужные для email-уведомлений."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_user(self, user_id: int) -> User | None:
        "Ищет сущность по заданным параметрам."
        query = select(User).where(User.id == user_id)
        return (await self.db.execute(query)).scalars().first()

    async def find_response(self, response_id: int) -> OrderResponse | None:
        "Ищет сущность по заданным параметрам."
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
        "Ищет сущность по заданным параметрам."
        query = select(Order).where(Order.id == order_id)
        return (await self.db.execute(query)).scalars().first()

    async def find_labor_listing(
        self,
        listing_id: int,
    ) -> LaborListing | None:
        query = (
            select(LaborListing)
            .where(LaborListing.id == listing_id)
            .options(selectinload(LaborListing.owner))
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_active_users_by_role(
        self,
        role: UserRole,
    ) -> list[User]:
        query = select(User).where(
            User.role == role,
            User.is_active.is_(True),
        )
        return list((await self.db.execute(query)).scalars().all())

    async def find_message(self, message_id: int) -> ChatMessage | None:
        "Ищет сущность по заданным параметрам."
        query = (
            select(ChatMessage)
            .where(ChatMessage.id == message_id)
            .options(
                selectinload(ChatMessage.sender),
                selectinload(ChatMessage.chat).selectinload(Chat.customer),
                selectinload(ChatMessage.chat).selectinload(Chat.expert),
                selectinload(ChatMessage.chat).selectinload(Chat.order),
                selectinload(ChatMessage.chat).selectinload(Chat.labor_listing),
            )
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_users_for_new_blog_post_email(self) -> list[User]:
        "Получатели письма о новой статье: подтверждённый email + включенный тогглер email_on_new_blog_post. Дедуп по email (один ящик может быть в users под разными ролями)."
        query = (
            select(User)
            .where(
                User.email.isnot(None),
                User.email_verified.is_(True),
                User.email_on_new_blog_post.is_(True),
            )
            .distinct(User.email)
            .order_by(User.email, User.id)
        )
        return list((await self.db.execute(query)).scalars().all())

    async def list_experts_subscribed_to_order_types(self) -> list[User]:
        "Эксперты с непустым фильтром типов заказов. Пересечение проверяем в use case."
        query = select(User).where(
            User.role == UserRole.EXPERT,
            User.notify_order_types.isnot(None),
        )
        return list((await self.db.execute(query)).scalars().all())

    async def list_all_experts(self) -> list[User]:
        query = select(User).where(User.role == UserRole.EXPERT)
        return list((await self.db.execute(query)).scalars().all())

    async def list_responders(self, order_id: int) -> list[User]:
        "Эксперты, откликнувшиеся на заявку. Кому и куда слать — решает диспетчер."
        query = (
            select(User)
            .join(OrderResponse, OrderResponse.expert_id == User.id)
            .where(OrderResponse.order_id == order_id)
        )
        return list((await self.db.execute(query)).scalars().all())

    async def find_question(self, question_id: int) -> OrderQuestion | None:
        "Ищет сущность по заданным параметрам."
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
        "Возвращает запрошенную сущность."
        query = select(func.count(Review.id), func.avg(Review.rating)).where(
            Review.expert_id == expert_id
        )
        count, avg = (await self.db.execute(query)).one()
        return ExpertStats(
            review_count=int(count or 0),
            avg_rating=float(avg) if avg is not None else None,
        )
