"""Запросы к счетам. Коммит делает сессия запроса."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.blitz.billing.models import Invoice
from app.blitz.orders.models import BlitzOrder

NEWEST_FIRST = (Invoice.created_at.desc(), Invoice.id.desc())


class InvoiceRepository:
    """Доступ к таблице blitz_invoices."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self, invoice_id: int) -> Invoice | None:
        """Счёт по id или None."""

        return await self.db.get(Invoice, invoice_id)

    async def list_for_customer(self, customer_id: int) -> list[Invoice]:
        """Счета заказчика по всем заявкам."""

        stmt = (
            select(Invoice)
            .join(BlitzOrder, BlitzOrder.id == Invoice.order_id)
            .where(BlitzOrder.customer_id == customer_id)
            .order_by(*NEWEST_FIRST)
        )

        return list(await self.db.scalars(stmt))

    async def list_for_admin(self, only_open: bool) -> list[Invoice]:
        """Счета для админки: все или только ждущие оплаты."""

        stmt = select(Invoice).order_by(*NEWEST_FIRST)
        if only_open:
            stmt = stmt.where(Invoice.paid_at.is_(None), Invoice.canceled_at.is_(None))

        return list(await self.db.scalars(stmt))

    async def save(self) -> None:
        """Записать изменения."""

        await self.db.flush()
