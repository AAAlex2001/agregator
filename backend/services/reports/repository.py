"Repository: доступ к БД для reports."
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.order import Order
from models.question import OrderQuestion
from models.response import OrderResponse
from utils.pagination import paginate_with_has_more


class ReportRepository:
    "Доступ к данным для отчётов: заказы заказчика, в которых выбран исполнитель."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_customer(
        self,
        customer_id: int,
        skip: int,
        limit: int,
    ) -> tuple[list[Order], bool]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = (
            select(Order)
            .options(
                selectinload(Order.badges),
                selectinload(Order.customer),
                selectinload(Order.assigned_expert),
                selectinload(Order.responses).selectinload(OrderResponse.expert),
            )
            .where(
                Order.customer_id == customer_id,
                Order.assigned_expert_id.isnot(None),
            )
            .order_by(Order.updated_at.desc())
        )
        return await paginate_with_has_more(self.db, query, skip, limit)

    async def get_for_customer(self, order_id: int, customer_id: int) -> Order | None:
        "Возвращает запрошенную сущность."
        query = (
            select(Order)
            .options(
                selectinload(Order.badges),
                selectinload(Order.customer),
                selectinload(Order.assigned_expert),
                selectinload(Order.responses).selectinload(OrderResponse.expert),
                selectinload(Order.questions).selectinload(OrderQuestion.expert),
            )
            .where(
                Order.id == order_id,
                Order.customer_id == customer_id,
            )
        )
        return (await self.db.execute(query)).scalars().first()
