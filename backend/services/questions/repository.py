from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.order import Order
from models.question import OrderQuestion
from models.response import OrderResponse


class QuestionRepository:
    "SQL-доступ к OrderQuestion. Никакой бизнес-логики."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, question_id: int) -> OrderQuestion | None:
        query = (
            select(OrderQuestion)
            .options(selectinload(OrderQuestion.expert), selectinload(OrderQuestion.order))
            .where(OrderQuestion.id == question_id)
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_by_order(self, order_id: int) -> list[OrderQuestion]:
        query = (
            select(OrderQuestion)
            .options(selectinload(OrderQuestion.expert))
            .where(OrderQuestion.order_id == order_id)
            .order_by(OrderQuestion.asked_at.asc())
        )
        return list((await self.db.execute(query)).scalars().all())

    async def get_order(self, order_id: int) -> Order | None:
        return (await self.db.execute(select(Order).where(Order.id == order_id))).scalars().first()

    async def expert_has_response(self, order_id: int, expert_id: int) -> bool:
        query = select(OrderResponse.id).where(
            OrderResponse.order_id == order_id,
            OrderResponse.expert_id == expert_id,
        )
        return (await self.db.execute(query)).scalar_one_or_none() is not None

    async def add(self, question: OrderQuestion) -> None:
        self.db.add(question)

    async def flush(self) -> None:
        await self.db.flush()
