"""Оплата этапа картой: платёж ЮKassa из общей таблицы payments и за какой этап какой заявки он."""

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base
from models.payment import Payment


class CardPayment(Base):
    """Платёж за этап заявки. Оплата по старой ссылке после смены цены тоже засчитывается."""

    __tablename__ = "blitz_card_payments"

    payment_id: Mapped[int] = mapped_column(ForeignKey("payments.id", ondelete="CASCADE"), primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("blitz_orders.id", ondelete="CASCADE"), index=True)
    stage: Mapped[str] = mapped_column(String(8))

    payment: Mapped[Payment] = relationship(lazy="joined")
