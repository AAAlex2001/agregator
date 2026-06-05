from datetime import UTC, date, datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    JSON,
    BigInteger,
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base

if TYPE_CHECKING:
    from models.chat import Chat
    from models.response import OrderResponse
    from models.user import User


class OrderStatus(str, PyEnum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"

    def __str__(self) -> str:
        labels = {"ACTIVE": "Активен", "COMPLETED": "Завершён", "ARCHIVED": "Архив"}
        return labels.get(self.value, self.value)


class BadgeVariant(str, PyEnum):
    BLUE = "BLUE"
    GREEN = "GREEN"
    GRAY = "GRAY"
    ORANGE = "ORANGE"
    BROWN = "BROWN"

    def __str__(self) -> str:
        labels = {"BLUE": "Синий", "GREEN": "Зелёный", "GRAY": "Серый", "ORANGE": "Оранжевый", "BROWN": "Коричневый"}
        return labels.get(self.value, self.value)


class Order(Base):
    "Заказ от заказчика."
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    company: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    comment: Mapped[str] = mapped_column(Text, nullable=False, default="")
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_expert_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    technical_files: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)
    requires_expert: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
    requires_license: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")
    sum_amount: Mapped[int] = mapped_column(BigInteger, nullable=False)
    deadline: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), nullable=False, index=True, default=OrderStatus.ACTIVE)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    customer: Mapped["User"] = relationship(foreign_keys=[customer_id], back_populates="orders")
    assigned_expert: Mapped["User | None"] = relationship(foreign_keys=[assigned_expert_id], back_populates="assigned_orders")
    badges: Mapped[list["OrderBadge"]] = relationship(back_populates="order", passive_deletes=True)
    responses: Mapped[list["OrderResponse"]] = relationship(back_populates="order", passive_deletes=True)
    chats: Mapped[list["Chat"]] = relationship(back_populates="order", passive_deletes=True)

    def __str__(self) -> str:
        return f"#{self.id} {self.title[:40]}"


class OrderBadge(Base):
    "Бейдж заказа (плашка-метка)."
    __tablename__ = "order_badges"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    text: Mapped[str] = mapped_column(String(50), nullable=False)
    variant: Mapped[BadgeVariant] = mapped_column(Enum(BadgeVariant), nullable=False)

    order: Mapped["Order"] = relationship(back_populates="badges")

    def __str__(self) -> str:
        return f"{self.text} ({str(self.variant)})"
