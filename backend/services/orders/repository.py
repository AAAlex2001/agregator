
"Repository: доступ к БД для orders."
from sqlalchemy import delete, func, not_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.order import Order, OrderBadge, OrderStatus, OrderWorkType
from models.question import OrderQuestion
from models.response import OrderResponse as OrderResponseModel
from models.user import User, UserRole
from utils.pagination import paginate_with_has_more


class OrderRepository:
    "Все обращения к БД по сущности Order. Никакой бизнес-логики — только данные."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, order_id: int) -> Order | None:
        "Возвращает сущность по идентификатору."
        query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where(Order.id == order_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_public_id(self, public_id: str) -> Order | None:
        "Возвращает сущность по публичному идентификатору."
        query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where(Order.public_id == public_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def count_unanswered_questions(self, order_ids: list[int]) -> dict[int, int]:
        "Количество вопросов без ответа по каждому заказу."
        if not order_ids:
            return {}
        query = (
            select(OrderQuestion.order_id, func.count())
            .where(OrderQuestion.order_id.in_(order_ids), OrderQuestion.answer.is_(None))
            .group_by(OrderQuestion.order_id)
        )
        result = await self.db.execute(query)
        return dict(result.all())

    async def count_expert_answered_questions(
        self, order_ids: list[int], expert_id: int
    ) -> dict[int, int]:
        "Количество отвеченных вопросов данного эксперта по каждому заказу."
        if not order_ids:
            return {}
        query = (
            select(OrderQuestion.order_id, func.count())
            .where(
                OrderQuestion.order_id.in_(order_ids),
                OrderQuestion.expert_id == expert_id,
                OrderQuestion.answer.is_not(None),
            )
            .group_by(OrderQuestion.order_id)
        )
        result = await self.db.execute(query)
        return dict(result.all())

    async def list_active_unassigned_unresponded_by_expert(
        self,
        expert_id: int,
        skip: int,
        limit: int,
        status_filter: OrderStatus | None,
    ) -> tuple[list[Order], bool]:
        "ACTIVE заказы без назначенного эксперта, на которые данный эксперт ещё не откликался."
        responded = (
            select(OrderResponseModel.id)
            .where(
                OrderResponseModel.order_id == Order.id,
                OrderResponseModel.expert_id == expert_id,
            )
            .exists()
        )
        list_query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where(
                Order.status == OrderStatus.ACTIVE,
                Order.assigned_expert_id.is_(None),
                not_(responded),
            )
            .order_by(Order.created_at.desc())
        )
        if status_filter is not None:
            list_query = list_query.where(Order.status == status_filter)
        return await paginate_with_has_more(self.db, list_query, skip, limit)

    async def list_for_customer(
        self,
        customer_id: int,
        skip: int,
        limit: int,
        status_filter: OrderStatus | None,
    ) -> tuple[list[Order], bool]:
        "Заказы, принадлежащие customer'у (кроме архивных)."
        list_query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where(
                Order.customer_id == customer_id,
                Order.status != OrderStatus.ARCHIVED,
            )
            .order_by(Order.created_at.desc())
        )
        if status_filter is not None:
            list_query = list_query.where(Order.status == status_filter)
        return await paginate_with_has_more(self.db, list_query, skip, limit)

    async def list_public_all(
        self,
        skip: int,
        limit: int,
        status_filter: OrderStatus | None,
    ) -> tuple[list[Order], bool]:
        "Публичный список всех заказов платформы (для неавторизованных гостей)."
        list_query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .order_by(Order.created_at.desc())
        )
        if status_filter is not None:
            list_query = list_query.where(Order.status == status_filter)
        return await paginate_with_has_more(self.db, list_query, skip, limit)

    async def search_public(
        self,
        query: str,
        skip: int,
        limit: int,
        work_type: OrderWorkType | None = None,
        badge_code: str | None = None,
    ) -> tuple[list[Order], bool]:
        "Поиск по заказам платформы по тексту, виду работ и коду экспертизы."
        list_query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .order_by(Order.created_at.desc())
        )
        if query:
            pattern = f"%{query}%"
            list_query = list_query.where(
                (Order.title.ilike(pattern)) | (Order.company.ilike(pattern))
            )
        if work_type is not None:
            list_query = list_query.where(Order.work_type == work_type)
        if badge_code:
            list_query = list_query.where(
                Order.badges.any(OrderBadge.text == badge_code)
            )
        return await paginate_with_has_more(self.db, list_query, skip, limit)

    async def list_archived(
        self,
        skip: int,
        limit: int,
    ) -> tuple[list[Order], bool]:
        "Список архивных заказов — виден всем авторизованным. Подгружает принятого исполнителя и его отклик."
        list_query = (
            select(Order)
            .options(
                selectinload(Order.badges),
                selectinload(Order.customer),
                selectinload(Order.assigned_expert),
                selectinload(Order.responses).selectinload(OrderResponseModel.expert),
            )
            .where(Order.status == OrderStatus.ARCHIVED)
            .order_by(Order.updated_at.desc())
        )
        return await paginate_with_has_more(self.db, list_query, skip, limit)

    async def reviewed_response_ids(
        self, customer_id: int, response_ids: list[int]
    ) -> set[int]:
        "Какие из указанных откликов уже получили отзыв от данного customer'а."
        if not response_ids:
            return set()
        from models.review import Review
        query = (
            select(Review.response_id)
            .where(
                Review.customer_id == customer_id,
                Review.response_id.in_(response_ids),
            )
            .group_by(Review.response_id)
        )
        return set((await self.db.execute(query)).scalars().all())

    async def get_user_role(self, user_id: int) -> UserRole | None:
        "Возвращает запрошенную сущность."
        query = select(User.role).where(User.id == user_id)
        return (await self.db.execute(query)).scalar_one_or_none()

    async def user_exists(self, user_id: int) -> bool:
        "Публичный метод сервисного слоя."
        query = select(User.id).where(User.id == user_id)
        return (await self.db.execute(query)).scalar_one_or_none() is not None

    async def add(self, order: Order) -> None:
        "Добавляет сущность в сессию."
        self.db.add(order)

    async def add_badges(self, badges: list[OrderBadge]) -> None:
        "Добавляет связанные данные."
        self.db.add_all(badges)

    async def delete_badges_by_order(self, order_id: int) -> None:
        "Удаляет сущность."
        await self.db.execute(delete(OrderBadge).where(OrderBadge.order_id == order_id))

    async def delete(self, order: Order) -> None:
        "Удаляет переданную сущность."
        await self.db.delete(order)

    async def flush(self) -> None:
        "Сбрасывает накопленные изменения в БД."
        await self.db.flush()
