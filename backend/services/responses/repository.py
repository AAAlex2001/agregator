"Repository: доступ к БД для responses."
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.account import Account
from models.chat import Chat
from models.expert import Expert
from models.order import Order
from models.response import OrderResponse, ResponseStatus
from models.review import Review
from utils.pagination import paginate_with_has_more


class ResponseRepository:
    "Все SQL-запросы по откликам. Никакой бизнес-логики."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, response_id: int) -> OrderResponse | None:
        "Возвращает сущность по идентификатору."
        query = (
            select(OrderResponse)
            .options(
                selectinload(OrderResponse.order).selectinload(Order.badges),
                selectinload(OrderResponse.order).selectinload(Order.customer),
                selectinload(OrderResponse.expert),
                selectinload(OrderResponse.reviews),
            )
            .where(OrderResponse.id == response_id)
        )
        return (await self.db.execute(query)).scalars().first()

    async def get_order_by_id(self, order_id: int) -> Order | None:
        "Возвращает запрошенную сущность."
        query = select(Order).where(Order.id == order_id)
        return (await self.db.execute(query)).scalars().first()

    async def reload_order_with_relations(self, order_id: int) -> Order | None:
        "Публичный метод сервисного слоя."
        query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where(Order.id == order_id)
        )
        return (await self.db.execute(query)).scalars().first()

    async def find_user(self, user_id: int) -> Account | None:
        "Ищет сущность по заданным параметрам."
        return (
            await self.db.execute(select(Account).where(Account.id == user_id))
        ).scalars().first()

    async def find_existing_response(
        self, order_id: int, expert_id: int
    ) -> OrderResponse | None:
        "Ищет сущность по заданным параметрам."
        query = select(OrderResponse).where(
            OrderResponse.order_id == order_id,
            OrderResponse.expert_id == expert_id,
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_auto_rejected(
        self, order_id: int, exclude_response_id: int
    ) -> list[OrderResponse]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = select(OrderResponse).where(
            OrderResponse.order_id == order_id,
            OrderResponse.id != exclude_response_id,
            OrderResponse.status == ResponseStatus.REJECTED,
            OrderResponse.auto_rejected == True,  # noqa: E712
        )
        return list((await self.db.execute(query)).scalars().all())

    async def list_active_siblings(
        self, order_id: int, exclude_response_id: int, for_update: bool = False
    ) -> list[OrderResponse]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = select(OrderResponse).where(
            OrderResponse.order_id == order_id,
            OrderResponse.id != exclude_response_id,
            OrderResponse.status != ResponseStatus.REJECTED,
        )
        if for_update:
            query = query.with_for_update()
        return list((await self.db.execute(query)).scalars().all())

    async def find_chat(
        self, order_id: int, customer_id: int, expert_id: int
    ) -> Chat | None:
        "Ищет сущность по заданным параметрам."
        query = (
            select(Chat)
            .where(
                Chat.order_id == order_id,
                Chat.customer_id == customer_id,
                Chat.expert_id == expert_id,
            )
            .order_by(Chat.id.desc())
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_expert_responses(
        self,
        expert_id: int,
        status_filters: list[ResponseStatus] | None,
        skip: int,
        limit: int,
    ) -> tuple[list[OrderResponse], bool]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        list_query = (
            select(OrderResponse)
            .where(OrderResponse.expert_id == expert_id)
            .options(
                selectinload(OrderResponse.order).selectinload(Order.badges),
                selectinload(OrderResponse.order).selectinload(Order.customer),
                selectinload(OrderResponse.expert),
            )
            .order_by(OrderResponse.created_at.desc())
        )
        if status_filters:
            list_query = list_query.where(OrderResponse.status.in_(status_filters))

        return await paginate_with_has_more(self.db, list_query, skip, limit)

    CUSTOMER_SORT_COLUMNS = {
        "created_at": OrderResponse.created_at,
        "proposed_sum_amount": OrderResponse.proposed_sum_amount,
        "expert_rating": Expert.rating,
    }

    async def list_customer_responses(
        self,
        customer_id: int,
        status_filters: list[ResponseStatus] | None,
        skip: int,
        limit: int,
        sort_by: str = "created_at",
        sort_dir: str = "desc",
    ) -> tuple[list[OrderResponse], bool]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        column = self.CUSTOMER_SORT_COLUMNS.get(sort_by, OrderResponse.created_at)
        list_query = (
            select(OrderResponse)
            .join(Order, Order.id == OrderResponse.order_id)
            .where(Order.customer_id == customer_id)
            .options(
                selectinload(OrderResponse.order).selectinload(Order.badges),
                selectinload(OrderResponse.order).selectinload(Order.customer),
                selectinload(OrderResponse.expert),
                selectinload(OrderResponse.reviews),
            )
        )
        list_query = list_query.where(
            OrderResponse.status != ResponseStatus.WITHDRAWN_BY_EXPERT
        )
        if status_filters:
            list_query = list_query.where(OrderResponse.status.in_(status_filters))
        if sort_by == "expert_rating":
            list_query = list_query.join(Expert, Expert.account_id == OrderResponse.expert_id)
        list_query = list_query.order_by(column.asc() if sort_dir == "asc" else column.desc())

        return await paginate_with_has_more(self.db, list_query, skip, limit)

    async def expert_counters(self, expert_id: int) -> dict[ResponseStatus, int]:
        "Публичный метод сервисного слоя."
        query = (
            select(OrderResponse.status, func.count(OrderResponse.id))
            .where(OrderResponse.expert_id == expert_id)
            .group_by(OrderResponse.status)
        )
        return dict((await self.db.execute(query)).all())

    async def customer_counters(self, customer_id: int) -> dict[ResponseStatus, int]:
        "Публичный метод сервисного слоя."
        query = (
            select(OrderResponse.status, func.count(OrderResponse.id))
            .join(Order, Order.id == OrderResponse.order_id)
            .where(
                Order.customer_id == customer_id,
                OrderResponse.status != ResponseStatus.WITHDRAWN_BY_EXPERT,
            )
            .group_by(OrderResponse.status)
        )
        return dict((await self.db.execute(query)).all())

    async def reviewed_response_ids(
        self, customer_id: int, response_ids: list[int]
    ) -> set[int]:
        "Публичный метод сервисного слоя."
        if not response_ids:
            return set()
        query = (
            select(Review.response_id)
            .where(
                Review.customer_id == customer_id,
                Review.response_id.in_(response_ids),
            )
            .group_by(Review.response_id)
        )
        return set((await self.db.execute(query)).scalars().all())

    async def add(self, entity: OrderResponse | Chat) -> None:
        "Добавляет сущность в сессию."
        self.db.add(entity)

    async def delete(self, entity: OrderResponse) -> None:
        "Удаляет переданную сущность."
        await self.db.delete(entity)

    async def flush(self) -> None:
        "Сбрасывает накопленные изменения в БД."
        await self.db.flush()

    async def list_customer_rejected(self, customer_id: int) -> list[OrderResponse]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = (
            select(OrderResponse)
            .join(Order, Order.id == OrderResponse.order_id)
            .where(
                Order.customer_id == customer_id,
                OrderResponse.status == ResponseStatus.REJECTED,
            )
        )
        return list((await self.db.execute(query)).scalars().all())
