"""Цены Блиц-эксперта: тарифы для витрины и история смены цены заявки администратором."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.base import Base
from app.core.clock import now


class Tariff(Base):
    """Ориентир цены по паре «область × объект»: заказчик видит его в форме и может указать свою."""

    __tablename__ = "blitz_tariffs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    area_code: Mapped[str] = mapped_column(String(8))
    object_code: Mapped[str] = mapped_column(String(8))
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now)

    __table_args__ = (UniqueConstraint("area_code", "object_code", name="uq_blitz_tariffs_pair"),)


class PriceChange(Base):
    """Смена цены заявки: было, стало и почему."""

    __tablename__ = "blitz_price_changes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("blitz_orders.id", ondelete="CASCADE"), index=True)
    old_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    new_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    reason: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
