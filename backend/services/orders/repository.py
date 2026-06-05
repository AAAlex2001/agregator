
"Repository: доступ к БД для orders."
from sqlalchemy import delete, not_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.order import Order, OrderBadge, OrderStatus
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

    async def list_for_user(
        self,
        skip: int,
        limit: int,
        status_filter: OrderStatus | None,
        user_id: int | None,
    ) -> tuple[list[Order], bool]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        list_query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .order_by(Order.created_at.desc())
        )

        role = await self.get_user_role(user_id) if user_id is not None else None

        if role == UserRole.EXPERT:
            responded = (
                select(OrderResponseModel.id)
                .where(
                    OrderResponseModel.order_id == Order.id,
                    OrderResponseModel.expert_id == user_id,
                )
                .exists()
            )
            list_query = list_query.where(
                Order.status == OrderStatus.ACTIVE,
                Order.assigned_expert_id.is_(None),
                not_(responded),
            )
        elif role == UserRole.CUSTOMER:
            list_query = list_query.where(
                Order.customer_id == user_id,
                Order.status != OrderStatus.ARCHIVED,
            )
        elif user_id is None:
            # Гость видит все заказы платформы (ACTIVE + ARCHIVED) для публичного просмотра.
            pass
        else:
            # Любая другая авторизованная роль (например LICENSE_HOLDER) к списку заказов не допускается.
            return [], False

        if status_filter is not None:
            list_query = list_query.where(Order.status == status_filter)

        return await paginate_with_has_more(self.db, list_query, skip, limit)

    async def search_public(
        self,
        query: str,
        skip: int,
        limit: int,
    ) -> tuple[list[Order], bool]:
        "Поиск по всем заказам платформы (любой статус) для публичного отображения. Ищет по title и company (ILIKE)."
        pattern = f"%{query.strip()}%"
        list_query = (
            select(Order)
            .options(selectinload(Order.badges), selectinload(Order.customer))
            .where((Order.title.ilike(pattern)) | (Order.company.ilike(pattern)))
            .order_by(Order.created_at.desc())
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
