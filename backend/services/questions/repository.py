"Repository: доступ к БД для questions."
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.order import Order
from models.question import OrderQuestion
from models.response import OrderResponse


class QuestionRepository:
    "SQL-доступ к OrderQuestion. Никакой бизнес-логики."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, question_id: int) -> OrderQuestion | None:
        "Возвращает сущность по идентификатору."
        query = (
            select(OrderQuestion)
            .options(selectinload(OrderQuestion.expert), selectinload(OrderQuestion.order))
            .where(OrderQuestion.id == question_id)
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_by_order(self, order_id: int) -> list[OrderQuestion]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = (
            select(OrderQuestion)
            .options(selectinload(OrderQuestion.expert))
            .where(OrderQuestion.order_id == order_id)
            .order_by(OrderQuestion.asked_at.asc())
        )
        return list((await self.db.execute(query)).scalars().all())

    async def list_visible_for_expert(
        self, order_id: int, expert_id: int
    ) -> list[OrderQuestion]:
        "Эксперту видны только публичные вопросы и его собственные (включая анонимные)."
        query = (
            select(OrderQuestion)
            .options(selectinload(OrderQuestion.expert))
            .where(
                OrderQuestion.order_id == order_id,
                (OrderQuestion.is_anonymous.is_(False))
                | (OrderQuestion.expert_id == expert_id),
            )
            .order_by(OrderQuestion.asked_at.asc())
        )
        return list((await self.db.execute(query)).scalars().all())

    async def list_public_by_order(self, order_id: int) -> list[OrderQuestion]:
        "Только не-анонимные вопросы — для просмотра в архиве посторонними."
        query = (
            select(OrderQuestion)
            .options(selectinload(OrderQuestion.expert))
            .where(
                OrderQuestion.order_id == order_id,
                OrderQuestion.is_anonymous.is_(False),
            )
            .order_by(OrderQuestion.asked_at.asc())
        )
        return list((await self.db.execute(query)).scalars().all())

    async def get_order(self, order_id: int) -> Order | None:
        "Возвращает запрошенную сущность."
        return (await self.db.execute(select(Order).where(Order.id == order_id))).scalars().first()

    async def expert_has_response(self, order_id: int, expert_id: int) -> bool:
        "Публичный метод сервисного слоя."
        query = select(OrderResponse.id).where(
            OrderResponse.order_id == order_id,
            OrderResponse.expert_id == expert_id,
        )
        return (await self.db.execute(query)).scalar_one_or_none() is not None

    async def add(self, question: OrderQuestion) -> None:
        "Добавляет сущность в сессию."
        self.db.add(question)

    async def flush(self) -> None:
        "Сбрасывает накопленные изменения в БД."
        await self.db.flush()
