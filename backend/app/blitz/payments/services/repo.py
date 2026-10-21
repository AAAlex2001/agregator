"""Запросы к платежам картой. Коммит делает сессия запроса."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.blitz.payments.models import CardPayment
from models.payment import Payment


class CardPaymentRepository:
    """Доступ к blitz_card_payments и общей таблице payments."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_order(self, order_id: int) -> list[CardPayment]:
        """Платежи заявки, старые первыми."""

        stmt = select(CardPayment).where(CardPayment.order_id == order_id).order_by(CardPayment.payment_id)

        return list(await self.db.scalars(stmt))

    async def for_payment(self, payment_id: int) -> CardPayment | None:
        """За какой этап какой заявки этот платёж или None, если он не про Блиц-эксперта."""

        return await self.db.get(CardPayment, payment_id)

    async def add(self, payment: Payment, link: CardPayment) -> None:
        """Записать платёж и его связь с заявкой."""

        self.db.add(payment)
        await self.db.flush()
        link.payment_id = payment.id
        link.payment = payment
        self.db.add(link)
        await self.db.flush()

    async def save(self) -> None:
        """Записать изменения."""

        await self.db.flush()
