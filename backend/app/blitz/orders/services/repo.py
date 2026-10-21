"""Запросы к заявкам Блиц-эксперта. Коммит делает сессия запроса."""

from sqlalchemy import Select, func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.blitz.orders.models import BlitzOrder, OrderStatus
from models.account import Account, UserRole
from models.expert import Expert

NEWEST_FIRST = (BlitzOrder.created_at.desc(), BlitzOrder.id.desc())


class OrderRepository:
    """Доступ к таблице blitz_orders и связанным с ней."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self, order_id: int) -> BlitzOrder | None:
        """Заявка со всеми связями или None."""

        return await self.db.get(BlitzOrder, order_id)

    async def get_for_update(self, order_id: int) -> BlitzOrder | None:
        """Заявка с блокировкой строки до конца запроса: два действия не пройдут одновременно."""

        stmt = (
            select(BlitzOrder)
            .where(BlitzOrder.id == order_id)
            .with_for_update(of=BlitzOrder, key_share=True)
            .execution_options(populate_existing=True)
        )

        return await self.db.scalar(stmt)

    async def list_for_customer(self, customer_id: int) -> list[BlitzOrder]:
        """Заявки заказчика, новые первыми."""

        stmt = select(BlitzOrder).where(BlitzOrder.customer_id == customer_id).order_by(*NEWEST_FIRST)

        return list(await self.db.scalars(stmt))

    async def list_for_expert(self, expert_id: int) -> list[BlitzOrder]:
        """Заявки, которые эксперт взял, новые первыми."""

        stmt = select(BlitzOrder).where(BlitzOrder.expert_id == expert_id).order_by(*NEWEST_FIRST)

        return list(await self.db.scalars(stmt))

    async def list_unassigned(self) -> list[BlitzOrder]:
        """Новые заявки без эксперта: из них эксперт видит подходящие ему."""

        stmt = (
            select(BlitzOrder)
            .where(BlitzOrder.status == OrderStatus.NEW, BlitzOrder.expert_id.is_(None))
            .order_by(*NEWEST_FIRST)
        )

        return list(await self.db.scalars(stmt))

    async def last_for_customer(self, customer_id: int) -> BlitzOrder | None:
        """Последняя заявка заказчика: из неё подставляются реквизиты в новую."""

        stmt = (
            select(BlitzOrder)
            .where(BlitzOrder.customer_id == customer_id)
            .order_by(*NEWEST_FIRST)
            .limit(1)
        )

        return await self.db.scalar(stmt)

    async def list_experts_with_certificates(self) -> list[Account]:
        """Активные эксперты, у которых в анкете есть удостоверения."""

        stmt = (
            select(Account)
            .join(Expert, Expert.account_id == Account.id)
            .where(
                Account.role == UserRole.EXPERT,
                Account.is_active.is_(True),
                Expert.certificates.is_not(None),
            )
        )

        return list(await self.db.scalars(stmt))

    async def get_expert(self, account_id: int) -> Account | None:
        """Активный эксперт по id или None."""

        stmt = select(Account).where(
            Account.id == account_id,
            Account.role == UserRole.EXPERT,
            Account.is_active.is_(True),
        )

        return await self.db.scalar(stmt)

    async def page(
        self,
        statuses: list[OrderStatus],
        limit: int,
        offset: int,
    ) -> tuple[list[BlitzOrder], int]:
        """Страница заявок для админки и сколько их всего. Пустой список статусов — все."""

        stmt: Select[tuple[BlitzOrder]] = select(BlitzOrder)
        if statuses:
            stmt = stmt.where(BlitzOrder.status.in_(statuses))

        total = await self.db.scalar(select(func.count()).select_from(stmt.subquery()))
        items = await self.db.scalars(stmt.order_by(*NEWEST_FIRST).limit(limit).offset(offset))

        return list(items), total or 0

    async def reserve_id(self) -> int:
        """Номер будущей заявки: по нему сразу создаётся папка для файлов."""

        return await self.db.scalar(text("SELECT nextval('blitz_orders_id_seq')"))

    async def add(self, order: BlitzOrder) -> None:
        """Записать новую заявку вместе с реквизитами, файлами и историей."""

        self.db.add(order)
        await self.db.flush()

    async def save(self) -> None:
        """Записать изменения заявки."""

        await self.db.flush()

    async def delete(self, order: BlitzOrder) -> None:
        """Удалить заявку. Связанные строки уходят каскадом."""

        await self.db.delete(order)
        await self.db.flush()
