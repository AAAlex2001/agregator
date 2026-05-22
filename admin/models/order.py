from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Boolean, Column, Integer, BigInteger, String, Text, Date, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship

from models.base import Base


class OrderStatus(str, PyEnum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"

    def __str__(self):
        labels = {"ACTIVE": "Активен", "COMPLETED": "Завершён", "ARCHIVED": "Архив"}
        return labels.get(self.value, self.value)


class BadgeVariant(str, PyEnum):
    BLUE = "BLUE"
    GREEN = "GREEN"
    GRAY = "GRAY"
    ORANGE = "ORANGE"
    BROWN = "BROWN"

    def __str__(self):
        labels = {"BLUE": "Синий", "GREEN": "Зелёный", "GRAY": "Серый", "ORANGE": "Оранжевый", "BROWN": "Коричневый"}
        return labels.get(self.value, self.value)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    company = Column(String(500), nullable=False, default="")
    comment = Column(Text, nullable=False, default="")
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_expert_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    technical_files = Column(JSON, nullable=False, default=list)
    requires_expert = Column(Boolean, nullable=False, default=True, server_default="true")
    requires_license = Column(Boolean, nullable=False, default=True, server_default="true")
    sum_amount = Column(BigInteger, nullable=False)
    deadline = Column(Date, nullable=False)
    status = Column(Enum(OrderStatus), nullable=False, index=True, default=OrderStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    customer = relationship("User", foreign_keys=[customer_id], back_populates="orders")
    assigned_expert = relationship("User", foreign_keys=[assigned_expert_id], back_populates="assigned_orders")
    badges = relationship("OrderBadge", back_populates="order", passive_deletes=True)
    responses = relationship("OrderResponse", back_populates="order", passive_deletes=True)
    chats = relationship("Chat", back_populates="order", passive_deletes=True)

    def __str__(self):
        return f"#{self.id} {self.title[:40]}"


class OrderBadge(Base):
    __tablename__ = "order_badges"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    text = Column(String(50), nullable=False)
    variant = Column(Enum(BadgeVariant), nullable=False)

    order = relationship("Order", back_populates="badges")

    def __str__(self):
        return f"{self.text} ({str(self.variant)})"
